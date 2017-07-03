export default class Item {
    constructor(name = '', amount = 1, amountType = 'piece', price = 0, currency = 'CZK') {
        this.name = name;
        this.amount = amount;
        this.amountType = amountType;
        this.price = price;
        this.currency = currency;
    }

    static fromData({name, amount, amountType, price, currency}) {
        return new Item(name, amount, amountType, price, currency);
    }
}
