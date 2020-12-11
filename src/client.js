import React from 'react';
import { hydrate } from 'react-dom';
import TicTacToe from './components/TicTacToe';

const state = window.__STATE__;
delete window.__STATE__;
hydrate(<TicTacToe {...state} />, document.querySelector('#app'));
