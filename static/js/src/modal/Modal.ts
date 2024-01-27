module Dashboard {

    export class Modal {
        private modalContainer: HTMLElement | null = null;
        private opening: boolean = false;
        private closing: boolean = false;

        private onClose: Function = () => {};
        public setOnClose(callback: Function): void {
            this.onClose = callback;
        }

        private onOpen: Function = () => {};
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
            closeButtons.forEach((closeButton) => {
                closeButton.addEventListener('click', () => {
                    this.close();
                });
            });

            // Click outside modal close modal
            const modalOverlay = modal.querySelector('.modal-overlay');
            document.addEventListener('mousedown', (event) => {
                if (event.target === modalOverlay && this.closeOnBackdrop) {
                    this.close();
                }
            });

            // Escape key close modal
            document.addEventListener('keydown', (event) => {
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
    }
}