module Dashboard {

    export interface Part {
        grid: HexGrid,
        rotation: number
    }

    export interface Door {
        from: Part,
        to: Part,
        cords: CubeCoordinate
    }

    export class Location {
        private parts: Part[] = [];
        private doors: Door[] = [];

        constructor(
            private canvas: Canvas,
            private hexSize: number
        ) {}

        readData(url: string, apiUrl: string, callback?: () => void) {
            this.canvas.setLoading(true);
            const currentTime = new Date().getTime();

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        const data = JSON.parse(request.responseText);

                        for (const part of this.parts) {
                            part.grid.destruct();
                        }
                        this.parts = [];

                        // Parts
                        data['parts'].map((data: any) => {
                            const partId = data.key.idPart;
                            const part = data.part;

                            const hexes: Hex[] = [];
                            for (const hex of part.hexes) {
                                hexes.push(new Hex(new CubeCoordinate(hex.q, hex.r, hex.s), this.hexSize, []));
                            }

                            const grid = new HexGrid(this.canvas, this.hexSize, hexes);
                            grid.id = partId;
                            grid.title = part.title;
                            grid.tag = part.tag;

                            this.parts.push({
                                grid: grid,
                                rotation: data.rotation
                            });
                        });

                        // Doors
                        data['doors'].map((data: any) => {
                            const idPartFrom = data.key.idPartFrom;
                            const idPartTo = data.key.idPartTo;

                            this.doors.push({
                                from: this.parts.find((part) => part.grid.id === idPartFrom),
                                to: this.parts.find((part) => part.grid.id === idPartTo),
                                cords: new CubeCoordinate(data.qcoord, data.rcoord, data.scoord)
                            });

                            const partFrom = this.parts.find((part) => part.grid.id === idPartFrom);
                            partFrom.grid.addHex(new Hex(new CubeCoordinate(data.qcoord, data.rcoord, data.scoord), this.hexSize, []));
                        });

                        this.canvas.setLoading(false);
                        console.log(this);
                        callback();
                    } else {
                        console.error('Failed to load data');
                    }
                }
            }

            console.log('Location | Reading data from', url);
            request.open('GET', url, true);
            request.send();
        }

        draw(): void {
            this.parts.forEach((part) => {
                let xOff = 0;
                let yOff = 0;

                console.log("Drawing part", part.grid.id);
                let move = false;

                const doors = this.doors.filter((door) => door.from === part);
                const doorHexes = [];

                doors.forEach((door) => {
                    const cords2D = door.cords.to2D(this.hexSize);
                    xOff += cords2D.x;
                    yOff += cords2D.y;

                    doorHexes.push(new Hex(door.cords, this.hexSize, []));
                    if (door.cords.toOffset().y % 2 === 0) {
                        move = !move;
                    }
                });

                console.log("Offset", xOff, yOff);
                part.grid.setStaticOffset({x: xOff + (move ? (this.hexSize / 2) -1 : 0), y: yOff});
                part.grid.draw(doorHexes);
            });
        }
    }
}