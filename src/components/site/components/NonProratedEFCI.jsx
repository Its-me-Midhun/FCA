import React, { Component } from "react";
import Table from "../../common/components/Table";
import NumberFormat from "react-number-format";
import _, { uniqBy } from "lodash";

class NonProratedEFCI extends Component {
    state = {
        activeTab: false,
        activeTabString: "Non Prorated EFCI"
    };

    setTotal(data) {
        let total = 0;
        data.forEach(element => {
            total += parseInt(element.amount);
        });
        return total;
    }

    render() {
        let filteredData = this.props.tableData.data.map(i => uniqBy(i.data, "year"));
        return (
            <div>
                <div class="table-topper">
                    <div class="col-md-12 otr-topr">
                        <h3>
                            {`${
                                this.props.tableData &&
                                this.props.tableData.data[0].data &&
                                filteredData[0].length
                            }`}
                            -year Capital spending projections
                        </h3>
                        <h4>
                            {this.props.site && this.props.site.length && this.props.site[0].label}
                        </h4>
                        <h4>
                            Yearly Future Capital Spending Summary - {this.props.activeTabString}
                        </h4>
                    </div>
                </div>

                <div class="table-section table-scroll build-fci table-froze">
                    <table class="table table-common">
                        <thead>
                            <tr>
                                <th class="img-sq-box">
                                    <img src="/img/sq-box.png" />
                                </th>
                                <th class="build-add">
                                    Building/Addition <i class="fas fa-sort"></i>
                                </th>
                                {this.props.tableData &&
                                    this.props.tableData.data[0].data.map(i => {
                                        return (
                                            <>
                                                <th class="build-year">
                                                    {i.year} <i class="fas fa-sort"></i>
                                                </th>
                                            </>
                                        );
                                    })}
                                <th class="total">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.tableData &&
                                this.props.tableData.data.map((item, i) => {
                                    return (
                                        <>
                                            <tr>
                                                <td className="img-sq-box">
                                                    <img alt="" src="/img/sq-box.png" />
                                                </td>
                                                <td>{item.name} </td>
                                                {uniqBy(item.data, "year").map(data => {
                                                    return (
                                                        <>
                                                            <td>
                                                                <span
                                                                    class={
                                                                        data.amount == 0
                                                                            ? "txt-dl"
                                                                            : "tot-dl"
                                                                    }
                                                                >
                                                                    <NumberFormat
                                                                        value={parseInt(
                                                                            data.amount
                                                                        )}
                                                                        thousandSeparator={true}
                                                                        displayType={"text"}
                                                                        prefix={"$ "}
                                                                    />
                                                                </span>
                                                            </td>
                                                        </>
                                                    );
                                                })}
                                                <td className="tot-dl">
                                                    <NumberFormat
                                                        value={this.setTotal(item.data)}
                                                        thousandSeparator={true}
                                                        displayType={"text"}
                                                        prefix={"$ "}
                                                    />
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })}
                            <tr class="subtotal">
                                <td class="text-center">
                                    <img src="/img/sq-box.png" />
                                </td>
                                <td class="tot-dl">SUBTOTALS</td>
                                {this.props.subTotalByYear.length ? (
                                    <>
                                        {this.props.subTotalByYear.map((yeatData, i) => (
                                            <td>
                                                <span className="tot-dl" key={i}>
                                                    <NumberFormat
                                                        value={parseInt(yeatData.amount)}
                                                        thousandSeparator={true}
                                                        displayType={"text"}
                                                        prefix={"$ "}
                                                    />
                                                </span>
                                            </td>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                        <td>
                                            <span class="tot-dl">$00</span>
                                        </td>
                                    </>
                                )}
                                <td>
                                    <span className="tot-dl">
                                        <NumberFormat
                                            value={parseInt(this.props.grandTotal)}
                                            thousandSeparator={true}
                                            displayType={"text"}
                                            prefix={"$ "}
                                        />
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
export default NonProratedEFCI;
