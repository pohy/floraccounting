import React, { Component } from 'react';

export class SearchBar extends Component {
    static defaultProps = {
        onQuery: () => {},
        onBlur: () => {},
        onFocus: () => {},
    };
    state = {
        query: '',
        focused: false,
    };
    query = ({ target: { value: query } }) => {
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
            <div className="search-bar flex">
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    value={query}
                    onInput={this.query}
                    onFocus={this.focus}
                    onBlur={this.close}
                />
                <span
                    className={`close accent${focused ? '' : ' hide'}`}
                    onClick={this.close}
                >
                    &times;
                </span>
            </div>
        );
    }
}
