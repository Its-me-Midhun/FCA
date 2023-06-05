import React, { Component } from "react";
import Recommendations from "../../recommendations";

class BudgetPriority extends Component {
    state = {
        isFullscreen: this.props.isFullScreen === "budget_priority" ? true : false
    };
    handleFullView = () => {
        this.setState(
            {
                isFullscreen: !this.state.isFullscreen
            },
            async () => {
                await this.props.handleViewDetails("budget_priority");
            }
        );
    };

    render() {
        const { dashboardFilterParams, getDashboardValue } = this.props;
        const { isFullscreen } = this.state;

        return (
            <div className={isFullscreen ? "sld-ara w-100" : "sld-ara"} id="chartItem-fci">
                <Recommendations
                    handleFullView={this.handleFullView}
                    isFullscreen={isFullscreen}
                    isBudgetPriority
                    dashboardFilterParams={dashboardFilterParams}
                    getDashboardValue={getDashboardValue}
                    toggleSecondChartView={this.props.toggleSecondChartView}
                />
            </div>
        );
    }
}
export default BudgetPriority;
