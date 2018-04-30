import React from 'react';
import { Component } from 'react';
import { Item } from '../../model/Item';

export type OnClickHandler = (item: Item) => void;

export interface ISearchResultsProps {
    query: string;
    results: Item[];
    onClick: OnClickHandler;
}

export class SearchResults extends Component<ISearchResultsProps, {}> {
    static defaultProps = {
        onClick: () => {},
        query: '',
    };

    selectResult = (item: Item) => () => this.props.onClick(item);

    createNew = () => this.props.onClick(new Item({ name: this.props.query }));

    render() {
        const { query, results } = this.props;

        return (
            <div className="search-results">
                {results.map((item, key) => (
                    <div
                        className="result flex"
                        onMouseDown={this.selectResult(item)}
                        {...{ key }}
                    >
                        <span className="name">{item.name}</span>
                        <span className="add primary">Add to order</span>
                    </div>
                ))}
                {!results.length &&
                    query && (
                        <div
                            className="result flex"
                            onMouseDown={query ? this.createNew : undefined}
                        >
                            <em className="name">{query}</em>
                            <span className="add primary">Create new item</span>
                        </div>
                    )}
            </div>
        );
    }
}