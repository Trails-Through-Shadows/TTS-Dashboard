module Dashboard {
    export class SkillAction {

        constructor(
            public id: number,
            public range: number,
            public area: number,
            public effects: Effect[],
            public target: EffectTarget[]
        ) {}

        public static fromJSON(json: any): SkillAction {
            let effects: Effect[] = [];
            if (json.effects) {
                for (let effect of json.effects) {
                    effects.push(Effect.fromJSON(effect));
                }
            }

            return new SkillAction(
                json.id,
                json.range,
                json.type,
                effects,
                json.target
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                range: this.range,
                area: this.area,
                effects: this.effects.map(effect => effect.toJSON()),
                target: this.target
            };
        }

        public toTreeView(): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';
            treeView.innerHTML = `
                <span class="caret">Skill Action</span>
                <ul class="nested">
                    <li>Range: ${this.range}</li>
                    <li>Area: ${this.area}</li>
                    <li>Target: ${this.target}</li>
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
                </ul>`;
            return treeView;
        }
    }
}