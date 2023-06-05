import React, { Component } from "react";
import NumberFormat from "react-number-format";
import _, { uniqBy } from "lodash";
import CSPAssumptions from "./CSPAssumptions";
import CSPSummaryTable from "./CSPSummaryTable";
import BasicSiteInfo from "./BasicSiteInfo";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";

class CSPSummarySite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
        this.toggleLoader = this.toggleLoader.bind(this);
    }

    componentDidMount() {
        this.setTotalRepairCost();
        this.setState({ loading: false })
    }

    setTotal(data) {
        let total = 0;
        data.fundings.map(element => (total += parseInt(element.amount)));
        return total;
    }

    renderSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;
        if (
            this.props.efciSiteData &&
            this.props.efciSiteData.capital_spending_plans &&
            this.props.efciSiteData.capital_spending_plans.length
        ) {
            this.props.efciSiteData.capital_spending_plans.forEach(function (row) {
                row.fundings &&
                    row.fundings.length &&
                    row.fundings.forEach(function (item) {
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
        subTotalByYear.map(yeatData => {
            grandTotal += yeatData.amount;
        });
        return subTotalByYear;
    }

    setTotalRepairCost() {
        let totalRepairCost = 0;
        const { efciSiteData } = this.props;
        efciSiteData &&
            efciSiteData.efcis &&
            efciSiteData.efcis.length &&
            efciSiteData.efcis.map(item => (totalRepairCost += parseInt(item.amount) || 0));
        return totalRepairCost;
        // this.setState({ totalRepairCost: totalRepairCost });
    }

    toggleLoader(value) {
        this.setState({ loading: value })
    }


    render() {
        const { efciSiteData } = this.props;
        // const { totalRepairCost } = this.state;

        const totalRepairCost = this.setTotalRepairCost();

        let filteredData = uniqBy(
            efciSiteData.capital_spending_plans &&
            efciSiteData.capital_spending_plans.length &&
            efciSiteData.capital_spending_plans[0].fundings, "year"
        );

        let sortByTitleData = _.orderBy(
            efciSiteData.capital_spending_plans &&
            efciSiteData.capital_spending_plans.length &&
            efciSiteData.capital_spending_plans, "title", "asc"
        );

        let grandTotal = 0;
        const subTotalByYear = this.renderSubTotalRow();
        subTotalByYear.map(yeatData => {
            grandTotal += yeatData.amount;
        });
        return (
            <LoadingOverlay active={this.state.loading} spinner={<Loader />} fadeSpeed={10}>

                <>
                    <BasicSiteInfo
                        efciSiteData={efciSiteData}
                    />
                    <div className="custom-table-scroll">
                        <div className="table-topper efc-topr">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>FCA Capital Spending Plan Summary</h3>
                            </div>
                        </div>
                        <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tbody>
                                    <tr>
                                        <td>
                                            <CSPSummaryTable
                                                efciSiteData={efciSiteData}
                                                totalRepairCost={totalRepairCost}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-topper efc-topr">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>FCA Capital Spending Plan Assumptions</h3>
                            </div>
                        </div>
                        <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tbody>
                                    <tr>
                                        <td>
                                            <CSPAssumptions
                                                grandTotal={grandTotal}
                                                setTotal={this.setTotal}
                                                efciSiteData={efciSiteData}
                                                filteredData={filteredData}
                                                subTotalByYear={subTotalByYear}
                                                toggleLoader={this.toggleLoader}
                                                sortByTitleData={sortByTitleData}
                                                updatePercentage={this.props.updatePercentage}
                                                getCSPLogs={this.props.getCSPLogs}
                                                restoreCSP={this.props.restoreCSP}
                                                showLogsCSP={this.props.showLogsCSP}
                                                disableClick={this.props.disableClick}
                                                updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                    {/* <div className="custom-csp-table-scroll">
                        <CSPSummaryTable
                            efciSiteData={efciSiteData}
                            totalRepairCost={totalRepairCost}
                        />
                        <CSPAssumptions
                            grandTotal={grandTotal}
                            setTotal={this.setTotal}
                            efciSiteData={efciSiteData}
                            filteredData={filteredData}
                            subTotalByYear={subTotalByYear}
                            toggleLoader={this.toggleLoader}
                            sortByTitleData={sortByTitleData}
                            updatePercentage={this.props.updatePercentage}
                            getCSPLogs={this.props.getCSPLogs}
                            restoreCSP={this.props.restoreCSP}
                            showLogsCSP={this.props.showLogsCSP}
                            disableClick={this.props.disableClick}
                            updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                        />
                    </div> */}
                </>
            </LoadingOverlay>
        );
    }
}
export default CSPSummarySite;
