module Dashboard {

    export class Story {

        constructor(
            public id: number,
            public trigger: string,
            public story: string,
        ) {}

        public static fromJSON(json: any): Story {
            return new Story(
                json.id,
                json.trigger,
                json.story
            );
        }

        public toJSON(): any {
            return {
                id: this.id,
                trigger: this.trigger,
                story: this.story
            };
        }
    }
}