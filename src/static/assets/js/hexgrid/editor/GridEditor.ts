module Dashboard {

    export class GridEditor {
        private placeholderHexes: Hex[] = [];
        private hoveredHex: Hex | null = null;

        constructor(
            private readonly canvas: Canvas,
            private readonly hexGrid: HexGrid,
        ) {
            this.canvas.addOnMouseClickListener((x: number, y: number) => {
                const offset: Offset = this.hexGrid.getOffset();

                const coord = Dashboard.CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexGrid.getHexSize());
                const hex = this.hexGrid.getHexes().find(hex => hex.coords.equals(coord));
                let redraw = false;

                if (hex) {
                    if (hex.coords.isZero()) return;

                    this.hexGrid.removeHex(hex);
                    redraw = true;
                } else {
                    const placeholderHex = this.placeholderHexes.find(hex => hex.coords.equals(coord));

                    if (placeholderHex) {
                        this.hexGrid.addHexAt(placeholderHex.coords);
                        redraw = true;
                    }
                }

                if (redraw) {
                    this.calculatePlaceholderHexes();
                    this.canvas.clear();
                    this.draw();
                }
            });

            this.canvas.addOnMouseHoverListener((x: number, y: number) => {
                const offset: Offset = this.hexGrid.getOffset();

                const coord = Dashboard.CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexGrid.getHexSize());
                let hex = this.hexGrid.getHexes().find(hex => hex.coords.equals(coord));

                if (!hex) {
                    hex = this.placeholderHexes.find(hex => hex.coords.equals(coord));
                }

                if (hex) {
                    console.log(hex.coords);
                    this.hoveredHex = hex;
                    this.canvas.setCursor('pointer');
                    this.redraw();
                } else {
                    this.hoveredHex = null;
                    this.canvas.setCursor('default');
                    this.redraw();
                }
            });

            this.calculatePlaceholderHexes();
        }

        private redraw(): void {
            this.canvas.clear();
            this.draw();
        }

        public draw(): void {
            this.canvas.setDrawn();

            const ctx = this.canvas.getContext();
            const offset: Offset = this.hexGrid.getOffset();

            // Draw hexes
            this.placeholderHexes.forEach(hex => {
                let fillColor = Color.DARK_GREY;

                if (this.hoveredHex && this.hoveredHex.coords.equals(hex.coords)) {
                    fillColor = Color.fromHEX('#606060');
                }

                hex.draw(ctx, fillColor, Color.BLACK, offset);
                hex.drawText(ctx, '+', Color.WHITE, offset, 2);
            });

            this.hexGrid.draw();

            // const innerBox = this.hexGrid.getBoundingBox();
            // ctx.strokeStyle = Color.GREEN.toRGB();
            // ctx.strokeRect(offset.x + innerBox.minX, offset.y + innerBox.minY, innerBox.maxX - innerBox.minX, innerBox.maxY - innerBox.minY);
            //
            // const outerBox = this.getBoundingBox();
            // ctx.strokeStyle = Color.RED.toRGB();
            // ctx.strokeRect(offset.x + outerBox.minX, offset.y + outerBox.minY, outerBox.maxX - outerBox.minX, outerBox.maxY - outerBox.minY);
        }

        private calculatePlaceholderHexes(): void {
            const hexGridHexes = this.hexGrid.getHexes();

            this.placeholderHexes = [];
            hexGridHexes.forEach(hex => {
                CubeCoordinate.directions.forEach(direction => {
                    let neighbor = hex.getNeighbor(direction);

                    if (!neighbor) {
                        neighbor = new Hex(hex.coords.add(direction), this.hexGrid.getHexSize(), [hex]);
                    }

                    if (!hexGridHexes.find(hex => hex.coords.equals(neighbor.coords))) {
                        this.placeholderHexes.push(neighbor);
                    }
                });
            });
        }

        private getBoundingBox(): BoundingBox {
            let minX = Infinity,
                maxX = -Infinity,
                minY = Infinity,
                maxY = -Infinity;

            this.placeholderHexes.forEach(hex => {
                const {x, y} = hex.coords.to2D(hex.hexSize);

                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            });

            return {
                minX: minX - this.hexGrid.getHexSize() + 5,
                maxX: maxX + this.hexGrid.getHexSize() - 5,
                minY: minY - this.hexGrid.getHexSize(),
                maxY: maxY + this.hexGrid.getHexSize(),
            };
        }
    }
}