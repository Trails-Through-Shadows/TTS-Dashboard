module Dashboard {

    export class Table {
        private url: string = '';
        private page: number = 1;
        private limit: number = 10;

        private onDataLoad: Function = () => {};
        public setOnDataLoad(onDataLoad: Function): void {
            this.onDataLoad = onDataLoad;
        }

        constructor(
            private root: HTMLElement,
            private template: string,
            private filter: TableFilter,
            private sort: TableSorter,
            private searchCallback: Function
        ) {
            // Setup search input
            const tableSearchInput = this.root.querySelector('.table-search');
            tableSearchInput.addEventListener('keyup', debounce((event) => {
                event.preventDefault();

                const inputVal = (tableSearchInput as HTMLInputElement).value;
                this.searchCallback(inputVal);

                // Update search param in URL
                const pageUrl = new URL(window.location.href);
                inputVal ? pageUrl.searchParams.set('search', inputVal) : pageUrl.searchParams.delete('search');
                window.history.replaceState({}, '', pageUrl.toString());
            }, 300));

            // Setup filter button
            const tableFilterButton = this.root.querySelector('.table-filter');
            tableFilterButton.addEventListener('click', (event) => {
                event.preventDefault();

                this.filter.open(() => {
                    // Update filter param in URL
                    filter.updateURL();

                    this.queryData(this.url, this.page, this.limit);
                });
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
                        const took = new Date().getTime() - currentTime;
                        console.log(`Table | Query took ${took}ms`);

                        // Setup table headers for sorting
                        const tableHeaders = this.root.querySelectorAll('.orderable');
                        tableHeaders.forEach((tableHeader) => {
                            this.sort.setup(tableHeader, () => {
                                this.queryData(this.url, this.page, this.limit);
                            });
                        });

                        // Setup pagination
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

                        this.onDataLoad();
                    } else {
                        console.log(`Table | Query failed with status ${request.status}`);
                    }
                }
            }

            let newUrl = url;
            newUrl += "?page=" + page
            newUrl += "&limit=" + limit
            newUrl += "&template=" + this.template

            if (this.filter.toString() !== '') {
                newUrl += "&filter=" + this.filter.toString()
            }

            if (this.sort.toString() !== '') {
                newUrl += "&sort=" + this.sort.toString()
            }

            console.log(`Table | Querying data from ${newUrl}`);
            request.open('GET', newUrl);
            request.send();
        }

        public setAction(actionType: string, callback: Function) : void {
            const tableActions = this.root.querySelectorAll('.tableActions');

            for (let i = 0; i < tableActions.length; i++) {
                const buttons = tableActions[i].querySelectorAll(`[data-action="${actionType}"]`);

                for (let i = 0; i < buttons.length; i++) {
                    const button = buttons[i];

                    button.addEventListener('click', event => {
                        event.preventDefault();
                        callback(button);
                    });
                }
            }
        }
    }
}