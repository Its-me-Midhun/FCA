import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";

import ReactTooltip from "react-tooltip";
import walletIconn from "../../../assets/img/dashboard/Group 954.svg";
import Table from "../../common/components/Table";
import recommendationsActions from "../actions";
import projectActions from "../../project/actions";
import TableTopIcons from "../../common/components/TableTopIcons";
import chartIcon from "../../../assets/img/dashboard/dsh-chart.svg";
import { Dropdown } from "react-bootstrap";
import { checkPermission } from "../../../config/utils";
class RecommendationsMain extends Component {
    state = {
        idArray: [],
        selectedAll: false,
        isCheckedWord: false,
        isCheckedPdf: false,
        show: false,
        recToggleData: null
    };

    componentDidMount = () => {
        localStorage.setItem("selectAllClicked", false);
        localStorage.setItem("selectAll", false);
        this.setState({
            selectedAll: false
        });
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.recomentationIds !== this.props.recomentationIds) {
            this.setState({
                idArray: this.props.recomentationIds
            });
            if (!this.props.recomentationIds.length) {
                this.setState({
                    selectedAll: false
                });
            }
        }
        if (prevState.selectedAll !== this.state.selectedAll) {
            let selectAll = localStorage.getItem("selectAll") ? JSON.parse(localStorage.getItem("selectAll")) : false;
            if (!selectAll) {
                this.setState({
                    selectedAll: false
                });
            }
            if (this.state.selectedAll) {
                localStorage.setItem("selectAllClicked", true);
                localStorage.setItem("recommendationCount", this.props.paginationParams.totalCount);
            } else {
                localStorage.setItem("selectAllClicked", false);
                localStorage.removeItem("recommendationIds");
                localStorage.removeItem("selectAll");
                localStorage.removeItem("recommendationCount");
            }
        }
    };

    resetSelect = async () => {
        await this.setState({
            selectedAll: false
        });
        localStorage.setItem("selectAllClicked", false);
    };

    assignContent = async () => {
        await this.props.assignProjectModal();
    };
    toggleChangeWord = async (e, check) => {
        if (check === "isCheckedWord") {
            await this.setState({
                isCheckedWord: e.target.checked
            });
        } else {
            await this.setState({
                isCheckedWord: false
            });
        }
    };

    toggleChangePdf = async (e, check) => {
        if (check === "isCheckedPdf") {
            await this.setState({
                isCheckedPdf: e.target.checked
            });
        } else {
            await this.setState({
                isCheckedPdf: false
            });
        }
    };

    clearExport = () => {
        this.setState({
            isCheckedPdf: false,
            isCheckedWord: false
        });
    };
    chooseMessage = async data => {
        this.setState({ recToggleData: data });
    };
    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            handleGlobalSearch,
            toggleWildCardFilter,
            updateCurrentViewAllUsers,
            handleDeleteRecommendations,
            showEditPage,
            handlePerPageChange,
            handlePageClick,
            showAddForm,
            match: {
                params: { section }
            },
            showInfoPage,
            updateSelectedRow,
            selectedRowId,
            globalSearchKey,
            updateWildCardFilter,
            wildCardFilter,
            handleHideColumn,
            getListForCommonFilterRecommendation,
            updateCommonFilter,
            commonFilter,
            resetAllFilters,
            updateTableSortFilters,
            updateLastSortFilter,
            resetSort,
            tableParams,
            isBuildingLocked,
            handleCutPaste,
            summaryRowData,
            showRestoreModal,
            selectFilterHandler,
            permissions,
            selectFilterHandlerInitiative,
            showAddButton,
            hasExport,
            hasNewlyCreated,
            hasNewlyEdited,
            hasEdit,
            hasDelete,
            hasInfoPage,
            hasFilterByWater,
            hasFilterByEnergy,
            hasFilterByBudgetPriority,
            hasFilterByFmp,
            filterByFmp,
            filterByRecomType,
            filterByBudgetPriority,
            filterByEnergy,
            filterByWater,
            entity,
            exportExcelAllTrades = null,
            exportAllTradesLoading = false,
            exportWordLoading = false,
            selectedRecomIds,
            handleSelectRecom,
            handleSelectAllRecom,
            isBudgetPriority,
            isFullscreen,
            tableRef,
            hasViewMyRecommendation,
            hasFilterByImages,
            filterBySurveyor,
            filterByImages,
            filterByIR,
            resetAll,
            isColunmVisibleChanged,
            hasMultiAction,
            handleEditMultiSelectedData,
            showSelectedRecom,
            clearSelection,
            everyItemCheckedPerPage,
            selectWholeRecommendation,
            hasIrRecommendation,
            priorityElementsData = [],
            exportSelectedRecom,
            multiExportPdfLoader,
            multiExportWordLoader,
            exportToWordFile,
            showViewModalExport,
            showViewImport,
            exportToExcelFiles,
            tableDataExportFilters,
            hasRecomTypeFilter,
            isInputMode,
            handleCellFocus,
            handleCellValueChange,
            lineEditingEnabled,
            toggleLineEditing,
            handleColumnPin,
            pinnedColumnsRef,
        } = this.props;
        const isEveryItemSelected = selectedRecomIds?.length === paginationParams.totalCount;
        let isConsultancyUser = localStorage.getItem("role") === "consultancy_user";
        let isSuperAdmin = localStorage.getItem("role") === "super_admin";
        let selectAll = localStorage.getItem("selectAll") ? JSON.parse(localStorage.getItem("selectAll")) : false;
        let recommendationIdCount = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
        return (
            <React.Fragment>
                <div className={`dtl-sec ${isBudgetPriority ? "pad-dtl-sec" : ""} rcom-tot-dtl col-md-12 mb-4`}>
                    <div className="table-top-menu allign-right top-head-wid">
                        {/* {this.props.isImageView && (
                            <div className="pr-2">
                                <button
                                    class="btn-primary btn-back-chart"
                                    style={{ height: "38px" }}
                                    onClick={() => {
                                        popBreadCrumpOnPageClose();
                                        history.push(findPrevPathFromBreadCrumpData() || "/images");
                                    }}
                                >
                                    <i class="fas fa-backward pr-2"></i>Go Back To Image Management
                                </button>
                            </div>
                        )} */}
                        <div className="lft">
                            {isBudgetPriority ? null : section !== "initiativeInfo" ? (
                                <select
                                    className={
                                        this.props.selectedDropdown === "active" && section !== "initiativeInfo"
                                            ? "form-control cstm-active"
                                            : "form-control"
                                    }
                                    value={this.props.selectedDropdown}
                                    onChange={e => selectFilterHandler(e)}
                                >
                                    <option value="all" className={"cstm-option"}>
                                        All
                                    </option>

                                    <option className={"cstm-option"} value="active">
                                        Active
                                    </option>
                                    <option className={"cstm-option"} value="on_hold">
                                        On hold
                                    </option>
                                    <option className={"cstm-option"} value="completed">
                                        Completed
                                    </option>
                                    <option value="deleted" className={"cstm-option"}>
                                        Deleted
                                    </option>
                                    <option className={"cstm-option"} value="locked">
                                        Locked
                                    </option>
                                    <option className={"cstm-option"} value="unlocked">
                                        Unlocked
                                    </option>
                                </select>
                            ) : (
                                <select
                                    className={
                                        this.props.selectedDropdownInitiaive === "active" && section !== "initiativeInfo"
                                            ? "form-control cstm-active"
                                            : "form-control"
                                    }
                                    value={this.props.selectedDropdownInitiaive}
                                    onChange={e => selectFilterHandlerInitiative(e)}
                                >
                                    <option value="all" className={"cstm-option"}>
                                        All
                                    </option>
                                    <option className={"cstm-option"} value="assigned">
                                        Assigned
                                    </option>
                                    <option className={"cstm-option"} value="unassigned">
                                        Unassigned
                                    </option>
                                </select>
                            )}
                        </div>
                        {section === "initiativeInfo" ? (
                            <div className="lft pl-2">
                                <select
                                    className={this.props.selectedDropdown === "active" ? "form-control cstm-active" : "form-control"}
                                    value={this.props.selectedDropdown}
                                    onChange={e => selectFilterHandlerInitiative(e)}
                                >
                                    <option className={"cstm-option"} value="allInitiative">
                                        All
                                    </option>
                                    <option className={"cstm-option"} value="active">
                                        Active
                                    </option>
                                    <option className={"cstm-option"} value="on_hold">
                                        On hold
                                    </option>
                                    <option className={"cstm-option"} value="completed">
                                        Completed
                                    </option>
                                    <option value="deleted" className={"cstm-option"}>
                                        Deleted
                                    </option>
                                    <option className={"cstm-option"} value="locked">
                                        Locked
                                    </option>
                                    <option className={"cstm-option"} value="unlocked">
                                        Unlocked
                                    </option>
                                </select>
                            </div>
                        ) : null}
                        {selectAll ? (
                            <div className={"count-dtl pl-3 cursor-pointer slctall mt-2"}>
                                <label className="container-check">
                                    Select all {paginationParams.totalCount} recommendation
                                    <input
                                        type="checkbox"
                                        checked={this.state.selectedAll}
                                        onClick={e => {
                                            if (e.target.checked) {
                                                this.setState({
                                                    selectedAll: true
                                                });
                                            } else {
                                                this.setState({
                                                    selectedAll: false
                                                });
                                            }
                                        }}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        ) : null}
                        {selectedRecomIds?.length > 0 && (
                            <>
                                <button className={"add-btn ml-2 btn-new-noti"}>
                                    <i className="fas fa-check" />
                                    <span>{selectedRecomIds?.length}</span>
                                </button>
                                <button className={"add-btn ml-2 btn-new-noti"} onClick={() => clearSelection()}>
                                    <i className="fas fa-times-circle mr-1" /> {`Clear`}
                                </button>
                                {hasEdit && (
                                    <button className={"add-btn ml-2 btn-new-noti"} onClick={() => handleEditMultiSelectedData()}>
                                        <i className="fas fa-pencil-alt mr-1" /> {`Edit`}
                                    </button>
                                )}
                                <button className={"add-btn ml-2 btn-new-noti"} onClick={() => showSelectedRecom()}>
                                    <i className="fas fa-eye mr-1" />
                                    {tableParams.recommendation_ids?.length ? " Show All" : " Show"}
                                </button>
                                <Dropdown className="export-btn-drop" show={this.state.show}>
                                    <Dropdown.Toggle
                                        id="dropdown-basic"
                                        onClick={() => this.setState({ show: !this.state.show })}
                                        className="add-btn ml-2 btn-new-noti export-btn"
                                    >
                                        {multiExportPdfLoader || multiExportWordLoader ? (
                                            <div className="edit-icn-bx icon-btn-sec export-loader">
                                                <div className="spinner-border text-primary" role="status"></div>
                                            </div>
                                        ) : (
                                            <i className="fas fa-print mr-1"></i>
                                        )}
                                        Print
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <i className="fas fa-solid fa-file-word mr-1" />
                                            Word
                                        </Dropdown.Item>
                                        <div class="brief-desc flex-wrap">
                                            <div class="seting-type checkbox-container print-mode">
                                                <label class="container-checkbox cursor-hand m-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={!this.state.isCheckedWord}
                                                        onChange={e => this.toggleChangeWord(e, "isCheckedWordDefault")}
                                                    />
                                                    <span class="checkmark"></span>Without Note
                                                </label>
                                                <label class="container-checkbox cursor-hand m-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={this.state.isCheckedWord}
                                                        onChange={e => this.toggleChangeWord(e, "isCheckedWord")}
                                                    />
                                                    <span class="checkmark"></span>With Note
                                                </label>
                                            </div>
                                            <button
                                                className="dwd-btn"
                                                onClick={() => {
                                                    exportSelectedRecom("word", this.state.isCheckedWord);
                                                    this.clearExport();
                                                    this.setState({ show: false });
                                                }}
                                            >
                                                <i className="fas fa-file-download mr-2"></i>
                                                Download
                                            </button>
                                        </div>

                                        <Dropdown.Item>
                                            <i className="fas fa-solid fa-file-pdf mr-1" />
                                            PDF
                                        </Dropdown.Item>
                                        <div class="brief-desc flex-wrap">
                                            <div class="seting-type checkbox-container print-mode">
                                                <label class="container-checkbox cursor-hand m-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={!this.state.isCheckedPdf}
                                                        onChange={e => this.toggleChangePdf(e, "isCheckedPdfDefault")}
                                                    />
                                                    <span class="checkmark"></span>Without Note
                                                </label>
                                                <label class="container-checkbox cursor-hand m-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={this.state.isCheckedPdf}
                                                        onChange={e => this.toggleChangePdf(e, "isCheckedPdf")}
                                                    />
                                                    <span class="checkmark"></span>With Note
                                                </label>
                                            </div>
                                            <button
                                                className="dwd-btn"
                                                onClick={() => {
                                                    exportSelectedRecom("pdf", this.state.isCheckedPdf);
                                                    this.clearExport();
                                                    this.setState({ show: false });
                                                }}
                                            >
                                                <i className="fas fa-file-download mr-2"></i>
                                                Download
                                            </button>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {paginationParams?.totalCount > paginationParams?.perPage && (
                                    <button
                                        className={`add-btn ml-2 btn-new-noti btn-sel-all ${isEveryItemSelected ? "active" : ""}`}
                                        onClick={() => selectWholeRecommendation()}
                                    >
                                        <i className="fas fa-check-double mr-1" /> {isEveryItemSelected ? "Selected All" : "Select All"}{" "}
                                        <span>{paginationParams?.totalCount}</span>
                                    </button>
                                )}
                            </>
                        )}
                        <div className="rgt">
                            {isBudgetPriority ? (
                                <div className={"hed-set budgt-head"}>
                                    <div class="tab-btn-dsh">
                                        <button class="btn-cmn btn-txt active">Budget Priorities</button>
                                        <button class="btn-cmn btn-icn">
                                            <img
                                                src={chartIcon}
                                                alt="wlt-icn"
                                                data-place="bottom"
                                                data-effect="solid"
                                                data-background-color="#007bff"
                                                onClick={this.props.toggleSecondChartView}
                                                data-tip="FCI Benchmarking View"
                                                data-for="chrt"
                                            />
                                            <ReactTooltip id="chrt" />
                                        </button>
                                    </div>
                                    <div className="d-flex">
                                        <div className="d-flex filter-dash-otr">
                                            <TableTopIcons
                                                tableData={tableData}
                                                globalSearchKey={globalSearchKey}
                                                handleGlobalSearch={handleGlobalSearch}
                                                resetAllFilters={resetAllFilters}
                                                toggleWildCardFilter={toggleWildCardFilter}
                                                showViewModal={showViewModal}
                                                showViewModalExport={showViewModalExport}
                                                showViewImport={showViewImport}
                                                resetSort={resetSort}
                                                tableParams={tableParams}
                                                isExport={isFullscreen ? hasExport : false}
                                                exportTableXl={this.props.exportTableXl}
                                                exportExcelAllTrades={false}
                                                tableLoading={this.props.tableLoading}
                                                exportAllTradesLoading={exportAllTradesLoading}
                                                exportWordLoading={exportWordLoading}
                                                selectFilterHandler={selectFilterHandler}
                                                isSelectFilter={true}
                                                entity={entity}
                                                hasHelp={isFullscreen}
                                                hasView={isFullscreen}
                                                hasNewlyCreated={isFullscreen && hasNewlyCreated}
                                                hasNewlyEdited={isFullscreen && hasNewlyEdited}
                                                updateTableSortFilters={updateTableSortFilters}
                                                updateLastSortFilter={updateLastSortFilter}
                                                hasViewMyRecommendation={isFullscreen && hasViewMyRecommendation}
                                                hasFilterByImages={isFullscreen && hasFilterByImages}
                                                filterBySurveyor={filterBySurveyor}
                                                hasIrRecommendation={isFullscreen && hasIrRecommendation}
                                                filterByImages={filterByImages}
                                                filterByIR={isFullscreen && filterByIR}
                                                resetAll={resetAll}
                                                isColunmVisibleChanged={isColunmVisibleChanged}
                                                showWildCardFilter={showWildCardFilter}
                                                selectedRecomIds={selectedRecomIds}
                                                clearSelection={clearSelection}
                                                getSection={this.chooseMessage}
                                                hasAdditionalFilters={isFullscreen}
                                                isBudgetPriority
                                            />
                                        </div>
                                        <div className="btn-grp remove-when-downloading">
                                            <div
                                                className="fl-srn"
                                                data-place="left"
                                                data-effect="solid"
                                                data-delay-show="500"
                                                data-background-color="#007bff"
                                                data-tip={isFullscreen ? "Back To Normal Screen" : "View Full Screen"}
                                                data-for="budgetView"
                                                onClick={() => this.props.handleFullView()}
                                            >
                                                <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                            </div>
                                            <ReactTooltip id="budgetView" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <TableTopIcons
                                    tableData={tableData}
                                    globalSearchKey={globalSearchKey}
                                    handleGlobalSearch={handleGlobalSearch}
                                    resetAllFilters={resetAllFilters}
                                    toggleWildCardFilter={toggleWildCardFilter}
                                    showViewModal={showViewModal}
                                    resetSort={resetSort}
                                    tableParams={tableParams}
                                    isExport={hasExport}
                                    exportTableXl={this.props.exportTableXl}
                                    exportExcelAllTrades={exportExcelAllTrades}
                                    tableLoading={this.props.tableLoading}
                                    exportAllTradesLoading={exportAllTradesLoading}
                                    exportWordLoading={exportWordLoading}
                                    selectFilterHandler={selectFilterHandler}
                                    isSelectFilter={true}
                                    entity={entity}
                                    hasNewlyCreated={hasNewlyCreated}
                                    hasNewlyEdited={hasNewlyEdited}
                                    updateTableSortFilters={updateTableSortFilters}
                                    updateLastSortFilter={updateLastSortFilter}
                                    hasViewMyRecommendation={hasViewMyRecommendation}
                                    hasViewExportModal={this.props.hasViewExportModal}
                                    hasFilterByImages={hasFilterByImages}
                                    hasIrRecommendation={hasIrRecommendation}
                                    filterBySurveyor={filterBySurveyor}
                                    filterByImages={filterByImages}
                                    filterByIR={filterByIR}
                                    resetAll={resetAll}
                                    isColunmVisibleChanged={isColunmVisibleChanged}
                                    showWildCardFilter={showWildCardFilter}
                                    selectedRecomIds={selectedRecomIds}
                                    clearSelection={clearSelection}
                                    exportToWord={exportToWordFile}
                                    exportToExcel={exportToExcelFiles}
                                    showViewModalExport={showViewModalExport}
                                    showViewImport={showViewImport}
                                    getSection={this.chooseMessage}
                                    hasAdditionalFilters={true}
                                    hasTableCellEdit={checkPermission("forms", "recommendations", "line_edit")}
                                    toggleLineEditing={toggleLineEditing}
                                    lineEditingEnabled={lineEditingEnabled}
                                />
                            )}

                            {this.props.isImageView ? (
                                <>
                                    <button
                                        className={!selectedRecomIds.length ? "add-btn disabled-btn mr-2" : "add-btn mr-2"}
                                        disabled={!selectedRecomIds.length}
                                        onClick={() => this.props.unAassignContent()}
                                    >
                                        <i className="fas fa-minus" /> Unassign Image
                                    </button>
                                </>
                            ) : !this.props.isChartView && !isBuildingLocked && !isBudgetPriority && section !== "assetInfo" ? (
                                showAddButton &&
                                (section !== "initiativeInfo" ? (
                                    <button className="add-btn" onClick={() => showAddForm()}>
                                        <i className="fas fa-plus" /> Add New Recommendation
                                    </button>
                                ) : (
                                    <button
                                        className={!this.props.enableButton ? "add-btn mr-2 disabled-btn" : "add-btn mr-2"}
                                        disabled={!this.props.enableButton}
                                        onClick={() => this.assignContent()}
                                    >
                                        <i className="fas fa-plus" /> Assign Initiative
                                    </button>
                                ))
                            ) : null}
                            {section === "assetInfo" ? (
                                <div>
                                    <Dropdown className="butn-blue-rgt mr-2" style={{ height: 40 }}>
                                        <Dropdown.Toggle id="dropdown-basic" style={{ backgroundColor: "#008efd", borderColor: "#008efd" }}>
                                            <span className="edit-icn-bx mt-1">
                                                <i className="fas fa-plus"></i> Add New Recommendation
                                            </span>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item>Add an End-of-Service-Life Recommendation</Dropdown.Item>
                                            <Dropdown.Item>Add an Asset Recommendation</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            ) : null}
                            {this.props.selectedDropdown === "assigned" && this.props.match.params.tab === "recommendation" ? (
                                <button
                                    className={!this.props.enableButton ? "add-btn disabled-btn" : "add-btn"}
                                    disabled={!this.props.enableButton}
                                    onClick={() => this.props.unAassignContent()}
                                >
                                    <i className="fas fa-minus" /> Unassign Initiative
                                </button>
                            ) : null}
                        </div>
                    </div>
                    <div class={`collapse-outer col-md-12 p-0  ${this.state.recToggleData ? "tog-cls" : ""} `}>
                        <ul>
                            {hasFilterByWater && this.props.projectReducer?.getProjectByIdResponse?.show_water_band && (
                                <li
                                    className={`${tableParams.water ? "active" : ""}`}
                                    onClick={() => filterByWater()}
                                    data-for="toggle-div"
                                    data-tip={
                                        tableParams.water === "yes"
                                            ? `View Recommendations with NO Water `
                                            : tableParams.water === "no"
                                            ? "Reset Water View Filter"
                                            : `View Recommendation with Water`
                                    }
                                >
                                    <img src="/img/water-icon.svg" alt="" /> Water
                                </li>
                            )}
                            {hasFilterByEnergy && this.props.projectReducer?.getProjectByIdResponse?.show_energy_band && (
                                <li
                                    className={`${tableParams.energy ? "active" : ""}`}
                                    onClick={() => filterByEnergy()}
                                    data-for="toggle-div"
                                    data-tip={
                                        tableParams.energy === "yes"
                                            ? `View Recommendations with NO Energy`
                                            : tableParams.energy === "no"
                                            ? "Reset Energy View Filter"
                                            : `View Recommendation with Energy`
                                    }
                                >
                                    <img src="/img/energy-icn.svg" alt="" /> Energy
                                </li>
                            )}
                            {hasIrRecommendation && (
                                <li
                                    className={`${tableParams.infrastructure_request ? "active" : ""}`}
                                    onClick={() => filterByIR()}
                                    data-for="toggle-div"
                                    data-tip={
                                        tableParams.infrastructure_request === "yes"
                                            ? `View Recommendations with NO Infrastructure Request`
                                            : tableParams.infrastructure_request === "no"
                                            ? "Reset Infrastructure Request View Filter"
                                            : `View Recommendation with Infrastructure Request`
                                    }
                                >
                                    <img src="/img/ir-icon.svg" alt="" /> Infrastructure Request
                                </li>
                            )}
                            {hasFilterByImages && (isConsultancyUser || isSuperAdmin) && (
                                <li
                                    className={`${tableParams.image_or_not ? "active" : ""}`}
                                    onClick={() => filterByImages()}
                                    data-for="toggle-div"
                                    data-tip={
                                        tableParams.image_or_not === "true"
                                            ? `View Recommendations with NO images `
                                            : tableParams.image_or_not === "false"
                                            ? "View All Recommendations"
                                            : `View Recommendation with Images`
                                    }
                                >
                                    <img src="/img/img-icon.svg" alt="" /> Image
                                </li>
                            )}
                            {hasViewMyRecommendation && isConsultancyUser && (
                                <li
                                    className={`${tableParams.surveyor ? "active" : ""}`}
                                    onClick={() => filterBySurveyor()}
                                    data-for="toggle-div"
                                    data-tip={tableParams.surveyor ? `View All Recommendations` : `View my SURVEYED Recommendations`}
                                >
                                    <img src="/img/person-icon.svg" alt="" />
                                    Surveyor
                                </li>
                            )}

                            {hasFilterByBudgetPriority && (
                                <li
                                    className={`${tableParams.budget_priority ? "active" : ""}`}
                                    onClick={() => filterByBudgetPriority()}
                                    data-for="toggle-div"
                                    data-tip={
                                        tableParams.budget_priority === "yes"
                                            ? `View Recommendations with NO Budget Priority`
                                            : tableParams.budget_priority === "no"
                                            ? "Reset Budget priority View Filter"
                                            : `View Recommendation with Budget priority`
                                    }
                                >
                                    <img src={walletIconn} alt="" />
                                    Budget Priority
                                </li>
                            )}

                            {hasFilterByFmp && (
                                <li
                                    className={`${tableParams.facility_master_plan ? "active" : ""}`}
                                    onClick={() => filterByFmp()}
                                    data-for="toggle-div"
                                    data-tip={
                                        tableParams.facility_master_plan === "yes"
                                            ? `View Recommendations with NO FMP`
                                            : tableParams.facility_master_plan === "no"
                                            ? "Reset Facility master plan View Filter"
                                            : `View Recommendation with FMP`
                                    }
                                >
                                    <img src="/img/plan-icon.svg" alt="" /> Facility Master Plan
                                </li>
                            )}
                            {hasRecomTypeFilter && (
                                <li
                                    className={`${tableParams.recommendation_type ? "active" : ""}`}
                                    onClick={() => filterByRecomType()}
                                    data-for="toggle-div"
                                    data-tip={
                                        tableParams.recommendation_type === "asset"
                                            ? `View Recommendations with Building Types`
                                            : tableParams.recommendation_type === "building"
                                            ? "Reset Recommendation Type Filter"
                                            : `View Recommendation with Asset Types`
                                    }
                                >
                                    <img src="/img/plan-icon.svg" alt="" /> Recommendation Type
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="recommendations-table">
                        <Table
                            updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                            tableData={tableData}
                            currentViewAllUsers={currentViewAllUsers}
                            handleDeleteItem={handleDeleteRecommendations}
                            showWildCardFilter={showWildCardFilter}
                            showEditPage={showEditPage}
                            showInfoPage={showInfoPage}
                            updateSelectedRow={updateSelectedRow}
                            selectedRowId={selectedRowId}
                            updateWildCardFilter={updateWildCardFilter}
                            wildCardFilter={wildCardFilter}
                            handleHideColumn={handleHideColumn}
                            getListForCommonFilter={getListForCommonFilterRecommendation}
                            updateCommonFilter={updateCommonFilter}
                            commonFilter={commonFilter}
                            hasActionColumn={!(this.props.isChartView || this.props.isAssetView || (isBudgetPriority && !isFullscreen))}
                            updateTableSortFilters={updateTableSortFilters}
                            tableParams={tableParams}
                            isBuildingLocked={this.props.isBuildingLocked}
                            handleCutPaste={handleCutPaste}
                            summaryRowData={summaryRowData}
                            showRestoreModal={showRestoreModal}
                            permissions={permissions}
                            handleSelect={this.props.handleSelect}
                            handleSelectAll={this.props.handleSelectAll}
                            recomentationIds={this.props.recomentationIds}
                            currentPage={paginationParams.currentPage}
                            selectedAllClicked={this.state.selectedAll}
                            resetSelect={this.resetSelect}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasInfoPage={hasInfoPage}
                            selectedRecomIds={selectedRecomIds}
                            handleSelectRecom={handleSelectRecom}
                            handleSelectAllRecom={handleSelectAllRecom}
                            isBudgetPriority={isBudgetPriority}
                            isFullscreen={isFullscreen}
                            tableRef={tableRef}
                            hasMultiAction={hasMultiAction}
                            everyItemCheckedPerPage={everyItemCheckedPerPage}
                            priorityElementsData={priorityElementsData}
                            exportFilters={tableDataExportFilters}
                            isInputMode={isInputMode}
                            handleCellFocus={handleCellFocus}
                            handleCellValueChange={handleCellValueChange}
                            handleColumnPin={handleColumnPin}
                            pinnedColumnsRef={pinnedColumnsRef}
                            hasPin={true}
                        />
                        {tableData.data && tableData.data.length ? (
                            <div className="table-bottom d-flex">
                                <div className="count d-flex col-md-6">
                                    <div className="count-dtl">
                                        Total Count: <span>{paginationParams.totalCount}</span>
                                    </div>
                                    <div className="col-md-2 pr-2 selbx">
                                        <select className="form-control" value={paginationParams.perPage} onChange={e => handlePerPageChange(e)}>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                            <option value="40">40</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="150">150</option>
                                        </select>
                                    </div>
                                    {section === "initiativeInfo" ? (
                                        <div className="count-dtl">
                                            Selected recommendations:{" "}
                                            <span>{this.state.selectedAll ? paginationParams.totalCount : recommendationIdCount.length}</span>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="pagination-sec col-md-6">
                                    <ReactPaginate
                                        previousLabel={
                                            <span data-place="top" data-effect="solid" data-tip={`Previous`} data-background-color="#007bff">
                                                &lt;
                                            </span>
                                        }
                                        nextLabel={
                                            <span data-place="top" data-effect="solid" data-tip={`Next`} data-background-color="#007bff">
                                                &gt;
                                            </span>
                                        }
                                        breakLabel={"..."}
                                        breakClassName={"break-me"}
                                        pageCount={paginationParams.totalPages}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={isBudgetPriority ? 1 : 5}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                        activeLinkClassName={"active"}
                                        forcePage={paginationParams.currentPage}
                                    />
                                    <ReactTooltip />
                                </div>
                            </div>
                        ) : null}
                    </div>{" "}
                    <ReactTooltip id="toggle-div" effect="solid" className="rc-tooltip-custom-class" place="top" backgroundColor="#007bff" />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { siteReducer, projectReducer } = state;
    return { siteReducer, projectReducer };
};

export default withRouter(connect(mapStateToProps, { ...recommendationsActions, ...projectActions })(RecommendationsMain));
