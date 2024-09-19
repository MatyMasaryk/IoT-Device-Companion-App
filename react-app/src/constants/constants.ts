let serverUrl = localStorage.getItem('serverUrl') ? localStorage.getItem('serverUrl')?.toString() : 'http://localhost:5000';
const setServerUrl = (value: string) => {
    serverUrl = value;
}

export {serverUrl, setServerUrl}