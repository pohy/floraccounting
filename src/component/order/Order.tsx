import React from 'react';
import { Component } from 'react';
import './Order.css';
import { OrderItem } from './OrderItem';
import { OrderPrice } from './OrderPrice';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { TransactionItem, AmountTypes } from '../../model/TransactionItem';
import { Item } from '../../model/Item';
import { Transaction, Currencies } from '../../model/Transaction';
import { post } from '../common/http';

const ITEMS = [
    new TransactionItem({
        item: new Item({ name: 'Kombucha' }),
        amount: 500,
        amountType: AmountTypes.Volume,
    }),
    new TransactionItem({
        item: new Item({ name: 'Dinner' }),
        amount: 2,
        amountType: AmountTypes.Piece,
    }),
];

export interface IOrderState {
    showSearchResults: boolean;
    query: string;
    transaction: Transaction;
}

export class Order extends Component<{}, IOrderState> {
    state = {
        showSearchResults: false,
        query: '',
        transaction: new Transaction({ items: ITEMS }),
    };

    onSearchInput = (query: string) => {
        this.setState({ query });
    };
    hideSearchResults = () => this.setState({ showSearchResults: false });
    showSearchResults = () => this.setState({ showSearchResults: true });

    addOrderItem = (item: Item) =>
        this.setState({
            transaction: this.state.transaction.addItem(item),
            showSearchResults: false,
        });
    removeOrderItem = (itemID: string) =>
        this.setState({
            transaction: this.state.transaction.removeTransactionItem(itemID),
        });
    updateOrderItem = (updatedItem: TransactionItem) =>
        this.setState({
            transaction: this.state.transaction.updateTransactionItem(
                updatedItem,
            ),
        });

    updatePrice = (price: number) =>
        this.setState({
            transaction: new Transaction({ ...this.state.transaction, price }),
        });
    updateCurrency = (currency: Currencies) =>
        this.setState({
            transaction: new Transaction({
                ...this.state.transaction,
                currency,
            }),
        });

    saveTransaction = async () => {
        try {
            const result = await post('/transaction', this.state.transaction);
            console.log(result);
            this.setState({
                transaction: new Transaction(),
            });
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const {
            showSearchResults,
            query,
            transaction,
            transaction: { items, currency, price },
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
                    className={`primary${showSearchResults ? ' hide' : ''}`}
                    onClick={this.saveTransaction}
                    disabled={!transaction.isValid()}
                >
                    Save
                </button>
            </div>
        );
    }
}
