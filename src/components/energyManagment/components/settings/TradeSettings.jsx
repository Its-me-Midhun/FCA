import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Table from "../../../common/components/Table";
// import { tradesettingsTableData } from "../../../config/tableData";

class ProjectInfo extends Component {
    state = {
        isloading: true
    };

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return null;
        }

        const {
            match: {
                params: { id: project_id }
            },
            tradeSettingstableData,
            showAddModal,
            showEditPage,
            handleDeleteTrade,
            updateSelectedRow,
            selectedRowId,
            showInfoPage
        } = this.props;

        return (
            <React.Fragment>
                <div className="table-top-menu mt-2">
                    <div className="rgt" >
                        <button className="add-btn" onClick={() => showAddModal("Trade")}>
                            <i className="fas fa-plus" /> Add New Trade
                        </button>
                    </div>
                </div>
                <Table
                    tableData={tradeSettingstableData}
                    showEditPage={showEditPage}
                    handleDeleteItem={handleDeleteTrade}
                    showInfoPage={showInfoPage}
                    updateSelectedRow={updateSelectedRow}
                    selectedRowId={selectedRowId}
                    hasColumnClose={false}
                    hasSort={false}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(ProjectInfo);
