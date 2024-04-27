module Dashboard {

    export class LocationMap {
        public location: Location;
        public hexGrid: HexGrid;
        private readonly cachedHexGrids: HexGrid[] = [];

        constructor(
            private readonly canvas: Canvas,
            private readonly partsList: HTMLElement,
            private readonly partUrl: string,
            private readonly hexGridSize: number = 30,
            private readonly events: boolean = true
        ) {
            this.hexGrid = new HexGrid(canvas, hexGridSize);
            this.hexGrid.showCoordinates = false;

            if (events) {
                let changed = false;
                this.canvas.addOnMouseHoverListener(() => {
                    const hex = this.hexGrid.hoveredHex;
                    if (this.canvas.isLoading()) return;
                    if (!this.canvas.isDrawn()) return;

                    if (changed) {
                        this.canvas.clear();
                        this.hexGrid.draw();
                        changed = false;
                    }

                    if (hex && hex.type != "default" && hex.type != "start") {
                        this.canvas.setCursor('pointer');
                        changed = true;

                        const offset = this.hexGrid.getOffset();
                        const loc = hex.coords.to2D(hexGridSize);

                        if (hex.type === 'enemy') {
                            const enemy = hex.occupant as Enemy;
                            this.canvas.tooltip(enemy.title, loc.x + offset.x, loc.y + offset.y)
                        }

                        if (hex.type === 'obstacle') {
                            const obstacle = hex.occupant as Obstacle;
                            this.canvas.tooltip(obstacle.title, loc.x + offset.x, loc.y + offset.y)
                        }

                        if (hex.type === 'doors') {
                            const door = hex.occupant as Door;
                            this.canvas.tooltip("Click to open", loc.x + offset.x, loc.y + offset.y)
                        }
                    } else {
                        this.canvas.setCursor('default');
                        changed = true;
                    }
                });

                this.canvas.addOnMouseClickListener(() => {
                    const hex = this.hexGrid.hoveredHex;
                    if (this.canvas.isLoading()) return;
                    if (!this.canvas.isDrawn()) return;

                    if (hex) {
                        if (hex.type === 'enemy') {
                            const enemy = hex.occupant as Enemy;
                            window.open("/dungeon/enemies/?open=" + enemy.id, '_blank');
                        } else if (hex.type === 'obstacle') {
                            const obstacle = hex.occupant as Obstacle;
                            window.open("/dungeon/obstacles/?open=" + obstacle.id, '_blank');
                        } else if (hex.type === 'doors') {
                            const door = hex.occupant as Door;
                            this.hexGrid.hoveredHex = null;
                            this.drawPart(door.to);
                        }
                    }
                });
            }
        }

        draw() {
            this.drawPart(this.location.parts[0]);
        }

        drawPart(part: Part) {
            console.log(`LocationMap | Drawing part ${part.id}`);

            // If cached, use it
            const cachedGrid = this.cachedHexGrids.find(grid => grid.id === part.id);
            if (cachedGrid) {
                this.hexGrid.active = false;
                this.hexGrid = cachedGrid;
                this.hexGrid.active = true;

                this.canvas.clear();
                this.hexGrid.draw([]);
            } else {
                this.hexGrid.active = false;
                this.hexGrid = new HexGrid(this.canvas, this.hexGridSize);
                this.hexGrid.showCoordinates = false;

                this.canvas.setLoading(true);
                this.canvas.setDrawn(false);

                this.hexGrid.readData(this.partUrl.replace("0", "" + part.id), () => {
                    for (let startHex of this.location.startHexes) {
                        if (startHex.partId === part.id) {
                            const hex = this.hexGrid.getHexAt(startHex.coords);

                            if (hex) {
                                hex.type = 'start';
                            }
                        }
                    }

                    for (let enemy of this.location.enemies) {
                        if (enemy.partId === part.id) {
                            const hex = this.hexGrid.getHexAt(enemy.coords);

                            if (hex) {
                                hex.type = 'enemy';
                                hex.occupant = enemy;
                            }
                        }
                    }

                    for (let obstacle of this.location.obstacles) {
                        if (obstacle.partId === part.id) {
                            const hex = this.hexGrid.getHexAt(obstacle.coords);

                            if (hex) {
                                hex.type = 'obstacle';
                                hex.occupant = obstacle;
                            }
                        }
                    }

                    for (let door of this.location.doors) {
                        if (door.from.id === part.id) {
                            const doorHex = new Hex(0, door.cords, this.hexGrid.getHexSize());
                            doorHex.type = 'doors';
                            doorHex.occupant = door;

                            this.hexGrid.getHexes().push(doorHex);
                        }
                    }

                    // Remove center hexes
                    this.hexGrid.getHexes().forEach(hex => {
                        if (hex.type === 'center') {
                            hex.type = 'default';
                        }
                    });

                    this.canvas.clear();
                    this.hexGrid.draw([]);

                    console.log(this.hexGrid);
                    this.cachedHexGrids.push(this.hexGrid);
                });
            }
        }

        readData(url: string, callback?: (location: Location) => void): Promise<void> {
            return new Promise((resolve, reject) => {
                this.canvas.setLoading(true);
                const currentTime = new Date().getTime();

                // Clear parts list of elements with class 'locationPart'
                const parts = this.partsList.getElementsByClassName('locationPart');
                while (parts[0]) {
                    parts[0].parentNode.removeChild(parts[0]);
                }

                const request = new XMLHttpRequest();
                request.onreadystatechange = () => {
                    if (request.readyState === 4) {
                        const status = request.status;

                        if (status === 200) {
                            const took = new Date().getTime() - currentTime;
                            console.log(`LocationMap | Query took ${took}ms`);

                            const data = JSON.parse(request.responseText);
                            this.location = Location.fromJSON(data);

                            for (let part of this.location.parts) {
                                const partElement = document.createElement('div');
                                partElement.classList.add('col-auto', 'locationPart');

                                partElement.innerHTML = `
                                    <div class="card card-body border-0 shadow h-100 p-2 hvr-forward pointer bg-gray-200" data-id="${part.id}">
                                        (#${part.id}) ${part.title} <br>
                                        <small>${part.tag}</small>
                                    </div>
                                `;

                                partElement.addEventListener('click', () => {
                                    this.drawPart(part);
                                });

                                this.partsList.insertBefore(partElement, this.partsList.lastElementChild);
                            }

                            if (callback) {
                                callback(this.location);
                            }

                            resolve();
                        } else {
                            reject();
                        }

                        this.canvas.setLoading(false);
                    }
                };

                console.log(`LocationMap | Querying data from ${url}`)
                request.open('GET', url, true);
                request.send();
            });
        }
    }
}