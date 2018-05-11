import React, { SyntheticEvent } from 'react';
import { SFC } from 'react';
import { browserHistory } from './browser-history';

export interface ILinkProps {
    to: string;
    className?: string;
}

export const Link: SFC<ILinkProps> = ({ to, children, ...props }) => (
    <a href={to} onClick={onLinkClick(to)} {...props}>
        {children}
    </a>
);

export function onLinkClick(to: string) {
    return (event: SyntheticEvent<HTMLElement>) => {
        event.preventDefault();
        browserHistory.push(to);
    };
}
