import * as React from 'react';
import { SFC } from 'react';
import './Loading.css';

export interface ILoadingProps {
    large?: boolean;
}

export const Loading: SFC<ILoadingProps> = ({ large = false }) => (
    <div className={`Loading${large ? ' large' : ''}`}>
        <div />
        <div />
    </div>
);
