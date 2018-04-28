import uuid from 'uuid';
import { TransactionItem } from './TransactionItem';
import { Item } from './Item';

export const CURRENCIES = {
    czk: 'kč',
    eur: '€',
    usd: '$',
};

export enum Currencies {
    CZK = 'kč',
    EUR = '€',
    USD = '$',
}

export interface ITransaction {
    _id: string;
    price?: number;
    items: TransactionItem[];
    currency: Currencies;
    created: Date;
}

export class Transaction implements ITransaction {
    public _id: string = uuid.v4();
    public items: TransactionItem[] = [];
    public price?: number;
    public currency: Currencies = Currencies.CZK;
    public created: Date = new Date();

    constructor(transaction?: Partial<Transaction>) {
        Object.assign(this, transaction);
    }

    addItem(newItem: Item) {
        this.items = [...this.items, new TransactionItem({item: newItem})];
        return this;
    }

    removeTransactionItem(itemID: string) {
        this.items = this.items.filter(({ item: { _id } }) => _id !== itemID);
        return this;
    }

    updateTransactionItem(updatedTransactionItem: TransactionItem) {
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
            this.price &&
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
