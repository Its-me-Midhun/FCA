export const systemTableData = {
    keys: ["name", "trade", "description", "created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "master_systems.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_systems",
            commonSearchKey: "master_systems",
            commonSearchObjectKey: "name"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "master_systems.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_systems",
            commonSearchKey: "master_systems",
            commonSearchObjectKey: "description"
        },
        trade: {
            isVisible: true,
            label: "Trade",
            class: "",
            searchKey: "master_trades.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "master_trades",
            commonSearchKey: "master_trades",
            commonSearchObjectKey: "name"
        },

        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "master_systems.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_systems",
            commonSearchKey: "master_systems",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "master_systems.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_systems",
            commonSearchKey: "master_systems",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
