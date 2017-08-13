export default class Transaction {
    static AmountTypes = ['piece', 'weight'];

    constructor(item = '', amount = 1, amountType = '', price = 0, currency = 'CZK') {
        this.item = item;
        this.amount = amount;
        this.amountType = amountType;
        this.price = price;
        this.currency = currency;
    }

    static fromData({item, amount, amountType, price, currency}) {
        return new Transaction(item, amount, amountType, price, currency);
    }
}

export const CURRENCIES = {
    czk: 'CZK',
    eur: 'EUR',
    usd: 'USD'
};
