module Dashboard {

    enum Order {
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