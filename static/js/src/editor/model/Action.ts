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
                json.movement ? MovementAction.fromJSON(json.movement) : null,
                json.skill ? SkillAction.fromJSON(json.skill) : null,
                json.attack ? AttackAction.fromJSON(json.attack) : null,
                json.summonActions.length > 0 ? json.summonActions.map((summon: any) => SummonAction.fromJSON(summon)) : null,
                json.restoreCards ? RestoreCardAction.fromJSON(json.discard) : null,
                json.discard,
                json.levelReq
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                title: this.title,
                description: this.description,
                movement: this.movement ? this.movement.toJSON() : null,
                skill: this.skill ? this.skill.toJSON() : null,
                attack: this.attack ? this.attack.toJSON() : null,
                summonActions: this.summon && this.summon.length > 0 ? this.summon.map(summon => summon.toJSON(this.id)) : null,
                restoreCards: this.restoreCard ? this.restoreCard.toJSON() : null,
                discard: this.discard,
                levelReq: this.levelReq
            };
        }

        public toCard(collapsed: boolean = true): HTMLElement {
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
                            <button class="btn btn-sm btn-outline-danger ms-2" 
                                data-id="${this.id}" 
                                data-type="action" 
                                data-action="remove">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card-body collapse p-0 ${collapsed ? '' : 'show'}" data-bs-parent="#enemyActionsList" id="action${this.id}">
                    <ol class="list-group list-group-numbered py-2">
                        ${this.createListItem('Description:', this.description)}
                        ${this.createListItem('Discard:', `${this.discard}`)}
                        ${this.movement ? this.createListItem('Movement:', this.movement.toTreeView().innerHTML) : ''}
                        ${this.skill ? this.createListItem('Skill:', this.skill.toTreeView().innerHTML) : ''}
                        ${this.attack ? this.createListItem('Attack:', this.attack.toTreeView().innerHTML) : ''}
                        ${this.summon ? this.summon.map(s => this.createListItem('Summon:', s.summon.toTreeView().innerHTML)).join('') : ''}
                        ${this.restoreCard ? this.createListItem('Restore Card:', this.restoreCard.toTreeView().innerHTML) : ''}
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
                <span class="caret">${this.title}</span>
                <ul class="nested">
                    <li>Description: ${this.description}</li>
                    <li>Discard: ${this.discard}</li>
                    ${this.movement ? this.movement.toTreeView().innerHTML : ''}
                    ${this.skill ? this.skill.toTreeView().innerHTML : ''}
                    ${this.attack ? this.attack.toTreeView().innerHTML : ''}
                    ${this.summon && this.summon.length > 0 ? this.summon.map(summon => summon.toTreeView().innerHTML).join('') : ''}
                    ${this.restoreCard ? this.restoreCard.toTreeView().innerHTML : ''}
                </ul>`;
            return treeView;
        }
    }
}