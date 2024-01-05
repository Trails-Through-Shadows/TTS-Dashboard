module Dashboard {
    export class HexGrid {
        private canvas: Canvas;
        private hexes: Hex[] = [];

        constructor(canvas: Canvas, hexes: Hex[]) {
            this.canvas = canvas;
            this.hexes = hexes;
        }

        adjustCanvasHeight(): void {
            let {minY, maxY} = this.getCorners();
            this.canvas.resize(null,((minY + maxY) * 2) + this.hexes[0].getSize() * 4);
            console.log(`Adjusted canvas height to ${this.canvas.getHeight()}`);
        }

        readData(hexSize: number, url: string) {
            this.canvas.setLoading(true);

            console.log(`Reading data from ${url}`);

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    const data = JSON.parse(request.responseText);

                    this.hexes = data['hexes'].map(hex => {
                        const {q, r, s} = hex;
                        return new Hex(hexSize, {q, r, s});
                    })

                    this.canvas.setLoading(false);
                    this.adjustCanvasHeight();
                    this.draw();
                }
            };

            request.open('GET', url, true);
            request.send();
        }

        draw(): void {
            this.canvas.setDrawn();

            let {minX, maxX, minY, maxY} = this.getCorners();
            this.canvas.clear();

            const offset: OffsetCoordinate = {
                x: this.canvas.getWidth() / 2 - ((minX + maxX) / 2),
                y: this.canvas.getHeight() / 2 - ((minY + maxY) / 2)
            };

            this.hexes.forEach(hex => {
                let fillColor = new Color(255, 255, 255);
                let borderColor = new Color(0, 0, 0);
                let textColor = new Color(0, 0, 0);

                const {q, r, s} = hex.getCoordinate();
                if (q === 0 && r === 0 && s === 0) {
                    fillColor = Color.fromHex('#ff5a5a');
                    textColor = new Color(255, 255, 255);
                }

                hex.draw(this.canvas.getContext(), fillColor, borderColor, offset);
                hex.drawCoordinates(this.canvas.getContext(), textColor, offset);
            });

        }

        getCorners(): { minX: number; maxX: number; minY: number; maxY: number } {
            let minX = Infinity,
                maxX = -Infinity,
                minY = Infinity,
                maxY = -Infinity;

            this.hexes.forEach(hex => {
                const {x, y} = hex.cubeTo2D();

                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            });

            return {minX, maxX, minY, maxY};
        }
    }
}