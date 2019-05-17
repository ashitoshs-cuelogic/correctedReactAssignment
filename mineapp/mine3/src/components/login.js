import React, { Component, Fragment } from "react";
import fire from "./../config/firebase";
import Spinner from "../UI/Spinner";
import { Link } from "react-router-dom";
import Input from "../UI/Input/Input";
import Validator from "validatorjs";
import { connect } from "react-redux";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      loading: false,
      orderForm: {
        email: {
          elementType: "input",
          elementConfig: {
            type: "email",
            name: "email",
            placeholder: "Username"
          },
          value: "",
          rule: "required|email",
          error: ""
        },
        password: {
          elementType: "input",
          elementConfig: {
            type: "password",
            name: "password",
            placeholder: "Password"
          },
          value: "",
          rule: "required",
          error: ""
        }
      }
    };
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

  componentWillMount() {
    this.setState({
      loading: true
    });
  }
  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  validateCredentials = () => {
    return fire
      .auth()
      .signInWithEmailAndPassword(
        this.state.orderForm.email.value,
        this.state.orderForm.password.value
      );
  };

  successfullLogin = () => {
    localStorage.setItem("authUser", this.state.orderForm.email.value);
    this.setState({
      loading: false
    });

    if (localStorage.getItem("authUser")) {
      this.props.setIsAuthorised(true);
    }

    this.props.history.push("/");
  };

  loginAction = async () => {
    try {
      await this.validateCredentials();
      await this.successfullLogin();
    } catch (e) {
      this.setState({
        error: e,
        loading: false
      });
    }
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
    const { error, loading } = this.state;

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
          <Input
            key={formElement.id}
            label={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            error={formElement.config.error}
            changed={event => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <br />
        <button className="btn btn-success" onClick={this.onSubmitLogin}>
          Login
        </button>
        <br />
        or <br />
        Do
        <Link to={"/register"}> Register </Link>
        here.
      </form>
    );

    if (loading) {
      loginPage = <Spinner />;
    }

    return <Fragment>{loginPage}</Fragment>;
  }
}

const mapStateToProps = state => {
  return {
    authState: state.authState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onInputChange: e =>
    //   dispatch({
    //     type: "onChange",
    //     name: e.target.name,
    //     value: e.target.value
    //   }),
    setIsAuthorised: status => dispatch({ type: "onSetAuthorise", status })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

// export default Login;
