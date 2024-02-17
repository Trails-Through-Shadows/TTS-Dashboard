module Dashboard {

    export class FormEditor {
        private url: string = '';
        private object = null;

        constructor(
            private root: HTMLElement
        ) {}

        public queryData(url: string, mapping: Function): void {
            const currentTime = new Date().getTime();

            this.url = url;

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;

                    if (status === 200) {
                        const took = new Date().getTime() - currentTime;
                        console.log(`FormEditor | Query took ${took}ms`);

                        this.object = mapping(JSON.parse(request.responseText));
                        console.log("FormEditor | Object: ", this.object);
                    }
                }
            };

            let newUrl = url;
            newUrl += "?lazy=false"

            console.log(`FormEditor | Querying data from ${this.url}`)
            console.log(`FormEditor |  - Params: ${newUrl.replace(url, '')}`);
            request.open('GET', newUrl, true);
            request.send();
        }

        public getObject(): any {
            return this.object;
        }
    }
}