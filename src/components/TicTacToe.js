import React, { Component } from 'react'
import InputForm from './InputForm'
import Board from './Board'

class TicTacToe extends Component {
  constructor(props) {
    super(props);
    const {
      boxes, nextTurn, isGameOver, result, gameId
    } = props;
    this.state = {
      boxes,
      whoIsPlaying: nextTurn,
      isGameOver,
      result,
      player: null,
      gameId
    };
    this.handleBoxClick = this.handleBoxClick.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.setPlayer = this.setPlayer.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('game-state-update', ({ gameState }) => {
      this.updateGameState(gameState);
    })
  }

  updateGameState(data) {
    const { boxes, nextTurn, isGameOver, result } = data;
    this.setState({
      boxes,
      whoIsPlaying: nextTurn,
      isGameOver,
      result
    })
  }

  setPlayer(event) {
    this.setState({player:event.target.value});
  }

  handleBoxClick(boxId) {
    const {
      gameId,
      whoIsPlaying
    } = this.state;

    fetch('/api/select-box', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        gameId,
        player: whoIsPlaying,
        box: boxId
      })
    })
      .then(response => response.json())
      .then(({ data }) => {
        this.updateGameState(data);
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  playAgain() {
    fetch('/api/play-again', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        gameId: this.state.gameId
      })
    })
      .then(response => response.json())
      .then(({ data }) => {
        this.updateGameState(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  renderResult() {
    const { result, isGameOver, whoIsPlaying } = this.state;
    const style = {
      textAlign: 'center'
    };
    if (isGameOver) {
      if (result === 'draw') {
        return <h2 style={style}>It's a draw!</h2>;
      } else {
        return <h2 style={style}>{`${result} wins!`}</h2>
      }
    }
    return <h2 style={style}>{`${whoIsPlaying}'s turn`}</h2>
  }

  render() {
    const { boxes, player, isGameOver, whoIsPlaying, gameId } = this.state;
    return (
      <>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Tic Tac Toe</h1>
        {!this.props.isGame ? (
          <InputForm />
        ) : (
          <>
            {typeof(window) != 'undefined' ? (
              <p
                style={{
                  fontFamily: 'verdana',
                  fontSize: '12px',
                  color: '#888'
                }}
              >Send this link to friends:{' '}
                <a
                  href={`${window.location.protocol}//${window.location.host}/game/${gameId}`}
                >
                  {`${window.location.protocol}//${window.location.host}/game/${gameId}`}
                </a>
              </p>
            ) : null}
            <hr />
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px"
            }}>
              <div>
                <input type="radio" onChange={this.setPlayer} id="x-button" name="player" value="X" checked={player === 'X'} />
                <label htmlFor="x-button">X</label>
                <input type="radio" onChange={this.setPlayer} id="o-button" name="player" value="O" checked={player === 'O'} />
                <label htmlFor="o-button">O</label>
              </div>
              <button onClick={this.playAgain} style={{cursor: 'pointer'}}>Next game</button>
            </div>
            <Board
              boxes={boxes}
              handleClick={this.handleBoxClick}
              disableButtons={isGameOver || (whoIsPlaying !== player)}
            />
            {this.renderResult()}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                fontSize: '12px',
                fontFamily: 'verdana',
              }}
            >
              <a style={{ color: '#ccc' }} href="https://www.buymeacoffee.com/raghavramesh">
                Buy the developer a coffee
              </a>
            </div>
          </>
        )}
      </>
    );
  }
}
 
export default TicTacToe;
