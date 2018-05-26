import React from 'react';
import { ReactElement, Component } from 'react';
import { Loading } from '../components/Loading';

export interface IAsyncRouteProps {
    routePromise: Promise<ReactElement<{}> | null>;
}

export interface IAsyncRouteState {
    route?: ReactElement<{}> | null;
}

export class AsyncRoute extends Component<IAsyncRouteProps, IAsyncRouteState> {
    state = {
        route: null,
    };

    async componentDidMount() {
        const route = await this.props.routePromise;
        this.setState({ route });
    }

    render() {
        const { route } = this.state;
        return route ? (
            route
        ) : (
            <div className="flex-default grow center-content">
                <Loading />
            </div>
        );
    }
}
