import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import _ from "lodash";

class SummaryRowEnergy extends Component {
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
                if (config && config[keyItem]?.type === "number") {
                    if (keyItem === "kw_usage") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "kw_cost") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "kwh_cost") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "kwh_usage") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "total_electric_cost") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "mmbtu_transport_cost") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "mmbtu_well_head_cost") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "mmbtu_total_gas_cost") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "mmbtu_usage") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "ccf_usage") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    } else if (keyItem === "ccf_cost") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData[keyItem]) || `0`;
                    }
                }
            });
        });
        return temSummaryRow;
    };

    render() {
        const { keys, config } = this.props;
        let summaryRow = this.setSummaryRowData();
        const dollorVal = ["kw_usage", "kwh_usage", "mmbtu_usage", "ccf_usage"];
        return (
            <React.Fragment>
                {!_.isEmpty(summaryRow) ? (
                    <tr>
                        <td className="text-center tot-recom"></td>
                        {keys.map((keyItem, i) => {
                            return config[keyItem] && config[keyItem].isVisible ? (
                                <td key={i} className={`${config[keyItem].class} tot-recom`}>
                                    <span className="summary-row-column energy-summary-font">
                                        {summaryRow[keyItem] && (
                                            <NumberFormat
                                                prefix={!dollorVal.includes(keyItem) ? "$ " : ""}
                                                value={parseInt(summaryRow[keyItem])}
                                                thousandSeparator={true}
                                                displayType={"text"}
                                            />
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

export default withRouter(SummaryRowEnergy);
