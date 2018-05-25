import React from 'react';
import { SFC } from 'react';
import { Transaction } from '../../common/model/Transaction';
import './OrderEntry.css';
import { Img } from '../components/Img';

export interface IOrderEntryProps {
    transaction: Transaction;
}

export const OrderEntry: SFC<IOrderEntryProps> = ({
    transaction: { items, price, currency, created, user },
}) => {
    const profilePicture = user && user.profilePictureURL;
    return (
        <div className="OrderEntry padding">
            <div className="flex">
                {profilePicture && (
                    <span className="picture">
                        <Img
                            className="badge"
                            src={profilePicture}
                            alt={user.name}
                        />
                    </span>
                )}
                <span className="grow">
                    <div className="flex">
                        <span className="items grow">
                            {items.map(({ name }) => name).join(', ')}
                        </span>
                        <span className="price">
                            {price}&nbsp;{currency}
                        </span>
                    </div>
                    <div className="info flex">
                        <span className="time grow">
                            {created.toLocaleString('en-US')}
                        </span>
                        <a href="#" className="more">
                            More...
                        </a>
                    </div>
                </span>
            </div>
        </div>
    );
};
