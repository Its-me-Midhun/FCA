import React, { Component } from "react";
import Table from "../../common/components/Table";
import NumberFormat from "react-number-format";
import NonProratedDM from "./NonProratedDM";
import ProratedDM from "./ProratedDM";
import TableTopIcons from "../../common/components/TableTopIcons";

class DifferedMaintenance extends Component {
    state = {
        activeTab: false,
        activeTabString: "Non Prorated DM"
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

        if (this.props.proDifferedMaintenance && this.props.proDifferedMaintenance.data && this.props.proDifferedMaintenance.data.length) {
            this.props.proDifferedMaintenance.data.forEach(function (row) {
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

        if (this.props.differedMaintenance && this.props.differedMaintenance.data && this.props.differedMaintenance.data.length) {
            this.props.differedMaintenance.data.forEach(function (row) {
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
            this.props.siteList.filter(item => {
                return item.key == this.props.siteId;
            });
        let grandTotal = 0;
        let proGrandTotal = 0;
        let nonProGrandTotal = 0;
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
                {this.props.differedMaintenance && this.props.differedMaintenance.data && this.props.differedMaintenance.data.length ? (
                    <div class="tab-active dm-container location-sec image-sec tab-grey">
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
                                        entity="differed_maintenances"
                                    />
                                    <button
                                        class={this.state.activeTab == false ? "btn-fci active" : "btn-fci"}
                                        data-toggle="modal"
                                        data-target="#Modal-build"
                                        onClick={() => {
                                            this.setState({ activeTab: false, activeTabString: "Non Prorated DM" });
                                        }}
                                    >
                                        Non Prorated DM
                                    </button>
                                    <button
                                        class={this.state.activeTab == true ? "btn-fci active" : "btn-fci"}
                                        data-toggle="modal"
                                        data-target="#Modal-build"
                                        onClick={() => {
                                            this.setState({ activeTab: true, activeTabString: "Prorated DM" });
                                        }}
                                    >
                                        Prorated DM
                                    </button>
                                </div>
                            </div>

                            {!this.state.activeTab ? (
                                <>
                                    {this.props.differedMaintenance.data && this.props.differedMaintenance.data.length ? (
                                        <NonProratedDM
                                            differedMaintenance={this.props.differedMaintenance}
                                            activeTabString={this.state.activeTabString}
                                            site={site}
                                            subTotalFutureByYear={subTotalFutureByYear}
                                            grandTotal={nonProGrandTotal}
                                        />
                                    ) : (
                                        <div>
                                            <div class="dtl-sec col-md-12">
                                                <h3>No data found.</h3>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {this.props.proDifferedMaintenance.data && this.props.proDifferedMaintenance.data.length ? (
                                        <ProratedDM
                                            proDifferedMaintenance={this.props.proDifferedMaintenance}
                                            activeTabString={this.state.activeTabString}
                                            site={site}
                                            subTotalByYear={subTotalByYear}
                                            grandTotal={proGrandTotal}
                                        />
                                    ) : (
                                        <div>
                                            <div class="dtl-sec col-md-12">
                                                <h3>No data found.</h3>
                                            </div>
                                        </div>
                                    )}
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
export default DifferedMaintenance;
