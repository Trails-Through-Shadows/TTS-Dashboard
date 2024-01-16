module Dashboard {

    export class GridEditor {
        private hexGrid: HexGrid;
        private placeholderHexes: Hex[] = [];

        constructor(
            private canvas: Canvas,
            private hexSize: number
        ) {
            this.hexGrid = new HexGrid(this.canvas, [
                new Hex(hexSize, new Dashboard.CubeCoordinate(0, 0, 0), []),
                new Hex(hexSize, new Dashboard.CubeCoordinate(1, 0, -1), []),
                new Hex(hexSize, new Dashboard.CubeCoordinate(1, -1, 0), []),
                new Hex(hexSize, new Dashboard.CubeCoordinate(0, -1, 1), []),
                new Hex(hexSize, new Dashboard.CubeCoordinate(-1, 0, 1), []),
                new Hex(hexSize, new Dashboard.CubeCoordinate(-1, 1, 0), []),
                new Hex(hexSize, new Dashboard.CubeCoordinate(0, 1, -1), []),
                new Hex(hexSize, new Dashboard.CubeCoordinate(0, 2, -2), []),
            ]);

            this.canvas.setOnMouseClick((x: number, y: number) => {
                this.hexGrid.getHexes().forEach(hex => {
                    const hexPixel = hex.coords.to2D(this.hexSize);
                    const hexPixelX = hexPixel.x + this.canvas.getWidth() / 2;
                    const hexPixelY = hexPixel.y + this.canvas.getHeight() / 2;

                    if (Math.abs(x - hexPixelX) <= this.hexSize && Math.abs(y - hexPixelY) <= this.hexSize) {
                        console.log('Mouse is hovering over hex', hex.coords);
                    }
                });
            });

            this.calculatePlaceholderHexes();
        }

        private calculatePlaceholderHexes(): void {
            const hexGridHexes = this.hexGrid.getHexes();

            const neighborDirections = [
                new Dashboard.CubeCoordinate(1, -1, 0),
                new Dashboard.CubeCoordinate(1, 0, -1),
                new Dashboard.CubeCoordinate(0, 1, -1),
                new Dashboard.CubeCoordinate(-1, 1, 0),
                new Dashboard.CubeCoordinate(-1, 0, 1),
                new Dashboard.CubeCoordinate(0, -1, 1)
            ];

            this.placeholderHexes = [];
            hexGridHexes.forEach(hex => {
                neighborDirections.forEach(direction => {
                    const neighbor = hex.getNeighbor(direction);

                    if (!hexGridHexes.includes(neighbor) && !this.placeholderHexes.includes(neighbor)) {
                        this.placeholderHexes.push(neighbor);
                    }
                });
            });
        }

        public draw(): void {
            this.canvas.setDrawn();

            const ctx = this.canvas.getContext();
            ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());

            const boundingBox: BoundingBox = this.hexGrid.getCorners();
            const offset: OffsetCoordinate = new Dashboard.OffsetCoordinate(
                this.canvas.getWidth() / 2 - ((boundingBox.minX + boundingBox.maxX) / 2),
                this.canvas.getHeight() / 2 - ((boundingBox.minY + boundingBox.maxY) / 2)
            );

            const backgroundColor = new Color(0, 0, 0, 0.05);
            const borderColor = new Color(0, 0, 0);

            // Draw hexes
            for (let i = 0; i < this.placeholderHexes.length; i++) {
                const hex = this.placeholderHexes[i];
                console.log('Drawing placeholder hex', hex);
                hex.draw(ctx, backgroundColor, borderColor, offset);

                // Draw white plus sign in center
                const {x, y} = hex.coords.to2D(this.hexSize);
                const plusSize = this.hexSize / 4;

                ctx.beginPath();
                ctx.moveTo(offset.x + x - plusSize, offset.y + y);
                ctx.lineTo(offset.x + x + plusSize, offset.y + y);
                ctx.moveTo(offset.x + x, offset.y + y - plusSize);
                ctx.lineTo(offset.x + x, offset.y + y + plusSize);
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#FFF';
                ctx.stroke();
            }

            // Draw circle in center
            ctx.beginPath();
            ctx.arc(offset.x, offset.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = '#F00';
            ctx.fill();

            this.hexGrid.draw();
        }
    }
}