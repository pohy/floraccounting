import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import './Records.css';

class Records extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired
    };

    formatDate = (dateString, format) => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        return dateFormat(date, format);
    };

    render() {
        const {items} = this.props;
        return (
            <table className="Records">
                <thead>
                <tr>
                    <td>Item name</td>
                    <td>Amount</td>
                    <td>Price</td>
                    <td className="time">Time</td>
                    <td className="date">Date</td>
                </tr>
                </thead>
                <tbody>
                {!items.length && <tr><td>No items yet...</td></tr>}
                {items.map(({name, amount, price, created}, i) => (
                    <tr key={i}>
                        <td>{name}</td>
                        <td>{amount}</td>
                        <td>{price}</td>
                        <td className="time">{this.formatDate(created, 'HH:MM')}</td>
                        <td className="date">{this.formatDate(created, 'mm/dd/yyyy')}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

export default Records;