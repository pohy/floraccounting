import { Component } from 'react';
import { browserHistory } from './browser-history';

export interface IRedirectProps {
    to: string;
}

export class Redirect extends Component<IRedirectProps, {}> {
    componentDidMount() {
        browserHistory.push(this.props.to, {
            from: document.location.pathname,
        });
    }

    render() {
        return null;
    }
}
