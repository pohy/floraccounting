import React, {Component} from 'react';
import TransactionForm from './TransactionForm.jsx';
import Records from './Records';
import './App.css';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://floraccounting.pohy.eu'
    : 'http://localhost:3001';

class App extends Component {
    state = {
        items: []
    };

    async componentDidMount() {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();
        this.setState({items})
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
        const response = await fetch(`${API_URL}/item`, options);
        const {ops} = await response.json();
        this.setState({
            items: [...ops, ...this.state.items]
        });
    };

    render() {
        const {items} = this.state;
        return (
            <div className="App">
                <TransactionForm onSubmit={this.onSubmit}/>
                <Records items={items}/>
            </div>
        );
    }
}

export default App;
