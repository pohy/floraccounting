import React from 'react';
import { Component, FormEvent } from 'react';
import './SearchBar.css';

export interface ISearchBarProps {
    onQuery: (query: string) => void;
    onBlur: () => void;
    onFocus: () => void;
    inputRef: (input: HTMLInputElement) => void;
}

export interface ISearchBarState {
    query: string;
    focused: boolean;
}

export class SearchBar extends Component<ISearchBarProps, ISearchBarState> {
    static defaultProps = {
        onQuery: () => {},
        onBlur: () => {},
        onFocus: () => {},
    };

    state = {
        query: '',
        focused: false,
    };

    query = ({
        currentTarget: { value: query },
    }: FormEvent<HTMLInputElement>) => {
        this.setState({ query });
        this.props.onQuery(query);
    };

    close = () => {
        this.setState({ focused: false, query: '' });
        this.props.onQuery('');
        this.props.onBlur();
    };

    focus = () => {
        this.setState({ focused: true });
        this.props.onFocus();
    };

    render() {
        const { query, focused } = this.state;

        return (
            <span className="SearchBar flex grow">
                <input
                    className="padding"
                    autoComplete="off"
                    type="text"
                    placeholder="Search... 🔍"
                    value={query}
                    onInput={this.query}
                    onFocus={this.focus}
                    onBlur={this.close}
                    ref={this.props.inputRef}
                />
                <span
                    className={`close accent${focused ? '' : ' hide'}`}
                    onClick={this.close}
                >
                    &times;
                </span>
            </span>
        );
    }
}
