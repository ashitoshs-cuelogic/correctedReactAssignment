import React, { Component } from "react";
import fire from "./../config/firebase";
import { Link } from "react-router-dom";
import Spinner from "../UI/Spinner";
import moment from "moment";
import Input from "../UI/Input/Input";
import Validator from "validatorjs";
import { registerInputConstants } from "../constants/inputConstants";

const initialState = {
  success: "",
  error: "",
  loading: true,
  orderForm: registerInputConstants
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
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

  registerAction = async () => {
    try {
      let isValidUser = await this.validateDataWithFireBase();
      if (isValidUser) {
        let isInserted = await this.insertToDatabase();
        if (isInserted) {
          this.reset();
          this.setState({ success: "User registered successfully", loading: false });
        }
      }
    } catch (e) {
      this.setState({
        error: e,
        loading: false
      });
    }
  };

  validateDataWithFireBase() {
    return new Promise((resolve, reject) => {
      resolve(fire
        .auth()
        .createUserWithEmailAndPassword(
          this.state.orderForm.email.value,
          this.state.orderForm.password.value
        ));
    });
  }

  insertToDatabase() {
    let key = "users/" + this.state.orderForm.fullname.value;
    return new Promise((resolve, reject) => {
      resolve(fire
        .database()
        .ref(key)
        .set({
          email: this.state.orderForm.email.value,
          password: this.state.orderForm.password.value,
          fullname: this.state.orderForm.fullname.value,
          created_on: moment().format(),
          updated_on: moment().format()
        }) ? true : false);
    });
  }

  reset() {
    this.setState(initialState);
  }

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
          <div className="registerContainer">
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
        <div className="clearfix" ></div>
        <button className="btn btn-success margin-botton-tp" onClick={this.onSubmitRegister} >
          Register
        </button>
        <div className="clearfix" ></div>
        <div className="registerContainer">
          <span>Already registered </span>
          <Link to={"/login"}>Login</Link>
          <span> from here</span>
        </div>
      </form>
    );

    if (loading) {
      registrationPage = <Spinner />;
    }

    return registrationPage;
  }
}

export default Register;
