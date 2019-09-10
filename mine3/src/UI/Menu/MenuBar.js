import React, { Component } from "react";
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

  componentDidMount = async () => {
    let snapshot = await this.fetchPageData();
    if (snapshot) {
      this.setState({
        pages: snapshot,
        loading: false
      });
    }
  }

  logoutHandler = () => {
    sessionStorage.removeItem("authUser");
    this.setState({
      loading: false
    });
  };

  fetchPageData() {
    return new Promise((resolve, reject) => {
      fire
        .database()
        .ref()
        .child("pages")
        .orderByKey()
        .once("value", snapshot => {
          let message = snapshot.val();
          let msg = Object.keys(message || {}).map(key => ({
            ...message[key]
          }));
          resolve(msg)
        });
    })
  }

  render() {
    const { pages } = this.props.pages.length > 0 ? this.props : this.state;

    if (!pages) {
      return null;
    }

    const ActiveStyle = {
      "color": "green",
      "backgroundColor": "white",
      "borderRadius": "2px"
    };

    const loggedInUser = sessionStorage.getItem("authUser");

    var sources = [];
    pages.forEach(element => {
      if (element.status === "published") {
        sources.push(element);
      }
    });

    return (
      this.state.loading ?
        <Spinner />
        :
        <div className="navbar-collapse menubar-div">
          <ul className="menubar-ul" key="HomeUl">
            <li className="menubar-li float-left" key="Home">
              <NavLink
                className="nav-link"
                to="/"
                exact
                activeStyle={ActiveStyle}
                title="Home"
              >
                <i className="fa fa-home" aria-hidden="true" />
              </NavLink>
            </li>
            {sources.map(page => (
              <li
                className="menubar-li border-left-grey float-left"
                key={page.title}
              >
                <NavLink
                  className="nav-link"
                  to={"/preview/" + page.title}
                  exact
                  activeStyle={ActiveStyle}
                >
                  <span className="glyphicon glyphicon-home" />
                  {page.title}
                </NavLink>
              </li>
            ))}

            {loggedInUser ? (
              <div>
                <li className="display-inline float-right" key="/">
                  <NavLink
                    className="nav-link "
                    onClick={this.logoutHandler}
                    to="/login"
                    exact
                    title="Logout"
                    activeStyle={ActiveStyle}
                  >
                    <i className="fa fa-sign-out" aria-hidden="true" />
                  </NavLink>
                </li>

                <li
                  className="display-inline float-right border-right-grey"
                  key="showpages"
                >
                  <NavLink
                    className="nav-link "
                    to="/showpages"
                    exact
                    activeStyle={ActiveStyle}
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
                      className="nav-link "
                      to="/login"
                      exact
                      activeStyle={ActiveStyle}
                    >
                      Login
                </NavLink>
                  </li>
                  <li
                    className="display-inline float-right border-right-grey"
                    key="register"
                  >
                    <NavLink
                      className="nav-link "
                      to="/register"
                      exact
                      activeStyle={ActiveStyle}
                    >
                      Register
                </NavLink>
                  </li>
                </div>
              )}
          </ul>
        </div >
    );
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
