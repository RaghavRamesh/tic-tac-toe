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
app.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded


// hide powered by express
app.disable('x-powered-by');
// start the server
app.listen(process.env.PORT || 3000);

const gameState = {
  boxes: Array(9).fill(' ')
}

// server rendered home page
app.get('/', (req, res) => {
  const { preloadedState, content}  = ssr(gameState)
  const response = template("Server Rendered Page", preloadedState, content)
  res.setHeader('Cache-Control', 'assets, max-age=604800')
  res.send(response);
});


app.post("/click", function (req, res) {
  const data = req.body;
  gameState.boxes[data.box] = data.player === 1 ? 'x' : 'o';
  // check if game over
  res.send({ data: gameState });
});
