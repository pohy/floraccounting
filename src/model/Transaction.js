import uuid from 'uuid';
import { TransactionItem } from './TransactionItem';

export const CURRENCIES = {
    czk: 'kč',
    eur: '€',
    usd: '$',
};

export class Transaction {
    static AmountTypes = ['piece', 'weight'];

    constructor({
        _id = uuid.v4(),
        price ,
        items = [],
        currency = CURRENCIES.czk,
        created = new Date(),
    } = {}) {
        this._id = _id;
        this.price = price;
        this.items = items;
        this.currency = currency;
        this.created = created;
    }

    addItem(newItem) {
        this.items = [...this.items, new TransactionItem({ item: newItem })];
        return this;
    }

    removeItem(itemID) {
        this.items = this.items.filter(({ item: { _id } }) => _id !== itemID);
        return this;
    }

    updateItem(updatedTransactionItem) {
        this.items = this.items.map(
            (transactionItem) =>
                transactionItem.item._id === updatedTransactionItem.item._id
                    ? updatedTransactionItem
                    : transactionItem,
        );
        return this;
    }

    isValid() {
        return !!(
            this.areTransactionsItemsValid() &&
            this._id &&
            this.price > 0 &&
            this.currency &&
            this.created
        );
    }

    areTransactionsItemsValid() {
        return (
            this.items.length &&
            this.items.reduce(
                (valid, transactionItem) => valid && transactionItem.isValid(),
                true,
            )
        );
    }
}
