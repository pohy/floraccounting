import * as React from 'react';
import { FormEvent, KeyboardEvent, FocusEvent, Component } from 'react';
import { AmountTypes, SingleUnit } from '../../common/model/TransactionItem';
import './OrderItem.css';
import { Choices } from '../components/Choices';
import { TransactionItem } from '../../common/model/TransactionItem';
import { Currencies, currencySymbol } from '../../common/model/Transaction';
import { formatPrice } from '../common/format-price';

export interface IOrderItemProps {
    transactionItem: TransactionItem;
    currency: Currencies;
    exchangeRate?: number;
    onRemove: (itemID: string) => void;
    onUpdate: (updatedTransactionItem: TransactionItem) => void;
    onSubmit: (input: HTMLInputElement) => void;
    inputRef: (inputElement: HTMLInputElement) => void;
}

export class OrderItem extends Component<IOrderItemProps, {}> {
    selectText(event: FocusEvent<HTMLInputElement>) {
        const input = event.currentTarget;
        input.select();
    }

    submit = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }
        event.preventDefault();
        this.props.onSubmit(event.currentTarget);
    };

    removeItem = () => this.props.onRemove(this.props.transactionItem.item._id);

    isAmountTypeSelected = (type: string) =>
        type === this.props.transactionItem.amountType;

    updateAmount = ({
        currentTarget: { value: amount },
    }: FormEvent<HTMLInputElement>) =>
        this.props.onUpdate(
            new TransactionItem({
                ...this.props.transactionItem,
                amount: Number.parseFloat(amount),
            }),
        );

    updateAmountType = (amountType: string) =>
        this.props.onUpdate(
            new TransactionItem({
                ...this.props.transactionItem,
                amountType: amountType as AmountTypes,
            }),
        );

    render() {
        const {
            transactionItem: {
                amountType,
                amount = '',
                item: { name, priceMin, priceMax },
            },
            currency,
            exchangeRate = 1,
            inputRef,
        } = this.props;

        return (
            <div className="OrderItem padding">
                <div className="flex">
                    <h3 className="grow">{name}</h3>
                    {priceMin &&
                        priceMax && (
                            <span className="price-range">
                                {formatPrice(priceMin * exchangeRate)} ~{' '}
                                {formatPrice(priceMax * exchangeRate)}
                                &nbsp;
                                {currencySymbol(currency)}
                                &nbsp;/&nbsp;
                                {SingleUnit[amountType]}
                                {amountType}
                            </span>
                        )}
                    <span className="remove" onClick={this.removeItem}>
                        &times;
                    </span>
                </div>
                <div className="flex">
                    <span className="amount input-inline">
                        <input
                            className="grow inline"
                            type="number"
                            name="item-amount"
                            placeholder="Amount..."
                            value={amount}
                            tabIndex={0}
                            onChange={this.updateAmount}
                            onKeyDown={this.submit}
                            onFocus={this.selectText}
                            ref={inputRef}
                        />
                    </span>
                    <Choices
                        choices={Object.values(AmountTypes)}
                        isSelected={this.isAmountTypeSelected}
                        onChoice={this.updateAmountType}
                        tabIndex={-1}
                    />
                </div>
            </div>
        );
    }
}
