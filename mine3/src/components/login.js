import React, { Component } from "react";
import fire from "./../config/firebase";
import Spinner from "../UI/Spinner";
import { Link } from "react-router-dom";
import Input from "../UI/Input/Input";
import Validator from "validatorjs";
import { connect } from "react-redux";
import { loginInputConstants } from "../constants/inputConstants";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      loading: true,
      orderForm: loginInputConstants
    };
  }

  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  onSubmitLogin = e => {
    e.preventDefault();

    this.setState({
      loading: true
    });

    if (
      !this.state.orderForm.email.value ||
      !this.state.orderForm.password.value
    ) {
      return this.setState({
        error: { message: "Please enter required details" },
        loading: false
      });
    }

    this.loginAction();
  };

  loginAction = async () => {
    try {
      let success = await this.validateCredentials();
      if (success) {
        this.successfullLogin();
      }
    } catch (e) {
      this.setState({
        error: e,
        loading: false
      });
    }
  };

  validateCredentials = () => {
    return new Promise((resolve, reject) => {
      resolve(fire
        .auth()
        .signInWithEmailAndPassword(
          this.state.orderForm.email.value,
          this.state.orderForm.password.value
        ));
    });
  };

  successfullLogin = () => {
    sessionStorage.setItem("authUser", this.state.orderForm.email.value);
    this.setState({
      loading: false
    });

    if (sessionStorage.getItem("authUser")) {
      this.props.setIsAuthorised(true);
    }

    this.props.history.push("/");
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };

    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;

    let validation = new Validator(
      { [inputIdentifier]: updatedFormElement.value },
      { [inputIdentifier]: updatedFormElement.rule }
    );

    if (!validation.passes()) {
      updatedFormElement.error = validation.errors.first(inputIdentifier);
    } else {
      updatedFormElement.error = "";
    }

    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let { error, loading } = this.state;

    let loginPage = (
      <form>
        <h3>
          <strong>Login Page</strong>
        </h3>
        {error ? (
          <div class="alert alert-danger">
            <strong>Alert!</strong> {error.message}.
          </div>
        ) : null}
        {formElementsArray.map(formElement => (
          <div style={{
            width: "100%",
            textAlign: "center",
            alignContent: "center"
          }}>
            <Input
              key={formElement.id}
              label={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              error={formElement.config.error}
              changed={event => this.inputChangedHandler(event, formElement.id)}
            />
          </div>
        ))}
        <br />
        <button className="btn btn-success" onClick={this.onSubmitLogin}>
          Login
        </button>
        <div className="clearfix" ></div>
        <span>Don't have account, do</span>
        <Link to={"/register"}> Register </Link>
        <span>here.</span>
      </form>
    );

    if (loading) {
      loginPage = <Spinner />;
    }

    return loginPage;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setIsAuthorised: status => dispatch({ type: "onSetAuthorise", status })
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Login);