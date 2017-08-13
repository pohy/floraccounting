export default class Item {
    constructor(_id, name, priceMin = 0, priceMax = 0, amountType = 'piece') {
        this._id = _id;
        this.name = name;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
        this.amountType = amountType;
    }

    static fromData({_id, name, priceMin, priceMax, amountType}) {
        return new Item(_id, name, priceMin, priceMax, amountType);
    }
}

export const AMOUNT_TYPE_LABELS = {
    piece: 'Piece',
    weight: '(g) Weight'
};