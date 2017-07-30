import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import './Records.css';

class Records extends Component {
    static propTypes = {
        transactions: PropTypes.array.isRequired,
        items: PropTypes.array.isRequired
    };

    formatDate = (dateString, format) => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        return dateFormat(date, format);
    };

    findItemName(id) {
        const item = this.props.items.find(({_id}) => _id === id);
        console.log(id, item, this.props.items)
        return (item && item.name) || '';
    }

    render() {
        const {transactions} = this.props;
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
                {!transactions.length && <tr><td>No transactions yet...</td></tr>}
                {transactions.map(({item: id, amount, price, created}, i) => (
                    <tr key={i}>
                        <td>{this.findItemName(id)}</td>
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