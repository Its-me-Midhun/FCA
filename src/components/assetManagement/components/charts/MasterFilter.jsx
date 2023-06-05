import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ReactTooltip from "react-tooltip";
import Loader from "../../../common/components/Loader";
import actions from "../../actions";
class TopFilter extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    state = {
        chartParams: {},
        selectedDropDown: "",
        selectedFilter: [],
        isLoading: false,
        searchValue: ""
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                selectedDropDown: ""
            });
        }
    }

    handleClickDropdown = async (key, paramKey, e) => {
        const { selectedDropDown } = this.state;
        this.setState({ selectedDropDown: selectedDropDown === key ? "" : key, isLoading: true });
        let params = { ...this.props.chartParams };
        const {
            match: {
                params: { id, section }
            },
            basicDetails
        } = this.props;
        switch (section) {
            case "assetinfo":
                params.client_id = id;
                break;
            case "regioninfo":
                params.client_id = basicDetails?.client?.id;
                params.region_ids = [id];
                break;
            case "siteinfo":
                params.client_id = basicDetails?.client?.id;
                params.site_ids = [id];
                break;
            case "buildinginfo":
                params.client_id = basicDetails?.client?.id;
                params.building_ids = [id];
                break;
            default:
                break;
        }
        delete params[paramKey];
        if (selectedDropDown !== key) await this.props.getFilterLists(key, params);
        this.setState({ isLoading: false });
    };

    handleUpdateFilter = () => {
        this.setState({ selectedDropDown: "" });
        this.props.updateMasterFilters();
    };

    render() {
        const { selectedDropDown, isLoading, searchValue } = this.state;
        const { chartParams, selectedMasterFilters } = this.props;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const MASTER_FILTER_KEYS = [
            ...(section === "assetinfo" ? [{ label: "Regions", key: "regions", paramKey: "region_ids" }] : []),
            ...(section === "assetinfo" || section === "regioninfo" ? [{ label: "Sites", key: "sites", paramKey: "site_ids" }] : []),
            ...(section === "assetinfo" || section === "regioninfo" || section === "siteinfo"
                ? [{ label: "Buildings", key: "buildings", paramKey: "building_ids" }]
                : []),
            { label: "B.Types", key: "building_types", paramKey: "building_type_ids" },
            { label: "Condition", key: "asset_conditions", paramKey: "asset_condition_ids" },
            { label: "Status", key: "asset_statuses", paramKey: "asset_status_ids" },
            { label: "Types", key: "asset_types", paramKey: "asset_type_ids" }
            // { label: "Recommendation", key: "recommendation_filter", paramKey: "recommendation_assigned" }
        ];
        const { chartMasterFilterList } = this.props.assetManagementReducer;

        return (
            <div className="dtl-sec dshb mt-2 custom-topfilter">
                <div className="row mb-1">
                    <div className="col-md-12" id={"top-fltr"} ref={this.setWrapperRef}>
                        <div className="d-flex itm-nmb">
                            {MASTER_FILTER_KEYS.map(item => (
                                <div className={`col p-1 ${chartParams && chartParams[item.paramKey]?.length ? "bg-th-filtered" : ""}`}>
                                    <div
                                        className={selectedDropDown === item.key ? "dropdown-container dropdown-open" : "dropdown-container"}
                                        onClick={() => this.handleClickDropdown(item.key, item.paramKey)}
                                    >
                                        <div className="dropdown-toggle click-dropdown">
                                            {item.label}
                                            <span className="close-reg">
                                                <i className="fas fa-chevron-down"></i>
                                            </span>
                                        </div>

                                        <div
                                            className={
                                                selectedDropDown === item.key
                                                    ? "dropdown-menu  dropdown-active drop-filtr pos-abs dp-rcm-overflow asset-dp-rcm"
                                                    : "dropdown-menu "
                                            }
                                            onClick={e => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            {chartMasterFilterList[item.key]?.length ? (
                                                <>
                                                    {/* onClick={e => {
                                                            e.stopPropagation();
                                                        }} */}

                                                    <div className="col-md-12 p-0 border-bottom pt-1">
                                                        <span className="dropdown-item build_search_drp">
                                                            <input
                                                                type="search"
                                                                placeholder="Search..."
                                                                value={searchValue}
                                                                onChange={e => this.setState({ searchValue: e.target.value })}
                                                            />
                                                            <i
                                                                class="fas fa-times cursor-pointer cls-close"
                                                                onClick={() => this.setState({ searchValue: "" })}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className="col-md-12 p-0 border-bottom pt-1">
                                                        <span className="dropdown-item d-flex justify-content-between">
                                                            <label className="container-check">
                                                                Select All ({selectedMasterFilters[item.paramKey]?.length})
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        chartMasterFilterList[item.key].length ===
                                                                        selectedMasterFilters[item.paramKey]?.length
                                                                    }
                                                                    onChange={e => {
                                                                        this.props.handleValueSelectAll(
                                                                            item.paramKey,
                                                                            chartMasterFilterList[item.key],
                                                                            e.target.checked
                                                                        );
                                                                    }}
                                                                />
                                                                <span className="checkmark"></span>
                                                               
                                                            </label>
                                                            <button
                                                                    className="clear-btn-selection"
                                                                    // class="fas fa-times cursor-pointer cls-close"
                                                                    onClick={() => this.props.handleValueSelectAll(item.paramKey, [], false)}
                                                                >
                                                                    Clear
                                                                </button>
                                                        </span>
                                                    </div>
                                                    <div className="col-md-12 p-0 slt-ara border-bottom">
                                                        {chartMasterFilterList[item.key]
                                                            ?.filter(fi => selectedMasterFilters[item.paramKey]?.includes(fi.id))
                                                            ?.map(data => (
                                                                <span className="dropdown-item" key={data.id}>
                                                                    <label className="container-check">
                                                                        {data.name}{" "}
                                                                        {item.key === "buildings" && data.description ? `(${data.description})` : ""}{" "}
                                                                        ({data.count})
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                selectedMasterFilters[item.paramKey]?.find(k => k === data.id)
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onChange={e =>
                                                                                this.props.handleValueSelect(item.paramKey, data.id, e.target.checked)
                                                                            }
                                                                        />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                </span>
                                                            ))}
                                                    </div>
                                                    <div className="col-md-12 p-0 slt-ara">
                                                        {chartMasterFilterList[item.key]
                                                            ?.filter(fi => !selectedMasterFilters[item.paramKey]?.includes(fi.id))
                                                            .filter(
                                                                item =>
                                                                    item.name
                                                                        ?.toString()
                                                                        ?.toLowerCase()
                                                                        ?.includes(searchValue?.toLocaleLowerCase()) ||
                                                                    item?.description
                                                                        ?.toString()
                                                                        ?.toLowerCase()
                                                                        ?.includes(searchValue?.toLocaleLowerCase())
                                                            )
                                                            ?.map(data => (
                                                                <span className="dropdown-item" key={data.id}>
                                                                    <label className="container-check">
                                                                        {data.name}{" "}
                                                                        {item.key === "buildings" && data.description ? `(${data.description})` : ""}{" "}
                                                                        ({data.count})
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                selectedMasterFilters[item.paramKey]?.find(k => k === data.id)
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onChange={e =>
                                                                                this.props.handleValueSelect(item.paramKey, data.id, e.target.checked)
                                                                            }
                                                                        />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                </span>
                                                            ))}
                                                    </div>
                                                    <div className="col-md-12 drp-btn">
                                                        <button type="button" className="btn btn-primary btnRgion" onClick={this.handleUpdateFilter}>
                                                            Ok
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btnClr ml-2"
                                                            onClick={async () => {
                                                                await this.props.handleValueSelectAll(item.paramKey, [], false);
                                                                this.setState({ searchValue: "", selectedDropDown: "" });
                                                                if (chartParams[item.paramKey]?.length) {
                                                                    this.handleUpdateFilter();
                                                                }
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="col-md-12 p-4"> {isLoading ? <Loader /> : "No Data Found"}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* {/ for recommendation assigned filter /} */}
                            <div className={`col p-1 ${chartParams && chartParams["recommendaton_assigned"] ? "bg-th-filtered" : ""}`}>
                                <div
                                    className={
                                        selectedDropDown === "recommendation_filter" ? "dropdown-container dropdown-open" : "dropdown-container"
                                    }
                                    onClick={() => this.handleClickDropdown("recommendation_filter", "recommendation_assigned")}
                                >
                                    <div className="dropdown-toggle click-dropdown">
                                        Recommendation
                                        <span className="close-reg">
                                            <i className="fas fa-chevron-down"></i>
                                        </span>
                                    </div>

                                    <div
                                        className={selectedDropDown === "recommendation_filter" ? "dropdown-menu  dropdown-active" : "dropdown-menu "}
                                    >
                                        {chartMasterFilterList["recommendation_filter"]?.length ? (
                                            <div
                                                className="drop-filtr"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <div className="col-md-12 p-0 slt-ara">
                                                    {chartMasterFilterList["recommendation_filter"]?.map(data => (
                                                        <span className="dropdown-item" key={data.id}>
                                                            <label className="container-check">
                                                                {data.name} ({data.count})
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedMasterFilters["recommendaton_assigned"] === data.id}
                                                                    onChange={e => {
                                                                        e.stopPropagation();
                                                                        this.props.handleAdvanceFilterSelect(
                                                                            "recommendaton_assigned",
                                                                            data.id,
                                                                            e.target.checked
                                                                        );
                                                                    }}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="col-md-12 drp-btn">
                                                    <button type="button" className="btn btn-primary btnRgion" onClick={this.handleUpdateFilter}>
                                                        Update Chart
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="col-md-12 p-4"> {isLoading ? <Loader /> : "No Data Found"}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="view p-1 mx-3 my-auto">
                                <div
                                    className="cursor-hand"
                                    data-tip={`Reset Filters`}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="left"
                                    data-background-color="#007bff"
                                    onClick={() => {
                                        this.setState({
                                            selectedDropDown: ""
                                        });
                                        this.props.resetMasterFilters();
                                    }}
                                >
                                    <img src="/img/filter-off.svg" alt="" className="fil-ico" width={18} />
                                    <ReactTooltip id="filter-icons" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { assetManagementReducer } = state;
    return {
        assetManagementReducer
    };
};
export default withRouter(connect(mapStateToProps, { ...actions })(TopFilter));
