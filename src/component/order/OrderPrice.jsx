import React, { Component } from 'react';
import './OrderPrice.css';
import { Choices } from '../common/Choices';
import { CURRENCIES } from '../../model/Transaction';

export const OrderPrice = ({
    price,
    currency,
    onPriceChange,
    onCurrencyChange,
}) => (
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
                    onInput={priceChanged(onPriceChange)}
                />
                <label>{currency}</label>
            </div>
            <Choices
                choices={Object.values(CURRENCIES)}
                isSelected={isCurrencySelected(currency)}
                onChoice={currencyChanged(onCurrencyChange)}
            />
        </div>
    </div>
);

function priceChanged(onPriceChange) {
    return ({ target: { value } }) => onPriceChange(value);
}

function currencyChanged(onCurrencyChange) {
    return (currency) => onCurrencyChange(currency);
}

function isCurrencySelected(selectedCurrency) {
    return (currency) => selectedCurrency === currency;
}
