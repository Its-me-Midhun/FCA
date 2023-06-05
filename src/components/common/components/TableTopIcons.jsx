import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Portal from "../../common/components/Portal";
import FilterValue from "../../site/components/FilterValues";
import ReactTooltip from "react-tooltip";
import ShowHelperModal from "../../helper/components/ShowHelperModal";
import SelectExportTypeModal from "./SelectExportTypeModal";
import NewlyCreated from "../../../assets/img/Group7.svg";
import NewlyEdited from "../../../assets/img/Group6.svg";
import GlobalSearch from "./GlobalSearch";
import SelectExportTypeWordModal from "./SelectExportTypeWordModal";

class TableTopIcons extends Component {
    state = { viewFilterModal: false, showHelperModal: false, selectedHelperItem: {}, toggleDiv: true };
    isFiltered = () => {
        const { tableParams = {} } = this.props;
        if (tableParams.list && !_.isEmpty(tableParams.list)) {
            return true;
        }
        if (tableParams.filters && !_.isEmpty(tableParams.filters)) {
            const filters = Object.keys(tableParams.filters);
            if (Object.values(tableParams.filters).every(item => item.key === null)) {
                return false;
            }
            for (const item of filters) {
                if (tableParams.filters[item] && tableParams.filters[item].key && tableParams.filters[item].key.length) {
                    return true;
                }
                if (
                    tableParams.filters[item] &&
                    tableParams.filters[item].filters &&
                    (tableParams.filters[item].filters.includes("not_null") || tableParams.filters[item].filters.includes("null"))
                ) {
                    return true;
                }
            }
            return true;
        }
        if (
            tableParams.recommendation_ids?.length ||
            this.props.globalSearchKey ||
            tableParams.image_or_not ||
            tableParams.recommendation_assigned_true ||
            tableParams?.surveyor ||
            tableParams?.infrastructure_request ||
            tableParams?.water ||
            tableParams?.energy ||
            tableParams?.fmp ||
            tableParams?.facility_master_plan ||
            tableParams?.recommendation_type ||
            tableParams?.budget_priority ||
            tableParams?.recommendation_ids?.length
        ) {
            return true;
        }
        return false;
    };
    isSorted = () => {
        const { tableParams = {} } = this.props;
        if (tableParams.order && !_.isEmpty(tableParams.order)) {
            return true;
        }

        return false;
    };

    isSelected = () => {
        const { tableParams = {} } = this.props;
        if (tableParams.deleted || tableParams.active || tableParams.locked || tableParams.unlocked) {
            return true;
        }

        return false;
    };

    setFilterModal = () => {
        this.setState({
            viewFilterModal: true
        });
    };

    showHelperModal = async (item, subItem) => {
        await this.setState({
            showHelperModal: true,
            selectedHelperItem: {
                item,
                subItem
            }
        });
    };

    renderUploadHelperModal = () => {
        const { showHelperModal, selectedHelperItem } = this.state;
        if (!showHelperModal) return null;
        return (
            <Portal
                body={<ShowHelperModal selectedHelperItem={selectedHelperItem} onCancel={() => this.setState({ showHelperModal: false })} />}
                onCancel={() => this.setState({ showHelperModal: false })}
            />
        );
    };

    showSelectExportTypeWordModal = async showSelectExportTypeWordModal => {
        await this.setState({
            showSelectExportTypeWordModal
        });
    };

    renderSelectExportTypeWordModal = () => {
        const { showSelectExportTypeWordModal } = this.state;
        const { exportToWord, exportToExcel } = this.props;
        if (!showSelectExportTypeWordModal) return null;
        return (
            <Portal
                body={
                    <SelectExportTypeWordModal
                        type="cancel"
                        heading={"Please Select Export Type."}
                        onCancel={() => this.showSelectExportTypeWordModal(false)}
                        onOk={(sort_type, file_type) => {
                            this.showSelectExportTypeWordModal(false);
                            if (file_type === "word") {
                                exportToWord(sort_type);
                            } else {
                                exportToExcel(sort_type);
                            }
                        }}
                    />
                }
                onCancel={() => this.showSelectExportTypeWordModal(false)}
            />
        );
    };

    showSelectExportTypeExcelModal = async showSelectExportTypeExcelModal => {
        await this.setState({
            showSelectExportTypeExcelModal
        });
    };

