import React, {Component} from 'react';
import dateFormat from 'dateformat';
import './App.css';

const API_URL = 'http://localhost:3001';

class App extends Component {
    state = {
        item: {
            name: '',
            amount: 1,
            amountType: 'piece',
            price: 0,
            currency: 'CZK'
        },
        items: []
    };

    async componentDidMount() {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();
        this.setState({items})
    }

    onInput = ({target: {value, name}}) => this.setState({item: {...this.state.item, [name]: value}});

    onSubmit = async (event) => {
        event.preventDefault();
        const finalItem = {...this.state.item, created: new Date().toISOString()};
        const body = JSON.stringify(finalItem);
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
        this.setState({items: this.state.items.concat(ops)});
    };

    date = (dateString) => {
        const date = new Date(dateString);
        console.log(date.isValid())
        return dateFormat(date, 'HH:MM mm/dd/yyyy');
    };

    render() {
        const {item: {name, amount, price}, items} = this.state;
        return (
            <div className="App">
                <form onSubmit={this.onSubmit} onInput={this.onInput} className="form">
                    <div className="row">
                        <label className="text-secondary">Item</label>
                        <input type="text" name="name" value={name} className="input" autoFocus/>
                    </div>
                    <div className="row">
                        <label className="text-secondary">Amount</label>
                        <input type="number" name="amount" value={amount} className="input number"/>
                        <label className="text-secondary">Pc.</label>
                    </div>
                    <div className="row">
                        <label className="text-secondary">Price</label>
                        <input type="number" name="price" value={price} className="input number"/>
                        <label className="text-secondary">CZK</label>
                    </div>
                    <button type="submit">Submit</button>
                </form>
                <table className="records">
                    <thead>
                    <tr>
                        <td>Item name</td>
                        <td>Amount</td>
                        <td>Price</td>
                        <td>Date</td>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(({name, amount, price, created}, i) => (
                        <tr key={i}>
                            <td>{name}</td>
                            <td>{amount}</td>
                            <td>{price}</td>
                            <td>{this.date(created)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;
