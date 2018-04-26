import React, {Component} from 'react';
import './Order.css';
import { OrderItem } from './OrderItem';

class Item {
    constructor(name, amount, amountType) {
        this.name = name;
        this.amount = amount;
        this.amountType = amountType;
    }
}

export const AMOUNT_TYPES = {
    ml: 'ml',
    g: 'g',
    pc: 'pc',
};

const ITEMS = [
    new Item('Kombucha', 500, AMOUNT_TYPES.ml),
    new Item('Večeře', 1, AMOUNT_TYPES.pc),
];

export class Order extends Component {
    render() {
        return (
            <div className="Order">
                <div className="search">
                    <input type="text" name="search" placeholder="Search..."/>
                </div>
                <div className="items">
                    {ITEMS.map((item, key) => <OrderItem {...{...item, key}} />)}
                </div>
                <div className="price-wrapper">
                    <div className="price flex">
                        <div className="total input-inline">
                            <input type="text" name="price-total" placeholder="Price..." className="inline" />
                            <label>kč</label>
                        </div>
                        <span className="currency choices">
                            <span className="choice selected">kč</span>
                            <span className="choice">$</span>
                            <span className="choice">...</span>
                        </span>
                    </div>
                    <div className="price-range">
                        90 ~ 150 kč
                    </div>
                </div>
            </div>
        );
    }
}