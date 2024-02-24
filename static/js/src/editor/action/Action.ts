module Dashboard {

    export enum Discard {
        PERMANENT,
        SHORT_REST,
        LONG_REST,
        NEVER
    }

    export class Action {

        constructor(
            public id: number,
            public title: string,
            public description: string,
            public movement: MovementAction,
            public skill: SkillAction,
            public attack: AttackAction,
            public summon: SummonAction[],
            public restoreCard: RestoreCardAction,
            public discard: Discard,
            public levelReq: number
        ) {}

        public static fromJSON(json: any): Action {
            return new Action(
                json.id,
                json.title,
                json.description,
                json.movement
                    ? MovementAction.fromJSON(json.movement)
                    : null,
                json.skill
                    ? SkillAction.fromJSON(json.skill)
                    : null,
                json.attack
                    ? AttackAction.fromJSON(json.attack)
                    : null,
                json.summonActions && json.summonActions.length > 0
                    ? json.summonActions.map((summon: any) => SummonAction.fromJSON(summon))
                    : null,
                json.restoreCards
                    ? RestoreCardAction.fromJSON(json.restoreCards)
                    : null,
                json.discard,
                json.levelReq
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                title: this.title,
                description: this.description,
                movement: this.movement
                    ? this.movement.toJSON()
                    : null,
                skill: this.skill
                    ? this.skill.toJSON()
                    : null,
                attack: this.attack
                    ? this.attack.toJSON()
                    : null,
                summonActions: this.summon && this.summon.length > 0
                    ? this.summon.map(summon => summon.toJSON(this.id))
                    : [],
                restoreCards: this.restoreCard
                    ? this.restoreCard.toJSON()
                    : null,
                discard: this.discard,
                levelReq: this.levelReq
            };
        }

        public toCard(collapsed: boolean = false, removeCallback: Function = null, addCallback: Function = null): HTMLElement {
            const card = document.createElement('div');
            card.className = 'card bg-gray-100';

            card.innerHTML = `
                <div class="card-header px-3 py-2 pointer sticky-top bg-gray-100" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#action${this.id}" 
                    aria-expanded="true" 
                    aria-controls="#action${this.id}">
                    
                    <div class="row align-items-center">
                        <div class="col-md-8">${this.title}</div>
                        <div class="col-md-4 text-end" id="cardActions">
                            ${this.levelReq ? 
                                `${this.levelReq}.lvl` : ''
                            }
                            
                            ${addCallback ? 
                                `<button class="btn btn-sm btn-outline-success ms-1" 
                                    data-id="${this.id}" 
                                    data-type="action" 
                                    data-action="add">
                                    
                                    <i class="fa-solid fa-plus"></i>
                                </button>` : ''
                            }
                            
                            ${removeCallback ? 
                                `<button class="btn btn-sm btn-outline-danger ms-1" 
                                    data-id="${this.id}" 
                                    data-type="action" 
                                    data-action="remove">
                                    
                                    <i class="fa-solid fa-trash"></i>
                                </button>` : ''
                            }
                        </div>
                    </div>
                </div>
                
                <div class="card-body collapse p-0 ${collapsed ? '' : 'show'}" 
                    data-bs-parent="#enemyActionsList" 
                    id="action${this.id}">
                    
                    <ol class="list-group list-group-numbered py-2" id="actionAttributes">
                        ${this.description ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Description:</b> ${this.description}</li>` : ''
                        }
                        
                        ${this.discard ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Discard:</b> ${this.discard}</li>` : ''
                        }
                        
                        ${this.levelReq ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Level Requirement:</b> ${this.levelReq}</li>` : ''
                        }
                        
                        ${this.movement ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Movement:</b> ${this.movement.toTreeView(false).innerHTML}</li>` : ''
                        }
                        
                        ${this.skill ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Skill:</b> ${this.skill.toTreeView(false).innerHTML}</li>` : ''
                        }
                        
                        ${this.attack ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Attack:</b> ${this.attack.toTreeView(false).innerHTML}</li>` : ''
                        }
                        
                        ${this.summon && this.summon.length > 0 ?
                            this.summon.map(summon => {
                                return `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Summon:</b> ${summon.toTreeView(false).innerHTML}</li>`;
                            }).join('') : ''
                        }
                        
                        ${this.restoreCard ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Restore Card:</b> ${this.restoreCard.toTreeView(false).innerHTML}</li>` : ''
                        }
                    </ol>
                </div>
            `;

            // Add event listener to all carets
            const carets = card.querySelectorAll('.caret');
            for (let i = 0; i < carets.length; i++) {
                carets[i].innerHTML = 'Click to Expand';

                // If carets is empty
                if (carets[i].nextElementSibling.children.length === 0) {
                    carets[i].classList.add('empty');
                    carets[i].innerHTML = 'No Data';
                } else {
                    carets[i].addEventListener('click', () => {
                        const nested = carets[i].nextElementSibling;
                        nested.classList.toggle('active');
                        carets[i].classList.toggle('caret-down');
                        carets[i].innerHTML = nested.classList.contains('active') ? 'Click to Collapse' : 'Click to Expand';
                    });
                }
            }

            const attributes = card.querySelector('#actionAttributes');
            if (attributes.children.length === 0) {
                attributes.insertAdjacentHTML('beforeend', `
                <ul class="nested show active p-0">
                    <li class="bg-transparent font-small text-center">No Data</li>
                </ul>`);
            }

            if (removeCallback) {
                const removeButtons = card.querySelectorAll('[data-action="remove"]');
                removeButtons.forEach((removeButton) => {
                    removeButton.addEventListener('click', (event: Event) => {
                        const id = removeButton.getAttribute('data-id');
                        removeCallback(event, parseInt(id));
                    });
                });
            }

            if (addCallback) {
                const addButtons = card.querySelectorAll('[data-action="add"]');
                addButtons.forEach((addButton) => {
                    addButton.addEventListener('click', (event: Event) => {
                        const id = addButton.getAttribute('data-id');
                        addCallback(event, parseInt(id));
                    });
                });
            }

            return card;
        }

        public toTreeView(): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';

            let caretText = document.createElement('span');
            caretText.style.fontSize = 'small';
            caretText.className = 'me-1';
            caretText.innerHTML = "Action:";
            treeView.appendChild(caretText);

            let caret = document.createElement('span');
            caret.className = 'caret';
            caret.innerHTML = "Click to Expand";
            treeView.appendChild(caret);

            let nested = document.createElement('ul');
            nested.className = 'nested mb-0';
            nested.innerHTML = `
                    <li>Description: ${this.description}</li>
                    <li>Discard: ${this.discard}</li>
                    <li>Level Requirement: ${this.levelReq}</li>
                    ${this.movement 
                        ? this.movement.toTreeView().innerHTML 
                        : ''}
                    ${this.skill 
                        ? this.skill.toTreeView().innerHTML 
                        : ''}
                    ${this.attack 
                        ? this.attack.toTreeView().innerHTML 
                        : ''}
                    ${this.summon && this.summon.length > 0 
                        ? this.summon.map(summon => {
                            let s = summon.toTreeView();
                            s.removeChild(s.firstChild);
                            return s.innerHTML;
                        }).join('') : ''}
                    ${this.restoreCard 
                        ? this.restoreCard.toTreeView().innerHTML 
                        : ''}
            `;
            treeView.appendChild(nested);

            caret.addEventListener("click", () => {
                nested.classList.toggle("active");
                caret.classList.toggle("caret-down");
                caret.innerHTML = nested.classList.contains("active") ? "Click to Collapse" : "Click to Expand";
            });

            return treeView;
        }
    }
}