module Dashboard {

    export type Bounds = { min: number, max: number };

    export enum FilterType {
        CONTAINS = 'has',
        EQUALS = 'eq',
        NOT_EQUALS = 'ne',
        LESS_THAN = 'lt',
        LESS_THAN_OR_EQUAL = 'lte',
        GREATER_THAN = 'gt',
        GREATER_THAN_OR_EQUAL = 'gte',
        BETWEEN = 'bwn',
    }

    export type Filter = {
        title: string
        key: string,
        type: FilterType,
        bounds?: Bounds | undefined,
        value?: any | undefined,
    };

    export class TableFilter {

        constructor(
            private filters: Filter[] = []
        ) {}

        public open(submitFallback: Callback): void {
            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;

                    if (status === 200) {
                        const htmlContent = request.responseText;

                        // Append htmlContent at the end of the body
                        const body = document.querySelector('body');
                        body.insertAdjacentHTML('beforeend', htmlContent);

                        const modalDiv = body.querySelector('#filterModal') as HTMLDivElement;

                        const modal = new Modal(modalDiv, true, true);
                        modal.setOnClose(() => {
                            modalDiv.remove();
                        });

                        const filterScript = document.querySelector('#filterScript') as HTMLScriptElement;
                        eval(filterScript.innerHTML);

                        modal.open();
                    }
                }
            };

            request.open('POST', '/en/api/filters');
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(this));
        }

        public parse(str: string): void {
            // this.filters = str.split(',').map(filter => {
            //     const [key, type, value] = filter.split(':');
            //
            //     return {
            //         key: key,
            //         type: type as FilterType,
            //         value: value
            //     };
            // });
        }

        public set(key: string, value: any): void {
            const filter = this.filters.find(filter => filter.key === key);

            if (filter) {
                filter.value = value;
            }
        }

        public unset(key: string): void {
            const filter = this.filters.find(filter => filter.key === key);

            if (filter) {
                filter.value = undefined;
            }
        }

        toString(): string {
            return Array.from(this.filters).filter(f => f.value != undefined).map(filter => {
                if (filter.bounds === undefined) {
                    return `${filter.key}:${filter.type}:null`;
                }

                return `${filter.key}:${filter.type}:${filter.bounds.min},${filter.bounds.max}`;
            }).join(',');
        }
    }
}