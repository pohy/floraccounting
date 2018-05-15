import * as React from 'react';
import { Component, FormEvent } from 'react';
import './Order.css';
import { OrderItem } from './OrderItem';
import { OrderPrice } from './OrderPrice';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { TransactionItem } from '../../common/model/TransactionItem';
import { Item } from '../../common/model/Item';
import { Transaction, Currencies } from '../../common/model/Transaction';
import { searchItems, fetchExchangeRate } from '../common/api';
import { itemsQueryFilter } from '../../common/items-query-filter';
import { Redirect } from '../routing/Redirect';
import { AuthConsumer } from '../user/AuthContext';
import { Title } from '../routing/Title';
import { Overlay } from '../common/Overlay';
import { http } from '../common/http';

const TRANSACTION_LOCAL_STORAGE_KEY = 'transaction';

export interface IOrderState {
    searchResults: Item[];
    showSearchResults: boolean;
    searchQuery: string;
    transaction: Transaction;
    exchangeRate: number;
    submitting: boolean;
}

// TODO: Refactor into smaller components
export class Order extends Component<{}, IOrderState> {
    state = {
        showSearchResults: false,
        searchQuery: '',
        searchResults: new Array<Item>(),
        transaction: new Transaction(),
        exchangeRate: 1,
        submitting: false,
    };

    private searchBarInputElement!: HTMLInputElement;
    private orderItemInputs: HTMLInputElement[] = [];
    private priceInputRef!: HTMLInputElement;

    componentDidUpdate() {
        window.localStorage.setItem(
            TRANSACTION_LOCAL_STORAGE_KEY,
            JSON.stringify(this.state.transaction),
        );
    }

    componentDidMount() {
        const persistedTransaction = window.localStorage.getItem(
            TRANSACTION_LOCAL_STORAGE_KEY,
        );
        if (persistedTransaction) {
            const transaction = new Transaction(
                JSON.parse(persistedTransaction),
            );
            this.setState({ transaction });
        }
    }

    setSearchBarInputElement = (input: HTMLInputElement) =>
        (this.searchBarInputElement = input);

    onSearchInput = async (searchQuery: string) => {
        this.setState({
            searchQuery,
        });
        this.fetchItems(searchQuery);
    };
    hideSearchResults = () => {
        this.setState({ showSearchResults: false });
        if (this.searchBarInputElement) {
            this.searchBarInputElement.blur();
        }
    };
    showSearchResults = () => {
        this.setState({ showSearchResults: true });
        this.fetchItems();
        this.searchBarInputElement.focus();
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

    saveTransaction = async (
        event: FormEvent<HTMLFormElement | HTMLButtonElement>,
    ) => {
        event.preventDefault();
        let stateUpdate: any = {
            submitting: false,
        };
        try {
            this.setState({ submitting: true });
            await http.post('/transaction', this.state.transaction);
            stateUpdate = {
                ...stateUpdate,
                transaction: new Transaction(),
            };
        } catch (error) {
            console.error(error);
        } finally {
            this.setState(stateUpdate);
        }
    };

    setPriceInputRef = (inputElement: HTMLInputElement) =>
        (this.priceInputRef = inputElement);

    addOrderItemInput = (inputElement: HTMLInputElement) =>
        this.orderItemInputs.push(inputElement);

    focusNextInput = (inputElement: HTMLInputElement) => {
        this.orderItemInputs = this.orderItemInputs.filter((input) =>
            document.body.contains(input),
        );
        const inputIndex = this.orderItemInputs.findIndex(
            (input) => input === inputElement,
        );
        if (inputIndex < 0) {
            return;
        }
        if (inputIndex === this.orderItemInputs.length - 1) {
            this.priceInputRef.focus();
            return;
        }
        this.orderItemInputs[inputIndex + 1].focus();
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
            submitting,
        } = this.state;

        return (
            <AuthConsumer>
                {({ user }) => {
                    if (!user) {
                        return <Redirect to="/login" />;
                    }
                    return (
                        <form
                            className="Order flex column grow"
                            onSubmit={this.saveTransaction}
                        >
                            <Title>New order</Title>
                            {submitting && <Overlay />}
                            <SearchBar
                                inputRef={this.setSearchBarInputElement}
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
                                className={`add-item flex padding center-content${
                                    showSearchResults ? ' hide' : ''
                                }`}
                            >
                                <button
                                    onClick={this.showSearchResults}
                                    className="button"
                                    type="button"
                                >
                                    Add item 🍎
                                </button>
                            </div>
                            <div
                                className={`items flex column grow${
                                    showSearchResults ? ' hide' : ''
                                }`}
                            >
                                {transactionItems
                                    .slice()
                                    .reverse()
                                    .map((transactionItem, key) => (
                                        <OrderItem
                                            onRemove={this.removeOrderItem}
                                            onUpdate={this.updateOrderItem}
                                            onSubmit={this.focusNextInput}
                                            inputRef={this.addOrderItemInput}
                                            {...{
                                                transactionItem,
                                                currency,
                                                exchangeRate,
                                                key,
                                            }}
                                        />
                                    ))}
                            </div>
                            <div
                                className={`flex column ${
                                    showSearchResults ? 'hide' : ''
                                }`}
                            >
                                <OrderPrice
                                    inputRef={this.setPriceInputRef}
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
                                    type="submit"
                                >
                                    Save 💾
                                </button>
                            </div>
                        </form>
                    );
                }}
            </AuthConsumer>
        );
    }
}
