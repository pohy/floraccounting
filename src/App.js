import React, {Component} from 'react';
import './App.css';

const API_URL = 'http://localhost:3001';

class App extends Component {
    state = {
        item: {
            name: 'Datle',
            amount: 15,
            price: 120
        },
        items: []
    };

    async componentDidMount() {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();
        console.log(items)
        this.setState({items})
    }

    onInput = ({target: {value, name}}) => this.setState({item: {[name]: value}});

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
        const result = await fetch(`${API_URL}/item`, options);
        console.log(result)
    };

    render() {
        const {item: {name, amount, price}, items} = this.state;
        return (
            <div className="App">
                <form onSubmit={this.onSubmit} onInput={this.onInput} className="form">
                    <input type="text" name="name" placeholder="Item" value={name} className="input" autoFocus/>
                    <input type="number" name="amount" placeholder="Amount" value={amount} className="input number"/>
                    <input type="number" name="price" placeholder="Price" value={price} className="input number"/>
                    <button type="submit" className="input">Submit</button>
                    {/*TODO: currency*/}
                </form>
                <table>
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
                            <td>{created}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;
