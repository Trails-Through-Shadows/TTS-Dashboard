module Dashboard {

    export class Data {
        private url: string = '';

        constructor(
            private root: HTMLElement,
            private template: string,
        ) {}

        public queryData(url: string): void {
            const currentTime = new Date().getTime();

            const Notiflix = window['Notiflix'];
            Notiflix.Block.circle("#entryDataReplacement", 'Loading...');

            this.url = url;

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;

                    if (status === 200) {
                        const took = new Date().getTime() - currentTime;
                        console.log(`Data | Query took ${took}ms`);

                        const tableDataElement = this.root.querySelector('#entryDataReplacement');
                        tableDataElement.innerHTML = request.responseText;
                    }
                }
            };

            let newUrl = url;
            newUrl += "?template=" + this.template
            newUrl += "&lazy=false"

            console.log(`Data | Querying data from ${this.url}`)
            console.log(`Data |  - Params: ${newUrl.replace(url, '')}`);
            request.open('GET', newUrl, true);
            request.send();
        }
    }
}