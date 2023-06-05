import React, { Component } from "react";
import NumberFormat from "react-number-format";
import _, { uniqBy } from "lodash";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../Loader";
import BasicInfo from "./BasicInfo";
import CSPSummaryTable from "./CSPSummaryTable";
import CSPAssumptions from "./CSPAssumption";

class CSPSummary extends Component {
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

        this.setState({ totalRepairCost: totalRepairCost });
    }

    toggleLoader(value) {
        this.setState({ loading: value })
    }


    render() {
        const { efciSiteData } = this.props;
        const { totalRepairCost } = this.state;

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
                    <BasicInfo
                        efciSiteData={efciSiteData}
                    />
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
                        updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                    />
                </>
            </LoadingOverlay>
        );
    }
}
export default CSPSummary;
