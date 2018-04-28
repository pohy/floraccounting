import uuid from 'uuid';
export class Item {
    public _id: string = uuid.v4();
    public name!: string;
    public priceMin?: number;
    public priceMax?: number;

    constructor(item?: Partial<Item>) {
        Object.assign(this, item);
    }

    // constructor({ _id = uuid.v4(), name, priceMin = 0, priceMax = 0 } = {}) {
    //     this._id = _id;
    //     this.name = name;
    //     this.priceMin = priceMin;
    //     this.priceMax = priceMax;
    // }
    // constructor(
    //     public name: string,
    //     public priceMin?: number,
    //     public priceMax?: number,
    //     public _id: string = uuid.v4(),
    // ) {}

    isValid() {
        return !!(this._id && this.name);
    }
}
