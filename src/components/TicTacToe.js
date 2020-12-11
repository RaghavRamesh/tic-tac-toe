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
    this.handleClick = this.handleClick.bind(this);
    this.setPlayer = this.setPlayer.bind(this);
  }

  componentDidMount() {
    setInterval(() => {
      fetch('http://localhost:3000/refresh')
        .then(response => response.json())
        .then(({ data }) => {
          this.updateGameState(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
    }, 1000)
  }

  updateGameState(data) {
    const { boxes, nextTurn, isGameOver, winner } = data;
    this.setState({
      boxes,
      whoIsPlaying: nextTurn,
      isGameOver,
      winner
    })
  }

  setPlayer(event) {
    this.setState({player:event.target.value});
  }

  handleClick(boxId) {
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

  render() {
    const { boxes, winner, isGameOver, whoIsPlaying } = this.state
    return (
      <>
        <h1>{isGameOver ? `${winner} wins!` : `${whoIsPlaying}'s turn`}</h1>
        <div onChange={this.setPlayer}>
          <input type="radio" id="x-button" name="player" value="X" />
          <label htmlFor="x-button">X</label>
          <input type="radio" id="o-button" name="player" value="O" />
          <label htmlFor="o-button">O</label>
        </div>
        <Board
          boxes={boxes}
          handleClick={this.handleClick}
          disableButtons={isGameOver || (this.state.whoIsPlaying !== this.state.player)}
        />
      </>
    );
  }
}
 
export default TicTacToe;
