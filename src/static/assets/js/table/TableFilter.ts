module Dashboard {

    export class TableFilter {
        private map: Map<Pair<string, string>, string>;

        constructor(list: string[]) {
            this.map = new Map(list.map(pairStr => {
                const [first, second] = pairStr.split(':');
                return [new Pair(first, second), null];
            }));
        }

        public set(key: string, value: string): void {
            const existingPair = Array.from(this.map.keys())
                .find(pair => pair.getFirst() === key);

            if (existingPair) {
                this.map.set(existingPair, value);
            }
        }

        toString(): string {
            return Array.from(this.map)
                .filter(([_, value]) => value !== null && value !== '')
                .map(([key, value]) => `${key.toString()}:${value}`)
                .join(',') || '';
        }
    }
}