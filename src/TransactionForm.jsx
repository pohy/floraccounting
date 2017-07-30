import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Transaction from './Transaction';
import './TransactionForm.css';

class TransactionForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired
    };

    state = {
        transaction: new Transaction(),
        currentItem: null
    };

    onInput = ({target: {value, name}}) => this.updateTransaction(name, value);

    onSelectChange = (name) => ({value}) => this.updateTransaction(name, value);

    onItemChange = ({value: id}) => {
        const item = this.props.items.find(({_id}) => _id === id);
        this.setState({
            currentItem: item,
            transaction: {
                ...this.state.transaction,
                item: item._id,
                price: item.priceMin,
                amountType: item.amountType
            }
        });
    };

    updateTransaction(field, value) {
        this.setState({
            transaction: {...this.state.transaction, [field]: value}
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.transaction);
        this.setState({transaction: new Transaction()});
        this.transactionInput.focus();
    };

    render() {
        const {transaction: {item, amount, amountType, price}, currentItem} = this.state;
        const amountTypeOptions = Transaction.AmountTypes.map((type) => ({
            value: type, label: type[0].toUpperCase() + type.substring(1)
        }));
        const itemOptions = this.props.items.map(({name, _id}) => ({
            value: _id, label: name
        }));
        const {priceMin, priceMax} = currentItem || {};
        const suggestedPrice = currentItem ? `${priceMin} ~ ${priceMax}CZK` : '';
        return (
            <form
                onSubmit={this.onSubmit}
                onInput={this.onInput}
                className="TransactionForm"
            >
                <div className="row">
                    <label className="text-secondary">Item</label>
                    <Select
                        name="item"
                        className="item"
                        options={itemOptions}
                        value={item}
                        onChange={this.onItemChange}
                        clearable={true}
                        ref={(input) => this.transactionInput = input}
                    />
                </div>
                <div className="row">
                    <label className="text-secondary">Amount</label>
                    <input type="number" name="amount" value={amount}/>
                    <Select
                        name="amountType"
                        className="amount-type"
                        options={amountTypeOptions}
                        value={amountType}
                        onChange={this.onSelectChange('amountType')}
                        clearable={false}
                    />
                </div>
                <div className="row">
                    <label className="text-secondary">Price</label>
                    <input type="number" name="price" value={price}/>
                    <label className="text-secondary suggested-price">{suggestedPrice}</label>
                    <label className="text-secondary">CZK</label>
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default TransactionForm;