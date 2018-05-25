import React, { SFC, FormEvent } from 'react';
import './OrderPrice.css';
import { ChoicesCurrency } from '../components/Choices';
import { Currencies, currencySymbol } from '../../common/model/Transaction';
import { TransactionItem } from '../../common/model/TransactionItem';
import { formatPrice } from '../common/format-price';
import {
    calculateTransactionItemsPriceRanges,
    recommendedPrice,
} from '../common/price-range';
import { selectInputText } from '../common/select-input-text';

export type OnPriceChangeHandler = (value: number) => void;
export type OnCurrencyChangeHandler = (currency: Currencies) => void;
export interface IOrderPriceProps {
    price?: number;
    currency: Currencies;
    transactionItems: TransactionItem[];
    exchangeRate?: number;
    onPriceChange: OnPriceChangeHandler;
    onCurrencyChange: OnCurrencyChangeHandler;
    displayRecommendedPrice: boolean;
    inputRef: (inputElement: HTMLInputElement) => void;
}

export const OrderPrice: SFC<IOrderPriceProps> = ({
    price = '',
    currency,
    transactionItems,
    exchangeRate = 1,
    onPriceChange,
    onCurrencyChange,
    inputRef,
    displayRecommendedPrice,
}) => {
    const currentPrice = displayRecommendedPrice
        ? recommendedPrice(
              calculateTransactionItemsPriceRanges(transactionItems),
          )
        : price;
    return (
        <div className="OrderPrice padding">
            <div className="price-range padding">
                {renderPriceRange(transactionItems, currency, exchangeRate)}
            </div>
            <div className="price flex">
                <div className="total input-inline">
                    <input
                        type="number"
                        value={currentPrice || ''}
                        name="price-total"
                        placeholder="Price..."
                        className="inline"
                        onChange={priceChanged(onPriceChange)}
                        ref={inputRef}
                        onFocus={selectInputText}
                    />
                </div>
                <ChoicesCurrency
                    choices={Object.values(Currencies)}
                    isSelected={isCurrencySelected(currency)}
                    onChoice={currencyChanged(onCurrencyChange)}
                    choiceName={renderCurrency}
                />
            </div>
        </div>
    );
};

function renderCurrency(currency: Currencies) {
    return currencySymbol(currency);
}

function renderPriceRange(
    transactionItems: TransactionItem[],
    currency: Currencies,
    exchangeRate: number,
): string {
    const { priceMin, priceMax } = calculateTransactionItemsPriceRanges(
        transactionItems,
    );
    return `${formatPrice(priceMin * exchangeRate)} ~ ${formatPrice(
        priceMax * exchangeRate,
    )} ${currencySymbol(currency)}`;
}

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
