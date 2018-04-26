import React from 'react';
import './OrderPrice.css';

export const OrderPrice = () => (
    <div className="OrderPrice">
        <div className="price-range">90 ~ 150 kč</div>
        <div className="price flex">
            <div className="total input-inline">
                <input
                    type="number"
                    name="price-total"
                    placeholder="Price..."
                    className="inline"
                />
                <label>kč</label>
            </div>
            <span className="currency choices">
                <span className="choice selected">kč</span>
                <span className="choice">$</span>
                <span className="choice">...</span>
            </span>
        </div>
    </div>
);
