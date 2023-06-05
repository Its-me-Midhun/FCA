import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Row from "./Row";
import Loader from "./Loader";
import WildCardFilter from "./WildCardFilter";

class Table extends Component {
    state = {
        isLoading: true
    };

    componentDidMount = async () => {
        await this.setState({
            isLoading: false
        });
    };

    updateSelectedRow = rowId => {
        this.setState({
            selectedRowId: rowId
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) {
            return <Loader />;
        }
        const {
            tableData,
            updateCurrentViewAllUsers,
            currentViewAllUsers,
            handleDeleteItem,
            showWildCardFilter,
            showEditPage,
            showInfoPage,
            hasInfoPage = true
        } = this.props;

        return (
            <React.Fragment>
                <div className="table-section table-scroll">
                    <table className="table table-common">
                        <thead>
                            <tr>
                                <th className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </th>
                                {tableData.keys.map((keyItem, i) => {
                                    return tableData.config[keyItem].isVisible ? (
                                        <th
                                            key={i}
                                            className={`${tableData.config[keyItem].class}`}
                                        >
                                            {tableData.config[keyItem].label}
                                            <span className="close-reg">
                                                <i className="fas fa-times" />
                                            </span>
                                        </th>
                                    ) : null;
                                })}
                                <th className="action">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showWildCardFilter ? (
                                <WildCardFilter keys={tableData.keys} config={tableData.config} />
                            ) : null}
                            {tableData.data && tableData.data.length ? (
                                tableData.data.map((dataItem, i) => (
                                    <Row
                                        keys={tableData.keys}
                                        config={tableData.config}
                                        rowData={dataItem}
                                        key={i}
                                        updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                                        currentViewAllUsers={currentViewAllUsers}
                                        handleDeleteItem={handleDeleteItem}
                                        showEditPage={showEditPage}
                                        showInfoPage={showInfoPage}
                                        hasInfoPage={hasInfoPage}
                                        updateSelectedRow={this.updateSelectedRow}
                                        selectedRowId={this.state.selectedRowId || null}
                                    />
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan={tableData.keys.length + 2}>No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Table);
