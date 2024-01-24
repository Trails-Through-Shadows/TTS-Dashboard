module Dashboard {

    export class Modal {
        private static pageModals: Modal[] = [];
        private static activeModal: Modal | null = null;
        private modalContainer: HTMLElement | null = null;
        private opening: boolean = false;
        private closing: boolean = false;

        constructor(
            private readonly modal: HTMLElement,
            private closeOnEscape: boolean = true,
            private closeOnBackdrop: boolean = true
        ) {
            this.modalContainer = this.modal.querySelector('.modal-container');
            Modal.pageModals.push(this);

            // Click close button close modal
            const closeButtons = modal.querySelectorAll('.modal-close');
            closeButtons.forEach((closeButton) => {
                closeButton.addEventListener('click', () => {
                    this.close();
                });
            });

            // Click outside modal close modal
            const modalOverlay = modal.querySelector('.modal-overlay');
            document.addEventListener('click', (event) => {
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

        public close(): void {
            this.closing = true;
            this.modalContainer.classList.add('animate__animated', 'animate__zoomOut');
            this.modal.style.setProperty('--animate-duration', '0.5s');

            this.modalContainer.addEventListener('animationend', () => {
                if (this.closing) {
                    this.modal.classList.remove('is-open');
                    this.modalContainer.classList.remove('animate__animated', 'animate__zoomOut');
                    this.closing = false;
                }

                this.modalContainer.removeEventListener('animationend', () => {});
            });
        }

        public open(): void {
            this.opening = true;
            this.modal.classList.add('is-open');
            this.modalContainer.classList.add('animate__animated', 'animate__bounceIn');
            this.modal.style.setProperty('--animate-duration', '0.75s');

            this.modalContainer.addEventListener('animationend', () => {
                if (this.opening) {
                    this.modalContainer.classList.remove('animate__animated', 'animate__bounceIn');
                    this.opening = false;
                }

                this.modalContainer.removeEventListener('animationend', () => {});
            });
        }

        public static closeActiveModal(): void {
            if (Modal.activeModal) {
                Modal.activeModal.close();
            }
        }

        public static openModal(modalId: string): void {
            const modal = Modal.pageModals.find((modal) => modal.modal.id === modalId);

            if (modal) {
                modal.open();
            }
        }
    }
}