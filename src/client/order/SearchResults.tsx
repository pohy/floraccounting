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
    className?: string;
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
            className={`result padding${disabled ? ' disabled' : ''}`}
            onMouseDown={disabled ? undefined : this.selectResult(item)}
            {...{ key }}
        >
            <div className="flex">
                <span className="name">{item.name}</span>
                {disabled ? (
                    <span>Already in order 👌</span>
                ) : (
                    <span className="add primary">Add to order ➕</span>
                )}
            </div>
        </div>
    );

    render() {
        const { query, results, selectedItemIDs, className } = this.props;
        return (
            <div
                className={`SearchResults flex grow column${
                    className ? ` ${className}` : ''
                }`}
            >
                {results
                    .filter(({ _id }) => !(selectedItemIDs || []).includes(_id))
                    .map((item, i) => this.renderResult(item, i))}
                {results
                    .filter(({ _id }) => (selectedItemIDs || []).includes(_id))
                    .map((item, i) => this.renderResult(item, i, true))}
                {!results.length &&
                    query && (
                        // TODO: Merge with renderResult
                        <div
                            className="result padding"
                            onMouseDown={query ? this.createNew : undefined}
                        >
                            <div className="flex">
                                <em className="name">{query}</em>
                                <span className="add primary">
                                    Create new item ✨
                                </span>
                            </div>
                        </div>
                    )}
            </div>
        );
    }
}
