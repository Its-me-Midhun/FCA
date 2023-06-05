import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class CSPFundingTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearList: []
        };
    }

    componentDidMount() {
        let yearList = [];
        let data = this.props.efciData && this.props.efciData.capital_spending_plans["deficiencies"];
        let sortedArrayByYear = _.orderBy(data, "year", "asc");
        this.props.efciData &&
            this.props.efciData.capital_spending_plans &&
            this.props.efciData.capital_spending_plans["deficiencies"] &&
            sortedArrayByYear.map(item => (yearList = [...yearList, item.year]));
        this.setState({
            yearList: yearList
        });
    }

    setCapitalTotal() {
        let capitalTotal = 0;
        this.props.efciData.capital_spending_plans["deficiencies"] &&
            this.props.efciData.capital_spending_plans["deficiencies"].map(element => (capitalTotal += parseInt(element.amount)));
        return capitalTotal;
    }

    renderSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;
        let dataValues = Object.values(this.props.efciData.capital_spending_plans);
        let dataKeys = Object.keys(this.props.efciData.capital_spending_plans);
        if (dataKeys && dataKeys.length) {
            dataKeys.map(key => {
                this.props.efciData.capital_spending_plans[key] &&
                    this.props.efciData.capital_spending_plans[key].length &&
                    this.props.efciData.capital_spending_plans[key].forEach(row => {
                        obj.push(row);
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

    render() {
        const {
            efciData: { funding_options = [], capital_spending_plans }
            // subTotalByYear
        } = this.props;
        const { yearList } = this.state;
        let data = this.props.efciData && this.props.efciData.capital_spending_plans["deficiencies"];
        let sortedArrayByYear = _.orderBy(data, "year", "asc");
        let subTotalByYear = this.renderSubTotalRow();
        let wholeTotal = 0;
        subTotalByYear.map(yearData => {
            wholeTotal += parseInt(yearData.amount);
        });
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
                            {capital_spending_plans &&
                                capital_spending_plans["deficiencies"] &&
                                capital_spending_plans["deficiencies"].length &&
                                capital_spending_plans["deficiencies"] &&
                                yearList.map((item, index) => (
                                    <th key={index} className="build-year">
                                        {item} <i className="fas fa-sort"></i>
                                    </th>
                                ))}
                            <th className="action wid-more">Total Repair Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">
                                <img src="/img/sq-box.png" alt="" />
                            </td>
                            <td className="pos-otr">{capital_spending_plans["deficiencies"] && capital_spending_plans["deficiencies"][0].title}</td>
                            {subTotalByYear?.length ? (
                                subTotalByYear.map((item, i) => (
                                    <td key={i}>
                                        {<NumberFormat prefix={"$ "} displayType={"text"} thousandSeparator={true} value={parseInt(item.amount)} />}
                                    </td>
                                ))
                            ) : (
                                <td colSpan={10}>No data.</td>
                            )}
                            <td>{<NumberFormat prefix={"$ "} displayType={"text"} thousandSeparator={true} value={parseInt(wholeTotal)} />}</td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(CSPFundingTable);
