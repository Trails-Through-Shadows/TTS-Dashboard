module Dashboard {

    export interface BoundingBox {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    }

    export class HexGrid {
        private hoveredHex: Hex | null = null;
        private id: number = 0;
        private tag: string = '';
        private title: string = '';

        constructor(
            private canvas: Canvas,
            private hexSize: number,
            private hexes: Hex[] = [],
        ) {
            this.canvas.addOnMouseHoverListener((x: number, y: number) => {
                if (this.canvas.isLoading()) {
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
            });
        }

        readData(url: string, callback?: () => void): void {
            this.canvas.setLoading(true);
            const currentTime = new Date().getTime();

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    const data = JSON.parse(request.responseText);

                    // Map attributes
                    this.id = data['id'];
                    this.tag = data['tag'];
                    this.title = data['title'];

                    // Map hexes
                    this.hexes = data['hexes'].map(({q, r, s}) => {
                        return new Hex(new Dashboard.CubeCoordinate(q, r, s),this.hexSize, []);
                    })

                    // Map hex neighbors
                    this.hexes.forEach(hex => this.mapNeighbors(hex));

                    const took = new Date().getTime() - currentTime;
                    console.log(`HexGrid | Data read in ${took}ms`);
                    this.canvas.setLoading(false);
                    this.canvas.setDrawn();

                    if (callback) callback();
                }
            };

            console.log(`HexGrid | Reading data from ${url}`);
            request.open('GET', url, true);
            request.send();
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

        draw(): void {
            if (this.hexes.length === 0) return;
            const offset: Offset = this.getOffset();

            this.hexes.forEach(hex => {
                hex.drawWall(this.canvas.getContext(), Color.LIGHT_GREY, offset);
            });

            this.hexes.forEach(hex => {
                let fillColor = Color.WHITE;
                let borderColor = Color.BLACK;
                let textColor = Color.BLACK;

                if (hex.coords.isZero()) {
                    fillColor = Color.RED.lighten(0.30);
                    textColor = Color.WHITE;
                }

                if (this.hoveredHex && this.hoveredHex.coords.equals(hex.coords)) {
                    fillColor = fillColor.darken(0.1);
                }

                hex.draw(this.canvas.getContext(), fillColor, borderColor, offset);
                hex.drawCoordinates(this.canvas.getContext(), textColor, offset);
            });

            // this.drawBoundingBox(boundingBox, offset, hexSize);
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
                x: this.canvas.getWidth() / 2 - ((boundingBox.minX + boundingBox.maxX) / 2),
                y: this.canvas.getHeight() / 2 - ((boundingBox.minY + boundingBox.maxY) / 2)
            };
        }

        getHexes(): Hex[] {
            return this.hexes;
        }

        addHexAt(CubeCoordinate: CubeCoordinate): void {
            const hex = new Hex(CubeCoordinate, this.hexSize, []);
            this.mapNeighbors(hex);
            this.hexes.push(hex);
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