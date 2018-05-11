import * as React from 'react';
import { Component, Fragment } from 'react';
import './App.css';
import { Routes } from '../routing/Routes';
import { Order } from '../order/Order';
import { OrderHistory } from '../order-history/OrderHistory';
import { User } from '../../common/model/User';
import { get, authenticate, jwt } from '../common/http';
import jwt_decode from 'jwt-decode';
import { NavLink } from '../routing/Link';
import { AuthConsumer, AuthProvider } from '../user/AuthContext';

export class App extends Component<{}, {}> {
    render() {
        return (
            <AuthProvider>
                <div className="App flex column">
                    <main className="view flex column grow">
                        <Routes />
                    </main>
                    {/* TODO: fix navigation in it's place */}
                    <footer className="navigation flex">
                        {/* TODO: className */}
                        <NavLink to="/history">History</NavLink>
                        <AuthConsumer>
                            {({ user }) =>
                                user ? (
                                    <Fragment>
                                        <NavLink to="/order">New order</NavLink>
                                        <NavLink to="/user">Me</NavLink>
                                    </Fragment>
                                ) : (
                                    <NavLink to="/login">Login</NavLink>
                                )
                            }
                        </AuthConsumer>
                    </footer>
                </div>
            </AuthProvider>
        );
    }
}
