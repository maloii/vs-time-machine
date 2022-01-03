export interface IConnector {
    connection: (params: Record<string, string>) => void;
    disconnect: () => void;
    send: (message: string) => void;
}
