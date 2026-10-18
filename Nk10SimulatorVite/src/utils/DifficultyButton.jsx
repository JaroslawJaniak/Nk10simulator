import React from "react";

 const DifficultyButton = (props) => {
  return (
    <button
      className={props.className }
      onClick={() => {
        props.handleClick();
      }}
    >
      
      {props.text}
    </button>
  );
};

export default DifficultyButton;
