import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
import RouterComponent from "./UI/Router/Router";
import MenuBar from "./UI/Menu/MenuBar";
import Spinner from "./UI/Spinner";

import logo from "./assets/logo.png";

import "./App.css";
import "./bootstrap.min.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  // componentWillMount() {
  //   this.setState({ loading: true });
  // }

  componentDidMount() {
    console.log("adad");
    this.setState({ loading: false });
  }
  render() {
    var AppPage = (
      <div className="App">
        <div className="header-div">
          <img src={logo} alt="Home" className="img-logo" />
          <h2 className="h2-title">
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
          <MenuBar />
          <br />
          <RouterComponent />
        </div>
      </div>
    );

    if (this.state.loading) {
      AppPage = <Spinner />;
    }

    return <Fragment>{AppPage}</Fragment>;
  }
}

// const mapStateToProps = state => {
//   return {
//     authState: state.authState,
//     pages: Object.keys(state.pageState.pages || {}).map(key => ({
//       ...state.pageState.pages[key],
//       uid: key
//     }))
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onInputChange: e =>
//       dispatch({
//         type: "onChange",
//         name: e.target.name,
//         value: e.target.value
//       })
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(App);

export default App;
