module Dashboard {

    export interface BoundingBox {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    }

    export class HexGrid {
        public hoveredHex: Hex | null = null;
        public selectedHex: Hex | null = null;

        public id: number = 0;
        public tag: string = '';
        public title: string = '';
        public active: boolean = true;

        private images = {};
        public showCoordinates: boolean = true;

        private staticOffset: Offset = {x: 0, y: 0};
        public setStaticOffset(offset: Offset): void {
           this.staticOffset = offset;
        }

        private mouseHoverListener = (x: number, y: number) => {
            if (this.canvas.isLoading() || !this.active) {
                return
            }

            const offset: Offset = this.getOffset();
            const coords = CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexSize);
            const hex = this.getHexAt(coords);

            // It's the same hex, ignore
            if (this.hoveredHex === hex) {
                return;
            }

            this.hoveredHex = hex;
            this.draw();
        };

        constructor(
            public canvas: Canvas,
            private hexSize: number,
            public hexes: Hex[] = [],
        ) {
            this.canvas.addOnMouseHoverListener(this.mouseHoverListener);
            hexes.forEach(hex => this.mapNeighbors(hex));
            hexes.forEach(hex => hex.partId = this.id);
        }

        public destruct(): void {
            console.log('HexGrid | Destructing ', this.id);
            this.canvas.removeOnMouseHoverListener(this.mouseHoverListener);
        }

