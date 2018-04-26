import React, { Component } from 'react';
import { AMOUNT_TYPES } from './Order';
import './OrderItem.css';
import { Choices } from '../common/Choices';

export const OrderItem = ({
    item,
    item: { name, amountType, amount, id },
    onRemove,
    onUpdate,
}) => (
    <div className="OrderItem">
        <div className="flex">
            <h3>{name}</h3>
            <span className="remove" onClick={onRemove(id)}>
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
                    onInput={updateAmount(item, onUpdate)}
                />
                <label>{amountType}</label>
            </span>
            <Choices
                choices={Object.values(AMOUNT_TYPES)}
                isSelected={isAmountTypeSelected(amountType)}
                onChoice={updateAmountType(item, onUpdate)}
            />
        </div>
    </div>
);

function isAmountTypeSelected(amountType) {
    return (type) => type === amountType;
}

function updateAmount(item, onUpdate) {
    return ({ target: { value: amount } }) => onUpdate({ ...item, amount });
}

function updateAmountType(item, onUpdate) {
    return (amountType) => onUpdate({ ...item, amountType });
}
