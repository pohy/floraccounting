import React, { SFC } from 'react';
import { Transaction, currencySymbol } from '../../common/model/Transaction';
import { Title } from '../routing/Title';
import { locale } from '../common/locale';
import './OrderDetail.css';
import { formatPrice } from '../common/format-price';
import { SingleUnit } from '../../common/model/TransactionItem';

export interface IOrderDetailProps {
    transaction: Transaction;
}

export const OrderDetail: SFC<IOrderDetailProps> = ({
    transaction: {
        created,
        user: { name: userName },
        transactionItems,
        price,
        currency,
    },
}) => (
    <div className="OrderDetail flex-default column grow padding-2x">
        <Title>Order detail</Title>
        <div className="flex-default column">
            <div className="flex-default center-content">
                <strong className="text-medium grow bold">Order</strong>
                <span>
                    {price}&nbsp;{currencySymbol(currency)}
                </span>
            </div>
            <div className="separator" />
            <div className="flex-default center-content">
                <span className="grow text-small">{userName}</span>
                <span className="text-secondary text-small">
                    {created.toLocaleString(locale.current)}
                </span>
            </div>
        </div>
        <div className="items flex-default grow column padding-top-2x">
            {transactionItems.map(
                (
                    { amount, amountType, item: { name, priceMin, priceMax } },
                    key,
                ) => (
                    <div className="item">
                        <div className="flex-default">
                            <strong className="name grow">{name}</strong>
                            <span>
                                {amount}&nbsp;{amountType}
                            </span>
                        </div>
                        {priceMin &&
                            priceMax && (
                                <div className="text-secondary text-small">
                                    {formatPrice(priceMin)} ~{' '}
                                    {formatPrice(priceMax)}
                                    &nbsp;
                                    {currencySymbol(currency)}
                                    &nbsp;/&nbsp;
                                    {SingleUnit[amountType]}
                                    {amountType}
                                </div>
                            )}
                    </div>
                ),
            )}
        </div>
    </div>
);
