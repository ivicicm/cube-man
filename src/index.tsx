import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GameLevel from './pages/GameLevel';
import * as serviceWorker from './serviceWorker';
import level from './levels/1.txt'
import Modal from 'react-modal';

Modal.setAppElement('#root')

ReactDOM.render(
  <React.StrictMode>
    <GameLevel gameChart={level}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
