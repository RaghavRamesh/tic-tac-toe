import React from 'react';

const Board = ({ boxes, handleClick }) => {
  console.log('[Board] boxes:', boxes);
  const boxElements = boxes.map((box, index) => {
    return (
      <button
        style={{width: '300px', height: '300px', background: 'orange'}}
        onClick={() => {
          handleClick(index);
        }}
        key={index}
      >
        {box}
      </button>
    );
  });

  return (
    <div>
      {boxElements}
    </div>
  )
}


export default Board;
