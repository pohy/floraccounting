import * as React from 'react';
import { SFC } from 'react';
import { API_URL } from './http';

export interface IImgProps {
    src: string;
    alt?: string;
    className?: string;
}

export const Img: SFC<IImgProps> = ({ src, ...props }) => {
    const url = src.includes('http') ? src : `${API_URL}/image/${src}`;
    return <img src={url} {...props} />;
};
