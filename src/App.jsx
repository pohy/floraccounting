import React, {Component} from 'react';
import TransactionForm from './TransactionForm.jsx';
import Records from './Records';
import './App.css';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://floraccounting.pohy.eu'
    : 'http://localhost:3001';

class App extends Component {
    state = {
        transactions: [],
        items: []
    };

    async componentDidMount() {
        const transactions = await this.fetch('/transactions');
        const items = await this.fetch('/items');
        this.setState({transactions, items});
    }

    async fetch(endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`);
        return await response.json();
    }

    onSubmit = async (item) => {
        const body = JSON.stringify(item);
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        };
        const response = await fetch(`${API_URL}/transaction`, options);
        const {ops} = await response.json();
        this.setState({
            transactions: [...ops, ...this.state.transactions]
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