    // renderSelectExportTypeWordModal = () => {
    //     const { showSelectExportTypeExcelModal } = this.state;
    //     const { exportToExcelFromExportHistory } = this.props;
    //     if (!showSelectExportTypeExcelModal) return null;
    //     return (
    //         <Portal
    //             body={
    //                 <SelectExportTypeWordModal
    //                     type="cancel"
    //                     heading={"Please select export type."}
    //                     onCancel={() => this.showSelectExportTypeExcelModal(false)}
    //                     onOk={sort_type => {
    //                         this.showSelectExportTypeExcelModal(false);
    //                         exportToExcelFromExportHistory(sort_type);
    //                     }}
    //                 />
    //             }
    //             onCancel={() => this.showSelectExportTypeExcelModal(false)}
    //         />
    //     );
    // };

    showSelectExportTypeModal = async showSelectExportTypeModal => {
        await this.setState({
            showSelectExportTypeModal
        });
    };

    renderSelectExportTypeModal = () => {
        const { showSelectExportTypeModal } = this.state;
        const { exportExcelAllTrades } = this.props;
        if (!showSelectExportTypeModal) return null;
        return (
            <Portal
                body={
                    <SelectExportTypeModal
                        type="cancel"
                        heading={"Please select export type."}
                        onCancel={() => this.showSelectExportTypeModal(false)}
                        onOk={export_type => {
                            this.showSelectExportTypeModal(false);
                            exportExcelAllTrades(export_type);
                        }}
                    />
                }
                onCancel={() => this.showSelectExportTypeModal(false)}
            />
        );
    };
    setSortOrderParamsByArrow = async (event, searchKey, val, tableData) => {
        if (tableData && tableData.data && tableData.data.length) {
            await this.props.updateLastSortFilter(searchKey, val);
        }
    };
    toggle = () => {
        this.setState(prevState => ({
            toggleDiv: !prevState.toggleDiv
        }));
        this.props.getSection(this.state.toggleDiv);
    };

