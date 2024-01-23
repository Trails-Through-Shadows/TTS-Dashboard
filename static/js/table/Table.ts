module Dashboard {

    export class Table {
        private took: number = 0;
        private sort: TableSorter = new TableSorter()
        private url: string = '';
        private page: number = 1;
        private limit: number = 10;

        private onDataLoad: () => void = () => {};
        public setOnDataLoad(onDataLoad: () => void): void {
            this.onDataLoad = onDataLoad;
        }

        constructor(
            private root: HTMLElement,
            private template: string,
            private filter: TableFilter = new TableFilter([]),
            private searchCallback: (search: string) => void = () => {}
        ) {
            this.setupSearch();
        }

        public getFilter(): TableFilter {
            return this.filter;
        }

        public getSorter(): TableSorter {
            return this.sort;
        };

        private setupOrdering() : void {
            if (this.url === '') {
                return;
            }

            const tableHeaders = this.root.querySelectorAll('.orderable');
            tableHeaders.forEach((tableHeader) => {
                this.sort.setup(tableHeader, () => {
                    this.queryData(this.url, this.page, this.limit);
                });
            });
        }

        private setupPagination() : void {
            const pageLinks = this.root.querySelectorAll('.page-link');
            pageLinks.forEach((pageLink) => {
                pageLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    const newPage = pageLink.getAttribute('data-page');

                    // Change url
                    const pageUrl = new URL(window.location.href);
                    pageUrl.searchParams.set('page', newPage);
                    window.history.replaceState({}, '', pageUrl.toString());

                    this.queryData(this.url, parseInt(newPage), this.limit);
                });
            });
        }

        private setupSearch() : void {
            const tableSearchInput = this.root.querySelector('#tableSearchInput');
            const tableFilterButton = this.root.querySelector('#tableFilterButton');

            const modalRoot = document.getElementById('test1');
            const modal = new Dashboard.Modal(modalRoot);

            tableFilterButton.addEventListener('click', (event) => {
                event.preventDefault();

                modal.open();
            });
        }

        public queryData(url: string, page: number, limit: number) : void {
            const currentTime = new Date().getTime();

            this.url = url;
            this.page = Math.max(page, 1);
            this.limit = Math.max(limit, 1);

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;

                    const tableDataElement = this.root.querySelector('#tableDataReplacement');
                    tableDataElement.innerHTML = request.responseText;

                    if (status === 200) {
                        this.took = new Date().getTime() - currentTime;
                        console.log(`Table | Query took ${this.took}ms`);

                        this.setupOrdering();
                        this.setupPagination();
                        this.onDataLoad();
                    } else {
                        console.log(`Table | Query failed with status ${request.status}`);
                    }
                }
            }

            let newUrl = url;
            newUrl += "?page=" + page
            newUrl += "&limit=" + limit
            newUrl += "&filter=" + this.filter.toString()
            newUrl += "&sort=" + this.sort.toString()
            newUrl += "&template=" + this.template

            console.log(`Table | Querying data from ${newUrl}`);
            request.open('GET', newUrl);
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