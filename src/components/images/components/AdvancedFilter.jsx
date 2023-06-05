import React, { Component } from "react";
import ReactDatePicker from "react-datepicker";
import { ADVANCED_FILTERS } from "../constants";
import moment from "moment";
import { dateTimeFinder } from "../../../config/utils";
export class AdvancedFilter extends Component {
    state = {
        selectedField: "",
        filterDate: {
            uploaded_date: { date: { from: null, to: null }, selectedDateFilter: null, includeTime: true },
            date_taken: { date: { from: null, to: null }, selectedDateFilter: null, includeTime: true }
        },
        tempFilter: this.props.filters
    };
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.filters !== this.props.filters) {
            this.setState({ tempFilter: this.props.filters });
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
            this.setState({
                selectedField: ""
            });
        }
    };

    showFilterDropDown = keyItem => {
        this.setState({
            selectedField: this.state.selectedField === keyItem.key ? null : keyItem.key
        });
    };

    resetDateFilter = key => {
        this.setState({
            filterDate: {
                ...this.state.filterDate,
                [key]: { date: { from: null, to: null }, selectedDateFilter: null, includeTime: false }
            }
        });
    };

    renderDateDropDown = item => {
        if (this.state.selectedField !== item.key) {
            return null;
        }
        const dateFilterKeys = [
            { value: "yesterday", label: "Yesterday" },
            { value: "last_month", label: "Last Month" },
            { value: "today", label: "Today" },
            { value: "this_month", label: "This Month" },
            { value: "last_week", label: "Last Week" },
            { value: "last_year", label: "Last Year" },
            { value: "this_week", label: "This Week" },
            { value: "this_year", label: "This Year" }
        ];
        const { filterDate } = this.state;
        let momentFormat = filterDate[item.key].includeTime ? "MM/dd/yyyy h:mm aa" : "MM/dd/yyyy";
        let placeholderText = filterDate[item.key].includeTime ? "MM/DD/YYYY HH:MM XM" : "MM/DD/YYYY";
        return (
            <div className="dropdown-menu drop-filtr sub-drop" style={{ overflow: "visible" }}>
                <div className="slct-date-otr">
                    <div className="place-holder flex-wrap">
                        <div className="col-md-12 p-0 labl-txt">From</div>
                        <div className="col-md-12 p-0">
                            <ReactDatePicker
                                autoComplete={"nope"}
                                className="form-control custom-wid mb-0"
                                placeholderText={placeholderText}
                                showTimeInput={filterDate[item.key]?.includeTime}
                                selected={filterDate[item.key]?.date?.from ? new Date(filterDate[item.key]?.date?.from) : null}
                                dateFormat={momentFormat}
                                onChange={async date => {
                                    this.setState({
                                        filterDate: {
                                            ...filterDate,
                                            [item.key]: {
                                                ...filterDate[item.key],
                                                date: { ...filterDate[item.key].date, from: date },
                                                selectedDateFilter:
                                                    moment(filterDate[item.key]?.date?.from).format("YYYY-MM-DD") ===
                                                    moment(date).format("YYYY-MM-DD")
                                                        ? filterDate[item.key]?.selectedDateFilter
                                                        : null
                                            }
                                        }
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="place-holder flex-wrap">
                        <div className="col-md-12 p-0 labl-txt">To</div>
                        <div className="col-md-12 p-0">
                            <ReactDatePicker
                                autoComplete={"nope"}
                                className="form-control custom-wid"
                                placeholderText={placeholderText}
                                showTimeInput={filterDate[item.key].includeTime}
                                selected={filterDate[item.key]?.date?.to ? new Date(filterDate[item.key]?.date?.to) : null}
                                dateFormat={momentFormat}
                                onChange={async date => {
                                    this.setState({
                                        filterDate: {
                                            ...filterDate,
                                            [item.key]: {
                                                ...filterDate[item.key],
                                                date: { ...filterDate[item.key].date, to: date },
                                                selectedDateFilter:
                                                    moment(filterDate[item.key]?.date?.to).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
                                                        ? filterDate[item.key]?.selectedDateFilter
                                                        : null
                                            }
                                        }
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="check-box-otr-dte d-flex col-md-12">
                        <div className="col-md-12 p-0">
                            <span className="dropdown-item">
                                <label class="container-check">
                                    Include Time
                                    <input
                                        type="checkbox"
                                        checked={filterDate[item.key].includeTime}
                                        onChange={e => {
                                            const { checked } = e.target;
                                            this.setState({
                                                filterDate: {
                                                    ...filterDate,
                                                    [item.key]: {
                                                        ...filterDate[item.key],
                                                        includeTime: checked,
                                                        date: {
                                                            from: filterDate[item.key]?.date?.from
                                                                ? moment(filterDate[item.key]?.date?.from).format(
                                                                      checked ? "YYYY-MM-DD hh:mm A z" : "YYYY-MM-DD"
                                                                  )
                                                                : null,
                                                            to: filterDate[item.key]?.date?.to
                                                                ? moment(filterDate[item.key]?.date?.to).format(
                                                                      checked ? "YYYY-MM-DD hh:mm A z" : "YYYY-MM-DD"
                                                                  )
                                                                : null
                                                        }
                                                    }
                                                }
                                            });
                                        }}
                                    />
                                    <span class="checkmark"></span>
                                </label>
                            </span>
                        </div>
                        <div className="col-md-12 dropdown-line"></div>
                        {dateFilterKeys.map((elem, i) => (
                            <>
                                <div key={elem.value} className="col-md-6 p-0">
                                    <span className="dropdown-item">
                                        <label className="container-check">
                                            {elem.label}
                                            <>
                                                <input
                                                    type="checkbox"
                                                    checked={filterDate[item.key]?.selectedDateFilter === elem.value}
                                                    onChange={() => {
                                                        this.setState({
                                                            filterDate: {
                                                                ...filterDate,
                                                                [item.key]: {
                                                                    ...filterDate[item.key],
                                                                    date:
                                                                        filterDate[item.key]?.selectedDateFilter === elem.value
                                                                            ? { from: null, to: null }
                                                                            : dateTimeFinder(elem.value, filterDate[item.key].includeTime),
                                                                    selectedDateFilter:
                                                                        filterDate[item.key]?.selectedDateFilter === elem.value ? null : elem.value
                                                                }
                                                            }
                                                        });
                                                    }}
                                                />
                                                <span className="checkmark"></span>
                                            </>
                                        </label>
                                    </span>
                                </div>
                                {i === 3 ? <div className="col-md-12 dropdown-line"></div> : null}
                            </>
                        ))}
                        <button className="btn btn-primary w-100 mt-3" onClick={() => this.handleDateSelect(item)}>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    renderStringDropDown = item => {
        if (this.state.selectedField !== item.key) {
            return null;
        }
        const { tempFilter } = this.state;
        const filteKeys = [
            { value: "contains", label: "Contains" },
            { value: "exclude", label: "Doesn't Contain" },
            { value: "equals", label: "Equals" },
            { value: "unequals", label: "Doesn't Equal" },
            { value: "begins_with", label: "Begins With" },
            { value: "ends_with", label: "Ends With" },
            { value: "not_null", label: "Not Null" },
            { value: "null", label: "Null" },
            { value: "like", label: "Like (%,_)" }
        ];
        return (
            <div className="dropdown-menu drop-filtr" aria-labelledby="dropdownMenuButton">
                {filteKeys.map((filter, i) => (
                    <span key={filter.value} className="dropdown-item">
                        <label className="container-check">
                            {filter.label}
                            <input
                                type="checkbox"
                                checked={tempFilter[item.paramKey]?.filters?.includes(filter.value)}
                                onClick={e => this.setFilterKeys(filter.value, item.paramKey, item.type, e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </span>
                ))}
            </div>
        );
    };

    setFilterKeys = (filterKey, searchKey, type, isChecked) => {
        let tempWcFilter = this.state.tempFilter;
        tempWcFilter[searchKey] = {
            key: tempWcFilter[searchKey]?.key,
            filters: tempWcFilter[searchKey]?.filters?.includes(filterKey)
                ? tempWcFilter[searchKey]?.filters?.filter(item => item !== filterKey)
                : [filterKey]
        };
        this.setState({
            tempFilter: tempWcFilter
        });
        if (filterKey === "not_null" || filterKey === "null") {
            tempWcFilter[searchKey].key = isChecked ? "" : null;
            tempWcFilter[searchKey].filters = isChecked ? tempWcFilter[searchKey]?.filters : [type === "number" ? "equals" : "contains"];
            this.setState({
                tempFilter: tempWcFilter,
                selectedField: null
            });
            this.props.updateAdvancedFilters(tempWcFilter);
        } else if (tempWcFilter[searchKey].key && tempWcFilter[searchKey].key.trim().length && isChecked) {
            this.setState({ selectedField: null });
            this.props.updateAdvancedFilters(tempWcFilter);
        }
    };

    handleDateSelect = async item => {
        const { filterDate } = this.state;
        let formattedDate = filterDate[item.key]?.date;
        let data = { key: formattedDate, filters: ["in_between"] };
        await this.handleChangeAdvancedFilters(data, item.paramKey);
        this.props.updateAdvancedFilters(this.state.tempFilter);
        this.setState({ selectedField: "" });
    };

    handleChangeAdvancedFilters = async (filterData, key) => {
        const { tempFilter } = this.state;
        if (filterData) {
            await this.setState({
                tempFilter: {
                    ...tempFilter,
                    [key]: filterData
                }
            });
        } else {
            delete tempFilter[key];
            this.setState({ tempFilter });
        }
    };
    render() {
        const { filters, imageParams } = this.props;
        const { selectedField, tempFilter } = this.state;
        return (
            <div className="collapse show filter-box-otr" id="collapseExample" ref={this.setWrapperRef}>
                <div className="filter-box">
                    <div className="form-seaction no-wrap">
                        {ADVANCED_FILTERS.map(item => (
                            <div className="form-item" key={item.key}>
                                <label>{item.label}</label>
                                {item.type === "date" ? (
                                    <div class={`drop-date-btn ${filters[item.paramKey]?.key ? "bg-th-filtered" : ""}`}>
                                        <div class="caln-txt" onClick={() => this.showFilterDropDown(item)}>
                                            {tempFilter[item.paramKey]?.key?.from && tempFilter[item.paramKey]?.key?.to
                                                ? moment(tempFilter[item.paramKey]?.key?.from).format("MM/DD/YY") +
                                                  " - " +
                                                  moment(tempFilter[item.paramKey]?.key?.to).format("MM/DD/YY")
                                                : tempFilter[item.paramKey]?.key
                                                ? moment(tempFilter[item.paramKey]?.key).format("MM/DD/YY")
                                                : "Select Date"}
                                        </div>
                                        <i
                                            class="fas fa-times cursor-pointer cls-close"
                                            onClick={async () => {
                                                this.setState({ selectedField: selectedField === item.key ? null : selectedField });
                                                this.resetDateFilter(item.key);
                                                if (tempFilter[item.paramKey]?.key) {
                                                    await this.handleChangeAdvancedFilters(null, item.paramKey);
                                                    this.props.updateAdvancedFilters(this.state.tempFilter);
                                                }
                                            }}
                                        ></i>
                                        <i class="far fa-calendar cursor-pointer" onClick={() => this.showFilterDropDown(item)}></i>
                                    </div>
                                ) : item.type === "select" ? (
                                    <div className={`selectOtr `}>
                                        <select
                                            autoComplete={"nope"}
                                            className={`form-control ${filters[item.paramKey]?.key ? "bg-th-filtered" : ""}`}
                                            value={tempFilter[item.paramKey]?.key || ""}
                                            onChange={async e => {
                                                await this.handleChangeAdvancedFilters(
                                                    { key: e.target.value || null, filters: [item.filterType] },
                                                    item.paramKey
                                                );
                                                this.props.updateAdvancedFilters(this.state.tempFilter);
                                            }}
                                        >
                                            <option value="">All</option>
                                            {item.options.map(opt => (
                                                <option value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            value={tempFilter[item.paramKey]?.key || ""}
                                            onChange={e =>
                                                this.handleChangeAdvancedFilters(
                                                    { key: e.target.value || null, filters: tempFilter[item.paramKey]?.filters || ["contains"] },
                                                    item.paramKey
                                                )
                                            }
                                            onKeyPress={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    this.setState({ selectedField: "" });
                                                    this.props.updateAdvancedFilters(this.state.tempFilter);
                                                }
                                            }}
                                            type="text"
                                            className={`form-control ${
                                                filters[item.paramKey]?.key ||
                                                tempFilter[item.paramKey]?.filters[0] === "null" ||
                                                tempFilter[item.paramKey]?.filters[0] === "not_null"
                                                    ? "bg-th-filtered"
                                                    : ""
                                            }`}
                                            placeholder={item.label}
                                        />
                                        <i
                                            className="fas fa-times cursor-pointer cls"
                                            onClick={async () => {
                                                if (
                                                    tempFilter[item.paramKey]?.key ||
                                                    tempFilter[item.paramKey]?.filters[0] === "null" ||
                                                    tempFilter[item.paramKey]?.filters[0] === "not_null"
                                                ) {
                                                    await this.handleChangeAdvancedFilters(null, item.paramKey);
                                                    this.setState({ selectedField: "" });
                                                    this.props.updateAdvancedFilters(this.state.tempFilter);
                                                }
                                            }}
                                        ></i>
                                        <i className="fas fa-filter cursor-pointer filter-icn" onClick={() => this.showFilterDropDown(item)} />
                                    </>
                                )}
                                {selectedField === item.key && item.type === "date" ? this.renderDateDropDown(item) : this.renderStringDropDown(item)}
                            </div>
                        ))}
                        <div className="form-item w-170">
                            <label>Recommendations</label>
                            <div className={`selectOtr `}>
                                <select
                                    autoComplete={"nope"}
                                    className={`form-control ${imageParams.recommendation_image_assigned_true ? "bg-th-filtered" : ""}`}
                                    value={imageParams.recommendation_image_assigned_true}
                                    onChange={async e => {
                                        this.props.updateRecomAssignedFilter(e.target.value);
                                    }}
                                >
                                    <option value="">All</option>
                                    <option value="true">Assigned</option>
                                    <option value="false">Not Assigned</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-item  img-modfy ">
                            <label>Image Modified</label>
                            <div className={`selectOtr `}>
                                <select
                                    autoComplete={"nope"}
                                    className={`form-control ${imageParams.image_modify_filter ? "bg-th-filtered" : ""}`}
                                    value={imageParams.image_modify_filter}
                                    onChange={async e => {
                                        this.props.updateImageModifyFilter(e.target.value);
                                    }}
                                >
                                    <option value="">All</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-item  img-modfy ">
                            <label>Is Asset Image</label>
                            <div className={`selectOtr `}>
                                <select
                                    autoComplete={"nope"}
                                    className={`form-control ${imageParams.is_asset_image ? "bg-th-filtered" : ""}`}
                                    value={imageParams.is_asset_image}
                                    onChange={async e => {
                                        this.props.updateAssetImage(e.target.value);
                                    }}
                                >
                                     <option value="">All</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdvancedFilter;
