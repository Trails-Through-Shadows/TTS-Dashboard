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
                    effects.push(Effect.fromJSON(effect));
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
                effects: this.effects.map(effect => effect.toJSON()),
                target: this.target,
                numAttacks: this.numAttacks
            };
        }

        public toTreeView(): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';

            let caret = document.createElement('span');
            caret.className = 'caret';
            caret.innerHTML = 'Click to Expand';
            treeView.appendChild(caret);

            let nested = document.createElement('ul');
            nested.className = 'nested mb-0';
            nested.innerHTML = `
                <li>Range: ${this.range}</li>
                <li>Damage: ${this.damage}</li>
                <li>Area: ${this.area}</li>
                <li>Target: ${this.target}</li>
                <li>Number of Attacks: ${this.numAttacks}</li>
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
            `;
            treeView.appendChild(nested);

            // Add event listener to carets
            caret.addEventListener("click", () => {
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