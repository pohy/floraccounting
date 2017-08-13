import React, {Component} from 'react';
import TransactionForm from '../transaction-form/TransactionForm.jsx';
import Records from '../records/Records';
import './App.css';
import {post, get} from "../common/http";
import Item from '../../model/Item';
import Transaction from '../../model/Transaction';

class App extends Component {
    state = {
        transactions: [],
        items: []
    };

    async componentDidMount() {
        // TODO: parallelize
        const transactions = await get('/transactions');
        const items = await get('/items');
        this.setState({transactions, items});
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
        const {transactions, items} = this.state;
        return (
            <div className="App">
                <TransactionForm onSubmit={this.onSubmit} {...{items}}/>
                <Records {...{transactions, items}}/>
            </div>
        );
    }
}

export default App;
