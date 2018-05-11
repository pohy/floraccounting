import React from 'react';
import { Component } from 'react';
import './Order.css';
import { OrderItem } from './OrderItem';
import { OrderPrice } from './OrderPrice';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import {
    TransactionItem,
    AmountTypes,
} from '../../common/model/TransactionItem';
import { Item } from '../../common/model/Item';
import { Transaction, Currencies } from '../../common/model/Transaction';
import { post } from '../common/http';
import { searchItems, fetchExchangeRate } from '../common/api';
import { itemsQueryFilter } from '../../common/items-query-filter';
import { Redirect } from '../routing/Redirect';
import { AuthConsumer } from '../user/AuthContext';
import { Title } from '../routing/Title';

export interface IOrderState {
    searchResults: Item[];
    showSearchResults: boolean;
    searchQuery: string;
    transaction: Transaction;
    exchangeRate: number;
}

// TODO: Refactor into smaller components
export class Order extends Component<{}, IOrderState> {
    state = {
        showSearchResults: false,
        searchQuery: '',
        searchResults: new Array<Item>(),
        transaction: new Transaction(),
        exchangeRate: 1,
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
    updateCurrency = async (currency: Currencies) =>
        this.setState({
            transaction: new Transaction({
                ...this.state.transaction,
                currency,
            }),
            exchangeRate: await fetchExchangeRate(currency),
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
            exchangeRate,
        } = this.state;

            return (
            <AuthConsumer>
                {({ user }) => {
                    if (!user) {
                        return <Redirect to="/login" />;
        }
        return (
            <div className="Order grow">
                            <Title>New order</Title>
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
                    className={`items flex column grow${
                        showSearchResults ? ' hide' : ''
                    }`}
                >
                                {transactionItems.map(
                                    (transactionItem, key) => (
                            <OrderItem
                                onRemove={this.removeOrderItem}
                                onUpdate={this.updateOrderItem}
                                {...{
                                    transactionItem,
                                    currency,
                                    exchangeRate,
                                    key,
                                }}
                            />
                                    ),
                                )}
                        {!transactionItems.length && (
                                    <div className="OrderItem padding">
                                <h3>Search for an item</h3>
                            </div>
                        )}
                    </div>
                <div
                                className={`flex column ${
                                    showSearchResults ? 'hide' : ''
                                }`}
                >
                    <OrderPrice
                        onPriceChange={this.updatePrice}
                        onCurrencyChange={this.updateCurrency}
                                    {...{
                                        price,
                                        currency,
                                        transactionItems,
                                        exchangeRate,
                                    }}
                    />
                <button
                                    className="button primary"
                    onClick={this.saveTransaction}
                    disabled={!transaction.isValid()}
                >
                    Save
                </button>
            </div>
            </div>
        );
                }}
            </AuthConsumer>
        );
    }
}
