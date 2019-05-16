import React from "react";
import classes from "./Input.css";

const input = props => {
  let inputElement = null;

  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          className="form-control"
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;

    default:
      inputElement = (
        <input
          className="form-control"
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
  }
  return (
    <div className="container w-25">
      <div>{inputElement}</div>
      {props.error ? <span style={{ color: "red" }}>{props.error}</span> : null}
    </div>
  );
};

export default input;
