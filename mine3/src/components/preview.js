import React, { Component } from "react";
import fire from "../config/firebase";
import parse from "html-react-parser";
import Spinner from "./../UI/Spinner";

class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      urlParam: "",
      loading: true,
      isAuthorised: false
    };
  }

  componentWillReceiveProps = async (newProps) => {
    this.setState({
      loading: true
    });
    if (newProps.match.params.id !== this.props.match.params.id) {
      let data = await this.loadPreviewData(newProps.match.params.id);
      data.forEach(userSnapshot => {
        let data = userSnapshot.val();
        this.setState({
          content: data.content,
          urlParam: newProps.match.params.id,
          loading: false
        });
      });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  componentWillMount = async () => {
    let pageId = this.props.match.params.id;
    let data = await this.loadPreviewData(pageId);
    data.forEach(userSnapshot => {
      let data = userSnapshot.val();
      this.setState({
        content: data.content,
        urlParam: pageId,
        loading: false
      });
    });
    this.setState({
      loading: false
    });
  }

  loadPreviewData = pageId => {
    return new Promise((resolve, reject) => {
      fire
        .database()
        .ref("/pages")
        .orderByChild("title")
        .equalTo(pageId)
        .on("value", snapshot => {
          resolve(snapshot)
        });
    })
  };

  render() {
    return (
      (this.state.loading) ?
        <Spinner />
        :
        <div>
          <header style={{ float: "right", marginRight: "20px" }} />
          <br />
          <div>{(this.state.content) ? parse(this.state.content) : <h2>No match found for <code>{this.props.location.pathname}</code></h2>
          }</div>
        </div>
    );
  }
}

export default Preview;
