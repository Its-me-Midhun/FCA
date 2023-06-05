export const MASTER_FILTER_KEYS = {
    project: [
        { label: "Projects", key: "projects", paramKey: "project_ids" },
        { label: "Region", key: "regions", paramKey: "region_ids" },
        { label: "Site", key: "sites", paramKey: "site_ids" },
        { label: "B.Types", key: "building_types", paramKey: "building_types" },
        { label: "Buildings", key: "buildings", paramKey: "building_ids" },
        { label: "FMP", key: "fmp", paramKey: "fmp" },
        { label: "IR", key: "infrastructure_requests", paramKey: "infrastructure_requests" },
        { label: "Additions", key: "additions", paramKey: "addition_ids" },
        { label: "FCI", key: "fci", paramKey: "color_scale" }
        // { label: "Primary Use", key: "fmp", paramKey: "fmp" },
        // { label: "Division", key: "fmp", paramKey: "fmp" }
    ],
    energy_mng: [
        { label: "Region", key: "energy_mng_regions", paramKey: "region_ids" },
        { label: "Site", key: "energy_mng_sites", paramKey: "site_ids" },
        { label: "Buildings", key: "energy_mng_buildings", paramKey: "building_ids" },
        { label: "Years", key: "energy_mng_years", paramKey: "years" }
    ],
    assets: [
        { label: "Region", key: "asset_regions", paramKey: "region_ids" },
        { label: "Site", key: "asset_sites", paramKey: "site_ids" },
        { label: "Buildings", key: "asset_buildings", paramKey: "building_ids" }
    ],
    smart_report_list_filter: [
        { label: "Clients", key: "clients", paramKey: "client_ids" },
        { label: "Projects", key: "projects", paramKey: "project_ids" }
    ],
    smart_report_properties_list_filter: [{ label: "Clients", key: "clients", paramKey: "client_ids" }],
    documents: [{ label: "Clients", key: "clients", paramKey: "client_ids" }]
};

export const MASTER_FILTER_ROWS = {
    project: [1, 2],
    energy_mng: [1],
    assets: [1]
};

