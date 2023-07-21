const keys = ['error', 'warn'];

export const disableConsole = () => {
    for (let i = 0; i < keys.length; i++) {
        jest.spyOn(console, keys[i]).mockImplementation(() => {});
    }
}

export const enableConsole = () => {
    for (let i = 0; i < keys.length; i++) {
        console[keys[i]].mockRestore();
    }
}