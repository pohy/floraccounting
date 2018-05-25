import React from 'react';
import { Component } from 'react';
import './OrderHistory.css';
import { Transaction } from '../../common/model/Transaction';
import { fetchTransactions } from '../common/api';
import { OrderEntry } from './OrderEntry';
import { Title } from '../routing/Title';
import { Loading } from '../components/Loading';

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
            <div className="OrderHistory flex grow column">
                <Title>Order history</Title>
                {this.state.transactions.length ? (
                    this.state.transactions.map((transaction, key) => (
                        <OrderEntry {...{ transaction, key }} />
                    ))
                ) : (
                    <div className="flex grow center-content">
                        <Loading />
                    </div>
                )}
            </div>
        );
    }
}
