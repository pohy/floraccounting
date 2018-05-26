import React from 'react';
import { SFC } from 'react';
import './OrderHistory.css';
import { Transaction } from '../../common/model/Transaction';
import { OrderEntry } from './OrderEntry';
import { Title } from '../routing/Title';

export interface IOrderHistoryProps {
    transactions: Transaction[];
}

export const OrderHistory: SFC<IOrderHistoryProps> = ({ transactions }) => (
    <div className="OrderHistory flex grow column">
        <Title>Order history</Title>
        {transactions.map((transaction, key) => (
            <OrderEntry {...{ transaction, key }} />
        ))}
    </div>
);
