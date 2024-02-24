module Dashboard {

    export class Modal {
        private modalContainer: HTMLElement | null = null;
        private opening: boolean = false;
        private closing: boolean = false;

        private onClose: Function = (): void => {};
        public setOnClose(callback: Function): void {
            this.onClose = callback;
        }

        private onOpen: Function = (): void => {};
        public setOnOpen(callback: Function): void {
            this.onOpen = callback;
        }

        constructor(
            private readonly modal: HTMLElement,
            private closeOnEscape: boolean = true,
            private closeOnBackdrop: boolean = true
        ) {
            this.modalContainer = this.modal.querySelector('.modal-container');

            // Click close button close modal
            const closeButtons = modal.querySelectorAll('.modal-close');
            closeButtons.forEach((closeButton: Element): void => {
                closeButton.addEventListener('click', (): void => {
                    this.close();
                });
            });

            // Click outside modal close modal
            const modalOverlay = modal.querySelector('.modal-overlay');
            document.addEventListener('mousedown', (event: MouseEvent) => {
                if (event.target === modalOverlay && this.closeOnBackdrop) {
                    this.close();
                }
            });

            // Escape key close modal
            document.addEventListener('keydown', (event: KeyboardEvent) => {
                if (event.key === 'Escape' && this.closeOnEscape) {
                    this.close();
                }
            });
        }

        public close(autoRemove: boolean = true): void {
            this.closing = true;
            this.modalContainer.classList.add('animate__animated', 'animate__zoomOut');
            this.modal.style.setProperty('--animate-duration', '0.5s');

            this.modalContainer.addEventListener('animationend', () => {
                if (this.closing) {
                    this.modal.classList.remove('is-open');
                    this.modalContainer.classList.remove('animate__animated', 'animate__zoomOut');
                    this.closing = false;
                    this.onClose();

                    if (autoRemove) {
                        this.modal.remove();
                    }
                }

                this.modalContainer.removeEventListener('animationend', () => {});
            });
        }

        public open(): void {
            this.opening = true;
            this.modal.classList.add('is-open');
            this.modalContainer.classList.add('animate__animated', 'animate__zoomIn');
            this.modal.style.setProperty('--animate-duration', '0.25s');

            this.modalContainer.addEventListener('animationend', () => {
                if (this.opening) {
                    this.modalContainer.classList.remove('animate__animated', 'animate__zoomIn');
                    this.opening = false;
                    this.onOpen();
                }

                this.modalContainer.removeEventListener('animationend', () => {});
            });
        }

        public static openSearch(template: string, table: string, closeOnEscape: boolean = true, closeOnBackdrop: boolean = true): Promise<Modal> {
            const csrfToken = (document.querySelector('#csrftoken') as HTMLInputElement).value;

            return new Promise<Modal>((resolve, reject) => {
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
                            const modal = new Modal(modalDiv as HTMLElement, closeOnEscape, closeOnBackdrop);
                            modal.open();

                            // Evaluate the script
                            const searchScript = document.querySelector('#searchScript');
                            eval(searchScript.innerHTML);

                            resolve(modal);
                        } else {
                            reject();
                        }
                    }
                };

                request.open('POST', `/en/api/modal/${table}`, true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('X-CSRFToken', csrfToken);
                request.send(JSON.stringify({
                    template: template
                }));
            });
        }
    }
}