export const CHART_ITEMS = {
    project: {
        regions: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: { table_view: "", summary_view: { chart_type: ["pie_3d"] }, detailed_view: { chart_type: ["stacked_column_2d"] } }
        },
        sites: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: { table_view: "", summary_view: { chart_type: ["pie_3d"] }, detailed_view: { chart_type: ["stacked_column_2d"] } }
        },
        buildings: {
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            hasConfig: true,
            isVisible: true,
            defaultValue: { table_view: "", summary_view: { chart_type: ["pie_3d"] }, detailed_view: { chart_type: ["stacked_column_2d"] } }
        },
        additions: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                table_view: "",
                summary_view: {
                    chart_type: ["pie_3d"]
                },
                detailed_view: {
                    chart_type: ["stacked_column_2d"]
                }
            }
        },
        sorted_recom: {
            hasConfig: true,
            isVisible: true,
            defaultValue: {
                band1: {
                    mfilter: {},
                    type: ["building"]
                }
            }
        },
        criticality: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                // sorted_recom: {
                //     band1: {
                //         mfilter: {},
                //         type: ["building"]
                //     }
                // },
                table_view: "",
                summary_view: {
                    chart_type: ["pie_3d"]
                },
                detailed_view: {
                    chart_type: ["stacked_column_2d"]
                }
            }
        },
        categories: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                table_view: "",
                summary_view: {
                    chart_type: ["pie_3d"]
                },
                detailed_view: {
                    chart_type: ["stacked_column_2d"]
                }
            }
        },
        funding_sources: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                table_view: "",
                summary_view: {
                    chart_type: ["pie_3d"]
                },
                detailed_view: {
                    chart_type: ["stacked_column_2d"]
                }
            }
        },
        priorities: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                table_view: "",
                summary_view: {
                    chart_type: ["pie_3d"]
                },
                detailed_view: {
                    chart_type: ["stacked_column_2d"]
                }
            }
        },
        trades: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                table_view: "",
                summary_view: {
                    chart_type: ["pie_3d"]
                },
                detailed_view: {
                    chart_type: ["stacked_column_2d"]
                }
            }
        },
        system: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                trade_ids: [],
                table_view: "",
                summary_view: {
                    chart_type: ["pie_3d"]
                },
                detailed_view: { chart_type: ["stacked_column_2d"] }
            }
        },
        capital_type: {
            hasConfig: true,
            config: {
                table_view: true,
                summary_view: true,
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                table_view: "",
                summary_view: {
                    chart_type: ["pie_3d"]
                },
                detailed_view: {
                    chart_type: ["stacked_column_2d"]
                }
            }
        },
        EFCI: {
            hasConfig: true,
            config: {
                detailed_view: true
            },
            isVisible: true,
            defaultValue: {
                detailed_view: {
                    chart_type: ["line_column_2d"]
                }
            }
        },
        energy_band: {
            hasConfig: false,
            isVisible: true,
            defaultValue: ""
        },
        water_band: {
            hasConfig: false,
            isVisible: true,
            defaultValue: ""
        }
    },
    assets: {
        end_servicelife_year_condition: {
            hasConfig: true,
            // config: {
            //     table_view: true,
            //     summary_view: true,
            //     detailed_view: true
            // },
            isVisible: true,
            defaultValue: { table_view: "", detailed_view: { chart_type: ["stacked_column_2d", "stacked_column_3d"] } }
        },
        asset_age_by_condition: {
            hasConfig: true,
            isVisible: true,
            defaultValue: { table_view: "", detailed_view: { chart_type: ["stacked_column_2d", "stacked_column_3d"] } }
        },
        asset_capital_spending_plan: {
            hasConfig: true,
            isVisible: true,
            defaultValue: {
                table_view: "",
                summary_view: { chart_type: ["pie_2d", "pie_3d"] },
                detailed_view: { chart_type: ["stacked_column_2d", "stacked_column_3d"] }
            }
        },
        asset_system_facility: {
            hasConfig: true,
            isVisible: true,
            defaultValue: { table_view: "", detailed_view: { chart_type: ["stacked_column_2d", "stacked_column_3d"] } }
        }
    },
    energy_mng: {
        em_eui_building_breakdown: {
            hasConfig: true,
            config: {
                // summary_view: true,
                detailed_view: true
                // table_view: true
            },
            isVisible: true,
            defaultValue: { detailed_view: { chart_type: ["stacked_column_2d"] } }
        },
        bld_brkdown_energy_usage: {
            hasConfig: true,
            config: {
                summary_view: true
                // detailed_view: true,
                // table_view: true
            },
            isVisible: true,
            defaultValue: { summary_view: { chart_type: ["pie_2d"] } }
        },
        em_eui_site_brkdown_energy_use: {
            hasConfig: true,
            config: {
                // summary_view: true,
                detailed_view: true
                // table_view: true
            },
            isVisible: true,
            defaultValue: { detailed_view: { chart_type: ["stacked_column_2d"] } }
        },
        em_eui_energy_usage: {
            hasConfig: true,
            config: {
                summary_view: true
                // detailed_view: true,
                // table_view: true
            },
            isVisible: true,
            defaultValue: { summary_view: { chart_type: ["pie_2d"] } }
        },
        bld_brkdown_energy_cost: { hasConfig: true, isVisible: true, defaultValue: { summary_view: { chart_type: ["pie_2d"] } } },
        em_eci_site_cost: { hasConfig: true, isVisible: true, defaultValue: { detailed_view: { chart_type: ["stacked_column_2d"] } } },
        em_eci_energy_cost: { hasConfig: true, isVisible: true, defaultValue: { summary_view: { chart_type: ["pie_2d", "pie_3d"] } } },
        energy_band: {
            hasConfig: false,
            isVisible: true,
            defaultValue: ""
        },
        water_band: {
            hasConfig: false,
            isVisible: true,
            defaultValue: ""
        }
    }
};

