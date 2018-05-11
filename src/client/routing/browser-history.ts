type ListenHandler = (path: string) => void;

class BrowserHistory {
    private callbacks: ListenHandler[] = [];

    constructor() {
        window.addEventListener('popstate', this.popStateHandler);
    }

    popStateHandler = (event: PopStateEvent) =>
        this.notify(document.location.pathname);

    public push(path: string) {
        window.history.pushState({}, '', path);
        this.notify(path);
    }

    public replace(path: string) {
        window.history.replaceState({}, '', path);
        this.notify(path);
    }

    public listen(callback: ListenHandler) {
        this.callbacks.push(callback);
    }

    private notify(path: string) {
        this.callbacks.forEach((callback) => callback(path));
    }
}

export const browserHistory = new BrowserHistory();