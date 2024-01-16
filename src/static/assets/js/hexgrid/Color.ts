module Dashboard {
    export class Color {
        constructor (
            public r: number,
            public g: number,
            public b: number,
            private a: number = 1
        ) {}

        toHEX(): string {
            return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
        }

        toRGB(): string {
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }

        toRGBA(): string {
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        }

        toString(): string {
            if (this.a === 1) {
                return this.toHEX();
            }

            return this.toRGBA();
        }

        static fromHEX(hex: string): Color {
            hex = hex.replace('#', '');

            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }

            const [r, g, b] = hex.match(/.{2}/g).map(char => parseInt(char, 16));
            return new Color(r, g, b);
        }
    }
}