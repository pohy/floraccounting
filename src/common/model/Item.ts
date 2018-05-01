import * as uuid from 'uuid';
export class Item {
    public _id: string = uuid.v4();
    public name!: string;
    public priceMin?: number;
    public priceMax?: number;

    constructor(item?: Partial<Item>) {
        Object.assign(this, item);
    }

    isValid() {
        return !!(this._id && this.name);
    }
}
