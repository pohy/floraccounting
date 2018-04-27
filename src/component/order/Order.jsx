import React, { Component } from 'react';
import './Order.css';
import { OrderItem } from './OrderItem';
import { OrderPrice } from './OrderPrice';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { TransactionItem, AMOUNT_TYPES } from '../../model/TransactionItem';
import { Item } from '../../model/Item';
import { Transaction } from '../../model/Transaction';

const ITEMS = [
    new TransactionItem({
        amount: 500,
        amountType: AMOUNT_TYPES.volume,
        item: new Item({ name: 'Kombucha' }),
    }),
    new TransactionItem({
        amount: 2,
        amountType: AMOUNT_TYPES.piece,
        item: new Item({ name: 'Dinner' }),
    }),
];

export class Order extends Component {
    state = {
        showSearchResults: false,
        query: '',
        transaction: new Transaction({ items: ITEMS }),
    };

    onSearchInput = (query) => {
        this.setState({ query });
    };
    hideSearchResults = () => this.setState({ showSearchResults: false });
    showSearchResults = () => this.setState({ showSearchResults: true });

    addOrderItem = (item) =>
        this.setState({
            transaction: this.state.transaction.addItem(item),
            showSearchResults: false,
        });
    removeOrderItem = (itemID) =>
        this.setState({
            transaction: this.state.transaction.removeItem(itemID),
        });
    updateOrderItem = (updatedItem) =>
        this.setState({
            transaction: this.state.transaction.updateItem(updatedItem),
        });

    updatePrice = (price) =>
        this.setState({
            transaction: new Transaction({ ...this.state.transaction, price }),
        });
    updateCurrency = (currency) =>
        this.setState({
            transaction: new Transaction({
                ...this.state.transaction,
                currency,
            }),
        });

    saveTransaction = () => {
        this.setState({
            transaction: new Transaction(),
        });
    };

    render() {
        const {
            showSearchResults,
            query,
            transaction,
            transaction: { items, currency, price, isValid },
        } = this.state;

        return (
            <div className="Order">
                <SearchBar
                    onFocus={this.showSearchResults}
                    onBlur={this.hideSearchResults}
                    onQuery={this.onSearchInput}
                />
                <div className={showSearchResults ? '' : 'hide'}>
                    <SearchResults onClick={this.addOrderItem} {...{ query }} />
                </div>
                <div
                    className={`flex column grow${
                        showSearchResults ? ' hide' : ''
                    }`}
                >
                    <div className="items">
                        {items.map((transactionItem, key) => (
                            <OrderItem
                                onRemove={this.removeOrderItem}
                                onUpdate={this.updateOrderItem}
                                {...{ transactionItem, key }}
                            />
                        ))}
                    </div>
                    <OrderPrice
                        onPriceChange={this.updatePrice}
                        onCurrencyChange={this.updateCurrency}
                        {...{ price, currency }}
                    />
                </div>
                <button
                    className="primary"
                    onClick={this.saveTransaction}
                    disabled={!transaction.isValid()}
                >
                    Save
                </button>
            </div>
        );
    }
}
