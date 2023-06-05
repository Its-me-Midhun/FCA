import React, { Component } from "react";
import { connect } from "react-redux";
import { EMAIL } from "../../../config/validation";
import loginActions from "../actions";
import CommonActions from "../../common/actions";

import Loader from "../../common/components/Loader";
import { resetBreadCrumpData } from "../../../config/utils";
import { loginUser } from "../services";
import { APP_MODE } from "../../../config/constants";
import trainingAppLogo from "../../../assets/img/logo-trainer1.svg";
import { getDeviceToken, sendTokenToServer } from "../../../config/firebase";
class LoginForm extends Component {
    state = {
        errorMessage: "",
        isLoading: "",
        userName: "",
        password: "",
        isSubmit: false
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
        if (!loginParams.password.trim().length) {
            this.setState({
                errorMessage: "Please enter Password"
            });
            return false;
        }
        return true;
    };

    submitForm = async () => {
        const { userName, password } = this.state;
        let loginParams = {
            email: userName,
            password,
            grant_type: "password"
        };
        if (this.validate(loginParams)) {
            this.setState({
                isSubmit: true
            });
            await this.props.loginUser(loginParams);
            const {
                loginReducer,
                loginReducer: {
                    loginUser: {
                        success,
                        user_id,
                        access_token,
                        user,
                        refresh_token,
                        role,
                        image,
                        permissions,
                        page_info = null,
                        client_id,
                        landing_page_lock,
                        printed_name,
                        default_project_id,
                        assetmanagement_client,
                        energymanagement_client,
                        infrastructure_request,
                        fmp,
                        consultancy
                    }
                }
            } = this.props;
            if (success) {
                sendTokenToServer(user_id);
                localStorage.setItem("fca-token", access_token);
                localStorage.setItem("user", user);
                localStorage.setItem("userId", user_id);
                localStorage.setItem("role", role);
                localStorage.setItem("image", image);
                localStorage.setItem("user_permissions", JSON.stringify(permissions));
                localStorage.setItem("page_info", JSON.stringify(page_info));
                localStorage.setItem("clientId", client_id);
                localStorage.setItem("hasLandingPage", landing_page_lock);
                localStorage.setItem("printed_name", printed_name);
                localStorage.setItem("asset_management_client", JSON.stringify(assetmanagement_client));
                localStorage.setItem("energy_management_client", JSON.stringify(energymanagement_client));
                localStorage.setItem("default_project", default_project_id);
                localStorage.setItem("infrastructure_request_user", infrastructure_request);
                localStorage.setItem("fmp_user", fmp);
                localStorage.setItem("consultancy_id", JSON.stringify(consultancy?.id));
                let redirectPath = landing_page_lock ? "/home" : "/dashboard";
                if (role !== "super_admin") {
                    const {
                        commonReducer: { getMenuItemsResponse }
                    } = this.props;

                    // Midhun Mohan - getMenuItemsResponse response
                    console.log("getMenuItemsResponse", getMenuItemsResponse);
                    let permissionValue =
                        getMenuItemsResponse &&
                        getMenuItemsResponse.page_info &&
                        Object.keys(getMenuItemsResponse.user_permissions).find(up => getMenuItemsResponse.user_permissions[up] == true && up);

                    let tempMenuData = [
                        {
                            key: "dashboard",
                            label: "Dashboard ",
                            url: "Dashboard",
                            nodes: [],
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["dashboard"]
                                    : false,
                            bc: [{ key: "main", name: "Dashboard", path: "/Dashboard" }]
                        },
                        {
                            key: "fca project",
                            label: "FCA Projects",
                            url: "Project",
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["projects"]
                                    : false,
                            bc: [{ key: "main", name: "FCA Projects", path: "/project" }],
                            nodes: getMenuItemsResponse && getMenuItemsResponse.projects ? getMenuItemsResponse.projects : []
                        },
                        {
                            key: "efci",
                            label: "EFCI",
                            url: "Efci",
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["efci"]
                                    : false,
                            bc: [{ key: "main", name: "EFCI", path: "/efci" }],
                            nodes: getMenuItemsResponse && getMenuItemsResponse.efcis ? getMenuItemsResponse.efcis : []
                        },
                        {
                            key: "region",
                            label: "Regions",
                            url: "Region",
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["regions"]
                                    : false,
                            bc: [{ key: "main", name: "Regions", path: "/Region" }],
                            nodes: getMenuItemsResponse && getMenuItemsResponse.regions ? getMenuItemsResponse.regions : []
                        },
                        {
                            key: "site",
                            label: "Sites",
                            url: "site",
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["sites"]
                                    : false,
                            bc: [{ key: "main", name: "Sites", path: "/Site" }],
                            nodes: getMenuItemsResponse && getMenuItemsResponse.sites ? getMenuItemsResponse.sites : []
                        },
                        {
                            key: "building",
                            label: "Buildings",
                            url: "Building",
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["buildings"]
                                    : false,
                            bc: [{ key: "main", name: "Buildings", path: "/Building" }],
                            nodes: getMenuItemsResponse && getMenuItemsResponse.buildings ? getMenuItemsResponse.buildings : []
                        },
                        {
                            key: "client",
                            label: "Clients",
                            url: "Client",
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["clients"]
                                    : false,
                            bc: [{ key: "main", name: "Clients", path: "/Client" }],
                            nodes: getMenuItemsResponse && getMenuItemsResponse.clients ? getMenuItemsResponse.clients : []
                        },
                        {
                            key: "consultancy",
                            label: "Consultancies",
                            url: "Consultancy",
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["consultancies"]
                                    : false,
                            bc: [{ key: "main", name: "Consultancies", path: "/Consultancy" }],
                            nodes: getMenuItemsResponse && getMenuItemsResponse.consultancies ? getMenuItemsResponse.consultancies : []
                        },
                        {
                            key: "settings",
                            label: "Settings",
                            url: null,
                            view:
                                getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["super_admin"]
                                    ? getMenuItemsResponse.user_permissions["super_admin"]
                                    : getMenuItemsResponse && getMenuItemsResponse.user_permissions && getMenuItemsResponse.user_permissions["menu"]
                                    ? getMenuItemsResponse.user_permissions["menu"]["settings"]
                                    : false,
                            bc: [{ key: "main", name: "Settings", path: "/settings/buildingtype" }],
                            nodes: [
                                {
                                    key: "buildingtype",
                                    label: "Building Type",
                                    view: true,
                                    url: "settings/buildingtype",
                                    bc: [
                                        { key: "main", name: "Settings", path: "/settings/buildingtype" },
                                        {
                                            key: "buildingTypeName",
                                            name: "Building Type",
                                            path: "/settings/buildingtype"
                                        }
                                    ]
                                },
                                {
                                    key: "user",
                                    label: "Users",
                                    view: true,
                                    url: "settings/user",
                                    bc: [
                                        { key: "main", name: "Settings", path: "/settings/user" },
                                        {
                                            key: "userName",
                                            name: "User",
                                            path: "/settings/user"
                                        }
                                    ]
                                },
                                {
                                    key: "userPermissions",
                                    label: "User Permmissions",
                                    view: true,
                                    url: "settings/userPermissions",
                                    bc: [
                                        { key: "main", name: "Settings", path: "/settings/userPermissions" },
                                        {
                                            key: "userName",
                                            name: "User Permissions",
                                            path: "/settings/userPermissions"
                                        }
                                    ]
                                },
                                {
                                    key: "templates",
                                    label: "Templates",
                                    view: role == "super_admin" ? true : false,
                                    url: "settings/templates",
                                    bc: [
                                        { key: "main", name: "Settings", path: "/settings/templates" },
                                        {
                                            key: "templates",
                                            name: "Templates",
                                            path: "/settings/templates"
                                        }
                                    ]
                                }
                            ]
                        }
                    ];
                    if (permissionValue != "super_admin") {
                        let currentTab = tempMenuData.find(tm => tm.key == permissionValue);
                        if (currentTab) {
                            resetBreadCrumpData(currentTab.bc && currentTab.bc[0]);
                            this.setState({
                                errorMessage: ""
                            });
                            this.props.history.push(currentTab.bc && currentTab.bc[0].path);
                        } else {
                            resetBreadCrumpData({ key: "main", name: "Dashboard", path: redirectPath });
                            this.setState({
                                errorMessage: ""
                            });
                            this.props.history.push(redirectPath);
                        }
                        this.setState({
                            isSubmit: false
                        });
                    } else {
                        resetBreadCrumpData({ key: "main", name: "Dashboard", path: redirectPath });
                        this.setState({
                            errorMessage: ""
                        });
                        this.props.history.push(redirectPath);
                    }
                    this.setState({
                        isSubmit: false
                    });
                } else {
                    resetBreadCrumpData({ key: "main", name: "Home", path: redirectPath });
                    this.setState({
                        errorMessage: ""
                    });
                    this.props.history.push(redirectPath);
                }
            } else {
                this.setState({
                    errorMessage: "Invalid Username or Password!"
                });
                this.setState({
                    isSubmit: false
                });
            }
        }
    };

