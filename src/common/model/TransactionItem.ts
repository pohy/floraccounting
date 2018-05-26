import { Item } from './Item';

export enum AmountTypes {
    Piece = 'pc',
    Weight = 'g',
    Volume = 'ml',
}

export const SingleUnit = {
    [AmountTypes.Piece]: 1,
    [AmountTypes.Weight]: 100,
    [AmountTypes.Volume]: 100,
};

export class TransactionItem {
    public item!: Item;
    public amount?: number = 1;
    public amountType: AmountTypes = AmountTypes.Piece;

    constructor(transactionItem?: Partial<TransactionItem>) {
        const item = new Item((transactionItem && transactionItem.item) || {});
        Object.assign(this, {
            ...transactionItem,
            item,
        });
    }

    isValid() {
        return !!(
            this.item.isValid() &&
            this.amount &&
            this.amount > 0 &&
            this.amountType
        );
    }
}

export const AMOUNT_TYPES = {
    piece: 'pc',
    weight: 'g',
    volume: 'ml',
};
