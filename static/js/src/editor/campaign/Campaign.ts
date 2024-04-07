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
                            location: Location.fromJSON(list.location),
                            path: [] // Later
                        }
                    })
                    : null
            );

            // Find path // TODO: Žožeee
            // const jsonPath = json.path;
            // for (let jsonPathPart of jsonPath) {
            //     const fromLocation = campaign.locations.find(location => location.location.id === jsonPathPart.key.idStart);
            //     const toLocation = campaign.locations.find(location => location.location.id === jsonPathPart.key.ifEnd);
            //
            //     if (fromLocation && toLocation) {
            //         fromLocation.path.push(toLocation);
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