import React from 'react';
import { hydrate } from 'react-dom';
import TicTacToe from './components/TicTacToe';

const socket = window.__SOCKET__;
const state = {
  ...window.__STATE__,
  socket
};
delete window.__STATE__;
delete window.__SOCKET__;
hydrate(<TicTacToe {...state} />, document.querySelector('#app'));
