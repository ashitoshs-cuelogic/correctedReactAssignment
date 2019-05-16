import React, { Component, Fragment } from "react";
import fire from "./../config/firebase";
import { Link } from "react-router-dom";
import Spinner from "../UI/Spinner";
import moment from "moment";
import Input from "../UI/Input/Input";
import Validator from "validatorjs";

const initialState = {
  success: "",
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
    },
    fullname: {
      elementType: "input",
      elementConfig: {
        type: "text",
        name: "fullname",
        placeholder: "Full Name"
      },
      value: "",
      rule: "required",
      error: ""
    }
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  reset() {
    this.setState(initialState);
  }

  onSubmitRegister = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    if (
      !this.state.orderForm.email.value ||
      !this.state.orderForm.fullname.value ||
      !this.state.orderForm.password.value
    ) {
      return this.setState({
        error: { message: "Please enter required details" },
        loading: false
      });
    }

    this.registerAction();
  };

  validateDataWithFireBase() {
    return fire
      .auth()
      .createUserWithEmailAndPassword(
        this.state.orderForm.email.value,
        this.state.orderForm.password.value
      );
  }

  insertToDatabase() {
    var key = "users/" + this.state.orderForm.fullname.value;
    return fire
      .database()
      .ref(key)
      .set({
        email: this.state.orderForm.email.value,
        password: this.state.orderForm.password.value,
        fullname: this.state.orderForm.fullname.value,
        created_on: moment().format(),
        updated_on: moment().format()
      });
  }

  registerAction = async () => {
    try {
      await this.validateDataWithFireBase();
      await this.insertToDatabase();
      this.reset();
      this.setState({ success: "User registered successfully" });
    } catch (e) {
      this.setState({
        error: e,
        loading: false
      });
    }
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
    const { success, error, loading } = this.state;

    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let registrationPage = (
      <form>
        <h3>
          <strong>Register Page</strong>
        </h3>
        {error ? (
          <div class="alert alert-danger">
            <strong>Alert!</strong> {error.message}.
          </div>
        ) : null}
        {success ? (
          <div class="alert alert-success">
            <strong>Success!</strong> {success}.
          </div>
        ) : null}
        {formElementsArray.map(formElement => (
          <Fragment>
            <Input
              key={formElement.id}
              label={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              error={formElement.config.error}
              changed={event => this.inputChangedHandler(event, formElement.id)}
            />
          </Fragment>
        ))}
        <button className="btn btn-success" onClick={this.onSubmitRegister}>
          Register
        </button>
        <br />
        or <br />
        <div>
          <span>Already registered </span>
          <Link style={{ color: "#f4a941", fontWeight: "bold" }} to={"/login"}>
            Login
          </Link>
          <span> from here</span>
          <br />
        </div>
      </form>
    );

    if (loading) {
      registrationPage = <Spinner />;
    }

    return <Fragment>{registrationPage}</Fragment>;
  }
}

export default Register;
