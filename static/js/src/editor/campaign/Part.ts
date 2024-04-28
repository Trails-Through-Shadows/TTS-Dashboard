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