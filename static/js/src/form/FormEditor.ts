module Dashboard {

    export class FormEditor<T> {
        private loaded = false;
        private loading = true;

        public object: T = null;

        private onDataLoad: Function = () => {};
        public setOnDataLoad(onDataLoad: Function): void {
            this.onDataLoad = onDataLoad;
        }

        constructor(
            public form: HTMLElement,
            public apiUrl: string,
            public readonly validator: FormValidator<T>
        ) {}

        public queryData(mapping: Function): void {
            const currentTime = new Date().getTime();
            this.loaded = false;
            this.loading = true;

            const Notiflix = window['Notiflix'];
            Notiflix.Block.circle(".formLoading", 'Loading...');

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;

                    if (status === 200) {
                        const took = new Date().getTime() - currentTime;
                        console.log(`FormEditor | Query took ${took}ms`);

                        this.object = mapping(JSON.parse(request.responseText));
                        console.log("FormEditor | Object: ", this.object);

                        Notiflix.Block.remove(".formLoading");
                        this.onDataLoad();

                        this.loaded = true;
                        this.loading = false;
                    } else {
                        // TODO: Show error message
                        console.error(`FormEditor | Query failed with status ${status}`);
                    }
                }
            };

            let newUrl = this.apiUrl;
            newUrl += "?lazy=false"

            console.log(`FormEditor | Querying data from ${this.apiUrl}`)
            console.log(`FormEditor |  - Params: ${newUrl.replace(this.apiUrl, '')}`);
            request.open('GET', newUrl, true);
            request.send();
        }

        public validate() {
            this.validator.requestValidation(this.object);
        }

        public getObject(): any {
            return this.object;
        }

        public isLoaded(): boolean {
            return !this.loading && this.loaded;
        }

        public isLoading(): boolean {
            return this.loading;
        }

        public isValid(): boolean {
            return this.validator.isValid();
        }
    }
}