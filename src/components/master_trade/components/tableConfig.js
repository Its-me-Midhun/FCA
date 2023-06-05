export const tradeTableData = {
    keys: ["name", "display_name", "description", "created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "master_trades.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_trades",
            commonSearchKey: "master_trades",
            commonSearchObjectKey: "name"
        },
        display_name: {
            isVisible: true,
            label: "Display Name",
            class: "",
            searchKey: "master_trades.display_name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_trades",
            commonSearchKey: "master_trades",
            commonSearchObjectKey: "display_name"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "master_trades.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_trades",
            commonSearchKey: "master_trades",
            commonSearchObjectKey: "description"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "master_trades.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_trades",
            commonSearchKey: "master_trades",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "master_trades.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_trades",
            commonSearchKey: "master_trades",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
