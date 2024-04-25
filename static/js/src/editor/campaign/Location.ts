module Dashboard {

    export enum LocationType {
        CITY,
        DUNGEON,
        MARKET,
        QUEST
    }

    export interface Door {
        from: Part,
        to: Part,
        cords: CubeCoordinate
    }

    export class Location {

        constructor(
            public id: number,
            public title: string,
            public tag: string,
            public type: LocationType,
            public description: string,
            public parts: Part[],
            public doors: Door[],
            public startHexes: Hex[],
            public enemies: Enemy[],
            public obstacles: Obstacle[],
            public paths: any[] = [],
            public stories: any[] = [],
        ) {}

        public static fromJSON(json: any): Location {
            const location = new Location(
                json.id,
                json.title,
                json.tag,
                json.type,
                json.description || "",
                json.parts
                    ? json.parts.map((part: any) => Dashboard.Part.fromJSON(part.part))
                    : null,
                [], // Later
                [], // Later
                json.enemies && json.enemies.length > 0
                    ? json.enemies.map((enemy: any) => Dashboard.Enemy.fromJSON(enemy.enemy))
                    : null,
                json.obstacles && json.obstacles.length > 0
                    ? json.obstacles.map((obstacle: any) => Dashboard.Obstacle.fromJSON(obstacle.obstacle))
                    : null,
                json.paths,
                json.stories && json.stories.length > 0
                    ? json.stories.map((story: any) => Dashboard.Story.fromJSON(story))
                    : null
            );

            // Find doors
            const jsonDoors = json.doors;
            for (let jsonDoor of jsonDoors) {
                const fromPart = location.parts.find(part => part.id === jsonDoor.key.idPartFrom);
                const toPart = location.parts.find(part => part.id === jsonDoor.key.idPartTo);

                if (fromPart && toPart) {
                    location.doors.push({
                        from: fromPart,
                        to: toPart,
                        cords: new CubeCoordinate(jsonDoor.q, jsonDoor.r, jsonDoor.s)
                    });
                }
            }

            // Find start hexes
            const startHexes = json.startHexes;
            for (let startHex of startHexes) {
                const idPart = location.parts.find(part => part.id === startHex.idPart);

                if (idPart) {
                    const idHex = idPart.hexes.find(hex => hex.id === startHex.idHex);

                    if (idHex) {
                        location.startHexes.push(idHex);
                    }
                }
            }

            return location;
        }

        public toJSON(): any {
            return {
                id: this.id,
                title: this.title,
                tag: this.tag,
                type: this.type,
                description: this.description,
                parts: this.parts.map(part => part.toJSON()),
                doors: this.doors.map(door => {
                    return {
                        key: {
                            idLocation: this.id,
                            idPartFrom: door.from.id,
                            idPartTo: door.to.id
                        },
                        q: door.cords.q,
                        r: door.cords.r,
                        s: door.cords.s
                    }
                })
            };
        }
    }
}