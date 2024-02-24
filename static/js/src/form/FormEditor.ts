module Dashboard {

    export class FormEditor {
        private loaded = false;
        private loading = true;

        public object: any = null;

        constructor(
            public form: HTMLElement,
            public apiUrl: string,
            public readonly validator: FormValidator
        ) {}

        public queryData(mapping: Function, callback?: Function): void {
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

                        this.loaded = true;
                        this.loading = false;

                        if (callback) callback();
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

        public saveData(onSuccess?: Function, onFail?: Function): void {
            const currentTime = new Date().getTime();
            const csrfToken = (document.querySelector('#csrftoken') as HTMLInputElement).value;

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const took = new Date().getTime() - currentTime;

                    if (request.status === 200) {
                        console.log(`FormEditor | Data saved in ${took}ms`);
                        if (onSuccess) onSuccess();
                    } else {
                        console.error(`FormEditor | Failed to save data in ${took}ms`);
                        console.error('- Status: ', request.status);
                        console.error('- Response: ', request.responseText);
                        if (onFail) onFail(request.responseText);
                    }
                }
            };

            request.open(this.object.id == 0 ? 'POST' : 'PUT', this.apiUrl, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('X-CSRFToken', csrfToken);
            request.send(JSON.stringify(this.object));
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