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
            public startHexes: Hex[] = [],
            public enemies: Enemy[] = [],
            public obstacles: Obstacle[] = [],
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
                    ? json.enemies.map((enemy: any) => {
                        const e = Dashboard.Enemy.fromJSON(enemy.enemy);
                        e.partId = enemy.key.idPart;

                        if (enemy.enemy.startingHex) {
                            e.coords = new CubeCoordinate(enemy.enemy.startingHex.q, enemy.enemy.startingHex.r, enemy.enemy.startingHex.s);
                        }

                        return e;
                    })
                    : null,
                json.obstacles && json.obstacles.length > 0
                    ? json.obstacles.map((obstacle: any) => {
                        const o = Dashboard.Obstacle.fromJSON(obstacle.obstacle)
                        o.partId = obstacle.key.idPart;

                        if (obstacle.obstacle.hex) {
                            o.coords = new CubeCoordinate(obstacle.obstacle.hex.q, obstacle.obstacle.hex.r, obstacle.obstacle.hex.s);
                        }

                        return o;
                    })
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
                parts: this.parts.map(part => {
                    return {
                        key: {
                            idLocation: this.id,
                            idPart: part.id
                        },
                        part: part.toJSON()
                    }
                }),
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
                }),
                startHexes: this.startHexes
                    ? this.startHexes.map(hex => {
                        return {
                            idLocation: this.id,
                            idPart: hex.partId,
                            idHex: hex.id
                        }
                    })
                    : [],
                enemies: this.enemies
                    ? this.enemies.map(enemy => {
                        return {
                            key: {
                                idLocation: this.id,
                                idPart: enemy.partId
                            },
                            enemy: enemy.toJSON()
                        }
                    })
                    : [],
                obstacles: this.obstacles
                    ? this.obstacles.map(obstacle => {
                        return {
                            key: {
                                idLocation: this.id,
                                idPart: obstacle.partId
                            },
                            obstacle: obstacle.toJSON()
                        }
                    })
                    : [],
            };
        }

        public toCard(collapsed: boolean = false, removeCallback: Function = null, addCallback: Function = null): HTMLElement {
            const card = document.createElement('div');
            card.className = 'card bg-gray-100';

            card.innerHTML = `
                <div class="card-header px-3 py-2 pointer sticky-top bg-gray-100" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#enemy${this.id}" 
                    aria-expanded="true" 
                    aria-controls="#enemy${this.id}">
                    
                    <div class="row align-items-center">
                        <div class="col-md-8">${this.title}</div>
                        <div class="col-md-4 text-end" id="cardActions">
                            
                        ${addCallback ?
                            `<button class="btn btn-sm btn-outline-success ms-1" 
                                data-id="${this.id}" 
                                data-type="action" 
                                data-action="add">
                                
                                <i class="fa-solid fa-plus"></i>
                            </button>` : ''
                        }
                            
                        ${removeCallback ?
                            `<button class="btn btn-sm btn-outline-danger ms-1" 
                                data-id="${this.id}" 
                                data-type="action" 
                                data-action="remove">
                                
                                <i class="fa-solid fa-trash"></i>
                            </button>` : ''
                        }
                        </div>
                    </div>
                </div>
            `;

            if (removeCallback) {
                const removeButtons = card.querySelectorAll('[data-action="remove"]');
                removeButtons.forEach((removeButton) => {
                    removeButton.addEventListener('click', (event: Event) => {
                        const id = removeButton.getAttribute('data-id');
                        removeCallback(event, parseInt(id));
                    });
                });
            }

            if (addCallback) {
                const addButtons = card.querySelectorAll('[data-action="add"]');
                addButtons.forEach((addButton) => {
                    addButton.addEventListener('click', (event: Event) => {
                        const id = addButton.getAttribute('data-id');
                        addCallback(event, parseInt(id));
                    });
                });
            }

            return card;
        }
    }
}