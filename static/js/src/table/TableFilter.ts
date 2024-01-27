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

        public open(submitCallback: Callback): void {
            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;

                    if (status === 200) {
                        const htmlContent = request.responseText;

                        // Append the modal to the body
                        const body = document.querySelector('body');
                        body.insertAdjacentHTML('beforeend', htmlContent);

                        // Select modal
                        const modalDiv = body.querySelector('#filterModal') as HTMLDivElement;
                        const modal = new Modal(modalDiv, true, true);
                        modal.setOnClose(() => {
                            modalDiv.remove();
                        });

                        // Evaluate the script
                        const filterScript = document.querySelector('#filterScript') as HTMLScriptElement;
                        eval(filterScript.innerHTML);

                        // Submit function
                        const filterForm = document.querySelector('#filterForm') as HTMLFormElement;
                        const submit = () => {

                            // For every filter in this.filters
                            for (const filter of this.filters) {
                                const input = filterForm.querySelector(`#input-${filter.key}`) as HTMLInputElement;
                                let value: number | {} = input.value;

                                if (filter.type == FilterType.BETWEEN) {
                                    const minValue = input.querySelector(".slider-from") as HTMLInputElement;
                                    const maxValue = input.querySelector(".slider-to") as HTMLInputElement;

                                    value = {
                                        min: minValue.value,
                                        max: maxValue.value
                                    };
                                }

                                filter.value = value
                            }

                            submitCallback();
                            modal.close();
                        }

                        // Add event listener to the submit button
                        const filterSubmit = document.querySelector('#filterSubmit') as HTMLButtonElement;
                        filterSubmit.addEventListener('click', submit);

                        // Add event listener to the form
                        filterForm.addEventListener('submit', (event) => {
                            event.preventDefault();
                            submit();
                        });

                        modal.open();
                    }
                }
            };

            request.open('POST', '/en/api/filters');
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(this));
        }

        public parse(str: string): void {
            if (!str || str.length === 0) {
                return;
            }

            str.split(',').forEach(pair => {
                const [key, type, value] = pair.split(':');
                const filter = this.filters.find(filter => filter.key === key);

                if (!filter) {
                    console.error(`Invalid key ${key} in filter param`);
                    return;
                }

                if (type === FilterType.BETWEEN) {
                    const [min, max] = value.split('_');
                    filter.value = { min, max };
                    return;
                }

                filter.value = value;
            });
        }

        public updateURL(): void {
            const pageUrl = new URL(window.location.href);
            this.toString() ? pageUrl.searchParams.set('filter', this.toString()) : pageUrl.searchParams.delete('filter');
            window.history.replaceState({}, '', pageUrl.toString());
        }

        public set(key: string, value: any): void {
            const filter = this.filters.find(filter => filter.key === key);

            if (filter) {
                if (value === '') {
                    filter.value = undefined;
                    return;
                }

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
            return Array.from(this.filters)
                .filter(f => {
                    if (f.type === FilterType.CONTAINS) {
                        return f.value != undefined && f.value != '';
                    }

                    if (f.type === FilterType.BETWEEN) {
                        return f.value != undefined && (f.value.min != f.bounds.min || f.value.max != f.bounds.max);
                    }

                    return f.value != undefined;
                }).map(filter => {
                    if (filter.type !== FilterType.BETWEEN) {
                        return `${filter.key}:${filter.type}:${filter.value}`;
                    }

                    return `${filter.key}:${filter.type}:${filter.value.min}_${filter.value.max}`;
                }).join(',');
        }
    }
}