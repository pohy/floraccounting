import React, {Component} from 'react';
import './App.css';
import {post, get} from "../common/http";
import Item from '../../model/Item';
import Transaction from '../../model/Transaction';
import { Order } from '../order/Order';

class App extends Component {
    state = {
        transactions: [],
        items: [],
        bartenders: []
    };

    async componentDidMount() {
        const [transactions, items, bartenders] = await Promise.all([
            get('/transactions'),
            get('/items'),
            get('/bartenders')
        ]);
        this.setState({transactions, items, bartenders});
    }

    onSubmit = async (newTransaction) => {
        const {items, transactions} = this.state;
        let newItem = null;
        let itemOps = [];
        if (newTransaction.newItem) {
            // TODO: let the user konw, that new item has been created
            const {ops} = await post('/item', Item.fromData(newTransaction.newItem));
            itemOps = ops;
            [newItem] = ops;
        }
        const itemId = (newItem && newItem._id) || newTransaction.item;
        const {ops: transactionOps} = await post('/transaction', Transaction.fromData({...newTransaction, item: itemId}));
        this.setState({
            transactions: [...transactionOps, ...transactions],
            items: [...itemOps, ...items]
        });
    };

    render() {
        const {transactions, items, bartenders} = this.state;
        return (
            <div className="App">
                <Order />
            </div>
        );
    }
}

export default App;
