import React from 'react';
import { renderToString } from 'react-dom/server';
import TicTacToe from './components/TicTacToe';

module.exports = function render(initialState) {
  return renderToString(
    <TicTacToe {...initialState} />
  );
};
