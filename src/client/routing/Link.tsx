import React, { SyntheticEvent } from 'react';
import { SFC } from 'react';
import { browserHistory } from './browser-history';

export interface ILinkProps {
    to: string;
    className?: string;
}

export const NavLink: SFC<ILinkProps> = ({ to, children, ...props }) => {
    // TODO: Rerender on browserHistory change
    const isActive = to === document.location.pathname;
    const className = isActive ? 'active' : '' + (props.className || '');
    return (
        <a href={to} onClick={onClick(to)} {...{ ...props, className }}>
            {children}
        </a>
    );
};

export const Link: SFC<ILinkProps> = ({ to, children, ...props }) => (
    <a href={to} onClick={onClick(to)} {...props}>
        {children}
    </a>
);

function onClick(to: string) {
    return (event: SyntheticEvent<HTMLElement>) => {
        event.preventDefault();
        browserHistory.push(to);
    };
}
