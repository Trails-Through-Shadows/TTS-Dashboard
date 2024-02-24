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
            private search: TableSearch
        ) {
            const notyf = new window['Notyf']({
                position: {
                    x: 'right',
                    y: 'top',
                },
                ripple: true,
                dismissible: true
            });

            // Setup search input
            const tableSearchInput = this.root.querySelector('.table-search');
            tableSearchInput.addEventListener('keyup', debounce((event: Event) => {
                event.preventDefault();

                const inputVal = (tableSearchInput as HTMLInputElement).value;
                this.search.set(inputVal);

                // Update search param in URL
                this.search.updateURL();

                this.queryData(this.url, this.page, this.limit);
            }, 300));

            // Setup filter button
            const tableFilterButton = this.root.querySelector('.table-filter');
            tableFilterButton.addEventListener('click', (event: Event) => {
                event.preventDefault();

                this.filter.open(() => {
                    notyf.success({
                        message: 'Filter set successfully.',
                        duration: 2500,
                    });

                    // Update filter param in URL
                    filter.updateURL();

                    this.queryData(this.url, this.page, this.limit);
                });
            });
        }

        public queryData(url: string, page: number, limit: number, lazy: boolean = true) : void {
            const currentTime = new Date().getTime();

            this.url = url;
            this.page = Math.max(page, 1);
            this.limit = Math.max(limit, 1);

            const Notiflix = window['Notiflix'];
            Notiflix.Block.circle("#tableData", 'Loading...');

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;

                    if (status === 200) {
                        const took = new Date().getTime() - currentTime;
                        console.log(`Table | Query took ${took}ms`);

                        const tableDataElement = this.root.querySelector('#tableDataReplacement');
                        tableDataElement.innerHTML = request.responseText;

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

                        Notiflix.Block.remove("#tableData");
                        this.onDataLoad();
                    } else {
                        // TODO: Show error message
                        console.log(`Table | Query failed with status ${request.status}`);
                    }
                }
            }

            let newUrl = url;
            newUrl += "?page=" + page;
            newUrl += "&limit=" + limit;
            newUrl += "&template=" + this.template;
            newUrl += "&lazy=" + lazy;
            newUrl += this.filter.toString().length > 0 ? "&filter=" + this.filter.toString() : "";
            newUrl += this.sort.toString().length > 0 ? "&sort=" + this.sort.toString() : "";

            console.log(`Table | Querying data from ${url}`);
            console.log(`Table |  - Params: ${newUrl.replace(url, '')}`);
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