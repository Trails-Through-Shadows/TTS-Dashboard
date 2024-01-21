var Dashboard;
(function (Dashboard) {
    class Canvas {
        canvas;
        def;
        written = false;
        loading = false;
        backgroundImage;
        imageLoaded = false;
        width;
        height;
        onSizeListeners = [];
        addOnSizeListener(listener) {
            this.onSizeListeners.push(listener);
        }
        onMouseHoverListeners = [];
        addOnMouseHoverListener(listener) {
            this.onMouseHoverListeners.push(listener);
        }
        onMouseClickListeners = [];
        addOnMouseClickListener(listener) {
            this.onMouseClickListeners.push(listener);
        }
        constructor(canvas, def) {
            this.canvas = canvas;
            this.def = def;
            this.canvas = canvas;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.resize();
            // Override default screen text
            if (!def) {
                this.def = {
                    title: 'No Data',
                    subtitle: '',
                    spacer: 100
                };
            }
            // Loading animation task repeating every 10ms
            let counter = 0;
            setInterval(() => {
                if (this.loading) {
                    this.clear();
                    const top = 'Loading';
                    const bottom = '□'.repeat(15).split('');
                    bottom[counter % 15] = '■';
                    counter = (counter + 1) % 15;
                    this.title(top, bottom.join(''));
                }
            }, 100);
            // Register listeners
            this.registerListeners();
        }
        setBackgroundImage(src, callback) {
            this.backgroundImage = new Image();
            this.backgroundImage.src = src;
            this.backgroundImage.onload = () => {
                this.imageLoaded = true;
                if (callback)
                    callback();
            };
        }
        title(text, subtitle) {
            this.clear();
            const ctx = this.getContext();
            ctx.fillStyle = new Dashboard.Color(255, 255, 255, 0.1).toRGB();
            ctx.shadowColor = new Dashboard.Color(0, 0, 0, 0.75).toRGB();
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 6em Arial';
            ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - this.def.spacer / 2);
            if (subtitle.length > 0) {
                ctx.font = '2em Arial';
                const lines = subtitle.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + this.def.spacer / 2 + i * 30);
                }
            }
        }
        clear() {
            const ctx = this.getContext();
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.imageLoaded) {
                ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
        resize(width, height) {
            this.width = width || this.canvas.offsetWidth;
            this.height = height || this.canvas.offsetHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        registerListeners() {
            const parent = this.canvas.parentElement;
            // Window resize observer
            const observer = new ResizeObserver(() => {
                this.resize();
                if (!this.written && !this.loading) {
                    this.title(this.def.title, this.def.subtitle);
                }
                this.onSizeListeners.forEach(listener => listener());
            });
            observer.observe(this.canvas);
            // Mouse hover listener
            this.canvas.addEventListener('mousemove', (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                this.onMouseHoverListeners.forEach(listener => listener(x, y));
            });
            // Mouse click listener
            this.canvas.addEventListener('click', (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                this.onMouseClickListeners.forEach(listener => listener(x, y));
            });
        }
        // ------------------------------
        getContentBoundingBox() {
            const imageData = this.getContext().getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            let minX = width;
            let minY = height;
            let maxX = 0;
            let maxY = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const alpha = data[(width * y + x) * 4 + 3];
                    if (alpha > 0) {
                        if (x < minX)
                            minX = x;
                        if (y < minY)
                            minY = y;
                        if (x > maxX)
                            maxX = x;
                        if (y > maxY)
                            maxY = y;
                    }
                }
            }
            return {
                minX,
                minY,
                maxX,
                maxY,
            };
        }
        getContext() {
            const ctx = this.canvas.getContext('2d');
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = Dashboard.Color.WHITE.toRGB();
            ctx.strokeStyle = Dashboard.Color.BLACK.toRGB();
            return ctx;
        }
        setCursor(cursor) {
            this.canvas.style.cursor = cursor;
        }
        getWidth() {
            return this.width;
        }
        getHeight() {
            return this.height;
        }
        setDrawn() {
            this.written = true;
        }
        isDrawn() {
            return this.written;
        }
        setLoading(loading) {
            this.loading = loading;
        }
        isLoading() {
            return this.loading;
        }
    }
    Dashboard.Canvas = Canvas;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class Color {
        r;
        g;
        b;
        a;
        static RED = Color.fromHEX('#FF0000');
        static GREEN = Color.fromHEX('#00FF00');
        static BLUE = Color.fromHEX('#0000FF');
        static YELLOW = Color.fromHEX('#FFFF00');
        static CYAN = Color.fromHEX('#00FFFF');
        static MAGENTA = Color.fromHEX('#FF00FF');
        static ORANGE = Color.fromHEX('#FFA500');
        static PURPLE = Color.fromHEX('#800080');
        static PINK = Color.fromHEX('#FFC0CB');
        static WHITE = Color.fromHEX('#FFFFFF');
        static LIGHT_GREY = Color.fromHEX('#c0c0c0');
        static GREY = Color.fromHEX('#808080');
        static DARK_GREY = Color.fromHEX('#404040');
        static BLACK = Color.fromHEX('#000000');
        constructor(r, g, b, a = 1) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        static fromHEX(hex) {
            hex = hex.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }
            const [r, g, b] = hex.match(/.{2}/g).map(char => parseInt(char, 16));
            return new Color(r, g, b);
        }
        toHEX() {
            return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
        }
        toRGB() {
            if (this.a != 1) {
                return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            }
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }
        darken(percent) {
            return new Color(this.r - (this.r * percent), this.g - (this.g * percent), this.b - (this.b * percent), this.a);
        }
        lighten(percent) {
            return new Color(this.r + ((this.r != 0 ? this.r : 255) * percent), this.g + ((this.g != 0 ? this.g : 255) * percent), this.b + ((this.b != 0 ? this.b : 255) * percent), this.a);
        }
    }
    Dashboard.Color = Color;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class CubeCoordinate {
        q;
        r;
        s;
        static directions = [
            new CubeCoordinate(1, 0, -1),
            new CubeCoordinate(1, -1, 0),
            new CubeCoordinate(0, -1, 1),
            new CubeCoordinate(-1, 0, 1),
            new CubeCoordinate(-1, 1, 0),
            new CubeCoordinate(0, 1, -1)
        ];
        constructor(q, r, s) {
            this.q = q;
            this.r = r;
            this.s = s;
        }
        static from2D(x, y, hexSize) {
            const q = (Math.sqrt(3) / 3 * x - 1. / 3 * y) / hexSize;
            const r = (2. / 3 * y) / hexSize;
            const s = -q - r;
            // Round to nearest cube coordinate
            // https://www.redblobgames.com/grids/hexagons/#rounding
            // -------------------------------
            let rx = Math.round(q);
            let ry = Math.round(r);
            let rz = Math.round(s);
            const xDiff = Math.abs(rx - q);
            const yDiff = Math.abs(ry - r);
            const zDiff = Math.abs(rz - s);
            if (xDiff > yDiff && xDiff > zDiff) {
                rx = -ry - rz;
            }
            else if (yDiff > zDiff) {
                ry = -rx - rz;
            }
            else {
                rz = -rx - ry;
            }
            return new CubeCoordinate(rx, ry, rz);
        }
        to2D(hexSize) {
            const x = hexSize * (Math.sqrt(3) * this.q + Math.sqrt(3) / 2 * this.r);
            const y = hexSize * (3 / 2 * this.r);
            return { x, y };
        }
        isZero() {
            return this.q === 0 && this.r === 0 && this.s === 0;
        }
        add(other) {
            return new CubeCoordinate(this.q + other.q, this.r + other.r, this.s + other.s);
        }
        equals(other) {
            return this.q === other.q && this.r === other.r && this.s === other.s;
        }
    }
    Dashboard.CubeCoordinate = CubeCoordinate;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class Hex {
        coords;
        hexSize;
        neighbors;
        vertices = [];
        constructor(coords, hexSize = 30, neighbors = []) {
            this.coords = coords;
            this.hexSize = hexSize;
            this.neighbors = neighbors;
            this.vertices = this.calculateVertices(this.hexSize);
        }
        calculateVertices(hexSize) {
            const vertices = [];
            for (let i = 0; i < 6; i++) {
                const angleDegrees = 60 * i + 30;
                const angleRadians = Math.PI / 180 * angleDegrees;
                vertices.push({
                    x: hexSize * Math.cos(angleRadians),
                    y: hexSize * Math.sin(angleRadians)
                });
            }
            return vertices;
        }
        draw(ctx, fillColor, borderColor, offset) {
            const { x, y } = this.coords.to2D(this.hexSize);
            // Draw hex edges
            ctx.beginPath();
            this.vertices.forEach((vertex, index) => {
                if (index === 0) {
                    ctx.moveTo(offset.x + x + vertex.x, offset.y + y + vertex.y);
                }
                else {
                    ctx.lineTo(offset.x + x + vertex.x, offset.y + y + vertex.y);
                }
            });
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.fillStyle = fillColor.toRGB();
            ctx.strokeStyle = borderColor.toRGB();
            ctx.fill();
            ctx.stroke();
        }
        drawWall(ctx, wallColor, offset) {
            const { x, y } = this.coords.to2D(this.hexSize);
            ctx.save();
            if (this.neighbors.length != 6) {
                const borderHexes = this.calculateVertices(this.hexSize * 1.2);
                ctx.beginPath();
                borderHexes.forEach((edge, index) => {
                    if (index === 0) {
                        ctx.moveTo(offset.x + x + edge.x, offset.y + y + edge.y);
                    }
                    else {
                        ctx.lineTo(offset.x + x + edge.x, offset.y + y + edge.y);
                    }
                });
                ctx.closePath();
                ctx.fillStyle = wallColor.toRGB();
                ctx.fill();
            }
            ctx.restore();
        }
        drawCoordinates(ctx, textColor, offset) {
            this.drawText(ctx, `${this.coords.q}, ${this.coords.r}, ${this.coords.s}`, textColor, offset);
        }
        drawText(ctx, text, textColor, offset, scale = 1) {
            const { x, y } = this.coords.to2D(this.hexSize);
            ctx.fillStyle = textColor.toHEX();
            ctx.font = (12 * scale) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
            ctx.fillText(text, offset.x + x, offset.y + y + scale);
        }
        getNeighbor(direction) {
            return this.neighbors.find(hex => hex.coords.equals(this.coords.add(direction))) || null;
        }
    }
    Dashboard.Hex = Hex;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class HexGrid {
        canvas;
        hexSize;
        hexes;
        hoveredHex = null;
        id = 0;
        tag = '';
        constructor(canvas, hexSize, hexes = []) {
            this.canvas = canvas;
            this.hexSize = hexSize;
            this.hexes = hexes;
            this.canvas.addOnMouseHoverListener((x, y) => {
                if (this.canvas.isLoading()) {
                    return;
                }
                const offset = this.getOffset();
                const coords = Dashboard.CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexSize);
                const hex = this.getHexAt(coords);
                // It's the same hex, ignore
                if (this.hoveredHex === hex) {
                    return;
                }
                this.hoveredHex = hex;
                this.draw();
            });
        }
        readData(url, callback) {
            this.canvas.setLoading(true);
            const currentTime = new Date().getTime();
            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    const data = JSON.parse(request.responseText);
                    // Map attributes
                    this.id = data['id'];
                    this.tag = data['tag'];
                    // Map hexes
                    this.hexes = data['hexes'].map(({ q, r, s }) => {
                        return new Dashboard.Hex(new Dashboard.CubeCoordinate(q, r, s), this.hexSize, []);
                    });
                    // Map hex neighbors
                    this.hexes.forEach(hex => this.mapNeighbors(hex));
                    const took = new Date().getTime() - currentTime;
                    console.log(`HexGrid | Data read in ${took}ms`);
                    this.canvas.setLoading(false);
                    if (callback)
                        callback();
                }
            };
            console.log(`HexGrid | Reading data from ${url}`);
            request.open('GET', url, true);
            request.send();
        }
        exportData(id) {
            const data = {
                id: id,
                tag: this.tag,
                hexes: this.hexes.map(hex => hex.coords)
            };
            return JSON.stringify(data, null, 4);
        }
        draw() {
            if (this.hexes.length === 0)
                return;
            const offset = this.getOffset();
            this.hexes.forEach(hex => {
                hex.drawWall(this.canvas.getContext(), Dashboard.Color.LIGHT_GREY, offset);
            });
            this.hexes.forEach(hex => {
                let fillColor = Dashboard.Color.WHITE;
                let borderColor = Dashboard.Color.BLACK;
                let textColor = Dashboard.Color.BLACK;
                if (hex.coords.isZero()) {
                    fillColor = Dashboard.Color.RED.lighten(0.30);
                    textColor = Dashboard.Color.WHITE;
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
        drawBoundingBox(boundingBox, offset, hexSize) {
            const ctx = this.canvas.getContext();
            ctx.lineWidth = 2;
            ctx.strokeStyle = Dashboard.Color.RED.toRGB();
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
            ctx.fillStyle = Dashboard.Color.RED.toRGB();
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${width} x ${height}`, xPosition, yPosition);
            ctx.stroke();
        }
        adjustCanvasHeight() {
            let { minY, maxY } = this.getBoundingBox();
            minY = Math.abs(minY);
            maxY = Math.abs(maxY);
            this.canvas.resize(null, ((minY + maxY) * 2) + this.hexes[0].hexSize * 4);
            console.log(`HexGrid | Adjusted canvas height to ${this.canvas.getHeight()}`);
        }
        mapNeighbors(hex) {
            hex.neighbors = Dashboard.CubeCoordinate.directions.map(direction => {
                return this.getHexAt(hex.coords.add(direction));
            }).filter(neighbor => neighbor !== undefined && neighbor !== null);
            // Append hex to neighbors if not already present
            hex.neighbors.forEach(neighbor => {
                if (!neighbor.neighbors.find(n => n.coords.equals(hex.coords))) {
                    neighbor.neighbors.push(hex);
                }
            });
        }
        getBoundingBox() {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            this.hexes.forEach(hex => {
                const { x, y } = hex.coords.to2D(hex.hexSize);
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
        getOffset() {
            const boundingBox = this.getBoundingBox();
            return {
                x: this.canvas.getWidth() / 2 - ((boundingBox.minX + boundingBox.maxX) / 2),
                y: this.canvas.getHeight() / 2 - ((boundingBox.minY + boundingBox.maxY) / 2)
            };
        }
        getHexes() {
            return this.hexes;
        }
        addHexAt(CubeCoordinate) {
            const hex = new Dashboard.Hex(CubeCoordinate, this.hexSize, []);
            this.mapNeighbors(hex);
            this.hexes.push(hex);
        }
        addHex(hex) {
            this.mapNeighbors(hex);
            this.hexes.push(hex);
        }
        removeHex(hex) {
            hex.neighbors.forEach(neighbor => {
                neighbor.neighbors = neighbor.neighbors.filter(n => !n.coords.equals(hex.coords));
            });
            this.hexes.splice(this.hexes.indexOf(hex), 1);
        }
        getHexAt(CubeCoordinate) {
            return this.hexes.find(hex => hex.coords.equals(CubeCoordinate));
        }
        hasHex(hex) {
            return this.hexes.find(h => h.coords.equals(hex.coords)) !== undefined;
        }
        getHexSize() {
            return this.hexSize;
        }
        getID() {
            return this.id;
        }
        getTag() {
            return this.tag;
        }
    }
    Dashboard.HexGrid = HexGrid;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class GridEditor {
        canvas;
        hexGrid;
        placeholderHexes = [];
        hoveredHex = null;
        validator;
        constructor(canvas, hexGrid) {
            this.canvas = canvas;
            this.hexGrid = hexGrid;
            this.validator = new Dashboard.Validator(canvas, '/api/validate/part');
            this.canvas.addOnMouseClickListener(() => {
                if (this.hoveredHex) {
                    if (this.hoveredHex.coords.isZero()) {
                        return;
                    }
                    if (this.hexGrid.hasHex(this.hoveredHex)) {
                        this.hexGrid.removeHex(this.hoveredHex);
                    }
                    else {
                        this.hexGrid.addHex(this.hoveredHex);
                    }
                    this.validator.requestValidation(this.hexGrid.exportData(0), () => this.redraw(), () => this.redraw());
                    this.calculatePlaceholderHexes();
                    this.redraw();
                }
            });
            this.canvas.addOnMouseHoverListener((x, y) => {
                if (this.canvas.isLoading()) {
                    return;
                }
                const offset = this.hexGrid.getOffset();
                const coords = Dashboard.CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexGrid.getHexSize());
                const hex = this.getHexAt(coords);
                // It's the same hex, ignore
                if (this.hoveredHex === hex) {
                    return;
                }
                if (hex) {
                    this.canvas.setCursor('pointer');
                }
                else {
                    this.canvas.setCursor('default');
                }
                this.hoveredHex = hex;
                this.draw();
            });
            this.calculatePlaceholderHexes();
        }
        draw() {
            this.canvas.setDrawn();
            const ctx = this.canvas.getContext();
            const offset = this.hexGrid.getOffset();
            // Draw hexes
            this.placeholderHexes.forEach(hex => {
                let fillColor = Dashboard.Color.DARK_GREY;
                if (this.hoveredHex && this.hoveredHex.coords.equals(hex.coords)) {
                    fillColor = fillColor.lighten(0.2);
                }
                hex.draw(ctx, fillColor, Dashboard.Color.BLACK, offset);
                hex.drawText(ctx, '+', Dashboard.Color.WHITE, offset, 2);
            });
            this.hexGrid.draw();
            this.validator.draw();
        }
        redraw() {
            this.canvas.clear();
            this.draw();
        }
        getHexAt(coords) {
            return this.hexGrid.getHexes().find(hex => hex.coords.equals(coords))
                || this.placeholderHexes.find(hex => hex.coords.equals(coords));
        }
        calculatePlaceholderHexes() {
            const hexGridHexes = this.hexGrid.getHexes();
            this.placeholderHexes = [];
            hexGridHexes.forEach(hex => {
                Dashboard.CubeCoordinate.directions.forEach(direction => {
                    let neighbor = hex.getNeighbor(direction);
                    if (!neighbor) {
                        neighbor = new Dashboard.Hex(hex.coords.add(direction), this.hexGrid.getHexSize(), [hex]);
                    }
                    if (!hexGridHexes.find(hex => hex.coords.equals(neighbor.coords))) {
                        this.placeholderHexes.push(neighbor);
                    }
                });
            });
        }
        getBoundingBox() {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            this.placeholderHexes.forEach(hex => {
                const { x, y } = hex.coords.to2D(hex.hexSize);
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
    Dashboard.GridEditor = GridEditor;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class Validator {
        canvas;
        apiUrl;
        valid = true;
        validating = false;
        errors = [];
        lineHeight = 24;
        lineWidth = 0;
        timeout = null;
        constructor(canvas, apiUrl) {
            this.canvas = canvas;
            this.apiUrl = apiUrl;
        }
        draw() {
            const ctx = this.canvas.getContext();
            // Clear text before drawing
            ctx.clearRect(0, this.canvas.getHeight() - this.lineHeight, this.lineWidth, this.lineHeight);
            this.lineHeight = 24;
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            if (this.validating) {
                const msg = '⏳ Validating part scheme...';
                this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);
                ctx.fillStyle = Dashboard.Color.ORANGE.toRGB();
                ctx.fillText(msg, 0, this.canvas.getHeight() - 8);
            }
            else {
                if (this.valid) {
                    const msg = '✅ This scheme is valid!';
                    this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);
                    ctx.fillStyle = Dashboard.Color.GREEN.toRGB();
                    ctx.fillText(msg, 0, this.canvas.getHeight() - 8);
                }
                else {
                    const msg = '❌ This scheme is invalid!';
                    this.lineWidth = Math.max(this.lineWidth, ctx.measureText(msg).width);
                    ctx.fillStyle = Dashboard.Color.RED.lighten(0.2).toRGB();
                    ctx.fillText(msg, 0, this.canvas.getHeight() - 8 - this.errors.length * 24);
                    this.errors.forEach((error, index) => {
                        const errorMSG = ' » ' + error;
                        this.lineWidth = Math.max(this.lineWidth, ctx.measureText(errorMSG).width);
                        ctx.fillText(errorMSG, 0, this.canvas.getHeight() - 8 - index * 24);
                        this.lineHeight += 24;
                    });
                }
            }
        }
        requestValidation(data, startCall, callback) {
            function validate(validator) {
                validator.validating = true;
                validator.draw();
                startCall();
                const request = new XMLHttpRequest();
                request.open('POST', validator.apiUrl, true);
                request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                request.send(JSON.stringify(data));
                request.onreadystatechange = () => {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        validator.validating = false;
                        validator.valid = request.status === 200;
                        if (!validator.valid) {
                            validator.errors = JSON.parse(request.responseText)['errors'];
                        }
                        else {
                            validator.errors = [];
                        }
                        callback(validator.valid, validator.errors);
                    }
                };
            }
            clearTimeout(this.timeout);
            this.timeout = setTimeout(validate, 500, this);
        }
        isValid() {
            return this.valid;
        }
    }
    Dashboard.Validator = Validator;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class Table {
        root;
        template;
        filter;
        took = 0;
        sort = new Dashboard.TableSorter();
        url = '';
        page = 1;
        limit = 10;
        onDataLoad = () => { };
        setOnDataLoad(onDataLoad) {
            this.onDataLoad = onDataLoad;
        }
        constructor(root, template, filter = new Dashboard.TableFilter([])) {
            this.root = root;
            this.template = template;
            this.filter = filter;
            const tableSearchInput = this.root.querySelector('#tableSearchInput');
            console.log(tableSearchInput);
            const tableFilterButton = this.root.querySelector('#tableFilterButton');
            console.log(tableFilterButton);
        }
        getFilter() {
            return this.filter;
        }
        getSorter() {
            return this.sort;
        }
        ;
        setupOrdering() {
            if (this.url === '') {
                return;
            }
            const tableHeaders = this.root.querySelectorAll('.orderable');
            tableHeaders.forEach((tableHeader) => {
                this.sort.setup(tableHeader, () => {
                    this.queryData(this.url, this.page, this.limit);
                });
            });
        }
        setupPagination() {
            const pageLinks = this.root.querySelectorAll('.page-link');
            pageLinks.forEach((pageLink) => {
                pageLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    const newPage = pageLink.getAttribute('data-page');
                    // Change url
                    const pageUrl = new URL(window.location.href);
                    pageUrl.searchParams.set('page', newPage);
                    window.history.replaceState({}, '', pageUrl.toString());
                    this.queryData(this.url, parseInt(newPage), this.limit);
                });
            });
        }
        queryData(url, page, limit) {
            const currentTime = new Date().getTime();
            this.url = url;
            this.page = Math.max(page, 1);
            this.limit = Math.max(limit, 1);
            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const status = request.status;
                    const tableDataElement = this.root.querySelector('#tableDataReplacement');
                    tableDataElement.innerHTML = request.responseText;
                    if (status === 200) {
                        this.took = new Date().getTime() - currentTime;
                        console.log(`Table | Query took ${this.took}ms`);
                        this.setupOrdering();
                        this.setupPagination();
                        this.onDataLoad();
                    }
                    else {
                        console.log(`Table | Query failed with status ${request.status}`);
                    }
                }
            };
            let newUrl = url;
            newUrl += "?page=" + page;
            newUrl += "&limit=" + limit;
            newUrl += "&filter=" + this.filter.toString();
            newUrl += "&sort=" + this.sort.toString();
            newUrl += "&template=" + this.template;
            console.log(`Table | Querying data from ${newUrl}`);
            request.open('GET', newUrl);
            request.send();
        }
        setAction(actionType, callback) {
            const tableActions = this.root.querySelectorAll('#tableActions');
            for (let i = 0; i < tableActions.length; i++) {
                const buttons = tableActions[i].querySelectorAll(`[data-action="${actionType}"]`);
                for (let i = 0; i < buttons.length; i++) {
                    const button = buttons[i];
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        callback(event, button);
                    });
                }
            }
        }
    }
    Dashboard.Table = Table;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class TableFilter {
        map;
        constructor(list) {
            this.map = new Map(list.map(pairStr => {
                const [first, second] = pairStr.split(':');
                return [new Dashboard.Pair(first, second), null];
            }));
        }
        set(key, value) {
            const existingPair = Array.from(this.map.keys())
                .find(pair => pair.getFirst() === key);
            if (existingPair) {
                this.map.set(existingPair, value);
            }
        }
        toString() {
            return Array.from(this.map)
                .filter(([_, value]) => value !== null && value !== '')
                .map(([key, value]) => `${key.toString()}:${value}`)
                .join(',') || '';
        }
    }
    Dashboard.TableFilter = TableFilter;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    let Order;
    (function (Order) {
        Order["ASC"] = "asc";
        Order["DESC"] = "desc";
        Order["NONE"] = "none";
    })(Order = Dashboard.Order || (Dashboard.Order = {}));
    class TableSorter {
        map = new Map();
        constructor() {
            const pageUrl = new URL(window.location.href);
            const sort = pageUrl.searchParams.get('sort');
            if (sort) {
                sort.split(',').forEach(pair => {
                    const [key, value] = pair.split(':');
                    this.map.set(key, value);
                });
            }
        }
        set(key, order) {
            this.map.set(key, order);
        }
        setup(tableHeader, callback) {
            const key = tableHeader.getAttribute('data-key');
            if (this.map.get(key) === undefined) {
                if (tableHeader.classList.contains('asc')) {
                    this.map.set(key, Order.ASC);
                }
                else if (tableHeader.classList.contains('desc')) {
                    this.map.set(key, Order.DESC);
                }
                else {
                    this.map.set(key, Order.NONE);
                }
            }
            else {
                if (this.map.get(key) === Order.ASC) {
                    tableHeader.classList.add('asc');
                }
                else if (this.map.get(key) === Order.DESC) {
                    tableHeader.classList.add('desc');
                }
            }
            tableHeader.addEventListener('click', () => {
                const order = this.map.get(key) || Order.NONE;
                if (order === Order.ASC) {
                    this.map.set(key, Order.DESC);
                    tableHeader.classList.remove('asc');
                    tableHeader.classList.add('desc');
                }
                else if (order === Order.DESC) {
                    this.map.set(key, Order.NONE);
                    tableHeader.classList.remove('asc', 'desc');
                }
                else {
                    this.map.set(key, Order.ASC);
                    tableHeader.classList.add('asc');
                    tableHeader.classList.remove('desc');
                }
                // Change url
                const pageUrl = new URL(window.location.href);
                pageUrl.searchParams.set('sort', this.toString());
                window.history.replaceState({}, '', pageUrl.toString());
                callback(key, this.map.get(key));
            });
        }
        toString() {
            return Array.from(this.map)
                .filter(([_, value]) => value !== Order.NONE)
                .map(([key, value]) => `${key}:${value}`)
                .join(',') || '';
        }
    }
    Dashboard.TableSorter = TableSorter;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class Pair {
        first;
        second;
        constructor(first, second) {
            this.first = first;
            this.second = second;
        }
        getFirst() {
            return this.first;
        }
        getSecond() {
            return this.second;
        }
        toString() {
            return `${this.first}:${this.second}`;
        }
    }
    Dashboard.Pair = Pair;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    class Triplet {
        first;
        second;
        third;
        constructor(first, second, third) {
            this.first = first;
            this.second = second;
            this.third = third;
        }
        getFirst() {
            return this.first;
        }
        getSecond() {
            return this.second;
        }
        getThird() {
            return this.third;
        }
        toString() {
            return `${this.first}:${this.second}:${this.third}`;
        }
    }
    Dashboard.Triplet = Triplet;
})(Dashboard || (Dashboard = {}));
//# sourceMappingURL=dashboard.js.map