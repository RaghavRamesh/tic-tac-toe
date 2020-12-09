import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import TicTacToe from './components/TicTacToe';

const state = window.__STATE__;
delete window.__STATE__;
const store = configureStore(state);
hydrate(
  <Provider store={store}>
    <TicTacToe />
  </Provider>,
  document.querySelector('#app')
);
