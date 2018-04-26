import React, {Component} from 'react';
import {AMOUNT_TYPES} from './Order';
import './OrderItem.css';

export const OrderItem = ({name, amountType, amount}) => (
    <div className="OrderItem">
        <div className="flex">
            <h3>{name}</h3>
            <span className="close">&times;</span>
        </div>
        <div className="flex">
            <span className="amount input-inline">
                <input type="text" name="item-amount" placeholder="Amount..." value={amount} className="inline" />
                <label>{amountType}</label>
            </span>
            <span className="amount-type choices">
                {Object.values(AMOUNT_TYPES).map((type, key) => (
                    <span className={`choice${type === amountType ? ' selected' : ''}`} {...{key}}>
                        {type}
                    </span>
                ))}
            </span>
        </div>
    </div>
);