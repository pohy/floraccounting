import React from 'react';
import { Component } from 'react';
import './App.css';
import { Order } from '../order/Order';
import { OrderHistory } from '../order-history/OrderHistory';
import { User } from '../../common/model/User';
import { get, authenticate, jwt } from '../common/http';
import jwt_decode from 'jwt-decode';

export enum Views {
    OrderHistory = 'History',
    Order = 'New order',
}

export interface IAppState {
    view: Views;
    user?: User;
}

export class App extends Component<{}, IAppState> {
    state = {
        view: Views.Order,
        user: undefined,
    };

    componentDidMount() {
        if (document.location.pathname === '/login/fb') {
            const codeMatch = document.location.search.match(/code=(.+)/);
            if (!codeMatch) {
                return;
            }
            const [, code] = codeMatch;
            this.authenticateUser(code);
            window.history.replaceState({}, '', '/');
        }
        if (jwt) {
            this.updateUserFromJWT(jwt);
        }
    }

    async authenticateUser(code: string) {
        const jwt = await get(`/login/fb/exchange?code=${code}`);
        authenticate(jwt);
        this.updateUserFromJWT(jwt);
    }

    updateUserFromJWT(jwt: string) {
        this.setState({ user: new User(jwt_decode(jwt)) });
    }

    changeView = (nextView: Views) => () => this.setState({ view: nextView });

    render() {
        const { view, user } = this.state;
        return (
            <div className="App flex column">
                {/* TODO: make view content scrollable, instead of the whole page */}
                <main className="view flex column grow">
                    {view === Views.Order && <Order {...{ user }} />}
                    {view === Views.OrderHistory && <OrderHistory />}
                </main>
                {/* TODO: fix navigation in it's place */}
                <footer className="navigation flex">
                    {Object.values(Views).map((viewName, key) => (
                        <button
                            className={`grow${
                                viewName === view ? ' primary' : ''
                            }`}
                            onClick={this.changeView(viewName)}
                            {...{ key }}
                        >
                            {viewName}
                        </button>
                    ))}
                </footer>
            </div>
        );
    }
}
