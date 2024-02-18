module Dashboard {

    export class Search {

        constructor(
            private readonly table: string
        ) {}

        public open(template: string, submitCallback: Function): void {
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
                        const modalDiv = body.querySelector('#searchModal');
                        const modal = new Modal(modalDiv as HTMLElement, true, true);
                        modal.open();

                        // Evaluate the script
                        const searchScript = document.querySelector('#searchScript');
                        eval(searchScript.innerHTML);
                    }
                }
            };

            request.open('POST', `/en/api/modal`, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('X-CSRFToken', csrfToken);
            request.send(JSON.stringify({
                table: this.table,
                template: template
            }));
        }
    }
}