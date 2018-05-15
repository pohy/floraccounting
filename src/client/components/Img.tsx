import * as React from 'react';
import { SFC } from 'react';
import { HTTP } from '../common/http';

export interface IImgProps {
    src: string;
    alt?: string;
    className?: string;
}

export const Img: SFC<IImgProps> = ({ src, ...props }) => {
    const url = src.includes('http') ? src : `${HTTP.ApiURL}/image/${src}`;
    return <img src={url} {...props} />;
};
