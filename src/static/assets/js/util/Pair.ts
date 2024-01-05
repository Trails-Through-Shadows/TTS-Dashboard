module Dashboard {
    export class Pair<A, B> {
        private readonly first: A;
        private readonly second: B;

        constructor(first: A, second: B) {
            this.first = first;
            this.second = second;
        }

        public getFirst(): A {
            return this.first;
        }

        public getSecond(): B {
            return this.second;
        }

        toString(): string {
            return `${this.first}:${this.second}`;
        }
    }
}