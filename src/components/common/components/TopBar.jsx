/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import BreadCrumbs from "./BreadCrumbs";
import { resetBreadCrumpData, popBreadCrumpData, popBreadCrumpOnPageClose, findPrevPathFromBreadCrumpData } from "../../../config/utils";
import history from "../../../config/history";
import Calculator from "./calculator/index";
import userAction from "../../user/actions";
import Portal from "./Portal";
import ForgotModal from "./forgotPasswordModal";
import ShowHelperModal from "../../helper/components/ShowHelperModal";
import { APP_MODE } from "../../../config/constants";
import trainingAppLogo from "../../../assets/img/logo-trainer.svg";
import { unSubscribeDevice } from "../../../config/firebase";
import notificationActions from "../../notification/actions";
import closeIcon from "../../../assets/img/close-icn.svg";
import "../../../assets/css/notification.css";
import { async } from "@firebase/util";
import { ProfilePopup } from "../../dashboard/components/ProfilePopup";
class TopBar extends React.Component {
    state = {
        showSettingsDropDown: false,
        showCalculatorDropDown: false,
        showNav: true,
        user: "",
        image: "",
        showResetPasswordModal: false,
        showHelperModal: false,
        selectedHelperItem: {},
        showNotificationDropDown: false
    };

    componentDidMount = async () => {
        let user = localStorage.getItem("user");
        let image = localStorage.getItem("image");
        await this.setState({ user, image });
        window.addEventListener("click", e => {
            let profileButton = document.getElementById("profileButton");
            if (profileButton && !profileButton.contains(e.target)) {
                this.setState({
                    showSettingsDropDown: false
                });
            }
        });
        this.props.getUnreadNotifications();
        this.openFullscreenOnCharts();
    };

    componentDidUpdate = async prevProps => {
        const {
            match: {
                params: { section, tab }
            }
        } = this.props;
        if (prevProps.match.params.tab !== tab || prevProps.match.params.section !== section) {
            this.openFullscreenOnCharts();
        }
    };

