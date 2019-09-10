import React, { Component } from "react";
import RouterComponent from "./UI/Router/Router";
import { NavLink } from "react-router-dom";
import MenuBar from "./UI/Menu/MenuBar";
import logo from "./assets/myapp_logo.png";

import "./App.css";
import "./bootstrap.min.css";

class App extends Component {
  render() {
    return (
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

export default App;