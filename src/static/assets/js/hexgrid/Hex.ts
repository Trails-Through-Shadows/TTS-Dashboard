module Dashboard {
    export interface Edge {
        x: number;
        y: number;
    }

    export interface OffsetCoordinate {
        x: number;
        y: number;
    }

    export interface CubeCoordinate {
        q: number;
        r: number;
        s: number;
    }

    export class Hex {
        private readonly hexSize: number = 30;
        private readonly coordinate: CubeCoordinate;
        private edges: Edge[] = [];

        constructor(hexSize: number, coords: CubeCoordinate) {
            this.hexSize = hexSize;
            this.coordinate = coords;

            this.calculateEdges();
        }

        calculateEdges(): void {
            this.edges = [];

            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 3 * i + Math.PI / 6;
                const x = this.hexSize * Math.cos(angle);
                const y = this.hexSize * Math.sin(angle);
                this.edges.push({x, y});
            }
        }

        cubeTo2D(): OffsetCoordinate {
            const x = this.hexSize * Math.sqrt(3) * (this.coordinate.q + this.coordinate.r / 2);
            const y = this.hexSize * 3 / 2 * this.coordinate.r;
            return {x, y};
        }

        cubeToOffset(): OffsetCoordinate {
            const x = this.coordinate.q + (this.coordinate.r - (this.coordinate.r & 1)) / 2;
            const y = this.coordinate.r;
            return {x, y};
        }

        draw(ctx: CanvasRenderingContext2D, fillColor: Color, borderColor: Color, offset: OffsetCoordinate): void {
            const {x, y} = this.cubeTo2D();

            // Draw hex edges
            ctx.beginPath();
            this.edges.forEach((edge, index) => {
                if (index === 0) {
                    ctx.moveTo(offset.x + x + edge.x, offset.y + y + edge.y);
                } else {
                    ctx.lineTo(offset.x + x + edge.x, offset.y + y + edge.y);
                }
            });
            ctx.closePath();

            ctx.fillStyle = fillColor.toHex();
            ctx.fill();

            // Draw hex border
            ctx.lineWidth = 1;
            ctx.strokeStyle = borderColor.toHex();
            ctx.stroke();
        }

        drawCoordinates(ctx: CanvasRenderingContext2D, textColor: Color, offset: OffsetCoordinate): void {
            const {x, y} = this.cubeTo2D();

            ctx.fillStyle = textColor.toHex();
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${this.coordinate.q}, ${this.coordinate.r}, ${this.coordinate.s}`, offset.x + x, offset.y + y);
        }

        getCoordinate(): CubeCoordinate {
            return this.coordinate;
        }

        getSize(): number {
            return this.hexSize;
        }
    }
}