    openFullscreenOnCharts = () => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        let element = document.getElementsByTagName("BODY")[0];
        element.requestFullScreen =
            element.requestFullScreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            function () {
                return false;
            };
        document.cancelFullScreen =
            document.cancelFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            function () {
                return false;
            };
        if (tab === "dashboard" || tab === "assetcharts") {
            element.requestFullScreen();
        } else {
            document.cancelFullScreen();
        }
    };

    renderPasswordModal = () => {
        const { showResetPasswordModal } = this.state;
        if (!showResetPasswordModal) return null;

        return <Portal body={<ForgotModal onCancel={this.onCancel} resetPasswordProfile={this.resetPasswordProfile} />} onCancel={this.onCancel} />;
    };

    resetPasswordProfile = async param => {
        let userId = localStorage.getItem("userId");
        await this.props.resetPasswordProfile(userId, param);
        const {
            history,
            loginReducer: { resetPassword }
        } = this.props;

        // if (resetPassword && resetPassword.success) {
        //     await this.setState({
        //         errorMessage: "",
        //         alertMessage: resetPassword.message,
        //         subimitDisabled: true
        //     });

        // }
        // else {
        //     this.setState({
        //         errorMessage: resetPassword && resetPassword.message ? resetPassword.message : "Error while resetting password"
        //     });
        // }
        if (resetPassword && resetPassword.success) {
            await this.setState({
                errorMessage: "",
                alertMessage: resetPassword.message,
                subimitDisabled: true
            });
        } else {
            this.setState({
                alertMessage: resetPassword && resetPassword.message ? resetPassword.message : "Error while resetting password"
            });
        }
        this.showAlert();
        this.setState({
            showResetPasswordModal: false
        });
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

    onCancel = () => {
        this.setState({
            showResetPasswordModal: false
        });
    };

    toggleSettingsDropDown = async () => {
        const { showSettingsDropDown } = this.state;
        this.setState({
            showSettingsDropDown: !showSettingsDropDown
        });
    };

    toggleCalculatorDropDown = async () => {
        const { showCalculatorDropDown } = this.state;
        this.setState({
            showCalculatorDropDown: !showCalculatorDropDown
        });
    };

    logoutUserConfirm = async () => {
        await this.props.logoutUser();
        if (this.props.loginReducer && this.props.loginReducer.logoutUser && this.props.loginReducer.logoutUser.success) {
            let userId = localStorage.getItem("userId");
            unSubscribeDevice(userId);
            localStorage.clear();
            sessionStorage.removeItem("bc-data");
            history.push("/");
        }
    };

    closeNav = () => {
        var element = document.getElementById("sidebar");
        var element1 = document.getElementById("main");
        this.props.handleShowNa();
        element.style.width = "30px";
        element1.style.marginLeft = "30px";
        element.classList.add("expandnavbar");
        element1.classList.add("expandnavbarr");
        element1.classList.remove("margin-nav");
    };

    showNav = () => {
        var element = document.getElementById("sidebar");
        var element1 = document.getElementById("main");
        this.props.handleShowNa();
        element.style.width = "300px";
        element1.style.marginLeft = "300px";
        element.classList.remove("expandnavbar");
        element1.classList.remove("expandnavbarr");
        element1.classList.add("margin-nav");
    };

    toggleFullscreen = event => {
        var element = document.getElementsByTagName("BODY")[0];
        var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        if (event instanceof HTMLElement) {
            element = event;
        }

        element.requestFullScreen =
            element.requestFullScreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            function () {
                return false;
            };
        document.cancelFullScreen =
            document.cancelFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            function () {
                return false;
            };

        if (isFullscreen) {
            document.cancelFullScreen();
        } else {
            element.requestFullScreen();
        }
        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
    };

    viewUser = () => {
        this.toggleSettingsDropDown();
        let userId = localStorage.getItem("userId");
        const { history } = this.props;
        const {
            location: { search }
        } = this.props;
        this.setState({
            selectedUser: userId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: `/user/userinfo/${userId}/basicdetails`
                },
                {
                    key: "buildings",
                    name: "Buildings",
                    path: `/user/userinfo/${userId}/buildings${search}`
                },
                {
                    key: "projects",
                    name: "FCA Projects",
                    path: `/user/userinfo/${userId}/projects${search}`
                }
            ]
        });
        let tabKeyList = ["basicdetails", "buildings", "projects"];
        let tab = "basicdetails";
        resetBreadCrumpData({
            key: "main",
            name: "User",
            path: `/user/userinfo/${userId}/${tab}`
        });
        history.push(`/user/userinfo/${userId}/${tab}`);

        // history.push("/");
    };

    showHelperModal = async (item, subItem) => {
        await this.setState({
            showHelperModal: true,
            selectedHelperItem: {
                item,
                subItem
            }
        });
    };

    renderUploadHelperModal = () => {
        const { showHelperModal, selectedHelperItem } = this.state;
        if (!showHelperModal) return null;
        return (
            <Portal
                body={<ShowHelperModal selectedHelperItem={selectedHelperItem} onCancel={() => this.setState({ showHelperModal: false })} />}
                onCancel={() => this.setState({ showHelperModal: false })}
            />
        );
    };

    findEntity = entity => {
        let retVal = entity;
        if (entity[entity.length - 1] === "y") {
            retVal = entity.slice(0, -1) + "ies";
        } else if (entity[entity.length - 1] === "s") {
            retVal = entity.slice(0, -1) + "s";
        } else {
            retVal = entity + "s";
        }
        return retVal.toLowerCase();
    };

    findUrlFromProps = () => {
        const {
            location: { pathname = null }
        } = this.props;
        let returnVal = null;
        if (pathname) {
            returnVal = pathname.split("/");
            returnVal = returnVal && returnVal.length ? this.findEntity(returnVal[1]) : null;
            if (returnVal === "reports") {
                returnVal = "fca_reports";
            } else if (returnVal === "projects") {
                returnVal = "fca_projects";
            } else if (returnVal === "efcis") {
                returnVal = "efci";
            }
            return returnVal;
        }
        return null;
    };

    Goback = () => {
        let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
        let keys = currentBreadCrumpData.map(item => item.name);
        const lastBcName = currentBreadCrumpData[keys.length - 1].name;
        const lastBcKey = currentBreadCrumpData[keys.length - 1].key;
        if (lastBcName === "Basic Details" || lastBcName === "Main Details") {
            popBreadCrumpOnPageClose();
        } else if (lastBcKey === "assignedInfo") {
            currentBreadCrumpData.length -= 2; // removing last items form current data
            let newBreadCrumpData = currentBreadCrumpData;
            sessionStorage.setItem("bc-data", JSON.stringify(newBreadCrumpData));
        } else {
            popBreadCrumpData();
        }
        history.push(findPrevPathFromBreadCrumpData());
    };

    toggleNotificationsDropDown = async () => {
        const { showNotificationDropDown } = this.state;
        this.setState(
            {
                showNotificationDropDown: !showNotificationDropDown
            },
            async () => {
                if (this.state.showNotificationDropDown) {
                    await this.props.getUnreadNotifications();
                    this.updateNotifications(null, true, false, true, "seen_at");
                }
            }
        );
    };

    showAllNotifications = async () => {
        await this.setState({
            showNotificationDropDown: false
        });
        resetBreadCrumpData({
            key: "main",
            name: "Notifications",
            path: "/settings/notifications"
        });
        history.push("/settings/notifications");
    };

    updateNotifications = async (id, is_seen = false, is_read = false, isBulkUpdate = false, key = "") => {
        let notificationIds = [];
        if (isBulkUpdate) {
            let currentNotifications = this.props.notificationReducer.getUnreadNotificationsResponse?.data || [];
            currentNotifications.map(notification => {
                if (!notification[key]) {
                    notificationIds.push(notification.id);
                }
            });
        }
        if (notificationIds.length) {
            let updateParams = {
                notification_id: isBulkUpdate ? [...notificationIds] : [id],
                is_read,
                is_seen
            };
            await this.props.updateNotifications(updateParams);
            this.props.getUnreadNotifications();
            if (is_read && isBulkUpdate) {
                this.setState({ showNotificationDropDown: false });
                resetBreadCrumpData({
                    key: "main",
                    name: "Notifications",
                    path: "/settings/notifications"
                });
                history.push("/settings/notifications");
            }
        }
    };

    render() {
        const { showSettingsDropDown, showCalculatorDropDown, user, image, showNotificationDropDown } = this.state;
        const { showNav } = this.props;
        let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
        let notificationList = this.props.notificationReducer.getUnreadNotificationsResponse?.data || [];
        let notificationCount = this.props.notificationReducer.getUnreadNotificationsResponse?.count || 0;
        let lastItem = currentBreadCrumpData && currentBreadCrumpData[currentBreadCrumpData?.length - 1];

        let entity = this.findUrlFromProps();
        return (
            <>
                <div className="col-md-12 navbarOtr">
                    {this.renderPasswordModal()}
                    <nav className="navbar navbar-expand-lg col-md-12">
                        <a
                            className="logo-small navbar-brand cursor-pointer"
                            onClick={() => {
                                resetBreadCrumpData({
                                    key: "main",
                                    name: "Dashboard",
                                    path: "/dashboard"
                                });
                                history.push("/dashboard");
                                this.showNav();
                            }}
                        >
                            <img src={APP_MODE === "training" ? trainingAppLogo : "/img/fca-logo.svg"} alt="" />
                        </a>
                        {showNav ? (
                            <div className="navmenuIcon" onClick={() => this.closeNav()}>
                                <svg
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    width="120px"
                                    height="120px"
                                    viewBox="0 0 120 120"
                                    enableBackground="new 0 0 120 120"
                                    xmlSpace="preserve"
                                >
                                    <circle fill="#B7C6D5" cx="60" cy="60" r="60" />
                                    <g>
                                        <g>
                                            <path
                                                d="M75,88.291c0.944-0.944,0.944-2.472,0-3.417L50.125,60L75,35.126c0.944-0.945,0.944-2.472,0-3.417
c-0.945-0.945-2.473-0.945-3.418,0L45,58.291c-0.472,0.472-0.708,1.09-0.708,1.709c0,0.619,0.236,1.237,0.708,1.708l26.582,26.583
C72.527,89.236,74.055,89.236,75,88.291z"
                                            />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        ) : null}
                        {currentBreadCrumpData && currentBreadCrumpData?.length > 1 ? (
                            <>
                                <ReactTooltip id="topbar" />
                                <button
                                    data-delay-show="1000"
                                    data-tip={`Go Back To Previous View`}
                                    data-effect="solid"
                                    data-place="bottom"
                                    data-background-color="#007bff"
                                    data-for="topbar"
                                    className="back-blue-common-butn"
                                    onClick={this.Goback}
                                >
                                    <i class="fas fa-caret-left"></i>Back
                                </button>
                            </>
                        ) : lastItem?.key === "main" && lastItem?.name === "User" ? (
                            <>
                                <ReactTooltip id="topbar" />
                                <button
                                    data-delay-show="1000"
                                    data-tip={`Go Back To Dashboard`}
                                    data-effect="solid"
                                    data-place="bottom"
                                    data-background-color="#007bff"
                                    data-for="topbar"
                                    className="back-blue-common-butn"
                                    onClick={() => {
                                        resetBreadCrumpData({
                                            key: "main",
                                            name: "Dashboard",
                                            path: "/dashboard"
                                        });
                                        history.push("/dashboard");
                                    }}
                                >
                                    <i class="fas fa-caret-left"></i>Back To Dashboard
                                </button>
                            </>
                        ) : null}
                        <BreadCrumbs />
                        <div className="navbar-collapse" id="navbarSupportedContent">
                            <ReactTooltip id="topbar" />
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item dropdown profileImg d-flex align-items-center calc" id="calc">
                                    <a
                                        className="nav-link calcicons view-inner help-icon"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        data-tip={`Help`}
                                        data-effect="solid"
                                        data-place="bottom"
                                        data-background-color="#007bff"
                                        data-for="topbar"
                                        onClick={() => {
                                            this.showHelperModal("menu", entity);
                                        }}
                                    >
                                        <img src="/img/question-mark-icon.png" alt="" className="fil-ico" />
                                    </a>
                                    {/* {showCalculatorDropDown ? (
                                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <Calculator />
                                        </div>
                                    ) : null} */}
                                </li>
                                {this.renderUploadHelperModal()}
                                <li className="nav-item dropdown profileImg d-flex align-items-center calc" id="calc">
                                    <a
                                        className="nav-link calcicons"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        data-tip={`Calculator`}
                                        data-effect="solid"
                                        data-place="bottom"
                                        data-background-color="#007bff"
                                        data-for="topbar"
                                        onClick={() => this.toggleCalculatorDropDown()}
                                    >
                                        <img src="/img/calculator.svg" className="set-icon-width" alt="" />
                                    </a>
                                    {showCalculatorDropDown ? (
                                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <Calculator />
                                        </div>
                                    ) : null}
                                </li>
                                <li className="d-flex align-items-center">
                                    <a
                                        className="nav-link calcicons"
                                        onClick={e => this.toggleFullscreen(e)}
                                        data-tip={`Full screen`}
                                        data-effect="solid"
                                        data-place="bottom"
                                        data-background-color="#007bff"
                                        data-for="topbar"
                                    >
                                        <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                    </a>
                                </li>
                                <li className="d-flex align-items-center imgNoti dropdown notificationShow" id="notificationBellButton">
                                    <a className="nav-link notifctnBell" onClick={() => this.toggleNotificationsDropDown()}>
                                        <img src="/img/bell.png" alt="" />
                                        <span className="notifyTxt">{notificationCount}</span>
                                    </a>
                                    {showNotificationDropDown ? (
                                        <div className="dropdown-menu notification">
                                            <div className="head">
                                                <h3>Notification</h3>
                                                <button className="btn btn-see" onClick={() => this.showAllNotifications()}>
                                                    See all
                                                </button>
                                            </div>
                                            <div className="cnt-sec">
                                                {notificationList?.length ? (
                                                    notificationList.map((notification, i) => {
                                                        return (
                                                            <div
                                                                className="itm notification-item-cont"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    this.updateNotifications(null, true, true, true, "read_at");
                                                                }}
                                                            >
                                                                <div className="icon unred">
                                                                    <img src="/img/notification-icn.svg" />
                                                                </div>
                                                                <div className="cnt-area">
                                                                    <h3>{notification.data?.title}</h3>
                                                                    <p>{notification.data?.body}</p>
                                                                    {/* <span>2 min ago</span> */}
                                                                </div>
                                                                <div
                                                                    class="close-notify"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        this.updateNotifications(notification.id, true, true);
                                                                    }}
                                                                >
                                                                    <img src={closeIcon} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="itm">
                                                        {/* <div className="icon unred">
                                                            <img src="/img/notification-icn.svg" />
                                                        </div> */}
                                                        <div className="cnt-area">
                                                            <h3>No New Notifications!</h3>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* <div className="itm">
                                                    <div className="icon">
                                                        <img src="/img/notification-red.svg" />
                                                    </div>
                                                    <div className="cnt-area">
                                                        <h3>American Health FCA</h3>
                                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                        <span>2 min ago</span>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    ) : null}
                                </li>

                                <li className="nav-item dropdown profileImg" id="profileButton">
                                    <a
                                        className="nav-link dropdown-toggle d-flex flex-row align-items-center"
                                        onClick={() => this.toggleSettingsDropDown()}
                                    >
                                        <div className="profileImgSec">
                                            <img src={image === "null" ? "/img/user-icon.png" : image} alt="" />
                                        </div>
                                        <span className="profName">{user} </span>
                                    </a>
                                    {showSettingsDropDown && (
                                        <ProfilePopup
                                            viewUser={this.viewUser}
                                            handleResetPassword={() => {
                                                this.setState({
                                                    showResetPasswordModal: true
                                                });
                                                this.toggleSettingsDropDown();
                                            }}
                                            handleLogout={this.logoutUserConfirm}
                                        />
                                    )}
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    const { loginReducer, notificationReducer } = state;
    return {
        state,
        loginReducer,
        notificationReducer
    };
};

export default withRouter(connect(mapStateToProps, { ...userAction, ...notificationActions })(TopBar));
