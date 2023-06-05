import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import { passwordStrengthTooltip } from "../../../config/utils";

import ConfirmationModal from "./ConfirmationModal";

let regularExpression = /^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/;

class ViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            password: "",
            confirmPassword: "",
            showErrorBorder: false,
            errorMessage: null,
            current_password: "",
            isPasswordShown: false,
            viewNewPassword: false,
            viewCurrentPassword: false,
            isSubmitting: false
        };
    }

    togglePassword = () => {
        const { isPasswordShown } = this.state;
        this.setState({ isPasswordShown: !isPasswordShown });
    };
    validate = () => {
        if (!this.state.current_password && !this.state.password && !this.state.confirmPassword) {
            this.setState({
                errorMessage: "Please fill all the mandatory fields",
                showErrorBorder: true
            });
            return false;
        } else if (!this.state.current_password?.trim()?.length) {
            this.setState({
                errorMessage: "Please enter current password",
                showErrorBorder: true
            });
            return false;
        } else if (!this.state.password?.trim()?.length) {
            this.setState({
                errorMessage: "Please enter new password",
                showErrorBorder: true
            });
            return false;
        } else if (this.state.password?.trim().length && !regularExpression.test(this.state.password)) {
            this.setState({
                errorMessage:
                    "Password must contain minimum 6 characters ,1 special character ,1 number & combination of upper and lower case letters",
                showErrorBorder: true
            });
            return false;
        } else if (!this.state.confirmPassword?.trim()?.length) {
            this.setState({
                errorMessage: "Please enter confirm password",
                showErrorBorder: true
            });
            return false;
        } else if (this.state.confirmPassword !== this.state.password) {
            this.setState({
                errorMessage: "The password confirmation doesn't match",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    componentDidMount = async () => {
        await this.setState({
            isLoading: false
        });
    };

    resetPassword = async () => {
        const { password, confirmPassword, current_password } = this.state;
        if (this.validate()) {
            let data = {
                password_confirmation: confirmPassword,
                current_password,
                password
            };
            this.setState({ isSubmitting: true });
            let errMsg = await this.props.resetPasswordProfile(data);
            this.setState({ isSubmitting: false });
            if (errMsg) {
                this.setState({ errorMessage: errMsg });
            }
        }
    };
    cancel = async () => {
        await this.setState({
            password: "",
            confirmPassword: "",
            showErrorBorder: false
        });
        await this.props.onCancel();
    };

    render() {
        const {
            isPasswordShown,
            viewNewPassword,
            viewCurrentPassword,
            isLoading,
            keyList,
            viewFilter,
            errorMessage,
            password,
            confirmPassword,
            showErrorBorder,
            current_password,
            isSubmitting
        } = this.state;
        if (isLoading) return null;
        const { onCancel, config, keys } = this.props;
        return (
            <React.Fragment>
                <div
                    className="modal modal-region rst-pwd"
                    style={{ display: "block" }}
                    id="modalId"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div class="modal-dialog " role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">
                                    Reset Password
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div class="modal-body region-otr build-type-mod">
                                <form autoComplete="nope">
                                    <div class="clr-list ">
                                        <div className="col-md-12 mb-4 p-0 ">
                                            <div className="codeOtr">
                                                <h4>Current Password *</h4>
                                                <input
                                                    autoComplete="nope"
                                                    type={viewCurrentPassword ? "text" : "password"}
                                                    className={`${
                                                        showErrorBorder && !current_password?.trim()?.length ? "error-border " : ""
                                                    }custom-input form-control`}
                                                    value={current_password}
                                                    onChange={e =>
                                                        this.setState({
                                                            current_password: e.target.value
                                                        })
                                                    }
                                                    placeholder="Current Password"
                                                />

                                                <i
                                                    className={`fa ${!viewCurrentPassword ? "fa-eye-slash" : "fa-eye"} password-icon`}
                                                    onClick={() => {
                                                        this.setState({
                                                            viewCurrentPassword: !viewCurrentPassword
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12 mb-4 p-0 ">
                                            <div className="codeOtr">
                                                <h4>
                                                    New Password *
                                                    <span
                                                        className="content-block-card"
                                                        data-tip={passwordStrengthTooltip}
                                                        data-multiline={true}
                                                        data-place="left"
                                                        data-effect="solid"
                                                        data-background-color="#4991ff"
                                                    >
                                                        <i class="fas fa-info-circle"></i>
                                                    </span>
                                                </h4>
                                                <ReactTooltip />
                                                <input
                                                    autoComplete="nope"
                                                    type={isPasswordShown ? "text" : "password"}
                                                    className={`${
                                                        showErrorBorder && (!password?.trim()?.length || !regularExpression.test(password))
                                                            ? "error-border "
                                                            : ""
                                                    }custom-input form-control`}
                                                    value={password}
                                                    onChange={e =>
                                                        this.setState({
                                                            password: e.target.value
                                                        })
                                                    }
                                                    placeholder={"New Password"}
                                                />
                                                <i
                                                    className={`fa ${!isPasswordShown ? "fa-eye-slash" : "fa-eye"} password-icon`}
                                                    onClick={this.togglePassword}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12 mb-4 p-0">
                                            <div className="codeOtr">
                                                <h4>Confirm New Password *</h4>
                                                <input
                                                    autoComplete="nope"
                                                    type={viewNewPassword ? "text" : "password"}
                                                    className={`${
                                                        showErrorBorder && (!confirmPassword?.trim()?.length || password !== confirmPassword)
                                                            ? "error-border "
                                                            : ""
                                                    }custom-input form-control`}
                                                    value={confirmPassword}
                                                    onChange={e =>
                                                        this.setState({
                                                            confirmPassword: e.target.value
                                                        })
                                                    }
                                                    placeholder="Confirm New Password"
                                                />
                                                <i
                                                    className={`fa ${!viewNewPassword ? "fa-eye-slash" : "fa-eye"} password-icon`}
                                                    onClick={() => {
                                                        this.setState({
                                                            viewNewPassword: !viewNewPassword
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-danger mb-2">{errorMessage}</div>
                                    </div>
                                </form>
                                <div class="col-md-12 text-center btnOtr d-flex p-0">
                                    <button type="button" class="btn btn-secondary btnClr col" onClick={() => this.cancel()} data-dismiss="modal">
                                        Cancel
                                    </button>
                                    <button type="button" class="btn btn-primary btnRgion col" onClick={() => this.resetPassword()}>
                                        Save {isSubmitting && <span className="spinner-border spinner-border-sm pl-2" role="status"></span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ViewModal;
