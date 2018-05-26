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
import { findTransaction, fetchTransactions } from '../common/api';
import { AsyncRoute } from './AsyncRoute';

export interface IRoutes {
    [pathname: string]: SFC<{}>;
}

export const routes: IRoutes = {
    '/': () => <Redirect to="/order" />,
    '/order': () => <Order />,
    '/history': () => <AsyncRoute routePromise={orderHistory()} />,
    '/order-detail': () => <AsyncRoute routePromise={orderDetail()} />,
    '/user': () => <UserInfo />,
    '/login': () => <Login />,
    '/login/fb': () => <LoginFacebook />,
    '/logout': () => <Logout />,
    '/privacy-policy': () => <PrivacyPolicy />,
};

async function orderHistory(): Promise<ReactElement<{}>> {
    try {
        const transactions = await fetchTransactions();
        return <OrderHistory {...{ transactions }} />;
    } catch (error) {
        // TODO: Retry, display user feedback
        return <OrderHistory transactions={[]} />;
    }
}

async function orderDetail(): Promise<ReactElement<{}> | null> {
    const REDIRECT_DESTINATION = '/history';
    const { id } = browserHistory.query;
    if (!id) {
        return redirect(REDIRECT_DESTINATION);
    }
    try {
        const transaction = await findTransaction(id);
        if (!transaction) {
            return redirect(REDIRECT_DESTINATION);
        }
        return <OrderDetail {...{ transaction }} />;
    } catch (error) {
        console.error(error);
        return redirect(REDIRECT_DESTINATION);
    }
}

function redirect(destination: string) {
    browserHistory.push(destination);
    return null;
}
