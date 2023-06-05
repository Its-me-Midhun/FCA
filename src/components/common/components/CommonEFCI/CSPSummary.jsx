import React, { Component } from "react";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../Loader";
import BasicEfciInfo from "./BasicEfciInfo";
import FCACSPSummary from "./FCACSPSummary";
import FCACSPAssumption from "./FCACSPAssumption";

class CSPSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            yearList: []
        }
    }

    componentDidMount() {
        this.sortDeficiency();
        this.setState({ loading: false })
    }

    sortDeficiency = () => {
        let yearList = [];
        let data = this.props.efciData && this.props.efciData.capital_spending_plans["deficiencies"];
        let sortedArrayByYear = _.orderBy(data, 'year', 'asc');
        this.props.efciData && this.props.efciData.capital_spending_plans &&
            this.props.efciData.capital_spending_plans["deficiencies"] &&
            sortedArrayByYear.map(item => (
                yearList = [...yearList, item.year]
            ))
        this.setState({
            yearList: yearList
        })
    }

    setTotalRepairCost() {
        let totalRepairCost = 0;
        const { efciData } = this.props;
        let data = efciData && efciData.capital_spending_plans && efciData.capital_spending_plans["deficiencies"] || [];
        let sortedArrayByYear = _.orderBy(data, 'year', 'asc');
        sortedArrayByYear &&
            sortedArrayByYear &&
            sortedArrayByYear.length &&
            sortedArrayByYear.map(item => (totalRepairCost += parseInt(item.amount) || 0));
        return totalRepairCost;
    }

    setTotal(data) {
        let total = 0;
        data.map(element => (total += parseInt(element.amount)));
        return total;
    }

    render() {
        const { efciData } = this.props;
        let data = this.props.efciData &&
            this.props.efciData.capital_spending_plans["deficiencies"];
        let sortedDefeciency = _.orderBy(data, 'year', 'asc');
        let totalRepairCost = this.setTotalRepairCost();

        return (
            <LoadingOverlay active={this.state.loading} spinner={<Loader />} fadeSpeed={10}>
                <>
                    <BasicEfciInfo
                        efciData={efciData}
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
                                            <FCACSPSummary
                                                efciData={efciData}
                                                tableTitle={"Project Name"}
                                                yearList={this.state.yearList}
                                                totalRepairCost={totalRepairCost}
                                                sortedDefeciency={sortedDefeciency}
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
                                            <FCACSPAssumption
                                                efciData={efciData}
                                                setTotal={this.setTotal}
                                                yearList={this.state.yearList}
                                                handleCspSummary={this.props.handleCspSummary}
                                                updateCspSummary={this.props.updateCspSummary}
                                                openLogPanel={this.props.openLogPanel}
                                                showLog={this.props.showLog}
                                                disableClick={this.props.disableClick}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* <FCACSPAssumption
                            efciData={efciData}
                            setTotal={this.setTotal}
                            yearList={this.state.yearList}
                            handleCspSummary={this.props.handleCspSummary}
                            updateCspSummary={this.props.updateCspSummary}
                            openLogPanel={this.props.openLogPanel}
                            showLog={this.props.showLog}
                            disableClick={this.props.disableClick}
                        /> */}
                    </div>

                </>
            </LoadingOverlay>
        );
    }
}
export default CSPSummary;