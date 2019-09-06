import React, { Fragment } from "react";
// import classes from "./Input.css";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
import FroalaEditor from "react-froala-wysiwyg";

const input = props => {
  let inputElement = null;
  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          style={{
            display: "inline-block", marginBottom: "10px"
          }}
          className="form-control w-25"
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
          {...props.isDisabled}
        />
      );
      break;

    case "froalaEditor":
      inputElement = (
        <FroalaEditor
          // className="form-control "
          {...props.elementConfig}
          tag="textarea"
          placeholder="Content"
          model={props.value}
          onModelChange={props.changed}
        />
      );
      break;

    case "select":
      inputElement = (
        <select
          style={{
            display: "inline-block"
          }}
          className="form-control w-25"
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map(option => (
            <option value={option.value}>{option.displayValue} </option>
          ))}
        </select>
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
    <Fragment>
      {inputElement}
      {props.error ? <span style={{ color: "red" }}><br />{props.error}</span> : null}

      {/* // <div className="container" > */}
      {/* <div> */}

      {/* </div> */}

      {/* // </div> */}
    </Fragment>
  );
};

export default input;
