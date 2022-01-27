import { useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    wait: number
): (...args: any[]) => void {
    const argsRef = useRef<any[]>();
    const timeout = useRef<null | ReturnType<typeof setTimeout>>(null);

    function cleanup(): void {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }

    useEffect(() => cleanup, []);

    return function debouncedCallback(...args: any[]) {
        argsRef.current = args;
        cleanup();
        timeout.current = setTimeout(() => {
            if (argsRef.current) {
                callback(...argsRef.current);
            }
        }, wait);
    };
}
