import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import 'react-select/dist/react-select.css';
import App from './component/app/App.jsx';
import registerServiceWorker from './component/common/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
