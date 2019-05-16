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

const initialState = {
  error: "",
  loading: false
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

    Object.entries(this.props.pageState).forEach(([key, val]) => {
      if (val == null) delete this.props.pageState[key];
    });

    this.createPageAction();
    // var key = "pages/" + this.props.pageState.title;

    // fire
    //   .database()
    //   .ref(key)
    //   .set({
    //     title: this.props.pageState.title,
    //     content: this.props.pageState.content,
    //     status: this.props.pageState.status,
    //     author: localStorage.getItem("authUser"),
    //     created_on: moment().format(),
    //     updated_on: moment().format()
    //   })
    //   .then(data => {
    //     this.setState({
    //       loading: false
    //     });
    //     this.props.history.push("/showpages");
    //   })
    //   .catch(error => {
    //     this.setState({
    //       loading: false,
    //       error: error
    //     });
    //   });
  };

  createPageAction = async () => {
    try {
      await this.createPageData();

      this.reset();
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
    var key = "pages/" + this.props.pageState.title;

    return fire
      .database()
      .ref(key)
      .set({
        title: this.props.pageState.title,
        content: this.props.pageState.content,
        status: this.props.pageState.status,
        author: localStorage.getItem("authUser"),
        created_on: moment().format(),
        updated_on: moment().format()
      });
  }

  render() {
    const { error, loading } = this.state;

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
            <label htmlFor="title"> Title : </label>
            <input
              style={{
                borderRadius: "5px",
                padding: "5px",
                width: "25%",
                marginLeft: "10px"
              }}
              type="text"
              name="title"
              placeholder=" Title"
              // value={title}
              onChange={this.props.onInputChange}
            />
            <br />
            <label htmlFor="content"> Content : </label>
            <div
              style={{
                width: "50%",
                textAlign: "center",
                alignContent: "center",
                marginLeft: "25%",
                borderRadius: "5px"
              }}
            >
              <FroalaEditor
                tag="textarea"
                // model={content}
                onModelChange={this.props.onModelChange}
              />
            </div>
            <br />
            <label htmlFor="status"> Status : </label>
            <select
              style={{
                borderRadius: "5px",
                padding: "5px",
                width: "15%",
                backgroundColor: "white",
                marginLeft: "10px"
              }}
              name="status"
              onChange={this.props.onInputChange}
            >
              <option>Select Status</option>
              <option
                value="published"
                // selected={status == "published" ? "selected" : null}
              >
                Published
              </option>
              <option
                value="on_Hold"
                // selected={status == "on_Hold" ? "selected" : null}
              >
                On Hold
              </option>
            </select>
            <br />
            <hr />
            <button
              style={{
                borderRadius: "5px",
                background: "green",
                padding: "5px",
                borderStyle: "none",
                color: "white",
                width: "110px"
              }}
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

const mapStateToProps = state => {
  return {
    pageState: state.authState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInputChange: e =>
      dispatch({
        type: "onChange",
        name: e.target.name,
        value: e.target.value
      }),
    onModelChange: model =>
      dispatch({
        type: "onChange",
        name: "content",
        value: model
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Createpage);
