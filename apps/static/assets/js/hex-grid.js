class Hex {
    borderColor = '#000';
    borderWidth = 1;
    edges = [];

    /**
     * Hex constructor
     * @param hexSize - size of hex
     * @param q - axial cord
     * @param r - axial cord
     * @param s - axial cord
     * @param neighbors - array of neighbor hexes
     */
    constructor(hexSize, q, r, s, neighbors = []) {
        this.hexSize = hexSize;
        this.q = q;
        this.r = r;
        this.s = s;
        this.neighbors = neighbors;
        this.calculateEdges();
    }

    /**
     * Pre calculate hex edges
     */
    calculateEdges() {
        this.edges = [];

        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i + Math.PI / 6;
            const x = this.hexSize * Math.cos(angle);
            const y = this.hexSize * Math.sin(angle);
            this.edges.push({ x, y });
        }
    }

    /**
     * Convert axial cords to 2D cords
     * @returns {{x: number, y: number}}
     */
    cubeTo2D() {
        const x = this.hexSize * Math.sqrt(3) * (this.q + this.r / 2);
        const y = this.hexSize * 3 / 2 * this.r;
        return { x, y };
    }

    /**
     * Convert axial cords to offset cords
     * @returns {{x: number, y: number}}
     */
    cubeToOffset() {
        const x = this.q + (this.r - (this.r & 1)) / 2;
        const y = this.r;
        return { x, y };
    }

    /**
     * Draw hex on canvas
     * @param ctx - canvas context
     * @param fillColor - inside color of hex
     * @param offset - offset of hex
     */
    drawHex(ctx, fillColor, offset) {
        const { x, y } = this.cubeTo2D();

        // Draw hex edges
        ctx.beginPath();
        this.edges.forEach((edge, index) => {
            if (index === 0) {
                ctx.moveTo(offset.x + x + edge.x, offset.y + y + edge.y);
            } else {
                ctx.lineTo(offset.x + x + edge.x, offset.y + y + edge.y);
            }
        });
        ctx.closePath();

        // Fill hex
        ctx.fillStyle = fillColor;
        ctx.fill();

        // Draw border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.stroke();
    }

    /**
     * Draw axial cords on hex
     * @param ctx - canvas context
     * @param textColor - color of cords
     * @param offset - offset of hex
     */
    drawCoords(ctx, textColor, offset) {
        const { x, y } = this.cubeTo2D();

        ctx.fillStyle = textColor;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.q}, ${this.r}, ${this.s}`, offset.x + x, offset.y + y);
    }
}

class HexGrid {
    hexSize = 30;

    constructor(canvas, hexes) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.hexes = hexes.map(hex => new Hex(this.hexSize, hex.q, hex.r, hex.s));
    }

    /**
     * Adjust canvas width to fit all hexes
     */
    adjustCanvasHeight() {
        let {minY, maxY} = this.getCorners();
        this.canvas.height = ((minY + maxY) * 2) + this.hexSize * 4;
    }

    /**
     * Draw hexes on canvas centered to the middle of canvas
     */
    draw() {
        let {minX, maxX, minY, maxY} = this.getCorners();
        this.clear();

        const offset = {
            x: this.canvas.width / 2 - ((minX + maxX) / 2),
            y: this.canvas.height / 2 - ((minY + maxY) / 2)
        };

        this.hexes.forEach(hex => {
            let fillColor = '#fff';
            let textColor = '#000';

            if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
                fillColor = '#ff5a5a';
                textColor = '#fff';
            }

            hex.drawHex(this.ctx, fillColor, offset);
            hex.drawCoords(this.ctx, textColor, offset);
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Return min, max square cord for horizontal and vertical axis
     * @returns {{minX: number, maxX: number, minY: number, maxY: number}}
     */
    getCorners() {
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