module Dashboard {

    export enum Order {
        ASC = 'asc',
        DESC = 'desc',
        NONE = 'none'
    }

    export class TableSorter {
        private map: Map<string, Order> = new Map();

        constructor() {
            const pageUrl = new URL(window.location.href);
            const sort = pageUrl.searchParams.get('sort');

            if (sort) {
                sort.split(',').forEach(pair => {
                    const [key, value] = pair.split(':');
                    this.map.set(key, value as Order);
                });
            }
        }

        public set(key: string, order: Order) : void {
            this.map.set(key, order);
        }

        public setup(tableHeader: Element, callback: (key: any, newOrder: any) => void) : void {
            const key = tableHeader.getAttribute('data-key');

            if (this.map.get(key) === undefined) {
                if (tableHeader.classList.contains('asc')) {
                    this.map.set(key, Order.ASC);
                } else if (tableHeader.classList.contains('desc')) {
                    this.map.set(key, Order.DESC);
                } else {
                    this.map.set(key, Order.NONE);
                }
            } else {
                if (this.map.get(key) === Order.ASC) {
                    tableHeader.classList.add('asc');
                } else if (this.map.get(key) === Order.DESC) {
                    tableHeader.classList.add('desc');
                }
            }

            tableHeader.addEventListener('click', () => {
                const order = this.map.get(key) || Order.NONE;

                if (order === Order.ASC) {
                    this.map.set(key, Order.DESC);
                    tableHeader.classList.remove('asc');
                    tableHeader.classList.add('desc');
                } else if (order === Order.DESC) {
                    this.map.set(key, Order.NONE);
                    tableHeader.classList.remove('asc', 'desc');
                } else {
                    this.map.set(key, Order.ASC);
                    tableHeader.classList.add('asc');
                    tableHeader.classList.remove('desc');
                }

                // Change url
                const pageUrl = new URL(window.location.href);
                pageUrl.searchParams.set('sort', this.toString());
                window.history.replaceState({}, '', pageUrl.toString());

                callback(key, this.map.get(key));
            });
        }

        toString(): string {
            return Array.from(this.map)
                .filter(([_, value]) => value !== Order.NONE)
                .map(([key, value]) => `${key}:${value}`)
                .join(',') || '';
        }
    }
}