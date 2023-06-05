import React, { Component } from "react";
import { connect } from "react-redux";
import { EMAIL } from "../../../config/validation";
import loginActions from "../actions";
import CommonActions from "../../common/actions";
// import history from "./config/history";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../../common/components/Loader";
import { passwordStrengthTooltip, resetBreadCrumpData } from "../../../config/utils";
import ReactTooltip from "react-tooltip";
import { InvalidToken } from "./InvalidToken";

class LoginForm extends Component {
    state = {
        errorMessage: "",
        isLoading: false,
        userName: "",
        password: "",
        confirmPassword: "",
        isSubmit: false,
        subimitDisabled: false,
        alertMessage: "",
        passwordVisible: {
            newPassword: false,
            confirmPassword: false
        },
        tokenValide: true
    };

    componentDidMount = async () => {
        await this.props.validateToken(this.props.match.params.token);
        const { success } = this.props.loginReducer.validateTokenResponse;
        this.setState({ tokenValide: success });
    };

    validate = () => {
        let regularExpression = /^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/;
        if (!this.state.password?.trim()?.length) {
            this.setState({
                errorMessage: "Please enter password"
            });
            return false;
        } else if (this.state.password.trim().length && !regularExpression.test(this.state.password)) {
            this.setState({
                errorMessage:
                    "Password must contain minimum 6 characters ,1 special character ,1 number & combination of upper and lower case letters"
            });
            return false;
        } else if (!this.state.confirmPassword?.trim()?.length) {
            this.setState({
                errorMessage: "Please enter confirm password"
            });
            return false;
        } else if (this.state.confirmPassword !== this.state.password) {
            this.setState({
                errorMessage: "The password confirmation doesn't match"
            });
            return false;
        }
        return true;
    };

    submitForm = async () => {
        const { password } = this.state;
        let token = this.props.match.params.token;
        let loginParams = {
            token,
            password
        };

        if (this.validate()) {
            this.setState({
                isSubmit: true,
                isLoading: true
            });
            await this.props.resetPassword(loginParams);
            const {
                history,
                loginReducer: { resetPassword }
            } = this.props;
            if (resetPassword && resetPassword.success) {
                await this.setState({
                    errorMessage: "",
                    alertMessage: resetPassword.message,
                    subimitDisabled: true
                });
                this.showAlert();
                setTimeout(async () => {
                    localStorage.clear()
                    await history.push("/");
                    await this.setState({
                        isLoading: false
                    });
                }, 4000);
                this.setState({
                    isSubmit: false,
                    isLoading: false
                });
            } else {
                this.setState({
                    errorMessage: resetPassword && resetPassword.message ? resetPassword.message : "Error while resetting password"
                });
            }
            this.setState({
                isSubmit: false
            });
        } else {
            // this.setState({
            //     errorMessage: "Invalid Password!"
            // });
            this.setState({
                isSubmit: false
            });
        }
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };
    render() {
        const { errorMessage, isLoading, passwordVisible, tokenValide } = this.state;
        return (
            // <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
            <>
                {tokenValide ? (
                    <div className="login-outer">
                        <div className="login-section">
                            <div className="login-box col-md-9 p-0 d-flex">
                                <div className="img-login-section">
                                    <div className="logo">
                                        <img src="/img/fca-logo.svg" alt="" />
                                    </div>
                                </div>

                                <div className="content-login-section">
                                    <div className="otr-login">
                                        <h3>
                                            Reset <span>Password</span>
                                        </h3>
                                        <h4 className="col-md-10 p-0">
                                            FCATracker's capital planning provides you the foundation to manage your facilities and operations more
                                            efﬁciently, effectively, and sustainably
                                        </h4>
                                        <div className="line col-md-12 p-0">
                                            <div className="blue-line col-md-2" />
                                            {/*<div className="white-line col-md-2"/>*/}
                                        </div>
                                        <div className="col-md-12 login-form p-0 forgot-form">
                                            <div className="col-md-12 form-inp p-0">
                                                <input
                                                    type={passwordVisible.newPassword ? "text" : "password"}
                                                    className="form-control"
                                                    placeholder="Password"
                                                    onChange={e => this.setState({ password: e.target.value })}
                                                    onKeyPress={event => {
                                                        if (event.key === "Enter") {
                                                            this.submitForm();
                                                        }
                                                    }}
                                                />
                                                <div class="eye-icon-outer">
                                                    <i
                                                        className={`fa eye-icon eye-icon-psw ${
                                                            !passwordVisible.newPassword ? "fa-eye-slash" : "fa-eye"
                                                        }`}
                                                        onClick={() => {
                                                            this.setState({
                                                                passwordVisible: {
                                                                    ...passwordVisible,
                                                                    newPassword: !passwordVisible.newPassword
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <span className="msg ">
                                                    <img src="/img/lockpassword.png" alt="" />
                                                </span>
                                                <span
                                                    className="content-block-card info-tag"
                                                    data-tip={passwordStrengthTooltip}
                                                    data-multiline={true}
                                                    data-place="left"
                                                    data-effect="solid"
                                                    data-background-color="#4991ff"
                                                >
                                                    <i class="fas fa-info-circle"></i>
                                                </span>
                                                <ReactTooltip />
                                                <input
                                                    type={passwordVisible.confirmPassword ? "text" : "password"}
                                                    className="form-control psw"
                                                    placeholder="Confirm Password"
                                                    onChange={e => this.setState({ confirmPassword: e.target.value })}
                                                    onKeyPress={event => {
                                                        if (event.key === "Enter") {
                                                            this.submitForm();
                                                        }
                                                    }}
                                                />
                                                <span className="lock">
                                                    <img src="/img/lockpassword.png" alt="" />
                                                </span>
                                                <div class="eye-icon-outer">
                                                    <i
                                                        className={`fa eye-icon eye-icon-psw ${
                                                            !passwordVisible.confirmPassword ? "fa-eye-slash" : "fa-eye"
                                                        }`}
                                                        onClick={() => {
                                                            this.setState({
                                                                passwordVisible: {
                                                                    ...passwordVisible,
                                                                    confirmPassword: !passwordVisible.confirmPassword
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-danger">{errorMessage}</div>

                                            <button className="log-btn" onClick={this.submitForm} disabled={this.state.subimitDisabled}>
                                                Submit{" "}
                                                {this.state.isSubmit ? (
                                                    <span className="spinner-border spinner-border-sm pl-2" role="status"></span>
                                                ) : null}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <InvalidToken />
                )}
            </>
            // </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { loginReducer, commonReducer } = state;
    return { loginReducer, commonReducer };
};

export default connect(mapStateToProps, { ...loginActions, ...CommonActions })(LoginForm);
