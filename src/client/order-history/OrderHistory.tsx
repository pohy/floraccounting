import React from 'react';
import { Component } from 'react';
import './OrderHistory.css';
import { Transaction } from '../../common/model/Transaction';
import { fetchTransactions } from '../common/api';
import { OrderEntry } from './OrderEntry';

export interface IOrderHistoryState {
    transactions: Transaction[];
}

export class OrderHistory extends Component<{}, IOrderHistoryState> {
    state = {
        transactions: new Array<Transaction>(),
    };

    async componentDidMount() {
        this.setState({ transactions: await fetchTransactions() });
    }

    render() {
        return (
            <div className="OrderHistory">
                {this.state.transactions.map((transaction, key) => (
                    <OrderEntry {...{ transaction, key }} />
                ))}
            </div>
        );
    }
}