export const CHART_DATA_VIEWS = ["summary_view", "detailed_view", "table_view"];
export const SMART_CHART_TAB_VIEWS = [
    { key: "reporttemplates", label: "Report Templates", url: "/smartcharts/reporttemplates" },
    { key: "reports", label: "Reports", url: "/smartcharts/reports" },
    { key: "documents", label: "Documents", url: "/smartcharts/documents" },
    { key: "images", label: "Images", url: "/smartcharts/images" }
];
export const DOC_AND_IMAGE_BANDS = [
    { key: "documents", label: "Documents", dragDropKey: "USERDOCS" }
    // { key: "images", label: "Images", dragDropKey: "USERIMAGES" }
];

export const INDV_BUILDING_EXPORT_ENTITIES = [
    "buildings",
    "categories",
    "capital_type",
    "criticality",
    "priorities",
    "additions",
    "funding_sources",
    "trades",
    "system",
    "EFCI",
    "sorted_recom"
];

export const IMAGE_BAND_CONFIG_TYPES = [
    { key: 1, label: "Single Image Band", icon: "/img/squre-img.png" },
    { key: 2, label: "Single Image Band", icon: "/img/rect-img.png" },
    { key: 3, label: "Double Image Band", icon: "/img/doub-img.png" }
];

export const GET_MASTER_FILTER_IN_SMART_CHART_REQUEST = "GET_MASTER_FILTER_IN_SMART_CHART_REQUEST";
export const GET_MASTER_FILTER_IN_SMART_CHART_SUCCESS = "GET_MASTER_FILTER_IN_SMART_CHART_SUCCESS";
export const GET_MASTER_FILTER_IN_SMART_CHART_FAILURE = "GET_MASTER_FILTER_IN_SMART_CHART_FAILURE";

export const EXPORT_SMART_CHART_DATA_REQUEST = "EXPORT_SMART_CHART_DATA_REQUEST";
export const EXPORT_SMART_CHART_DATA_SUCCESS = "EXPORT_SMART_CHART_DATA_SUCCESS";
export const EXPORT_SMART_CHART_DATA_FAILURE = "EXPORT_SMART_CHART_DATA_FAILURE";

export const SAVE_SMART_CHART_DATA_REQUEST = "SAVE_SMART_CHART_DATA_REQUEST";
export const SAVE_SMART_CHART_DATA_SUCCESS = "SAVE_SMART_CHART_DATA_SUCCESS";
export const SAVE_SMART_CHART_DATA_FAILURE = "SAVE_SMART_CHART_DATA_FAILURE";

export const GET_EXPORTED_SMART_CHART_LIST_REQUEST = "GET_EXPORTED_SMART_CHART_LIST_REQUEST";
export const GET_EXPORTED_SMART_CHART_LIST_SUCCESS = "GET_EXPORTED_SMART_CHART_LIST_SUCCESS";
export const GET_EXPORTED_SMART_CHART_LIST_FAILURE = "GET_EXPORTED_SMART_CHART_LIST_FAILURE";

export const DELETE_SMART_CHART_REPORT_REQUEST = "DELETE_SMART_CHART_REPORT_REQUEST";
export const DELETE_SMART_CHART_REPORT_SUCCESS = "DELETE_SMART_CHART_REPORT_SUCCESS";
export const DELETE_SMART_CHART_REPORT_FAILURE = "DELETE_SMART_CHART_REPORT_FAILURE";

export const UPLOAD_DOC_FOR_SMART_REPORT_REQUEST = "UPLOAD_DOC_FOR_SMART_REPORT_REQUEST";
export const UPLOAD_DOC_FOR_SMART_REPORT_SUCCESS = "UPLOAD_DOC_FOR_SMART_REPORT_SUCCESS";
export const UPLOAD_DOC_FOR_SMART_REPORT_FAILURE = "UPLOAD_DOC_FOR_SMART_REPORT_FAILURE";

