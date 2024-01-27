module Dashboard {

    type Callback = (...args: any[]) => any;

    /**
     * Debounce function to prevent multiple calls to a function within a given time frame
     * @param callback callback function
     * @param wait time to wait before calling function again
     * @param immediate whether to call the function at the start of the wait period
     */
    export function debounce(callback: Function, wait: number, immediate?: boolean): Callback {
        let timeout: number;

        return function() {
            const context = this;
            const args = arguments;

            const later = () => {
                timeout = null;

                if (!immediate) {
                    callback.apply(context, args);
                }
            };

            const callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                callback.apply(context, args);
            }
        };
    }

}