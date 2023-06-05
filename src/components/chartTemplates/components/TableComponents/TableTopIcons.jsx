import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Portal from "../../../common/components/Portal";
import FilterValue from "./FilterValue";
import ReactTooltip from "react-tooltip";

import GlobalSearch from "../../../common/components/GlobalSearch";
import ShowHelperModal from "../../../helper/components/ShowHelperModal";
import SelectDownloadTypeModal from "../DownloadTypeModal";
import { REPORT_URL } from "../../../../config/constants";
import { DEFAULT_CHART_TEMPLATE_WITH_HEADER, DEFAULT_CHART_TEMPLATE_WITHOUT_HEADER } from "../../constants";

class TableTopIcons extends Component {
    state = { viewFilterModal: false, showHelperModal: false, selectedHelperItem: {}, showSelectTemplateDownloadTypeModal: false };
    isFiltered = () => {
        const { tableParams = {} } = this.props;
        if (tableParams.list && !_.isEmpty(tableParams.list)) {
            return true;
        }
        if (tableParams.filters && !_.isEmpty(tableParams.filters)) {
            const filters = Object.keys(tableParams.filters);
            for (const item of filters) {
                if (tableParams.filters[item] && tableParams.filters[item].key && tableParams.filters[item].key.length) {
                    return true;
                }
                if (tableParams.filters[item] && tableParams.filters[item].filters && tableParams.filters[item].filters.includes("not_null")) {
                    return true;
                }
            }
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

    showSelectTemplateDownloadTypeModal = async showSelectTemplateDownloadTypeModal => {
        await this.setState({
            showSelectTemplateDownloadTypeModal
        });
    };

    renderSelectDownloadTypeModal = () => {
        const { showSelectTemplateDownloadTypeModal } = this.state;
        const { exportExcelAllTrades } = this.props;
        if (!showSelectTemplateDownloadTypeModal) return null;
        return (
            <Portal
                body={
                    <SelectDownloadTypeModal
                        type="cancel"
                        heading={"Please select download type."}
                        onCancel={() => this.showSelectTemplateDownloadTypeModal(false)}
                        onOk={type => {
                            this.showSelectTemplateDownloadTypeModal(false);
                            this.handleDownloadItem(type);
                        }}
                    />
                }
                onCancel={() => this.showSelectTemplateDownloadTypeModal(false)}
            />
        );
    };

    handleDownloadItem = async type => {
        let url = REPORT_URL + (type === "with_header" ? DEFAULT_CHART_TEMPLATE_WITH_HEADER : DEFAULT_CHART_TEMPLATE_WITHOUT_HEADER);
        const link = document.createElement("a");
        link.href = url;
        link.download = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    render() {
        const {
            handleGlobalSearch,
            globalSearchKey,
            resetAllFilters,
            resetSort,
            toggleWildCardFilter,
            isColunmVisibleChanged = null,
            showViewModal,
            exportTableXl,
            tableData,
            isSelectFilter = false,
            selectFilterHandler,
            tableParams,
            entity,
            hasHelp = true,
            resetAll = null,
            hasDefaultTemplateDownload = false
        } = this.props;
        let filterCount = 0;
        tableParams &&
            Object.keys(tableParams).map(f =>
                ((f == "list" && tableParams[f] && typeof tableParams[f] === "object" && Object.entries(tableParams[f]).length != 0) ||
                    (f == "filters" && tableParams[f] && Object.keys(tableParams[f]).find(fi => tableParams[f][fi].key)) ||
                    f == "search") &&
                tableParams[f]
                    ? (filterCount = filterCount + 1)
                    : null
            );
        return (
            <React.Fragment>
                <GlobalSearch handleGlobalSearch={handleGlobalSearch} globalSearchKey={globalSearchKey} />
                {this.state.viewFilterModal ? (
                    <Portal
                        body={<FilterValue filterValues={tableParams} onCancel={() => this.setState({ viewFilterModal: false })} />}
                        onCancel={() => this.setState({ showViewModal: false })}
                    />
                ) : null}

                <div className="view">
                    <div
                        className={`view-inner${this.isSorted() ? " bg-th-filtered" : ""}`}
                        data-place="bottom"
                        data-effect="solid"
                        data-tip={`Reset Sort`}
                        data-background-color="#007bff"
                        onClick={() => this.isSorted() && resetSort()}
                    >
                        <img src="/img/t-arrow-off.svg" alt="" className="sort-ico flr-crs" />
                    </div>
                </div>

                <div className="view">
                    <div
                        className={`view-inner${this.isFiltered() ? " bg-th-filtered" : ""}`}
                        data-place="bottom"
                        data-effect="solid"
                        data-tip={`Filter`}
                        data-background-color="#007bff"
                        onClick={() => toggleWildCardFilter()}
                    >
                        <img src="/img/filter.svg" alt="" />
                    </div>
                </div>
                <div className="view">
                    <div
                        className="view-inner"
                        data-tip={`Reset Filters`}
                        data-effect="solid"
                        data-place="bottom"
                        data-background-color="#007bff"
                        onClick={() => (this.isFiltered() || this.props.globalSearchKey) && resetAllFilters()}
                    >
                        <img src="/img/filter-off.svg" alt="" className="fil-ico" />
                    </div>
                </div>
                <div className="view">
                    <div
                        className="view-inner"
                        onClick={() => showViewModal()}
                        data-place="bottom"
                        data-effect="solid"
                        data-tip={`Column Hide/Unhide`}
                        data-background-color="#007bff"
                    >
                        <img src="/img/eye-ico.svg" alt="" className="eye-ico" />
                    </div>
                </div>

                {this.props.isExport ? (
                    <div className="view ">
                        {this.props.tableLoading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            <div
                                className="view-inner"
                                onClick={() => exportTableXl()}
                                data-place="bottom"
                                data-effect="solid"
                                data-tip="Export to Excel"
                                data-background-color="#007bff"
                                currentitem="false"
                            >
                                <img src="/img/excell-new.svg" alt="" className="export" />
                            </div>
                        )}
                    </div>
                ) : (
                    ""
                )}
                {hasDefaultTemplateDownload ? (
                    <div className="view ">
                        {/* {this.props.exportAllTradesLoading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : ( */}
                        <div
                            className="view-inner"
                            onClick={() => this.showSelectTemplateDownloadTypeModal(true)}
                            data-tip={`Download Default Template`}
                            data-effect="solid"
                            data-place="bottom"
                            data-background-color="#007bff"
                        >
                            <i class="fas fa-solid fa-file-word"></i>
                        </div>
                        {/* )} */}
                    </div>
                ) : null}
                {resetAll && (
                    <div className="view">
                        <div
                            className={`view-inner${
                                this.isSorted() ||
                                this.isFiltered() ||
                                this.props.globalSearchKey ||
                                tableParams?.image_or_not ||
                                tableParams?.surveyor ||
                                (isColunmVisibleChanged && isColunmVisibleChanged())
                                    ? " bg-th-filtered"
                                    : ""
                            }`}
                            data-for="table-top-icons"
                            data-tip={`Reset All`}
                            onClick={() =>
                                this.isSorted() ||
                                this.isFiltered() ||
                                this.props.globalSearchKey ||
                                tableParams?.image_or_not ||
                                tableParams?.surveyor ||
                                (isColunmVisibleChanged && isColunmVisibleChanged())
                                    ? resetAll()
                                    : ""
                            }
                        >
                            <img src="/img/refresh-dsh.svg" alt="" className="" />
                        </div>
                    </div>
                )}
                {tableParams && filterCount != 0 ? (
                    <div className="view ">
                        <div className="view-inner filter-all" onClick={this.setFilterModal}>
                            <img
                                src=" /img/filter.svg"
                                alt=""
                                className={"filtrImg"}
                                data-tip="Applied Filters"
                                data-background-color="#007bff"
                                currentitem="false"
                            />
                            <div className="arrow-sec"></div>
                            <span className="notifyTxt">{filterCount}</span>
                        </div>
                    </div>
                ) : null}
                {entity && hasHelp ? (
                    <div className="view">
                        <div
                            className="view-inner help-icon"
                            data-tip={`Help`}
                            data-effect="solid"
                            data-place="bottom"
                            data-background-color="#007bff"
                            onClick={() => {
                                this.showHelperModal("tables", entity);
                            }}
                        >
                            <img src="/img/question-mark-icon.png" alt="" className="fil-ico" />
                        </div>
                    </div>
                ) : null}
                {this.renderUploadHelperModal()}
                {this.renderSelectDownloadTypeModal()}
                <ReactTooltip />
            </React.Fragment>
        );
    }
}

export default withRouter(TableTopIcons);
