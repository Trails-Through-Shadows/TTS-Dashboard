module Dashboard {

    export interface BoundingBox {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    }

    export class HexGrid {
        private took: number = 0;

        constructor (
            private canvas: Canvas,
            private hexes: Hex[] = [],
        ) {}

        adjustCanvasHeight(): void {
            let {minY, maxY} = this.getCorners();
            minY = Math.abs(minY);
            maxY = Math.abs(maxY);

            this.canvas.resize(null,((minY + maxY) * 2) + this.hexes[0].hexSize * 4);
            console.log(`HexGrid | Adjusted canvas height to ${this.canvas.getHeight()}`);
        }

        readData(hexSize: number, url: string): void {
            this.canvas.setLoading(true);
            const currentTime = new Date().getTime();

            console.log(`HexGrid | Reading data from ${url}`);

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    const data = JSON.parse(request.responseText)['entry'];

                    // Map hexes
                    this.hexes = data['hexes'].map((hex: CubeCoordinate) => {
                        const {q, r, s} = hex;
                        return new Hex(hexSize, new CubeCoordinate(q, r, s), []);
                    })

                    // Map hex neighbors
                    this.hexes.forEach(hex => {
                        const directions = [
                            new CubeCoordinate(1, 0, -1),
                            new CubeCoordinate(1, -1, 0),
                            new CubeCoordinate(0, -1, 1),
                            new CubeCoordinate(-1, 0, 1),
                            new CubeCoordinate(-1, 1, 0),
                            new CubeCoordinate(0, 1, -1)
                        ];

                        hex.neighbors = directions.map(direction => {
                            const neighbor = direction.add(hex.coords);
                            return this.hexes.find(hex => hex.coords.equals(neighbor));
                        }).filter(neighbor => neighbor !== undefined);
                    });

                    this.took = new Date().getTime() - currentTime;
                    console.log(`HexGrid | Data read in ${this.took}ms`);

                    this.canvas.setLoading(false);
                    // this.adjustCanvasHeight();
                    this.draw();
                }
            };

            request.open('GET', url, true);
            request.send();
        }

        draw(): void {
            if (this.hexes.length === 0) return;

            const boundingBox: BoundingBox = this.getCorners();
            // this.canvas.clear();

            const hexSize = this.hexes[0].hexSize;
            const offset: OffsetCoordinate = new Dashboard.OffsetCoordinate(
                this.canvas.getWidth() / 2 - ((boundingBox.minX + boundingBox.maxX) / 2),
                this.canvas.getHeight() / 2 - ((boundingBox.minY + boundingBox.maxY) / 2)
            );

            // this.hexes.forEach(hex => {
            //     hex.drawWalls(this.canvas.getContext(), Color.fromHEX("#878787"), offset);
            // });

            this.hexes.forEach(hex => {
                let fillColor = Color.fromHEX('#FFF');
                let borderColor = Color.fromHEX('#000');
                let textColor = Color.fromHEX('#000');

                if (hex.coords.isZero()) {
                    fillColor = Color.fromHEX('#F66');
                    textColor = Color.fromHEX('#FFF');
                }

                hex.draw(this.canvas.getContext(), fillColor, borderColor, offset);
                hex.drawCoordinates(this.canvas.getContext(), textColor, offset);
            });

            // this.drawBoundingBox(boundingBox, offset, hexSize);
            // this.canvas.took(this.took);
            this.canvas.setDrawn();
        }

        drawBoundingBox(boundingBox: BoundingBox, offset: OffsetCoordinate, hexSize: number): void {
            const ctx = this.canvas.getContext();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#F00';

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
            ctx.fillStyle = '#F00';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${width} x ${height}`, xPosition, yPosition);

            ctx.stroke();
        }

        getCorners(): BoundingBox {
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

            return {minX, maxX, minY, maxY};
        }

        getHexes(): Hex[] {
            return this.hexes;
        }
    }
}