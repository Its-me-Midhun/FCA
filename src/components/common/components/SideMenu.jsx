/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import history from "../../../config/history";

import CommonActions from "../actions";
import siteActions from "../../site/actions";
import regionActions from "../../region/actions";
import dashboardAction from "../../dashboard/actions";

import buildingActions from "../../building/actions";
import recommentationActions from "../../recommendations/actions";
import Footer from "./footer";

import SideNav from "../../common/components/SideNav/SideNav";
import SidePanel from "../../dashboard/components/sidePanel";
import { resetBreadCrumpData, bulkResetBreadCrumpData, checkPermission } from "../../../config/utils";
import ConfirmationModal from "./ConfirmationModal";
import Portal from "./Portal";
import { AssetSettingsEntities } from "../../assetSettings/config";
import { DocumentSettingsEntities } from "../../documentSettings/config";
import ReactTooltip from "react-tooltip";
import { APP_MODE } from "../../../config/constants";
import trainingAppLogo from "../../../assets/img/logo-trainer.svg";
import { permissions } from "../../../config/permissions";
import dashboardProjecIcon from "../../../assets/img/proj-icon.svg";
import { TradeSettingsEntities } from "../../tradeSettings/config";

class SideMenu extends React.Component {
    state = {
        menuData: [],
        collapseAll: false,
        sidePanelValues: [],
        totalCsp: 0,
        isDashboardClick: false,
        redirection: false,
        activeSection: "",
        activeBuildingType: "",
        selectedRegion: null,
        paginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        params: {
            limit: 40,
            offset: 0,
            search: "",
            project_id: null,
            filters: null,
            list: null,
            deleted: null,
            locked: null,
            unlocked: null,
            active: true
        },
        wildCardFilterParams: {},
        filterParams: {},
        selectedRowId: null,
        selectedDropdown: "",
        filterValues: this.props.dashboardReducer.filterContents || {},
        dashboardFilterParams: this.props.dashboardReducer.filterValues,
        dashboardExtraFilters: this.props.dashboardReducer.dashboardExtraFilters,
        historyParams: this.props.regionReducer.entityParams.historyParams,
        showFormDirtyConfirmation: false,
        selectedNavItem: {},
        showGotoLandingConfirmModal: false
    };

    componentDidMount = async () => {
        this.setMenuData();
        if (this.props.match.path === "/dashboard") {
            this.setState({
                redirection: true
            });
        } else {
            await this.getSidePanelValues();
        }
        var element = document.getElementById("sidebar");
        element &&
            element.addEventListener("mouseover", e => {
                var navBrand = document.getElementById("navBrand");
                if (navBrand && !navBrand.contains(e.target)) {
                    element.classList.add("nav-hover");
                }
            });
        element &&
            element.addEventListener("mouseleave", e => {
                element.classList.remove("nav-hover");
            });
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.dashboardReducer.getDashboard !== this.props.dashboardReducer.getDashboard) {
            if (this.props.dashboardReducer.getDashboard) {
                let graphData = this.props.dashboardReducer.getDashboard["chart"];
                if (this.props.match.path === "/dashboard") {
                    this.setState({
                        isDashboardClick: true
                    });
                }
                let labelValues = graphData && graphData.length ? graphData.map(gd => gd.data) : [];
                let mergedArray = [].concat.apply([], labelValues);
                let totalCsp = mergedArray.reduce((total, obj) => obj.amount + total, 0);
                this.setState({
                    sidePanelValues: this.props.dashboardReducer.getDashboard["side_panel"],
                    totalCsp
                });
            }
        }

        // if(prevState.isDashboardClick!=this.state.isDashboardClick){
        //     if (this.props.match.path == '/dashboard') {
        //         this.setState({
        //             isDashboardClick: true
        //         })
        //     }
        // }

