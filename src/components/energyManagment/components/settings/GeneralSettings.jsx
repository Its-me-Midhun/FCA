import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Table from "../../../common/components/Table";
// import { tradesettingsTableData } from "../../../config/tableData";

class GeneralSettings extends Component {
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
            generalSettingstableData,
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
                        <button className="add-btn" onClick={() => showAddModal("Limit")}>
                            <i className="fas fa-plus" /> Add New Year Limit
                        </button>
                    </div>
                </div>
                <Table
                    tableData={generalSettingstableData}
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

export default withRouter(GeneralSettings);