export const GET_UPLOADED_DOC_LIST_REQUEST = "GET_UPLOADED_DOC_LIST_REQUEST";
export const GET_UPLOADED_DOC_LIST_SUCCESS = "GET_UPLOADED_DOC_LIST_SUCCESS";
export const GET_UPLOADED_DOC_LIST_FAILURE = "GET_UPLOADED_DOC_LIST_FAILURE";

export const UPDATE_SMART_REPORT_DATA_REQUEST = "UPDATE_SMART_REPORT_DATA_REQUEST";
export const UPDATE_SMART_REPORT_DATA_SUCCESS = "UPDATE_SMART_REPORT_DATA_SUCCESS";
export const UPDATE_SMART_REPORT_DATA_FAILURE = "UPDATE_SMART_REPORT_DATA_FAILURE";

export const GET_TEMPLATE_PROPERTIES_LIST_REQUEST = "GET_TEMPLATE_PROPERTIES_LIST_REQUEST";
export const GET_TEMPLATE_PROPERTIES_LIST_SUCCESS = "GET_TEMPLATE_PROPERTIES_LIST_SUCCESS";
export const GET_TEMPLATE_PROPERTIES_LIST_FAILURE = "GET_TEMPLATE_PROPERTIES_LIST_FAILURE";

export const GET_TEMPLATE_LIST_REQUEST = "GET_TEMPLATE_LIST_REQUEST";
export const GET_TEMPLATE_LIST_SUCCESS = "GET_TEMPLATE_LIST_SUCCESS";
export const GET_TEMPLATE_LIST_FAILURE = "GET_TEMPLATE_LIST_FAILURE";

export const DELETE_USER_DOC_REQUEST = "DELETE_USER_DOC_REQUEST";
export const DELETE_USER_DOC_SUCCESS = "DELETE_USER_DOC_SUCCESS";
export const DELETE_USER_DOC_FAILURE = "DELETE_USER_DOC_FAILURE";

export const GET_CLIENTS_LIST_FOR_SMART_CHART_REQUEST = "GET_CLIENTS_LIST_FOR_SMART_CHART_REQUEST";
export const GET_CLIENTS_LIST_FOR_SMART_CHART_SUCCESS = "GET_CLIENTS_LIST_FOR_SMART_CHART_SUCCESS";
export const GET_CLIENTS_LIST_FOR_SMART_CHART_FAILURE = "GET_CLIENTS_LIST_FOR_SMART_CHART_FAILURE";

export const UPDATE_DOC_ORDER_REQUEST = "UPDATE_DOC_ORDER_REQUEST";
export const UPDATE_DOC_ORDER_SUCCESS = "UPDATE_DOC_ORDER_SUCCESS";
export const UPDATE_DOC_ORDER_FAILURE = "UPDATE_DOC_ORDER_FAILURE";

export const UPDATE_USER_DOC_DATA_REQUEST = "UPDATE_USER_DOC_DATA_REQUEST";
export const UPDATE_USER_DOC_DATA_SUCCESS = "UPDATE_USER_DOC_DATA_SUCCESS";
export const UPDATE_USER_DOC_DATA_FAILURE = "UPDATE_USER_DOC_DATA_FAILURE";

export const UPDATE_SMART_CHART_PROPERTY_REQUEST = "UPDATE_SMART_CHART_PROPERTY_REQUEST";
export const UPDATE_SMART_CHART_PROPERTY_SUCCESS = "UPDATE_SMART_CHART_PROPERTY_SUCCESS";
export const UPDATE_SMART_CHART_PROPERTY_FAILURE = "UPDATE_SMART_CHART_PROPERTY_FAILURE";

export const GET_SMART_CHART_PROPERTIES_LIST_REQUEST = "GET_SMART_CHART_PROPERTIES_LIST_REQUEST";
export const GET_SMART_CHART_PROPERTIES_LIST_SUCCESS = "GET_SMART_CHART_PROPERTIES_LIST_SUCCESS";
export const GET_SMART_CHART_PROPERTIES_LIST_FAILURE = "GET_SMART_CHART_PROPERTIES_LIST_FAILURE";

