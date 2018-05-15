import React from 'react';
import { Component } from 'react';
import { Item } from '../../common/model/Item';
import './SearchResults.css';

export type OnClickHandler = (item: Item) => void;

export interface ISearchResultsProps {
    query: string;
    results: Item[];
    onClick: OnClickHandler;
    selectedItemIDs?: string[];
}

export class SearchResults extends Component<ISearchResultsProps, {}> {
    static defaultProps = {
        onClick: () => {},
        query: '',
        selectedItemIDs: [],
    };

    selectResult = (item: Item) => () => this.props.onClick(item);

    createNew = () => this.props.onClick(new Item({ name: this.props.query }));

    private renderResult = (item: Item, key: number, disabled = false) => (
        <div
            className={`result flex${disabled ? ' disabled' : ''}`}
            onMouseDown={disabled ? undefined : this.selectResult(item)}
            {...{ key }}
        >
            <span className="name">{item.name}</span>
            {disabled ? (
                <span>Already in order 👌</span>
            ) : (
                <span className="add primary">Add to order ➕</span>
            )}
        </div>
    );

    render() {
        const { query, results, selectedItemIDs } = this.props;
        return (
            <div className="SearchResults">
                {/* TODO: Sort alphabetically, from backend */}
                {results
                    .filter(({ _id }) => !(selectedItemIDs || []).includes(_id))
                    .map((item, i) => this.renderResult(item, i))}
                {results
                    .filter(({ _id }) => (selectedItemIDs || []).includes(_id))
                    .map((item, i) => this.renderResult(item, i, true))}
                {!results.length &&
                    query && (
                        <div
                            className="result flex"
                            onMouseDown={query ? this.createNew : undefined}
                        >
                            <em className="name">{query}</em>
                            <span className="add primary">
                                Create new item ✨
                            </span>
                        </div>
                    )}
            </div>
        );
    }
}
