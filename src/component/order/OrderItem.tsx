import React, { SFC, FormEvent } from 'react';
import { AmountTypes, SingleUnit } from '../../model/TransactionItem';
import './OrderItem.css';
import { Choices } from '../common/Choices';
import { TransactionItem } from '../../model/TransactionItem';
import { Currencies, currencySymbol } from '../../model/Transaction';
import { formatPrice } from '../common/format-price';

export type OnRemoveHandler = (itemID: string) => void;
export type OnUpdateHandler = (updatedTransactionItem: TransactionItem) => void;

export interface IOrderItemProps {
    transactionItem: TransactionItem;
    currency: Currencies;
    exchangeRate?: number;
    onRemove: OnRemoveHandler;
    onUpdate: OnUpdateHandler;
}

export const OrderItem: SFC<IOrderItemProps> = ({
    transactionItem,
    transactionItem: {
        amountType,
        amount = '',
        item: { name, _id, priceMin, priceMax },
    },
    currency,
    exchangeRate = 1,
    onRemove,
    onUpdate,
}) => (
    <div className="OrderItem">
        <div className="flex">
            <h3>{name}</h3>
            {priceMin &&
                priceMax && (
                    <span className="grow price-range">
                        {formatPrice(priceMin * exchangeRate)} ~{' '}
                        {formatPrice(priceMax * exchangeRate)}
                        &nbsp;
                        {currencySymbol(currency)}
                        &nbsp;/&nbsp;
                        {SingleUnit[amountType]}
                        {amountType}
                    </span>
                )}
            <span className="remove" onClick={removeItem(_id, onRemove)}>
                &times;
            </span>
        </div>
        <div className="flex">
            <span className="amount input-inline">
                <input
                    type="number"
                    name="item-amount"
                    placeholder="Amount..."
                    value={amount}
                    className="inline"
                    onChange={updateAmount(transactionItem, onUpdate)}
                />
                <label>{amountType}</label>
            </span>
            <Choices
                choices={Object.values(AmountTypes)}
                isSelected={isAmountTypeSelected(amountType)}
                onChoice={updateAmountType(transactionItem, onUpdate)}
            />
        </div>
    </div>
);

function removeItem(_id: string, onRemove: OnRemoveHandler) {
    return () => onRemove(_id);
}

function isAmountTypeSelected(amountType: AmountTypes) {
    return (type: string) => type === amountType;
}

function updateAmount(
    transactionItem: TransactionItem,
    onUpdate: OnUpdateHandler,
) {
    return ({
        currentTarget: { value: amount },
    }: FormEvent<HTMLInputElement>) =>
        onUpdate(
            new TransactionItem({
                ...transactionItem,
                amount: Number.parseFloat(amount),
            }),
        );
}

function updateAmountType(
    transactionItem: TransactionItem,
    onUpdate: OnUpdateHandler,
) {
    return (amountType: string) =>
        onUpdate(
            new TransactionItem({
                ...transactionItem,
                amountType: amountType as AmountTypes,
            }),
        );
}
