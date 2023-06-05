import React, { Component } from "react";

import uploadIcon from "../../../assets/img/upload-file.svg";
import gridIcon from "../../../assets/img/grid1.svg";
import listIcon from "../../../assets/img/grid.svg";
import arrowIcon from "../../../assets/img/timer-grp.svg";
import helpIcon from "../../../assets/img/question-mark-icon.png";
import actions from "../actions";
import { MASTER_FILTERS } from "../constants";
import { connect } from "react-redux";
import Loader from "../../common/components/Loader";
import funnelIcon from "../../../assets/img/tunnel.svg";
import ReactTooltip from "react-tooltip";
import _, { filter } from "lodash";
import { withRouter } from "react-router-dom";
import Portal from "../../common/components/Portal";
import ShowHelperModal from "../../helper/components/ShowHelperModal";

export class MasterFilter extends Component {
    state = {
        selectedDropDown: "",
        isLoading: false,
        search: {},
        showHelperModal: false,
        selectedHelperItem: {},
        tempFilter: this.props.masterFilters
    };

    componentDidUpdate = (prevProps, preState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            this.setState({
                tempFilter: this.props.masterFilters
            });
        }
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef = node => {
        this.wrapperRef = node;
    };

    handleClickOutside = event => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ tempFilter: this.props.masterFilters, selectedDropDown: "" });
        }
    };

    handleClickDropdown = async (key, paramKey) => {
        const { selectedDropDown } = this.state;
        this.setState({ selectedDropDown: selectedDropDown === key ? "" : key, isLoading: true });
        let params = { ...this.props.imageParams };
        delete params.offset;
        delete params.limit;
        delete params.order;
        delete params[paramKey];
        if (selectedDropDown !== key) await this.props.getFilterLists(key, params);
        this.setState({ isLoading: false });
    };

    handleUpdateFilter = () => {
        this.setState({ selectedDropDown: "" });
        this.props.updateMasterFilters(this.state.tempFilter);
    };

    isFiltered = () => {
        const {
            imageParams: { filters = {}, recommendation_image_assigned_true, image_modify_filter, is_asset_image }
        } = this.props;
        if (recommendation_image_assigned_true || image_modify_filter || is_asset_image) return true;
        if (filters && !_.isEmpty(filters)) {
            const filterKeys = Object.keys(filters);
            for (const item of filterKeys) {
                if (filters[item]?.key || filters[item]?.filters[0] === "null" || filters[item]?.filters[0] === "not_null") {
                    return true;
                }
            }
        }
        return false;
    };

    renderFilteredList = selectedItem => {
        const searchValue = this.state.search[selectedItem];
        const { masterFilterList } = this.props.imageReducer;
        let filteredList = [];
        if (masterFilterList[selectedItem]?.length) {
            filteredList = searchValue?.trim()?.length
                ? masterFilterList[selectedItem].filter(item => item.name?.toString()?.toLowerCase()?.includes(searchValue?.toLocaleLowerCase()))
                : masterFilterList[selectedItem];
        }
        return filteredList;
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

    handleCancelUncheck = item => {
        this.setState({ tempFilter: this.props.masterFilters, search: { ...this.state.search, [item.key]: "" }, selectedDropDown: "" });
    };

    handleMasterFilterSelect = async (selectedFilter, selectedData, isChecked) => {
        const { tempFilter } = this.state;
        if (isChecked) {
            await this.setState({ tempFilter: { ...tempFilter, [selectedFilter]: [...tempFilter[selectedFilter], selectedData] } });
        } else {
            await this.setState({
                tempFilter: { ...tempFilter, [selectedFilter]: tempFilter[selectedFilter].filter(k => k !== selectedData) }
            });
        }
    };
    handleMasterFilterSelectAll = async (selectedFilter, selectedDatas, isChecked) => {
        const { tempFilter } = this.state;
        let temp = [];
        selectedDatas.map(data => temp.push(data.id));
        await this.setState({ tempFilter: { ...tempFilter, [selectedFilter]: isChecked ? temp : [] } });
    };

    render() {
        const { selectedDropDown, isLoading, search } = this.state;
        const { masterFilterList } = this.props.imageReducer;
        const { imageParams, match, isAssignView, isSmartChartView } = this.props;
        const { tempFilter } = this.state;
        let filterKeys = MASTER_FILTERS;
        if (isAssignView) {
            if (isSmartChartView) {
                filterKeys = filterKeys.filter(f => f.key !== "clients");
            } else {
                filterKeys = filterKeys.filter(
                    f => f.key !== "projects" && f.key !== "buildings" && f.key !== "clients" && f.key !== "regions" && f.key !== "sites"
                );
            }
        }

        return (
            <div className="nav-fil-top">
                {this.renderUploadHelperModal()}
                <div className="top-bar align-items-center" ref={this.setWrapperRef}>
                    {filterKeys.map((item, idx) => (
                        <div className={`itm-tp ${imageParams[item.paramKey]?.length ? "bg-th-filtered" : ""}`} key={`mastr-fltr-${idx}`}>
                            <div
                                className={`dropdown-container ${selectedDropDown === item.key ? "dropdown-open" : ""} `}
                                onClick={() => this.handleClickDropdown(item.key, item.paramKey)}
                            >
                                <div className="dropdown-toggle click-dropdown">
                                    {item.label}
                                    <span className="close-reg">
                                        <i className="fas fa-chevron-down" />
                                    </span>
                                </div>
                                {selectedDropDown === item.key && (
                                    <div className={`dropdown-menu p-0 ${selectedDropDown === item.key ? "dropdown-active" : ""}`}>
                                        <div className="drop-filtr" onClick={e => e.stopPropagation()}>
                                            <div className="col-md-12 p-0 border-bottom pt-1">
                                                <span className="dropdown-item build_search_drp">
                                                    <input
                                                        type="search"
                                                        placeholder="Search..."
                                                        value={search[item.key]}
                                                        onChange={e => this.setState({ search: { ...search, [item.key]: e.target.value } })}
                                                    />
                                                    <i
                                                        class="fas fa-times cursor-pointer cls-close"
                                                        onClick={() => this.setState({ search: { ...search, [item.key]: "" } })}
                                                    />
                                                </span>
                                            </div>
                                            <div className="col-md-12 p-0 border-bottom pt-1">
                                                <div className="dropdown-item select_section_outer">
                                                    <label className="container-check">
                                                        Select all ({tempFilter[item.paramKey]?.length}
                                                        )
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                tempFilter[item.paramKey]?.length &&
                                                                tempFilter[item.paramKey]?.length === this.renderFilteredList(item.key)?.length
                                                                    ? true
                                                                    : false
                                                            }
                                                            onChange={e =>
                                                                this.handleMasterFilterSelectAll(
                                                                    item.paramKey,
                                                                    this.renderFilteredList(item.key),
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <button
                                                        className="clear-btn-selection"
                                                        // class="fas fa-times cursor-pointer cls-close"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            this.handleMasterFilterSelectAll(item.paramKey, [], false);
                                                        }}
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                            {isLoading ? (
                                                <div className={`col-md-12 p-3`}>
                                                    <Loader />
                                                </div>
                                            ) : (
                                                <>
                                                    {/* checked items */}
                                                    {masterFilterList[item.key]?.filter(fi => tempFilter[item.paramKey]?.includes(fi.id))?.length >
                                                        0 && (
                                                        <div className="col-md-12 p-0 slt-ara border-bottom">
                                                            {masterFilterList[item.key]
                                                                ?.filter(fi => tempFilter[item.paramKey]?.includes(fi.id))
                                                                ?.map(data => (
                                                                    <span className="dropdown-item" key={data.id}>
                                                                        <label className="container-check">
                                                                            {data.name}
                                                                            {item.key === "trades" && data?.project
                                                                                ? ` (${data?.project})`
                                                                                : item.key === "buildings" && data?.description
                                                                                ? ` (${data?.description})`
                                                                                : ""}
                                                                            <span className="float-right">({data.count})</span>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    tempFilter[item.paramKey]?.find(k => k === data.id) ? true : false
                                                                                }
                                                                                onChange={e => {
                                                                                    this.handleMasterFilterSelect(
                                                                                        item.paramKey,
                                                                                        data.id,
                                                                                        e.target.checked
                                                                                    );
                                                                                }}
                                                                            />
                                                                            <span className="checkmark" />
                                                                        </label>
                                                                    </span>
                                                                ))}
                                                        </div>
                                                    )}
                                                    {/* unchecked items */}
                                                    {this.renderFilteredList(item.key)?.filter(fi => !tempFilter[item.paramKey]?.includes(fi.id))
                                                        ?.length ? (
                                                        <div className="col-md-12 p-0 slt-ara">
                                                            {this.renderFilteredList(item.key)
                                                                ?.filter(fi => !tempFilter[item.paramKey]?.includes(fi.id))
                                                                ?.map(data => (
                                                                    <span className="dropdown-item" key={data.id}>
                                                                        <label className="container-check">
                                                                            {data.name}
                                                                            {item.key === "trades" && data?.project
                                                                                ? ` (${data?.project})`
                                                                                : item.key === "buildings" && data?.description
                                                                                ? ` (${data?.description})`
                                                                                : ""}
                                                                            <span className="float-right">({data.count})</span>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    tempFilter[item.paramKey]?.find(k => k === data.id) ? true : false
                                                                                }
                                                                                onChange={e =>
                                                                                    this.handleMasterFilterSelect(
                                                                                        item.paramKey,
                                                                                        data.id,
                                                                                        e.target.checked
                                                                                    )
                                                                                }
                                                                            />
                                                                            <span className="checkmark" />
                                                                        </label>
                                                                    </span>
                                                                ))}
                                                        </div>
                                                    ) : (
                                                        <div className={`col-md-12`}>
                                                            {masterFilterList[item.key]?.filter(fi => tempFilter[item.paramKey]?.includes(fi.id))
                                                                ?.length === 0 &&
                                                            this.renderFilteredList(item.key)?.filter(
                                                                fi => !tempFilter[item.paramKey]?.includes(fi.id)
                                                            )?.length === 0
                                                                ? "No data Found"
                                                                : "No more values to display"}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            <div className="col-md-12 drp-btn">
                                                <button type="button" className="btn btn-primary" onClick={() => this.handleUpdateFilter()}>
                                                    ok
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btnClr ml-2"
                                                    onClick={async () => {
                                                        this.handleCancelUncheck(item);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {this.props.hasCreate && !isAssignView && (
                        <div className="itm-tp upload-btn upload-pull-img">
                            <button
                                onClick={e => {
                                    this.props.onAddImage(e);
                                }}
                                className={match.url === "/images" ? "btn btn-upload-bt d-flex align-items-center" : "btn btn-upload-bt"}
                            >
                                <span className="icon">
                                    <img src={uploadIcon} alt="" />
                                </span>
                                <span className="text">Upload Images</span>
                            </button>
                        </div>
                    )}
                </div>
                <div className="top-bar icon-bar">
                    {this.props.hasCreate && isAssignView && (
                        <div className="itm-tp upload-btn upload-pull-img mr-1">
                            <button
                                onClick={e => {
                                    this.props.onAddImage(e);
                                }}
                                className={match.url === "/images" ? "btn btn-upload-bt d-flex align-items-center" : "btn btn-upload-bt"}
                            >
                                <span className="icon">
                                    <img src={uploadIcon} alt="" />
                                </span>
                                <span className="text">Upload Images</span>
                            </button>
                        </div>
                    )}
                    <div className="itm-tp" data-for="master-img-filter" data-tip={"List View"} onClick={() => this.props.setGridView(false)}>
                        <img src={listIcon} alt="" />
                    </div>
                    <div className="itm-tp" data-for="master-img-filter" data-tip={"Grid View"} onClick={() => this.props.setGridView(true)}>
                        <img src={gridIcon} alt="" />
                    </div>
                    <div
                        className="itm-tp"
                        data-for="master-img-filter"
                        data-tip={"Help"}
                        onClick={() => {
                            this.showHelperModal("menu", "image_management");
                        }}
                    >
                        <img src={helpIcon} className="img-width" alt="" />
                    </div>
                    <div
                        className={`itm-tp ${this.isFiltered() ? "bg-th-filtered" : ""}`}
                        data-for="master-img-filter"
                        data-tip={"Filter"}
                        onClick={this.props.toggleAdvancedFilters}
                        data-toggle="collapse"
                        href="#collapseExample"
                    >
                        <img src={funnelIcon} className="img-width" alt="" />
                    </div>
                    <ReactTooltip id="master-img-filter" effect="solid" place="bottom" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(MasterFilter));
