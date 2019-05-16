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
  title: "",
  content: "",
  status: "",
  author: "",
  error: "",
  loading: false
};

class Editpage extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  reset() {
    this.setState(initialState);
  }

  onSubmitCreatepage = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    this.editPageAction();
  };

  updatePageData() {
    var key =
      "pages/" +
      (this.props.pageState.title
        ? this.props.pageState.title
        : this.state.title);

    return fire
      .database()
      .ref(key)
      .set({
        title: this.props.pageState.title
          ? this.props.pageState.title
          : this.state.title,
        content: this.props.pageState.content
          ? this.props.pageState.content
          : this.state.content,
        status: this.props.pageState.status
          ? this.props.pageState.status
          : this.state.status,
        author: this.props.pageState.author
          ? this.props.pageState.author
          : this.state.author,
        updated_on: moment().format()
      });
  }

  editPageAction = async () => {
    try {
      await this.updatePageData();

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

  componentDidMount() {
    let pageId = this.props.match.params.id;
    fire
      .database()
      .ref("/pages")
      .orderByChild("title")
      .equalTo(pageId)
      .on("value", snapshot => {
        snapshot.forEach(userSnapshot => {
          let data = userSnapshot.val();
          this.setState({
            title: data.title,
            content: data.content,
            status: data.status,
            author: data.author
          });
        });
      });
  }

  render() {
    const { title, content, status, error, loading } = {
      ...this.state,
      ...this.props.pageState
    };

    var editPage = (
      <div>
        {" "}
        <form>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              alignContent: "center"
            }}
          >
            <h1>Edit Page</h1>
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
              value={title}
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
                model={content}
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
                selected={status === "published" ? "selected" : null}
              >
                Published
              </option>
              <option
                value="on_Hold"
                selected={status === "on_Hold" ? "selected" : null}
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
              Update Page
            </button>{" "}
            or
            <Link to={"/showpages"}> Cancel </Link>
            <br />
            <br />
          </div>
        </form>
      </div>
    );

    if (loading) {
      editPage = <Spinner />;
    }

    return <Fragment>{editPage}</Fragment>;
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
)(Editpage);
