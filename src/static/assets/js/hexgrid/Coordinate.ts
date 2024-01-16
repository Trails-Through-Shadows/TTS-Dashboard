module Dashboard {
    export class OffsetCoordinate {
        constructor (
            public readonly x: number,
            public readonly y: number,
        ) {}

        /**
         * Converts an offset coordinate to a pixel coordinate.
         */
        toCube(): CubeCoordinate {
            const q = this.x - (this.y - (this.y & 1)) / 2;
            const r = this.y;
            const s = -q - r;
            return new CubeCoordinate(q, r, s);
        }
    }

    export class CubeCoordinate {
        constructor (
            public readonly q: number,
            public readonly r: number,
            public readonly s: number,
        ) {}

        /**
         * Converts a cube coordinate to a pixel coordinate.
         * (q, r, s) -> pixels (x, y)
         * @param hexSize The size of the hexagon
         */
        to2D(hexSize: number): OffsetCoordinate {
            const x = hexSize * Math.sqrt(3) * (this.q + this.r / 2);
            const y = hexSize * 3 / 2 * this.r;
            return new OffsetCoordinate(x, y);
        }

        /**
         * Converts a cube coordinate to an offset coordinate.
         * (q, r, s) -> int (x, y)
         */
        toOffset(): OffsetCoordinate {
            const x = this.q + (this.r - (this.r & 1)) / 2;
            return new OffsetCoordinate(x, this.r);
        }

        isZero(): boolean {
            return this.q === 0 && this.r === 0 && this.s === 0;
        }

        add(other: CubeCoordinate): CubeCoordinate {
            return new CubeCoordinate(this.q + other.q, this.r + other.r, this.s + other.s);
        }

        equals(other: CubeCoordinate): boolean {
            return this.q === other.q && this.r === other.r && this.s === other.s;
        }
    }
}