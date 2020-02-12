import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import '../node_modules/normalize.css/normalize.css';
//import '../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
//import '../node_modules/@blueprintjs/core/lib/css/blueprint.css';
//import 'fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap';
//import 'fonts.googleapis.com/icon?family=Material+Icons';

import App from './App';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