    render() {
        const { errorMessage, isLoading } = this.state;
        return (
            <React.Fragment>
                <div className={`login-outer ${APP_MODE === "training" ? "login-blue" : ""}`}>
                    <div className="login-section">
                        <div className="login-box col-md-9 p-0 d-flex">
                            <div className="img-login-section">
                                <div className="logo">
                                    <img src={APP_MODE === "training" ? trainingAppLogo : "/img/fca-logo.svg"} alt="" />
                                </div>
                            </div>

                            <div className="content-login-section">
                                <div className="otr-login">
                                    <h3>
                                        Welcome to <span>{APP_MODE === "training" ? "FCA Training" : "FCATracker"}</span>
                                    </h3>
                                    <h4 className="col-md-10 p-0">
                                        FCATracker's capital planning provides you the foundation to manage your facilities and operations more
                                        efﬁciently, effectively, and sustainably
                                    </h4>
                                    <div className="line col-md-12 p-0">
                                        <div className="blue-line col-md-2" />
                                        {/*<div className="white-line col-md-2"/>*/}
                                    </div>
                                    <div className="col-md-12 login-form p-0">
                                        <div className="col-md-12 form-inp p-0">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Email"
                                                onChange={e => this.setState({ userName: e.target.value })}
                                                onKeyPress={event => {
                                                    if (event.key === "Enter") {
                                                        this.submitForm();
                                                    }
                                                }}
                                            />
                                            <span className="msg">
                                                <img src="/img/msg-icn.png" alt="" />
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control psw"
                                                placeholder="Password"
                                                onChange={e => this.setState({ password: e.target.value })}
                                                onKeyPress={event => {
                                                    if (event.key === "Enter") {
                                                        this.submitForm();
                                                    }
                                                }}
                                            />
                                            <span className="lock">
                                                <img src="/img/lockpassword.png" alt="" />
                                            </span>
                                        </div>
                                        <div className="col-md-12 d-flex p-0 otr-rem">
                                            <div className="rem-txt">
                                                <label className="container-check">
                                                    Keep me logged in
                                                    <input type="checkbox" />
                                                    <span className="checkmark">&nbsp;</span>
                                                </label>
                                            </div>
                                            <a href="#" onClick={() => this.props.history.push("/forgot_password")}>
                                                <div className="fgt">Forgot Password?</div>
                                            </a>
                                        </div>
                                        <div className="text-danger">{errorMessage}</div>
                                        {/* {this.state.isSubmit ?
                                            <label
                                                className="log-btn"
                                                style={{ position: "relative" }}
                                            >
                                                <Loader />
                                            </label> : */}
                                        <button className="log-btn" onClick={this.submitForm}>
                                            Login{" "}
                                            {this.state.isSubmit ? (
                                                <span className="spinner-border spinner-border-sm pl-2" role="status"></span>
                                            ) : null}
                                        </button>
                                        {/* <button class="log-btn sso-btn ml-2" onClick={() => this.props.history.push("/signinwith_sso")}>
                                            Sign in with SSO
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { loginReducer, commonReducer } = state;
    return { loginReducer, commonReducer };
};

export default connect(mapStateToProps, { ...loginActions, ...CommonActions })(LoginForm);
