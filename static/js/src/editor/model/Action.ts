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
                    ? RestoreCardAction.fromJSON(json.discard)
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
                    : null,
                restoreCards: this.restoreCard
                    ? this.restoreCard.toJSON()
                    : null,
                discard: this.discard,
                levelReq: this.levelReq
            };
        }

        public toCard(collapsed: boolean = false, remove: boolean = false, add: boolean = false): HTMLElement {
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
                            ${this.levelReq || 0}.lvl 
                            
                            ${add ? `<button class="btn btn-sm btn-outline-success ms-1" 
                                data-id="${this.id}" 
                                data-type="action" 
                                data-action="add">
                                
                                <i class="fa-solid fa-plus"></i>
                            </button>` : ''}
                            
                            ${remove ? `<button class="btn btn-sm btn-outline-danger ms-1" 
                                data-id="${this.id}" 
                                data-type="action" 
                                data-action="remove">
                                
                                <i class="fa-solid fa-trash"></i>
                            </button>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="card-body collapse p-0 ${collapsed ? '' : 'show'}" data-bs-parent="#enemyActionsList" id="action${this.id}">
                    <ol class="list-group list-group-numbered py-2" id="actionAttributes">
                    </ol>
                </div>
            `;

            const attributes = card.querySelector('#actionAttributes');

            if (this.description) {
                const span = document.createElement('span');
                span.className = 'mx-1';
                span.innerHTML = this.description;

                attributes.appendChild(this.createListItem('Description:', span));
            }

            if (this.discard) {
                const span = document.createElement('span');
                span.className = 'mx-1';
                span.innerHTML = `${this.discard}`;

                attributes.appendChild(this.createListItem('Discard:', span));
            }

            if (this.movement) {
                attributes.appendChild(this.createListItem('Movement:', this.movement.toTreeView()));
            }

            if (this.skill) {
                attributes.appendChild(this.createListItem('Skill:', this.skill.toTreeView()));
            }

            if (this.attack) {
                attributes.appendChild(this.createListItem('Attack:', this.attack.toTreeView()));
            }

            if (this.summon && this.summon.length > 0) {
                for (let summon of this.summon) {
                    attributes.appendChild(this.createListItem('Summon:', summon.toTreeView()));
                }
            }

            if (this.restoreCard) {
                attributes.appendChild(this.createListItem('Restore Card:', this.restoreCard.toTreeView()));
            }

            return card;
        }

        private createListItem(label: string, value: HTMLElement): HTMLElement {
            const li = document.createElement('li');
            li.className = 'list-group-item bg-transparent font-small p-0 px-3';

            const b = document.createElement('b');
            b.innerHTML = label;
            li.appendChild(b);

            li.appendChild(value);
            return li;
        }

        public toTreeView(): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';

            let caret = document.createElement('span');
            caret.className = 'caret';
            caret.innerHTML = "Click to Expand";
            treeView.appendChild(caret);

            let nested = document.createElement('ul');
            nested.className = 'nested mb-0';
            nested.innerHTML = `
                    <li>Description: ${this.description}</li>
                    <li>Discard: ${this.discard}</li>
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
                        ? this.summon.map(summon => summon.toTreeView().innerHTML).join('') 
                        : ''}
                    ${this.restoreCard 
                        ? this.restoreCard.toTreeView().innerHTML 
                        : ''}
            `;
            treeView.appendChild(nested);

            caret.addEventListener("click", () => {
                console.log("Clicked on caret");

                nested.classList.toggle("active");
                caret.classList.toggle("caret-down");

                // Set title from Expanded to Collapsed
                if (nested.classList.contains("active")) {
                    caret.innerHTML = "Click to Collapse";
                } else {
                    caret.innerHTML = "Click to Expand";
                }
            });

            return treeView;
        }
    }
}