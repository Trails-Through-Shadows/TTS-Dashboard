module Dashboard {

    export class GridEditor {
        private placeholderHexes: Hex[] = [];
        private hoveredHex: Hex | null = null;
        private validator: CanvasValidator;

        constructor(
            private readonly canvas: Canvas,
            private readonly hexGrid: HexGrid,
        ) {
            this.validator = new CanvasValidator(canvas, '/en/api/validate/part/');

            this.canvas.addOnMouseClickListener(() => {
                if (this.hoveredHex) {
                    if (this.hoveredHex.coords.isZero()) {
                        return;
                    }

                    if (this.hexGrid.hasHex(this.hoveredHex)) {
                        this.hexGrid.removeHex(this.hoveredHex);
                    } else {
                        this.hexGrid.addHex(this.hoveredHex);
                    }

                    this.validate();
                    this.calculatePlaceholderHexes();
                    this.canvas.clear();
                    this.draw();
                }
            });

            this.canvas.addOnMouseHoverListener((x: number, y: number) => {
                if (this.canvas.isLoading()) {
                    return
                }

                const offset: Offset = this.hexGrid.getOffset();
                const coords = CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexGrid.getHexSize());
                const hex = this.getHexAt(coords);

                // It's the same hex, ignore
                if (this.hoveredHex === hex) {
                    return;
                }

                if (hex) {
                    this.canvas.setCursor('pointer');
                } else {
                    this.canvas.setCursor('default');
                }

                this.hoveredHex = hex;
                this.draw();
            });

            this.calculatePlaceholderHexes();
        }

        public validate(): void {
            this.validator.requestValidation(this.hexGrid.exportData(0),
                () => this.validator.draw(),
                () => this.validator.draw()
            );
        }

        public draw(): void {
            this.canvas.setDrawn();

            const ctx = this.canvas.getContext();
            const offset: Offset = this.hexGrid.getOffset();

            // Draw hexes
            this.placeholderHexes.forEach(hex => {
                let fillColor = Color.DARK_GREY;

                if (this.hoveredHex && this.hoveredHex.coords.equals(hex.coords)) {
                    fillColor = fillColor.lighten(0.2);
                }

                hex.draw(ctx, fillColor, Color.BLACK, offset);
                hex.drawText(ctx, '+', Color.WHITE, offset, 2);
            });

            this.hexGrid.draw();
            this.validator.draw();
        }

        private getHexAt(coords: CubeCoordinate): Hex | null {
            return this.hexGrid.getHexes().find(hex => hex.coords.equals(coords))
                  || this.placeholderHexes.find(hex => hex.coords.equals(coords));
        }

        public calculatePlaceholderHexes(): void {
            const hexGridHexes = this.hexGrid.getHexes();

            this.placeholderHexes = [];
            hexGridHexes.forEach(hex => {
                CubeCoordinate.directions.forEach(direction => {
                    let neighbor = hex.getNeighbor(direction);

                    if (!neighbor) {
                        neighbor = new Hex(null,hex.coords.add(direction), this.hexGrid.getHexSize(), [hex]);
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

        public isValid(): boolean {
            return this.validator.isValid();
        }

        public isValidating(): boolean {
            return this.validator.isValidating();
        }
    }
}