import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import fire from "../../config/firebase";
import { connect } from "react-redux";
import Spinner from "../Spinner";

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: null,
      loading: true
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    this.fetchPageData();
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  logoutHandler = () => {
    localStorage.removeItem("authUser");
    this.forceUpdate();
  };

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

    var MenuBarPage = (
      <div className="navbar-collapse menubar-div">
        <ul className="menubar-ul">
          <li className="menubar-li float-left" key="Home">
            <NavLink
              className="nav-link paddinglarge"
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
                className="menubar-li border-left-grey float-left"
                key="preview"
              >
                <NavLink
                  className="nav-link padding-10"
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
              <li className="display-inline float-right" key="/">
                <NavLink
                  className="nav-link padding-5"
                  onClick={this.logoutHandler}
                  to="/"
                  exact
                  activeClassName="active"
                  title="Logout"
                >
                  <i className="fa fa-sign-out" aria-hidden="true" />
                </NavLink>
              </li>

              <li
                className="display-inline float-right border-right-grey"
                key="showpages"
              >
                <NavLink
                  className="nav-link padding-5"
                  to="/showpages"
                  exact
                  activeClassName="active"
                  title="Manage Pages"
                >
                  <i className="fa fa-gear" aria-hidden="true" /> Manage Pages
                </NavLink>
              </li>
            </div>
          ) : (
            <div>
              <li className="display-inline float-right" key="login">
                <NavLink
                  className="nav-link padding-5"
                  to="/login"
                  exact
                  activeClassName="active"
                >
                  Login
                </NavLink>
              </li>
              <li
                className="display-inline float-right border-right-grey"
                key="register"
              >
                <NavLink
                  className="nav-link padding-5"
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
    );

    if (this.state.loading) {
      MenuBarPage = <Spinner />;
    }

    return <Fragment>{MenuBarPage}</Fragment>;
  }
}

const mapStateToProps = state => ({
  pages: Object.keys(state.pageState.pages || {}).map(key => ({
    ...state.pageState.pages[key],
    uid: key
  }))
});

export default connect(
  mapStateToProps,
  null
)(MenuBar);
