import React, { Component, Fragment } from 'react';
import './Order.css';
import { OrderItem } from './OrderItem';
import { OrderPrice } from './OrderPrice';
import uuid from 'uuid';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

export const AMOUNT_TYPES = {
    ml: 'ml',
    g: 'g',
    pc: 'pc',
};

class Item {
    constructor(name, amount, amountType = AMOUNT_TYPES.pc, quantity = 1) {
        this.id = uuid.v4();
        this.name = name;
        this.amount = amount;
        this.amountType = amountType;
        this.quantity = quantity;
    }
}

const ITEMS = [
    new Item('Kombucha', 500, AMOUNT_TYPES.ml),
    new Item('Večeře', 1, AMOUNT_TYPES.pc),
];

const EXISTING_ITEMS = [
    'Kombucha',
    'Večeře',
    'Datlový štrůdl',
    'Raw klobáska',
    'Konopný čaj',
    'Wayusa',
    'Birdsong coffee',
];

export class Order extends Component {
    state = {
        showSearchResults: false,
        query: '',
        searchResults: EXISTING_ITEMS,
        orderItems: ITEMS,
    };

    onSearchInput = (query) => {
        this.setState({ query });
    };
    hideSearchResults = () => this.setState({ showSearchResults: false });
    showSearchResults = () => this.setState({ showSearchResults: true });

    addOrderItem = (item) =>
        this.setState({
            orderItems: [...this.state.orderItems, new Item(item)],
            showSearchResults: false,
        });

    removeOrderItem = (itemID) => () =>
        this.setState({
            orderItems: this.state.orderItems.filter(({ id }) => id !== itemID),
        });

    updateOrderItem = (updatedItem) => () =>
        this.setState({
            orderItems: this.state.orderItems.map(
                (item) => (item.id === updatedItem.id ? updatedItem : item),
            ),
        });

    render() {
        const { showSearchResults, query, orderItems } = this.state;

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
                        {orderItems.map((item) => (
                            <OrderItem
                                key={item.id}
                                {...{ item }}
                                onRemove={this.removeOrderItem}
                                onUpdate={this.updateOrderItem}
                            />
                        ))}
                    </div>
                    <OrderPrice />
                </div>
            </div>
        );
    }
}
