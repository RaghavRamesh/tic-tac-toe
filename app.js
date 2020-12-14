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
app.use('/game/assets', express.static(path.resolve(__dirname, 'assets')));
// for parsing application/json
app.use(bodyParser.json());
// hide powered by express
app.disable('x-powered-by');

// start the server
httpServer.listen(process.env.PORT || 3000);

const initialGameState = {
  isGame: true,
  boxes: Array(9).fill(null),
  isGameOver: false,
  result: null,
  nextTurn: 'X',
}

const gamesStates = new Map();
gamesStates.set('test', {
  ...initialGameState,
  gameId: "test"
});

app.get('/', (req, res) => {
  const content  = ssr({ isGame: false })
  const response = template({ isGame: false }, content)
  console.log('[/] gamesStates:', gamesStates);
  res.send(response);
});

app.get('/game/:gameId', (req, res) => {
  // TODO: validate gameId
  // if games[gameId] doesn't exist, initialize and return initial state
  const gameId = req.params.gameId;
  console.log(`[/game/${gameId}] gamesStates:`, gamesStates);
  if (!gamesStates.has(gameId)) {
    gamesStates.set(gameId, { ...initialGameState, gameId });
  }
  const gameState = gamesStates.get(gameId);
  const content  = ssr(gameState)
  const response = template(gameState, content)
  console.log(`[/game/${gameId}] gamesStates:`, gamesStates);
  res.send(response);
});

app.post("/api/select-box", (req, res) => {
  // TODO: validate gameId, box, player
  const data = req.body;
  const { gameId, box, player } = data;

  // deep copy
  const gameState = JSON.parse(JSON.stringify(gamesStates.get(gameId)));
  gameState.boxes[box] = player;
  const [over, result] = isGameOver(gameState.boxes);
  if (over) {
    gameState.result = result === 'draw' ? 'draw' : gameState.nextTurn;
    gameState.isGameOver = true;
    gameState.nextTurn = null;
  } else {
    // if current turn is X, set O or vice versa
    gameState.nextTurn = gameState.nextTurn === 'X' ? 'O' : 'X';
  }

  // update server gamesStates
  gamesStates.set(gameId, gameState);
  res.send({ data: gameState });
  console.log('[sb] gamesStates:', gamesStates)
  io.emit('game-state-update', { gameState });
});

app.post('/api/play-again', (req, res) => {
  // TODO: validate gameId
  const data = req.body;
  const { gameId } = data;
  const gameState = { ...initialGameState, gameId };
  gamesStates.set(gameId, gameState);
  res.send({ data: gameState });
  io.emit('game-state-update', { gameState });
});

// TODO: clean up game states if last interaction was greater than 6 hours ago

const isGameOver = (boxes) => {
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
