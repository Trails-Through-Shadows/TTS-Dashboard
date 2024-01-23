module Dashboard {

    export class Validator {
        private valid = true;
        private validating = false;
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
                        const errorMSG = ' » '+ error;
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

                const request = new XMLHttpRequest();
                request.open('POST', validator.apiUrl, true);
                request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                request.send(JSON.stringify(data));

                request.onreadystatechange = () => {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        validator.validating = false;
                        validator.valid = request.status === 200;

                        if (!validator.valid) {
                            validator.errors = JSON.parse(request.responseText)['errors'];
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