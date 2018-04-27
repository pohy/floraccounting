export class TransactionItem {
    constructor({ item, amount, amountType = AMOUNT_TYPES.piece } = {}) {
        this.item = item;
        this.amount = amount;
        this.amountType = amountType;
    }

    isValid() {
        return !!(this.item.isValid() && this.amount > 0 && this.amountType);
    }
}

export const AMOUNT_TYPES = {
    piece: 'pc',
    weight: 'g',
    volume: 'ml',
};
