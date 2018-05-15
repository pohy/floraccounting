import { SFC } from 'react';
import { initSmartlook } from './smart-look';

export const Analytics: SFC<{}> = () => {
    if (true || process.env.NODE_ENV === 'production') {
        initSmartlook();
    }
    return null;
};