    render() {
        const {
            handleGlobalSearch,
            globalSearchKey,
            resetAllFilters,
            resetSort,
            toggleWildCardFilter,
            showViewModal,
            showViewModalExport,
            // showViewImport,
            exportTableXl,
            hasSort = true,
            entity = null,
            isColunmVisibleChanged = null,
            tableParams,
            hasHelp = true,
            hasGlobalSearch = true,
            hasWildCardFilter = true,
            hasView = true,
            exportCustomExcel = null,
            exportToWord = null,
            customExcelExportLoading = false,
            hasNewlyCreated,
            hasNewlyEdited,
            tableData,
            resetAll = null,
            filterByRecommendationAssigned = null,
            hasIrRecommendation,
            showWildCardFilter = false,
            selectedRecomIds,
            clearSelection,
            hasViewExportModal,
            exportToExcelFromExportHistory,
            hasAdditionalFilters,
            isBudgetPriority,
            hasTableCellEdit,
            toggleLineEditing,
            lineEditingEnabled
        } = this.props;

        let filterCount = 0;
        tableParams &&
            Object.keys(tableParams).map(f =>
                ((f === "list" && tableParams[f] && typeof tableParams[f] === "object" && Object.entries(tableParams[f]).length != 0) ||
                    (f === "filters" && tableParams[f] && Object.keys(tableParams[f]).find(fi => tableParams[f][fi].key)) ||
                    f === "search" ||
                    f === "surveyor" ||
                    f === "image_or_not" ||
                    f === "infrastructure_request" ||
                    f === "water" ||
                    f === "energy" ||
                    f === "fmp" ||
                    f === "facility_master_plan" ||
                    f === "recommendation_type" ||
                    f === "budget_priority" ||
                    f === "recommendation_assigned_true") &&
                tableParams[f]
                    ? (filterCount = filterCount + 1)
                    : null
            );
        return (
            <React.Fragment>
                {hasGlobalSearch ? <GlobalSearch handleGlobalSearch={handleGlobalSearch} globalSearchKey={globalSearchKey} /> : null}
                {hasWildCardFilter && this.state.viewFilterModal ? (
                    <Portal
                        body={<FilterValue filterValues={tableParams} onCancel={() => this.setState({ viewFilterModal: false })} />}
                        onCancel={() => this.setState({ showViewModal: false })}
                    />
                ) : null}

                {hasTableCellEdit && (
                    <div className="view">
                        <div
                            className={`view-inner ${lineEditingEnabled ? "bg-th-filtered" : ""}`}
                            data-for="table-top-icons"
                            data-tip={lineEditingEnabled ? `Disable Line Editing` : `Enable Line Editing`}
                            onClick={() => toggleLineEditing()}
                        >
                            <img src="/img/Edit.svg" alt="" className="sort-ico flr-crs" />
                        </div>
                    </div>
                )}
                {hasSort ? (
                    <div className="view">
                        <div
                            className={`view-inner ${this.isSorted() ? " bg-th-filtered" : ""}`}
                            data-for="table-top-icons"
                            data-tip={`Reset Sort`}
                            onClick={() => this.isSorted() && resetSort()}
                        >
                            <img src="/img/t-arrow-off.svg" alt="" className="sort-ico flr-crs" />
                        </div>
                    </div>
                ) : null}

                {hasNewlyCreated ? (
                    <div className="view date-sort">
                        <div
                            className={`view-inner ${
                                tableParams.order && tableParams.order["recommendations.created_at"] ? " bg-th-filtered bg-filt-icon" : ""
                            }`}
                            data-for="table-top-icons"
                            data-tip={`Sort by Newly Created`}
                            onClick={event => this.setSortOrderParamsByArrow(event, "recommendations.created_at", "Created At", tableData)}
                        >
                            <img src={NewlyCreated} alt="" className="sort-ico flr-crs" />
                            {tableParams.order && tableParams.order["recommendations.created_at"] === "asc" ? (
                                <i className={`fas fa-long-arrow-alt-up table-param-rep calend-recom-icon text-danger`} />
                            ) : tableParams.order && tableParams.order["recommendations.created_at"] === "desc" ? (
                                <i className={`fas fa-long-arrow-alt-down table-param-rep calend-recom-icon text-danger`} />
                            ) : null}
                        </div>
                    </div>
                ) : null}
                {hasNewlyEdited ? (
                    <div className="view date-sort">
                        <div
                            className={`view-inner ${
                                tableParams.order && tableParams.order["recommendations.updated_at"] ? " bg-th-filtered bg-filt-icon" : ""
                            }`}
                            data-for="table-top-icons"
                            data-tip={`Sort by Newly Edited `}
                            onClick={event => this.setSortOrderParamsByArrow(event, "recommendations.updated_at", "Updated At", tableData)}
                        >
                            <img src={NewlyEdited} alt="" className="sort-ico flr-crs" />
                            {tableParams.order && tableParams.order["recommendations.updated_at"] === "asc" ? (
                                <i className={`fas fa-long-arrow-alt-up table-param-rep calend-recom-icon text-danger`} />
                            ) : tableParams.order && tableParams.order["recommendations.updated_at"] === "desc" ? (
                                <i className={`fas fa-long-arrow-alt-down table-param-rep calend-recom-icon text-danger`} />
                            ) : null}
                        </div>
                    </div>
                ) : null}

                {hasWildCardFilter ? (
                    <>
                        <div className="view">
                            <div
                                className={`view-inner ${this.isFiltered() ? " bg-th-filtered" : ""}`}
                                data-for="table-top-icons"
                                data-tip={`Filter`}
                                onClick={() => toggleWildCardFilter()}
                            >
                                <img src="/img/filter.svg" alt="" />
                            </div>
                        </div>
                        <div className="view">
                            <div
                                className={`view-inner  ${this.isFiltered() ? "bg-th-filtered" : ""}`}
                                data-tip={`Reset Filters`}
                                data-for="table-top-icons"
                                onClick={() => {
                                    if (showWildCardFilter) toggleWildCardFilter();
                                    if (this.isFiltered()) resetAllFilters();
                                }}
                            >
                                <img src="/img/filter-off.svg" alt="" className="fil-ico" />
                            </div>
                        </div>
                    </>
                ) : null}

                {exportToExcelFromExportHistory ? (
                    <div className="view ">
                        {this.props.exportExcelHistoryLoading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            <div
                                className="view-inner"
                                onClick={() => exportToExcelFromExportHistory()}
                                data-for="table-top-icons"
                                data-tip="Export to Excel "
                            >
                                <img src="/img/excell-new.svg" alt="" className="export" />
                            </div>
                        )}
                    </div>
                ) : (
                    ""
                )}
                {hasView && (
                    <div className="view">
                        <div className="view-inner" onClick={() => showViewModal()} data-for="table-top-icons" data-tip={`Column Hide/Unhide`}>
                            <img src="/img/eye-ico.svg" alt="" className="eye-ico" />
                        </div>
                    </div>
                )}

                {filterByRecommendationAssigned && (
                    <div className="view">
                        <div
                            className={`view-inner ${tableParams.recommendation_assigned_true ? "bg-th-filtered" : ""}`}
                            onClick={() => filterByRecommendationAssigned()}
                            data-for="table-top-icons"
                            data-tip={
                                tableParams.recommendation_assigned_true === "true"
                                    ? `View Assets with NO Recommendations`
                                    : tableParams.recommendation_assigned_true === "false"
                                    ? `View All Assets`
                                    : `View Assets with Recommendations`
                            }
                        >
                            <img src="/img/recom-assigned.svg" alt="" className="" />
                        </div>
                    </div>
                )}
                {this.props.isExport ? (
                    <div className="view ">
                        {this.props.tableLoading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            <div className="view-inner" onClick={() => exportTableXl()} data-for="table-top-icons" data-tip="Export to Excel">
                                <img src="/img/excell-new.svg" alt="" className="export" />
                            </div>
                        )}
                    </div>
                ) : (
                    ""
                )}

