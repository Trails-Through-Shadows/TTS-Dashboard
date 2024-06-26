module Dashboard {
    export enum MovementType {
        WALK,
        JUMP,
        TELEPORT
    }

    export class MovementAction {

        constructor(
            public id: number,
            public range: number,
            public type: MovementType,
            public effects: Effect[]
        ) {}

        public static fromJSON(json: any): MovementAction {
            let effects: Effect[] = [];
            if (json.effects) {
                for (let effect of json.effects) {
                    effects.push(Effect.fromJSON(effect.effect));
                }
            }

            return new MovementAction(
                json.id,
                json.range,
                json.type,
                effects
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                range: this.range,
                type: this.type,
                effects: this.effects.map(effect => {
                    return {
                        key: {
                            idMovement: this.id,
                            idEffect: effect.id
                        },
                        effect: effect.toJSON()
                    }
                }),
            };
        }

        public toTreeView(title: boolean = true): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';
            treeView.innerHTML = `
                ${title ? `<span style="font-size: small;" id="treeTitle">Movement:</span>` : ''}
                <span class="caret">Movement</span>
                <ul class="nested">
                    <li>Range: ${this.range}</li>
                    <li>Type: ${this.type}</li>
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