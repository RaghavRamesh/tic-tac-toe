import React, { Component } from 'react'
import Board from './Board'

class TicTacToe extends Component {
  constructor(props) {
    super(props);
    const {
      boxes, nextTurn, isGameOver, winner
    } = props;
    this.state = {
      boxes,
      whoIsPlaying: nextTurn,
      isGameOver,
      winner,
      player: null,
      refresher: null
    };
    this.handleBoxClick = this.handleBoxClick.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.setPlayer = this.setPlayer.bind(this);
  }

  componentDidMount() {
    const refresher = setInterval(() => {
      fetch('http://localhost:3000/refresh')
        .then(response => response.json())
        .then(({ data }) => {
          this.updateGameState(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
    }, 1000)
    this.setState({ refresher });
  }

  updateGameState(data) {
    const { boxes, nextTurn, isGameOver, winner } = data;
    this.setState({
      boxes,
      whoIsPlaying: nextTurn,
      isGameOver,
      winner
    })
    if (isGameOver) {
      clearInterval(this.state.refresher);
      this.setState({ refresher: null });
    }
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
    fetch('http://localhost:3000/play-again')
      .then(response => response.json())
      .then(({ data }) => {
        this.updateGameState(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  render() {
    const { boxes, winner, isGameOver, whoIsPlaying } = this.state
    return (
      <>
        <h1>{isGameOver ? `${winner} wins!` : `${whoIsPlaying}'s turn`}</h1>
        <button onClick={this.playAgain}>Next game</button>
        <div onChange={this.setPlayer}>
          <input type="radio" id="x-button" name="player" value="X" checked={this.state.player === 'X'} />
          <label htmlFor="x-button">X</label>
          <input type="radio" id="o-button" name="player" value="O" checked={this.state.player === 'O'} />
          <label htmlFor="o-button">O</label>
        </div>
        <Board
          boxes={boxes}
          handleClick={this.handleBoxClick}
          disableButtons={isGameOver || (this.state.whoIsPlaying !== this.state.player)}
        />
      </>
    );
  }
}
 
export default TicTacToe;
