import * as React from 'react';
import { FormEvent, KeyboardEvent, FocusEvent, Component } from 'react';
import { AmountTypes, SingleUnit } from '../../common/model/TransactionItem';
import './OrderItem.css';
import { Choices } from '../components/Choices';
import { TransactionItem } from '../../common/model/TransactionItem';
import { Currencies, currencySymbol } from '../../common/model/Transaction';
import { formatPrice } from '../common/format-price';
import { selectInputText } from '../common/select-input-text';

export interface IOrderItemProps {
    transactionItem: TransactionItem;
    currency: Currencies;
    exchangeRate?: number;
    focus?: boolean;
    onRemove: (itemID: string) => void;
    onUpdate: (updatedTransactionItem: TransactionItem) => void;
    onSubmit: (input: HTMLInputElement) => void;
    inputRef: (inputElement: HTMLInputElement) => void;
}

export class OrderItem extends Component<IOrderItemProps, {}> {
    private amountInput!: HTMLInputElement;

    componentDidUpdate(previousProps: IOrderItemProps) {
        const { focus } = this.props;
        if (focus) {
            this.amountInput.focus();
        }
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

    updateAmountType = (amountType: string) => {
        this.amountInput.focus();
        this.props.onUpdate(
            new TransactionItem({
                ...this.props.transactionItem,
                amountType: amountType as AmountTypes,
            }),
        );
    };

    amountInputRef = (amountInput: HTMLInputElement) => {
        this.amountInput = amountInput;
        this.props.inputRef(amountInput);
    };

    render() {
        const {
            transactionItem: {
                amountType,
                amount = '',
                item: { name, priceMin, priceMax },
            },
            currency,
            exchangeRate = 1,
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
                            value={amount || ''}
                            tabIndex={0}
                            onChange={this.updateAmount}
                            onKeyDown={this.submit}
                            onFocus={selectInputText}
                            ref={this.amountInputRef}
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