export const GET_SMART_CHART_PROPERTY_BY_ID_REQUEST = "GET_SMART_CHART_PROPERTY_BY_ID_REQUEST";
export const GET_SMART_CHART_PROPERTY_BY_ID_SUCCESS = "GET_SMART_CHART_PROPERTY_BY_ID_SUCCESS";
export const GET_SMART_CHART_PROPERTY_BY_ID_FAILURE = "GET_SMART_CHART_PROPERTY_BY_ID_FAILURE";

export const UPDATE_SMART_REPORT_ENTITY_PARAMS_SUCCESS = "UPDATE_SMART_REPORT_ENTITY_PARAMS_SUCCESS";
export const UPDATE_SMART_REPORT_ENTITY_PARAMS_FAILURE = "UPDATE_SMART_REPORT_ENTITY_PARAMS_FAILURE";

export const GET_UPLOADED_IMAGE_LIST_REQUEST = "GET_UPLOADED_IMAGE_LIST_REQUEST";
export const GET_UPLOADED_IMAGE_LIST_SUCCESS = "GET_UPLOADED_IMAGE_LIST_SUCCESS";
export const GET_UPLOADED_IMAGE_LIST_FAILURE = "GET_UPLOADED_IMAGE_LIST_FAILURE";

export const SAVE_AND_EXPORT_SMART_CHART_DATA_REQUEST = "SAVE_AND_EXPORT_SMART_CHART_DATA_REQUEST";
export const SAVE_AND_EXPORT_SMART_CHART_DATA_SUCCESS = "SAVE_AND_EXPORT_SMART_CHART_DATA_SUCCESS";
export const SAVE_AND_EXPORT_SMART_CHART_DATA_FAILURE = "SAVE_AND_EXPORT_SMART_CHART_DATA_FAILURE";

export const DELETE_SMART_CHART_REPORT_TEMPLATE_REQUEST = "DELETE_SMART_CHART_REPORT_TEMPLATE_REQUEST";
export const DELETE_SMART_CHART_REPORT_TEMPLATE_SUCCESS = "DELETE_SMART_CHART_REPORT_TEMPLATE_SUCCESS";
export const DELETE_SMART_CHART_REPORT_TEMPLATE_FAILURE = "DELETE_SMART_CHART_REPORT_TEMPLATE_FAILURE";

export const GET_REPORTS_BY_TEMPLATE_LIST_REQUEST = "GET_REPORTS_BY_TEMPLATE_LIST_REQUEST";
export const GET_REPORTS_BY_TEMPLATE_LIST_SUCCESS = "GET_REPORTS_BY_TEMPLATE_LIST_SUCCESS";
export const GET_REPORTS_BY_TEMPLATE_LIST_FAILURE = "GET_REPORTS_BY_TEMPLATE_LIST_FAILURE";

export const ASSIGN_IMAGES_TO_SMART_CHARTS_REQUEST = "ASSIGN_IMAGES_TO_SMART_CHARTS_REQUEST";
export const ASSIGN_IMAGES_TO_SMART_CHARTS_SUCCESS = "ASSIGN_IMAGES_TO_SMART_CHARTS_SUCCESS";
export const ASSIGN_IMAGES_TO_SMART_CHARTS_FAILURE = "ASSIGN_IMAGES_TO_SMART_CHARTS_FAILURE";

export const LOCK_SMART_CHART_TEMPLATE_REQUEST = "LOCK_SMART_CHART_TEMPLATE_REQUEST";
export const LOCK_SMART_CHART_TEMPLATE_SUCCESS = "LOCK_SMART_CHART_TEMPLATE_SUCCESS";
export const LOCK_SMART_CHART_TEMPLATE_FAILURE = "LOCK_SMART_CHART_TEMPLATE_FAILURE";

