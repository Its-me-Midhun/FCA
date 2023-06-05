import React, { Component } from "react";
import { connect } from "react-redux";
import { EMAIL } from "../../../config/validation";
import loginActions from "../actions";
import CommonActions from "../../common/actions";
// import history from "../../../config/history";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../../common/components/Loader";
import { resetBreadCrumpData } from "../../../config/utils";

class LoginForm extends Component {
    state = {
        errorMessage: "",
        isLoading: false,
        userName: "",
        password: "",
        isSubmit: false,
        submitDisable: false,
        isSuccess: false,
        alertMessage: ""
    };

    validate = loginParams => {
        if (!loginParams.email?.trim()?.length) {
            this.setState({
                errorMessage: "Please enter an email"
            });
            return false;
        } else if (!EMAIL(loginParams.email)) {
            this.setState({
                errorMessage: "Please enter a valid email"
            });
            return false;
        }

        return true;
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-forgot-success";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-forgot-success", "");
            }, 6000);
        }
    };

    submitForm = async () => {
        const { email } = this.state;
        let loginParams = {
            email: email
        };
        if (this.validate(loginParams)) {
            this.setState({
                isSubmit: true,
                isLoading: true
            });
            await this.props.forgotPassword(loginParams);
            const {
                history,
                loginReducer: { forgotPassword }
            } = this.props;
            if (forgotPassword && forgotPassword.success) {
                await this.setState({
                    errorMessage: "",
                    alertMessage: forgotPassword.message,
                    submitDisable: true,
                    isSuccess: true
                });
                this.showAlert();
                setTimeout(async () => {
                    await history.push("/");
                    await this.setState({
                        isLoading: false
                    });
                }, 6000);
                await this.setState({
                    isSubmit: false
                });
            } else {
                this.setState({
                    errorMessage: forgotPassword && forgotPassword.message ? forgotPassword.message : "Error while resetting password"
                });
                // this.props.history.push("/");
            }
            this.setState({
                isSubmit: false,
                isLoading: false
            });
        } else {
            // this.setState({
            //     errorMessage: "Invalid Email"
            // });
            this.setState({
                isSubmit: false
            });
        }
    };

    render() {
        const { errorMessage, isLoading } = this.state;
        return (
            // <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
            <div className="login-outer">
                <div className="login-section">
                    <div className="login-box col-md-9 p-0 d-flex">
                        <div className="img-login-section">
                            <div className="logo">
                                <img src="/img/fca-logo.svg" className="cursor-pointer" alt="" onClick={() => this.props.history.push("/")} />
                            </div>
                        </div>

                        <div className="content-login-section">
                            <div className="otr-login">
                                <h3>
                                    Login With <span>SSO</span>
                                </h3>
                                <h4 className="col-md-10 p-0">
                                    FCATracker's capital planning provides you the foundation to manage your facilities and operations more
                                    efﬁciently, effectively, and sustainably
                                </h4>
                                <div className="line col-md-12 p-0">
                                    <div className="blue-line col-md-2" />
                                    {/*<div className="white-line col-md-2"/>*/}
                                </div>
                                <div className="col-md-12 login-form p-0 reset-form">
                                    <div className="col-md-12 form-inp p-0">
                                        <input
                                            type="text"
                                            className="form-control psw"
                                            placeholder="Email"
                                            onChange={e => this.setState({ email: e.target.value })}
                                            onKeyPress={event => {
                                                if (event.key === "Enter") {
                                                    this.submitForm();
                                                }
                                            }}
                                        />
                                        <span className="msg">
                                            <img src="/img/msg-icn.png" alt="" />
                                        </span>
                                    </div>
                                    <div className="col-md-12 d-flex p-0 otr-rem">
                                        <div className="rem-txt">
                                            {/* <label className="container-check">
                                                    Keep me logged in
                                                    <input type="checkbox" />
                                                    <span className="checkmark">&nbsp;</span>
                                                </label> */}
                                        </div>
                                        <a href="#" onClick={() => this.props.history.push("/")}>
                                            <div className="fgt">Back to Login Page</div>
                                        </a>
                                    </div>

                                    <div className={this.state.isSuccess ? "text-success" : "text-danger"}>{errorMessage}</div>

                                    <button className="log-btn" onClick={this.submitForm} disabled={this.state.submitDisable}>
                                        Submit{" "}
                                        {this.state.isSubmit ? <span className="spinner-border spinner-border-sm pl-2" role="status"></span> : null}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { loginReducer, commonReducer } = state;
    return { loginReducer, commonReducer };
};

export default connect(mapStateToProps, { ...loginActions, ...CommonActions })(LoginForm);
