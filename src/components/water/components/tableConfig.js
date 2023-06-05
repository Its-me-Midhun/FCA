export const electricTableData = {
    keys: [
        "client",
        "region",
        "site",
        "building",
        "account",
        "account_description",
        "meter",
        "meter_description",
        "meter_type",
        "year",
        "month",
        "ccf_usage",
        "ccf_cost",
        "created_at",
        "updated_at"
    ],
    config: {
        account: {
            isVisible: true,
            label: "Account",
            class: "reg-code",
            searchKey: "accounts.number",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "accounts",
            commonSearchKey: "accounts",
            commonSearchObjectKey: "number"
        },
        account_description: {
            isVisible: false,
            label: "Account Description",
            class: "width-220px",
            searchKey: "accounts.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "accounts",
            commonSearchKey: "accounts",
            commonSearchObjectKey: "description"
        },
        client: {
            isVisible: false,
            label: "Client",
            class: "reg-code",
            searchKey: "clients.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "client",
            commonSearchKey: "clients",
            commonSearchObjectKey: "name"
        },
        region: {
            isVisible: true,
            label: "Region",
            class: "reg-code",
            searchKey: "regions.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "regions",
            commonSearchKey: "regions",
            commonSearchObjectKey: "name"
        },
        site: {
            isVisible: true,
            label: "Site",
            class: "reg-code",
            searchKey: "sites.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "sites",
            commonSearchKey: "sites",
            commonSearchObjectKey: "name"
        },
        building: {
            isVisible: true,
            label: "Building",
            class: "reg-code",
            searchKey: "buildings.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "buildings.name",
            commonSearchKey: "buildings",
            commonSearchObjectKey: "name"
        },
        meter: {
            isVisible: true,
            label: "Meter",
            class: "reg-code",
            searchKey: "meters.meter",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "meters.meter",
            commonSearchKey: "meters",
            commonSearchObjectKey: "meter"
        },
        meter_description: {
            isVisible: false,
            label: "Meter Description",
            class: "width-220px",
            searchKey: "meters.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "meters.description",
            commonSearchKey: "meters",
            commonSearchObjectKey: "meter"
        },
        meter_type: {
            isVisible: false,
            label: "Meter Type",
            class: "reg-code",
            searchKey: "meter_readings.meter_type",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "meter_type",
            commonSearchKey: "meter_type",
            commonSearchObjectKey: "meter_type"
        },
        month: {
            isVisible: true,
            label: "Month",
            class: "custom-tablewidth-small",
            searchKey: "meter_readings.month",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "month",
            commonSearchKey: "meter_readings",
            commonSearchObjectKey: "month"
        },
        year: {
            isVisible: true,
            label: "Year",
            class: "custom-tablewidth-small",
            searchKey: "meter_readings.year",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "year",
            commonSearchKey: "meter_readings",
            commonSearchObjectKey: "year"
        },
        ccf_usage: {
            isVisible: true,
            label: "CCF Usage",
            class: "reg-code",
            searchKey: "meter_readings.ccf_usage",
            type: "number",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "",
            commonSearchKey: "ccf_usage",
            commonSearchObjectKey: "ccf_usage"
        },
        ccf_cost: {
            isVisible: true,
            label: "CCF Cost ($)",
            class: "reg-code",
            searchKey: "meter_readings.ccf_cost",
            type: "number",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "",
            commonSearchKey: "ccf_cost",
            commonSearchObjectKey: "ccf_cost"
        },

        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "meter_readings.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "regions",
            commonSearchKey: "regions",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "meter_readings.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "regions",
            commonSearchKey: "regions",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
