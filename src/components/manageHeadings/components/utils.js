import { v4 as uuid } from "uuid";

export const ITEMS = [
    {
        id: uuid(),
        content: "Text Input",
        type: "input",
        value: "",
        allowed_export_types: ["CTG", "RECOM", "TRD", "FCACRT", "FCICRT", "HRZCRT", "P-FCACRT", "AST-CHRT", "EFCI-CHRT", "ENRG-CHRT", "SOFT-COST"]
    },
    {
        id: uuid(),
        content: "Years",
        type: "text",
        value: "{{{YEARS}}}",
        sample: "10",
        allowed_export_types: [
            "CTG",
            "RECOM",
            "TRD",
            "FCACRT",
            "FCICRT",
            "HRZCRT",
            "P-FCACRT",
            "ENRG-CHRT"
            //  "EFCI-CHRT"
        ]
    },
    {
        id: uuid(),
        content: "Start Year",
        type: "text",
        value: "{{{START_YEAR}}}",
        sample: "2022",
        allowed_export_types: ["P-FCACRT"]
    },
    {
        id: uuid(),
        content: "End Year",
        type: "text",
        value: "{{{END_YEAR}}}",
        sample: "2031",
        allowed_export_types: ["P-FCACRT"]
    },
    {
        id: uuid(),
        content: "Project",
        type: "text",
        value: "{{{PROJECT}}}",
        sample: `"This is Project"`,
        allowed_export_types: [
            "CTG",
            "RECOM",
            "TRD",
            "FCACRT",
            "FCICRT",
            "HRZCRT",
            "P-FCACRT",
            //  "EFCI-CHRT"
            "ENRG-CHRT",
            "SOFT-COST"
        ]
    },
    {
        id: uuid(),
        content: "Client",
        type: "text",
        value: "{{{CLIENT}}}",
        sample: `"This is Client"`,
        allowed_export_types: ["ENRG-CHRT"]
    },
    {
        id: uuid(),
        content: "Facilities",
        type: "text",
        value: "{{{FACILITIES}}}",
        sample: `"This is Facilities"`,
        allowed_export_types: ["CTG", "RECOM", "TRD", "FCACRT", "FCICRT", "HRZCRT", "P-FCACRT"]
    },
    {
        id: uuid(),
        content: "Sort",
        type: "text",
        value: "{{{SORT}}}",
        sample: `"This is Sort"`,
        allowed_export_types: ["RECOM"]
    },
    {
        id: uuid(),
        content: "Chart Type",
        type: "text",
        value: "{{{CHART_TYPE}}}",
        sample: `"This is Chart Type"`,
        allowed_export_types: ["FCACRT", "FCICRT", "HRZCRT", "P-FCACRT", "AST-CHRT", "EFCI-CHRT", "ENRG-CHRT"]
    }
    // {
    //     id: uuid(),
    //     content: "Region",
    //     type: "text",
    //     value: "{{{REGION}}}",
    //     sample: "East Region"
    // },
    // {
    //     id: uuid(),
    //     content: "Site",
    //     type: "text",
    //     value: "{{{SITE}}}",
    //     sample: "ABC Site"
    // },
    // {
    //     id: uuid(),
    //     content: "Building",
    //     type: "text",
    //     value: "{{{BUILDING}}}",
    //     sample: "PQR Building"
    // }
];
export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
/**
 * Moves an item from one list to another list.
 */
export const copy = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
    return destClone;
};

export const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
