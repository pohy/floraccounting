import uuid from 'uuid';
export class Item {
    constructor({ _id = uuid.v4(), name, priceMin = 0, priceMax = 0 } = {}) {
        this._id = _id;
        this.name = name;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
    }

    isValid() {
        return !!(this._id && this.name);
    }
}
