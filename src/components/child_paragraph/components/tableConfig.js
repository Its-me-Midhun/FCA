export const childParagraphTableData = {
    keys: ["name", "special_report", "report_paragraph", "note", "description", "created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "child_paragraph.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "child_paragraph",
            commonSearchKey: "child_paragraph",
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
        report_paragraph: {
            isVisible: true,
            label: "Report Paragraph",
            class: "",
            searchKey: "report_paragraphs.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "report_paragraphs",
            commonSearchKey: "report_paragraphs",
            commonSearchObjectKey: "name"
        },
        note: {
            isVisible: true,
            label: "Note",
            class: "",
            searchKey: "child_paragraph.note",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "child_paragraph",
            commonSearchKey: "child_paragraph",
            commonSearchObjectKey: "note"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "child_paragraph.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "child_paragraph",
            commonSearchKey: "child_paragraph",
            commonSearchObjectKey: "description"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "child_paragraph.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "child_paragraph",
            commonSearchKey: "child_paragraph",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "child_paragraph.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "child_paragraph",
            commonSearchKey: "child_paragraph",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
