import React, { Component } from "react";
import fire from "../config/firebase";
import parse from "html-react-parser";

class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      urlParam: ""
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.id !== this.props.match.params.id) {
      this.loadPreviewData(newProps.match.params.id);
    }
  }

  componentDidMount() {
    let pageId = this.props.match.params.id;
    this.loadPreviewData(pageId);
  }

  loadPreviewData = pageId => {
    fire
      .database()
      .ref("/pages")
      .orderByChild("title")
      .equalTo(pageId)
      .on("value", snapshot => {
        snapshot.forEach(userSnapshot => {
          let data = userSnapshot.val();
          this.setState({
            content: data.content,
            urlParam: pageId
          });
        });
      });
  };

  render() {
    return (
      <div>
        <header style={{ float: "right", marginRight: "20px" }} />
        <br />
        <div>{parse(this.state.content)}</div>
      </div>
    );
  }
}

export default Preview;
