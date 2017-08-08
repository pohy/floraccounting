import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select, {Creatable} from 'react-select';
import Transaction from './Transaction';
import './TransactionForm.css';

class TransactionForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired
    };

    static ITEM_FIELDS = ['priceMin', 'priceMax'];

    state = {
        transaction: new Transaction(),
        currentItem: null
    };

    onInput = ({target: {value, name}}) => this.updateTransaction(name, value);

    onSelectChange = (name) => ({value}) => this.updateTransaction(name, value);

    onItemChange = ({value: id}) => {
        const {transaction, transaction: {newItem}} = this.state;
        const existingItem = this.props.items.find(({_id}) => id === _id);
        const isExistingItem = !!existingItem;
        const item = isExistingItem
                ? existingItem
                : {_id: id, name: id, priceMin: 0, priceMax: 0};
        const {_id, priceMin, amountType} = item;
        const newState = {
            transaction: {
                ...transaction,
                newItem: isExistingItem ? null : {...newItem, ...item},
                item: _id,
                price: priceMin,
                amountType
            },
            currentItem: {...item}
        };
        this.setState({...this.state, ...newState});
    };

    updateTransaction(field, value) {
        const {transaction, transaction: {newItem = {}}} = this.state;
        const isItemField = TransactionForm.ITEM_FIELDS.includes(field);
        const newState = {
            transaction: {
                ...transaction,
                newItem: isItemField
                    ? {
                        ...newItem,
                        [field]: isItemField ? value : newItem[field]
                    }
                    : newItem,
                [field]: !isItemField ? value : transaction[field]
            }
        };
        console.log(this.state, newState, {...this.state, ...newState})
        this.setState({...this.state, ...newState});
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.transaction);
        this.setState({transaction: new Transaction()});
        this.transactionInput.focus();
    };

    items() {
        const {items} = this.props;
        const {transaction: {newItem}} = this.state;
        return [].concat(items, newItem || []);
    }

    render() {
        const {transaction: {item, amount, amountType, price, newItem}, currentItem} = this.state;
        const amountTypeOptions = Transaction.AmountTypes.map((type) => ({
            value: type, label: type[0].toUpperCase() + type.substring(1)
        }));
        const itemOptions = this.items().map(({name, _id}) => ({
            value: _id, label: name
        }));
        const {priceMin, priceMax} = newItem || currentItem || {};
        const suggestedPrice = currentItem ? `${priceMin} ~ ${priceMax}CZK` : '';
        return (
            <form
                onSubmit={this.onSubmit}
                onInput={this.onInput}
                className="TransactionForm"
            >
                <div className="row">
                    <label className="text-secondary">Item</label>
                    <Creatable
                        name="item"
                        className="item"
                        autoFocus
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
                        placeholder="Type"
                    />
                </div>
                <div className="row">
                    <label className="text-secondary">Price</label>
                    <input type="number" name="price" value={price}/>
                    <label className="text-secondary suggested-price">{suggestedPrice}</label>
                    <label className="text-secondary">CZK</label>
                </div>
                {!!newItem &&
                    <div className="row">
                        <label className="text-secondary">
                            From:
                        </label>
                        <input type="number" name="priceMin" value={priceMin}/>
                        <label className="text-secondary">
                            To:
                        </label>
                        <input type="number" name="priceMax" value={priceMax}/>
                    </div>
                }
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default TransactionForm;