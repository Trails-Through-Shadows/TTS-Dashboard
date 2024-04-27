module Dashboard {
    interface ScreenText {
        title: string;
        subtitle: string;
        spacer: number;
    }

    export class Canvas {
        private written = false;
        private loading = false;

        private backgroundImage: any;
        private imageLoaded = false;

        private width: number;
        private height: number;

        private onSizeListeners: Function[] = [];
        public addOnSizeListener(listener: Function): void {
            this.onSizeListeners.push(listener);
        }

        private onMouseHoverListeners: ((x: number, y: number) => void)[] = [];
        public addOnMouseHoverListener(listener: (x: number, y: number) => void): void {
            this.onMouseHoverListeners.push(listener);
        }

        public removeOnMouseHoverListener(listener: (x: number, y: number) => void): void {
            const index = this.onMouseHoverListeners.indexOf(listener);
            if (index > -1) {
                this.onMouseHoverListeners.splice(index, 1);
            }
        }

        private onMouseClickListeners: ((x: number, y: number, shift: boolean) => void)[] = [];
        public addOnMouseClickListener(listener: (x: number, y: number, shift: boolean) => void): void {
            this.onMouseClickListeners.push(listener);
        }

        public removeOnMouseClickListener(listener: (x: number, y: number, shift: boolean) => void): void {
            const index = this.onMouseClickListeners.indexOf(listener);
            if (index > -1) {
                this.onMouseClickListeners.splice(index, 1);
            }
        }

        constructor(
            private readonly canvas: HTMLCanvasElement,
            private def?: ScreenText
        ) {
            this.canvas = canvas;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.resize();

            // Override default screen text
            if (!def) {
                this.def = {
                    title: 'No Data',
                    subtitle: '',
                    spacer: 100
                };
            }

            // Register listeners
            this.registerListeners();
        }

        public setBackgroundImage(src: string, callback?: () => void): void {
            this.backgroundImage = new Image();
            this.backgroundImage.src = src;
            this.backgroundImage.onload = () => {
                this.imageLoaded = true;
                if (callback) callback();
            };
        }

        public title(text: string, subtitle: string): void {
            const ctx = this.getContext();
            ctx.fillStyle = new Dashboard.Color(255, 255, 255, 0.1).toRGB();
            ctx.shadowColor = new Dashboard.Color(0, 0, 0, 0.75).toRGB();
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.font = 'bold 6em Arial';
            ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - this.def.spacer / 2);

            if (subtitle.length > 0) {
                ctx.font = '2em Arial';

                const lines = subtitle.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + this.def.spacer / 2 + i * 30);
                }
            }
        }

        public tooltip(text: string, x: number, y: number): void {
            // Draw tooltip box that will contain the text
            const ctx = this.getContext();
            ctx.fillStyle = new Dashboard.Color(255, 255, 255, 1).toRGB();
            ctx.strokeStyle = new Dashboard.Color(0, 0, 0, 1).toRGB();
            ctx.lineWidth = 1;
            ctx.shadowBlur = 2;

            const padding = 10;
            const width = ctx.measureText(text).width + padding * 2;
            const height = 10 + padding * 2;
            const posX = x - width / 2;
            const posY = y - height - 15;

            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(posX + width, posY);
            ctx.lineTo(posX + width, posY + height);
            ctx.lineTo(posX, posY + height);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();

            // Reset shadow
            ctx.shadowBlur = 0;

            // Draw text
            ctx.fillStyle = new Dashboard.Color(0, 0, 0).toRGB();
            ctx.font = '1em Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y - 30);
        }

        public clear(): void {
            const ctx = this.getContext();
            ctx.clearRect(0, 0, this.width, this.height);

            if (this.imageLoaded) {
                ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
            }
        }

        private counter = 0;
        private draw(): void {
            if (this.loading) {
                this.clear();

                const top = 'Loading';
                const bottom = '□'.repeat(15).split('');
                bottom[this.counter % 15] = '■';
                this.counter = (this.counter + 1) % 15;

                this.title(top, bottom.join(''));
            }
        }

        public resize(width?: number, height?: number): void {
            this.width = width || this.canvas.offsetWidth;
            this.height = height || this.canvas.offsetHeight;

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.draw();
        }

        private registerListeners(): void {
            // Loading animation task repeating every 10ms
            setInterval(() => this.draw(), 100);

            // Window resize observer
            const observer = new ResizeObserver(debounce(() => {
                this.canvas.height = 0;
                this.canvas.height = this.canvas.offsetHeight;

                this.resize();

                if (!this.written && !this.loading) {
                    this.clear();
                    this.title(this.def.title, this.def.subtitle);
                }

                this.onSizeListeners.forEach(listener => listener());
            }, 100));
            observer.observe(this.canvas);

            // Mouse hover listener
            this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                this.onMouseHoverListeners.forEach(listener => listener(x, y));
            });

            // Disable double click selection
            this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
                event.preventDefault();
            });

            // Mouse click listener
            this.canvas.addEventListener('click', (event: MouseEvent) => {
                event.preventDefault();

                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const shift = event.shiftKey;

                this.onMouseClickListeners.forEach(listener => listener(x, y, shift));
            });
        }

        // ------------------------------

        public getContext(): CanvasRenderingContext2D {
            const ctx =  this.canvas.getContext('2d');
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = Color.WHITE.toRGB();
            ctx.strokeStyle = Color.BLACK.toRGB();

            return ctx;
        }

        public setCursor(cursor: string): void {
            this.canvas.style.cursor = cursor;
        }

        public getWidth(): number {
            return this.width;
        }

        public getHeight(): number {
            return this.height;
        }

        public setDrawn(state: boolean = true): void {
            this.written = state;
        }

        public isDrawn(): boolean {
            return this.written;
        }

        public setLoading(loading: boolean): void {
            this.loading = loading;
        }

        public isLoading(): boolean {
            return this.loading;
        }
    }
}