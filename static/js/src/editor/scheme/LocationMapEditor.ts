module Dashboard {

    export class LocationMapEditor {

        constructor(
            private readonly canvas: Canvas,
            private readonly locationMap: LocationMap,
        ) {
            this.canvas.addOnMouseHoverListener(() => {
                const hex = this.locationMap.hexGrid.hoveredHex;
                if (this.canvas.isLoading()) return;
                if (!this.canvas.isDrawn()) return;

                if (hex) {
                    this.canvas.setCursor('pointer');

                    const offset = this.locationMap.hexGrid.getOffset();
                    const loc = hex.coords.to2D(this.locationMap.hexGrid.getHexSize());

                    if (hex.type === 'enemy') {
                        const enemy = hex.occupant as Enemy;
                        this.canvas.tooltip(enemy.title, loc.x + offset.x, loc.y + offset.y)
                    }

                    if (hex.type === 'obstacle') {
                        const obstacle = hex.occupant as Obstacle;
                        this.canvas.tooltip(obstacle.title, loc.x + offset.x, loc.y + offset.y)
                    }
                } else {
                    this.canvas.setCursor('default');
                }

                this.canvas.clear();
                this.locationMap.hexGrid.draw();
            });

            this.canvas.addOnMouseClickListener((x, y, shift) => {
                const hex = this.locationMap.hexGrid.hoveredHex;
                if (this.canvas.isLoading()) return;
                if (!this.canvas.isDrawn()) return;

                if (hex) {
                    if (hex.type === "start") {
                        this.locationMap.location.startHexes = this.locationMap.location.startHexes.filter(h => h !== hex);
                        hex.type = "default";
                    }

                    if (hex.type === "default") {
                        console.log(shift);

                        // Add start hex
                        if (shift) {
                            console.log("Adding start hex");
                            hex.type = "start";
                            this.locationMap.location.startHexes.push(hex);
                        }
                    }

                    this.canvas.clear();
                    this.locationMap.hexGrid.draw();
                }
            });
        }

        public validate(): void {
            // TODO
        }

        public draw(): void {
            this.canvas.setDrawn();

            this.locationMap.draw();
        }
    }
}