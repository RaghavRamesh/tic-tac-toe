import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import template from './src/template'
import ssr from './src/server'

const app = express()

// Serving static files
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/media', express.static(path.resolve(__dirname, 'media')));
app.use(bodyParser.json()); // for parsing application/json


// hide powered by express
app.disable('x-powered-by');
// start the server
app.listen(process.env.PORT || 3000);

const gameState = {
  boxes: Array(9).fill(null),
  isGameOver: false,
  winner: null,
  nextTurn: 'X'
}

app.get('/', (req, res) => {
  const { preloadedState, content}  = ssr(gameState)
  const response = template("Server Rendered Page", preloadedState, content)
  res.setHeader('Cache-Control', 'assets, max-age=604800')
  res.send(response);
});

app.get('/refresh', (req, res) => {
  res.send({ data: gameState });
});

app.post("/click", function (req, res) {
  const data = req.body;
  gameState.boxes[data.box] = data.player;
  if (isGameOver()) {
    gameState.winner = gameState.nextTurn;
    gameState.isGameOver = true;
    gameState.nextTurn = null;
  } else {
    gameState.nextTurn = gameState.nextTurn === 'X' ? 'O' : 'X';
  }
  res.send({ data: gameState });
});

const isGameOver = () => {
  const boxes = gameState.boxes;
  return ((boxes[0] === boxes[1]) && (boxes[0] === boxes[2]) && (boxes[0] !== null))
    || ((boxes[3] === boxes[4]) && (boxes[3] === boxes[5]) && (boxes[3] !== null))
    || ((boxes[6] === boxes[7]) && (boxes[6] === boxes[8]) && (boxes[6] !== null))
    || ((boxes[0] === boxes[3]) && (boxes[0] === boxes[6]) && (boxes[0] !== null))
    || ((boxes[1] === boxes[4]) && (boxes[1] === boxes[7]) && (boxes[1] !== null))
    || ((boxes[2] === boxes[5]) && (boxes[2] === boxes[8]) && (boxes[2] !== null))
    || ((boxes[0] === boxes[4]) && (boxes[0] === boxes[8]) && (boxes[0] !== null))
    || ((boxes[2] === boxes[4]) && (boxes[2] === boxes[6]) && (boxes[2] !== null));
}
