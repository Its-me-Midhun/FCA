/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from "moment";
import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { Accordion, Card } from "react-bootstrap";
import Loader from "../common/components/Loader";
import Portal from "../common/components/Portal";
import dashboardActions from "../dashboard/actions";
import ReportsModal from "./components/ReportsModal";
import Widget from "./components/Widget";
import { addToBreadCrumpData, bulkResetBreadCrumpData, checkPermission } from "../../config/utils";
import userActions from "../user/actions";
import history from "../../config/history";
import ReactTooltip from "react-tooltip";
import { APP_MODE } from "../../config/constants";
import { unSubscribeDevice } from "../../config/firebase";
import SmartChartIcon from "../../assets/img/smart-chart.svg";
import { permissions } from "../../config/permissions";
export class LandingPage extends Component {
    state = {
        showReportsModal: false,
        currentDate: new Date(),
        isLoading: true,
        doc_id: "",
        doc_name: ""
    };

    componentDidMount = async () => {
        this.interval = setInterval(() => {
            this.setState({ currentDate: new Date() });
        }, 1000);
        let clientId = localStorage.getItem("clientId");
        if (clientId && clientId !== "null") {
            await this.props.getLandingPageData({ client_id: clientId });
            await this.props.getWidgetData();
        } else {
            await this.props.getLandingPageData();
            await this.props.getWidgetData();
        }
        ReactTooltip.rebuild();
        this.setState({ isLoading: false });
    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    toggleReportsModal = (id, name) => {
        this.setState({ showReportsModal: !this.state.showReportsModal, doc_id: id, doc_name: name });
    };
    redirectDocuments = clientId => {
        this.props.setActiveMenu("documents");
        const { history } = this.props;
        addToBreadCrumpData({ key: "main", name: "Documents", path: `/documents` });
        history.push("/documents");
    };

    // redirectDocumentType = clientId => {
    //     this.props.setActiveMenu("documents");
    //     const { history } = this.props;
    //     addToBreadCrumpData({ key: "main", name: "Documents", path: `/document-settings/type` });
    //     history.push("/document-settings/type?isLandingPageView=true");
    // };
    redirectImageManagement = clientId => {
        this.props.setActiveMenu("images");
        const { history } = this.props;
        addToBreadCrumpData({ key: "main", name: "Image Management", path: `/images` });
        history.push("/images");
    };
    redirectSmartChart = () => {
        this.props.setActiveMenu("smartCharts");
        const { history } = this.props;
        // addToBreadCrumpData({ key: "main", name: "Smart Charts", path: `/smartcharts/reports` });
        bulkResetBreadCrumpData([
            { key: "main", name: "Smart Charts", path: `/smartcharts/reports` },
            {
                key: "reports",
                name: "Reports",
                path: `/smartcharts/reports`
            }
        ]);
        history.push("/smartcharts/reports");
    };

    logoutUser = async () => {
        await this.props.logoutUser();
        if (this.props.loginReducer && this.props.loginReducer.logoutUser && this.props.loginReducer.logoutUser.success) {
            let userId = localStorage.getItem("userId");
            unSubscribeDevice(userId);
            localStorage.clear();
            sessionStorage.removeItem("bc-data");
            history.push("/");
        }
    };

    handleChange = e => {
        console.log("hh", e.target.value);
    };

    assetRouting = () => {
        this.props.setActiveMenu("assets");
        const {
            // history,
            dashboardReducer: { landingPageData }
        } = this.props;
        // Midhun Mohan- response of dashBoard Data
        console.log("landingPageData", landingPageData);
        const { client } = landingPageData;
        const assetClient = (localStorage.getItem("asset_management_client") && JSON.parse(localStorage.getItem("asset_management_client"))) || {};
        history.push(
            assetClient?.id
                ? `assetmanagement/assetinfo/${assetClient.id}/assetcharts`
                : client.id
                ? `assetmanagement/assetinfo/${client.id}/assetcharts`
                : "assetmanagement"
        );
        let assetManagementBC = assetClient?.id
            ? [
                  { key: "main", name: "Asset Management", path: "/assetmanagement" },
                  {
                      key: "assetName",
                      name: assetClient?.name,
                      path: `/assetmanagement/assetinfo/${assetClient?.id}/basicdetails`
                  },
                  {
                      key: "info",
                      name: "Charts & Graphs",
                      path: `/assetmanagement/assetinfo/${assetClient?.id}/assetcharts`
                  }
              ]
            : client.id
            ? [
                  { key: "main", name: "Asset Management", path: "/assetmanagement" },
                  {
                      key: "assetName",
                      name: client?.name,
                      path: `/assetmanagement/assetinfo/${client?.id}/basicdetails`
                  },
                  {
                      key: "info",
                      name: "Charts & Graphs",
                      path: `/assetmanagement/assetinfo/${client?.id}/assetcharts`
                  }
              ]
            : [{ key: "main", name: "Asset Management", path: "/assetmanagement" }];

        bulkResetBreadCrumpData(assetManagementBC);
    };
    energyRouting = () => {
        this.props.setActiveMenu("energy");
        const {
            // history,
            dashboardReducer: { landingPageData }
        } = this.props;
        const { client } = landingPageData;
        const energyClient = (localStorage.getItem("energy_management_client") && JSON.parse(localStorage.getItem("energy_management_client"))) || {};
        history.push(
            energyClient?.id
                ? `energymanagement/energyinfo/${energyClient.id}/energydashboard`
                : client.id
                ? `energymanagement/energyinfo/${client.id}/energydashboard`
                : "energyManagement"
        );
        let energyManagementBC = energyClient?.id
            ? [
                  { key: "main", name: "Energy Management", path: "/energyManagement" },
                  {
                      key: "energyName",
                      name: energyClient?.name,
                      path: `/energymanagement/energyinfo/${energyClient.id}/basicdetails`
                  },
                  {
                      key: "info",
                      name: "Charts & Graphs",
                      path: `/energymanagement/energyinfo/${energyClient.id}/energydashboard`
                  }
              ]
            : client.id
            ? [
                  { key: "main", name: "Energy Management", path: "/energyManagement" },
                  {
                      key: "energyName",
                      name: client?.name,
                      path: `/energymanagement/energyinfo/${client.id}/basicdetails`
                  },
                  {
                      key: "info",
                      name: "Charts & Graphs",
                      path: `/energymanagement/energyinfo/${client.id}/energydashboard`
                  }
              ]
            : [{ key: "main", name: "Energy Management", path: "/energyManagement" }];

        bulkResetBreadCrumpData(energyManagementBC);
    };

    showRecommendationForm = () => {
        const {
            history,
            dashboardReducer: { landingPageData, widgetData }
        } = this.props;
        let type = "Landing Page";
        let projectName = widgetData?.widget?.project_name || "";
        let projectId = widgetData?.widget?.project_ids?.length ? widgetData.widget.project_ids[0] : "";
        let bc = [
            {
                key: "main",
                name: "Home",
                path: "/home",
                index: 0
            },
            { key: "main", name: "FCA Projects", path: "/project", index: 1 },
            {
                key: "projectName",
                name: projectName,
                path: `/project/projectinfo/${projectId}/basicdetails`,
                index: 2
            },
            {
                key: "info",
                name: "Recommendations",
                path: `/project/projectinfo/${projectId}/recommendations`,
                index: 3
            },
            {
                key: "add",
                name: "Add Recommendations",
                path: `/recommendations/add?p_id=${projectId}&c_id=${landingPageData?.client?.id || ""}&type=${type}`,
                index: 4
            }
        ];
        bulkResetBreadCrumpData(bc);
        history.push(`/recommendations/add?p_id=${projectId}&c_id=${landingPageData?.client?.id || ""}&type=${type}`);
    };

    render() {
        const {
            history,
            dashboardReducer: { landingPageData, widgetData, accordianOpen, activeLandingPageMenu }
        } = this.props;
        const { showReportsModal, currentDate, isLoading } = this.state;
        let userName = localStorage.getItem("user");
        const headerStyle = {
            fontFamily: landingPageData.header_style?.font_name,
            color: `#${landingPageData.header_style?.font_color}`,
            fontSize: landingPageData.header_style?.font_size,
            fontWeight: landingPageData.header_style?.is_bold ? "bold" : "normal"
        };
        const clientNameStyle = {
            fontFamily: landingPageData.client_name_style?.font_name,
            color: `#${landingPageData.client_name_style?.font_color}`,
            fontSize: landingPageData.client_name_style?.font_size,
            fontWeight: landingPageData.client_name_style?.is_bold ? "bold" : "normal"
        };

        let hasLandingPage = localStorage.getItem("hasLandingPage") === "true" ? true : false;

        return (
            <>
                {hasLandingPage ? (
                    <>
                        {showReportsModal && (
                            <Portal
                                body={<ReportsModal doc_id={this.state.doc_id} doc_name={this.state.doc_name} onCancel={this.toggleReportsModal} />}
                                onCancel={this.toggleReportsModal}
                            />
                        )}
                        <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                            <div className="dashboard-outer dash-otr-main">
                                <ReactTooltip id="landing_page" />
                                <div className={`outer-detail drop-nav ${APP_MODE === "training" ? "landing-blue" : ""}`}>
                                    <div className="left-side-nav">
                                        <a
                                            href={landingPageData?.cbre_url}
                                            className="cls-cbre-lnk"
                                            target="_blank"
                                            data-delay-show="500"
                                            data-tip={`Go To Website`}
                                            data-effect="float"
                                            data-for="landing_page"
                                            data-place="top"
                                            data-background-color="#007bff"
                                        >
                                            <div className="cbre-logo-sec text-center cursor-hand">
                                                <img src={landingPageData?.cbre_logo?.url || "img/cbre.svg"} alt="cbre-logo" />
                                            </div>
                                        </a>
                                        <Accordion
                                            defaultActiveKey={accordianOpen === "tracker" ? "0" : accordianOpen === "documents" ? "1" : ""}
                                            as="div"
                                            className="menu-section"
                                        >
                                            <ul>
                                                <Accordion.Toggle
                                                    eventKey="0"
                                                    as="li"
                                                    onClick={() => this.props.accordianOpen(accordianOpen === "tracker" ? "" : "tracker")}
                                                >
                                                    <div className={`dropdown show`}>
                                                        <Card>
                                                            <button
                                                                className={`dropdown-toggle`}
                                                                data-delay-show="500"
                                                                data-tip={
                                                                    accordianOpen === "tracker" ? `Click To Collapse Menu` : `Click To Expand Menu`
                                                                }
                                                                data-effect="float"
                                                                data-for="landing_page"
                                                                data-place="top"
                                                                data-background-color="#007bff"
                                                            >
                                                                <img src="img/FCA Tracker.svg" alt="" />
                                                                <span>FCA Tracker</span>
                                                                <div className="butn-icn">
                                                                    <div className={`arrow-round ${accordianOpen === "tracker" ? "arrow-blue" : ""}`}>
                                                                        <img
                                                                            src={
                                                                                accordianOpen === "tracker"
                                                                                    ? "img/less-up-icon-menu.svg"
                                                                                    : "img/arrow-d-icon-menu 1.svg"
                                                                            }
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </button>
                                                            <Accordion.Collapse eventKey="0" id="dash-sub-menu">
                                                                <Card.Body>
                                                                    <div className={`dropdown-menu show`} aria-labelledby="dropdownMenuButton">
                                                                        <a
                                                                            data-delay-show="500"
                                                                            data-tip={`Go To FCA Dashboard`}
                                                                            data-effect="float"
                                                                            data-for="landing_page"
                                                                            data-place="top"
                                                                            data-background-color="#007bff"
                                                                            className={`dropdown-item ${
                                                                                activeLandingPageMenu === "dashboard" ? "active-menu" : ""
                                                                            }`}
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                this.props.setActiveMenu("dashboard");
                                                                                history.push("/dashboard");
                                                                            }}
                                                                        >
                                                                            <img src="img/Main Menu.svg" alt="" />
                                                                            <span>FCA Dashboard</span>
                                                                        </a>
                                                                        <a
                                                                            data-delay-show="500"
                                                                            data-tip={
                                                                                checkPermission("forms", "recommendations", "create")
                                                                                    ? `Create New Recommendation`
                                                                                    : "You are not authorised to perform this action"
                                                                            }
                                                                            data-effect="float"
                                                                            data-for="landing_page"
                                                                            data-place="top"
                                                                            data-background-color="#007bff"
                                                                            className={`dropdown-item ${
                                                                                checkPermission("forms", "recommendations", "create")
                                                                                    ? ""
                                                                                    : "disabled-btn"
                                                                            } ${activeLandingPageMenu === "new recommendation" ? "active-menu" : ""}`}
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                if (checkPermission("forms", "recommendations", "create")) {
                                                                                    this.props.setActiveMenu("new recommendation");

                                                                                    this.showRecommendationForm();
                                                                                }
                                                                            }}
                                                                        >
                                                                            <img src="img/rec-add-plus.svg" alt="" className="rec-add-plus" />
                                                                            <span>
                                                                                {localStorage.getItem("infrastructure_request_user") === "yes"
                                                                                    ? "New Funding Request"
                                                                                    : localStorage.getItem("fmp_user") === "yes"
                                                                                    ? "New Facility Master Plan"
                                                                                    : "New Recommendation"}
                                                                            </span>
                                                                        </a>
                                                                    </div>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    </div>
                                                </Accordion.Toggle>

                                                <li
                                                    onClick={checkPermission("menu", "asset_management", null) ? this.assetRouting : null}
                                                    className={`${activeLandingPageMenu === "assets" ? "active-menu" : ""} ${
                                                        checkPermission("menu", "asset_management", null) ? "" : "disabled-btn"
                                                    }`}
                                                    data-delay-show="500"
                                                    data-tip={
                                                        checkPermission("menu", "asset_management", null)
                                                            ? `View Asset Management Dashboard`
                                                            : "You are not authorised to perform this action"
                                                    }
                                                    data-effect="float"
                                                    data-for="landing_page"
                                                    data-place="top"
                                                    data-background-color="#007bff"
                                                >
                                                    <img alt="" src="img/Asset management.svg" />
                                                    <span>Asset Management</span>
                                                </li>
                                                <li
                                                    onClick={checkPermission("menu", "energy_management", null) ? this.energyRouting : null}
                                                    className={`${activeLandingPageMenu === "energy" ? "active-menu" : ""} ${
                                                        checkPermission("menu", "energy_management", null) ? "" : "disabled-btn"
                                                    }`}
                                                    data-delay-show="500"
                                                    data-tip={
                                                        checkPermission("menu", "energy_management", null)
                                                            ? `View Energy Management Dashboard`
                                                            : "You are not authorised to perform this action"
                                                    }
                                                    data-effect="float"
                                                    data-for="landing_page"
                                                    data-place="top"
                                                    data-background-color="#007bff"
                                                >
                                                    <img alt="" src="img/Energy Management.svg" />
                                                    <span>Energy Management</span>
                                                </li>
                                                <li
                                                    onClick={checkPermission("menu", "image_management", null) ? this.redirectImageManagement : null}
                                                    className={`${activeLandingPageMenu === "images" ? "active-menu" : ""} ${
                                                        checkPermission("menu", "image_management", null) ? "" : "disabled-btn"
                                                    }`}
                                                    data-delay-show="500"
                                                    data-tip={
                                                        checkPermission("menu", "image_management", null)
                                                            ? `Go To Image Management`
                                                            : "You are not authorised to perform this action"
                                                    }
                                                    data-effect="float"
                                                    data-for="landing_page"
                                                    data-place="top"
                                                    data-background-color="#007bff"
                                                >
                                                    <img alt="" src="img/ImageManagement.svg" />
                                                    <span>Image Management</span>
                                                </li>
                                                <Accordion.Toggle
                                                    eventKey={checkPermission("menu", "documents", null) ? "1" : ""}
                                                    as="li"
                                                    onClick={() => this.props.accordianOpen(accordianOpen === "documents" ? "" : "documents")}
                                                >
                                                    <div className={`dropdown show`}>
                                                        <Card>
                                                            <button
                                                                className={`dropdown-toggle`}
                                                                data-delay-show="500"
                                                                data-tip={
                                                                    accordianOpen === "documents" ? `Click To Collapse Menu` : `Click To Expand Menu`
                                                                }
                                                                data-effect="float"
                                                                data-for="landing_page"
                                                                data-place="top"
                                                                data-background-color="#007bff"
                                                            >
                                                                <img src="img/document-icn.svg" alt="" />
                                                                <span>Document Management</span>

                                                                <div className="butn-icn">
                                                                    <div
                                                                        className={`arrow-round ${accordianOpen === "documents" ? "arrow-blue" : ""}`}
                                                                    >
                                                                        <img
                                                                            src={
                                                                                accordianOpen === "documents"
                                                                                    ? "img/less-up-icon-menu.svg"
                                                                                    : "img/arrow-d-icon-menu 1.svg"
                                                                            }
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </button>
                                                            <Accordion.Collapse eventKey="1" id="dash-sub-menu">
                                                                <Card.Body>
                                                                    <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                                                                        <a
                                                                            className={`dropdown-item ${
                                                                                activeLandingPageMenu === "documents" ? "active-menu" : ""
                                                                            }`}
                                                                            data-delay-show="500"
                                                                            data-tip={
                                                                                checkPermission("menu", "documents", null)
                                                                                    ? `View All Documents`
                                                                                    : "You are not authorised to perform this action"
                                                                            }
                                                                            data-effect="float"
                                                                            data-for="landing_page"
                                                                            data-place="top"
                                                                            data-background-color="#007bff"
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                this.props.setActiveMenu("documents");
                                                                                checkPermission("menu", "documents", null) &&
                                                                                    this.redirectDocuments();
                                                                            }}
                                                                        >
                                                                            <img src="img/report-icn.svg" alt="" />
                                                                            <span>View All Documents</span>
                                                                        </a>
                                                                        {landingPageData?.document_types?.map((item, i) => (
                                                                            <a
                                                                                key={item.id}
                                                                                className={`dropdown-item ${
                                                                                    activeLandingPageMenu === item.name ? "active-menu" : ""
                                                                                }`}
                                                                                data-delay-show="500"
                                                                                data-tip={`View Selected Documents`}
                                                                                data-effect="float"
                                                                                data-for="landing_page"
                                                                                data-place="top"
                                                                                data-background-color="#007bff"
                                                                                onClick={e => {
                                                                                    e.stopPropagation();
                                                                                    this.props.setActiveMenu(item.name);
                                                                                    this.setState({
                                                                                        document_id: landingPageData?.document_types?.name
                                                                                    });

                                                                                    this.toggleReportsModal(item.id, item.name);
                                                                                }}
                                                                            >
                                                                                <img src="img/report-icn.svg" alt="" />
                                                                                <span>{item.name || ""} </span>
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    </div>
                                                </Accordion.Toggle>
                                                <li
                                                    onClick={() =>
                                                        checkPermission("menu", permissions.SMART_CHARTS, null) ? this.redirectSmartChart() : null
                                                    }
                                                    className={`${activeLandingPageMenu === "smartCharts" ? "active-menu" : ""} ${
                                                        checkPermission("menu", permissions.SMART_CHARTS, null) ? "" : "disabled-btn"
                                                    }`}
                                                    data-delay-show="500"
                                                    data-tip={
                                                        checkPermission("menu", permissions.SMART_CHARTS, null)
                                                            ? `View Smart Chart`
                                                            : "You are not authorised to perform this action"
                                                    }
                                                    data-effect="float"
                                                    data-for="landing_page"
                                                    data-place="top"
                                                    data-background-color="#007bff"
                                                >
                                                    <img alt="" src={SmartChartIcon} />
                                                    <span>Smart Chart</span>
                                                </li>
                                                <li
                                                    onClick={() => {
                                                        this.props.setActiveMenu("fmp");
                                                        history.push("/coming-soon");
                                                    }}
                                                    className={`${activeLandingPageMenu === "fmp" ? "active-menu" : ""}`}
                                                    data-delay-show="500"
                                                    data-tip={`View Facility Master Plan`}
                                                    data-effect="float"
                                                    data-for="landing_page"
                                                    data-place="top"
                                                    data-background-color="#007bff"
                                                >
                                                    <img alt="" src="img/Facility Master Plan.svg" />
                                                    <span>Facility Master Plan</span>
                                                </li>
                                            </ul>
                                        </Accordion>

                                        <div className="bottom-section">
                                            {/* <div className="bot-illus text-center">
                                                <img src="img/bot-img.svg" alt="" />
                                            </div> */}
                                            <div className="bot-logo">
                                                <img src="img/fca-track.svg" alt="" />
                                            </div>
                                            <div className="power-txt">Powered By FCA Tracker</div>
                                        </div>
                                    </div>
                                    <div className="right-panel-section right-side-sec" id="main">
                                        <div className="wel-txt">
                                            <h3>
                                                Hi, Welcome Back <span>{userName || ""}</span>
                                                <span>
                                                    <img src="img/wel-txt.png" alt="" />
                                                </span>
                                            </h3>
                                            <div className="right-bx">
                                                <h4>
                                                    <img src="/img/cal-icn.png" alt="" /> {moment(currentDate).format("MMMM Do YYYY, h:mm a")}
                                                </h4>
                                                <div
                                                    className="logout"
                                                    data-delay-show="500"
                                                    data-tip={`Click To Logout`}
                                                    data-effect="float"
                                                    data-for="landing_page"
                                                    data-place="bottom"
                                                    data-background-color="#007bff"
                                                    onClick={this.logoutUser}
                                                >
                                                    <img src="/img/logout.svg" alt="" /> <span>Logout</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-client-txt">
                                            <h4 style={headerStyle}>{landingPageData?.header || "----"}</h4>
                                            <h3 style={clientNameStyle}>{landingPageData?.client_name || "---- ----"}</h3>
                                        </div>
                                        <div className={`bg-dash-img ${landingPageData?.image?.url ? "" : "no-data"} `}>
                                            <img src={landingPageData?.image?.url || "/img/landing-no-image.svg"} alt="bnr-img" />
                                            {!landingPageData?.image?.url && <h3>No Image Uploaded</h3>}
                                        </div>
                                    </div>
                                    <div className="left-side-nav right-end-nav">
                                        <a
                                            href={landingPageData?.logo_url_link}
                                            target="_blank"
                                            data-delay-show="500"
                                            data-tip={`Go To Website`}
                                            data-effect="float"
                                            data-for="landing_page"
                                            data-place="top"
                                            data-background-color="#007bff"
                                        >
                                            <div className={`cbre-logo-sec text-center cursor-hand ${landingPageData?.logo?.url ? "" : "no-logo"} `}>
                                                <img src={landingPageData?.logo?.url || "/img/no-image.svg"} alt="cln-logo" />
                                                {!landingPageData?.logo?.url && <h3>No Logo Uploaded</h3>}
                                            </div>
                                        </a>
                                        <div className="twitter-sec">
                                            {landingPageData?.feed === "Twitter" && landingPageData?.feed_id ? (
                                                <>
                                                    <h3>Twitter Feed</h3>
                                                    <TwitterTimelineEmbed
                                                        onLoad={function noRefCheck() {}}
                                                        screenName={landingPageData?.feed_id}
                                                        sourceType="timeline"
                                                        noHeader={true}
                                                        noFooter={true}
                                                        noBorders={true}
                                                        key={landingPageData?.feed_id}
                                                    />
                                                </>
                                            ) : (
                                                <div className="tweet-no-data">
                                                    {/* <img src="/img/no-tweet.svg" alt="" /> */}
                                                    <h3>No Feeds</h3>
                                                </div>
                                            )}
                                        </div>
                                        <Widget widgetData={widgetData.widget} history={history} />
                                    </div>
                                </div>
                            </div>
                        </LoadingOverlay>
                    </>
                ) : (
                    <Redirect to={{ pathname: "/dashboard" }} />
                )}
            </>
        );
    }
}

const mapStateToProps = state => {
    const { dashboardReducer, loginReducer } = state;
    return { dashboardReducer, loginReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...dashboardActions,
        ...userActions
    })(LandingPage)
);
