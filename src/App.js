import React, {Component} from 'react';
import dateFormat from 'dateformat';
import './App.css';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://floraccounting.pohy.eu'
    : 'http://localhost:3001';

class Item {
    constructor(name = '', amount = 1, amountType = 'piece', price = 0, currency = 'CZK') {
        this.name = name;
        this.amount = amount;
        this.amountType = amountType;
        this.price = price;
        this.currency = currency;
    }

    static fromData({name, amount, amountType, price, currency}) {
        return new Item(name, amount, amountType, price, currency);
    }
}

class App extends Component {
    state = {
        item: new Item(),
        items: []
    };

    async componentDidMount() {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();
        this.setState({items})
    }

    onInput = ({target: {value, name}}) => this.setState({item: {...this.state.item, [name]: value}});

    onSubmit = async (event) => {
        const {item, items} = this.state;
        event.preventDefault();
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
            items: [...ops, ...items],
            item: new Item()
        });
        this.itemInput.focus();
    };

    formatDate = (dateString, format) => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        return dateFormat(date, format);
    };

    render() {
        const {item: {name, amount, price}, items} = this.state;
        return (
            <div className="App">
                <form onSubmit={this.onSubmit} onInput={this.onInput} className="form">
                    <div className="row">
                        <label className="text-secondary">Item</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            className="input"
                            autoFocus
                            ref={(input) => { this.itemInput = input; }}
                        />
                    </div>
                    <div className="row">
                        <label className="text-secondary">Amount</label>
                        <input type="number" name="amount" value={amount} className="input"/>
                        <label className="text-secondary">Pc.</label>
                    </div>
                    <div className="row">
                        <label className="text-secondary">Price</label>
                        <input type="number" name="price" value={price} className="input"/>
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
                        <td className="time">Time</td>
                        <td className="date">Date</td>
                    </tr>
                    </thead>
                    <tbody>
                    {!items.length && <tr><td>No items yet...</td></tr>}
                    {items.map(({name, amount, price, created}, i) => (
                        <tr key={i}>
                            <td>{name}</td>
                            <td>{amount}</td>
                            <td>{price}</td>
                            <td className="time">{this.formatDate(created, 'HH:MM')}</td>
                            <td className="date">{this.formatDate(created, 'mm/dd/yyyy')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;
