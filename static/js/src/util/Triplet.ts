module Dashboard {

    export class Triplet<A, B, C> {
        private readonly first: A;
        private readonly second: B;
        private readonly third: C;

        constructor(first: A, second: B, third: C) {
            this.first = first;
            this.second = second;
            this.third = third;
        }

        public getFirst(): A {
            return this.first;
        }

        public getSecond(): B {
            return this.second;
        }

        public getThird(): C {
            return this.third;
        }

        toString(): string {
            return `${this.first}:${this.second}:${this.third}`;
        }
    }
}