import * as React from 'react';
import { Component, SFC } from 'react';
import { routes } from './route-config';
import { browserHistory } from '../routing/browser-history';
import pathToRegexp from 'path-to-regexp';

export interface IRoutesState {
    route: SFC<{}> | null;
}

export class Routes extends Component<{}, IRoutesState> {
    state = {
        route: this.route,
    };

    constructor(props: {}) {
        super(props);
        browserHistory.listen(this.onHistoryChange);
    }

    onHistoryChange = () => {
        this.setState({ route: this.route });
    };

    get route() {
        const { pathname } = document.location;
        const route = Object.keys(routes).find(
            (route) => !!pathToRegexp(route).exec(pathname),
        );
        console.log(route);
        return route ? routes[route] : null;
    }

    render() {
        const Route = this.state.route;

        if (!Route) {
            return <h1>Not found</h1>;
        }
        return <Route />;
    }
}
