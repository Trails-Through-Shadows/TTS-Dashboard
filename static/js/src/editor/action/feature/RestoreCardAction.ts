module Dashboard {
    export class RestoreCardAction {

        constructor(
            public id: number,
            public numCards: number,
            public target: EffectTarget[],
            public random: boolean
        ) {}

        public static fromJSON(json: any): RestoreCardAction {
            return new RestoreCardAction(
                json.id,
                json.numCards,
                json.target,
                json.random
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                numCards: this.numCards,
                target: this.target,
                random: this.random == null ? 'false' : this.random
            };
        }

        public toTreeView(title: boolean = true): HTMLElement {
            let treeView = document.createElement('li');
            treeView.className = 'list-group-item bg-transparent font-small p-0 px-3 treeView';
            treeView.innerHTML = `
                ${title ? `<span style="font-size: small;" id="treeTitle">Restore Cards:</span>` : ''}
                <span class="caret">Restore Card</span>
                <ul class="nested">
                    <li>Number of Cards: ${this.numCards}</li>
                    <li>Target: ${this.target}</li>
                    <li>Random: ${this.random == null ? 'false' : this.random}</li>
                </ul>`;
            return treeView;
        }
    }
}