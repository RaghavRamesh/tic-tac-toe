import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import TicTacToe from './components/TicTacToe';

const store = configureStore();
render(
  <Provider store={store}>
    <TicTacToe />
  </Provider>,
  document.querySelector('#app')
);