        readData(url: string, callback?: () => void): Promise<void> {
            return new Promise((resolve, reject) => {
                this.canvas.setLoading(true);
                const currentTime = new Date().getTime();

                const request = new XMLHttpRequest();
                request.onreadystatechange = () => {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            const data = JSON.parse(request.responseText);

                            // Map attributes
                            this.id = data['id'];
                            this.tag = data['tag'];
                            this.title = data['title'];

                            // Map hexes
                            this.hexes = data['hexes'].map(({key, q, r, s}) => {
                                const cords = new CubeCoordinate(q, r, s);

                                const hex = new Hex(key.id,cords, this.hexSize, []);
                                hex.type = cords.isZero() ? 'center' : 'default';

                                return hex;
                            })

                            // Map hex neighbors
                            this.hexes.forEach(hex => this.mapNeighbors(hex));

                            const took = new Date().getTime() - currentTime;
                            console.log(`HexGrid | Data read in ${took}ms`);
                            this.canvas.setLoading(false);
                            this.canvas.setDrawn();

                            if (callback) callback();
                            resolve();
                        } else {
                            console.error('Failed to load data');
                            reject();
                        }
                    }
                };

                console.log(`HexGrid | Reading data from ${url}`);
                request.open('GET', url, true);
                request.send();
            });
        }

        exportData(id: number): {} {
            return {
                id: id,
                tag: this.tag,
                title: this.title,
                hexes: this.hexes.map((hex, index) => {
                    return {
                        key: {
                            idPart: id,
                            id: index,
                        },
                        q: hex.coords.q,
                        r: hex.coords.r,
                        s: hex.coords.s,
                    };
                }),
            };
        }

        saveData(url: string, success?: Function, fail?: Function): void {
            const currentTime = new Date().getTime();
            const csrfToken = (document.querySelector('#csrftoken') as HTMLInputElement).value;

            const data = this.exportData(this.id);

            console.log(`HexGrid | Saving data to ${url}`);
            console.log('- Data: ', data);

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const took = new Date().getTime() - currentTime;

                    if (request.status === 200) {
                        console.log(`HexGrid | Data saved in ${took}ms`);
                        if (success) success();
                    } else {
                        console.error(`HexGrid | Failed to save data in ${took}ms`);
                        console.error('- Status: ', request.status);
                        console.error('- Response: ', request.responseText);
                        if (fail) fail(request.responseText);
                    }
                }
            };

            request.open(this.id == 0 ? 'POST' : 'PUT', url, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('X-CSRFToken', csrfToken);
            request.send(JSON.stringify(data));
        }

        reset(): void {
            this.id = 0;
            this.tag = '';
            this.title = '';
            this.hexes = [];

            this.canvas.setDrawn(false);
        }

        draw(doors: Hex[] = []): void {
            if (this.hexes.length === 0) return;
            const offset: Offset = this.getOffset();

            // Draw placeholder hexes
            const placeholderHexes = this.hexes.filter(hex => hex.type === 'placeholder');
            placeholderHexes.forEach(hex => {
                let fillColor = Color.DARK_GREY;
                let textColor = Color.WHITE;
                const borderColor = Color.BLACK;

                if (this.selectedHex && this.selectedHex.coords.equals(hex.coords)) {
                    fillColor = Color.PURPLE.lighten(0.40);
                    textColor = Color.BLACK;
                }

                if (this.hoveredHex && this.hoveredHex.coords.equals(hex.coords)) {
                    fillColor = fillColor.darken(0.1);
                }

                hex.draw(this.canvas.getContext(), fillColor, borderColor, offset);
                // hex.drawCoordinates(this.canvas.getContext(), textColor, offset);
                hex.drawText(this.canvas.getContext(), '+', Color.WHITE, offset, 2);
            });

            this.hexes.forEach(hex => {
                hex.drawWall(this.canvas.getContext(), Color.LIGHT_GREY, offset);
            });

            // Draw rest of the hexes
            const restHexes = this.hexes.filter(hex => hex.type !== 'placeholder');
            restHexes.forEach(hex => {
                let fillColor = Color.WHITE;
                let borderColor = Color.BLACK;
                let textColor = Color.BLACK;

                if (hex.type === 'center') {
                    fillColor = Color.RED.lighten(0.30);
                    textColor = Color.WHITE;
                }

                if (hex.type === 'start') {
                    fillColor = Color.GREEN.lighten(0.80);
                }

                if (hex.type === 'placeholder') {
                    if (this.selectedHex && this.selectedHex.coords.equals(hex.coords)) {
                        fillColor = Color.ORANGE.lighten(0.50);
                    } else {
                        fillColor = Color.ORANGE.lighten(0.80);
                    }
                }

                if (hex.type === 'doors') {
                    fillColor = Color.PURPLE.lighten(0.80);
                }

                if (this.hoveredHex && this.hoveredHex.coords.equals(hex.coords)) {
                    fillColor = fillColor.darken(0.1);
                }

                hex.draw(this.canvas.getContext(), fillColor, borderColor, offset);

                if (hex.type === 'doors') {
                    let doorImg = this.images['doorClosed'] || null;

                    if (!doorImg) {
                        doorImg = new Image();
                        doorImg.src = '/static/img/grid/doorClosed.png';
                        doorImg.onload = () => {
                            const offsetCoords = hex.coords.to2D(this.hexSize);
                            this.canvas.getContext().drawImage(
                                doorImg,
                                offset.x + offsetCoords.x - this.hexSize * 1.1 / 2,
                                offset.y + offsetCoords.y - this.hexSize * 1.5 / 1.75,
                                this.hexSize * 1.1,
                                this.hexSize * 1.5
                            );
                            this.images['doorClosed'] = doorImg;
                        };
                    } else {
                        const offsetCoords = hex.coords.to2D(this.hexSize);
                        this.canvas.getContext().drawImage(
                            this.images['doorClosed'],
                            offset.x + offsetCoords.x - this.hexSize * 1.1 / 2,
                            offset.y + offsetCoords.y - this.hexSize * 1.5 / 1.75,
                            this.hexSize * 1.1,
                            this.hexSize * 1.5
                        );
                    }
                }

                if (hex.type === 'enemy') {
                    let enemy = hex.occupant as Enemy;
                    let enemyImg = this.images[enemy.tag] || null;

                    if (!enemyImg) {
                        enemyImg = new Image();
                        enemyImg.src = (hex.occupant as Enemy).url +"?token=true";
                        enemyImg.onload = () => {
                            const offsetCoords = hex.coords.to2D(this.hexSize);
                            this.canvas.getContext().drawImage(
                                enemyImg,
                                offset.x + offsetCoords.x - this.hexSize * 1.5 / 2,
                                offset.y + offsetCoords.y - this.hexSize * 1.5 / 2,
                                this.hexSize * 1.5,
                                this.hexSize * 1.5
                            );
                            this.images[enemy.tag] = enemyImg;
                        };
                    } else {
                        const offsetCoords = hex.coords.to2D(this.hexSize);
                        this.canvas.getContext().drawImage(
                            this.images[enemy.tag],
                            offset.x + offsetCoords.x - this.hexSize * 1.5 / 2,
                            offset.y + offsetCoords.y - this.hexSize * 1.5 / 2,
                            this.hexSize * 1.5,
                            this.hexSize * 1.5
                        );
                    }
                }

                if (hex.type === 'obstacle') {
                    let obstacle = hex.occupant as Obstacle;
                    let obstacleImg = this.images[obstacle.tag] || null;

                    if (!obstacleImg) {
                        obstacleImg = new Image();
                        obstacleImg.src = (hex.occupant as Obstacle).url +"?token=true";
                        obstacleImg.onload = () => {
                            const offsetCoords = hex.coords.to2D(this.hexSize);
                            this.canvas.getContext().drawImage(
                                obstacleImg,
                                offset.x + offsetCoords.x - this.hexSize * 1.5 / 2,
                                offset.y + offsetCoords.y - this.hexSize * 1.5 / 2,
                                this.hexSize * 1.5,
                                this.hexSize * 1.5
                            );
                            this.images[obstacle.tag] = obstacleImg;
                        };
                    } else {
                        const offsetCoords = hex.coords.to2D(this.hexSize);
                        this.canvas.getContext().drawImage(
                            this.images[obstacle.tag],
                            offset.x + offsetCoords.x - this.hexSize * 1.5 / 2,
                            offset.y + offsetCoords.y - this.hexSize * 1.5 / 2,
                            this.hexSize * 1.5,
                            this.hexSize * 1.5
                        );
                    }
                }

                if (((hex.type === 'default' || hex.type === 'center' || hex.type === 'start') && this.showCoordinates) || hex.type === 'placeholder') {
                    hex.drawCoordinates(this.canvas.getContext(), textColor, offset);
                }
            });

            // const boundingBox = this.getBoundingBox();
            // this.drawBoundingBox(boundingBox, offset, this.hexSize);
            this.canvas.setDrawn();
        }

        drawBoundingBox(boundingBox: BoundingBox, offset: Offset, hexSize: number): void {
            const ctx = this.canvas.getContext();
            ctx.lineWidth = 2;
            ctx.strokeStyle = Color.RED.toRGB();

            // Draw bounding box
            ctx.beginPath();
            ctx.moveTo(offset.x + boundingBox.minX - hexSize, offset.y + boundingBox.minY - hexSize);
            ctx.lineTo(offset.x + boundingBox.minX - hexSize, offset.y + boundingBox.maxY + hexSize);
            ctx.lineTo(offset.x + boundingBox.maxX + hexSize, offset.y + boundingBox.maxY + hexSize);
            ctx.lineTo(offset.x + boundingBox.maxX + hexSize, offset.y + boundingBox.minY - hexSize);
            ctx.closePath();

            const width = Math.floor(boundingBox.maxX - boundingBox.minX);
            const height = Math.floor(boundingBox.maxY - boundingBox.minY);

            const xPosition = offset.x + boundingBox.maxX + hexSize;
            const yPosition = offset.y + boundingBox.maxY + hexSize * 1.5;

            // Draw bounding box dimensions
            ctx.fillStyle = Color.RED.toRGB();
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${width} x ${height}`, xPosition, yPosition);

            ctx.stroke();
        }

        adjustCanvasHeight(): void {
            let {minY, maxY} = this.getBoundingBox();
            minY = Math.abs(minY);
            maxY = Math.abs(maxY);

            this.canvas.resize(null, ((minY + maxY) * 2) + this.hexes[0].hexSize * 4);
            console.log(`HexGrid | Adjusted canvas height to ${this.canvas.getHeight()}`);
        }

        private mapNeighbors(hex: Hex) {
            hex.neighbors = CubeCoordinate.directions.map(direction => {
                return this.getHexAt(hex.coords.add(direction))
            }).filter(neighbor => neighbor !== undefined && neighbor !== null);

            // Append hex to neighbors if not already present
            hex.neighbors.forEach(neighbor => {
                if (!neighbor.neighbors.find(n => n.coords.equals(hex.coords))) {
                    neighbor.neighbors.push(hex);
                }
            });
        }

        getBoundingBox(): BoundingBox {
            let minX = Infinity,
                maxX = -Infinity,
                minY = Infinity,
                maxY = -Infinity;

            this.hexes.forEach(hex => {
                const {x, y} = hex.coords.to2D(hex.hexSize);

                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            });

            return {
                minX: minX - this.hexSize + 5,
                maxX: maxX + this.hexSize - 5,
                minY: minY - this.hexSize,
                maxY: maxY + this.hexSize,
            };
        }

        getOffset(): Offset {
            const boundingBox = this.getBoundingBox();

            return {
                x: this.canvas.getWidth() / 2 - ((boundingBox.minX + boundingBox.maxX) / 2) - this.staticOffset.x,
                y: this.canvas.getHeight() / 2 - ((boundingBox.minY + boundingBox.maxY) / 2) - this.staticOffset.y,
            };
        }

        getHexes(): Hex[] {
            return this.hexes;
        }

        addHexAt(CubeCoordinate: CubeCoordinate): Hex {
            const hex = new Hex(null,CubeCoordinate, this.hexSize, []);
            this.mapNeighbors(hex);
            this.hexes.push(hex);
            return hex;
        }

        addHex(hex: Hex): void {
            this.mapNeighbors(hex);
            this.hexes.push(hex);
        }

        removeHex(hex: Hex): void {
            hex.neighbors.forEach(neighbor => {
                neighbor.neighbors = neighbor.neighbors.filter(n => !n.coords.equals(hex.coords));
            });
            this.hexes.splice(this.hexes.indexOf(hex), 1);
        }

        getHexAt(CubeCoordinate: CubeCoordinate): Hex {
            return this.hexes.find(hex => hex.coords.equals(CubeCoordinate));
        }

        hasHex(hex: Hex): boolean {
            return this.hexes.find(h => h.coords.equals(hex.coords)) !== undefined;
        }

        getHexSize(): number {
            return this.hexSize;
        }

        getID(): number {
            return this.id;
        }

        getTag(): string {
            return this.tag;
        }

        setTag(tag: string): void {
            this.tag = tag;
        }

        getTitle(): string {
            return this.title;
        }

        setTitle(title: string): void {
            this.title = title;
        }
    }
}