module Dashboard {

    export class Data {

        constructor(
            private root: HTMLElement,
            private template: string,
        ) {}

        public queryData(url: string, lazy: boolean = false, include: [] = []): void {
            const currentTime = new Date().getTime();

            const Notiflix = window['Notiflix'];
            Notiflix.Block.circle("#entryDataReplacement", 'Loading...');

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;

                    if (status === 200) {
                        const took = new Date().getTime() - currentTime;
                        console.log(`Data | Query took ${took}ms`);

                        const tableDataElement = this.root.querySelector('#entryDataReplacement');
                        tableDataElement.innerHTML = request.responseText;

                        // Evaluate the script
                        const dataScript = document.querySelector('#entryDataScript');
                        if (dataScript) {
                            eval(dataScript.innerHTML);
                        }
                    }
                }
            };

            let newUrl = url;
            newUrl += "?template=" + this.template
            newUrl += `&lazy=${lazy}`

            if (include.length > 0) {
                newUrl += `&include=${include.join(',')}`;
            }

            console.log(`Data | Querying data from ${url}`)
            console.log(`Data |  - Params: ${newUrl.replace(url, '')}`);
            request.open('GET', newUrl, true);
            request.send();
        }
    }
}