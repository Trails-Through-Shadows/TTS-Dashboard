module Dashboard {
    export interface Vertex {
        x: number;
        y: number;
    }

    export class Hex {
        public vertices: Vertex[] = [];

        constructor (
            public readonly hexSize: number = 30,
            public readonly coords: CubeCoordinate,
            public neighbors: Hex[] = []
        ) {
            this.vertices = this.calculateVertices(this.hexSize);
        }

        calculateVertices(hexSize: number): Vertex[] {
            const vertices = [];

            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 3 * i + Math.PI / 6;
                const x = hexSize * Math.cos(angle);
                const y = hexSize * Math.sin(angle);
                vertices.push({x, y});
            }

            return vertices;
        }

        draw(ctx: CanvasRenderingContext2D, fillColor: Color, borderColor: Color, offset: OffsetCoordinate): void {
            const {x, y} = this.coords.to2D(this.hexSize);

            // Draw hex vertices
            ctx.beginPath();
            this.vertices.forEach((edge, index) => {
                if (index === 0) {
                    ctx.moveTo(offset.x + x + edge.x, offset.y + y + edge.y);
                } else {
                    ctx.lineTo(offset.x + x + edge.x, offset.y + y + edge.y);
                }
            });
            ctx.closePath();

            ctx.lineWidth = 1;
            ctx.fillStyle = fillColor.toString();
            ctx.strokeStyle = borderColor.toString();
            ctx.fill();
            ctx.stroke();
        }

        drawWalls(ctx: CanvasRenderingContext2D, wallColor: Color, offset: OffsetCoordinate): void {
            const {x, y} = this.coords.to2D(this.hexSize);

            if (this.neighbors.length != 6) {
                const borderHexes = this.calculateVertices(this.hexSize * 1.2);

                ctx.beginPath();
                borderHexes.forEach((edge, index) => {
                    if (index === 0) {
                        ctx.moveTo(offset.x + x + edge.x, offset.y + y + edge.y);
                    } else {
                        ctx.lineTo(offset.x + x + edge.x, offset.y + y + edge.y);
                    }
                });
                ctx.closePath();

                ctx.fillStyle = wallColor.toHEX();
                ctx.fill();
            }
        }

        drawCoordinates(ctx: CanvasRenderingContext2D, textColor: Color, offset: OffsetCoordinate): void {
            const {x, y} = this.coords.to2D(this.hexSize);

            ctx.fillStyle = textColor.toHEX();
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${this.coords.q}, ${this.coords.r}, ${this.coords.s}`, offset.x + x, offset.y + y);
        }

        getNeighbor(direction: CubeCoordinate): Hex {
            return new Hex(this.hexSize, this.coords.add(direction));
        }
    }
}