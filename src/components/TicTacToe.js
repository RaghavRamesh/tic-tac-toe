import React, { Component } from 'react'
import { connect } from 'react-redux'
import Board from './Board'

class TicTacToe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes: props.boxes
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(boxId) {
    fetch('http://localhost:3000/click', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        player: 1,
        box: boxId
      })
    })
      .then(response => response.json())
      .then(({ data }) => {
        this.setState({ boxes: data.boxes})
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  render() {
    const { boxes } = this.state
    return (
      <Board boxes={boxes} handleClick={this.handleClick} />
    );
  }
}
 
function mapStateToProps({ isFetching, boxes }) {
  return {
    boxes
  }
}
 
export default connect(mapStateToProps)(TicTacToe)
