import React from 'react';
import { Component } from 'react';
import './App.css';
import { Order } from '../order/Order';
import { OrderHistory } from '../order-history/OrderHistory';

export enum Views {
    OrderHistory = 'History',
    Order = 'New order',
}

export interface IAppState {
    view: Views;
}

export class App extends Component<{}, IAppState> {
    state = {
        view: Views.Order,
    };

    changeView = (nextView: Views) => () => this.setState({ view: nextView });

    render() {
        const { view } = this.state;
        return (
            <div className="App flex column">
                {/* TODO: make view content scrollable, instead of the whole page */}
                <main className="view flex column grow">
                    {view === Views.Order && <Order />}
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
