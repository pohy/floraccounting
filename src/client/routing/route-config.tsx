import * as React from 'react';
import { SFC } from 'react';
import { Redirect } from './Redirect';
import { Order } from '../order/Order';
import { OrderHistory } from '../order-history/OrderHistory';
import { UserInfo } from '../user/UserInfo';
import { LoginFacebook } from '../user/LoginFacebook';
import { Login } from '../user/Login';
import { Logout } from '../user/Logout';
import { PrivacyPolicy } from '../app/PrivacyPolicy';

export interface IRoutes {
    [pathname: string]: SFC<{}>;
}

export const routes: IRoutes = {
    '/': () => <Redirect to="/order" />,
    '/order': () => <Order />,
    '/history': () => <OrderHistory />,
    '/user': () => <UserInfo />,
    '/login': () => <Login />,
    '/login/fb': () => <LoginFacebook />,
    '/logout': () => <Logout />,
    '/privacy-policy': () => <PrivacyPolicy />,
};
