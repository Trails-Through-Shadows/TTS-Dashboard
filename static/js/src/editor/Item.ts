module Dashboard {

    export enum ItemType {
        WEAPON,
        HELMET,
        CHESTPLATE,
        LEGGINGS,
        BOOTS,
        ACCESSORY,
        CONSUMABLE
    }

    export class Item {

        constructor(
            public id: number,
            public type: ItemType,
            public title: string,
            public tag: string,
            public description: string,
            public requirements: string,
            public action: Action,
            public effects: Effect[],
            public url: string = ""
        ) {}

        public static fromJSON(json: any): Item {
            let effects: Effect[] = [];
            for (let effect of json.effects) {
                effects.push(Effect.fromJSON(effect.effect));
            }

            return new Item(
                json.id,
                json.type,
                json.title,
                json.tag,
                json.description || "",
                json.requirements || "",
                json.action ? Action.fromJSON(json.action) : null,
                effects,
                json.url || ""
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                type: this.type,
                title: this.title,
                tag: this.tag,
                description: this.description,
                requirements: this.requirements,
                action: this.action ? this.action.toJSON() : null,
                effects: this.effects.map(effect => {
                    return {
                        key: {
                            idItem: this.id,
                            idEffect: effect.id
                        },
                        effect: effect.toJSON()
                    }
                })
            };
        }
    }
}