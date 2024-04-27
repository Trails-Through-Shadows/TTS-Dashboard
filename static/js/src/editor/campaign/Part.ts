module Dashboard {

    export class Part {

        constructor(
            public id: number,
            public tag: string,
            public title: string = "",
            public hexes: Hex[] = [],
        ) {}

        public static fromJSON(json: any): Part {
            const part = new Part(
                json.id,
                json.tag,
                json.title,
                json.hexes.map((hex: any) => {
                    const h = Hex.fromJSON(hex)
                    h.partId = json.id;
                    return h;
                })
            );

            part.calculateNeighbours();
            return part;
        }

        public toJSON(): any {
            return {
                id: this.id,
                tag: this.tag,
                title: this.title,
                hexes: this.hexes.map(hex => {
                    return {
                        key: {
                            idPart: this.id,
                            id: hex.id
                        },
                        q: hex.coords.q,
                        r: hex.coords.r,
                        s: hex.coords.s,
                    }
                })
            };
        }

        public calculateNeighbours() {
            const directions = CubeCoordinate.directions;

            for (let hex of this.hexes) {
                for (let direction of directions) {
                    const neighbour = this.hexes.find(h => h.coords.equals(hex.coords.add(direction)));

                    if (neighbour) {
                        hex.neighbors.push(neighbour);
                    }
                }
            }
        }
    }
}