import * as uuid from 'uuid';
import { TransactionItem } from './TransactionItem';
import { Item } from './Item';
import { User } from './User';

export enum Currencies {
    CZK = 'CZK',
    EUR = 'EUR',
    USD = 'USD',
}

export function currencySymbol(currency: Currencies): string {
    switch (currency) {
        case Currencies.CZK:
            return 'kč';
        case Currencies.EUR:
            return '€';
        case Currencies.USD:
            return '$';
    }
}

export interface ITransaction {
    _id: string;
    price?: number;
    transactionItems: TransactionItem[];
    items: Item[];
    currency: Currencies;
    created: Date;
    user: User;
}

export class Transaction implements ITransaction {
    public _id: string = uuid.v4();
    public transactionItems: TransactionItem[] = [];
    public price?: number;
    public currency: Currencies = Currencies.CZK;
    public created: Date = new Date();
    public user: User = new User();

    constructor(transaction?: Partial<Transaction>) {
        Object.assign(this, transaction);
        this.created = new Date(this.created);
    }

    get items() {
        return this.transactionItems.reduce(
            (items: Item[], { item }) => items.concat(item),
            [],
        );
    }

    addItem(newItem: Item) {
        this.transactionItems = [
            ...this.transactionItems,
            new TransactionItem({ item: newItem }),
        ];
        return this;
    }

    removeTransactionItem(itemID: string) {
        this.transactionItems = this.transactionItems.filter(
            ({ item: { _id } }) => _id !== itemID,
        );
        return this;
    }

    updateTransactionItem(updatedTransactionItem: TransactionItem) {
        this.transactionItems = this.transactionItems.map(
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
            this.created &&
            this.user
        );
    }

    areTransactionsItemsValid() {
        return (
            this.transactionItems.length &&
            this.transactionItems.reduce(
                (valid, transactionItem) => valid && transactionItem.isValid(),
                true,
            )
        );
    }
}
