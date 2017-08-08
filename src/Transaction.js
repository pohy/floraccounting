export default class Transaction {
    static AmountTypes = ['piece', 'weight'];

    constructor(item = '', amount = 1, amountType = 'piece', price = 0, currency = 'CZK', newItem = null) {
        this.item = item;
        this.amount = amount;
        this.amountType = amountType;
        this.price = price;
        this.currency = currency;
        this.newItem = newItem;
    }

    static fromData({item, amount, amountType, price, currency, newItem}) {
        return new Transaction(item, amount, amountType, price, currency, newItem);
    }
}
