import { SFC } from 'react';

const SUFFIX = ' | Floraccounting';

export interface ITitleProps {
    children: string;
}

export const Title: SFC<ITitleProps> = ({ children: title }) => {
    document.title = title + SUFFIX;
    return null;
};
