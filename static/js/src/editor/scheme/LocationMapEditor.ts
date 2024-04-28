module Dashboard {

    export class LocationMapEditor {
        public validator: CanvasValidator;

        constructor(
            private readonly canvas: Canvas,
            private readonly locationMap: LocationMap,
            private readonly partApiURL: string
        ) {
            this.validator = new CanvasValidator(canvas, '/en/api/validate/location/');

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
                this.draw();
            });

            this.canvas.addOnMouseClickListener((x, y, shift) => {
                const hex = this.locationMap.hexGrid.hoveredHex;
                if (this.canvas.isLoading()) return;
                if (!this.canvas.isDrawn()) return;

                if (hex) {
                    let changed: boolean = false

                    // Add Enemy
                    if (!shift && hex.type === "default" && !changed) {
                        window['Sweetalert2'].fire({
                            template: "#locationObjectAdd",
                            // toast: true
                        }).then((result: any) => {
                            if (result.isConfirmed) {
                                const openEnemySearch = (event) => {
                                    const type = event.detail.type;

                                    if (type === 'enemies') {
                                        const enemies = event.detail.data;

                                        for (const enemy of enemies) {
                                            enemy.card.querySelector('button[data-action="add"]').addEventListener('click', (event) => {
                                                event.preventDefault();

                                                enemy.coords = hex.coords;
                                                enemy.partId = this.locationMap.hexGrid.id;
                                                this.locationMap.location.enemies.push(enemy);

                                                hex.type = "enemy";
                                                hex.occupant = enemy;

                                                this.canvas.clear();
                                                this.draw();

                                                window['Sweetalert2'].fire({
                                                    toast: true,
                                                    text: 'Enemy added to ' + '(' + hex.coords.q + ', ' + hex.coords.r + ', ' + hex.coords.s + ')',
                                                    icon: 'success',
                                                    position: 'top-end',
                                                    showConfirmButton: false,
                                                    timer: 2000,
                                                    timerProgressBar: true
                                                });

                                                changed = true;
                                                Dashboard.Modal.closeOpenedModal();
                                            });
                                        }
                                    }
                                }

                                document.addEventListener('searchDataLoaded', openEnemySearch);

                                Modal.openSearch("dungeon/enemies/enemiesSearch.html", "enemies")
                                    .then((modal: Modal) => {
                                        modal.setOnClose(() => {
                                            document.removeEventListener('searchDataLoaded', openEnemySearch);
                                        });
                                    })
                                return;
                            }

                            if (result.isDenied) {
                                const openObstacleSearch = (event) => {
                                    const type = event.detail.type;

                                    if (type === 'entries') {
                                        const entries = event.detail.data;

                                        for (const entry of entries) {
                                            entry.card.querySelector('button[data-action="add"]').addEventListener('click', (event) => {
                                                event.preventDefault();

                                                entry.coords = hex.coords;
                                                entry.partId = this.locationMap.hexGrid.id;
                                                this.locationMap.location.obstacles.push(entry);

                                                hex.type = "obstacle";
                                                hex.occupant = entry;

                                                this.canvas.clear();
                                                this.draw();

                                                window['Sweetalert2'].fire({
                                                    toast: true,
                                                    text: 'Obstacle added to ' + '(' + hex.coords.q + ', ' + hex.coords.r + ', ' + hex.coords.s + ')',
                                                    icon: 'success',
                                                    position: 'top-end',
                                                    showConfirmButton: false,
                                                    timer: 2000,
                                                    timerProgressBar: true
                                                });

                                                changed = true;
                                                Dashboard.Modal.closeOpenedModal();
                                            });
                                        }
                                    }
                                }

                                document.addEventListener('searchDataLoaded', openObstacleSearch);

                                Modal.openSearch("dungeon/obstacles/obstaclesSearch.html", "obstacles")
                                    .then((modal: Modal) => {
                                        modal.setOnClose(() => {
                                            document.removeEventListener('searchDataLoaded', openObstacleSearch);
                                        });
                                    })
                                return;
                            }
                        });
                    }

                    // Remove Enemy
                    if (hex.type === "enemy" && !changed) {
                        const enemy = hex.occupant as Enemy;
                        this.locationMap.location.enemies = this.locationMap.location.enemies.filter(e => e !== enemy);
                        hex.type = "default";
                        changed = true;

                        window['Sweetalert2'].fire({
                            toast: true,
                            text: 'Enemy removed',
                            icon: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true
                        });
                    }

                    // Remove obstacle
                    if (hex.type === "obstacle" && !changed) {
                        const obstacle = hex.occupant as Obstacle;
                        this.locationMap.location.obstacles = this.locationMap.location.obstacles.filter(o => o !== obstacle);
                        hex.type = "default";
                        changed = true;

                        window['Sweetalert2'].fire({
                            toast: true,
                            text: 'Obstacle removed',
                            icon: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true
                        });
                    }

                    // Add Start hex
                    if (shift && hex.type === "default" && !changed) {
                        hex.type = "start";
                        hex.partId = this.locationMap.hexGrid.id;
                        this.locationMap.location.startHexes.push(hex);
                        changed = true;

                        window['Sweetalert2'].fire({
                            toast: true,
                            text: 'Starting hex added',
                            icon: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true
                        });
                    }

                    // Remove Start hex
                    if (shift && hex.type === "start" && !changed) {
                        this.locationMap.location.startHexes = this.locationMap.location.startHexes.filter(h => h !== hex);
                        hex.type = "default";
                        changed = true;

                        window['Sweetalert2'].fire({
                            toast: true,
                            text: 'Starting hex removed',
                            icon: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true
                        });
                    }

                    if (changed) {
                        this.validate();
                        changed = false
                        this.canvas.clear();
                        this.draw();
                    }
                }
            });
        }

        public validate(): void {
            if (this.locationMap.location && this.locationMap.location.parts.length !== 0) {
                this.validator.requestValidation(this.locationMap.location.toJSON(),
                    () => this.validator.draw(),
                    () => this.validator.draw()
                );
            }
        }

        public draw() {
            this.locationMap.hexGrid.draw();
            this.validator.draw();
        }

        public removePart(): void {
            const sweetalert2 = window['Sweetalert2'];
            sweetalert2.fire({
                title: 'Remove Part',
                text: 'Are you sure you want to remove this part?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it!',
                cancelButtonText: 'No, keep it',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.locationMap.hexGrid.active = false;
                    const part = this.locationMap.location.parts.find(p => p.id === this.locationMap.hexGrid.id);

                    for (const grid of this.locationMap.cachedHexGrids) {
                        const toRemove = [];

                        for (const hex of grid.getHexes()) {
                            if (hex.type === 'doors') {
                                const door = hex.occupant as Door;

                                if (door.to.id == part.id || door.from.id == part.id) {
                                    toRemove.push(hex);
                                }
                            }
                        }

                        for (const hex of toRemove) {
                            grid.removeHex(hex);
                        }
                    }
                    this.locationMap.cachedHexGrids = this.locationMap.cachedHexGrids.filter(grid => grid.id !== part.id);
                    this.locationMap.location.doors = this.locationMap.location.doors.filter(d => d.from.id !== part.id && d.to.id !== part.id);
                    this.locationMap.location.enemies = this.locationMap.location.enemies.filter(e => e.partId !== part.id);
                    this.locationMap.location.obstacles = this.locationMap.location.obstacles.filter(o => o.partId !== part.id);
                    this.locationMap.location.parts = this.locationMap.location.parts.filter(p => p !== part);
                    this.locationMap.hexGrid.hoveredHex = null;
                    this.locationMap.hexGrid.selectedHex = null;

                    this.canvas.clear();
                    this.validate();

                    if (this.locationMap.location.parts.length > 0) {
                        this.locationMap.draw();
                    } else {
                        this.canvas.written = false;
                        this.canvas.setLoading(false);
                        this.canvas.title("No parts found", "Add parts to the location");
                    }

                    const locationParts = document.getElementById('locationParts');
                    const partCard = locationParts.querySelector(`[data-id="${part.id}"]`);
                    if (partCard) {
                        partCard.remove();
                    }

                    sweetalert2.fire({
                        toast: true,
                        position: 'top-end',
                        title: 'Part Removed',
                        text: 'The part has been removed.',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true
                    });
                }
            });
        }

        public addPart(): void {
            if (this.locationMap.location.parts.length === 0) {
                const openObstacleSearch = (event) => {
                    const type = event.detail.type;

                    if (type === 'entries') {
                        const entries = event.detail.data;

                        for (const entry of entries) {
                            const card = entry.card.querySelector('button[data-action="add"]');

                            card.addEventListener('click', (event) => {
                                event.preventDefault();
                                const id = card.getAttribute('data-id');

                                const callbackFunc = (grid: HexGrid) => {
                                    part.id = grid.id;
                                    part.title = grid.title;
                                    part.tag = grid.tag;
                                    part.hexes = grid.getHexes();

                                    this.locationMap.location.parts = []
                                    this.locationMap.location.parts.push(part);

                                    window['Sweetalert2'].fire({
                                        toast: true,
                                        text: 'Part added to location',
                                        icon: 'success',
                                        position: 'top-end',
                                        showConfirmButton: false,
                                        timer: 2000,
                                        timerProgressBar: true
                                    });

                                    this.canvas.clear();
                                    this.canvas.setDrawn(true);
                                    this.canvas.setLoading(false);

                                    const hexGrid = new HexGrid(this.canvas, grid.getHexSize(), grid.getHexes());
                                    hexGrid.showCoordinates = false;
                                    hexGrid.id = grid.id;
                                    hexGrid.title = grid.title;
                                    hexGrid.tag = grid.tag;
                                    hexGrid.active = true;

                                    this.locationMap.addPart(part);

                                    this.locationMap.hexGrid = hexGrid;
                                    this.locationMap.cachedHexGrids.push(hexGrid);
                                    this.locationMap.hexGrid.draw();
                                    this.validate();
                                }

                                const part = new Part(parseInt(id), '', '', []);
                                const grid = this.locationMap.loadPart(part, callbackFunc);

                                Dashboard.Modal.closeOpenedModal();
                            });
                        }
                    }
                }

                document.addEventListener('searchDataLoaded', openObstacleSearch);

                Modal.openSearch("dungeon/parts/partsSearch.html", "parts")
                    .then((modal: Modal) => {
                        modal.setOnClose(() => {
                            document.removeEventListener('searchDataLoaded', openObstacleSearch);
                        });
                    })
                return;
            }

            Modal.openSearch("dungeon/parts/partsJoiner.html", "parts")
                .then((modal: Modal) => {
                    modal.setOnOpen(() => {
                        const fromPart = modal.modalContainer.querySelector('#fromPart') as HTMLSelectElement;

                        for (let part of this.locationMap.location.parts) {
                            const option = document.createElement('option') as HTMLOptionElement;
                            option.value = part.id.toString();
                            option.text = `#${part.id} - ${part.title}`;
                            fromPart.appendChild(option);
                        }

                        const leftCoordQ = modal.modalContainer.querySelector('#leftCoordQ') as HTMLInputElement;
                        const leftCoordR = modal.modalContainer.querySelector('#leftCoordR') as HTMLInputElement;
                        const leftCoordS = modal.modalContainer.querySelector('#leftCoordS') as HTMLInputElement;

                        const toPart = modal.modalContainer.querySelector('#toPart') as HTMLSelectElement;

                        // fetch all parts
                        fetch(this.partApiURL.replace("0/", ""))
                            .then(response => response.json())
                            .then(data => {
                                for (let entry of data.entries) {
                                    const option = document.createElement('option') as HTMLOptionElement;
                                    option.value = entry.id.toString();
                                    option.text = `#${entry.id} - ${entry.title}`;
                                    toPart.appendChild(option);
                                }
                            });

                        const rightCoordQ = modal.modalContainer.querySelector('#rightCoordQ') as HTMLInputElement;
                        const rightCoordR = modal.modalContainer.querySelector('#rightCoordR') as HTMLInputElement;
                        const rightCoordS = modal.modalContainer.querySelector('#rightCoordS') as HTMLInputElement;

                        // ---- | Canvas

                        const title = {
                            title: 'No Data',
                            subtitle: 'Please select a part to render.',
                            spacer: 100
                        }

                        // ---- | Canvas to

                        const canvasRootRight = document.getElementById('rightPartCanvas') as HTMLCanvasElement;
                        const toPartCanvas = new Canvas(canvasRootRight, title);

                        toPartCanvas.addOnSizeListener(() => {
                            if (!toPartCanvas.isDrawn() || toPartCanvas.isLoading()) {
                                return;
                            }

                            toPartCanvas.clear();
                            hexGridLeft.draw();
                        });

                        const hexGridRight = new HexGrid(toPartCanvas, this.locationMap.hexGridSize);
                        hexGridRight.draw();

                        toPartCanvas.addOnMouseHoverListener(() => {
                            if (toPartCanvas.isLoading() || !toPartCanvas.isDrawn()) return;
                            const hex = hexGridRight.hoveredHex;

                            if (hex) {
                                if (hex.type == 'placeholder') {
                                    toPartCanvas.setCursor('pointer');
                                } else {
                                    toPartCanvas.setCursor('default');
                                }
                            }
                        });

                        toPartCanvas.addOnMouseClickListener(() => {
                            if (toPartCanvas.isLoading() || !toPartCanvas.isDrawn()) return;
                            const hex = hexGridRight.hoveredHex;

                            if (hex) {
                                if (hex.type == 'placeholder') {
                                    hexGridRight.selectedHex = hex;

                                    rightCoordQ.value = hex.coords.q.toString();
                                    rightCoordR.value = hex.coords.r.toString();
                                    rightCoordS.value = hex.coords.s.toString();

                                    toPartCanvas.clear();
                                    hexGridRight.draw();
                                }
                            }
                        });

                        // ---- | Canvas FROM

                        const canvasRootLeft = document.getElementById('leftPartCanvas') as HTMLCanvasElement;
                        const fromPartCanvas = new Canvas(canvasRootLeft, title);

                        fromPartCanvas.addOnSizeListener(() => {
                            if (!fromPartCanvas.isDrawn() || fromPartCanvas.isLoading()) {
                                return;
                            }

                            fromPartCanvas.clear();
                            hexGridLeft.draw();
                        });

                        const hexGridLeft = new HexGrid(fromPartCanvas, this.locationMap.hexGridSize);
                        hexGridLeft.draw();

                        fromPartCanvas.addOnMouseHoverListener(() => {
                            if (fromPartCanvas.isLoading() || !fromPartCanvas.isDrawn()) return;
                            const hex = hexGridLeft.hoveredHex;

                            if (hex) {
                                if (hex.type == 'placeholder') {
                                    fromPartCanvas.setCursor('pointer');
                                } else {
                                    fromPartCanvas.setCursor('default');
                                }
                            }
                        });

                        fromPartCanvas.addOnMouseClickListener(() => {
                            if (fromPartCanvas.isLoading() || !fromPartCanvas.isDrawn()) return;
                            const hex = hexGridLeft.hoveredHex;

                            if (hex) {
                                if (hex.type == 'placeholder') {
                                    hexGridLeft.selectedHex = hex;

                                    leftCoordQ.value = hex.coords.q.toString();
                                    leftCoordR.value = hex.coords.r.toString();
                                    leftCoordS.value = hex.coords.s.toString();

                                    fromPartCanvas.clear();
                                    hexGridLeft.draw();
                                }
                            }
                        });

                        // ----

                        function setupGrid(locationMap: LocationMap, partApiURL: string, partId: number, grid: HexGrid, gridCanvas: Canvas) {
                            grid.readData(partApiURL.replace("0", ""+ partId), () => {
                                const newHexes = [];

                                for (let hex of grid.getHexes()) {
                                    for (let dirCoord of CubeCoordinate.directions) {
                                        const neighbour = grid.getHexAt(hex.coords.add(dirCoord));

                                        if (!neighbour) {
                                            const h = new Hex(0, hex.coords.add(dirCoord), grid.getHexSize());
                                            h.type = "placeholder";

                                            // add to new hexes if not already in hexes
                                            if (newHexes.findIndex(h => h.coords.equals(hex.coords)) === -1) {
                                                newHexes.push(h);
                                            }
                                        }
                                    }
                                }

                                for (let hex of newHexes) {
                                    grid.addHex(hex);
                                }

                                // Remove duplicate hexes by comparing coordinates
                                const hexes = grid.getHexes();
                                grid.hexes = hexes.filter((hex, index) => {
                                    return hexes.findIndex(h => h.coords.equals(hex.coords)) === index;
                                });

                                if (locationMap != null) {
                                    const doorsOnSelectedHex = locationMap.location.doors.filter(d => d.from.id === partId);
                                    for (let door of doorsOnSelectedHex) {
                                        const doorHex = grid.getHexAt(door.cords);
                                        if (doorHex) {
                                            doorHex.type = 'doors';
                                            doorHex.occupant = door;
                                        }
                                    }
                                }

                                gridCanvas.setLoading(false);
                                gridCanvas.setDrawn(true);
                                gridCanvas.clear();
                                grid.draw();
                            });
                        }

                        fromPart.addEventListener('change', (event) => {
                            const partId = parseInt(fromPart.value);
                            setupGrid(this.locationMap, this.partApiURL, partId, hexGridLeft, fromPartCanvas);
                        });

                        toPart.addEventListener('change', (event) => {
                            const partId = parseInt(toPart.value);
                            setupGrid(null, this.partApiURL, partId, hexGridRight, toPartCanvas);
                        });

                        const finish = (event) => {
                            event.preventDefault();

                            // -- Finish form
                            const doorsCordsFrom: CubeCoordinate = new Dashboard.CubeCoordinate(parseInt(leftCoordQ.value), parseInt(leftCoordR.value), parseInt(leftCoordS.value));
                            const doorsCordsTo: CubeCoordinate = new Dashboard.CubeCoordinate(parseInt(rightCoordQ.value), parseInt(rightCoordR.value), parseInt(rightCoordS.value));

                            const newPart: Part = new Part(hexGridRight.id, hexGridRight.tag, hexGridRight.title, hexGridRight.getHexes().filter(h => h.type !== 'placeholder'));
                            const oldPart: Part = this.locationMap.location.parts.find(p => p.id === parseInt(fromPart.value));

                            const doorsFrom = {
                                from: oldPart,
                                to: newPart,
                                cords: doorsCordsFrom
                            }

                            const doorsTo = {
                                from: newPart,
                                to: oldPart,
                                cords: doorsCordsTo
                            }

                            this.locationMap.location.doors.push(doorsFrom);
                            this.locationMap.location.doors.push(doorsTo);
                            this.locationMap.location.parts.push(newPart);
                            this.locationMap.addPart(newPart);

                            let fromHexGrid = this.locationMap.cachedHexGrids.find(grid => grid.id === oldPart.id);
                            if (!fromHexGrid) {
                                fromHexGrid = this.locationMap.loadPart(oldPart, () => {
                                    const hex = fromHexGrid.addHexAt(doorsCordsFrom);
                                    hex.type = 'doors';
                                    hex.occupant = doorsFrom;
                                });
                            } else {
                                const hex = fromHexGrid.addHexAt(doorsCordsFrom);
                                hex.type = 'doors';
                                hex.occupant = doorsFrom;
                            }

                            this.canvas.clear();
                            this.draw();

                            modal.close();
                        }

                        const addButton = document.getElementById('finishPartJoiner');
                        addButton.addEventListener('click', finish);
                    });
                })
            return;
        }

        public saveData(apiUrl: string, onSuccess?: Function, onFail?: Function): void {
            const currentTime = new Date().getTime();
            const csrfToken = (document.querySelector('#csrftoken') as HTMLInputElement).value;

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const took = new Date().getTime() - currentTime;

                    if (request.status === 200) {
                        console.log(`FormEditor | Data saved in ${took}ms`);
                        if (onSuccess) onSuccess();
                    } else {
                        console.error(`FormEditor | Failed to save data in ${took}ms`);
                        console.error('- Status: ', request.status);
                        console.error('- Response: ', request.responseText);
                        if (onFail) onFail(request.responseText);
                    }
                }
            };

            const object = this.locationMap.location;
            const method = object.id == 0 || object.id == null ? 'POST' : 'PUT';
            const newUrl = object.id == 0 || object.id == null ? apiUrl.replace('/0', '') : apiUrl;

            request.open(method, newUrl, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('X-CSRFToken', csrfToken);
            request.send(JSON.stringify(object.toJSON()));
        }
    }
}