import React from 'react';
import { Item } from '../../model/Item';

const EXISTING_ITEMS = [
    new Item({ name: 'Kombucha' }),
    new Item({ name: 'Dinner' }),
    new Item({ name: 'Date strudel' }),
    new Item({ name: 'Raw sausage' }),
    new Item({ name: 'Cannabis tea' }),
    new Item({ name: 'Wayusa' }),
    new Item({ name: 'Birdsong coffee' }),
];

export const SearchResults = ({ onClick = () => {}, query = '' }) => (
    <div className="search-results">
        {search(query).map((item, key) => (
            <div
                className="result flex"
                onMouseDown={selectResult(item, onClick)}
                {...{ key }}
            >
                <span className="name">{item.name}</span>
                <span className="add primary">+</span>
            </div>
        ))}
    </div>
);

function selectResult(item, onClick) {
    return () => {
        onClick(item);
    };
}

function search(query) {
    // TODO: sort
    return EXISTING_ITEMS.filter(
        ({ name }) =>
            name
                .normalize('NFD')
                .toLowerCase()
                .indexOf(query.normalize('NFD').toLowerCase()) > -1,
    );
}
