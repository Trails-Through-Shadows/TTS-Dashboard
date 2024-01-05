module Dashboard {
    export class Color {
        public r: number;
        public g: number;
        public b: number;
        private a: number;

        constructor(r: number, g: number, b: number, a: number = 1) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        toHex(): string {
            return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
        }

        toRGB(): string {
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }

        toRGBA(a: number): string {
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
        }

        static fromHex(hex: string): Color {
            hex = hex.replace('#', '');

            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }

            const [r, g, b] = hex.match(/.{2}/g).map(char => parseInt(char, 16));
            return new Color(r, g, b);
        }
    }
}