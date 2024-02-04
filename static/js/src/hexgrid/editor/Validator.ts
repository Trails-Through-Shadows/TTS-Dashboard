module Dashboard {

    export class Validator {
        private valid = false;
        private validating = true;
        private errors: any[] = [];

        private lineHeight = 24;
        private lineWidth = 0;

        private timeout = null;
        private firstTime = true;
        private shouldRunAgain = false;

        constructor(
            private readonly canvas: Canvas,
            private readonly apiUrl: string,
        ) {}

        draw(): void {
            const ctx = this.canvas.getContext();

            // Clear text before drawing
            ctx.clearRect(0, this.canvas.getHeight() - this.lineHeight, this.lineWidth, this.lineHeight);
            this.lineHeight = 24;

            ctx.font = '16px Arial';
            ctx.textAlign = 'left';

            if (this.validating) {
                if (this.shouldRunAgain || (this.firstTime && !this.shouldRunAgain)) {
                    const msg = '⏳❌ Validating interrupted... Waiting...';
                    this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);

                    ctx.fillStyle = Color.ORANGE.toRGB();
                    ctx.fillText(msg, 0, this.canvas.getHeight() - 8);
                } else {
                    const msg = '⏳ Validating part scheme...';
                    this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);

                    ctx.fillStyle = Color.ORANGE.toRGB();
                    ctx.fillText(msg, 0, this.canvas.getHeight() - 8);
                }
            } else {
                if (this.valid) {
                    const msg = '✅ This scheme is valid!';
                    this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);

                    ctx.fillStyle = Color.GREEN.toRGB();
                    ctx.fillText(msg, 0, this.canvas.getHeight() - 8);
                } else {
                    const msg = '❌ This scheme is invalid!';
                    this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);

                    let errorCount = 0;
                    if (this.errors !== undefined) {
                        errorCount = this.errors.length;
                    }

                    ctx.fillStyle = Color.RED.lighten(0.2).toRGB();
                    ctx.fillText(msg, 0, this.canvas.getHeight() - 8 - errorCount * 24);

                    this.errors.forEach((error, index) => {
                        const errorMSG = ' » '+ error['message'];
                        this.lineWidth = Math.max(this.lineWidth, ctx.measureText(errorMSG).width);

                        ctx.fillText(errorMSG, 0, this.canvas.getHeight() - 8 - index * 24);
                        this.lineHeight += 24;
                    });
                }
            }
        }

        requestValidation(data: any, startCall: () => void, callback: (success: boolean, errors: string[]) => void): void {
            if (this.validating && !this.firstTime && !this.shouldRunAgain) {
                startCall();
                this.shouldRunAgain = true;
            }

            function validate(validator: Validator) {
                if (validator.validating && !validator.firstTime) {
                    return;
                }

                console.log(`Validator | Validating data on ${validator.apiUrl}`);
                console.log('- Data: ', data);

                validator.firstTime = false;
                validator.validating = true;
                validator.draw();

                startCall();
                const csrfToken = (document.querySelector('#csrftoken') as HTMLInputElement).value;

                const request = new XMLHttpRequest();
                request.onreadystatechange = () => {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (validator.shouldRunAgain) {
                            validator.shouldRunAgain = false;
                            validator.firstTime = true;
                            console.log(`Validator | Running again...`);
                            validator.requestValidation(data, startCall, callback);
                            return;
                        }

                        if (request.status !== 200) {
                            validator.validating = false;
                            validator.valid = false;
                            validator.errors = [{
                                    'message': 'An unknown error occurred. Please try again later.'
                            }];

                            callback(validator.valid, validator.errors);
                            return;
                        }

                        const jsonResponse = JSON.parse(request.responseText);

                        validator.validating = false;
                        validator.valid = jsonResponse['status'] === 'OK'

                        if (!validator.valid) {
                            validator.errors = jsonResponse['errors'];
                        } else {
                            validator.errors = [];
                        }

                        if (validator.valid) {
                            console.log(`Validator | Data are valid`);
                        } else {
                            console.log(`Validator | Data are invalid`);
                            console.log('- Errors: ', validator.errors);
                        }

                        callback(validator.valid, validator.errors);
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
            return this.valid;
        }

        isValidating(): boolean {
            return this.validating;
        }
    }
}