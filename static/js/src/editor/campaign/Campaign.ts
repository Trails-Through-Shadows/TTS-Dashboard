module Dashboard {

    export type WinCondition = {
        type: "ENEMY_DEATHS" | "ROUND_REACHED" | "PLAYER_DEATHS",
        value: number,
        result: "COMPLETED" | "FAILED"
    }

    export type CampaignLocation = {
        start: boolean,
        finish: boolean,
        stories: any[],
        path: any[],
        conditions: WinCondition[],
        location: Location
    };

    export class Campaign {

        constructor(
            public id: number,
            public title: string,
            public description: string,
            public achievements: Achievement[],
            public locations: CampaignLocation[]
        ) {}

        public static fromJSON(json: any): Campaign {
            const campaign =  new Campaign(
                json.id,
                json.title,
                json.description,
                json.achievements
                    ? json.achievements.map((list: any) => Achievement.fromJSON(list.achievement))
                    : null,
                json.locations
                    ? json.locations.map((list: any) => {
                        return {
                            start: list.start,
                            finish: list.finish,
                            stories: list.stories ?
                                list.stories.map((story: any) => Story.fromJSON(story))
                                : null,
                            conditions: list.conditions ?
                                list.conditions.map((condition: any) => {
                                    return {
                                        type: condition.type,
                                        value: condition.value,
                                        result: condition.result
                                    };
                                })
                                : null,
                            location: Location.fromJSON(list.location)
                        }
                    })
                    : null
            );

            // // Find path // TODO: Žožeee
            // for (let campLoc of campaign.locations) {
            //     const location = campLoc.location;
            //
            //     if (location.path.length > 0) {
            //         for (let i = 0; i < location.path.length; i++) {
            //             const next = campaign.locations.find(loc => loc.location.id === location.path[i]);
            //
            //             if (next) {
            //                 location.path.push(next);
            //                 console.log("Found path");
            //             }
            //         }
            //     }
            // }

            return campaign;
        }

        public toJSON(): any {
            return {
                id: this.id,
                title: this.title,
                description: this.description,
                achievements: this.achievements.map(achievement => achievement.toJSON()),
                locations: this.locations.map(location => {
                    return {
                        id: location.location.id,
                        idCampaign: this.id,

                        location: location.location.toJSON(),
                        start: location.start,
                        finish: location.finish,
                        stories: location.stories,
                        conditions: location.conditions
                    }
                })
            };
        }
    }
}