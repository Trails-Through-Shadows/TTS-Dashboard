module Dashboard {

    export enum Order {
        ASC = 'asc',
        DESC = 'desc',
        NONE = 'none'
    }

    export type Sort = {
        key: string,
        order?: Order | Order.NONE,
    }

    function next(order: Order): Order {
        if (order === undefined) {
            return Order.ASC;
        }

        switch (order) {
            case Order.ASC:
                return Order.DESC;
            case Order.DESC:
                return Order.NONE;
            case Order.NONE:
                return Order.ASC;
        }
    }

    export class TableSorter {

        constructor(
            private readonly sorts: Sort[] = [],
            private readonly singleOnly: boolean = false
        ) {
            const pageUrl = new URL(window.location.href);
            this.parse(decodeURIComponent(pageUrl.searchParams.get('sort')));
        }

        public setup(tableHeader: Element, clickCallback: Function) : void {
            const key = tableHeader.getAttribute('data-order-key');
            const sort = this.sorts.find(sort => sort.key === key);

            if (!sort) {
                console.error(`Sort key '${key}' is not pre defined!`);
                return;
            }

            switch (sort.order) {
                case Order.ASC:
                    tableHeader.classList.remove('desc')
                    tableHeader.classList.add('asc');
                    break;

                case Order.DESC:
                    tableHeader.classList.add('desc');
                    tableHeader.classList.remove('asc')
                    break;
            }

            tableHeader.addEventListener('click', debounce((event: Event) => {
                event.preventDefault();

                // Set all other keys to NONE if singleOnly is true
                if (this.singleOnly) {
                    this.sorts.forEach(sort => {
                        if (sort.key !== key) {
                            sort.order = Order.NONE;
                        } else {
                            console.log(sort.key);
                            console.log(sort.order);
                            sort.order = next(sort.order);
                            console.log(sort.order);
                        }
                    });
                }

                this.updateURL();
                clickCallback(key, sort.order);
            }, 100));
        }

        private parse(str: string): void {
            if (!str || str == "null" || str.length === 0) {
                return;
            }

            str.split(',').forEach(pair => {
                const [key, value] = pair.split(':');
                const sort = this.sorts.find(filter => filter.key === key);

                if (!sort) {
                    console.error(`Invalid key ${key} in sort param`);
                    return;
                }

                sort.order = value as Order;
            });
        }

        public updateURL(): void {
            const pageUrl = new URL(window.location.href);
            this.toString() ? pageUrl.searchParams.set('sort', this.toString()) : pageUrl.searchParams.delete('sort');
            window.history.replaceState({}, '', pageUrl.toString());
        }

        private set(key: string, order: Order) : void {
            const sort = this.sorts.find(sort => sort.key === key);

            if (sort) {
                sort.order = order;
            }
        }

        private unset(key: string) : void {
            const sort = this.sorts.find(sort => sort.key === key);

            if (sort) {
                sort.order = Order.NONE;
            }
        }

        public toString(): string {
            return Array.from(this.sorts)
                .filter(f => f.order !== Order.NONE && f.order !== undefined)
                .map(f => `${f.key}:${f.order}`)
                .join(',');
        }
    }
}