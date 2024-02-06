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
        IS = 'is',
    }

    export type Filter = {
        title: string
        key: string,
        type: FilterType,
        bounds?: Bounds | undefined,
        value?: any | undefined,
        hidden?: boolean | false,
    };

    export class TableFilter {

        constructor(
            private readonly filters: Filter[] = []
        ) {
            const pageUrl = new URL(window.location.href);
            this.parse(decodeURIComponent(pageUrl.searchParams.get('filter')));
        }

        public open(submitCallback: Function): void {
            const csrfToken = (document.querySelector('#csrftoken') as HTMLInputElement).value;

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
                        const modalDiv = body.querySelector('#filterModal');
                        const modal = new Modal(modalDiv as HTMLElement, true, true);

                        // Evaluate the script
                        const filterScript = document.querySelector('#filterScript');
                        eval(filterScript.innerHTML);

                        // Add event listener to the form
                        const filterForm = document.querySelector('#filterForm');
                        filterForm.addEventListener('submit', (event: Event) => {
                            event.preventDefault();
                            submit();
                        });

                        // Add event listener to the submit button
                        const filterSubmit = document.querySelector('#filterSubmit');
                        filterSubmit.addEventListener('click', (event: Event) => {
                            event.preventDefault();
                            submit();
                        });

                        // Submit function
                        const submit = () => {

                            // For every filter in this.filters
                            for (const filter of this.filters) {
                                if (filter.hidden) {
                                    continue;
                                }

                                const input = filterForm.querySelector(`#input-${filter.key}`) as HTMLInputElement;
                                let value: number | {} | string = input.value;

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
                            modal.close(true);
                        }

                        modal.open();
                    }
                }
            };

            request.open('POST', '/en/api/filters');
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('X-CSRFToken', csrfToken);
            request.send(JSON.stringify(this));
        }

        public parse(str: string): void {
            if (str == null || str == "null" || str.length === 0) {
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
            this.toString(true) ? pageUrl.searchParams.set('filter', this.toString(true)) : pageUrl.searchParams.delete('filter');
            window.history.replaceState({}, '', pageUrl.toString());
        }

        public get(key: string): any {
            const filter = this.filters.find(filter => filter.key === key);

            if (filter) {
                return filter.value;
            }

            return undefined;
        }

        public set(key: string, value: any): void {
            const filter = this.filters.find(filter => filter.key === key);

            if (filter) {
                filter.value = value === '' ? undefined : value
            }
        }

        public unset(key: string): void {
            const filter = this.filters.find(filter => filter.key === key);

            if (filter) {
                filter.value = undefined;
            }
        }

        public toString(ignoreHidden: boolean = false): string {
            return Array.from(this.filters)
                .filter(f => {
                    // Ignore if value is undefined
                    if (f.value === undefined || f.value == "null") {
                        return false;
                    }

                    // Ignore if hidden
                    if (f.hidden && ignoreHidden) {
                        return false;
                    }

                    // Ignore if value is empty string
                    if (f.type === FilterType.CONTAINS) {
                        return f.value != '';
                    }

                    // Ignore if value is same as bounds
                    if (f.type === FilterType.BETWEEN) {
                        return (f.value.min != f.bounds.min || f.value.max != f.bounds.max);
                    }

                    return true
                }).map(f => {
                    if (f.type === FilterType.BETWEEN) {
                        return `${f.key}:${f.type}:${f.value.min}_${f.value.max}`;
                    }

                    return `${f.key}:${f.type}:${f.value}`;
                }).join(',');
        }

        private clone(): TableFilter {
            return this;
        }
    }
}