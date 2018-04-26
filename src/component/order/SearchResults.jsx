import React from 'react';

const EXISTING_ITEMS = [
    'Kombucha',
    'Večeře',
    'Datlový štrůdl',
    'Raw klobáska',
    'Konopný čaj',
    'Wayusa',
    'Birdsong coffee',
];

export const SearchResults = ({ onClick = () => {}, query = '' }) => (
    <div className="search-results">
        {search(query).map((result, key) => (
            <div
                className="result flex"
                onMouseDown={selectResult(result, onClick)}
                {...{ key }}
            >
                <span className="name">{result}</span>
                <span className="add primary">+</span>
            </div>
        ))}
    </div>
);

function selectResult(result, onClick) {
    return () => {
        onClick(result);
    };
}

function search(query) {
    // TODO: sort
    return EXISTING_ITEMS.filter(
        (item) =>
            item
                .normalize('NFD')
                .toLowerCase()
                .indexOf(query.normalize('NFD').toLowerCase()) > -1,
    );
}
