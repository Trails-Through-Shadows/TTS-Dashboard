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
                    effects.push(Effect.fromJSON(effect.effect));
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
                effects: this.effects.map(effect => {
                    return {
                        key: {
                            idSkill: this.id,
                            idEffect: effect.id
                        },
                        effect: effect.toJSON()
                    }
                }),
                target: this.target
            };
        }

        public toTreeView(title: boolean = true): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';
            treeView.innerHTML = `
                ${title ? `<span style="font-size: small;" id="treeTitle">Skill Action:</span>` : ''}
                <span class="caret">Skill Action</span>
                <ul class="nested">
                    <li>Range: ${this.range}</li>
                    <li>Area: ${this.area}</li>
                    <li>Target: ${this.target}</li>
                    <li class="list">
                        <span style="font-size: small;">Effects:</span>
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