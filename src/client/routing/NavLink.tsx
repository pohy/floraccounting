import * as React from 'react';
import { Component } from 'react';
import { ILinkProps, onLinkClick } from './Link';
import { browserHistory } from './browser-history';

export interface INavLinkState {
    isActive: boolean;
}

export class NavLink extends Component<ILinkProps, INavLinkState> {
    state = {
        isActive: document.location.pathname === this.props.to,
    };

    componentDidMount() {
        browserHistory.listen(this.onRouteChange);
    }

    onRouteChange = (route: string) => {
        this.setState({ isActive: route === this.props.to });
    };

    render() {
        const { to, className, children } = this.props;
        const { isActive } = this.state;
        const linkClassName = (isActive ? 'active ' : '') + (className || '');
        return (
            <a href={to} onClick={onLinkClick(to)} className={linkClassName}>
                {children}
            </a>
        );
    }
}
