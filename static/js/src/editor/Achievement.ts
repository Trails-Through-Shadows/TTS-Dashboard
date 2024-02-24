module Dashboard {

    export class Achievement {

        constructor(
            public id: number,
            public title: string,
            public description: string,
            public xpReward: number,
        ) {}

        public static fromJSON(json: any): Achievement {
            return new Achievement(
                json.id,
                json.title,
                json.description,
                json.xpReward
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                title: this.title,
                description: this.description,
                xpReward: this.xpReward
            };
        }

        public toCard(collapsed: boolean = false, remove: boolean = false, add: boolean = false): HTMLElement {
            const card = document.createElement('div');
            card.className = 'card bg-gray-100';

            card.innerHTML = `
                <div class="card-header px-3 py-2 pointer sticky-top bg-gray-100" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#achievement${this.id}" 
                    aria-expanded="true" 
                    aria-controls="#achievement${this.id}">
                    
                    <div class="row align-items-center">
                        <div class="col-md-10">${this.title}</div>
                        <div class="col-md-2 text-center">  
                            ${add ?
                                `<button class="btn btn-sm btn-outline-success ms-1" 
                                    data-id="${this.id}" 
                                    data-type="action" 
                                    data-action="add">
                                    
                                    <i class="fa-solid fa-plus"></i>
                                </button>` : ''
                            }
                                            
                            ${remove ?
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
                
                <div class="card-body collapse p-0 ${collapsed ? '' : 'show'}" data-bs-parent="#achievementsList" id="achievement${this.id}">
                    <ol class="list-group list-group-numbered py-2">
                        <li class="list-group-item bg-transparent font-small p-0 px-3"><b>Description:</b> ${this.description}</li>
                        <li class="list-group-item bg-transparent font-small p-0 px-3"><b>XP Reward:</b> ${this.xpReward}</li>
                    </ol>
                </div>`;

            return card;
        }
    }
}