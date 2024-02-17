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

        public toCard(collapsed: boolean = true): HTMLElement {
            const card = document.createElement('div');
            card.className = 'card bg-gray-100';

            card.innerHTML = `
                <div class="card-header px-3 py-2 pointer sticky-top bg-gray-100" data-bs-toggle="collapse" data-bs-target="#effect${this.id}" aria-expanded="true" aria-controls="#effect${this.id}">
                    <div class="row align-items-center">
                        <div class="col-md-10">${this.type}</div>
                        <div class="col-md-2 text-center">
                            <button class="btn btn-sm btn-outline-danger ms-2" 
                                data-id="${this.id}" 
                                data-type="effect" 
                                data-action="remove">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card-body collapse p-0 ${collapsed ? '' : 'show'}" data-bs-parent="#enemyEffectsList" id="effect${this.id}">
                    <ol class="list-group list-group-numbered py-2">
                        <li class="list-group-item d-flex justify-content-between align-items-start bg-transparent font-small p-0 px-3">
                            <div class="ms-2 me-auto">
                                <div class="fw-bold">Description:</div>
                                ${this.createListItem('Description:', this.description)}
                            </div>
                        </li>
                        ${this.createListItem('Strength:', `${this.strength}.lvl`)}
                        ${this.createListItem('Duration:', `${this.duration} rounds`)}
                        ${this.createListItem('Target:', `${this.target}`)}
                    </ol>
                </div>`;

            return card;
        }

        private createListItem(label: string, value: string): string {
            return `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>${label}</b> ${value}</li>`;
        }

        public toTreeView(): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';

            treeView.innerHTML = `
                <span class="caret">${this.type}</span>
                <ul class="nested">
                    <li>Description: ${this.description}</li>
                    <li>Duration: ${this.duration}</li>
                    <li>Strength: ${this.strength}</li>
                    <li>Target: ${this.target}</li>
                </ul>`;
            return treeView;
        }
    }
}