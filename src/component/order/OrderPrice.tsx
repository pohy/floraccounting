import React, { SFC, FormEvent } from 'react';
import './OrderPrice.css';
import { Choices } from '../common/Choices';
import { CURRENCIES, Currencies } from '../../model/Transaction';

export type OnPriceChangeHandler = (value: number) => void;
export type OnCurrencyChangeHandler = (currency: Currencies) => void;
export interface IOrderPriceProps {
    price?: number;
    currency: Currencies;
    onPriceChange: OnPriceChangeHandler;
    onCurrencyChange: OnCurrencyChangeHandler;
}

export const OrderPrice: SFC<IOrderPriceProps> = ({
    price = '',
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
                    onChange={priceChanged(onPriceChange)}
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

function priceChanged(onPriceChange: OnPriceChangeHandler) {
    return ({ currentTarget: { value } }: FormEvent<HTMLInputElement>) =>
        onPriceChange(Number.parseFloat(value));
}

function currencyChanged(onCurrencyChange: OnCurrencyChangeHandler) {
    return (currency: string) => onCurrencyChange(currency as Currencies);
}

function isCurrencySelected(selectedCurrency: Currencies) {
    return (currency: string) => selectedCurrency === currency;
}
