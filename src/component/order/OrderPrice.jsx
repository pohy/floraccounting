import React, { Component } from 'react';
import './OrderPrice.css';
import { Choices } from '../common/Choices';

// const CURRENCIES = ['kč', '$', '...'];
const CURRENCY = {
    czk: 'kč',
    usd: '$',
};

export class OrderPrice extends Component {
    state = {
        price: undefined,
        currency: CURRENCY.czk,
    };

    onPriceChange = ({ target: { value: price } }) => this.setState({ price });
    isCurrencySelected = (currency) => currency === this.state.currency;
    onCurrencyChange = (currency) => this.setState({ currency });

    render() {
        const { currency, price } = this.state;

        return (
            <div className="OrderPrice">
                <div className="price-range">90 ~ 150 kč</div>
                <div className="price flex">
                    <div className="total input-inline">
                        <input
                            type="number"
                            value={price}
                            name="price-total"
                            placeholder="Price..."
                            className="inline"
                            onInput={this.onPriceChange}
                        />
                        <label>{currency}</label>
                    </div>
                    <Choices
                        choices={Object.values(CURRENCY)}
                        isSelected={this.isCurrencySelected}
                        onChoice={this.onCurrencyChange}
                    />
                </div>
            </div>
        );
    }
}
