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
    "#BFD857",
    
];

export const FRAME_STYLES=[
    {name:"single", description:"a single line"},
    {name:"dashDotStroked", description:"a line with a series of alternating thin and thick strokes"},
    {name:"dashed", description:"a dashed line"},
    {name:"dashSmallGap",description: "a dashed line with small gaps"},
    {name:"dotDash",description: "a line with alternating dots and dashes"},
    {name:"dotDotDash",decription:"a line with a repeating dot - dot - dash sequence"},
    {name:"dotted",decription:"a dotted line"},
    {name:"double",decription:"a double line"},
    {name:"doubleWave",decription:"a double wavy line"},
    {name:"inset",decription:"an inset set of lines"},
    {name:"outset",decription:"an outset set of lines"},
    {name:"thick",decription:"a single line"},
    {name:"thickThinLargeGap",decription:"a thick line contained within a thin line with a large-sized intermediate gap"},
    {name:"thickThinMediumGap",decription:"a thick line contained within a thin line with a medium-sized intermediate gap"},
    {name:"thickThinSmallGap",decription:"a thick line contained within a thin line with a small intermediate gap"},
    {name:"thinThickLargeGap",decription:"a thin line contained within a thick line with a large-sized intermediate gap"},
    {name:"thinThickMediumGap",decription:"a thick line contained within a thin line with a medium-sized intermediate gap"},
    {name:"thinThickSmallGap",decription:"a thick line contained within a thin line with a small intermediate gap"},
    {name:"thinThickThinLargeGap",decription:"a thin-thick-thin line with a large gap"},
    {name:"thinThickThinMediumGap",decription:"a thin-thick-thin line with a medium gap"},
    {name:"thinThickThinSmallGap",decription:"a thin-thick-thin line with a small gap"},
    {name:"threeDEmboss",decription:"a three-staged gradient line, getting darker towards the paragraph"},
    {name:"threeDEngrave",decription:"a three-staged gradient like, getting darker away from the paragraph"},
    {name:"triple",decription:"a triple line"},
    {name:"wave",decription:"a wavy line"}
]

export const GET_CHART_PROPERTIES_REQUEST = "GET_CHART_PROPERTIES_REQUEST";
export const GET_CHART_PROPERTIES_SUCCESS = "GET_CHART_PROPERTIES_SUCCESS";
export const GET_CHART_PROPERTIES_FAILURE = "GET_CHART_PROPERTIES_FAILURE";

export const ADD_CHART_PROPERTY_REQUEST = "ADD_CHART_PROPERTY_REQUEST";
export const ADD_CHART_PROPERTY_SUCCESS = "ADD_CHART_PROPERTY_SUCCESS";
export const ADD_CHART_PROPERTY_FAILURE = "ADD_CHART_PROPERTY_FAILURE";

export const GET_CHART_PROPERTY_BY_ID_REQUEST = "GET_CHART_PROPERTY_BY_ID_REQUEST";
export const GET_CHART_PROPERTY_BY_ID_SUCCESS = "GET_CHART_PROPERTY_BY_ID_SUCCESS";
export const GET_CHART_PROPERTY_BY_ID_FAILURE = "GET_CHART_PROPERTY_BY_ID_FAILURE";

export const UPDATE_CHART_PROPERTY_REQUEST = "UPDATE_CHART_PROPERTY_REQUEST";
export const UPDATE_CHART_PROPERTY_SUCCESS = "UPDATE_CHART_PROPERTY_SUCCESS";
export const UPDATE_CHART_PROPERTY_FAILURE = "UPDATE_CHART_PROPERTY_FAILURE";

export const UPDATE_CHART_PROPERTY_ENTITY_PARAMS_SUCCESS = "UPDATE_CHART_PROPERTY_ENTITY_PARAMS_SUCCESS";
export const UPDATE_CHART_PROPERTY_ENTITY_PARAMS_FAILURE = "UPDATE_CHART_PROPERTY_ENTITY_PARAMS_FAILURE";

