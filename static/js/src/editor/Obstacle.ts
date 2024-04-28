module Dashboard {

    export class Obstacle {
        partId: number = 0;
        coords: CubeCoordinate = null;

        constructor(
            public id: number,
            public title: string,
            public tag: string,
            public description: string,
            public baseDamage: number,
            public baseHealth: number,
            public crossable: boolean,
            public effects: Effect[],
            public url: string = ""
        ) {}

        public static fromJSON(json: any): Obstacle {
            let effects: Effect[] = [];
            for (let effect of json.effects) {
                effects.push(Effect.fromJSON(effect.effect));
            }

            return new Obstacle(
                json.id,
                json.title,
                json.tag,
                json.description || "",
                json.baseDamage,
                json.baseHealth,
                json.crossable == "true",
                effects,
                json.url || ""
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                title: this.title,
                tag: this.tag,
                description: this.description,
                baseDamage: this.baseDamage,
                baseHealth: this.baseHealth,
                crossable: this.crossable,
                effects: this.effects.map(effect => {
                    return {
                        key: {
                            idEnemy: this.id,
                            idEffect: effect.id
                        },
                        effect: effect.toJSON()
                    }
                })
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
                
                <div class="card-body collapse p-0 ${collapsed ? '' : 'show'}" 
                    data-bs-parent="#enemyActionsList" 
                    id="enemy${this.id}">
                    
                    <ol class="list-group list-group-numbered py-2" id="actionAttributes">
                        ${this.description ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Description:</b> ${this.description}</li>` : ''
                        }
                        
                        ${this.baseHealth ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Health:</b> ${this.baseHealth}</li>` : ''
                        }
                        
                        ${this.baseDamage ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Damage:</b> ${this.baseDamage}</li>` : ''
                        }
                        
                        ${this.crossable ?
                            `<li class="list-group-item bg-transparent font-small p-0 px-3"><b>Crossable:</b> ${this.crossable}</li>` : ''
                        }
                    </ol>
                </div>
            `;

            // Add event listener to all carets
            const carets = card.querySelectorAll('.caret');
            for (let i = 0; i < carets.length; i++) {
                carets[i].innerHTML = 'Click to Expand';

                // If carets is empty
                if (carets[i].nextElementSibling.children.length === 0) {
                    carets[i].classList.add('empty');
                    carets[i].innerHTML = 'No Data';
                } else {
                    carets[i].addEventListener('click', () => {
                        const nested = carets[i].nextElementSibling;
                        nested.classList.toggle('active');
                        carets[i].classList.toggle('caret-down');
                        carets[i].innerHTML = nested.classList.contains('active') ? 'Click to Collapse' : 'Click to Expand';
                    });
                }
            }

            const attributes = card.querySelector('#actionAttributes');
            if (attributes.children.length === 0) {
                attributes.insertAdjacentHTML('beforeend', `
                <ul class="nested show active p-0">
                    <li class="bg-transparent font-small text-center">No Data</li>
                </ul>`);
            }

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