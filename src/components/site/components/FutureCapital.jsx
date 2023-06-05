import React, { Component } from "react";
import Table from "../../common/components/Table";
import NumberFormat from "react-number-format";
import ProratdEFCI from "./ProratedEFCI";
import NonProratdEFCI from "./NonProratedEFCI";
import TableTopIcons from "../../common/components/TableTopIcons";

class FutureCapital extends Component {
    state = {
        activeTab: false,
        activeTabString: "Non Prorated FC"
    };

    setTotal(data) {
        let total = 0;
        data.forEach(element => {
            total += parseInt(element.amount);
        });
        return total;
    }

    renderSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;

        if (this.props.profutureCapital && this.props.profutureCapital.data && this.props.profutureCapital.data.length) {
            this.props.profutureCapital.data.forEach(function (row) {
                row.data &&
                    row.data.length &&
                    row.data.forEach(function (item) {
                        obj.push(item);
                    });
            });
            let yearHolder = {};
            obj.forEach(function (d) {
                if (yearHolder.hasOwnProperty(d.year)) {
                    yearHolder[d.year] = yearHolder[d.year] + parseInt(d.amount);
                } else {
                    yearHolder[d.year] = parseInt(d.amount);
                }
            });
            for (let prop in yearHolder) {
                subTotalByYear.push({ year: prop, amount: yearHolder[prop] });
            }
        }
        return subTotalByYear;
    }

    renderFutureSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;

        if (this.props.tableData && this.props.tableData.data) {
            this.props.tableData.data.forEach(function (row) {
                row.data &&
                    row.data.length &&
                    row.data.forEach(function (item) {
                        obj.push(item);
                    });
            });
            let yearHolder = {};
            obj.forEach(function (d) {
                if (yearHolder.hasOwnProperty(d.year)) {
                    yearHolder[d.year] = yearHolder[d.year] + parseInt(d.amount);
                } else {
                    yearHolder[d.year] = parseInt(d.amount);
                }
            });
            for (let prop in yearHolder) {
                subTotalByYear.push({ year: prop, amount: yearHolder[prop] });
            }
        }
        return subTotalByYear;
    }

    render() {
        const { tableData } = this.props;
        let site =
            this.props.siteList &&
            this.props.siteList.length &&
            this.props.siteList.filter(item => {
                return item.key == this.props.siteId;
            });
        let proGrandTotal = 0;
        let nonProGrandTotal = 0;
        // let grandTotal = 0;
        let subTotalByYear = this.renderSubTotalRow();
        subTotalByYear.map(yeatData => {
            proGrandTotal += yeatData.amount;
        });
        let subTotalFutureByYear = this.renderFutureSubTotalRow();
        subTotalFutureByYear.map(yeatData => {
            nonProGrandTotal += yeatData.amount;
        });

        return (
            <>
                {this.props.tableData && this.props.tableData.data && this.props.tableData.data.length ? (
                    <div class="tab-active fc-container location-sec image-sec tab-grey">
                        <div class="dtl-sec col-md-12">
                            <div class="table-top-menu allign-right">
                                <div class="lft">
                                    <h1></h1>
                                </div>

                                <div class="rgt">
                                    <TableTopIcons
                                        hasGlobalSearch={false}
                                        hasSort={false}
                                        hasWildCardFilter={false}
                                        hasView={false}
                                        isExport={false}
                                        hasHelp={true}
                                        entity="future_capitals"
                                    />
                                    <button
                                        class={this.state.activeTab == false ? "btn-fci active" : "btn-fci"}
                                        data-toggle="modal"
                                        data-target="#Modal-build"
                                        onClick={() => {
                                            this.setState({
                                                activeTab: false,
                                                activeTabString: "Non Prorated FC"
                                            });
                                        }}
                                    >
                                        Non Prorated FC
                                    </button>
                                    <button
                                        class={this.state.activeTab == true ? "btn-fci active" : "btn-fci"}
                                        data-toggle="modal"
                                        data-target="#Modal-build"
                                        onClick={() => {
                                            this.setState({ activeTab: true, activeTabString: "Prorated FC" });
                                        }}
                                    >
                                        Prorated FC
                                    </button>
                                </div>
                            </div>

                            {this.state.activeTab ? (
                                <>
                                    <ProratdEFCI
                                        site={site}
                                        grandTotal={proGrandTotal}
                                        subTotalFutureByYear={subTotalByYear}
                                        // subTotalByYear={subTotalByYear}
                                        activeTabString={this.state.activeTabString}
                                        profutureCapital={this.props.profutureCapital}
                                    />
                                </>
                            ) : (
                                <>
                                    <NonProratdEFCI
                                        site={site}
                                        grandTotal={nonProGrandTotal}
                                        subTotalByYear={subTotalFutureByYear}
                                        // subTotalFuttureByYear={subTotalFutureByYear}

                                        tableData={this.props.tableData}
                                        activeTabString={this.state.activeTabString}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div class="tab-active location-sec image-sec tab-grey">
                        <div class="dtl-sec col-md-12">
                            <h3>No data found.</h3>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default FutureCapital;
