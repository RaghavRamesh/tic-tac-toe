import React from 'react';

const Board = ({ boxes, handleClick, disableButtons }) => {
  const boxElements = boxes.map((box, index) => {
    const disabled = disableButtons || box !== null;
    let backgroundColor = '#eee';
    if (box === 'X') {
      backgroundColor = "#ab3e8f"
    } else if (box === 'O') {
      backgroundColor = "#00a989"
    }
    return (
      <button
        style={{
          width: '150px',
          height: '150px',
          backgroundColor,
          cursor: disabled ? 'default' : 'pointer',
          fontSize: '48px',
          color: 'white',
          border: "2px solid #ddd",
          padding: 0
        }}
        onClick={() => {
          handleClick(index);
        }}
        key={index}
        disabled={disabled}
      >
        {box || " "}
      </button>
    );
  });

  return (
    <div
      style={{
        margin: 'auto',
        border: "4px solid #ddd",
        width: "458px",
        height: "458px",
        display: "grid",
        gridTemplateColumns: "150px 150px 150px",
        gridTemplateRows: "150px 150px 150px"
      }}
    >
      {boxElements}
    </div>
  )
}


export default Board;
