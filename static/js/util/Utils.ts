module Dashboard {

    export type Function = (...args: any[]) => any;

    export function debounce(func: Function, wait: number, immediate?: boolean): Function {
        let timeout: number;

        return function() {
            const context = this;
            const args = arguments;

            const later = () => {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };

            const callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                func.apply(context, args);
            }
        };
    }

}