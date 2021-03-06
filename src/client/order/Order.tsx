import * as React from 'react';
import { Component, FormEvent, Fragment } from 'react';
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
import { AuthConsumer } from '../components/AuthContext';
import { Title } from '../routing/Title';
import { Overlay } from '../components/Overlay';
import { http } from '../common/http';
import { ModalConsumer, IModalProviderState } from '../components/ModalContext';
import { OrderItemPrice } from './OrderItemPrice';

const TRANSACTION_LOCAL_STORAGE_KEY = 'transaction';

export interface IOrderState {
    searchResults: Item[];
    showSearchResults: boolean;
    searchQuery: string;
    transaction: Transaction;
    exchangeRate: number;
    submitting: boolean;
    focusedItem: string;
    editedItem: Item | null;
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
        focusedItem: '',
        editedItem: null,
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

    newOrderItem = (item: Item) => {
        if (item.isValid()) {
            this.addOrderItem(item);
        } else {
            this.setState({ editedItem: item });
        }
    };

    saveEditedItem = (close: () => void) => (
        transactionItem: TransactionItem,
    ) => {
        if (transactionItem.isValid()) {
            close();
            this.setState({
                transaction: this.state.transaction.addTransactionItem(
                    transactionItem,
                ),
            });
            this.itemAdded(transactionItem.item._id);
        } else {
            console.error(transactionItem);
        }
    };

    cancelEditedItem = (close: () => void) => () => {
        close();
        this.setState({ editedItem: null });
    };

    addOrderItem = (item: Item) => {
        this.setState({
            transaction: this.state.transaction.addItem(item),
        });
        this.itemAdded(item._id);
    };

    itemAdded = (itemID: string) =>
        this.setState({
            showSearchResults: false,
            focusedItem: itemID,
            editedItem: null,
        });

    removeOrderItem = (itemID: string) =>
        this.setState({
            transaction: this.state.transaction.removeTransactionItem(itemID),
            // TODO: Focus previous item
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
            focusedItem: '',
        });
    updateCurrency = async (currency: Currencies) =>
        this.setState({
            transaction: new Transaction({
                ...this.state.transaction,
                currency,
            }),
            exchangeRate: await fetchExchangeRate(currency),
            focusedItem: '',
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

    renderItemPriceEditor = ({ open, close, isOpen }: IModalProviderState) => {
        const { editedItem } = this.state;
        // FIXME: What about multiple modals?
        if (editedItem && !isOpen) {
            open(
                <OrderItemPrice
                    item={editedItem}
                    onSave={this.saveEditedItem(close)}
                    onCancel={this.cancelEditedItem(close)}
                />,
            );
        }
        return null;
    };

    private get selectedItemIDs() {
        return this.state.transaction.items.map(({ _id }) => _id);
    }

    render() {
        const {
            showSearchResults,
            searchQuery,
            transaction,
            transaction: { transactionItems, currency, price },
            exchangeRate,
            submitting,
            focusedItem,
        } = this.state;

        return (
            <AuthConsumer>
                {({ user }) => {
                    if (!user) {
                        return <Redirect to="/login" />;
                    }
                    return (
                        <Fragment>
                            <form
                                className="Order flex column grow"
                                onSubmit={this.saveTransaction}
                            >
                                <Title>New order</Title>
                                {submitting && <Overlay />}
                                <div className="controls flex column">
                                    <div className="search-save flex">
                                        <SearchBar
                                            inputRef={
                                                this.setSearchBarInputElement
                                            }
                                            onFocus={this.showSearchResults}
                                            onBlur={this.hideSearchResults}
                                            onQuery={this.onSearchInput}
                                        />
                                        <button
                                            className={`button primary${
                                                showSearchResults ? ' hide' : ''
                                            }`}
                                            onClick={this.saveTransaction}
                                            disabled={!transaction.isValid()}
                                            type="submit"
                                        >
                                            <span className="hide-small">
                                                Save{' '}
                                            </span>💾
                                        </button>
                                    </div>
                                    <div
                                        className={
                                            showSearchResults
                                                ? 'hide'
                                                : undefined
                                        }
                                    >
                                        <OrderPrice
                                            inputRef={this.setPriceInputRef}
                                            onPriceChange={this.updatePrice}
                                            onCurrencyChange={
                                                this.updateCurrency
                                            }
                                            {...{
                                                currency,
                                                transactionItems,
                                                exchangeRate,
                                                price,
                                            }}
                                        />
                                    </div>
                                </div>
                                <SearchResults
                                    onClick={this.newOrderItem}
                                    results={this.searchResults()}
                                    query={searchQuery}
                                    selectedItemIDs={this.selectedItemIDs}
                                    className={showSearchResults ? '' : 'hide'}
                                />
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
                                                inputRef={
                                                    this.addOrderItemInput
                                                }
                                                focus={
                                                    transactionItem.item._id ===
                                                    focusedItem
                                                }
                                                {...{
                                                    transactionItem,
                                                    currency,
                                                    exchangeRate,
                                                    key,
                                                }}
                                            />
                                        ))}
                                </div>
                            </form>
                            <ModalConsumer>
                                {this.renderItemPriceEditor}
                            </ModalConsumer>
                        </Fragment>
                    );
                }}
            </AuthConsumer>
        );
    }
}
