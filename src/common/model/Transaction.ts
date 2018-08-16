import * as uuid from 'uuid';
import { TransactionItem } from './TransactionItem';
import { Item } from './Item';
import { User } from './User';
import {
    calculateTransactionItemsPriceRanges,
    recommendedPrice,
} from '../../client/common/price-range';

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
    public recommendedPrice: boolean = true;
    public currency: Currencies = Currencies.CZK;
    public created: Date = new Date();
    public user: User = new User();

    private internalPrice = 0;

    constructor(transaction?: Partial<Transaction>) {
        const transactionItems = (
            (transaction && transaction.transactionItems) ||
            []
        ).map((transactionItem) => new TransactionItem(transactionItem));
        const user = new User((transaction && transaction.user) || {});
        Object.assign(this, {
            ...transaction,
            transactionItems,
            user,
        });
        this.created = new Date(this.created);
    }

    get price() {
        return this.recommendedPrice
            ? recommendedPrice(
                  calculateTransactionItemsPriceRanges(this.transactionItems),
              )
            : this.internalPrice;
    }

    set price(newPrice: number) {
        this.recommendedPrice = false;
        this.internalPrice = newPrice;
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

    addTransactionItem(newTransactionItem: TransactionItem) {
        this.transactionItems = [...this.transactionItems, newTransactionItem];
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

    toJSON() {
        const {
            _id,
            created,
            currency,
            price,
            recommendedPrice,
            user,
            transactionItems,
        } = this;
        return {
            _id,
            created,
            currency,
            price,
            recommendedPrice,
            user,
            transactionItems,
        };
    }
}
