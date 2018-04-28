import React, { SFC } from 'react';
import './App.css';
import { Order } from '../order/Order';

export const App: SFC<{}> = () => (
    <div className="App">
        <Order />
    </div>
);
