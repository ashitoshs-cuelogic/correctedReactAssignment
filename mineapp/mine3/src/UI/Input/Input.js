import React from "react";
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
          className="form-control "
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;

    case "froalaEditor":
      inputElement = (
        <FroalaEditor
          className="form-control "
          {...props.elementConfig}
          tag="textarea"
          placeholder="Content"
          model={props.value}
          // model={content}
          onModelChange={props.changed}
        />
      );
      break;

    case "select":
      inputElement = (
        <select
          className="form-control "
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
    <div className="container w-25">
      <div>{inputElement}</div>
      {props.error ? <span style={{ color: "red" }}>{props.error}</span> : null}
    </div>
  );
};

export default input;
