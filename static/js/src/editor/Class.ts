module Dashboard {

    export class Clazz {

        constructor(
            public id: number,
            public title: string,
            public tag: string,
            public description: string,
            public baseHealth: number,
            public baseDefence: number,
            public baseInitiative: number,
            public actions: Action[],
            public effects: Effect[],
            public url: string = ""
        ) {}

        public static fromJSON(json: any): Clazz {
            let actions: Action[] = [];
            for (let action of json.actions) {
                actions.push(Action.fromJSON(action.action));
            }

            let effects: Effect[] = [];
            for (let effect of json.effects) {
                effects.push(Effect.fromJSON(effect.effect));
            }

            return new Clazz(
                json.id,
                json.title,
                json.tag,
                json.description || "",
                json.baseHealth,
                json.baseDefence,
                json.baseInitiative,
                actions,
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
                baseHealth: this.baseHealth,
                baseDefence: this.baseDefence,
                baseInitiative: this.baseInitiative,
                actions: this.actions.map(action => {
                    return {
                        key: {
                            idClass: this.id,
                            idAction: action.id
                        },
                        action: action.toJSON()
                    }
                }),
                effects: this.effects.map(effect => {
                    return {
                        key: {
                            idClass: this.id,
                            idEffect: effect.id
                        },
                        effect: effect.toJSON()
                    }
                })
            };
        }
    }
}