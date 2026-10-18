import React, { useState } from "react";
import kDice from "./kDice";

const DiceButtonComponent = (props) => {
  const handleStateChange = (event) => {
    const newState = event.type;

    if (props.clicked === false) {
      props.onDiceRoll(kDice(props.n, props.k));
      props.handleStateChange(true);
    }
  };

  const defaultView_ = (
    <button
      disabled={props.clicked}
      className={props.className}
      onClick={(event) => {
        handleStateChange(event);
      }}
    >
      {`${props.k100Result}`}
    </button>
  );

  if (!props.clicked) {
    return (
      <button
        className={props.className}
        onClick={(event) => {
          handleStateChange(event);
        }}
      >
        {props.n}k{props.k}
      </button>
    );
  } else return defaultView_;
};

export default DiceButtonComponent;
