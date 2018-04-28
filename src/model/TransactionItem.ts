import { Item } from './Item';

export enum AmountTypes {
    Piece = 'pc',
    Weight = 'g',
    Volume = 'ml',
}

export class TransactionItem {
    public item!: Item;
    public amount?: number;
    public amountType: AmountTypes = AmountTypes.Piece;

    constructor(transactionItem?: Partial<TransactionItem>) {
        Object.assign(this, transactionItem);
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