export const GET_LIST_FOR_COMMON_FILTER_REQUEST = "GET_LIST_FOR_COMMON_FILTER_REQUEST";
export const GET_LIST_FOR_COMMON_FILTER_SUCCESS = "GET_LIST_FOR_COMMON_FILTER_SUCCESS";
export const GET_LIST_FOR_COMMON_FILTER_FAILURE = "GET_LIST_FOR_COMMON_FILTER_FAILURE";

export const GET_ALL_CHART_PROPERTY_LOG_REQUEST = "GET_ALL_CHART_PROPERTY_LOG_REQUEST";
export const GET_ALL_CHART_PROPERTY_LOG_SUCCESS = "GET_ALL_CHART_PROPERTY_LOG_SUCCESS";
export const GET_ALL_CHART_PROPERTY_LOG_FAILURE = "GET_ALL_CHART_PROPERTY_LOG_FAILURE";

export const RESTORE_CHART_PROPERTY_LOG_REQUEST = "RESTORE_CHART_PROPERTY_LOG_REQUEST";
export const RESTORE_CHART_PROPERTY_LOG_SUCCESS = "RESTORE_CHART_PROPERTY_LOG_SUCCESS";
export const RESTORE_CHART_PROPERTY_LOG_FAILURE = "RESTORE_CHART_PROPERTY_LOG_FAILURE";

export const DELETE_CHART_PROPERTY_LOG_REQUEST = "DELETE_CHART_PROPERTY_LOG_REQUEST";
export const DELETE_CHART_PROPERTY_LOG_SUCCESS = "DELETE_CHART_PROPERTY_LOG_SUCCESS";
export const DELETE_CHART_PROPERTY_LOG_FAILURE = "DELETE_CHART_PROPERTY_LOG_FAILURE";

export const GET_CHART_PROPERTY_EXPORT_REQUEST = "GET_CHART_PROPERTY_EXPORT_REQUEST";
export const GET_CHART_PROPERTY_EXPORT_SUCCESS = "GET_CHART_PROPERTY_EXPORT_SUCCESS";
export const GET_CHART_PROPERTY_EXPORT_FAILURE = "GET_CHART_PROPERTY_EXPORT_FAILURE";

export const DELETE_CHART_PROPERTY_REQUEST = "DELETE_CHART_PROPERTY_REQUEST";
export const DELETE_CHART_PROPERTY_SUCCESS = "DELETE_CHART_PROPERTY_SUCCESS";
export const DELETE_CHART_PROPERTY_FAILURE = "DELETE_CHART_PROPERTY_FAILURE";

export const RESTORE_CHART_PROPERTY_REQUEST = "RESTORE_CHART_PROPERTY_REQUEST";
export const RESTORE_CHART_PROPERTY_SUCCESS = "RESTORE_CHART_PROPERTY_SUCCESS";
export const RESTORE_CHART_PROPERTY_FAILURE = "RESTORE_CHART_PROPERTY_FAILURE";

export const CHECK_CHART_PROPERTY_REQUEST = "CHECK_CHART_PROPERTY_REQUEST";
export const CHECK_CHART_PROPERTY_SUCCESS = "CHECK_CHART_PROPERTY_SUCCESS";
export const CHECK_CHART_PROPERTY_FAILURE = "CHECK_CHART_PROPERTY_FAILURE";

export const GET_CHART_PROPERTY_DROPDOWN_REQUEST = "GET_CHART_PROPERTY_DROPDOWN_REQUEST";
export const GET_CHART_PROPERTY_DROPDOWN_SUCCESS = "GET_CHART_PROPERTY_DROPDOWN_SUCCESS";
export const GET_CHART_PROPERTY_DROPDOWN_FAILURE = "GET_CHART_PROPERTY_DROPDOWN_FAILURE";

export const UPDATE_CHART_SORT_PROPERTY_REQUEST = "UPDATE_CHART_SORT_PROPERTY_REQUEST";
export const UPDATE_CHART_SORT_PROPERTY_SUCCESS = "UPDATE_CHART_SORT_PROPERTY_SUCCESS";
export const UPDATE_CHART_SORT_PROPERTY_FAILURE = "UPDATE_CHART_SORT_PROPERTY_FAILURE";