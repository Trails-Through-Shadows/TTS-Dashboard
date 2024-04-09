module Dashboard {
    export class AttackAction {

        constructor(
            public id: number,
            public range: number,
            public damage: number,
            public area: number,
            public effects: Effect[],
            public target: EffectTarget,
            public numAttacks: number
        ) {}

        public static fromJSON(json: any): AttackAction {
            let effects: Effect[] = [];
            if (json.effects) {
                for (let effect of json.effects) {
                    effects.push(Effect.fromJSON(effect.effect));
                }
            }

            return new AttackAction(
                json.id,
                json.range,
                json.damage,
                json.area,
                effects,
                json.target,
                json.numAttacks
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                range: this.range,
                damage: this.damage,
                area: this.area,
                effects: this.effects.map(effect => {
                    return {
                        key: {
                            idAttack: this.id,
                            idEffect: effect.id
                        },
                        effect: effect.toJSON()
                    }
                }),
                target: this.target,
                numAttacks: this.numAttacks
            };
        }

        public toTreeView(title: boolean = true): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';
            treeView.innerHTML = `
                ${title ? `<span style="font-size: small;" id="treeTitle">Attack:</span>` : ''}
                <span class="caret">Attack</span>
                <ul class="nested">
                    <li>Range: ${this.range}</li>
                    <li>Damage: ${this.damage}</li>
                    <li>Area: ${this.area}</li>
                    <li>Target: ${this.target}</li>
                    <li>Number of Attacks: ${this.numAttacks}</li>
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
