import express from 'express'
import http from 'http';
import socketio from 'socket.io';
import bodyParser from 'body-parser'
import path from 'path'
import template from './src/template'
import ssr from './src/server'

const app = express()
const httpServer = http.createServer(app)
const io = socketio(httpServer);

// Serving static files
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
// for parsing application/json
app.use(bodyParser.json());
// hide powered by express
app.disable('x-powered-by');

// start the server
httpServer.listen(process.env.PORT || 3000);

let gameState = {
  boxes: Array(9).fill(null),
  isGameOver: false,
  result: null,
  nextTurn: 'X',
}

app.get('/', (req, res) => {
  const content  = ssr(gameState)
  const response = template("Tic Tac Toe", gameState, content)
  res.setHeader('Cache-Control', 'assets, max-age=604800')
  res.send(response);
});

app.get('/refresh', (req, res) => {
  res.send({ data: gameState });
});

app.post("/click", (req, res) => {
  const data = req.body;
  gameState.boxes[data.box] = data.player;
  const [over, result] = isGameOver();
  if (over) {
    gameState.result = result === 'draw' ? 'draw' : gameState.nextTurn;
    gameState.isGameOver = true;
    gameState.nextTurn = null;
  } else {
    // if current turn is X, set O or vice versa
    gameState.nextTurn = gameState.nextTurn === 'X' ? 'O' : 'X';
  }
  res.send({ data: gameState });
  io.emit('game-state-update', { gameState });
});

app.post('/play-again', (req, res) => {
  gameState = {
    boxes: Array(9).fill(null),
    isGameOver: false,
    result: null,
    nextTurn: 'X',
  };
  res.send({ data: gameState });
  io.emit('game-state-update', { gameState });
});

const isGameOver = () => {
  const boxes = gameState.boxes;
  if (((boxes[0] === boxes[1]) && (boxes[0] === boxes[2]) && (boxes[0] !== null)) // row 1
    || ((boxes[3] === boxes[4]) && (boxes[3] === boxes[5]) && (boxes[3] !== null)) // row 2
    || ((boxes[6] === boxes[7]) && (boxes[6] === boxes[8]) && (boxes[6] !== null)) // row 3
    || ((boxes[0] === boxes[3]) && (boxes[0] === boxes[6]) && (boxes[0] !== null)) // col 1
    || ((boxes[1] === boxes[4]) && (boxes[1] === boxes[7]) && (boxes[1] !== null)) // col 2
    || ((boxes[2] === boxes[5]) && (boxes[2] === boxes[8]) && (boxes[2] !== null)) // col 3
    || ((boxes[0] === boxes[4]) && (boxes[0] === boxes[8]) && (boxes[0] !== null)) // diag 1
    || ((boxes[2] === boxes[4]) && (boxes[2] === boxes[6]) && (boxes[2] !== null)) // diag 2
  ) {
    return [true, 'win']
  } else if (!boxes.includes(null)) {
    return [true, 'draw'];
  }
  return [false, null]
}
