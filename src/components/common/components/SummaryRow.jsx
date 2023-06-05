import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import _ from "lodash";
import Loader from "./Loader";

class SummaryRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            region: props.region,
            summaryRow: {}
        };
    }

    setSummaryRowData = () => {
        const { tableData, keys, config, summaryRowData } = this.props;
        if (_.isEmpty(summaryRowData)) return null;
        let temSummaryRow = {};

        tableData.data.map(rowData => {
            keys.map(keyItem => {
                // if ((!isNaN(parseInt(rowData[keyItem])) && config && config[keyItem]?.type === "number") || keyItem == "area") {
                if ((config && config[keyItem]?.type === "number") || keyItem == "area") {
                    if (keyItem === "crv") {
                        temSummaryRow[keyItem] = parseInt(summaryRowData["crv_total"]) || 0;
                    } else if (keyItem === "fca_cost") {
                        temSummaryRow[keyItem] = parseInt(summaryRowData["fca_cost_total"]) || 0;
                    } else if (keyItem === "project_total") {
                        temSummaryRow[keyItem] = summaryRowData[keyItem] === "isLoading" ? "isLoading" : parseInt(summaryRowData[keyItem]) || 0;
                    } else if (keyItem === "cost") {
                        temSummaryRow[keyItem] = parseInt(summaryRowData["cost_total"]) || 0;
                    } else if (keyItem === "area") {
                        temSummaryRow[keyItem] = parseInt(summaryRowData["total_sf"]) || 0;
                    } else if (
                        keyItem !== "year_manufactured" &&
                        keyItem !== "service_life" &&
                        keyItem !== "usefull_life_remaining" &&
                        keyItem !== "area_served" &&
                        keyItem !== "installed_year" &&
                        keyItem !== "quantity" &&
                        keyItem !== "sort_order" &&
                        keyItem !== "current_age"
                    ) {
                        const yearSum = summaryRowData["year_totals"]?.[`${keyItem?.split("_")?.[1]}`] || "";
                        temSummaryRow[keyItem] = yearSum === "isLoading" ? "isLoading" : parseInt(yearSum);
                    }
                }
            });
        });
        return temSummaryRow;
    };

    render() {
        const { keys, config } = this.props;
        let summaryRow = this.setSummaryRowData();
        return (
            <React.Fragment>
                {!_.isEmpty(summaryRow) ? (
                    <tr>
                        <td className="text-center tot-recom"></td>
                        {keys.map((keyItem, i) => {
                            return config[keyItem] && config[keyItem].isVisible ? (
                                <td
                                    key={i}
                                    style={{ ...config[keyItem]?.style }}
                                    className={`${config[keyItem].class} tot-recom ${config[keyItem].pinned ? "pinned" : ""}`}
                                >
                                    <span className="summary-row-column">
                                        {summaryRow[keyItem] !== "isLoading" ? (
                                            <NumberFormat
                                                prefix={keyItem !== "area" ? "$ " : ""}
                                                value={parseInt(summaryRow[keyItem])}
                                                thousandSeparator={true}
                                                displayType={"text"}
                                            />
                                        ) : (
                                            <div className="">
                                                <Loader />
                                            </div>
                                        )}
                                    </span>
                                </td>
                            ) : null;
                        })}
                        <td className="bg-white tot-recom"></td>
                    </tr>
                ) : null}
            </React.Fragment>
        );
    }
}

export default withRouter(SummaryRow);
