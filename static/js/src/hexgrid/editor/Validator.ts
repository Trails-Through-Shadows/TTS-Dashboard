module Dashboard {

    export class Validator {
        private valid = false;
        private validating = true;
        private errors: string[] = [];

        private lineHeight = 24;
        private lineWidth = 0;

        private timeout = null;

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
                const msg = '⏳ Validating part scheme...';
                this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);

                ctx.fillStyle = Color.ORANGE.toRGB();
                ctx.fillText(msg, 0, this.canvas.getHeight() - 8);
            } else {
                if (this.valid) {
                    const msg = '✅ This scheme is valid!';
                    this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);

                    ctx.fillStyle = Color.GREEN.toRGB();
                    ctx.fillText(msg, 0, this.canvas.getHeight() - 8);
                } else {
                    const msg = '❌ This scheme is invalid!';
                    this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);

                    ctx.fillStyle = Color.RED.lighten(0.2).toRGB();
                    ctx.fillText(msg, 0, this.canvas.getHeight() - 8 - this.errors.length * 24);

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
            function validate(validator: Validator) {
                validator.validating = true;
                validator.draw();

                startCall();
                const csrfToken = (document.querySelector('#csrftoken') as HTMLInputElement).value;

                const request = new XMLHttpRequest();
                request.open('POST', validator.apiUrl, true);
                request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                request.setRequestHeader('X-CSRFToken', csrfToken);
                request.send(JSON.stringify(data));

                request.onreadystatechange = () => {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        const jsonResponse = JSON.parse(request.responseText);

                        validator.validating = false;
                        validator.valid = jsonResponse['status'] === 'OK';

                        if (!validator.valid) {
                            validator.errors = jsonResponse['errors'];
                        } else {
                            validator.errors = [];
                        }

                        callback(validator.valid, validator.errors);
                    }
                };
            }

            clearTimeout(this.timeout);
            this.timeout = setTimeout(validate, 500, this);
        }

        isValid(): boolean {
            return this.valid;
        }
    }

}