module Dashboard {

    export class Enemy {

        constructor(
            public id: number,
            public title: string,
            public tag: string,
            public description: string,
            public baseHealth: number,
            public baseDefence: number,
            public baseInitiative: number,
            // public usages: number,
            public actions: Action[],
            public effects: Effect[]
        ) {}

        public static fromJSON(json: any): Enemy {
            let actions: Action[] = [];
            for (let action of json.actions) {
                actions.push(Action.fromJSON(action.action));
            }

            let effects: Effect[] = [];
            for (let effect of json.effects) {
                effects.push(Effect.fromJSON(effect.effect));
            }

            return new Enemy(
                json.id,
                json.title,
                json.tag,
                json.description || "",
                json.baseHealth,
                json.baseDefence,
                json.baseInitiative,
                // json.usages,
                actions,
                effects
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                title: this.title,
                tag: this.tag,
                description: this.description,
                baseHealth: this.baseHealth,
                baseDamage: this.baseDefence,
                baseInitiative: this.baseInitiative,
                // usages: this.usages,
                actions: this.actions.map(action => {
                    return {
                        idEnemy: this.id,
                        idAction: action.id,
                        action: action.toJSON()
                    }
                }),
                effects: this.effects.map(effect => {
                    return {
                        idEnemy: this.id,
                        idEffect: effect.id,
                        effect: effect.toJSON()
                    }
                })
            };
        }
    }
}