import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import Highlighter from "react-highlight-words";
import _ from "lodash";

import ViewAllUsers from "./ViewAllUsers";
import ViewAllClientUsers from "./viewAllClientUsers";
import { addToBreadCrumpData, bulkResetBreadCrumpData, popBreadCrumpData, findPrevNameFromBreadCrumpData } from "../../../config/utils";
// import $ from "jquery";
import { thousandsSeparators } from "../../../config/utils";
import { REPORT_URL } from "../../../config/constants";
import NumberFormat from "react-number-format";
import { LOCK_STATUS } from "../constants";
class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            region: props.region,
            view: "client",
            inputValue: { ...this.props.rowData }
        };
    }

    // componentDidMount = () => {
    // $('[data-toggle="tooltip"]').tooltip();
    // $("[data-toggle=popover]").on("shown.bs.popover", function () {
    //     $(".popover").css("top", parseInt($(".popover").css("top")) + 22 + "px");
    // });
    // ReactTooltip.rebuild();
    // };

    componentDidUpdate = (prevProps, prevState) => {
        // $('[data-toggle="tooltip"]').tooltip();
        // $("[data-toggle=popover]").on("shown.bs.popover", function () {
        //     $(".popover").css("top", parseInt($(".popover").css("top")) + 22 + "px");
        // });
        // console.log("jd,",this.props.rowData)
        if (prevProps?.rowData?.status !== this.props.rowData?.status) {
            ReactTooltip.rebuild();
        }
    };
    energyDecimalFormat = num => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    handleRemoveClient = async () => {
        const { region } = this.state;
        await this.setState({
            region: {
                ...region,
                client_id: ""
            }
        });
        this.props.handleUpdateRegion(this.state.region);
    };

    handleRowClick = async rowData => {
        await this.props.updateSelectedRow(rowData.id);
        const {
            showInfoPage,
            match: {
                params: { section, tab, id, subTab, settingType, subSection, subId },
                path
            },
            location: { search = "" },
            history
        } = this.props;

        let tempSearch = search;
        if (section === "projectinfo") {
            tempSearch = `?pid=${id}`;
        }

        if (section) {
            switch (section) {
                case "regioninfo":
                    if (tab === "recommendations") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        break;
                    } else if (tab === "dashboard") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        break;
                    } else if (tab === "buildings") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        break;
                    } else if (tab === "reports") {
                        if (subTab === "specialReports") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                            });
                        } else if (subTab === "reportParagraphs") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                        } else if (subTab === "childParagraph") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                        }
                        break;
                    } else if (tab === "documents") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.file_name,
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        break;
                    } else if (tab === "Electricity" || tab === "Gas" || tab === "Water" || tab === "Sewer") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.meter_type,
                            path: `/region/regioninfo/${id}/${tab}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/region/regioninfo/${id}/${tab}/basicdetails`
                        });
                        break;
                    } else if (tab === "energyStarRating") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: "Energy Star",
                            path: `/region/regioninfo/${id}/energyStarRating`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/region/regioninfo/${id}/energyStarRating/basicdetails`
                        });
                        break;
                    } else if (tab !== "assets") {
                        // -----------------------------------
                        // addToBreadCrumpData({
                        //     key: "siteName",
                        //     name: rowData.name,
                        //     path: `/site/siteinfo/${rowData.id}/basicdetails${search}`
                        // });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/site/siteinfo/${rowData.id}/basicdetails${search}`
                        });
                        break;
                    }
                    break;
                case "allsent":
                    break;
                case "sent":
                    break;
                case "inbox":
                    break;

                case "siteinfo":
                    if (tab === "recommendations") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        break;
                    } else if (tab === "dashboard") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });

                        break;
                    } else if (tab === "buildings") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        break;
                    } else if (tab === "reports") {
                        if (subTab === "specialReports") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                            });
                        } else if (subTab === "reportParagraphs") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                        } else if (subTab === "childParagraph") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                        }
                        break;
                    } else if (tab === "documents") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.file_name,
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        break;
                    } else if (tab === "Electricity" || tab === "Gas" || tab === "Water" || tab === "Sewer") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.meter_type,
                            path: `/site/siteinfo/${id}/${tab}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/site/siteinfo/${id}/${tab}/basicdetails`
                        });
                        break;
                    } else if (tab === "energyStarRating") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: "Energy Star",
                            path: `/site/siteinfo/${id}/energyStarRating`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/site/siteinfo/${id}/energyStarRating/basicdetails`
                        });
                        break;
                    } else if (section === "allsent" || section === "inbox" || section === "sent") {
                        console.log("hfvhu");
                        addToBreadCrumpData({
                            key: "lll",
                            name: "",
                            path
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/site/siteinfo/${id}/energyStarRating/basicdetails`
                        });
                        break;
                    } else if (tab !== "assets") {
                        // -------------------------
                        addToBreadCrumpData({
                            key: "buildingName",
                            name: rowData.name,
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${search}`
                        });
                        break;
                    }
                    break;
                case "buildinginfo":
                    if (tab === "recommendations") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        break;
                    } else if (tab === "dashboard") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        break;
                    } else if (tab === "buildingAddition") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/buildingAddition/additioninfo/${rowData.id}/basicdetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/buildingAddition/additioninfo/${rowData.id}/basicdetails${search}`
                        });
                        break;
                    } else if (tab === "reports") {
                        if (subTab === "specialReports") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                            });
                        } else if (subTab === "reportParagraphs") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                        } else if (subTab === "childParagraph") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                        }
                        break;
                    } else if (tab === "documents") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.file_name,
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        break;
                    } else if (tab === "Electricity" || tab === "Gas" || tab === "Water" || tab === "Sewer") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.meter_type,
                            path: `/building/buildinginfo/${id}/${tab}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/building/buildinginfo/${id}/${tab}/basicdetails`
                        });
                        break;
                    } else if (tab === "energyStarRating") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: "Energy Star",
                            path: `/building/buildinginfo/${id}/energyStarRating`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/building/buildinginfo/${id}/energyStarRating/basicdetails`
                        });
                        break;
                    } else if (tab !== "assets") {
                        addToBreadCrumpData({
                            key: "floorName",
                            name: rowData.name,
                            path: `/floor/floorinfo/${rowData.id}/basicdetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/floor/floorinfo/${rowData.id}/basicdetails${search}`
                        });
                        break;
                    }
                    break;
                case "projectinfo":
                    if (tab === "settings") {
                        // addToBreadCrumpData({
                        //     key: "info",
                        //     name: subTab,
                        //     path: `/project/projectinfo/${rowData.id}/settings/${settingType}/${subSection}/${subId}/${subTab}`
                        // });
                        break;
                    } else if (tab === "recommendations") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                    } else if (tab === "sites") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/site/siteinfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/site/siteinfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    } else if (tab === "buildings") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    } else if (tab === "regions") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/region/regioninfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/region/regioninfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    } else if (tab === "dashboard") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                    } else if (tab === "reports") {
                        if (settingType === "specialReports") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                            });
                        } else if (settingType === "reportParagraphs") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                        } else if (settingType === "childParagraph") {
                            addToBreadCrumpData({
                                key: "Name",
                                name: rowData.name,
                                path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                            addToBreadCrumpData({
                                key: "info",
                                name: "Basic Details",
                                path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                            });
                        }
                        break;
                    } else if (tab === "documents") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.file_name,
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        break;
                    } else {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/region/regioninfo/${rowData.id}/basicdetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/region/regioninfo/${rowData.id}/basicdetails${search}`
                        });
                    }
                    break;
                case "buildingTypeinfo":
                    addToBreadCrumpData({
                        key: "buildingTypeName",
                        name: rowData.name,
                        path: `/buildingType/buildingTypeinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/buildingType/buildingTypeinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "reportinfo":
                    addToBreadCrumpData({
                        key: "reportName",
                        name: rowData.name,
                        path: `/documents/reportinfo/${rowData.id}/maindetails`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/documents/reportinfo/${rowData.id}/maindetails`
                    });
                    break;
                case "clientinfo":
                    if (tab === "documents") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.file_name,
                            // path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                    } else if (tab === "chartProperties") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/chartProperties/info/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/chartProperties/info/${rowData.id}/basicdetails${tempSearch}`
                        });
                    } else {
                        addToBreadCrumpData({
                            key: "clientName",
                            name: rowData.name,
                            path: `/client/clientinfo/${rowData.id}/basicdetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/client/clientinfo/${rowData.id}/basicdetails${search}`
                        });
                    }
                    break;
                case "userinfo":
                    addToBreadCrumpData({
                        key: "buildingName",
                        name: rowData.name,
                        path: `/building/buildinginfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/user/userinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "consultancyinfo":
                    addToBreadCrumpData({
                        key: "consultancyName",
                        name: rowData.name,
                        path: `/consultancy/consultancyinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/consultancy/consultancyinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "initiativeInfo":
                    if (tab === "recommendations" || tab === "recommendation") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        break;
                    } else if (tab === "documents") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.file_name,
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        break;
                    } else {
                        addToBreadCrumpData({
                            key: "initiativeName",
                            name: rowData.name,
                            path: `/initiatives/initiativeinfo/${rowData.id}/basicdetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/initiatives/initiativeinfo/${rowData.id}/basicdetails${search}`
                        });
                    }

                    break;
                case "imageInfo":
                    if (tab === "recommendations") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                    }
                    break;
                case "assetinfo":
                    if (tab === "recommendations") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                    } else if (tab === "sites") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/site/siteinfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/site/siteinfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    } else if (tab === "buildings") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    } else if (tab === "regions") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/region/regioninfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/region/regioninfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    } else if (tab === "dashboard") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                    }
                    break;
                case "assetInfo":
                    if (tab === "recommendations") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`
                        });
                    }
                    break;
                case "energyinfo":
                    if (tab === "regions") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/region/regioninfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/region/regioninfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    }
                    if (tab === "sites") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/site/siteinfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/site/siteinfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    }
                    if (tab === "buildings") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.name,
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/building/buildinginfo/${rowData.id}/basicdetails${tempSearch}`
                        });
                    }

                    if (tab === "energyStarRating") {
                        // popBreadCrumpData();
                        addToBreadCrumpData({
                            key: "Name",
                            name: "Energy Star",
                            path: `${history.location.pathname}${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `${history.location.pathname}/basicdetails${search}`
                        });
                    }
                    if (tab === "Electricity") {
                        // popBreadCrumpData();

                        addToBreadCrumpData({
                            key: "Name",
                            name: "Electricity Details",
                            path: `${history.location.pathname}${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `${history.location.pathname}/basicdetails${search}`
                        });
                    }
                    if (tab === "Gas") {
                        // popBreadCrumpData();
                        addToBreadCrumpData({
                            key: "Name",
                            name: "Gas Details",
                            path: `${history.location.pathname}${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `${history.location.pathname}/basicdetails${search}`
                        });
                    }
                    if (tab === "Water") {
                        // popBreadCrumpData();
                        addToBreadCrumpData({
                            key: "Name",
                            name: "Water Details",
                            path: `${history.location.pathname}${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `${history.location.pathname}/basicdetails${search}`
                        });
                    }
                    if (tab === "Sewer") {
                        // popBreadCrumpData();
                        addToBreadCrumpData({
                            key: "Name",
                            name: "Sewer Details",
                            path: `${history.location.pathname}${search}`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `${history.location.pathname}/basicdetails${search}`
                        });
                    }
                    break;
                case "recommendationsinfo":
                    if (tab === "documents") {
                        addToBreadCrumpData({
                            key: "Name",
                            name: rowData.file_name,
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: "Basic Details",
                            path: `/documents/reportinfo/${rowData.id}/maindetails`
                        });
                    }
                    break;
                case "subSysteminfo":
                    break;
                default:
                    // addToBreadCrumpData({
                    //     key: "siteName",
                    //     name: rowData.name,
                    //     path: `/site/siteInfo/${rowData.id}/basicdetails${search}`
                    // });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/site/siteInfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
            }
        } else if (path) {
            switch (path) {
                case "/region":
                    addToBreadCrumpData({
                        key: "regionName",
                        name: rowData.name,
                        path: `/region/regioninfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/region/regioninfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/site":
                    // addToBreadCrumpData({
                    //     key: "siteName",
                    //     name: rowData.name,
                    //     path: `/site/siteinfo/${rowData.id}/basicdetails${search}`
                    // });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/site/siteinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/building":
                    addToBreadCrumpData({
                        key: "buildingName",
                        name: rowData.name,
                        path: `/building/buildinginfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/building/buildinginfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/efci":
                    addToBreadCrumpData({
                        key: "projectName",
                        name: rowData.name,
                        path: `/efci/efciinfo/${rowData.id}/basicdetails`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "EFCI Sandbox",
                        path: `/efci/efciinfo/${rowData.id}/basicdetails`
                    });
                    break;
                case "/project":
                    addToBreadCrumpData({
                        key: "buildingName",
                        name: rowData.name,
                        path: `/project/projectinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/project/projectinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/energymanagement":
                    addToBreadCrumpData({
                        key: "energyName",
                        name: rowData.name,
                        path: `/energymanagement/energyinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/energymanagement/energyinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/assetmanagement":
                    addToBreadCrumpData({
                        key: "assetName",
                        name: rowData.name,
                        path: `/assetmanagement/assetinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/assetmanagement/assetinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/meter":
                    addToBreadCrumpData({
                        key: "basicdetails",
                        name: "Basic Details",
                        path: `/meter/metertemplateinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/accounts":
                    addToBreadCrumpData({
                        key: "basicdetails",
                        name: "Basic Details",
                        path: `/accounts/AccountsInfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/reports":
                    addToBreadCrumpData({
                        key: "buildingName",
                        name: rowData.name,
                        path: `/reports/projectinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/reports/projectinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/recommendations":
                    addToBreadCrumpData({
                        key: "recommendationsName",
                        name: rowData.name,
                        path: `/project/projectinfo/${rowData.id}/maindetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Main Details",
                        path: `/project/projectinfo/${rowData.id}/maindetails${search}`
                    });
                    break;
                case "/settings/buildingtype":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/buildingType/buildingTypeinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/buildingType/buildingTypeinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/client":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/client/clientinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/client/clientinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/settings/user":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/user/userinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/user/userinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/consultancy":
                    addToBreadCrumpData({
                        key: "consultancyName",
                        name: rowData.name,
                        path: `/consultancy/consultancyinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/consultancy/consultancyinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/initiatives":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/initiatives/initiativeinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/initiatives/initiativeinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/documents":
                    addToBreadCrumpData({
                        key: "reportName",
                        name: rowData.file_name,
                        path: `/documents/reportinfo/${rowData.id}/maindetails`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/documents/reportinfo/${rowData.id}/maindetails`
                    });
                    break;
                case "/trade":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/trade/tradeinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/trade/tradeinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/system":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/system/systeminfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/system/systeminfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/subsystem":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/subsystem/subSysteminfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/subsystem/subSysteminfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/narrativetemplate":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/narrativetemplate/narrativetemplateinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/narrativetemplate/narrativetemplateinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/tabletemplate":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/tabletemplate/tabletemplateinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/tabletemplate/tabletemplateinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/reportnotetemplate":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/reportnotetemplate/reportnotetemplateinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/reportnotetemplate/reportnotetemplateinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/specialreport":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/specialreport/specialreportinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/reportparagraph":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/reportparagraph/reportparagraphinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/childparagraph":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData.name,
                        path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/childparagraph/childparagraphinfo/${rowData.id}/basicdetails${search}`
                    });
                    break;
                case "/dashboard":
                    let bc = [
                        { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                        {
                            key: "Name",
                            name: rowData.code,
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`,
                            index: 1
                        },
                        {
                            key: "info",
                            name: "Main Details",
                            path: `/recommendations/recommendationsinfo/${rowData.id}/maindetails${search}`,
                            index: 1
                        }
                    ];
                    bulkResetBreadCrumpData(bc);
                    break;
                case "/chartProperties":
                    addToBreadCrumpData({
                        key: "Name",
                        name: rowData?.name,
                        path: `/chartProperties/info/${rowData.id}/basicdetails`
                    });
                    addToBreadCrumpData({
                        key: "info",
                        name: "Basic Details",
                        path: `/chartProperties/info/${rowData.id}/basicdetails`
                    });
                    break;
                default:
                    break;
            }
        }
        showInfoPage(rowData.id, rowData.project_id, rowData);
    };

    hadleEditButtonClick = async rowId => {
        await this.props.updateSelectedRow(rowId);
        await this.props.showEditPage(rowId);
    };
    hadleEditNoteClick = async rowId => {
        await this.props.updateSelectedRow(rowId);
        await this.props.showEditExportPage(rowId);
    };

    handleRestoreButtonClick = async rowId => {
        await this.props.updateSelectedRow(rowId);
        await this.props.showRestoreModal(rowId);
    };

    setSearchKeysArray = () => {
        const { tableParams = {} } = this.props;
        let returnArray = [];
        if (tableParams && tableParams.search) {
            returnArray.push(tableParams.search.toString());
        }
        if (tableParams && tableParams.filters && !_.isEmpty(tableParams.filters)) {
            const filters = Object.keys(tableParams.filters);
            for (const item of filters) {
                if (tableParams.filters[item] && tableParams.filters[item].key && tableParams.filters[item].key.length) {
                    if (tableParams.filters[item].filters[0] === "like") {
                        returnArray = returnArray.concat(tableParams.filters[item].key.toString().split("_").join("").split("%").join("").split("~"));
                    } else if (tableParams.filters[item].key.toString().includes("~")) {
                        returnArray = returnArray.concat(tableParams.filters[item].key.toString().split("~"));
                    } else {
                        returnArray.push(tableParams.filters[item].key.toString());
                    }
                }
            }
        }

        return returnArray;
    };

    filterHighlighter = searchKey => {
        let returnVal = false;
        if (this.props.tableParams && this.props.tableParams.filters) {
            Object.keys(this.props.tableParams.filters).map(fill => {
                if (fill === searchKey && this.props.tableParams?.filters[searchKey].key && this.props.tableParams?.filters[searchKey].key.length) {
                    returnVal = true;
                }
            });
        }
        if (this.props.tableParams && this.props.tableParams.search && this.props.tableParams?.search?.length) {
            returnVal = true;
        }
        return returnVal;
    };

    handleViewUsers = (viewData, id) => {
        this.setState({
            view: viewData
        });
        this.props.updateCurrentViewAllUsers(id);
    };

    findPriorityText = (element, value) => {
        const { priorityElementsData = [] } = this.props;
        if (priorityElementsData.length && element) {
            let currentIndex = parseInt(element[element.length - 1]);
            let currentPriorityElement = priorityElementsData[currentIndex - 1];
            if (currentPriorityElement?.options?.length) {
                let selectedValue = currentPriorityElement.options.find(op => op.id === value);
                return selectedValue?.name || "-";
            }
        }
        return value;
    };

    handleCellValueChange = (value, keyItem) => {
        this.setState({ inputValue: { ...this.state.inputValue, [keyItem]: value } });
    };

    setCellValueChange = (keyItem, rowIndex) => {
        const { inputValue } = this.state;
        const { rowData, handleCellFocus, handleCellValueChange } = this.props;
        handleCellFocus("", "");
        if (!_.isEqual(inputValue[keyItem] && parseInt(inputValue[keyItem]), rowData[keyItem])) {
            handleCellValueChange(this.state.inputValue[keyItem], keyItem, rowIndex);
        }
    };

    render() {
        const integerValues = [
            "cost",
            "project_total",
            "quantity",
            "area",
            "priority",
            "crv",
            "fca_cost",
            "actual_cost",
            "funding",
            "total_sf",
            "recommendations_cost"
        ];

        const priorityElements = [
            "priority_element1",
            "priority_element2",
            "priority_element3",
            "priority_element4",
            "priority_element5",
            "priority_element6",
            "priority_element7",
            "priority_element8"
        ];

        const {
            rowData,
            keys,
            config,
            currentViewAllUsers,
            handleDeleteItem,
            selectedRowId,
            updateSelectedRow,
            hasInfoPage = true,
            hasActionColumn = true,
            isBuildingLocked,
            showRestoreModal,
            isImportHistory = false,
            handleDownloadItem,
            handleDownloadItemImport,
            handleToggleSlider,
            permissions,
            hasEdit = true,
            hasDelete = true,
            hasAssignToTrade = false,
            hasAssignToSystem = false,
            hasAssignToSubSystem = false,
            handleAssignToTrade,
            handleAssignToSystem,
            handleAssignToSubSystem,
            hasExport = false,
            isReportTemplate = false,
            handleSpecialReportActions = false,
            selectedRecomIds = [],
            hasAssignToSpecialReport = null,
            hasAssignToReportParagraph = null,
            hasAssignToChildParagraph = null,
            hasMultiAction = false,
            hasTableImport = false,
            hasTabActive = true,
            rowIndex,
            isInputMode,
            handleCellFocus
        } = this.props;
        let columnCount = 2;
        let searchKeysArray = this.setSearchKeysArray();
        let numberSearchArray = [];
        if (searchKeysArray && searchKeysArray.length) {
            searchKeysArray.map(sa => {
                var x = Number(sa.toLocaleString());
                if (isNaN(x)) {
                    numberSearchArray.push(sa);
                } else {
                    numberSearchArray.push(x.toLocaleString());
                }
            });
        }
        let tempIds = !this.props.isAssignProject
            ? localStorage.getItem("recommendationIds")
                ? JSON.parse(localStorage.getItem("recommendationIds"))
                : []
            : this.props.recomentationIds;
        return (
            <React.Fragment>
                <tr
                    className={`${
                        selectedRowId === rowData.id ? "active " : rowData.deleted ? "dele" : rowData.lock_status === LOCK_STATUS.LOCKED ? "acpt" : ""
                    }`}
                    onClick={() => (isReportTemplate ? null : updateSelectedRow(rowData.id))}
                    onDoubleClick={e => (hasInfoPage && isInputMode?.rowIndex !== rowIndex ? this.handleRowClick(rowData) : null)}
                >
                    {this.props.match.params.section === "initiativeInfo" && this.props.match.params?.tab === "recommendation" ? (
                        <td className="img-sq-box seting-type checkbox-container">
                            <label class="container-checkbox cursor-hand m-0">
                                <input
                                    type="checkbox"
                                    checked={
                                        (tempIds && tempIds.length && tempIds.find(r => r == rowData.id) ? true : false) ||
                                        this.props.selectedAllClicked
                                    }
                                    onChange={e => {
                                        this.props.handleSelect(e, rowData.id);
                                    }}
                                />
                                <span class="checkmark"></span>
                            </label>
                        </td>
                    ) : this.props.match.params.section === "imageInfo" || hasMultiAction ? (
                        <td className="img-sq-box seting-type checkbox-container">
                            <label class="container-checkbox cursor-hand m-0">
                                <input
                                    type="checkbox"
                                    checked={selectedRecomIds.find(item => item === rowData.id) ? true : false}
                                    onChange={e => {
                                        this.props.handleSelectRecom(rowData, e.target.checked);
                                    }}
                                />
                                <span class="checkmark"></span>
                            </label>
                        </td>
                    ) : this.props.isAssignAsset ? (
                        <td className="img-sq-box seting-type checkbox-container">
                            <label class="container-checkbox cursor-hand m-0">
                                <input
                                    type="checkbox"
                                    checked={this.props.selectedAsset?.id === rowData.id}
                                    onChange={e => {
                                        this.props.handleSelectAsset(rowData, e.target.checked);
                                    }}
                                />
                                <span class="checkmark"></span>
                            </label>
                        </td>
                    ) : (
                        <td className="text-center ">
                            {hasInfoPage ? (
                                <img
                                    alt=""
                                    src="/img/sq-box.png"
                                    className="cursor-pointer"
                                    onClick={() => this.handleRowClick(rowData)}
                                    data-tip={`View details`}
                                    data-effect="solid"
                                    data-place="bottom"
                                    data-for={`table-row${rowData.id}`}
                                />
                            ) : (
                                <img alt="" src="/img/sq-box.png" />
                            )}
                        </td>
                    )}

                    {keys.map((keyItem, i) => {
                        return config && config[keyItem] && config[keyItem].isVisible ? (
                            <td
                                key={i}
                                style={{ ...config[keyItem]?.style }}
                                className={`${config[keyItem].class} overflow-txt ${config[keyItem].pinned ? "pinned" : ""}`}
                            >
                                <>
                                    {keyItem === "client" ? (
                                        ((rowData[keyItem] && rowData[keyItem].name ? rowData[keyItem].name : rowData[keyItem]) && (
                                            <>
                                                {(rowData[keyItem].name ? rowData[keyItem].name : rowData[keyItem]).length > 25 ? (
                                                    <span className={`${config[keyItem].class}`}>
                                                        <span className="nme">
                                                            <Highlighter
                                                                className="text-highlighter"
                                                                unhighlightClassName="text-unhighlight"
                                                                searchWords={
                                                                    this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                                }
                                                                textToHighlight={rowData[keyItem].name ? rowData[keyItem].name : rowData[keyItem]}
                                                                data-tip={rowData[keyItem].name}
                                                                data-effect="solid"
                                                                data-place="bottom"
                                                                data-for={`table-row${rowData.id}`}
                                                                data-class="rc-tooltip-custom-class"
                                                            />
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className={`${config[keyItem].class}`}>
                                                        <span className="nme">
                                                            <Highlighter
                                                                className="text-highlighter"
                                                                unhighlightClassName="text-unhighlight"
                                                                searchWords={this.filterHighlighter(config[keyItem].searchKey) ? searchKeysArray : []}
                                                                textToHighlight={rowData[keyItem].name ? rowData[keyItem].name : rowData[keyItem]}
                                                            />
                                                        </span>
                                                    </span>
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "users" ? (
                                        <div className="img-dtl">
                                            {rowData[keyItem] && rowData[keyItem].length ? (
                                                <>
                                                    <div className="img-sec">
                                                        {rowData[keyItem].map((item, i) => (
                                                            <img key={i} alt="" src={`${item.url ? item.url : "/img/user-icon.png"}`} />
                                                        ))}
                                                    </div>
                                                    <div className="icn cursor-pointer" onClick={() => this.handleViewUsers("client", rowData.id)}>
                                                        <i className="fas fa-chevron-down" />
                                                    </div>
                                                </>
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                    ) : keyItem === "client_users" ? (
                                        <div className="img-dtl">
                                            {rowData[keyItem] && rowData[keyItem].length ? (
                                                <>
                                                    <div className="img-sec">
                                                        {rowData[keyItem].map((item, i) => (
                                                            <img key={i} alt="" src={`${item.url ? item.url : "/img/user-icon.png"}`} />
                                                        ))}
                                                    </div>
                                                    <div
                                                        className="icn cursor-pointer"
                                                        onClick={() => this.handleViewUsers("consultancy", rowData.id)}
                                                    >
                                                        <i className="fas fa-chevron-down" />
                                                    </div>
                                                </>
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                    ) : keyItem === "expired" ? (
                                        <div>
                                            {/* {console.log("row",rowData)} */}
                                            <span className="d-flex w-25 p-3" style={{ backgroundColor: `${rowData?.expired}` || "" }}></span>
                                        </div>
                                    ) : keyItem === "next_year" ? (
                                        <div>
                                            <span className="d-flex w-25 p-3" style={{ backgroundColor: `${rowData?.next_year}` || "" }}></span>
                                        </div>
                                    ) : keyItem === "six_to_ten" ? (
                                        <div>
                                            <span className="d-flex w-25 p-3" style={{ backgroundColor: `${rowData?.six_to_ten}` || "" }}></span>
                                        </div>
                                    ) : keyItem === "three_to_five" ? (
                                        <div>
                                            <span className="d-flex w-25 p-3" style={{ backgroundColor: `${rowData?.three_to_five}` || "" }}></span>
                                        </div>
                                    ) : keyItem === "Unknown" ? (
                                        <div>
                                            <span className="d-flex w-25 p-3" style={{ backgroundColor: `${rowData?.Unknown}` || "" }}></span>
                                        </div>
                                    ) : keyItem === "ten_plus" ? (
                                        <div>
                                            <span className="d-flex w-25 p-3" style={{ backgroundColor: `${rowData?.ten_plus}` || "" }}></span>
                                        </div>
                                    ) : keyItem === "two_years" ? (
                                        <div>
                                            <span className="d-flex w-25 p-3" style={{ backgroundColor: `${rowData?.two_years}` || "" }}></span>
                                        </div>
                                    ) : keyItem === "unknown" ? (
                                        <div>
                                            <span className="d-flex w-25 p-3" style={{ backgroundColor: `${rowData?.unknown}` || "" }}></span>
                                        </div>
                                    ) : keyItem === "initiative_type" ? (
                                        rowData[keyItem] && rowData[keyItem].length ? (
                                            <>
                                                {rowData[keyItem].split(",").map((item, i) => (
                                                    <>
                                                        <Highlighter
                                                            className="text-highlighter"
                                                            unhighlightClassName="text-unhighlight"
                                                            searchWords={
                                                                this.filterHighlighter(config[keyItem].searchKey, item) ? searchKeysArray : []
                                                            }
                                                            textToHighlight={item}
                                                        />
                                                        {i < rowData[keyItem].split(",").length - 1 ? `, ` : ""}
                                                    </>
                                                ))}
                                            </>
                                        ) : null
                                    ) : keyItem === "file_name" ? (
                                        (rowData[keyItem] ? (
                                            <>
                                                {rowData[keyItem] && rowData[keyItem].length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem]}
                                                        data-tip={rowData[keyItem]}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem]}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            "-"
                                        )) || "-"
                                    ) : keyItem === "sites" || keyItem === "regions" || keyItem === "projects" || keyItem === "buildings" ? (
                                        <div className="img-dtl">
                                            {rowData[keyItem] && rowData[keyItem].length ? (
                                                <>
                                                    {rowData[keyItem].map((item, i) =>
                                                        item?.length > 20 ? (
                                                            <React.Fragment key={i}>
                                                                <span className="badge-otr">
                                                                    <span className="nme">
                                                                        <Highlighter
                                                                            className="text-highlighter"
                                                                            unhighlightClassName="text-unhighlight"
                                                                            searchWords={
                                                                                this.filterHighlighter(config[keyItem].searchKey, keyItem)
                                                                                    ? searchKeysArray
                                                                                    : []
                                                                            }
                                                                            textToHighlight={item.name}
                                                                            data-tip={item?.name}
                                                                            data-effect="solid"
                                                                            data-place="bottom"
                                                                            data-for={`table-row${i}`}
                                                                            data-class="rc-tooltip-custom-class"
                                                                        />
                                                                    </span>
                                                                </span>
                                                            </React.Fragment>
                                                        ) : (
                                                            <Highlighter
                                                                className="text-highlighter"
                                                                unhighlightClassName="text-unhighlight"
                                                                searchWords={
                                                                    this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                                }
                                                                textToHighlight={item.name}
                                                            />
                                                        )
                                                    )}
                                                </>
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                    ) : keyItem === "region" || keyItem === "building" || keyItem === "site" || keyItem === "role" ? (
                                        (
                                            <>
                                                {typeof rowData[keyItem] === "string" && config[keyItem].type === "string" ? (
                                                    rowData[keyItem] && rowData[keyItem] && rowData[keyItem].length > 18 ? (
                                                        <Highlighter
                                                            className="text-highlighter"
                                                            unhighlightClassName="text-unhighlight"
                                                            searchWords={
                                                                this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                            }
                                                            textToHighlight={rowData[keyItem]}
                                                            data-tip={rowData[keyItem]}
                                                            data-effect="solid"
                                                            data-place="bottom"
                                                            data-for={`table-row${rowData.id}`}
                                                            data-class="rc-tooltip-custom-class"
                                                        />
                                                    ) : (
                                                        <Highlighter
                                                            className="text-highlighter"
                                                            unhighlightClassName="text-unhighlight"
                                                            searchWords={
                                                                this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                            }
                                                            textToHighlight={rowData[keyItem] && rowData[keyItem]}
                                                        />
                                                    )
                                                ) : rowData[keyItem] && rowData[keyItem].name && rowData[keyItem].name.length > 18 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem] && rowData[keyItem].name}
                                                        data-tip={rowData[keyItem].name}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem] && rowData[keyItem].name}
                                                    />
                                                )}
                                            </>
                                        ) || "-"
                                    ) : keyItem === "trade" ||
                                      keyItem === "system" ||
                                      keyItem === "sub_system" ||
                                      keyItem === "floor" ||
                                      keyItem === "addition" ||
                                      keyItem === "asset_status" ||
                                      keyItem === "asset_type" ||
                                      keyItem === "client_asset_condition" ||
                                      keyItem === "uniformat_level_1" ||
                                      keyItem === "uniformat_level_2" ||
                                      keyItem === "uniformat_level_3" ||
                                      keyItem === "uniformat_level_4" ||
                                      keyItem === "uniformat_level_5" ||
                                      keyItem === "uniformat_level_6" ||
                                      keyItem === "main_category" ||
                                      keyItem === "sub_category_1" ||
                                      keyItem === "sub_category_2" ||
                                      keyItem === "sub_category_3" ||
                                      keyItem === "document_type" ||
                                      keyItem === "building_type" ||
                                      keyItem === "criticality" ||
                                      keyItem === "energymanagement_client" ||
                                      keyItem === "assetmanagement_client" ||
                                      keyItem === "chart_properties" ? (
                                        rowData[keyItem] && typeof rowData[keyItem] === "object" ? (
                                            <>
                                                {rowData[keyItem] && rowData[keyItem].name && rowData[keyItem].name.length > 20 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem] && rowData[keyItem].name}
                                                        data-tip={rowData[keyItem].name}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={(rowData[keyItem] && rowData[keyItem].name) || "-"}
                                                    />
                                                )}
                                            </>
                                        ) : rowData[keyItem] ? (
                                            <>
                                                {rowData[keyItem] && rowData[keyItem] && rowData[keyItem].length > 20 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem] && rowData[keyItem]}
                                                        data-tip={rowData[keyItem]}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem] && rowData[keyItem]}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            "-"
                                        )
                                    ) : keyItem === "text" ? (
                                        (
                                            <>
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={rowData[keyItem] && rowData[keyItem]}
                                                    data-tip={rowData[keyItem]}
                                                    data-effect="solid"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                    data-class="rc-tooltip-custom-class"
                                                />
                                            </>
                                        ) || "-"
                                    ) : keyItem === "subcategory2_description" && rowData.sub_category_2?.subcategory2_description ? (
                                        <>
                                            {rowData.sub_category_2 && rowData.sub_category_2?.subcategory2_description?.length > 20 ? (
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={rowData.sub_category_2 && rowData.sub_category_2?.subcategory2_description}
                                                    data-tip={rowData.sub_category_2 && rowData.sub_category_2?.subcategory2_description}
                                                    data-effect="solid"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                    data-class="rc-tooltip-custom-class"
                                                />
                                            ) : (
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={
                                                        (rowData.sub_category_2 && rowData.sub_category_2?.subcategory2_description) || "-"
                                                    }
                                                />
                                            )}
                                        </>
                                    ) : keyItem === "uniformat_level_6_description" && rowData.uniformat_level_6?.uniformat_level_6_description ? (
                                        <>
                                            {rowData?.uniformat_level_6 && rowData.uniformat_level_6?.uniformat_level_6_description?.length > 20 ? (
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={
                                                        rowData.uniformat_level_6 && rowData.uniformat_level_6?.uniformat_level_6_description
                                                    }
                                                    data-tip={rowData.uniformat_level_6 && rowData.uniformat_level_6?.uniformat_level_6_description}
                                                    data-effect="solid"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                    data-class="rc-tooltip-custom-class"
                                                />
                                            ) : (
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={
                                                        (rowData.uniformat_level_6 && rowData.uniformat_level_6?.uniformat_level_6_description) || "-"
                                                    }
                                                />
                                            )}
                                        </>
                                    ) : keyItem === "description" && rowData.client_asset_condition ? (
                                        <>
                                            {(rowData.client_asset_condition && rowData.client_asset_condition?.description?.length) > 20 ? (
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={rowData.client_asset_condition && rowData.client_asset_condition?.description}
                                                    data-tip={rowData.client_asset_condition && rowData.client_asset_condition?.description}
                                                    data-effect="solid"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                    data-class="rc-tooltip-custom-class"
                                                />
                                            ) : (
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={
                                                        (rowData.client_asset_condition && rowData.client_asset_condition?.description) || "-"
                                                    }
                                                />
                                            )}
                                        </>
                                    ) : keyItem === "reportRegion" ? (
                                        (
                                            <>
                                                {rowData.region && rowData.region.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.region}
                                                        data-tip={rowData.region}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.region && rowData.region}
                                                    />
                                                )}
                                            </>
                                        ) || "-"
                                    ) : keyItem === "reportSite" ? (
                                        (
                                            <>
                                                {rowData.site && rowData.site.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.site}
                                                        data-tip={rowData.site}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.site}
                                                    />
                                                )}
                                            </>
                                        ) || "-"
                                    ) : keyItem === "display_name" ? (
                                        (
                                            <>
                                                {rowData.display_name && rowData.display_name.length > 18 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.display_name}
                                                        data-tip={rowData.display_name}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.display_name}
                                                    />
                                                )}
                                            </>
                                        ) || "-"
                                    ) : keyItem === "name" ? (
                                        (
                                            <>
                                                {rowData.name && rowData.name.length > 16 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.name}
                                                        data-tip={rowData.name}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.name}
                                                    />
                                                )}
                                            </>
                                        ) || "-"
                                    ) : keyItem === "reportBuilding" ? (
                                        (
                                            <>
                                                {rowData.building && rowData.building.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData && rowData.building}
                                                        data-tip={rowData.building}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.building}
                                                    />
                                                )}
                                            </>
                                        ) || "-"
                                    ) : keyItem === "group" ? (
                                        (rowData[keyItem] && rowData[keyItem].name && (
                                            <>
                                                {rowData[keyItem] && rowData[keyItem].name && rowData[keyItem].name.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem] && rowData[keyItem].name}
                                                        data-tip={rowData.project}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem] && rowData[keyItem].name}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "recommendatonProject" ? (
                                        (rowData.project && (
                                            <>
                                                {rowData.project && rowData.project.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.project}
                                                        data-tip={rowData.project}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.project}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "notes" ? (
                                        (rowData[keyItem] && (
                                            <>
                                                {/* {rowData[keyItem] && rowData[keyItem].length > 25 ? ( */}
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={rowData["note_html"] || rowData[keyItem]}
                                                    data-tip={rowData["note_html"] || rowData[keyItem]}
                                                    data-effect="solid"
                                                    data-delay-hide="100"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                    data-class="rc-tooltip-custom-class extras"
                                                />
                                                {/* ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem]}
                                                    />
                                                )} */}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "default_project" ? (
                                        (rowData[keyItem] ? (
                                            <>
                                                {rowData[keyItem] && rowData[keyItem].length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem]}
                                                        data-tip={rowData[keyItem]}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem]}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            "-"
                                        )) || "-"
                                    ) : keyItem === "capital_type_display_name" ? (
                                        (rowData[keyItem] ? (
                                            <>
                                                {rowData[keyItem] && rowData[keyItem].length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem]}
                                                        data-tip={rowData[keyItem]}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData[keyItem]}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            "-"
                                        )) || "-"
                                    ) : keyItem === "color_code" ? (
                                        rowData[keyItem] ? (
                                            <>
                                                {rowData.color_code}
                                                <span
                                                    className="color-box-common"
                                                    style={{
                                                        background: rowData.color_code
                                                    }}
                                                ></span>
                                            </>
                                        ) : (
                                            "-"
                                        )
                                    ) : keyItem === "files" ? (
                                        rowData[keyItem].length ? (
                                            <>
                                                <img src="/img/atch.svg" alt="" />
                                            </>
                                        ) : (
                                            "-"
                                        )
                                    ) : integerValues.includes(keyItem) ? (
                                        rowData[keyItem] || rowData[keyItem] === 0 ? (
                                            rowData[keyItem] ? (
                                                <>
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? numberSearchArray : []
                                                        }
                                                        textToHighlight={parseInt(rowData[keyItem]).toLocaleString()}
                                                    />
                                                </>
                                            ) : (
                                                "0"
                                            )
                                        ) : (
                                            "-"
                                        )
                                    ) : keyItem.includes("priority_element") && typeof rowData[keyItem] !== "object" ? (
                                        rowData[keyItem] || rowData[keyItem] === 0 ? (
                                            (rowData[keyItem] || rowData[keyItem] === 0) && this.findPriorityText(keyItem, rowData[keyItem]) ? (
                                                <>
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? numberSearchArray : []
                                                        }
                                                        textToHighlight={this.findPriorityText(keyItem, rowData[keyItem])}
                                                        data-tip={this.findPriorityText(keyItem, rowData[keyItem])}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                </>
                                            ) : (
                                                "0"
                                            )
                                        ) : (
                                            "-"
                                        )
                                    ) : keyItem === "ministry" ? (
                                        (rowData.ministry && (
                                            <>
                                                {rowData.ministry.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.ministry}
                                                        data-tip={rowData.ministry}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.ministry}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "notification_title" ? (
                                        (rowData.data?.title && (
                                            <>
                                                {rowData.data?.title?.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.data.title.substring(0, 25) + "..."}
                                                        data-tip={rowData.data.title}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.data.title}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "notification_body" ? (
                                        (rowData.data?.body && (
                                            <>
                                                {rowData.data?.body?.length > 30 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.data.body.substring(0, 30) + "..."}
                                                        data-tip={rowData.data.body}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.data.body}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "hospital_name_recomentation" ? (
                                        (rowData.building && rowData.building.hospital_name && (
                                            <>
                                                {rowData.building.hospital_name.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.building.hospital_name.substring(0, 25) + "..."}
                                                        data-tip={rowData.building.hospital_name}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.building.hospital_name}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "buildingType" ? (
                                        (rowData.building.building_type && (
                                            <>
                                                {rowData.building.building_type.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.building.building_type.substring(0, 25) + "..."}
                                                        data-tip={rowData.building.building_type}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.building.building_type}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem.includes("energy_band_") &&
                                      rowData[config[keyItem]?.commonSearchKey] &&
                                      rowData[config[keyItem]?.commonSearchKey][config[keyItem].commonSearchObjectKey] ? (
                                        (rowData.energy_band && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={[]}
                                                textToHighlight={rowData[config[keyItem].commonSearchKey][
                                                    config[keyItem].commonSearchObjectKey
                                                ]?.toLocaleString()}
                                                data-tip={rowData[config[keyItem].commonSearchKey][config[keyItem].commonSearchObjectKey]}
                                                data-effect="solid"
                                                data-place="bottom"
                                                data-for={`table-row${rowData.id}`}
                                                data-class="rc-tooltip-custom-class"
                                            />
                                        )) ||
                                        "-"
                                    ) : keyItem.includes("water_band_") &&
                                      rowData[config[keyItem]?.commonSearchKey] &&
                                      rowData[config[keyItem]?.commonSearchKey][config[keyItem].commonSearchObjectKey] ? (
                                        (rowData.energy_band && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={[]}
                                                textToHighlight={rowData[config[keyItem].commonSearchKey][
                                                    config[keyItem].commonSearchObjectKey
                                                ]?.toLocaleString()}
                                                data-tip={rowData[config[keyItem].commonSearchKey][config[keyItem].commonSearchObjectKey]}
                                                data-effect="solid"
                                                data-place="bottom"
                                                data-for={`table-row${rowData.id}`}
                                                data-class="rc-tooltip-custom-class"
                                            />
                                        )) ||
                                        "-"
                                    ) : keyItem === "buildingDescription" ? (
                                        (rowData.building.building_description && (
                                            <>
                                                {rowData.building.building_description.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.building.building_description}
                                                        data-tip={rowData.building.building_description}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.building.building_description}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "systems" ? (
                                        (rowData.system && (
                                            <>
                                                {rowData.system && rowData.system.name && rowData.system.name.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.system.name.substring(0, 25) + "..."}
                                                        data-tip={rowData.system.name}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.system.name}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "trades" ? (
                                        (rowData.trade && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                textToHighlight={rowData.trade.name}
                                            />
                                        )) ||
                                        "-"
                                    ) : keyItem === "mmbtu_usage" ? (
                                        (rowData.mmbtu_usage && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={thousandsSeparators(rowData[keyItem].toFixed(2)).toString()}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "mmbtu_well_head_cost" ? (
                                        (rowData.mmbtu_well_head_cost && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={`$ ${thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}`}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "mmbtu_transport_cost" ? (
                                        (rowData.mmbtu_transport_cost && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={`$ ${thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}`}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "mmbtu_total_gas_cost" ? (
                                        (rowData.mmbtu_total_gas_cost && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={`$ ${thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}`}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "kw_cost" ? (
                                        (rowData.kw_cost && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={`$ ${thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}`}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "cost_per_unit" ? (
                                        (rowData.cost_per_unit && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={`$ ${thousandsSeparators(parseFloat(rowData[keyItem])).toString()}`}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "kw_usage" ? (
                                        (rowData.kw_usage && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "kwh_cost" ? (
                                        (rowData.kwh_cost && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={`$ ${thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}`}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "kwh_usage" ? (
                                        (rowData.kwh_usage && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "ccf_usage" ? (
                                        (rowData.ccf_usage && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "ccf_cost" ? (
                                        (rowData.ccf_cost && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "total_electric_cost" ? (
                                        (rowData.total_electric_cost && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                textToHighlight={`$ ${thousandsSeparators(
                                                    this.energyDecimalFormat(parseFloat(rowData[keyItem]))
                                                ).toString()}`}
                                            />
                                        )) ||
                                        0
                                    ) : keyItem === "import_project" ? (
                                        (rowData && (
                                            <>
                                                {rowData.project && rowData.project.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.project.substring(0, 25) + "..."}
                                                        data-tip={rowData.project}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.project}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "import_site" ? (
                                        (rowData && (
                                            <>
                                                {rowData.site && rowData.site.length > 25 ? (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.site.substring(0, 25) + "..."}
                                                        data-tip={rowData.site}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                        data-class="rc-tooltip-custom-class"
                                                    />
                                                ) : (
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={rowData.site}
                                                    />
                                                )}
                                            </>
                                        )) ||
                                        "-"
                                    ) : keyItem === "project" ? (
                                        (rowData.project
                                            ? (rowData.project.name ? rowData.project.name : rowData.project) && (
                                                  <>
                                                      {(rowData.project.name ? rowData.project.name : rowData.project).length > 25 ? (
                                                          <Highlighter
                                                              className="text-highlighter"
                                                              unhighlightClassName="text-unhighlight"
                                                              searchWords={
                                                                  this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                              }
                                                              textToHighlight={rowData.project.name}
                                                              data-tip={rowData.project.name || rowData.project}
                                                              data-effect="solid"
                                                              data-place="bottom"
                                                              data-for={`table-row${rowData.id}`}
                                                              data-class="rc-tooltip-custom-class"
                                                          />
                                                      ) : (
                                                          <Highlighter
                                                              className="text-highlighter"
                                                              unhighlightClassName="text-unhighlight"
                                                              searchWords={
                                                                  this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                              }
                                                              textToHighlight={rowData.project.name ? rowData.project.name : rowData.project}
                                                          />
                                                      )}
                                                  </>
                                              )
                                            : "-") || "-"
                                    ) : keyItem === "inspection_date" ? (
                                        (rowData && rowData.inspection_date && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                textToHighlight={moment(rowData && rowData.inspection_date).format("MM-DD-YYYY")}
                                            />
                                        )) ||
                                        "-"
                                    ) : keyItem === "assigned_bands" ? (
                                        (rowData && rowData.assigned_bands && (
                                            <Highlighter
                                                className="text-highlighter"
                                                unhighlightClassName="text-unhighlight"
                                                searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                textToHighlight={rowData.assigned_bands.join(", ") || "-"}
                                            />
                                        )) ||
                                        "-"
                                    ) : keyItem === "filter_fields" ? (
                                        (rowData && rowData.filter_fields && rowData.filter_fields.building.length > 25 ? (
                                            <>
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                                    textToHighlight={"BUILDING: " + rowData.filter_fields.building.toString()}
                                                    data-effect="solid"
                                                    data-tip={"<b>Building: </b>" + rowData.filter_fields.building.toString()}
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                    data-class="rc-tooltip-custom-class"
                                                />
                                            </>
                                        ) : (
                                            (rowData && rowData.filter_fields && rowData.filter_fields && (
                                                <>
                                                    <Highlighter
                                                        className="text-highlighter"
                                                        unhighlightClassName="text-unhighlight"
                                                        searchWords={
                                                            this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                        }
                                                        textToHighlight={"BUILDING: " + rowData.filter_fields.building.toString()}
                                                    />
                                                </>
                                            )) ||
                                            "-"
                                        )) || "-"
                                    ) : keyItem === "double_header" || keyItem === "footer" ? (
                                        <Highlighter
                                            className="text-highlighter"
                                            unhighlightClassName="text-unhighlight"
                                            searchWords={this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []}
                                            textToHighlight={rowData[keyItem] ? "Yes" : "No"}
                                        />
                                    ) : config[keyItem].hasInputToggle ? (
                                        <>
                                            {isInputMode?.keyItem === keyItem && isInputMode?.rowIndex === rowIndex ? (
                                                <NumberFormat
                                                    value={this.state.inputValue[keyItem]}
                                                    className="custom-input form-control"
                                                    thousandSeparator={true}
                                                    onValueChange={values => {
                                                        const { value, sourceInfo } = values;
                                                        if (sourceInfo?.source !== "prop") {
                                                            this.handleCellValueChange(value, keyItem);
                                                        }
                                                    }}
                                                    onKeyPress={e => e.key === "Enter" && this.setCellValueChange(keyItem, rowIndex)}
                                                    onBlur={() => this.setCellValueChange(keyItem, rowIndex)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Escape" || e.keyCode === 27) {
                                                            this.handleCellValueChange(rowData[keyItem], keyItem);
                                                            handleCellFocus("", "");
                                                        }
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={this.filterHighlighter(config[keyItem]?.searchKey, keyItem) ? numberSearchArray : []}
                                                    textToHighlight={rowData[keyItem] ? rowData[keyItem]?.toLocaleString() : "0"}
                                                    onClick={() => handleCellFocus(keyItem, rowIndex)}
                                                />
                                            )}
                                        </>
                                    ) : rowData[keyItem] ? (
                                        <>
                                            {typeof rowData[keyItem] === "string" ? (
                                                <>
                                                    {rowData[keyItem].length > 7 ? (
                                                        <Highlighter
                                                            className="text-highlighter"
                                                            unhighlightClassName="text-unhighlight"
                                                            searchWords={
                                                                this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                            }
                                                            textToHighlight={rowData[keyItem]}
                                                            data-tip={rowData[keyItem]}
                                                            data-effect="solid"
                                                            data-place="bottom"
                                                            data-for={`table-row${rowData.id}`}
                                                            data-class="rc-tooltip-custom-class"
                                                        />
                                                    ) : (
                                                        <Highlighter
                                                            className="text-highlighter"
                                                            unhighlightClassName="text-unhighlight"
                                                            searchWords={
                                                                this.filterHighlighter(config[keyItem].searchKey, keyItem) ? searchKeysArray : []
                                                            }
                                                            textToHighlight={rowData[keyItem]}
                                                        />
                                                    )}
                                                </>
                                            ) : typeof rowData[keyItem] === "number" && config[keyItem].type === "number" ? (
                                                rowData[keyItem] ? (
                                                    <>
                                                        <Highlighter
                                                            className="text-highlighter"
                                                            unhighlightClassName="text-unhighlight"
                                                            searchWords={
                                                                this.filterHighlighter(config[keyItem]?.searchKey, keyItem)
                                                                    ? keyItem === "installed_year" || keyItem === "year_manufactured"
                                                                        ? numberSearchArray.map(arr => arr.replace(",", ""))
                                                                        : numberSearchArray
                                                                    : []
                                                            }
                                                            textToHighlight={
                                                                keyItem === "installed_year" || keyItem === "year_manufactured"
                                                                    ? rowData[keyItem].toString()
                                                                    : rowData[keyItem].toLocaleString()
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    "-"
                                                )
                                            ) : (
                                                <Highlighter
                                                    className="text-highlighter"
                                                    unhighlightClassName="text-unhighlight"
                                                    searchWords={
                                                        this.filterHighlighter(config[keyItem]?.searchKey, keyItem)
                                                            ? keyItem === "year"
                                                                ? numberSearchArray.map(arr => arr.replace(",", ""))
                                                                : numberSearchArray
                                                            : []
                                                    }
                                                    textToHighlight={rowData[keyItem].toString()}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {typeof rowData[keyItem] === "string" || rowData[keyItem] === null
                                                ? "-"
                                                : config[keyItem].type === "number"
                                                ? 0
                                                : "-"}
                                        </>
                                    )}
                                </>
                            </td>
                        ) : null;
                    })}
                    {hasActionColumn && !isBuildingLocked ? (
                        <td className="bg-white ">
                            {isImportHistory ? (
                                <li className="dropdown dot-icn-arw">
                                    <span
                                        onClick={() => handleDownloadItem(rowData.log_url, rowData.name, "logView")}
                                        data-tip="View Log"
                                        data-effect="solid"
                                        data-place="bottom"
                                        data-for={`table-row${rowData.id}`}
                                    >
                                        <i className="far fa-eye" />
                                    </span>
                                    <span
                                        onClick={() => handleDownloadItem(rowData.log_url, rowData.log_name, "logDownload")}
                                        data-tip="Download Log"
                                        data-effect="solid"
                                        data-place="bottom"
                                        data-for={`table-row${rowData.id}`}
                                    >
                                        <i className="fas fa-file-download" />
                                    </span>
                                    <span
                                        onClick={() => handleDownloadItem(rowData.url, rowData.name)}
                                        data-tip="Download Excel File"
                                        data-effect="solid"
                                        data-place="bottom"
                                        data-for={`table-row${rowData.id}`}
                                    >
                                        <i className="fas fa-file-download" />
                                    </span>
                                    <span
                                        onClick={() => handleDeleteItem(rowData.id)}
                                        data-tip="Delete"
                                        data-effect="solid"
                                        data-place="bottom"
                                        data-for={`table-row${rowData.id}`}
                                    >
                                        <i className="far fa-trash-alt" />
                                    </span>
                                </li>
                            ) : hasTableImport ? (
                                <li className="dropdown dot-icn-arw">
                                    <span
                                        onClick={() => {
                                            this.hadleEditNoteClick(rowData);
                                        }}
                                    >
                                        <i
                                            className="fas fa-pencil-alt f-14"
                                            data-tip={`Edit`}
                                            data-effect="solid"
                                            data-place="bottom"
                                            data-for={`table-row${rowData.id}`}
                                        />
                                    </span>
                                    {rowData.status === "completed" && (
                                        <span
                                            onClick={() => handleDownloadItemImport(rowData.doc_url, rowData.doc_name, "wordDownload")}
                                            data-tip="Download Word"
                                            data-effect="solid"
                                            data-place="bottom"
                                            data-for={`table-row${rowData.id}`}
                                        >
                                            <i className="fas fa-file-download" />
                                        </span>
                                    )}
                                </li>
                            ) : isReportTemplate ? (
                                <>
                                    <li className="dropdown dot-icn-arw">
                                        {rowData.deleted ? (
                                            <span
                                                onClick={() => {
                                                    showRestoreModal(rowData.id);
                                                }}
                                            >
                                                <i
                                                    className="fas fa-undo"
                                                    data-tip={`Restore`}
                                                    data-effect="solid"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                />
                                            </span>
                                        ) : (
                                            hasEdit && (
                                                <>
                                                    {hasTabActive ? (
                                                        <>
                                                            <label
                                                                className="switch toggle-switch mr-2"
                                                                data-tip={!rowData.active ? "Set As Regular (Single) Chart Active" : ""}
                                                                data-effect="solid"
                                                                data-place="bottom"
                                                                data-for={`table-row${rowData.id}`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={rowData.active}
                                                                    onChange={() =>
                                                                        handleToggleSlider({ id: rowData.id, active: !rowData.active }, true)
                                                                    }
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                            <label
                                                                className="switch sm-toggle toggle-switch mr-2"
                                                                data-tip={!rowData.sm_active ? "Set As Smart Chart Active" : ""}
                                                                data-effect="solid"
                                                                data-place="bottom"
                                                                data-for={`table-row${rowData.id}`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={rowData.sm_active}
                                                                    onChange={() =>
                                                                        handleToggleSlider({ id: rowData.id, sm_active: !rowData.sm_active }, true)
                                                                    }
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </>
                                                    ) : null}
                                                    <span
                                                        onClick={() => {
                                                            this.hadleEditButtonClick(rowData);
                                                        }}
                                                    >
                                                        <i
                                                            className="fas fa-pencil-alt f-14"
                                                            data-tip={`Edit`}
                                                            data-effect="solid"
                                                            data-place="bottom"
                                                            data-for={`table-row${rowData.id}`}
                                                        />
                                                    </span>
                                                </>
                                            )
                                        )}
                                        {hasExport && (
                                            <span
                                                onClick={() =>
                                                    handleDownloadItem(
                                                        rowData.doc_url ? rowData.doc_url : REPORT_URL + (rowData.template_file || rowData.file)
                                                    )
                                                }
                                                data-tip="Download"
                                                data-effect="solid"
                                                data-place="bottom"
                                                data-for={`table-row${rowData.id}`}
                                            >
                                                <i className="fas fa-file-download f-17" />
                                            </span>
                                        )}
                                        {!rowData.deleted && hasDelete && (
                                            <span
                                                onClick={() =>
                                                    !rowData.active && !rowData.sm_active && handleDeleteItem(rowData.id, rowData.deleted || false)
                                                }
                                            >
                                                <i
                                                    className={`far fa-trash-alt f-14 ml-1 ${
                                                        rowData.active || rowData.sm_active ? "cursor-diabled" : ""
                                                    }`}
                                                    data-tip={rowData.active || rowData.sm_active ? "" : `Delete`}
                                                    data-effect="solid"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                />
                                            </span>
                                        )}
                                    </li>
                                </>
                            ) : (
                                <li className="dropdown dot-icn-arw">
                                    {rowData.lock_status === LOCK_STATUS.LOCKED ? (
                                        <div class="locking-center locked td-lock">
                                            <img
                                                src="/img/lock-whi.svg"
                                                alt=""
                                                class="export"
                                                data-tip={`Locked`}
                                                data-effect="solid"
                                                data-place="bottom"
                                                data-for={`table-row${rowData.id}`}
                                            />
                                        </div>
                                    ) : rowData.deleted ? (
                                        permissions && permissions.restore == false ? (
                                            ""
                                        ) : (
                                            <span
                                                onClick={() => {
                                                    showRestoreModal(rowData.id);
                                                }}
                                            >
                                                <i
                                                    className="fas fa-undo"
                                                    data-tip={`Restore`}
                                                    data-effect="solid"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                />
                                            </span>
                                        )
                                    ) : (
                                        <>
                                            {(hasMultiAction && hasInfoPage) || this.props.isBudgetPriority || this.props.hasViewIcon ? (
                                                <span
                                                    onClick={() => this.handleRowClick(rowData)}
                                                    data-tip="View Details"
                                                    data-effect="solid"
                                                    data-place="bottom"
                                                    data-for={`table-row${rowData.id}`}
                                                >
                                                    <i className="far fa-eye" />
                                                </span>
                                            ) : null}
                                            {hasEdit ? (
                                                <span
                                                    onClick={() => {
                                                        this.hadleEditButtonClick(rowData.id);
                                                    }}
                                                >
                                                    <i
                                                        className="fas fa-pencil-alt"
                                                        data-tip={`Edit`}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                    />
                                                </span>
                                            ) : null}
                                            {hasAssignToTrade ? (
                                                <span
                                                    onClick={async () => {
                                                        await this.props.updateSelectedRow(rowData.id);
                                                        handleAssignToTrade(rowData);
                                                    }}
                                                >
                                                    <i class="fa fa-list-alt" title={`Assign to Trade`}></i>
                                                </span>
                                            ) : null}
                                            {hasAssignToSystem ? (
                                                <span
                                                    onClick={async () => {
                                                        await this.props.updateSelectedRow(rowData.id);
                                                        handleAssignToSystem(rowData);
                                                    }}
                                                >
                                                    <i class="fa fa-th-list" title={`Assign to System`}></i>
                                                </span>
                                            ) : null}
                                            {hasAssignToSubSystem ? (
                                                <span
                                                    onClick={async () => {
                                                        await this.props.updateSelectedRow(rowData.id);
                                                        handleAssignToSubSystem(rowData);
                                                    }}
                                                >
                                                    <i class="fa fa-list" title={`Assign to Sub System`}></i>
                                                </span>
                                            ) : null}
                                            {hasAssignToSpecialReport ? (
                                                <span
                                                    onClick={async () => {
                                                        await this.props.updateSelectedRow(rowData.id);
                                                        hasAssignToSpecialReport(rowData);
                                                    }}
                                                >
                                                    <i class="fa fa-server" title={`Assign to Special Report`}></i>
                                                </span>
                                            ) : null}
                                            {hasAssignToReportParagraph ? (
                                                <span
                                                    onClick={async () => {
                                                        await this.props.updateSelectedRow(rowData.id);
                                                        hasAssignToReportParagraph(rowData);
                                                    }}
                                                >
                                                    <i class="fa fa-bars" title={`Assign to Report Paragraph`}></i>
                                                </span>
                                            ) : null}
                                            {hasAssignToChildParagraph ? (
                                                <span
                                                    onClick={async () => {
                                                        await this.props.updateSelectedRow(rowData.id);
                                                        hasAssignToChildParagraph(rowData);
                                                    }}
                                                >
                                                    <i class="fa fa-tasks" title={`Assign to Child Paragraph`}></i>
                                                </span>
                                            ) : null}

                                            {handleSpecialReportActions ? (
                                                <>
                                                    <label
                                                        className="switch toggle-switch mr-2"
                                                        data-tip={rowData.project ? "Remove from projects" : "Add to projects"}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={rowData.project}
                                                            onChange={() => handleSpecialReportActions(rowData.id, { project: !rowData.project })}
                                                        />
                                                        <span className="slider round"></span>
                                                    </label>
                                                    <label
                                                        className="switch toggle-switch mr-2"
                                                        data-tip={rowData.region ? "Remove from regions" : "Add to regions"}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={rowData.region}
                                                            onChange={() => handleSpecialReportActions(rowData.id, { region: !rowData.region })}
                                                        />
                                                        <span className="slider round"></span>
                                                    </label>
                                                    <label
                                                        className="switch toggle-switch mr-2"
                                                        data-tip={rowData.site ? "Remove from sites" : "Add to sites"}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={rowData.site}
                                                            onChange={() => handleSpecialReportActions(rowData.id, { site: !rowData.site })}
                                                        />
                                                        <span className="slider round"></span>
                                                    </label>
                                                    <label
                                                        className="switch toggle-switch mr-2"
                                                        data-tip={rowData.building ? "Remove from buildings" : "Add to buildings"}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`table-row${rowData.id}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={rowData.building}
                                                            onChange={() => handleSpecialReportActions(rowData.id, { building: !rowData.building })}
                                                        />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </>
                                            ) : null}
                                        </>
                                    )}
                                    {rowData.lock_status === LOCK_STATUS.LOCKED
                                        ? null
                                        : hasDelete && (
                                              <span onClick={() => handleDeleteItem(rowData.id, rowData.deleted || false)}>
                                                  <i
                                                      className="far fa-trash-alt"
                                                      data-tip={`Delete`}
                                                      data-effect="solid"
                                                      data-place="bottom"
                                                      data-for={`table-row${rowData.id}`}
                                                  />
                                              </span>
                                          )}
                                </li>
                            )}
                        </td>
                    ) : null}
                </tr>
                {this.state.view === "client" && config && config.users && config.users.isVisible && currentViewAllUsers === rowData.id ? (
                    <>
                        {keys.map(keyItem => {
                            if (config[keyItem] && config[keyItem].isVisible) {
                                columnCount += 1;
                            }
                        })}
                        <ViewAllUsers
                            users={rowData.users}
                            isViewClient={true}
                            colSpan={columnCount}
                            searchKeysArray={searchKeysArray}
                            client_users={rowData.client_users}
                        />
                    </>
                ) : null}
                {this.state.view === "consultancy" &&
                config &&
                config.client_users &&
                config.client_users.isVisible &&
                currentViewAllUsers === rowData.id ? (
                    <>
                        {keys.map(keyItem => {
                            if (config[keyItem] && config[keyItem].isVisible) {
                                columnCount += 1;
                            }
                        })}
                        <ViewAllClientUsers
                            colSpan={columnCount}
                            isViewClient={false}
                            searchKeysArray={searchKeysArray}
                            client_users={rowData.client_users}
                        />
                    </>
                ) : null}
                {/* <ReactTooltip
                    id={`table-row${rowData.id}`}
                    html={true}
                    multiline={true}
                    getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                    backgroundColor="#007bff"
                /> */}
                <ReactTooltip
                    id={`table-row${rowData.id}`}
                    html={true}
                    multiline={true}
                    getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                    backgroundColor="#007bff"
                    // delayHide={100}
                    // globalEventOff='click'
                    // class="extras"
                />
            </React.Fragment>
        );
    }
}

export default withRouter(Row);