export const DEFAULT_PROPERTY_VALUE = {
    project: {
        band1: {
            mfilter: {},
            type: {
                regions: {
                    table_view: "",
                    summary_view: { chart_type: ["pie_3d"] },
                    detailed_view: { chart_type: ["stacked_column_2d"] }
                },
                sites: { table_view: "", summary_view: { chart_type: ["pie_3d"] }, detailed_view: { chart_type: ["stacked_column_2d"] } },
                buildings: {
                    table_view: "",
                    summary_view: { chart_type: ["pie_3d"] },
                    detailed_view: { chart_type: ["stacked_column_2d"] }
                },
                additions: {
                    table_view: "",
                    summary_view: {
                        chart_type: ["pie_3d"]
                    },
                    detailed_view: {
                        chart_type: ["stacked_column_2d"]
                    }
                },
                sorted_recom: {
                    band1: {
                        mfilter: {},
                        type: ["building"]
                    }
                },
                criticality: {
                    table_view: "",
                    summary_view: {
                        chart_type: ["pie_3d"]
                    },
                    detailed_view: {
                        chart_type: ["stacked_column_2d"]
                    }
                },
                categories: {
                    table_view: "",
                    summary_view: {
                        chart_type: ["pie_3d"]
                    },
                    detailed_view: {
                        chart_type: ["stacked_column_2d"]
                    }
                },
                funding_sources: {
                    table_view: "",
                    summary_view: {
                        chart_type: ["pie_3d"]
                    },
                    detailed_view: {
                        chart_type: ["stacked_column_2d"]
                    }
                },
                priorities: {
                    table_view: "",
                    summary_view: {
                        chart_type: ["pie_3d"]
                    },
                    detailed_view: {
                        chart_type: ["stacked_column_2d"]
                    }
                },
                trades: {
                    table_view: "",
                    summary_view: {
                        chart_type: ["pie_3d"]
                    },
                    detailed_view: {
                        chart_type: ["stacked_column_2d"]
                    }
                },
                system: {
                    trade_ids: [],
                    table_view: "",
                    summary_view: {
                        chart_type: ["pie_3d"]
                    },
                    detailed_view: { chart_type: ["stacked_column_2d"] }
                },
                capital_type: {
                    table_view: "",
                    summary_view: {
                        chart_type: ["pie_3d"]
                    },
                    detailed_view: {
                        chart_type: ["stacked_column_2d"]
                    }
                },
                EFCI: {
                    detailed_view: {
                        chart_type: ["line_column_2d"]
                    }
                },
                energy_band: "",
                water_band: ""
            }
        }
    },
    assets: {
        band1: {
            mfilter: {},
            type: {
                end_servicelife_year_condition: {
                    table_view: "",
                    detailed_view: { chart_type: ["stacked_column_2d", "stacked_column_3d"] }
                },
                asset_age_by_condition: {
                    table_view: "",
                    detailed_view: { chart_type: ["stacked_column_2d", "stacked_column_3d"] }
                },
                asset_capital_spending_plan: {
                    table_view: "",
                    summary_view: { chart_type: ["pie_2d", "pie_3d"] },
                    detailed_view: { chart_type: ["stacked_column_2d", "stacked_column_3d"] }
                },
                asset_system_facility: {
                    table_view: "",
                    detailed_view: { chart_type: ["stacked_column_2d", "stacked_column_3d"] }
                }
            }
        }
    },
    energy_mng: {
        band1: {
            mfilter: {},
            type: {
                em_eui_building_breakdown: { detailed_view: { chart_type: ["stacked_column_2d"] } },
                bld_brkdown_energy_usage: { summary_view: { chart_type: ["pie_2d"] } },
                em_eui_site_brkdown_energy_use: { detailed_view: { chart_type: ["stacked_column_2d"] } },
                em_eui_energy_usage: { summary_view: { chart_type: ["pie_2d"] } },
                bld_brkdown_energy_cost: { summary_view: { chart_type: ["pie_2d"] } },
                em_eci_site_cost: { detailed_view: { chart_type: ["stacked_column_2d"] } },
                em_eci_energy_cost: { summary_view: { chart_type: ["pie_2d", "pie_3d"] } },
                energy_band: "",
                water_band: ""
            }
        }
    }
};
