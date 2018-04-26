import React, { Component } from 'react';
import { AMOUNT_TYPES } from './Order';
import './OrderItem.css';

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
                    onInput={onAmountUpdate(item, onUpdate)}
                />
                <label>{amountType}</label>
            </span>
            <span className="amount-type choices">
                {Object.values(AMOUNT_TYPES).map((type, key) => (
                    <span
                        className={`choice${
                            type === amountType ? ' selected' : ''
                        }`}
                        onClick={onUpdate({ ...item, amountType: type })}
                        {...{ key }}
                    >
                        {type}
                    </span>
                ))}
            </span>
        </div>
    </div>
);

function onAmountUpdate(item, update) {
    return ({ target: { value } }) => update({ ...item, amount: value })();
}
