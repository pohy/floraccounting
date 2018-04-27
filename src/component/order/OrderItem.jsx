import React from 'react';
import { AMOUNT_TYPES } from '../../model/TransactionItem';
import './OrderItem.css';
import { Choices } from '../common/Choices';
import { TransactionItem } from '../../model/TransactionItem';

export const OrderItem = ({
    transactionItem,
    transactionItem: {
        amountType,
        amount,
        item: { name, _id },
    },
    onRemove,
    onUpdate,
}) => (
    <div className="OrderItem">
        <div className="flex">
            <h3>{name}</h3>
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
                    value={typeof amount === 'undefined' ? '' : amount}
                    className="inline"
                    onChange={updateAmount(transactionItem, onUpdate)}
                />
                <label>{amountType}</label>
            </span>
            <Choices
                choices={Object.values(AMOUNT_TYPES)}
                isSelected={isAmountTypeSelected(amountType)}
                onChoice={updateAmountType(transactionItem, onUpdate)}
            />
        </div>
    </div>
);

function removeItem(_id, onRemove) {
    return () => onRemove(_id);
}

function isAmountTypeSelected(amountType) {
    return (type) => type === amountType;
}

function updateAmount(transactionItem, onUpdate) {
    return ({ target: { value: amount } }) =>
        onUpdate(new TransactionItem({ ...transactionItem, amount }));
}

function updateAmountType(transactionItem, onUpdate) {
    return (amountType) =>
        onUpdate(new TransactionItem({ ...transactionItem, amountType }));
}