        if (prevProps.dashboardReducer.filterContents !== this.props.dashboardReducer.filterContents) {
            if (this.props.dashboardReducer.filterContents && !this.props.dashboardReducer.filterContents.length) {
                this.setState({
                    activeBuildingType: ""
                });
            }
            this.setState({
                filterValues: this.props.dashboardReducer.filterContents || [],
                dashboardFilterParams: this.props.dashboardReducer.filterValues || []
            });
        }
        if (prevProps.dashboardReducer.filterValues !== this.props.dashboardReducer.filterValues) {
            this.setState({
                filterValues: this.props.dashboardReducer.filterContents || [],
                dashboardFilterParams: this.props.dashboardReducer.filterValues || []
            });
        }
        if (prevProps.match.path !== this.props.match.path) {
            if (this.props.match.path === "/dashboard") {
                this.setState({
                    activeSection: "",
                    // activeBuildingType: '',
                    redirection: true
                });
            }
        }
        if (this.props.match.path === "/dashboard" && prevProps.location.key !== this.props.location.key) {
            this.collapseAllItem();
        }
    };

    getSidePanelValues = async () => {
        let dashboardFilterParams = {
            chart_type: this.props.dashboardReducer.filterValues.chart_type || "categories",
            fci_type: this.props.dashboardReducer.filterValues.fci_type || "regions",
            display: this.props.dashboardReducer.filterValues.display || "region",
            horizontal_chart_type: this.props.dashboardReducer.filterValues.horizontal_chart_type || "categories",
            map_type: this.props.dashboardReducer.filterValues.map_type || "site",
            map_mode: this.props.dashboardReducer.filterValues.map_mode || "silver",
            chart_sort_by: this.props.dashboardReducer.filterValues.chart_sort_by || "value",
            chart_sort_order: this.props.dashboardReducer.filterValues.chart_sort_order || null,
            fci_sort_by: this.props.dashboardReducer.filterValues.fci_sort_by || "value",
            fci_sort_order: this.props.dashboardReducer.filterValues.fci_sort_order || null
        };
        await this.props.getDashboard(dashboardFilterParams);
    };

    // closeNav = () => {
    //     var element = document.getElementById("sidebar");
    //     var element1 = document.getElementById("main");
    //     this.props.handleShowNa();
    //     if(this.props.match.path == '/dashboard'){
    //         this.setState({
    //             isDashboardClick:!this.state.isDashboardClick
    //         })
    //     }
    //     element.style.width = "30px";
    //     element1.style.marginLeft = "30px";
    //     element.classList.add("expandnavbar");
    //     element1.classList.add("expandnavbarr");
    //     element1.classList.remove("margin-nav");
    // };

    // showNav = () => {
    //     var element = document.getElementById("sidebar");
    //     var element1 = document.getElementById("main");
    //     this.props.handleShowNa();
    //     element.style.width = "300px";
    //     element1.style.marginLeft = "300px";
    //     element.classList.remove("expandnavbar");
    //     element1.classList.remove("expandnavbarr");
    //     element1.classList.add("margin-nav");
    // };

    setMenuData = () => {
        const {
            commonReducer: { getMenuItemsResponse }
        } = this.props;
        const assetClient = (localStorage.getItem("asset_management_client") && JSON.parse(localStorage.getItem("asset_management_client"))) || {};
        const energyClient = (localStorage.getItem("energy_management_client") && JSON.parse(localStorage.getItem("energy_management_client"))) || {};
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
            : [{ key: "main", name: "Asset Management", path: "/assetmanagement" }];

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
            : [{ key: "main", name: "Energy Management", path: "/energyManagement" }];

        let tempMenuData = [
            {
                key: "dashboard",
                label: "FCA Dashboard ",
                url: "Dashboard",
                nodes: [],
                view: checkPermission("menu", "dashboard", null),
                bc: [{ key: "main", name: "Dashboard", path: "/Dashboard" }]
            },
            {
                key: "projects",
                name: "projects",
                label: "FCA Projects",
                url: "Project",
                view: checkPermission("menu", "fca_projects", null),
                bc: [{ key: "main", name: "FCA Projects", path: "/project" }],
                nodes: getMenuItemsResponse && getMenuItemsResponse.projects ? getMenuItemsResponse.projects : [],
                view_info: checkPermission("forms", "fca_projects", "view")
            },
            {
                key: "smartCharts",
                label: "Smart Charts",
                url: "smartcharts/reports",
                // name: "smartCharts",
                view: checkPermission("menu", permissions.SMART_CHARTS, null),
                bc: [
                    { key: "main", name: "Smart Charts", path: "/smartcharts/reports" },
                    {
                        key: "reports",
                        name: "Reports",
                        path: "/smartcharts/reports"
                    }
                ],
                nodes: [],
                view_info: checkPermission("forms", permissions.SMART_CHARTS, "view")
            },
            {
                key: "efci",
                label: "EFCI Benchmarking",
                url: "Efci",
                name: "efcis",
                view: checkPermission("menu", "efci_benchmarking", null),
                bc: [{ key: "main", name: "EFCI", path: "/efci" }],
                nodes: getMenuItemsResponse && getMenuItemsResponse.efcis ? getMenuItemsResponse.efcis : [],
                view_info: checkPermission("forms", "fca_projects", "view")
            },
            {
                key: "energyManagement",
                label: "Energy Management",
                url: energyClient?.id ? `energymanagement/energyinfo/${energyClient.id}/energydashboard` : "energyManagement",
                view: checkPermission("menu", "energy_management", null),
                bc: energyManagementBC,
                view_info: checkPermission("forms", "meter_readings", "view")
            },
            {
                key: "assetmanagement",
                label: "Asset Management",
                url: assetClient?.id ? `assetmanagement/assetinfo/${assetClient.id}/assetcharts` : "assetmanagement",
                view: checkPermission("menu", "asset_management", null),
                bc: assetManagementBC,
                view_info: checkPermission("forms", "asset_management", "view")
            },
            {
                key: "images",
                label: "Image Management",
                url: "images",
                view: checkPermission("menu", "image_management", null),
                bc: [{ key: "main", name: "Image Management", path: "/images" }],
                view_info: checkPermission("forms", "image_management", "view")
            },
            {
                key: "initiatives",
                label: "Project Initiatives",
                url: "Initiatives",
                view: checkPermission("menu", "initiatives", null),
                bc: [{ key: "main", name: "Project Initiatives", path: "/Initiatives" }],
                // nodes: getMenuItemsResponse && getMenuItemsResponse.initiatives ? getMenuItemsResponse.initiatives : [],
                view_info: checkPermission("forms", "initiatives", "view")
            },
            {
                key: "documents",
                label: "Document Managament",
                url: "documents",
                view: checkPermission("menu", "documents", null),
                bc: [{ key: "main", name: "Document Management", path: "/documents" }],
                // nodes: getMenuItemsResponse && getMenuItemsResponse.document ? getMenuItemsResponse.document : [],
                view_info: checkPermission("forms", "documents", "view")
            },
            {
                key: "reports",
                label: "FCA Reports",
                url: "reports",
                name: "reports",
                view: checkPermission("menu", "fca_reports", null),
                bc: [{ key: "main", name: "FCA Reports", path: "/reports" }],
                nodes: getMenuItemsResponse && getMenuItemsResponse.reports ? getMenuItemsResponse.reports : [],
                view_info: checkPermission("forms", "fca_projects", "view")
            },
            {
                key: "energyManagementSettings",
                label: "Energy Settings",
                url: null,
                view: checkPermission("menu", "energy_management_settings", null),
                bc: [{ key: "main", name: "Energy Mangement", path: "/accounts" }],
                nodes: [
                    {
                        key: "accounts",
                        label: "Accounts",
                        url: "accounts",
                        view: checkPermission("menu", "energy_management_settings", "accounts"),
                        bc: [
                            { key: "main", name: "Energy Management", path: "/accounts" },
                            {
                                key: "accounts",
                                name: "Accounts",
                                path: "/accounts"
                            }
                        ],
                        view_info: checkPermission("forms", "accounts", "view")
                    },
                    {
                        key: "meter",
                        label: "Meter",
                        url: "meter",
                        view: checkPermission("menu", "energy_management_settings", "meter"),
                        bc: [
                            { key: "main", name: "Energy Management Settings", path: "/meter" },
                            {
                                key: "meter",
                                name: "Meter",
                                path: "/meter"
                            }
                        ],
                        view_info: checkPermission("forms", "meters", "view")
                    }
                ]
            },

            {
                key: "assetSettings",
                label: "Asset Settings",
                url: null,
                view: checkPermission("menu", "asset_settings", null),
                bc: [{ key: "main", name: "Asset Settings", path: null }],
                nodes: Object.keys(AssetSettingsEntities).map((key, index) => ({
                    key: key,
                    label: AssetSettingsEntities[key].name,
                    url: `asset-settings/${key}`,
                    view: checkPermission("menu", "asset_settings", AssetSettingsEntities[key].permissionKey),
                    bc: [
                        { key: "main", name: "Asset Settings", path: `/asset-settings/${key}` },
                        {
                            key: key,
                            name: AssetSettingsEntities[key].name,
                            path: `/asset-settings/${key}`
                        }
                    ],
                    view_info: checkPermission("forms", AssetSettingsEntities[key].permissionKey, "view")
                }))
            },
            {
                key: "tradeSetting",
                label: "Trade Settings",
                url: null,
                view: true,
                bc: [{ key: "main", name: "Trade Settings", path: null }],
                nodes: Object.keys(TradeSettingsEntities).map((key, index) => ({
                    key: key,
                    label: TradeSettingsEntities[key].name,
                    url: `tradeSettings/view`,
                    view: true,
                    bc: [
                        { key: "main", name: "Trade Settings", path: `/tradeSettings/view` },
                        {
                            key: key,
                            name: TradeSettingsEntities[key].name,
                            path: `/tradeSettings/view`
                        }
                    ],
                    view_info: true
                }))
            },
            {
                key: "documentSetting",
                label: "Document Settings",
                url: null,
                view: checkPermission("menu", "document_settings", null),
                bc: [{ key: "main", name: "Document Settings", path: null }],
                nodes: Object.keys(DocumentSettingsEntities).map((key, index) => ({
                    key: key,
                    label: DocumentSettingsEntities[key].name,
                    url: `document-settings/${key}`,
                    view: checkPermission("menu", "document_settings", DocumentSettingsEntities[key].permissionKey),
                    bc: [
                        { key: "main", name: "Document Settings", path: `/document-settings/${key}` },
                        {
                            key: key,
                            name: DocumentSettingsEntities[key].name,
                            path: `/document-settings/${key}`
                        }
                    ],
                    view_info: checkPermission("forms", DocumentSettingsEntities[key].permissionKey, "view")
                }))
            },
            {
                key: "reportsettings",
                label: "Report Settings",
                url: null,
                view: checkPermission("menu", "report_settings", null),
                bc: [{ key: "main", name: "Report Settings", path: "/trade" }],
                nodes: [
                    {
                        key: "trade",
                        label: "Trade",
                        url: "trade",
                        view: checkPermission("menu", "report_settings", "trade"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/trade" },
                            {
                                key: "trade",
                                name: "Trade",
                                path: "/trade"
                            }
                        ],
                        view_info: checkPermission("forms", "master_trades", "view")
                    },
                    {
                        key: "system",
                        label: "System",
                        url: "system",
                        view: checkPermission("menu", "report_settings", "system"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/system" },
                            {
                                key: "system",
                                name: "System",
                                path: "/system"
                            }
                        ],
                        view_info: checkPermission("forms", "master_systems", "view")
                    },
                    {
                        key: "subsystem",
                        label: "Sub System",
                        url: "subsystem",
                        view: checkPermission("menu", "report_settings", "sub_system"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/subsystem" },
                            {
                                key: "subsystem",
                                name: "Sub System",
                                path: "/subsystem"
                            }
                        ],
                        view_info: checkPermission("forms", "master_sub_systems", "view")
                    },
                    {
                        key: "specialreport",
                        label: "Special Report",
                        url: "specialreport",
                        view: checkPermission("menu", "report_settings", "special_reports"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/specialreport" },
                            {
                                key: "specialreport",
                                name: "Special Report",
                                path: "/specialreport"
                            }
                        ],
                        view_info: checkPermission("forms", "special_reports", "view")
                    },
                    {
                        key: "reportparagraph",
                        label: "Report Paragraph",
                        url: "reportparagraph",
                        view: checkPermission("menu", "report_settings", "report_paragraphs"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/reportparagraph" },
                            {
                                key: "reportparagraph",
                                name: "Report Paragraph",
                                path: "/reportparagraph"
                            }
                        ],
                        view_info: checkPermission("forms", "report_paragraphs", "view")
                    },
                    {
                        key: "childparagraph",
                        label: "Child Paragraph",
                        url: "childparagraph",
                        view: checkPermission("menu", "report_settings", "child_paragraphs"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/childparagraph" },
                            {
                                key: "childparagraph",
                                name: "Child Paragraph",
                                path: "/childparagraph"
                            }
                        ],
                        view_info: checkPermission("forms", "child_paragraphs", "view")
                    },
                    {
                        key: "chartsandgraphs",
                        label: "Charts And Graphs",
                        url: "chartsandgraphs",
                        view: checkPermission("menu", "report_settings", "charts_and_graphs"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/chartsandgraphs" },
                            {
                                key: "chartsandgraphs",
                                name: "Charts And Graphs",
                                path: "/chartsandgraphs"
                            }
                        ],
                        view_info: checkPermission("forms", "charts_and_graphs", "view")
                    },
                    {
                        key: "systemtables",
                        label: "System Tables",
                        url: "systemtables",
                        view: checkPermission("menu", "report_settings", "system_tables"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/systemtables" },
                            {
                                key: "systemtables",
                                name: "System Tables",
                                path: "/systemtables"
                            }
                        ],
                        view_info: checkPermission("forms", "system_tables", "view")
                    },
                    {
                        key: "narrativetemplate",
                        label: "Narrative Template",
                        url: "narrativetemplate",
                        view: checkPermission("menu", "report_settings", "narrative_template"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/narrativetemplate" },
                            {
                                key: "narrativetemplate",
                                name: "Narrative Template",
                                path: "/narrativetemplate"
                            }
                        ],
                        view_info: checkPermission("forms", "narrative_templates", "view")
                    },
                    {
                        key: "tabletemplate",
                        label: "Table Template",
                        url: "tabletemplate",
                        view: checkPermission("menu", "report_settings", "table_template"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/tabletemplate" },
                            {
                                key: "tabletemplate",
                                name: "Table Template",
                                path: "/tabletemplate"
                            }
                        ],
                        view_info: checkPermission("forms", "table_templates", "view")
                    },
                    {
                        key: "reportnotetemplate",
                        label: "Report Notes Template",
                        url: "reportnotetemplate",
                        view: checkPermission("menu", "report_settings", "report_notes_template"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/reportnotetemplate" },
                            {
                                key: "reportnotetemplate",
                                name: "Report Notes Template",
                                path: "/reportnotetemplate"
                            }
                        ],
                        view_info: checkPermission("forms", "report_note_templates", "view")
                    },
                    {
                        key: "excelExport",
                        label: "Report Properties",
                        url: "settings/reportProperties",
                        view: checkPermission("menu", "report_settings", "report_properties"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/settings/reportProperties" },
                            {
                                key: "reportProperties",
                                name: "Report Properties",
                                path: "/settings/reportProperties"
                            }
                        ],
                        view_info: checkPermission("forms", "global_report_properties", "view")
                    },
                    {
                        key: "reportPropertyValues",
                        label: "Property Values",
                        url: "settings/reportpropertyvalues/fontnames",
                        view: checkPermission("menu", "report_settings", "report_properties"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/settings/reportpropertyvalues/fontnames" },
                            {
                                key: "reportPropertyValues",
                                name: "Property Values",
                                path: "/settings/reportpropertyvalues/fontnames"
                            }
                        ],
                        view_info: checkPermission("forms", "global_report_properties", "view")
                    },
                    {
                        key: "reportTemplates",
                        label: "Report Templates",
                        url: "settings/reportTemplates",
                        view: checkPermission("menu", "report_settings", "report_templates"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/settings/reportTemplates" },
                            {
                                key: "reportTemplates",
                                name: "Report Templates",
                                path: "/settings/reportTemplates"
                            }
                        ],
                        view_info: checkPermission("forms", "global_report_templates", "view")
                    },
                    {
                        key: "chartProperties",
                        label: "Export Properties",
                        url: "chartProperties",
                        view: checkPermission("menu", "report_settings", "chart_properties"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/chartProperties" },
                            {
                                key: "chartProperties",
                                name: "Export Properties",
                                path: "/chartProperties"
                            }
                        ],
                        view_info: checkPermission("forms", "global_chart_properties", "view")
                    },
                    {
                        key: "chartTemplates",
                        label: "Export Templates",
                        url: "chartTemplates",
                        view: checkPermission("menu", "report_settings", "chart_templates"),
                        bc: [
                            { key: "main", name: "Report Settings", path: "/chartTemplates" },
                            {
                                key: "chartTemplates",
                                name: "Export Templates",
                                path: "/chartTemplates"
                            }
                        ],
                        view_info: checkPermission("forms", "global_chart_templates", "view")
                    }
                ]
            },

            {
                key: "settings",
                label: "General Settings",
                url: null,
                view: checkPermission("menu", "settings", null),
                bc: [{ key: "main", name: "Settings", path: "/settings/buildingtype" }],
                nodes: [
                    {
                        key: "meter",
                        label: "Meter",
                        url: "meters",
                        view: true,
                        bc: [
                            { key: "main", name: "General Settings", path: "/meters" },
                            {
                                key: "meter",
                                name: "Meter",
                                path: "/meters"
                            }
                        ],
                        view_info: true
                    },
                    {
                        key: "consultancy",
                        label: "Consultancies",
                        url: "Consultancy",
                        name: "consultancies",
                        view: checkPermission("menu", "consultancies", null),
                        bc: [
                            { key: "main", name: "General Settings", path: "/Consultancy" },
                            {
                                key: "consultancy",
                                name: "Consultancy",
                                path: "/Consultancy"
                            }
                        ],
                        nodes: getMenuItemsResponse && getMenuItemsResponse.consultancies ? getMenuItemsResponse.consultancies : [],
                        view_info: checkPermission("forms", "consultancies", "view")
                    },
                    {
                        key: "client",
                        label: "Clients",
                        url: "Client",
                        name: "clients",
                        view: checkPermission("menu", "clients", null),
                        bc: [
                            { key: "main", name: "General Settings", path: "/Client" },
                            {
                                key: "client",
                                name: "Clients",
                                path: "/Client"
                            }
                        ],
                        nodes: getMenuItemsResponse && getMenuItemsResponse.clients ? getMenuItemsResponse.clients : [],
                        view_info: checkPermission("forms", "clients", "view")
                    },
                    {
                        key: "region",
                        label: "Regions",
                        url: "Region",
                        name: "regions",
                        view: checkPermission("menu", "regions", null),
                        bc: [
                            { key: "main", name: "General Settings", path: "/Region" },
                            {
                                key: "region",
                                name: "Regions",
                                path: "/Region"
                            }
                        ],
                        nodes: getMenuItemsResponse && getMenuItemsResponse.regions ? getMenuItemsResponse.regions : [],
                        view_info: checkPermission("forms", "regions", "view")
                    },
                    {
                        key: "site",
                        label: "Sites",
                        url: "site",
                        name: "sites",
                        view: checkPermission("menu", "sites", null),
                        bc: [
                            { key: "main", name: "Genaral Settings", path: "/Site" },
                            {
                                key: "site",
                                name: "Sites",
                                path: "/Site"
                            }
                        ],
                        nodes: getMenuItemsResponse && getMenuItemsResponse.sites ? getMenuItemsResponse.sites : [],
                        view_info: checkPermission("forms", "sites", "view")
                    },
                    {
                        key: "building",
                        label: "Buildings",
                        url: "Building",
                        name: "buildings",
                        view: checkPermission("menu", "buildings", null),
                        bc: [
                            { key: "main", name: "Genaral Settings", path: "/Building" },
                            {
                                key: "building",
                                name: "Buildings",
                                path: "/building"
                            }
                        ],
                        nodes: getMenuItemsResponse && getMenuItemsResponse.buildings ? getMenuItemsResponse.buildings : [],
                        view_info: checkPermission("forms", "buildings", "view")
                    },
                    {
                        key: "buildingtype",
                        label: "Building Type",
                        url: "settings/buildingtype",
                        view: checkPermission("menu", "settings", "building_type"),
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/buildingtype" },
                            {
                                key: "buildingTypeName",
                                name: "Building Type",
                                path: "/settings/buildingtype"
                            }
                        ],
                        view_info: checkPermission("forms", "building_types", "view")
                    },
                    {
                        key: "tradeGeneral",
                        label: "Trade",
                        url: "trade?general=true",
                        view: checkPermission("menu", "report_settings", "trade"),
                        bc: [
                            { key: "main", name: "General Settings", path: "/trade?general=true" },
                            {
                                key: "trade",
                                name: "Trade",
                                path: "/trade?general=true"
                            }
                        ],
                        view_info: checkPermission("forms", "master_trades", "view")
                    },
                    {
                        key: "systemGeneral",
                        label: "System",
                        url: "system?general=true",
                        view: checkPermission("menu", "report_settings", "system"),
                        bc: [
                            { key: "main", name: "General Settings", path: "/system?general=true" },
                            {
                                key: "system",
                                name: "System",
                                path: "/system?general=true"
                            }
                        ],
                        view_info: checkPermission("forms", "master_systems", "view")
                    },
                    {
                        key: "subsystemGeneral",
                        label: "Sub System",
                        url: "subsystem?general=true",
                        view: checkPermission("menu", "report_settings", "sub_system"),
                        bc: [
                            { key: "main", name: "General Settings", path: "/subsystem?general=true" },
                            {
                                key: "subsystem",
                                name: "Sub System",
                                path: "/subsystem?general=true"
                            }
                        ],
                        view_info: checkPermission("forms", "master_sub_systems", "view")
                    },
                    {
                        key: "user",
                        label: "Users",
                        url: "settings/user",
                        view: checkPermission("menu", "settings", "users"),
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/user" },
                            {
                                key: "userName",
                                name: "User",
                                path: "/settings/user"
                            }
                        ],
                        view_info: checkPermission("forms", "users", "view")
                    },
                    {
                        key: "userPermissions",
                        label: "User Permmissions",
                        url: "settings/userPermissions",
                        view: checkPermission("menu", "settings", "user_permissions"),
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/userPermissions" },
                            {
                                key: "userName",
                                name: "User Permissions",
                                path: "/settings/userPermissions"
                            }
                        ],
                        view_info: checkPermission("forms", "user_permissions", "view")
                    },
                    {
                        key: "templates",
                        label: "Templates",
                        view: checkPermission("menu", "settings", "templates"),
                        url: "settings/templates",
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/templates" },
                            {
                                key: "templates",
                                name: "Templates",
                                path: "/settings/templates"
                            }
                        ]
                    },
                    {
                        key: "helpers",
                        label: "Helpers",
                        view: checkPermission("menu", "settings", "page_infos"),
                        url: "settings/helpers",
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/helpers" },
                            {
                                key: "helpers",
                                name: "Helpers",
                                path: "/settings/helpers"
                            }
                        ]
                    },

                    {
                        key: "manageLandingPage",
                        label: "Manage Landing Page",
                        view: checkPermission("menu", "settings", "landing_pages"),
                        url: "settings/manageLandingPage",
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/manageLandingPage" },
                            {
                                key: "manageLandingPage",
                                name: "Manage Landing Page",
                                path: "/settings/manageLandingPage"
                            }
                        ]
                    },
                    {
                        key: "manageHeadings",
                        label: "Manage Headings",
                        view: checkPermission("menu", "settings", "manage_headings"),
                        url: "settings/manageHeadings",
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/manageHeadings" },
                            {
                                key: "manageHeadings",
                                name: "Manage Headings",
                                path: "/settings/manageHeadings"
                            }
                        ]
                    },
                    {
                        key: "email",
                        label: "Emails",
                        view: checkPermission("menu", "settings", "email"),
                        url: "settings/email",
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/email" },
                            {
                                key: "email",
                                name: "Email",
                                path: "/settings/email"
                            }
                        ]
                    },

                    {
                        key: "notifications",
                        label: "Notifications",
                        view: true || checkPermission("menu", "settings", "notifications"),
                        url: "settings/notifications",
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/notifications" },
                            {
                                key: "notifications",
                                name: "notifications",
                                path: "/settings/notifications"
                            }
                        ]
                    },
                    {
                        key: "logs",
                        label: "Logs",
                        view: checkPermission("menu", "settings", "user_activity_logs"),
                        url: "settings/logs",
                        bc: [
                            { key: "main", name: "General Settings", path: "/settings/logs" },
                            {
                                key: "logs",
                                name: "Logs",
                                path: "/settings/logs"
                            }
                        ]
                    }
                ]
            }
        ];
        this.setState({
            menuData: tempMenuData
        });
    };

    setBreadCrumpData = async pageData => {
        bulkResetBreadCrumpData(pageData.bc);
        return true;
    };

    setDynamicUrl = (url = null) => {
        switch (url) {
            case "narrativetemplate":
                localStorage.setItem("dynamicUrl", `/narrative_templates`);
                break;
            case "tabletemplate":
                localStorage.setItem("dynamicUrl", `/table_templates`);
                break;
            case "reportnotetemplate":
                localStorage.setItem("dynamicUrl", `/report_note_templates`);
                break;
            case "specialreport":
                localStorage.setItem("dynamicUrl", `/special_reports`);
                break;
            case "reportparagraph":
                localStorage.setItem("dynamicUrl", `/report_paragraphs`);
                break;
            case "childparagraph":
                localStorage.setItem("dynamicUrl", `/child_paragraphs`);
                break;
            case "chartsandgraphs":
                localStorage.setItem("dynamicUrl", `/charts_and_graphs`);
                break;
            case "systemtables":
                localStorage.setItem("dynamicUrl", `/system_tables`);
                break;
            default:
                break;
        }
    };

    handleClick = async data => {
        const { history } = this.props;
        this.setDynamicUrl(data.url);
        await this.props.savePopUpData({});
        if (data.url && data.view_info !== false) {
            await this.setBreadCrumpData(data);
            if (data.url) history.push(`/${data.url}`);
        }
    };

    handleSideNavClick = (props, level) => {
        if (props?.key === "energy_management") {
            let energyClient =
                (localStorage.getItem("energy_management_client") && JSON.parse(localStorage.getItem("energy_management_client"))) || {};
            energyClient?.id && localStorage.setItem("energyclientID", energyClient?.id);
        }

        if (this.props.match.path !== "/dashboard") {
            this.setState({
                redirection: false
            });
        }

        this.handleClick({
            url: props.url,
            bc: props.bc,
            label: props.label,
            level: level,
            view_info: props.view_info
        });
    };

    renderFormDirtyConfirmation = () => {
        const {
            showFormDirtyConfirmation,
            selectedNavItem: { onYes }
        } = this.state;
        if (!showFormDirtyConfirmation) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"You have unsaved changes that will be lost if you decide to continue."}
                        message="Are you sure you want to leave this page?"
                        onNo={this.closeConfirmation}
                        onYes={() => {
                            this.closeConfirmation();
                            this.props.setFormDirty(false);
                            onYes();
                        }}
                    />
                }
                onCancel={this.closeConfirmation}
            />
        );
    };

    closeConfirmation = () => {
        this.setState({ showFormDirtyConfirmation: false });
    };

    collapseAllItem = () => {
        this.setState({ collapseAll: !this.state.collapseAll });
    };

    showNav = () => {
        var element = document.getElementById("sidebar");
        var element1 = document.getElementById("main");
        this.props.handleShowNa();
        element.style.width = "270px";
        element1.style.marginLeft = "270px";
        element.classList.remove("expandnavbar");
        element1.classList.remove("expandnavbarr");
        element1.classList.add("margin-nav");
    };

    handleView = async (name, breadcrumbName, value) => {
        const { sidePanelValues } = this.state;
        this.setState({
            activeSection: "project"
        });
        if (sidePanelValues && sidePanelValues.project_ids && sidePanelValues.project_ids.length) {
            await this.updateFilters();
            history.push(`/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`);
            // resetBreadCrumpData({
            //     key: "info",
            //     name: "Basic Details",
            //     path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`
            // });
            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "main", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: sidePanelValues.project_name,
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`,
                    index: 2
                },
                {
                    key: "info",
                    name: "Basic Details",
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`,
                    index: 3
                }
            ];
            bulkResetBreadCrumpData(bc);
        }
    };

    handleBuildingView = async () => {
        const { sidePanelValues } = this.state;
        this.setState({
            activeSection: "building"
        });
        if (sidePanelValues && sidePanelValues.project_ids && sidePanelValues.project_ids.length) {
            await this.updateFilters();
            history.push(`/project/projectinfo/${sidePanelValues.project_ids[0]}/buildings`);
            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "main", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: sidePanelValues.project_name,
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`,
                    index: 2
                },
                { key: "info", name: "Buildings", path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/buildings`, index: 3 }
            ];
            bulkResetBreadCrumpData(bc);
        }
    };

    handleSiteView = async () => {
        const { sidePanelValues } = this.state;
        this.setState({
            activeSection: "site"
        });
        if (sidePanelValues && sidePanelValues.project_ids && sidePanelValues.project_ids.length) {
            await this.updateFilters();
            history.push(`/project/projectinfo/${sidePanelValues.project_ids[0]}/sites`);
            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "main", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: sidePanelValues.project_name,
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`,
                    index: 2
                },
                {
                    key: "info",
                    name: "Sites",
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/sites`,
                    index: 3
                }
            ];
            bulkResetBreadCrumpData(bc);

            // resetBreadCrumpData({
            //     key: "info",
            //     name: "Sites",
            //     path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/sites`
            // });
        }
    };

    handleRegionView = async () => {
        const { sidePanelValues } = this.state;
        this.setState({
            activeSection: "region"
        });
        if (sidePanelValues && sidePanelValues.project_ids && sidePanelValues.project_ids.length) {
            await this.updateFilters();
            history.push(`/project/projectinfo/${sidePanelValues.project_ids[0]}/regions`);
            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "main", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: sidePanelValues.project_name,
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`,
                    index: 2
                },
                {
                    key: "info",
                    name: "Regions",
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/regions`,
                    index: 3
                }
            ];
            bulkResetBreadCrumpData(bc);
            // resetBreadCrumpData({
            //     key: "info",
            //     name: "Regions",
            //     path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/regions`
            // });
        }
    };

    updateFilters = async ids => {
        this.props.savePopUpData({});
        const { dashboardFilterParams } = this.state;
        let recomentationEntityParams = {
            entity: "Recommendation",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            selectedRowId: this.state.selectedRowId,
            selectedDropdown: this.state.selectedDropdown,
            // building_ids: ids || sidePanelValues.recommendation_building_ids,
            dashboardFilterParams,
            isDashboardFiltered: true,
            capital_type: null,
            dashboard: true,
            historyParams: this.state.historyParams,
            start_year: this.state.dashboardFilterParams.start_year,
            end_year: this.state.dashboardFilterParams.end_year,
            infrastructure_requests: this.state.dashboardFilterParams.infrastructure_requests,
            facility_master_plan: this.state.dashboardFilterParams.facility_master_plan
        };
        this.props.updateRecommendationEntityParams({}, "regioninfo");
        this.props.updateRecommendationEntityParams({}, "siteinfo");
        this.props.updateRecommendationEntityParams({}, "buildinginfo");
        this.props.updateRecommendationEntityParams(recomentationEntityParams, "projectinfo");
        let buildingEntityParams = {
            entity: "Building",
            params: this.state.params,
            // building_ids: ids || sidePanelValues.building_ids,
            dashboardFilterParams,
            paginationParams: this.state.paginationParams,
            isDashboard: true
        };
        await this.props.updateBuildingEntityParams(buildingEntityParams);
        let regionEntityParams = {
            entity: "Region",
            params: this.state.params,
            // region_ids: sidePanelValues.region_ids,
            dashboardFilterParams,
            paginationParams: this.state.paginationParams,
            isDashboardFiltered: true
        };
        this.props.updateRegionEntityParams(regionEntityParams);
        let siteEntityParams = {
            entity: "Site",
            params: this.state.params,
            // site_ids: sidePanelValues.site_ids,
            dashboardFilterParams,
            paginationParams: this.state.paginationParams,
            isDashboardFiltered: true
        };
        this.props.updateSiteEntityParams(siteEntityParams);
    };

    handleRecommentationView = async () => {
        const { sidePanelValues } = this.state;
        this.setState({
            activeSection: "recommendation"
        });
        if (sidePanelValues && sidePanelValues.project_ids && sidePanelValues.project_ids.length) {
            await this.updateFilters();
            history.push(`/project/projectinfo/${sidePanelValues.project_ids[0]}/recommendations`);
            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "main", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: sidePanelValues.project_name,
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`,
                    index: 2
                },
                {
                    key: "info",
                    name: "Recommendations",
                    path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/recommendations`,
                    index: 3
                }
            ];
            bulkResetBreadCrumpData(bc);
        }
    };

    handleBuildingType = async (ids, type, e) => {
        e.stopPropagation();

        const { sidePanelValues } = this.state;
        this.setState({
            activeSection: type,
            activeBuildingType: type
        });
        if (sidePanelValues && sidePanelValues.project_ids && sidePanelValues.project_ids.length) {
            let tempNames = this.state.filterValues;
            let test = [type];
            let isOject = this.state.filterValues && this.state.filterValues.length && this.state.filterValues.find(f => f.name === "Building Types");
            if (isOject) {
                // if (nameValue && nameValue.length) {
                test = isOject.value;
                let isName = test.find(t => t === type);
                if (!isName) test.push(type);
                tempNames.forEach((tv, key) => {
                    if (tv.name === "Building Types") {
                        tempNames[key] = { name: "Building Types", value: test };
                    }
                });
                // }
            } else {
                tempNames.push({ name: "Building Types", value: [type] });
            }

            this.setState(
                {
                    dashboardFilterParams: {
                        ...this.state.dashboardFilterParams,
                        building_types: test
                    },
                    filterValues: tempNames
                },
                async () => {
                    await this.props.getDashboard({ ...this.state.dashboardFilterParams, ...this.props.dashboardReducer.dashboardExtraFilters });
                    await this.props.modifyFilter(this.state.filterValues, this.state.dashboardFilterParams);
                    await this.updateFilters(ids);

                    history.push(`/project/projectinfo/${sidePanelValues.project_ids[0]}/buildings`);

                    let bc = [
                        { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                        { key: "info", name: "FCA Projects", path: "/project", index: 1 },
                        {
                            key: "projectName",
                            name: sidePanelValues.project_name,
                            path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/basicdetails`,
                            index: 2
                        },
                        { key: "info", name: "Buildings", path: `/project/projectinfo/${sidePanelValues.project_ids[0]}/buildings`, index: 3 }
                    ];
                    bulkResetBreadCrumpData(bc);
                }
            );
        }
    };

    clearBuildingFilter = (e, type) => {
        e.preventDefault();
        this.setState({
            activeSection: "",
            activeBuildingType: ""
        });
        let test = [];
        let tempNames = this.state.filterValues;
        let isOject = this.state.filterValues && this.state.filterValues.length && this.state.filterValues.find(f => f.name === "Building Types");
        if (isOject) {
            // if (nameValue && nameValue.length) {
            test = isOject.value;
            let isName = test.filter(t => t !== type);
            test = isName;
            if (!isName.length) {
                tempNames = tempNames.filter(t => t.name !== "Building Types");
            } else {
                tempNames.forEach((tv, key) => {
                    if (tv.name === "Building Types") {
                        tempNames[key] = { name: "Building Types", value: isName };
                    }
                });
            }
        }

        this.setState(
            {
                dashboardFilterParams: {
                    ...this.state.dashboardFilterParams,
                    building_types: test || null
                },
                filterValues: tempNames
            },
            async () => {
                await this.props.getDashboard(this.state.dashboardFilterParams);
                await this.props.modifyFilter(this.state.filterValues, this.state.dashboardFilterParams);
            }
        );
    };

    handleClearFilterData = (data, item) => {
        let currentData = this.state.filterValues.map((fv, key) => {
            fv.value = fv.value.filter(v => v !== item);
            return fv;
        });
    };

    getParamsForSideMenu = (entity, parentId, grandParentId, gGrandParentId, gGGParentId) => {
        // eslint-disable-next-line default-case
        switch (entity) {
            case "projects":
                return {
                    entity: entity,
                    response: "getProjectMenuItemsResponse",
                    params: {}
                };
            case "project_regions":
                return {
                    entity: entity,
                    response: "getProjectRegionMenuItemsResponse",
                    params: {
                        project_id: parentId
                    }
                };
            case "project_sites":
                return {
                    entity: entity,
                    response: "getProjectSiteMenuItemsResponse",
                    params: {
                        project_id: parentId,
                        region_id: grandParentId
                    }
                };
            case "project_buildings":
                return {
                    entity: entity,
                    response: "getProjectBuildingMenuItemsResponse",
                    params: {
                        project_id: parentId,
                        region_id: grandParentId,
                        site_id: gGrandParentId
                    }
                };
            case "project_floors":
                return {
                    entity: entity,
                    response: "getProjectFloorMenuItemsResponse",
                    params: {
                        project_id: parentId,
                        region_id: grandParentId,
                        site_id: gGrandParentId,
                        building_id: gGGParentId
                    }
                };
            case "reports":
                return {
                    entity: entity,
                    response: "getReportMenuItemsResponse",
                    params: {}
                };
            case "report_regions":
                return {
                    entity: entity,
                    response: "getReportRegionMenuItemsResponse",
                    params: {
                        project_id: parentId
                    }
                };
            case "report_sites":
                return {
                    entity: entity,
                    response: "getReportSiteMenuItemsResponse",
                    params: {
                        project_id: parentId,
                        region_id: grandParentId
                    }
                };
            case "report_buildings":
                return {
                    entity: entity,
                    response: "getReportBuildingMenuItemsResponse",
                    params: {
                        project_id: parentId,
                        region_id: grandParentId,
                        site_id: gGrandParentId
                    }
                };
            case "efcis":
                return {
                    entity: entity,
                    response: "getEfciMenuItemsResponse",
                    // response: "getProjectMenuItemsResponse",
                    params: {}
                };
            case "efci_regions":
                return {
                    entity: entity,
                    response: "getEfciRegionMenuItemsResponse",
                    // response: "getProjectRegionMenuItemsResponse",
                    params: {
                        project_id: parentId
                    }
                };
            case "efci_sites":
                return {
                    entity: entity,
                    response: "getEfciSiteMenuItemsResponse",
                    params: {
                        project_id: parentId,
                        region_id: grandParentId
                    }
                };
            case "efci_buildings":
                return {
                    entity: entity,
                    response: "getEfciBuildingMenuItemsResponse",
                    params: {
                        project_id: parentId,
                        region_id: grandParentId,
                        site_id: gGrandParentId
                    }
                };
            case "regions":
                return {
                    entity: entity,
                    response: "getRegionMenuItemsResponse",
                    params: {}
                };
            case "region_sites":
                return {
                    entity: entity,
                    response: "getRegionSiteMenuItemsResponse",
                    params: {
                        region_id: parentId
                    }
                };
            case "region_buildings":
                return {
                    entity: entity,
                    response: "getRegionBuildingMenuItemsResponse",
                    params: {
                        region_id: parentId,
                        site_id: grandParentId
                    }
                };
            case "region_floors":
                return {
                    entity: entity,
                    response: "getRegionFloorMenuItemsResponse",
                    params: {
                        region_id: parentId,
                        site_id: grandParentId,
                        building_id: gGrandParentId
                    }
                };
            case "sites":
                return {
                    entity: entity,
                    response: "getSiteMenuItemsResponse",
                    params: {}
                };
            case "site_buildings":
                return {
                    entity: entity,
                    response: "getSiteBuildingMenuItemsResponse",
                    params: {
                        site_id: parentId
                    }
                };
            case "site_floors":
                return {
                    entity: entity,
                    response: "getSiteFloorMenuItemsResponse",
                    params: {
                        site_id: parentId,
                        building_id: grandParentId
                    }
                };
            case "buildings":
                return {
                    entity: entity,
                    response: "getBuildingMenuItemsResponse",
                    params: {}
                };
            case "building_floors":
                return {
                    entity: entity,
                    response: "getBuildingFloorMenuItemsResponse",
                    params: {
                        building_id: parentId
                    }
                };
            case "clients":
                return {
                    entity: entity,
                    response: "getClientMenuItemsResponse",
                    params: {}
                };
            case "consultancies":
                return {
                    entity: entity,
                    response: "getConsultancyMenuItemsResponse",
                    params: {}
                };
        }
    };

    sideMenuHandler = async (entity, item, parentId, grandParentId, gGrandParentId, gGGParenteId) => {
        if (entity) {
            let params = this.getParamsForSideMenu(entity, parentId, grandParentId, gGrandParentId, gGGParenteId);
            await this.props.getSideMenuItems(params);
            const data = this.props.commonReducer[params?.response] && this.props.commonReducer[params?.response][params?.entity];
            this.appendMenuData(data, item, true);
        }
    };

    appendMenuData = (temp, item, open) => {
        let menuData = this.state.menuData;
        if (open) {
            menuData =
                menuData &&
                menuData.length &&
                menuData.map(menu => {
                    if (menu.nodes && menu.nodes.length) {
                        // if (menu.key == item.key) menu.nodes = _.uniqBy([...menu.nodes, ...temp], "key");
                        if (menu.key === item.key) {
                            if (menu.nodes.length > temp.length) {
                                menu.nodes = [...temp];
                            } else {
                                menu.nodes = _.uniqBy([...menu.nodes, ...temp], "key");
                            }
                        }
                        return {
                            ...menu,
                            nodes:
                                menu.nodes &&
                                menu.nodes.length &&
                                menu.nodes.map(node => {
                                    if (node.nodes && node.nodes.length) {
                                        if (node.key === item.key) {
                                            if (node.nodes.length > temp.length) {
                                                node.nodes = [...temp];
                                            } else {
                                                node.nodes = _.uniqBy([...node.nodes, ...temp], "key");
                                            }
                                        }
                                        return {
                                            ...node,
                                            nodes:
                                                node.nodes &&
                                                node.nodes.length &&
                                                node.nodes.map(sub => {
                                                    if (sub.nodes && sub.nodes.length) {
                                                        return {
                                                            ...sub,
                                                            nodes:
                                                                sub.nodes &&
                                                                sub.nodes.length &&
                                                                sub.nodes.map(sub_system => {
                                                                    if (sub_system.nodes && sub_system.nodes.length) {
                                                                        return {
                                                                            ...sub_system,
                                                                            nodes:
                                                                                sub_system.nodes &&
                                                                                sub_system.nodes.length &&
                                                                                sub_system.nodes.map(ssub_system => {
                                                                                    if (ssub_system.key === item.key)
                                                                                        return { ...ssub_system, nodes: temp };
                                                                                    else return ssub_system;
                                                                                })
                                                                        };
                                                                    } else {
                                                                        if (sub_system.key === item.key) return { ...sub_system, nodes: temp };
                                                                        else return sub_system;
                                                                    }
                                                                    // if (sub_system.key == item.key) return { ...sub_system, nodes: temp };
                                                                    // else return sub_system;
                                                                })
                                                        };
                                                    } else {
                                                        if (sub.key === item.key) return { ...sub, nodes: temp };
                                                        else return sub;
                                                    }
                                                })
                                        };
                                    } else {
                                        if (node.key === item.key) return { ...node, nodes: temp };
                                        else return node;
                                    }
                                })
                        };
                    } else {
                        if (menu.key === item.key) return { ...menu, nodes: temp };
                        else return menu;
                    }
                });
        } else {
            menuData =
                menuData &&
                menuData.length &&
                menuData.map(menu => {
                    if (menu.nodes && menu.nodes.length && item.entity !== menu.entity) {
                        return {
                            ...menu,
                            nodes:
                                menu.nodes &&
                                menu.nodes.length &&
                                menu.nodes.map(node => {
                                    if (node.nodes && node.nodes.length && item.entity !== node.entity) {
                                        return {
                                            ...node,
                                            nodes:
                                                node.nodes &&
                                                node.nodes.length &&
                                                node.nodes.map(sub => {
                                                    if (sub.nodes && sub.nodes.length && item.entity !== sub.entity) {
                                                        return {
                                                            ...sub,
                                                            nodes:
                                                                sub.nodes &&
                                                                sub.nodes.length &&
                                                                sub.nodes.map(sub_system => {
                                                                    if (
                                                                        sub_system.nodes &&
                                                                        sub_system.nodes.length &&
                                                                        item.entity !== sub_system.entity
                                                                    ) {
                                                                        return {
                                                                            ...sub_system,
                                                                            nodes:
                                                                                sub_system.nodes &&
                                                                                sub_system.nodes.length &&
                                                                                sub_system.nodes.map(ssub_system => {
                                                                                    if (ssub_system.key === item.key)
                                                                                        return { ...ssub_system, nodes: [] };
                                                                                    else return ssub_system;
                                                                                })
                                                                        };
                                                                    } else {
                                                                        if (sub_system.key === item.key) return { ...sub_system, nodes: [] };
                                                                        else return sub;
                                                                    }
                                                                    // if (sub_system.key == item.key) return { ...sub_system, nodes: [] };
                                                                    // else return sub_system;
                                                                })
                                                        };
                                                    } else {
                                                        if (sub.key === item.key) return { ...sub, nodes: [] };
                                                        else return sub;
                                                    }
                                                })
                                        };
                                    } else {
                                        if (node.key === item.key) return { ...node, nodes: [] };
                                        else return node;
                                    }
                                })
                        };
                    } else {
                        if (menu.key === item.key) return { ...menu, nodes: [] };
                        else return menu;
                    }
                });
        }
        this.setState(
            {
                ...this.state,
                menuData
            },
            () => {}
        );
    };

    handleLogoClick = () => {
        resetBreadCrumpData({
            key: "main",
            name: "Dashboard",
            path: "/Dashboard"
        });
        this.props.history.push("/Dashboard");
        this.collapseAllItem();
    };

    handleLandingClick = () => {
        resetBreadCrumpData({
            key: "main",
            name: "Home",
            path: "/home"
        });
        this.props.history.push("/home");
        this.collapseAllItem();
    };

    renderGotoLandingPageConfirmationModal = () => {
        const { showGotoLandingConfirmModal } = this.state;
        if (!showGotoLandingConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Close and return to Landing Page ?"}
                        message={""}
                        onNo={() => this.setState({ showGotoLandingConfirmModal: false })}
                        onYes={() => {
                            this.setState({ showGotoLandingConfirmModal: false });
                            this.handleLandingClick();
                        }}
                    />
                }
                onCancel={() => this.setState({ showGotoLandingConfirmModal: false })}
            />
        );
    };
    findProjectName = () => {
        let projectNames = [];
        const { filterContents } = this.props.dashboardReducer;
        const filterValues = filterContents.find(elem => elem.name === "FCA Projects")?.value;
        if (filterValues?.length) {
            projectNames = filterValues;
        } else {
            projectNames = [this.props.dashboardReducer?.getDashboard?.chart?.[0]?.project_name];
        }
        return projectNames;
    };

    render() {
        const { menuData } = this.state;

        const {
            showNav,
            commonReducer: { isFormDirty }
        } = this.props;

        let hasLandingPage = localStorage.getItem("hasLandingPage") === "true" ? true : false;
        const projectName = this.findProjectName();

        return (
            <>
                {" "}
                <ReactTooltip id="go-menu" />
                <div className={`side-nav ${APP_MODE === "training" ? "side-nav-blue" : ""} `} id="sidebar">
                    <div className="navbar-brand" id="navBrand">
                        <div className="logo-large  dash-log">
                            <a
                                className={"cursor-pointer"}
                                onClick={() => {
                                    //checking if user has any unsaved changes
                                    if (isFormDirty) {
                                        this.setState({
                                            selectedNavItem: { props: null, level: null, onYes: () => this.handleLogoClick() },
                                            showFormDirtyConfirmation: true
                                        });
                                    } else {
                                        this.handleLogoClick();
                                    }
                                }}
                            >
                                {" "}
                                <img id="imgLogo" src={APP_MODE === "training" ? trainingAppLogo : "/img/fca-logo.svg"} alt="" />
                            </a>

                            {/* {(this.props.match.path == '/dashboard') ?
                                (<div
                                    // className="navmenuIcon-dash"
                                    onClick={() => {
                                        this.setState({
                                            isDashboardClick: !this.state.isDashboardClick
                                        })
                                    }}>
                                    <button type="button" className="btn btn-primary btnRgion" >{this.state.isDashboardClick ? "Menu" : "Stats"}</button>
                                </div>) : null} */}
                            {/* {this.state.redirection ? ( */}
                            <div
                            // className="navmenuIcon-dash"
                            >
                                {" "}
                                <button
                                    className="btn btn--slider"
                                    data-delay-show="500"
                                    data-tip={this.state.isDashboardClick ? `Click to view options menu` : `Click to view Stats Panel`}
                                    data-effect="solid"
                                    data-for="go-menu"
                                    data-place="right"
                                    data-background-color="#007bff"
                                    data-active="1"
                                    onClick={() => {
                                        this.setState({
                                            isDashboardClick: !this.state.isDashboardClick
                                        });
                                        console.log(this.state.isDashboardClick);
                                    }}
                                >
                                    <span className={`btn--slider__choice ${this.state.isDashboardClick ? "active" : ""} `}>
                                        <span className="icn">
                                            <img src="/img/menu-New.svg" alt="" />
                                        </span>{" "}
                                        <span className="txt">
                                            {" "}
                                            Show <br /> Statistics
                                        </span>
                                    </span>

                                    <span className={`btn--slider__choice ${this.state.isDashboardClick ? "" : "active"}`}>
                                        {" "}
                                        <span className="icn">
                                            <img src="/img/stack.svg" alt="" />
                                        </span>
                                        <span className="txt">
                                            {" "}
                                            Show <br /> Menu
                                        </span>
                                    </span>
                                    <span
                                        className="btn--slider__toggler "
                                        style={{
                                            left: this.state.isDashboardClick ? "4px" : "57px"
                                            // width: this.state.isDashboardClick ? "20px" : "24px"
                                        }}
                                    ></span>
                                </button>
                            </div>
                            {/* ) : null} */}
                        </div>
                        {!showNav ? (
                            <div className="navmenuIcon-sm nv-mb" id="Layer_1" onClick={() => this.showNav()}>
                                <svg
                                    version="1.1"
                                    id="svg"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsxlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    width="120px"
                                    height="120px"
                                    viewBox="0 0 120 120"
                                    enable-background="new 0 0 120 120"
                                    xmlspace="preserve"
                                >
                                    <circle id="expandNavIcon" fill="#B7C6D5" cx="60" cy="60" r="60" />
                                    <g>
                                        <g>
                                            <path
                                                d="M45,31.709c-0.944,0.944-0.944,2.471,0,3.417L69.875,60L45,84.874c-0.944,0.945-0.944,2.472,0,3.417
                        c0.946,0.945,2.473,0.945,3.418,0L75,61.709c0.472-0.472,0.708-1.09,0.708-1.709c0-0.619-0.236-1.238-0.708-1.708L48.418,31.709
                        C47.473,30.764,45.946,30.764,45,31.709z"
                                            />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        ) : null}
                    </div>
                    {hasLandingPage && (
                        <div className="landing-toggle cursor-hand" onClick={() => this.setState({ showGotoLandingConfirmModal: true })}>
                            <img src="/img/Group 151.svg" alt="" />
                            Back to Landing Page
                        </div>
                    )}
                    {projectName?.length > 0 && (
                        <div className="project-btn d-flex align-items-center">
                            <img src={dashboardProjecIcon} alt="" />
                            {projectName.length > 1 ? <span>MULTIPLE PROJECTS</span> : <span>{projectName[0]}</span>}
                        </div>
                    )}

                    {!this.state.isDashboardClick ? (
                        <div className="navList">
                            <SideNav
                                onClickItem={(props, level) => {
                                    //checking if user has any unsaved changes
                                    if (isFormDirty) {
                                        this.setState({
                                            selectedNavItem: { props, level, onYes: () => this.handleSideNavClick(props, level) },
                                            showFormDirtyConfirmation: true
                                        });
                                    } else {
                                        this.handleSideNavClick(props, level);
                                    }
                                }}
                                data={menuData}
                                collapseAll={this.state.collapseAll}
                                sideMenuHandler={this.sideMenuHandler}
                            />
                            {/* <SideMenuTree
                            onClickItem={(props, level) => {
                                this.handleClick({
                                    url: props.url,
                                    bc: props.bc,
                                    label: props.label,
                                    level: level
                                });
                            }}
                            data={menuData}
                            collapseAll={this.state.collapseAll}
                        /> */}
                        </div>
                    ) : (
                        <SidePanel
                            sidePanelValues={this.state.sidePanelValues}
                            totalCsp={this.state.totalCsp}
                            filterValues={this.state.filterValues}
                            handleBuildingType={this.handleBuildingType}
                            handleBuildingView={this.handleBuildingView}
                            activeSection={this.state.activeSection}
                            activeBuildingType={this.state.activeBuildingType}
                            handleView={this.handleView}
                            handleRegionView={this.handleRegionView}
                            handleSiteView={this.handleSiteView}
                            handleRecommentationView={this.handleRecommentationView}
                            clearBuildingFilter={this.clearBuildingFilter}
                            handleClearFilterData={this.handleClearFilterData}
                        />
                    )}
                    <Footer />
                </div>
                {this.renderFormDirtyConfirmation()}
                {this.renderGotoLandingPageConfirmationModal()}
            </>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer, dashboardReducer, buildingReducer, siteReducer, regionReducer, recommendationsReducer } = state;
    return { commonReducer, dashboardReducer, buildingReducer, recommendationsReducer, siteReducer, regionReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...CommonActions,
        ...buildingActions,
        ...siteActions,
        ...dashboardAction,
        ...regionActions,
        ...recommentationActions
    })(SideMenu)
);
