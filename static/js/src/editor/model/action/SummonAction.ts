module Dashboard {
    export class Summon {

        constructor(
            public id: number,
            public title: string,
            public tag: string,
            public duration: number,
            public health: number,
            public effects: Effect[],
            public action: Action
        ) {}

        public static fromJSON(json: any): Summon {
            let effects: Effect[] = [];
            if (json.effects) {
                for (let effect of json.effects) {
                    effects.push(Effect.fromJSON(effect.effect));
                }
            }

            return new Summon(
                json.id,
                json.title,
                json.tag,
                json.duration,
                json.health,
                effects,
                Action.fromJSON(json.action)
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                title: this.title,
                tag: this.tag,
                duration: this.duration,
                health: this.health,
                effects: this.effects.map(effect => effect.toJSON()),
                actions: this.action.toJSON()
            };
        }

        public toTreeView(): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';
            treeView.innerHTML = `
                <span class="caret">Summon</span>
                <ul class="nested">
                    <li>Title: </li>
                    <li>Tag: ${this.tag}</li>
                    <li>Duration: ${this.duration}</li>
                    <li>Health: ${this.health}</li>
                    <li class="list">
                        <span class="caret">Effects</span>
                        <ul class="nested">
                            ${this.effects.map(effect => {
                                return `
                                    <li class="list-group-item bg-transparent font-small p-0 treeView">
                                        ${effect.toTreeView().innerHTML}
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </li>
                    <li class="list">
                        <span class="caret">Actions</span>
                        <ul class="nested">
                            <li class="list-group-item bg-transparent font-small p-0 treeView">
                                ${this.action.toTreeView().innerHTML}
                            </li>
                        </ul>
                    </li>
                </ul>`;
            return treeView;
        }
    }

    export class SummonAction {

        constructor(
            public summon: Summon,
            public range: number
        ) {}

        public static fromJSON(json: any): SummonAction {
            return new SummonAction(
                Summon.fromJSON(json.summon),
                json.range
            );
        }

        public toJSON(actionId: number): any {
            return {
                id: {
                    idSummon: this.summon.id,
                    idAction: actionId
                },
                summon: this.summon.toJSON(),
                range: this.range
            };
        }

        public toTreeView(): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';
            treeView.innerHTML = `
                <span class="caret">Summon Action</span>
                <ul class="nested">
                    <li>Range: ${this.range}</li>
                    ${this.summon.toTreeView().innerHTML}
                </ul>`;
            return treeView;
        }
    }
}