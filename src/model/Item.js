export default class Item {
    constructor(_id, name, priceMin = 0, priceMax = 0) {
        this._id = _id;
        this.name = name;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
    }

    static fromData({_id, name, priceMin, priceMax}) {
        return new Item(_id, name, priceMin, priceMax);
    }
}