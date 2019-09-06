import React, { Component } from "react";
import RouterComponent from "./UI/Router/Router";
import { NavLink } from "react-router-dom";
import MenuBar from "./UI/Menu/MenuBar";
import Spinner from "./UI/Spinner";
import { connect } from "react-redux";

import logo from "./assets/myapp_logo.png";

import "./App.css";
import "./bootstrap.min.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    return (
      this.state.loading ?
        <Spinner />
        :
        <div className="App">
          <div className="header-div">
            <NavLink to="/" exact title="Home" >
              <img src={logo} alt="Home" className="img-logo" />
            </NavLink>

            <h2 className="h2-title">
              <strong><i><u>_</u>myA<u>PP</u></i></strong>
            </h2>
          </div>
          <div className="menu-container">
            <MenuBar />
            <div className="clearfix"></div>
            <RouterComponent />
          </div>
        </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    authState: state.authState,
    pages: Object.keys(state.pageState.pages || {}).map(key => ({
      ...state.pageState.pages[key],
      uid: key
    }))
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInputChange: e =>
      dispatch({
        type: "onChange",
        name: e.target.name,
        value: e.target.value
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);