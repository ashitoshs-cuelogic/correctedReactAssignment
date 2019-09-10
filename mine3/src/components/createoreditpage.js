import React, { Component } from "react";
import fire from "./../config/firebase";
import { Link } from "react-router-dom";
import Spinner from "../UI/Spinner";
import moment from "moment";
import Input from "./../UI/Input/Input";
import Validator from "validatorjs";
import { pageInputConstants } from "../constants/inputConstants";

const initialState = {
    error: "",
    loading: false,
    orderForm: pageInputConstants
};

class CreateOrEditpage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onSubmitCreateOrUpdatepage = this.onSubmitCreateOrUpdatepage.bind();
    }

    onSubmitCreateOrUpdatepage = e => {
        e.preventDefault();

        this.setState({
            loading: true
        });

        if (!this.state.orderForm.title.value || !this.state.orderForm.content.value || !this.state.orderForm.status.value) {
            this.setState({
                error: { message: "Please enter required details" },
                loading: false
            });
            return false;

        }
        this.createOrUpdatePageAction();
    };

    createOrUpdatePageAction = async () => {
        try {
            let boolvalid = await this.createOrUpdatePageData();
            if (boolvalid) {
                this.setState({
                    loading: false
                });
                this.props.history.push("/showpages");
            }
        } catch (e) {
            this.setState({
                loading: false,
                error: e
            });
        }
    };

    authorization = () => {
        let userData = sessionStorage.getItem("authUser");
        if (userData) {
            return true;
        }
        return false;
    }

    createOrUpdatePageData() {
        return new Promise((resolve, reject) => {
            let key = "pages/" + this.state.orderForm.title.value;
            fire
                .database()
                .ref(key)
                .set({
                    title: this.state.orderForm.title.value,
                    content: this.state.orderForm.content.value,
                    status: this.state.orderForm.status.value,
                    author: sessionStorage.getItem("authUser"),
                    created_on: moment().format(),
                    updated_on: moment().format()
                });
            resolve(true);
        });
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        if (inputIdentifier === "content") {
            updatedFormElement.value = event;
        } else {
            updatedFormElement.value = event.target.value;
        }

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

    componentWillMount() {
        let pageId = this.props.match.params.id;
        if (pageId) {
            fire
                .database()
                .ref("/pages")
                .orderByChild("title")
                .equalTo(pageId)
                .on("value", snapshot => {
                    snapshot.forEach(userSnapshot => {
                        let data = userSnapshot.val();
                        const updatedOrderForm = {
                            ...this.state.orderForm
                        };

                        updatedOrderForm['title'].value = data.title;
                        updatedOrderForm['content'].value = data.content;
                        updatedOrderForm['status'].value = data.status;
                        this.setState({ orderForm: updatedOrderForm });
                    });
                });
        }
    }

    render() {
        const { error, loading } = this.state;
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        if (!this.authorization()) {
            return (<h6><h1 className="error">Access Denied</h1>Error: 401 Unauthorized user trying to access <code>{this.props.location.pathname}</code></h6>);
        }

        if (!this.authorization()) {
            return (<h6><h1 className="error">Access Denied</h1>Error: 401 Unauthorized user trying to access <code>{this.props.location.pathname}</code></h6>);
        }

        let createOrEditpage = (
            <div>
                <form>
                    <div className="container" >
                        <h3>{this.props.match.params.id ? "Update" : "Create"} Page</h3>
                        {error ? (
                            <div>
                                <p style={{ color: "red" }}>{error.message}</p>
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
                                    value={this.props.match.params.id ? formElement.config.value : null}
                                    error={formElement.config.error}
                                    isDisabled={(this.props.match.params.id && formElement.id === "title") ? { disabled: "disabled" } : null}
                                    changed={event =>
                                        this.inputChangedHandler(event, formElement.id)
                                    }
                                />
                                <br />
                            </div>
                        ))}
                        <hr />
                        <button
                            className="btn btn-success margin-botton-tp"
                            onClick={this.onSubmitCreateOrUpdatepage}
                        >
                            {this.props.match.params.id ? "Update" : "Create"} Page
            </button>{" "}
                        or
            <Link to={"/showpages"}> Cancel </Link>
                    </div>
                </form>
            </div>
        );

        if (loading) {
            createOrEditpage = <Spinner />;
        }
        return createOrEditpage;
    }
}

export default CreateOrEditpage;