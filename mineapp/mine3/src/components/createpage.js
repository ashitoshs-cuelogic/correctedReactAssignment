import React, { Component, Fragment } from "react";
import fire from "./../config/firebase";
import { Link } from "react-router-dom";

import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
import FroalaEditor from "react-froala-wysiwyg";
import { connect } from "react-redux";
import Spinner from "../UI/Spinner";
import moment from "moment";
import Input from "../UI/Input/Input";
import Validator from "validatorjs";

const initialState = {
  error: "",
  loading: false,
  orderForm: {
    title: {
      elementType: "input",
      elementConfig: {
        type: "text",
        name: "title",
        placeholder: "Title"
      },
      value: "",
      rule: "required",
      error: ""
    },
    content: {
      elementType: "froalaEditor",
      elementConfig: {
        name: "content"
      },
      value: "",
      rule: "required",
      error: ""
    },
    status: {
      elementType: "select",
      elementConfig: {
        options: [
          {
            value: "published",
            displayValue: "Published"
          },
          {
            value: "on_Hold",
            displayValue: "On Hold"
          }
        ]
      },
      value: "",
      rule: "required",
      error: ""
    }
  }
};

class Createpage extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.onSubmitCreatepage = this.onSubmitCreatepage.bind();
  }

  onSubmitCreatepage = e => {
    e.preventDefault();

    this.setState({
      loading: true
    });

    this.createPageAction();
  };

  createPageAction = async () => {
    try {
      await this.createPageData();

      this.setState({
        loading: false
      });
      this.props.history.push("/showpages");
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  };

  createPageData() {
    var key = "pages/" + this.state.orderForm.title.value;
    return fire
      .database()
      .ref(key)
      .set({
        title: this.state.orderForm.title.value,
        content: this.state.orderForm.content.value,
        status: this.state.orderForm.status.value,
        author: localStorage.getItem("authUser"),
        created_on: moment().format(),
        updated_on: moment().format()
      });
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };

    if (inputIdentifier == "content") {
      updatedFormElement.value = event;
    } else {
      updatedFormElement.value = event.target.value;
    }

    let validation = new Validator(
      { [inputIdentifier]: updatedFormElement.value },
      { [inputIdentifier]: updatedFormElement.rule }
    );
    if (!validation.passes()) {
      updatedFormElement.error = validation.errors.first(inputIdentifier);
    } else {
      updatedFormElement.error = "";
    }

    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm });
  };

  render() {
    const { error, loading } = this.state;
    console.log(this.state);
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let createPage = (
      <div>
        <form>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              alignContent: "center"
            }}
          >
            <h3>Create Page</h3>
            {error ? (
              <div>
                <p style={{ color: "red" }}>{error.message}</p>
              </div>
            ) : null}
            {formElementsArray.map(formElement => (
              <div>
                <Input
                  key={formElement.id}
                  label={formElement.id}
                  elementType={formElement.config.elementType}
                  elementConfig={formElement.config.elementConfig}
                  value={formElement.config.value}
                  error={formElement.config.error}
                  changed={event =>
                    this.inputChangedHandler(event, formElement.id)
                  }
                />
                <br />
              </div>
            ))}
            <hr />
            <button
              className="btn btn-success margin-botton-tp"
              onClick={this.onSubmitCreatepage}
            >
              Create Page
            </button>{" "}
            or
            <Link to={"/showpages"}> Cancel </Link>
          </div>
        </form>
      </div>
    );

    if (loading) {
      createPage = <Spinner />;
    }
    return <Fragment>{createPage}</Fragment>;
  }
}

// const mapStateToProps = state => {
//   return {
//     pageState: state.authState
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onInputChange: e =>
//       dispatch({
//         type: "onChange",
//         name: e.target.name,
//         value: e.target.value
//       }),
//     onModelChange: model =>
//       dispatch({
//         type: "onChange",
//         name: "content",
//         value: model
//       })
//   };
// };

export default Createpage;
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Createpage);
