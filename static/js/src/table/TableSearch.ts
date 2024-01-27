module Dashboard {

    export class TableSearch {

        constructor(
            private readonly onSearch: Function,
            private readonly onFilter: Function,
        ) {
            const pageUrl = new URL(window.location.href);
            this.set(decodeURIComponent(pageUrl.searchParams.get('search')));
        }

        public set(input: string) {
            this.onSearch(input);
        }

        public get(): string {
            return this.onFilter();
        }

        public updateURL(): void {
            const pageUrl = new URL(window.location.href);
            this.get() ? pageUrl.searchParams.set('search', this.get()) : pageUrl.searchParams.delete('search');
            window.history.replaceState({}, '', pageUrl.toString());
        }
    }
}