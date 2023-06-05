import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { uniqBy } from "lodash";

import Loader from "../../common/components/Loader";
import { withRouter } from "react-router-dom";

class InitialFundingOptionsTable extends Component {
    state = {
        loading: false,
        selectedCell: null,
        initialCellValue: null
    };

    render() {
        const {
            efciBuildingData: { funding_options = [] },
            hiddenFundingOptionList,
            updateAnnualEfciCalculation,
            updateFcis,
            toggleLoader
        } = this.props;
        return (
            <>
                <table className="table table-common table-froze">
                    <thead>
                        <tr>
                            <th className="img-sq-box">
                                <img src="/img/sq-box.png" alt="" />
                            </th>
                            <th className="build-add">
                                Title<i className="fas fa-sort"></i>
                            </th>
                            {funding_options.length &&
                                funding_options[0].annual_efcis.map(item => (
                                    <th className="build-year">
                                        {item.year} <i className="fas fa-sort"></i>
                                    </th>
                                ))}
                            <th className="action">EFCI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funding_options.length &&
                            uniqBy(funding_options, "funding").map(item => (
                                <>
                                    {!hiddenFundingOptionList.includes(item.id) ? (
                                        <tr>
                                            <td className="text-center">
                                                <img src="/img/sq-box.png" alt="" />
                                            </td>
                                            <td className="pos-otr">{item.efci_title}</td>
                                            {uniqBy(item.annual_efcis, "year").map(data => (
                                                <td className={`${data.edited ? "close-otr-section" : ""} pos-otr`} style={{ backgroundColor: `${data.color || ""}` }}>
                                                    <div className="pos-sec">
                                                        <>
                                                            <NumberFormat
                                                                className={`${!this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"} ${data.value < 0 ? "fc-neg" : ""} ${data.color ? "text-light" : ""}`}
                                                                style={{ backgroundColor: `${data.color || ""}` }}
                                                                displayType={this.props.efciBuildingData.locked ? "text" : "input"}
                                                                value={data.value}
                                                                onFocus={async () => {
                                                                    await this.setState({
                                                                        selectedCell: data.id,
                                                                        initialCellValue: data.value
                                                                    });
                                                                }}
                                                                onValueChange={async values => {
                                                                    const { value } = values;
                                                                    await updateAnnualEfciCalculation(data.id, value);
                                                                }}
                                                                onKeyPress={async event => {
                                                                    if (event.key === "Enter") {
                                                                        this.setState({
                                                                            target: event.target
                                                                        })
                                                                        await toggleLoader();
                                                                        await updateFcis(data.id, { value: data.value });
                                                                        await this.setState({
                                                                            selectedCell: data.id,
                                                                            initialCellValue: data.value
                                                                        });
                                                                        await toggleLoader();
                                                                        this.state.target.blur();
                                                                    }
                                                                }}
                                                                onBlur={async () => {
                                                                    await updateAnnualEfciCalculation(data.id, this.state.initialCellValue);
                                                                    await this.setState({
                                                                        selectedCell: null,
                                                                        initialCellValue: null
                                                                    });
                                                                }}
                                                            />
                                                            {this.state.selectedCell === data.id ? <i className="fas fa-times"></i> : null}
                                                            {data.edited ?
                                                                <i className="fa fa-circle cursor-hand" aria-hidden="true"
                                                                    onClick={() => this.props.showLogsTableAnnualEfci && this.props.showLogsTableAnnualEfci(data.id)}
                                                                ></i>
                                                                : null}
                                                        </>
                                                    </div>
                                                </td>
                                            ))}
                                            <td class={`${item.actual_color ? "text-light" : ""}`} style={{ backgroundColor: `${item.actual_color || ""}` }}>
                                                <span className="tot-dtl">{item.actual_efci}</span>
                                            </td>
                                        </tr>
                                    ) : null}
                                </>
                            ))}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(InitialFundingOptionsTable);
