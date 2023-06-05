export const FONT_FAMILY = [
    "Barlow Condensed Medium",
    "Barlow Condensed",
    "Calibre (Body)",
    "Calibre Medium",
    "Calibre",
    "Calibri (Body)",
    "Financier Display",
    "Futura Bk BT",
    "Futura Md BT (Headings)",
    "Futura Md BT",
    "Times New Roman"
];

export const HEADINGS = [
    { label: "Header 1", value: "h1" },
    { label: "Header 2", value: "h2" },
    { label: "Header 3", value: "h3" }
];
export const ALIGNMENTS = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" }
];
export const TABLE_STYLE = [
    "CBRE Table - Emerald Option 1",
    "CBRE Table - Emerald Option 2",
    "CBRE Table - Emerald Option 3 Compact",
    "CBRE Table Simple Accent Green",
    "CBRE Table Simple Light Grey",
    "CBRE Table - zInvisible",
    "GWS Table Compact",
    "GWS Case Study",
    "GWS Table Option 1",
    "GWS Table Option 2",
    "Table Grid"
];

export const SPACING_RULE = [
    { label: "Single", value: "SINGLE" },
    { label: "1.5 lines", value: "ONE_POINT_FIVE" },
    { label: "Double", value: "DOUBLE" },
    { label: "At least", value: "AT_LEAST" },
    { label: "Exactly", value: "EXACTLY" },
    { label: "Multiple", value: "MULTIPLE" }
];

export const LIST_STYLES = [{ value: "List Bullet" }, { value: "List Bullet + dot + 11 pt" }];

export const FONT_COLOR = [
    "#4D4D4D",
    "#999999",
    "#FFFFFF",
    "#F44E3B",
    "#FE9200",
    "#FCDC00",
    "#DBDF00",
    "#A4DD00",
    "#68CCCA",
    "#73D8FF",
    "#AEA1FF",
    "#FDA1FF",
    "#333333",
    "#808080",
    "#cccccc",
    "#D33115",
    "#E27300",
    "#FCC400",
    "#B0BC00",
    "#68BC00",
    "#16A5A5",
    "#009CE0",
    "#7B64FF",
    "#FA28FF",
    "#000000",
    "#666666",
    "#B3B3B3",
    "#9F0500",
    "#C45100",
    "#FB9E00",
    "#808900",
    "#194D33",
    "#0C797D",
    "#006A4D",
    "#00A657",
    "#0062B1",
    "#653294",
    "#AB149E",
    "#404040",
    "#BFD857"
];

export const GET_PROPERTIES_REQUEST = "GET_PROPERTIES_REQUEST";
export const GET_PROPERTIES_SUCCESS = "GET_PROPERTIES_SUCCESS";
export const GET_PROPERTIES_FAILURE = "GET_PROPERTIES_FAILURE";

export const ADD_PROPERTY_REQUEST = "ADD_PROPERTY_REQUEST";
export const ADD_PROPERTY_SUCCESS = "ADD_PROPERTY_SUCCESS";
export const ADD_PROPERTY_FAILURE = "ADD_PROPERTY_FAILURE";

export const GET_PROPERTY_BY_ID_REQUEST = "GET_PROPERTY_BY_ID_REQUEST";
export const GET_PROPERTY_BY_ID_SUCCESS = "GET_PROPERTY_BY_ID_SUCCESS";
export const GET_PROPERTY_BY_ID_FAILURE = "GET_PROPERTY_BY_ID_FAILURE";

export const UPDATE_PROPERTY_REQUEST = "UPDATE_PROPERTY_REQUEST";
export const UPDATE_PROPERTY_SUCCESS = "UPDATE_PROPERTY_SUCCESS";
export const UPDATE_PROPERTY_FAILURE = "UPDATE_PROPERTY_FAILURE";

export const UPDATE_PROPERTY_ENTITY_PARAMS_SUCCESS = "UPDATE_PROPERTY_ENTITY_PARAMS_SUCCESS";
export const UPDATE_PROPERTY_ENTITY_PARAMS_FAILURE = "UPDATE_PROPERTY_ENTITY_PARAMS_FAILURE";

export const GET_LIST_FOR_COMMON_FILTER_REQUEST = "GET_LIST_FOR_COMMON_FILTER_REQUEST";
export const GET_LIST_FOR_COMMON_FILTER_SUCCESS = "GET_LIST_FOR_COMMON_FILTER_SUCCESS";
export const GET_LIST_FOR_COMMON_FILTER_FAILURE = "GET_LIST_FOR_COMMON_FILTER_FAILURE";

