import * as React from 'react';
import { SFC, ReactElement } from 'react';
import { Redirect } from './Redirect';
import { Order } from '../order/Order';
import { OrderHistory } from '../order-history/OrderHistory';
import { UserInfo } from '../user/UserInfo';
import { LoginFacebook } from '../user/LoginFacebook';
import { Login } from '../user/Login';
import { Logout } from '../user/Logout';
import { PrivacyPolicy } from '../app/PrivacyPolicy';
import { OrderDetail } from '../order-history/OrderDetail';
import { browserHistory } from './browser-history';
import { findTransaction } from '../common/api';
import { AsyncRoute } from './AsyncRoute';

export interface IRoutes {
    [pathname: string]: SFC<{}>;
}

export const routes: IRoutes = {
    '/': () => <Redirect to="/order" />,
    '/order': () => <Order />,
    '/history': () => <OrderHistory />,
    '/order-detail': () => <AsyncRoute routePromise={orderDetail()} />,
    '/user': () => <UserInfo />,
    '/login': () => <Login />,
    '/login/fb': () => <LoginFacebook />,
    '/logout': () => <Logout />,
    '/privacy-policy': () => <PrivacyPolicy />,
};

async function orderDetail(): Promise<ReactElement<{}> | null> {
    const REDIRECT = '/history';
    const { id } = browserHistory.query;
    if (!id) {
        browserHistory.push(REDIRECT);
        return null;
    }
    const transaction = await findTransaction(id);
    if (!transaction) {
        browserHistory.push(REDIRECT);
        return null;
    }
    return <OrderDetail {...{ transaction }} />;
}
