export default class Transaction {
    static AmountTypes = ['piece', 'weight'];

    constructor(item = '', amount = 1, amountType = '', price = 0, currency = 'CZK', bartender = '') {
        this.item = item;
        this.amount = amount;
        this.amountType = amountType;
        this.price = price;
        this.currency = currency;
        this.bartender = bartender;
    }

    static fromData({item, amount, amountType, price, currency, bartender}) {
        return new Transaction(item, amount, amountType, price, currency, bartender);
    }
}

export const CURRENCIES = {
    czk: 'CZK',
    eur: 'EUR',
    usd: 'USD'
};
