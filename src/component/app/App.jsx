import React, { Component } from 'react';
import './App.css';
import { Order } from '../order/Order';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Order />
            </div>
        );
    }
}

export default App;
