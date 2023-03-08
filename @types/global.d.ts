export {};

declare global {
    interface Window {
        api: any;
        mediaStream: MediaStream | undefined;
    }
}
