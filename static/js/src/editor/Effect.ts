module Dashboard {

    export enum EffectType {
        PUSH,
        PULL,
        FORCED_MOVEMENT_RESISTANCE,
        POISON,
        POISON_RESISTANCE,
        FIRE,
        FIRE_RESISTANCE,
        BLEED,
        BLEED_RESISTANCE,
        DISARM,
        DISARM_RESISTANCE,
        ROOT,
        ROOT_RESISTANCE,
        STUN,
        STUN_RESISTANCE,
        CONFUSION,
        CONFUSION_RESISTANCE,
        GUIDANCE,
        INVINCIBILITY,
        SHIELD,
        HEAL,
        REGENERATION,
        EMPOWER,
        ENFEEBLE,
        ENFEEBLE_RESISTANCE,
        SPEED,
        SLOW,
        REACH,
        BONUS_HEALTH,
        BONUS_DEFENCE,
        BONUS_INITIATIVE
    }

    export enum EffectTarget {
        SELF,
        ONE,
        ALL,
        ALL_ENEMIES,
        ALL_ALLIES
    }

    export class Effect {

        constructor(
            public id: number,
            public type: EffectType,
            public description: string,
            public duration: number,
            public strength: number,
            public target: EffectTarget
        ) {}

        public static fromJSON(json: any): Effect {
            return new Effect(
                json.id,
                json.type,
                json.description,
                json.duration,
                json.strength,
                json.target
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                type: this.type,
                description: this.description,
                duration: this.duration,
                strength: this.strength,
                target: this.target
            };
        }

        public toCard(collapsed: boolean = false, removeCallback: Function = null, addCallback: Function = null): HTMLElement {
            const card = document.createElement('div');
            card.className = 'card bg-gray-100';

            card.innerHTML = `
                <div class="card-header px-3 py-2 pointer sticky-top bg-gray-100" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#effect${this.id}" 
                    aria-expanded="true" 
                    aria-controls="#effect${this.id}">
                    
                    <div class="row align-items-center">
                        <div class="col-md-10">${this.type}</div>
                        <div class="col-md-2 text-center">  
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
                
                <div class="card-body collapse p-0 ${collapsed ? '' : 'show'}" data-bs-parent="#enemyEffectsList" id="effect${this.id}">
                    <ol class="list-group list-group-numbered py-2">
                        <li class="list-group-item bg-transparent font-small p-0 px-3"><b>Description:</b> ${this.description}</li>
                        <li class="list-group-item bg-transparent font-small p-0 px-3"><b>Strength:</b> ${this.strength}.lvl</li>
                        <li class="list-group-item bg-transparent font-small p-0 px-3"><b>Duration:</b> ${this.duration} rounds</li>
                        <li class="list-group-item bg-transparent font-small p-0 px-3"><b>Target:</b> ${this.target}</li>
                    </ol>
                </div>`;

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
            caretText.innerHTML = `${this.type}:`;
            treeView.appendChild(caretText);

            let caret = document.createElement('span');
            caret.className = 'caret';
            caret.innerHTML = 'Click to Expand';
            treeView.appendChild(caret);

            let nested = document.createElement('ul');
            nested.className = 'nested mb-0';
            nested.innerHTML = `
                <li>Description: ${this.description}</li>
                <li>Duration: ${this.duration}</li>
                <li>Strength: ${this.strength}</li>
                <li>Target: ${this.target}</li>
            `;
            treeView.appendChild(nested);

            caret.addEventListener('click', () => {
                nested.classList.toggle("active");
                caret.classList.toggle("caret-down");
                caret.innerHTML = nested.classList.contains("active") ? "Click to Collapse" : "Click to Expand";
            });

            return treeView;
        }
    }
}