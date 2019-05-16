import React, { Component } from "react";
import logo from "./assets/logo.png";
import fire from "./config/firebase";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import CreatePage from "./components/createpage";
import EditPage from "./components/editpage";
import ShowPages from "./components/showpages";
import Preview from "./components/preview";
import CustomPieChart from "./charts/piechart";
import { connect } from "react-redux";

import { Switch, Route, NavLink } from "react-router-dom";
import "./App.css";
import "./bootstrap.min.css";

require("dotenv").config();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: null,
      loading: false
    };
  }

  logoutHandler = () => {
    localStorage.removeItem("authUser");
    this.forceUpdate();
  };

  componentDidMount() {
    this.fetchPageData();
  }

  fetchPageData() {
    fire
      .database()
      .ref()
      .child("pages")
      .orderByKey()
      .once("value", snapshot => {
        let message = snapshot.val();
        const msg = Object.keys(message || {}).map(key => ({
          ...message[key]
        }));
        this.setState({ pages: msg });
      });
  }

  render() {
    const { pages } = this.props.pages.length > 0 ? this.props : this.state;

    if (!pages) {
      return null;
    }

    var sources = [];
    const loggedInUser = localStorage.getItem("authUser");

    pages.forEach(element => {
      if (element.status === "published") {
        sources.push(element);
      }
    });

    return (
      <div className="App">
        {/* <Router> */}
        <div
          style={{
            height: "95px"
          }}
        >
          <img
            src={logo}
            alt="Home"
            style={{
              width: "95px",
              height: "95px",
              float: "left",
              position: "static"
            }}
          />

          <h2
            style={{
              color: "green",
              position: "absolute",
              marginTop: "30px",
              width: "100%"
            }}
          >
            <strong>My App</strong>
          </h2>
        </div>
        <div
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "gainsboro"
          }}
        >
          <div
            className="navbar-collapse"
            style={{
              border: "1px solid gray",
              background: "green",
              borderLeft: "1px solid gray"
            }}
          >
            <ul
              style={{
                listStyleType: "none",
                padding: "12px"
              }}
            >
              <li
                style={{
                  display: "inline",
                  float: "left"
                }}
                key="Home"
              >
                <NavLink
                  style={{
                    color: "white",
                    padding: "10px",
                    textDecoration: "none"
                  }}
                  to="/"
                  exact
                  activeClassName="active"
                  title="Home"
                >
                  <i className="fa fa-home" aria-hidden="true" />
                </NavLink>
              </li>
              {sources.map(page => (
                <span>
                  <li
                    style={{
                      display: "inline",
                      float: "left",
                      borderLeft: "1px solid gray"
                    }}
                    key="preview"
                  >
                    <NavLink
                      style={{
                        color: "white",
                        padding: "10px",
                        textDecoration: "none"
                      }}
                      to={"/preview/" + page.title}
                      exact
                      activeClassName="active"
                    >
                      <span className="glyphicon glyphicon-home" />
                      {page.title}
                    </NavLink>
                  </li>
                </span>
              ))}

              {loggedInUser ? (
                <div>
                  <li
                    style={{
                      display: "inline",
                      float: "right"
                    }}
                    key="/"
                  >
                    <NavLink
                      onClick={this.logoutHandler}
                      style={{
                        color: "white",
                        padding: "5px",
                        textDecoration: "none"
                      }}
                      to="/"
                      exact
                      activeClassName="active"
                      title="Logout"
                    >
                      <i className="fa fa-sign-out" aria-hidden="true" />
                      {/* Logout */}
                    </NavLink>
                  </li>

                  <li
                    style={{
                      display: "inline",
                      float: "right",
                      borderRight: "1px solid gray",
                      borderLeft: "1px solid gray"
                    }}
                    key="showpages"
                  >
                    <NavLink
                      style={{
                        color: "white",
                        padding: "5px",
                        textDecoration: "none"
                      }}
                      to="/showpages"
                      exact
                      activeClassName="active"
                      title="Manage Pages"
                    >
                      <i className="fa fa-gear" aria-hidden="true" /> Manage
                      Pages
                    </NavLink>
                  </li>
                </div>
              ) : (
                <div>
                  <li
                    style={{
                      display: "inline",
                      float: "right"
                    }}
                    key="login"
                  >
                    <NavLink
                      style={{
                        color: "white",
                        padding: "5px",
                        textDecoration: "none"
                      }}
                      to="/login"
                      exact
                      activeClassName="active"
                    >
                      Login
                    </NavLink>
                  </li>
                  <li
                    style={{
                      display: "inline",
                      float: "right",
                      borderRight: "1px solid gray"
                    }}
                    key="register"
                  >
                    <NavLink
                      style={{
                        color: "white",
                        padding: "5px",
                        textDecoration: "none"
                      }}
                      to="/register"
                      exact
                      activeClassName="active"
                    >
                      Register
                    </NavLink>
                  </li>
                </div>
              )}
            </ul>
          </div>

          <br />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/createpage" component={CreatePage} />
            <Route path="/editpage/:id" component={EditPage} />
            <Route path="/showpages" component={ShowPages} />
            <Route path="/preview/:id" component={Preview} />
            <Route path="/charts" component={CustomPieChart} />
            <Route component={Page404} />
          </Switch>
        </div>
        {/* </Router> */}
      </div>
    );
  }
}

const Page404 = ({ location }) => (
  <div>
    <h2>
      No match found for <code>{location.pathname}</code>
    </h2>
  </div>
);

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
    //   ,
    // setIsAuthorised: status => dispatch({ type: "onSetAuthorise", status })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
