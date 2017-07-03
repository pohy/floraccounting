import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import './TransactionForm.css';

class TransactionForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    };

    state = {
        item: new Item()
    };

    onInput = ({target: {value, name}}) => this.setState({item: {...this.state.item, [name]: value}});

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.item);
        this.setState({item: new Item()});
        this.itemInput.focus();
    };

    render() {
        const {item: {name, amount, price}} = this.state;

        return (
            <form
                onSubmit={this.onSubmit}
                onInput={this.onInput}
                className="TransactionForm"
            >
                <div className="row">
                    <label className="text-secondary">Item</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        autoFocus
                        ref={(input) => { this.itemInput = input; }}
                    />
                </div>
                <div className="row">
                    <label className="text-secondary">Amount</label>
                    <input type="number" name="amount" value={amount}/>
                    <label className="text-secondary">Pc.</label>
                </div>
                <div className="row">
                    <label className="text-secondary">Price</label>
                    <input type="number" name="price" value={price}/>
                    <label className="text-secondary">CZK</label>
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default TransactionForm;