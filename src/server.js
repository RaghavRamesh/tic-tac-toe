import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import TicTacToe from './components/TicTacToe';

module.exports = function render(initialState) {
  const store = configureStore(initialState);
  const content = renderToString(
    <Provider store={store}>
      <TicTacToe />
    </Provider>
  );
  const preloadedState = store.getState();
  return {
    content,
    preloadedState
  };
};
