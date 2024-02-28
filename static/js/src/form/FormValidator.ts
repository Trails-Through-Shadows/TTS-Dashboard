module Dashboard {

    export class FormValidator {
        private valid = false;
        private validating = true;
        private errors: any[] = [];

        private timeout = null;
        private firstTime = true;
        private shouldRunAgain = false;

        private onStart: Function = (): void => {};
        public setOnStart(callback: Function): void {
            this.onStart = callback;
        }

        onSuccess: Function = (): void => {};
        public setOnSuccess(callback: Function): void {
            this.onSuccess = callback;
        }

        private onFail: Function = (): void => {};
        public setOnFail(callback: Function): void {
            this.onFail = callback;
        }

        constructor(
            public readonly form: HTMLFormElement,
            public readonly apiUrl: string,
        ) {}

        requestValidation(data: any): void {
            const csrfToken = (document.querySelector('#csrftoken') as HTMLInputElement).value;

            if (this.validating && !this.firstTime && !this.shouldRunAgain) {
                this.onStart();
                this.shouldRunAgain = true;
            }

            function validate(validator: FormValidator) {
                if (validator.validating && !validator.firstTime) {
                    return;
                }

                console.log(`Validator | Validating data on ${validator.apiUrl}`);
                console.log('- Data: ', data);
                // console.log(JSON.stringify(data, null, 2))

                validator.firstTime = false;
                validator.validating = true;
                validator.onStart();

                const request = new XMLHttpRequest();
                request.onreadystatechange = () => {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (validator.shouldRunAgain) {
                            validator.shouldRunAgain = false;
                            validator.firstTime = true;

                            console.log(`Validator | Running again...`);
                            validator.requestValidation(data);
                            return;
                        }

                        if (request.status !== 200) {
                            validator.validating = false;
                            validator.valid = false;
                            validator.errors = [{
                                'message': 'An unknown error occurred. Please try again later.'
                            }];

                            console.log(`Validator | Request failed with status ${request.status}`);

                            if (request.status !== 500) {
                                validator.onFail(validator.errors);
                                return;
                            }

                            validator.onFail([]);
                            return;
                        }

                        const jsonResponse = JSON.parse(request.responseText);

                        validator.validating = false;
                        validator.valid = jsonResponse['status'] === 'OK';

                        if (!validator.valid) {
                            validator.errors = jsonResponse['errors'];
                        } else {
                            validator.errors = [];
                        }

                        if (validator.valid) {
                            console.log(`Validator | Data are valid`);
                            validator.onSuccess();
                        } else {
                            console.log(`Validator | Data are invalid`);
                            console.log('- Errors: ', validator.errors);
                            validator.onFail(validator.errors);
                        }
                    }
                };

                request.open('POST', validator.apiUrl, true);
                request.setRequestHeader('Content-Type', 'application/json;');
                request.setRequestHeader('X-CSRFToken', csrfToken);
                request.send(JSON.stringify(data));
            }

            clearTimeout(this.timeout);
            this.timeout = setTimeout(validate, 500, this);
        }

        isValid(): boolean {
            return !this.validating && this.valid;
        }

        isValidating(): boolean {
            return this.validating;
        }
    }
}