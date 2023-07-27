export const getSettingValue = <T>(key: string): Promise<T> => {
    return window.api.ipcRenderer.invoke('get-setting-value', key);
};

export const setSettingValue = <T>(key: string, value: T): Promise<void> => {
    return window.api.ipcRenderer.invoke('set-setting-value', key, value);
};

export const getWindowsVoices = (): Promise<string[]> => {
    return window.api.ipcRenderer.invoke('get-windows-voices');
};