                {exportCustomExcel && (
                    <div className="view ">
                        {customExcelExportLoading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            <div
                                className="view-inner"
                                onClick={() => exportCustomExcel()}
                                data-for="table-top-icons"
                                data-tip="Export to Custom Excel"
                            >
                                <img src="/img/excell-new.svg" alt="" className="export export-all-trades" />
                            </div>
                        )}{" "}
                    </div>
                )}

                {/* {exportExcelAllTrades ? (
                    <div className="view ">
                        {this.props.exportAllTradesLoading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            <div
                                className="view-inner"
                                onClick={() => this.showSelectExportTypeModal(true)}
                                data-for="table-top-icons"
                                data-tip="Export All Trades"
                            >
                                <img src="/img/excell-new.svg" alt="" className="export export-all-trades" />
                            </div>
                        )}
                    </div>
                ) : (
                    ""
                )} */}
                {hasViewExportModal && (
                    <div className="view">
                        <div
                            className="view-inner"
                            onClick={() => showViewModalExport()}
                            data-for="table-top-icons"
                            data-tip={`Export Data Table Settings`}
                        >
                            <img src="/img/Word settings new-02.svg" alt="" />
                        </div>
                    </div>
                )}
                {exportToWord ? (
                    <div className="view ">
                        {this.props.exportWordLoading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            <div
                                className="view-inner"
                                onClick={() => this.showSelectExportTypeWordModal(true)}
                                data-for="table-top-icons"
                                data-tip="Export Data Table"
                                data-place="bottom"
                            >
                                <img src="/img/Word.svg" alt="" />
                            </div>
                        )}
                    </div>
                ) : (
                    ""
                )}

                {tableParams && filterCount != 0 ? (
                    <div className="view ">
                        <div className="view-inner filter-all" onClick={this.setFilterModal}>
                            <img src=" /img/filter.svg" alt="" className={"filtrImg"} data-tip="Applied Filters" data-for="table-top-icons" />
                            <div className="arrow-sec"></div>
                            <span className="notifyTxt">{filterCount}</span>
                        </div>
                    </div>
                ) : null}
                {resetAll && (
                    <div className="view">
                        <div
                            className={`view-inner${
                                this.isSorted() || this.isFiltered() || (isColunmVisibleChanged && isColunmVisibleChanged()) ? " bg-th-filtered" : ""
                            }`}
                            data-for="table-top-icons"
                            data-tip={`Reset All`}
                            onClick={() => {
                                if (showWildCardFilter) toggleWildCardFilter();
                                if (selectedRecomIds?.length) clearSelection();
                                if (lineEditingEnabled) toggleLineEditing();
                                if (this.isSorted() || this.isFiltered() || (isColunmVisibleChanged && isColunmVisibleChanged())) resetAll();
                            }}
                        >
                            <img src="/img/refresh-dsh.svg" alt="" className="" />
                        </div>
                    </div>
                )}
                {entity && hasHelp ? (
                    <div className={`view ${isBudgetPriority ? "" : "brd-rht"}`}>
                        <div
                            className="view-inner help-icon"
                            data-tip={`Help`}
                            data-for="table-top-icons"
                            onClick={() => {
                                this.showHelperModal("tables", entity);
                            }}
                        >
                            <img src="/img/question-mark-icon.png" alt="" className="fil-ico" />
                            <ReactTooltip id="table-top-icons" effect="solid" place="bottom" backgroundColor="#007bff" />
                        </div>
                    </div>
                ) : null}
                {hasAdditionalFilters && (
                    <div className={`view-mor-out ${isBudgetPriority ? "ml-0" : ""}`}>
                        <div className={`view more-icon-otr ${!this.state.toggleDiv ? "active-bg" : ""} ${isBudgetPriority ? "mr-1" : ""}`}>
                            <div
                                className={`view-inner ${this.isFiltered() && this.state.toggleDiv ? " bg-th-filtered" : ""}`}
                                onClick={this.toggle}
                                data-tip={`Additional Filters`}
                                data-for="table-top-icons"
                            >
                                <img src="/img/recom-blue-icon.svg" alt="" />
                            </div>
                        </div>
                    </div>
                )}
                {this.renderUploadHelperModal()}
                {this.renderSelectExportTypeModal()}
                {this.renderSelectExportTypeWordModal()}
                <ReactTooltip id="table-top-icons" effect="solid" place="bottom" backgroundColor="#007bff" />
            </React.Fragment>
        );
    }
}

export default withRouter(TableTopIcons);
