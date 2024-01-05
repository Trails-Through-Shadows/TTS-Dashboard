module Dashboard {
    export class Canvas {
        private readonly canvas: HTMLCanvasElement;

        private written = false;
        private loading = false;

        private width: number;
        private height: number;

        private onResize: () => void = () => {};
        public setOnResize(onResize: () => void): void {
            this.onResize = onResize;
        }

        private def = {
            title: 'No Data',
            substr: '',
            spacer: 100
        };

        constructor(canvas: HTMLCanvasElement, def?: { title: string, substr: string, spacer: number }) {
            this.canvas = canvas;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.resize();

            if (def) {
                this.def = def;
            }

            // Loading animation task repeating every 10ms
            let counter = 0;
            setInterval(() => {
                if (this.loading) {
                    this.clear();

                    const top = 'Loading';
                    const bottom = '□'.repeat(15).split('');
                    bottom[counter % 15] = '■';
                    counter = (counter + 1) % 15;

                    this.title(top, bottom.join(''));
                }
            }, 100);

            // Resize observer
            const resizeObserver = new ResizeObserver(() => {
                this.resize();

                if (!this.written && !this.loading) {
                    this.title(this.def.title, this.def.substr);
                }

                this.onResize();
            });
            resizeObserver.observe(this.canvas);
        }

        public title(text: string, substr: string): void {
            this.clear();

            const ctx = this.getContext();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.shadowColor = 'rgba(0, 0, 0, 1)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.font = 'bold 6em Arial';
            ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - this.def.spacer / 2);

            if (substr.length > 0) {
                ctx.font = '2em Arial';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';

                const lines = substr.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + this.def.spacer / 2 + i * 30);
                }
            }
        }

        public clear(): void {
            const ctx = this.getContext();
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Reset styles
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        public resize(width?: number, height?:number): void {
            this.width = width || this.canvas.offsetWidth;
            this.height = height || this.canvas.offsetHeight;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        public getContext(): CanvasRenderingContext2D {
            return this.canvas.getContext('2d');
        }

        public getWidth(): number {
            return this.width;
        }

        public getHeight(): number {
            return this.height;
        }

        public setDrawn(): void {
            this.written = true;
        }

        public setLoading(loading: boolean): void {
            this.loading = loading;
        }
    }
}