import React from 'react';
import { Component } from 'react';
import './Order.css';
import { OrderItem } from './OrderItem';
import { OrderPrice } from './OrderPrice';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { TransactionItem } from '../../model/TransactionItem';
import { Item } from '../../model/Item';
import { Transaction, Currencies } from '../../model/Transaction';
import { post } from '../common/http';
import { searchItems } from '../common/api';
import { itemsQueryFilter } from '../common/items-query-filter';

export interface IOrderState {
    searchResults: Item[];
    showSearchResults: boolean;
    searchQuery: string;
    transaction: Transaction;
}

export class Order extends Component<{}, IOrderState> {
    state = {
        showSearchResults: false,
        searchQuery: '',
        searchResults: new Array<Item>(),
        transaction: new Transaction(),
    };

    onSearchInput = async (searchQuery: string) => {
        this.setState({
            searchQuery,
        });
        this.fetchItems(searchQuery);
    };
    hideSearchResults = () => this.setState({ showSearchResults: false });
    showSearchResults = () => {
        this.setState({ showSearchResults: true });
        this.fetchItems();
    };

    async fetchItems(query: string = '') {
        this.setState({
            searchResults: await searchItems(query),
        });
    }

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
            await post('/transaction', this.state.transaction);
            this.setState({
                transaction: new Transaction(),
            });
        } catch (error) {
            console.error(error);
        }
    };

    searchResults() {
        const { transaction, searchResults, searchQuery } = this.state;
        const newItems = transaction.items.filter(
            ({ _id }) => !searchResults.find((item) => _id === item._id),
        );
        return searchResults.concat(itemsQueryFilter(newItems, searchQuery));
    }

    render() {
        const {
            showSearchResults,
            searchQuery,
            transaction,
            transaction: { transactionItems, currency, price },
        } = this.state;

        return (
            <div className="Order">
                <SearchBar
                    onFocus={this.showSearchResults}
                    onBlur={this.hideSearchResults}
                    onQuery={this.onSearchInput}
                />
                <div className={showSearchResults ? '' : 'hide'}>
                    <SearchResults
                        onClick={this.addOrderItem}
                        results={this.searchResults()}
                        query={searchQuery}
                    />
                </div>
                <div
                    className={`flex column grow${
                        showSearchResults ? ' hide' : ''
                    }`}
                >
                    <div className="items">
                        {transactionItems.map((transactionItem, key) => (
                            <OrderItem
                                onRemove={this.removeOrderItem}
                                onUpdate={this.updateOrderItem}
                                {...{ transactionItem, key }}
                            />
                        ))}
                        {!transactionItems.length && (
                            <div className="OrderItem">
                                <h3>Search for an item</h3>
                            </div>
                        )}
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
