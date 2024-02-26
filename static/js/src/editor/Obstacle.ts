module Dashboard {

    export class Obstacle {

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
            console.log(json);

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
    }
}