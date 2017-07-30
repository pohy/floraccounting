import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import 'react-select/dist/react-select.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
