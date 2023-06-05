export const electricTableData = {
    keys: ["region", "site", "building", "year", "rating", "created_at", "updated_at"],
    config: {
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
        year: {
            isVisible: true,
            label: "Year",
            class: "custom-tablewidth-small",
            searchKey: "energy_star_ratings.year",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "year",
            commonSearchKey: "energy_star_ratings",
            commonSearchObjectKey: "year"
        },
        rating: {
            isVisible: true,
            label: "Rating",
            class: "custom-tablewidth-small",
            searchKey: "energy_star_ratings.rating",
            type: "number",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "rating",
            commonSearchKey: "energy_star_ratings",
            commonSearchObjectKey: "rating"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "readings.created_at",
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
            getListTable: "updated_at",
            commonSearchKey: "updated_at",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
