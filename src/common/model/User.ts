import * as uuid from 'uuid';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    facebookID?: string;
    profilePictureURL?: string;
    created: Date;
}

export class User implements IUser {
    _id: string = uuid.v4();
    name: string = '';
    email: string = '';
    facebookID?: string;
    created: Date = new Date();
    profilePictureURL?: string;

    constructor(user?: Partial<User>) {
        Object.assign(this, user);
        this.created = new Date(this.created);
    }
}
