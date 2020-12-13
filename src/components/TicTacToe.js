import React, { Component } from 'react'
import Board from './Board'

class TicTacToe extends Component {
  constructor(props) {
    super(props);
    const {
      boxes, nextTurn, isGameOver, result
    } = props;
    this.state = {
      boxes,
      whoIsPlaying: nextTurn,
      isGameOver,
      result,
      player: null,
      // refresher: null
    };
    this.handleBoxClick = this.handleBoxClick.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.setPlayer = this.setPlayer.bind(this);
  }

  componentDidMount() {
    // const refresher = setInterval(() => {
    //   this.refreshGame()
    // }, 10000)
    // this.setState({ refresher });
    this.props.socket.on('game-state-update', ({ gameState }) => {
      this.updateGameState(gameState);
    })
  }

  refreshGame() {
    fetch('http://localhost:3000/refresh')
      .then(response => response.json())
      .then(({ data }) => {
        this.updateGameState(data);
      })
      .catch((error) => {
        console.error("Error:", error);
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
    // if (isGameOver) {
    //   this.refreshGame()
    //   clearInterval(this.state.refresher);
    //   this.setState({ refresher: null });
    // }
  }

  setPlayer(event) {
    this.setState({player:event.target.value});
  }

  handleBoxClick(boxId) {
    fetch('http://localhost:3000/click', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        player: this.state.whoIsPlaying,
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
    fetch('http://localhost:3000/play-again', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
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
    const { boxes, player, isGameOver, whoIsPlaying } = this.state;
    return (
      <>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Tic Tac Toe</h1>
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
      </>
    );
  }
}
 
export default TicTacToe;
