export function debounce(callback: ({...params}) => any, delay: number) {
    let timeoutId: number;

    return function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, delay);
    }
}