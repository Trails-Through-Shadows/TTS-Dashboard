module Dashboard {
    export class TableFilter {
        private map: Map<Pair<string, string>, string>;

        constructor(list: string[]) {
            this.map = new Map(list.map(pairStr => {
                const [first, second] = pairStr.split(':');
                return [new Pair(first, second), null];
            }));
        }

        public set(key: string, value: string) : void {
            const existingPair = Array.from(this.map.keys())
                .find(pair => pair.getFirst() === key);

            if (existingPair) {
                this.map.set(existingPair, value);
            }
        }

        toString(): string {
            return Array.from(this.map)
                .filter(([_, value]) => value !== null && value !== '')
                .map(([key, value]) => `${key.toString()}:${value}`)
                .join(',') || '';
        }
    }

    export class Table {
        private root: HTMLElement;
        private readonly filter: TableFilter;
        private readonly template: string;

        private onDataLoad: () => void = () => {};
        public setOnDataLoad(onDataLoad: () => void): void {
            this.onDataLoad = onDataLoad;
        }

        constructor(root: HTMLElement, template: string, filter: TableFilter = new TableFilter([])) {
            this.root = root;
            this.template = template;
            this.filter = filter;
        }

        public getFilter(): TableFilter {
            return this.filter;
        }

        public queryData(url: string, page: number, limit: number) : void {
            page = Math.max(page, 1);
            limit = Math.max(limit, 1);

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    const tableDataElement = this.root.querySelector('#tableData');
                    tableDataElement.innerHTML = request.responseText;

                    // Setup pagination
                    const pageLinks = this.root.querySelectorAll('.page-link');
                    for (let i = 0; i < pageLinks.length; i++) {
                        const pageLink = pageLinks[i];

                        pageLink.addEventListener('click', (event) => {
                            event.preventDefault();
                            const newPage = pageLink.getAttribute('data-page');

                            // Change url
                            const pageUrl = new URL(window.location.href);
                            pageUrl.searchParams.set('page', newPage);
                            window.history.replaceState({}, '', pageUrl.toString());

                            this.queryData(url, parseInt(newPage), limit);
                        });
                    }

                    this.onDataLoad();
                }
            }

            request.open('GET', `${url}?page=${page}&limit=${limit}&filter=${this.filter.toString()}&template=${this.template}`);
            request.send();
        }

        public setAction(actionType: string, callback: (event: Event, element: Element) => void) : void {
            const tableActions = this.root.querySelectorAll('#tableActions');

            for (let i = 0; i < tableActions.length; i++) {
                const buttons = tableActions[i].querySelectorAll(`[data-action="${actionType}"]`);

                for (let i = 0; i < buttons.length; i++) {
                    const button = buttons[i];

                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        callback(event, button);
                    });
                }
            }
        }
    }
}