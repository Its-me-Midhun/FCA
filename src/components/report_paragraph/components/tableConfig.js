export const reportParagraphTableData = {
    keys: ["name", "special_report", "note", "description", "created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "report_paragraph.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_paragraph",
            commonSearchKey: "report_paragraph",
            commonSearchObjectKey: "name"
        },
        special_report: {
            isVisible: true,
            label: "Special Report",
            class: "",
            searchKey: "special_reports.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "special_reports",
            commonSearchKey: "special_reports",
            commonSearchObjectKey: "name"
        },
        note: {
            isVisible: true,
            label: "Note",
            class: "",
            searchKey: "report_paragraph.note",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_paragraph",
            commonSearchKey: "report_paragraph",
            commonSearchObjectKey: "note"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "report_paragraph.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_paragraph",
            commonSearchKey: "report_paragraph",
            commonSearchObjectKey: "description"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "report_paragraph.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_paragraph",
            commonSearchKey: "report_paragraph",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "report_paragraph.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_paragraph",
            commonSearchKey: "report_paragraph",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
