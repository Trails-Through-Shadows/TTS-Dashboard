module Dashboard {

    export enum Order {
        ASC = 'asc',
        DESC = 'desc',
        NONE = 'none'
    }

    function next(order: Order): Order {
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
        private map: Map<string, Order> = new Map();
        private singleOnly: boolean = false;

        constructor(keys: string[], orders: Order[], singleOnly: boolean) {
            let i = 0;
            keys.forEach(key => {
                this.map.set(key, orders[i++] || Order.NONE);
            });

            const pageUrl = new URL(window.location.href);
            this.parse(pageUrl.searchParams.get('sort'));

            this.singleOnly = singleOnly;
        }

        private parse(str: string): void {
            if (!str || str.length === 0) {
                return;
            }

            str.split(',').forEach(pair => {
                const [key, value] = pair.split(':');

                if (!this.map.has(key)) {
                    console.error(`Invalid key ${key} in sort param`);
                    return;
                }

                this.map.set(key, value as Order);
            });
        }

        private set(key: string, order: Order) : void {
            this.map.set(key, order);
        }

        public setup(tableHeader: Element, callback: (key: any, newOrder: any) => void) : void {
            const key = tableHeader.getAttribute('data-order-key');
            let order: string = this.map.get(key) || undefined;

            if (order == undefined) {
                order = tableHeader.getAttribute('data-order-dir') || Order.NONE;
            }

            this.map.set(key, order as Order);
            tableHeader.setAttribute('data-order-dir', order);
            tableHeader.classList.remove('asc', 'desc');

            switch (order) {
                case Order.ASC:
                    tableHeader.classList.add('asc');
                    break;

                case Order.DESC:
                    tableHeader.classList.add('desc');
                    break;
            }

            tableHeader.addEventListener('click', debounce((event) => {
                event.preventDefault();

                // Set all other keys to NONE if singleOnly is true
                if (this.singleOnly) {
                    this.map.forEach((value, key) => {
                        if (key !== tableHeader.getAttribute('data-order-key')) {
                            this.map.set(key, Order.NONE);
                        }
                    });
                }

                this.map.set(key, next(this.map.get(key)));
                tableHeader.setAttribute('data-order-dir', this.map.get(key) || Order.NONE);

                const sortVal = this.toString();
                callback(key, this.map.get(key));

                // Update sort param in url
                const pageUrl = new URL(window.location.href);
                sortVal ? pageUrl.searchParams.set('sort', sortVal) : pageUrl.searchParams.delete('sort');
                window.history.replaceState({}, '', pageUrl.toString());
            }, 100));
        }

        public toString(): string {
            return Array.from(this.map)
                .filter(([_, value]) => value !== Order.NONE)
                .map(([key, value]) => `${key}:${value}`)
                .join(',') || '';
        }
    }
}