module Dashboard {

    export class FormEditor {
        private object = null;

        constructor(
            private root: HTMLElement,
        ) {}

        public queryData(url: string, mapping: Function): void {
            const currentTime = new Date().getTime();

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
                    }
                }
            };

            let newUrl = url;
            newUrl += "?lazy=false"

            console.log(`FormEditor | Querying data from ${url}`)
            console.log(`FormEditor |  - Params: ${newUrl.replace(url, '')}`);
            request.open('GET', newUrl, true);
            request.send();
        }

        public validate(url: string, onSuccess: Function, onFail: Function) {

        }

        public getObject(): any {
            return this.object;
        }
    }
}