export const GET_ALL_PROPERTY_LOG_REQUEST = "GET_ALL_PROPERTY_LOG_REQUEST";
export const GET_ALL_PROPERTY_LOG_SUCCESS = "GET_ALL_PROPERTY_LOG_SUCCESS";
export const GET_ALL_PROPERTY_LOG_FAILURE = "GET_ALL_PROPERTY_LOG_FAILURE";

export const RESTORE_PROPERTY_LOG_REQUEST = "RESTORE_PROPERTY_LOG_REQUEST";
export const RESTORE_PROPERTY_LOG_SUCCESS = "RESTORE_PROPERTY_LOG_SUCCESS";
export const RESTORE_PROPERTY_LOG_FAILURE = "RESTORE_PROPERTY_LOG_FAILURE";

export const DELETE_PROPERTY_LOG_REQUEST = "DELETE_PROPERTY_LOG_REQUEST";
export const DELETE_PROPERTY_LOG_SUCCESS = "DELETE_PROPERTY_LOG_SUCCESS";
export const DELETE_PROPERTY_LOG_FAILURE = "DELETE_PROPERTY_LOG_FAILURE";

export const GET_PROPERTY_EXPORT_REQUEST = "GET_PROPERTY_EXPORT_REQUEST";
export const GET_PROPERTY_EXPORT_SUCCESS = "GET_PROPERTY_EXPORT_SUCCESS";
export const GET_PROPERTY_EXPORT_FAILURE = "GET_PROPERTY_EXPORT_FAILURE";

export const DELETE_PROPERTY_REQUEST = "DELETE_PROPERTY_REQUEST";
export const DELETE_PROPERTY_SUCCESS = "DELETE_PROPERTY_SUCCESS";
export const DELETE_PROPERTY_FAILURE = "DELETE_PROPERTY_FAILURE";

export const RESTORE_PROPERTY_REQUEST = "RESTORE_PROPERTY_REQUEST";
export const RESTORE_PROPERTY_SUCCESS = "RESTORE_PROPERTY_SUCCESS";
export const RESTORE_PROPERTY_FAILURE = "RESTORE_PROPERTY_FAILURE";

export const CHECK_PROPERTY_REQUEST = "CHECK_PROPERTY_REQUEST";
export const CHECK_PROPERTY_SUCCESS = "CHECK_PROPERTY_SUCCESS";
export const CHECK_PROPERTY_FAILURE = "CHECK_PROPERTY_FAILURE";

export const GET_PROPERTY_DROPDOWN_REQUEST = "GET_PROPERTY_DROPDOWN_REQUEST";
export const GET_PROPERTY_DROPDOWN_SUCCESS = "GET_PROPERTY_DROPDOWN_SUCCESS";
export const GET_PROPERTY_DROPDOWN_FAILURE = "GET_PROPERTY_DROPDOWN_FAILURE";

/**
 * CBRE Default report propertis
 */
// export const default_state = {
//     name: "",
//     description: "",
//     notes: "",
//     header_style1: {
//         trade: { tag: "h1", font_size: 28, font_name: "Futura Md BT", font_color: "006A4D" },
//         system: { tag: "h2", font_size: 16, font_name: "Futura Md BT", font_color: "006A4D" },
//         subsystem: { tag: "h3", font_size: 14, font_name: "Futura Md BT", font_color: "00A657" }
//     },
//     header_style2: {
//         recommendations: {
//             text: "Recommendations",
//             tag: "h3",
//             header_font_name: "Futura Md BT",
//             header_font_size: 14,
//             header_font_color: "00A657",
//             para_font_name: "Futura Bk BT",
//             para_font_size: 11,
//             para_font_color: "404040",
//             line_spacing_rule: "MULTIPLE",
//             line_spacing: 1.05,
//             para_spacing: 12
//         }
//     },
//     para_style: {
//         font_name: "Futura Bk BT",
//         font_color: "404040",
//         font_size: 11,
//         highlight_color: "YELLOW",
//         line_spacing_rule: "MULTIPLE",
//         line_spacing: 1.05,
//         para_spacing: 6
//     },
//     caption_style: {
//         font_name: "Futura Md BT",
//         font_color: "006A4D",
//         font_size: 11
//     },
//     caption_style1: {
//         font_name: "Futura Md BT (Headings)",
//         font_color: "006A4D",
//         font_size: 10
//     },
//     table_style: {
//         table_style: "GWS Table Option 2",
//         header_font_name: "Futura Md BT (Headings)",
//         header_font_size: 10,
//         body_font_name: "Futura Bk BT",
//         body_font_size: 10,
//         body_font_color: "404040",
//         footer_bkg_color: "BFD857",
//         footer_font_name: "Futura Md BT (Headings)",
//         footer_font_size: 10,
//         footer_font_color: "404040"
//     }
// };
