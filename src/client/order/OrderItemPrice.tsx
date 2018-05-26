import React, { SyntheticEvent } from 'react';
import { Component } from 'react';
import { Title } from '../routing/Title';
import { Item } from '../../common/model/Item';
import './OrderItemPrice.css';
import {
    AmountTypes,
    TransactionItem,
    SingleUnit,
} from '../../common/model/TransactionItem';
import { Choices } from '../components/Choices';
import { currencySymbol, Currencies } from '../../common/model/Transaction';

export interface IOrderItemPriceProps {
    item: Item;
    onSave: (transactionItem: TransactionItem) => void;
    onCancel: () => void;
}

export interface IOrderItemPriceState {
    transactionItem: TransactionItem;
}

export class OrderItemPrice extends Component<
    IOrderItemPriceProps,
    IOrderItemPriceState
> {
    constructor(props: IOrderItemPriceProps) {
        super(props);
        this.state = {
            transactionItem: new TransactionItem({ item: props.item }),
        };
    }

    isAmountTypeSelected = (type: string) =>
        type === this.state.transactionItem.amountType;

    updateAmountType = (amountType: string) => {
        this.setState({
            transactionItem: new TransactionItem({
                ...this.state.transactionItem,
                amountType: amountType as AmountTypes,
            }),
        });
    };

    save = () => this.props.onSave(this.state.transactionItem);

    updatePrice = (field: 'priceMin' | 'priceMax') => ({
        currentTarget: { value },
    }: SyntheticEvent<HTMLInputElement>) => {
        const { transactionItem } = this.state;
        console.log(transactionItem);
        this.setState({
            transactionItem: new TransactionItem({
                ...transactionItem,
                item: new Item({
                    ...transactionItem.item,
                    [field]: Number.parseFloat(value),
                }),
            }),
        });
    };

    render() {
        const {
            transactionItem: {
                item: { name, priceMin, priceMax },
                amountType,
            },
        } = this.state;
        const { onCancel } = this.props;

        return (
            <div className="OrderItemPrice flex-default column grow padding">
                <Title>{`${name} - New item`}</Title>
                <div className="flex-default center-content">
                    <strong className="text-medium bold grow">{name}</strong>
                    <span className="text-secondary">New item ✨</span>
                </div>
                <div className="separator" />
                <div className="price-range flex-default row grow center-content">
                    <input
                        className="inline"
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={this.updatePrice('priceMin')}
                    />
                    <span className="text-big">&nbsp;~&nbsp;</span>
                    <input
                        className="inline"
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={this.updatePrice('priceMax')}
                    />
                    <span>&nbsp;{currencySymbol(Currencies.CZK)}</span>
                </div>
                <div className="flex-default row grow center-content">
                    <span className="grow">For</span>
                    <span>{SingleUnit[amountType]}&nbsp;</span>
                    <Choices
                        choices={Object.values(AmountTypes)}
                        isSelected={this.isAmountTypeSelected}
                        onChoice={this.updateAmountType}
                        tabIndex={-1}
                    />
                </div>
                <div className="separator" />
                <div className="flex-default row center-content">
                    <button className="button grow shrink" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className="button grow shrink primary"
                        onClick={this.save}
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }
}
