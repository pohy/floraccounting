type ListenHandler = (path: string, state: any) => void;

export interface IQuery {
    [name: string]: string | undefined;
}

class BrowserHistory {
    private callbacks: ListenHandler[] = [];
    private internalLastState: any = {};

    constructor() {
        window.addEventListener('popstate', this.popStateHandler);
    }

    popStateHandler = (event: PopStateEvent) =>
        this.notify(document.location.pathname, event.state);

    public push(path: string, state: any = {}) {
        window.history.pushState(state, '', path);
        this.notify(path, state);
    }

    public replace(path: string, state: any = {}) {
        window.history.replaceState(state, '', path);
        this.notify(path, state);
    }

    public listen(callback: ListenHandler) {
        this.callbacks.push(callback);
    }

    public get lastState() {
        return this.internalLastState;
    }

    public get query() {
        let queryObject: IQuery = {};
        const queryString = document.location.search;
        queryString.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            ($0, $1, $2, $3) => (queryObject[$1] = $3),
        );
        return queryObject;
    }

    private notify(path: string, state: any = {}) {
        this.internalLastState = state;
        this.callbacks.forEach((callback) => callback(path, state));
    }
}

export const browserHistory = new BrowserHistory();
