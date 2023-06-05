import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";
import EditHistory from "../../../region/components/EditHistory";

class BasicDetails extends Component {
    state = {
        isHistoryView: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        associated_changes: []
    };
    handleRestoreLog = async (id, choice, changes, associated_changes) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            logChanges: changes,
            associated_changes: associated_changes
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, logChanges, associated_changes } = this.state;
        if (!showConfirmModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={logChanges}
                        associatedchanges={associated_changes}
                        onNo={() => this.setState({ showConfirmModalLog: false })}
                        onYes={this.restoreLogOnConfirm}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLog: false })}
            />
        );
    };

    restoreLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.HandleRestoreSettingsLog(selectedLog);
        await this.props.refreshinfoDetails();
        // await this.getLogData(this.props.match.params.id)
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isHistoryView: !this.state.isHistoryView
        });
    };
    render() {
        const {
            basicDetails,
            keys,
            config,
            history,
            match: {
                params: { section }
            },
            handleDeleteItem,
            getAllSettingsLogs,
            logData,
            handlePerPageChangeHistory,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            globalSearchKeyHistory,
            handleDeleteLog,
            historyPaginationParams,
            historyParams,
            updateLogSortFilters,
            permissions,
            logPermission,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true,
            hasLogDelete,
            hasLogRestore,
            hasInfoPage
        } = this.props;
        const { isHistoryView } = this.state;

        return (
            <React.Fragment>
                <div className="tab-active">
                    <div className="otr-edit-delte col-md-12 text-right">
                        {hasLogView && (
                            <span
                                onClick={() => {
                                    this.setState({ isHistoryView: !this.state.isHistoryView });
                                }}
                                className="edit-icn-bx ml-3"
                            >
                                <i className="fas fa-history"></i> {isHistoryView ? "View Details" : "View History"}
                            </span>
                        )}
                        <span
                            onClick={() => {
                                this.props.handleCloseItem(this.props.itemid);
                            }}
                            className="edit-icn-bx ml-3"
                        >
                            <i className="fas fa-window-close"></i> Close
                        </span>
                        {hasEdit && (
                            <span
                                onClick={() => {
                                    this.props.showEditPage(this.props.itemid);
                                }}
                                className="edit-icn-bx ml-3"
                            >
                                <i className="fas fa-pencil-alt"></i> Edit
                            </span>
                        )}
                        {hasDelete && (
                            <span onClick={() => this.props.handleDeleteTrade(this.props.itemid)} className="edit-icn-bx ml-3">
                                <i className="fas fa-trash-alt"></i> Delete
                            </span>
                        )}
                    </div>
                    {isHistoryView ? (
                        <EditHistory
                            getAllRegionLogs={getAllSettingsLogs}
                            // changeToHistory={this.changeToHistory}
                            handlePerPageChangeHistory={handlePerPageChangeHistory}
                            handlePageClickHistory={handlePageClickHistory}
                            handleGlobalSearchHistory={handleGlobalSearchHistory}
                            globalSearchKeyHistory={globalSearchKeyHistory}
                            logData={logData}
                            handleDeleteLog={handleDeleteLog}
                            historyPaginationParams={historyPaginationParams}
                            isProjectSettings={true}
                            handleRestoreLog={this.handleRestoreLog}
                            historyParams={historyParams}
                            updateLogSortFilters={updateLogSortFilters}
                            permissions={permissions}
                            logPermission={logPermission}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasInfoPage={hasInfoPage}
                        />
                    ) : (
                        <div className="basic-dtl-otr">
                            {keys && keys.length
                                ? keys.map((keyItem, i) => {
                                      return keyItem !== "users" && keyItem !== "comments" ? (
                                          <>
                                              {section === "buildinginfo" && i === 0 ? (
                                                  <div className="col-12 mt-3 addTxt">
                                                      <h3>
                                                          <div class="nme"> Basic Details</div>
                                                          <div class="line"></div>
                                                      </h3>
                                                  </div>
                                              ) : null}
                                              <div key={i} className="col-md-4 basic-box">
                                                  <div className="codeOtr">
                                                      <h4>{config[keyItem].label}</h4>
                                                      {keyItem === "client" ||
                                                      keyItem === "region" ||
                                                      keyItem === "systems" ||
                                                      keyItem === "trades" ||
                                                      keyItem === "project" ||
                                                      keyItem === "site" ? (
                                                          <h3>{(basicDetails[keyItem] && basicDetails[keyItem].name) || "-"}</h3>
                                                      ) : keyItem === "regions" || keyItem === "sites" || keyItem === "projects" ? (
                                                          <h3 class="rgn">
                                                              {basicDetails[keyItem] && basicDetails[keyItem].length
                                                                  ? basicDetails[keyItem].map((item, i) => (
                                                                        <>
                                                                            <span key={i} class="rg-txt">
                                                                                {item.name}
                                                                            </span>
                                                                            {i < basicDetails[keyItem].length - 1 ? (
                                                                                <span class="line-txt">|</span>
                                                                            ) : null}
                                                                        </>
                                                                    ))
                                                                  : null}
                                                          </h3>
                                                      ) : (
                                                          <h3>{(basicDetails[keyItem] && basicDetails[keyItem]) || "-"}</h3>
                                                      )}
                                                  </div>
                                              </div>
                                              {section === "recommendationsinfo" && i !== 0 && i % 6 === 0 ? (
                                                  <div className="col-12 mt-3"></div>
                                              ) : null}
                                              {section === "buildinginfo" && (i === 6 || i === 16) ? (
                                                  <div className="col-12 mt-3 addTxt">
                                                      <h3>
                                                          <div class="nme">{i === 6 ? "More Details" : "Address"}</div>
                                                          <div class="line"></div>
                                                      </h3>
                                                  </div>
                                              ) : null}
                                          </>
                                      ) : null;
                                  })
                                : null}
                        </div>
                    )}
                    <div className="col-md-12 otr-user-cmnt">
                        {basicDetails.users ? (
                            <div className="col-md-6 user">
                                <h3>Consultancy Users</h3>
                                <div className="col-md-12 cons-user">
                                    {basicDetails.users.length
                                        ? basicDetails.users.map((user, i) => (
                                              <span key={i} className="badge-otr">
                                                  <img src="/img/user-icon.png" alt="" />
                                                  <span className="nme">
                                                      {user.name}
                                                      {/* <span aria-hidden="true">×</span> */}
                                                  </span>
                                              </span>
                                          ))
                                        : "_"}
                                </div>
                            </div>
                        ) : null}
                        {this.renderConfirmationModalLog()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
