import React, { Component } from "react";
import moment from "moment";
import NumberFormat from "react-number-format";
import { dateTimeFinder } from "../../../config/utils";

class WildCardFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            selectedField: null,
            tempWildCardFilters: this.props.wildCardFilter,
            newWildCardFilters: this.props.wildCardFilter,
            filterTextValues: {},
            filterDate: {},

            selectedDateFilterKey: {}
        };
    }

    componentDidMount = async () => {
        document.addEventListener("keydown", this.handleKeyPress);
        document.addEventListener("mousedown", this.handleClickOutside);

        const { keys, config } = this.props;
        if (!this.state.newWildCardFilters) {
            let tempWcFilter = {};
            if (keys && keys.length) {
                keys.map((keyItem, i) => {
                    tempWcFilter[config[keyItem].searchKey] = { key: null, filters: [config[keyItem]?.type === "number" ? "equals" : "contains"] };
                });
            }
            await this.setState({
                newWildCardFilters: tempWcFilter,
                tempWildCardFilters: tempWcFilter
            });
        }
        let tempFilterTextValues = {};
        let filterDate = {};
        let selectedDateFilterKey = {};
        if (keys && keys.length) {
            keys.map((keyItem, i) => {
                if (config[keyItem]?.type === "date") {
                    filterDate[keyItem] = this.state.tempWildCardFilters[config[keyItem]?.searchKey]?.key || {};
                    selectedDateFilterKey[keyItem] = this.state.tempWildCardFilters[config[keyItem]?.searchKey]?.filters[0] || "";
                }
                tempFilterTextValues[config[keyItem].searchKey] = null;
            });
        }
        this.setState({
            filterTextValues: tempFilterTextValues,
            filterDate,
            selectedDateFilterKey
        });
        this.setState({
            isLoading: false
        });
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress);
        document.removeEventListener("mousedown", this.handleClickOutside);
    };

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
    handleKeyPress = e => {
        if (e.keyCode === 27) {
            e.preventDefault();
            this.setState({ selectedField: null });
        }
    };

    showFilterDropDown = keyItem => {
        this.setState({
            selectedField: this.state.selectedField === keyItem ? null : keyItem
        });
    };

    setFilterKeys = (filterKey, searchKey, type, isChecked) => {
        let tempWcFilter = this.state.tempWildCardFilters;
        if (!tempWcFilter[searchKey].filters.includes(filterKey)) {
            tempWcFilter[searchKey].filters = [filterKey];
            this.setState({
                newWildCardFilters: tempWcFilter,
                tempWildCardFilters: tempWcFilter
            });
        } else {
            tempWcFilter[searchKey].filters = tempWcFilter[searchKey].filters.filter(item => item !== filterKey);
            this.setState({
                newWildCardFilters: tempWcFilter,
                tempWildCardFilters: tempWcFilter
            });
        }
        if (filterKey === "not_null" || filterKey === "null") {
            tempWcFilter[searchKey].key = isChecked ? "" : null;
            tempWcFilter[searchKey].filters = isChecked ? tempWcFilter[searchKey].filters : [type === "number" ? "equals" : "contains"];
            this.setState({
                newWildCardFilters: tempWcFilter,
                tempWildCardFilters: tempWcFilter,
                selectedField: null
            });
            this.props.updateWildCardFilter(tempWcFilter);
        } else if (tempWcFilter[searchKey].key && tempWcFilter[searchKey].key.trim().length && isChecked) {
            this.setState({ selectedField: null });
            this.props.updateWildCardFilter(tempWcFilter);
        }
    };

    setFilterKeysForDate = async (filterKey, searchKey, keyItem) => {
        let tempFilterKey = "in_between";
        let tempWcFilter = this.state.newWildCardFilters;

        if (this.state.selectedDateFilterKey[keyItem] !== filterKey) {
            await this.setState(prevState => ({
                selectedDateFilterKey: {
                    ...prevState.selectedDateFilterKey,
                    [keyItem]: filterKey
                }
            }));
            if (filterKey !== "in_between") {
                let selctedDate = dateTimeFinder(filterKey);
                await this.setState(prevState => ({
                    filterDate: {
                        ...prevState.filterDate,

                        [keyItem]: selctedDate
                    }
                }));
            }

            tempWcFilter[searchKey].filters = [tempFilterKey];
            tempWcFilter[searchKey].key = {
                from: this.state.filterDate[keyItem].from,
                to: this.state.filterDate[keyItem].to
            };
        } else {
            this.setState(prevState => ({
                selectedDateFilterKey: {
                    ...prevState.selectedDateFilterKey,
                    [keyItem]: null
                }
            }));
            if (filterKey !== "in_between") {
                await this.setState({
                    filterDate: {
                        ...this.state.filterDate,
                        [keyItem]: {}
                    }
                });
            }
            tempWcFilter[searchKey].key = null;
        }
        this.props.updateWildCardFilter(tempWcFilter);
        this.setState({
            newWildCardFilters: tempWcFilter
        });
    };

    renderFilters = keyItem => {
        if (this.state.selectedField !== keyItem) {
            return null;
        }
        const { newWildCardFilters } = this.state;
        const { config } = this.props;
        const defaultFilteKeys = [
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
        const dateFilterKeys = [
            { value: "in_between", label: "In between" },
            { value: null, label: null },
            { value: "yesterday", label: "Yesterday" },
            { value: "last_month", label: "Last Month" },
            { value: "today", label: "Today" },
            { value: "this_month", label: "This Month" },
            { value: "tomorrow", label: "Tomorrow" },
            { value: "next_month", label: "Next Month" },
            { value: "last_week", label: "Last Week" },
            { value: "last_year", label: "Last Year" },
            { value: "this_week", label: "This Week" },
            { value: "this_year", label: "This Year" },
            { value: "next_week", label: "Next Week" },
            { value: "next_year", label: "Next Year" }
        ];
        const numberFilterKeys = [
            { value: "equals", label: "Equals" },
            { value: "unequals", label: "Doesn't Equal" },
            { value: "less_than", label: "Less Than" },
            { value: "less_than_or_equal", label: "Less Than or Equal to" },
            { value: "greater_than", label: "Greater Than" },
            { value: "greater_than_or_equal", label: "Greater Than or Equal to" },
            { value: "not_null", label: "Not Null" },
            { value: "null", label: "Null" },
            { value: "like", label: "Like (%,_)" }
        ];

        if (config[keyItem] && config[keyItem].type && config[keyItem].type === "date") {
            return (
                <div className="dropdown-menu drop-filtr sub-drop">
                    <div className="slct-date-otr">
                        <div className="place-holder">
                            <div className="col-md-2 p-0 labl-txt">From</div>
                            <div className="col-md-10 pr-0">
                                <input
                                    value={
                                        this.state.filterDate[keyItem] && this.state.filterDate[keyItem]?.from
                                            ? moment(this.state.filterDate[keyItem]?.from).format("yyyy-MM-DD")
                                            : null
                                    }
                                    type="date"
                                    onChange={e =>
                                        this.setState({
                                            filterDate: {
                                                ...this.state.filterDate,
                                                [keyItem]: { ...this.state.filterDate[keyItem], from: e.target.value }
                                            }
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="place-holder">
                            <div className="col-md-2 p-0 labl-txt">To</div>
                            <div className="col-md-10 pr-0">
                                <input
                                    value={
                                        this.state.filterDate[keyItem] && this.state.filterDate[keyItem]?.to
                                            ? moment(this.state.filterDate[keyItem]?.to).format("yyyy-MM-DD")
                                            : null
                                    }
                                    type="date"
                                    onChange={e =>
                                        this.setState({
                                            filterDate: {
                                                ...this.state.filterDate,
                                                [keyItem]: { ...this.state.filterDate[keyItem], to: e.target.value }
                                            }
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="check-box-otr-dte d-flex col-md-12">
                        {dateFilterKeys.map((item, i) => (
                            <>
                                <div key={i} className="col-md-6 p-0">
                                    <span className="dropdown-item">
                                        <label className="container-check">
                                            {item.label}

                                            {item.value ? (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            this.state.selectedDateFilterKey[keyItem] === item.value &&
                                                            this.state.selectedDateFilterKey.hasOwnProperty(keyItem)
                                                        }
                                                        onClick={() => this.setFilterKeysForDate(item.value, config[keyItem].searchKey, keyItem)}
                                                    />
                                                    <span className="checkmark"></span>
                                                </>
                                            ) : null}
                                        </label>
                                    </span>
                                </div>
                                {i % 6 === 1 ? <div className="col-md-12 dropdown-line"></div> : null}
                            </>
                        ))}
                    </div>
                </div>
            );
        } else if (config[keyItem] && config[keyItem].type && config[keyItem].type === "number") {
            return (
                <div className="dropdown-menu drop-filtr" aria-labelledby="dropdownMenuButton">
                    {numberFilterKeys.map((item, i) => (
                        <span key={i} className="dropdown-item">
                            <label className="container-check">
                                {item.label}
                                <input
                                    type="checkbox"
                                    checked={newWildCardFilters[config[keyItem].searchKey].filters.includes(item.value)}
                                    onClick={e => this.setFilterKeys(item.value, config[keyItem].searchKey, config[keyItem].type, e.target.checked)}
                                />
                                <span className="checkmark"></span>
                            </label>
                        </span>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="dropdown-menu drop-filtr" aria-labelledby="dropdownMenuButton">
                    {defaultFilteKeys.map((item, i) => (
                        <span key={i} className="dropdown-item">
                            <label className="container-check">
                                {item.label}
                                <input
                                    type="checkbox"
                                    checked={newWildCardFilters[config[keyItem].searchKey].filters.includes(item.value)}
                                    onClick={e => this.setFilterKeys(item.value, config[keyItem].searchKey, config[keyItem].type, e.target.checked)}
                                />
                                <span className="checkmark"></span>
                            </label>
                        </span>
                    ))}
                </div>
            );
        }
    };

    handleCloseClick = async closeValue => {
        let isFilterValue = this.state.newWildCardFilters[closeValue.searchKey];
        let type = closeValue.type;
        let filterPresent = false;
        if (isFilterValue.key || isFilterValue.filters?.includes("null") || isFilterValue.filters?.includes("not_null")) {
            filterPresent = true;
        }
        await this.setState({
            newWildCardFilters: {
                ...this.state.newWildCardFilters,
                [closeValue.searchKey]: {
                    filters: [type === "number" ? "equals" : "contains"],
                    key: ""
                }
            },
            tempWildCardFilters: {
                ...this.state.tempWildCardFilters,
                [closeValue.searchKey]: {
                    filters: [type === "number" ? "equals" : "contains"],
                    key: ""
                }
            }
        });

        this.setState(
            {
                newWildCardFilters: {
                    ...this.state.newWildCardFilters,
                    [closeValue.searchKey]: {
                        filters: this.state.newWildCardFilters[closeValue.searchKey].filters,
                        key: null
                    }
                },
                tempWildCardFilters: {
                    ...this.state.tempWildCardFilters,
                    [closeValue.searchKey]: {
                        filters: this.state.tempWildCardFilters[closeValue.searchKey].filters,
                        key: null
                    }
                }
            },
            () => {
                if (filterPresent) {
                    this.props.updateWildCardFilter(this.state.newWildCardFilters);
                }
            }
        );
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return null;
        const { keys, config, hasWildCardOptions = true, hasActionColumn = true, isAsset } = this.props;

        return (
            <React.Fragment>
                <tr
                    className={`viewImg filter-clp ${isAsset ? "asset-filter" : ""} ${hasWildCardOptions ? "" : " has-no-wc-options"}`}
                    id="collapse-filter"
                    ref={this.setWrapperRef}
                >
                    <td />
                    {keys.length
                        ? keys.map((keyItem, i) =>
                              config[keyItem].isVisible ? (
                                  <td
                                      key={i}
                                      className={`filter-select ${config[keyItem].pinned ? "pinned" : ""}`}
                                      style={{ ...config[keyItem]?.style }}
                                  >
                                      {config[keyItem] && config[keyItem].hasWildCardSearch ? (
                                          <div className="formInp ">
                                              {config[keyItem] && config[keyItem].type !== "date" ? (
                                                  <>
                                                      <i
                                                          className="fas fa-times cursor-pointer cls"
                                                          onClick={() => this.handleCloseClick(config[keyItem])}
                                                      ></i>
                                                      {hasWildCardOptions ? (
                                                          <i
                                                              className="fas fa-filter cursor-pointer"
                                                              onClick={() => this.showFilterDropDown(keyItem)}
                                                          />
                                                      ) : null}

                                                      {config[keyItem].type === "number" ? (
                                                          <NumberFormat
                                                              value={
                                                                  this.state.tempWildCardFilters[config[keyItem].searchKey] &&
                                                                  this.state.tempWildCardFilters[config[keyItem].searchKey].key
                                                              }
                                                              placeholder={config[keyItem].label}
                                                              thousandSeparator={config[keyItem]?.isYear ? false : true}
                                                              className={"form-control"}
                                                              onValueChange={values => {
                                                                  const { value } = values;
                                                                  this.setState({
                                                                      tempWildCardFilters: {
                                                                          ...this.state.tempWildCardFilters,
                                                                          [config[keyItem].searchKey]: {
                                                                              filters:
                                                                                  this.state.tempWildCardFilters[config[keyItem].searchKey].filters,
                                                                              key: value.trim().length ? value : null
                                                                          }
                                                                      }
                                                                  });
                                                              }}
                                                              onKeyPress={event => {
                                                                  if (event.key === "Enter") {
                                                                      this.setState({
                                                                          newWildCardFilters: this.state.tempWildCardFilters,
                                                                          selectedField: null
                                                                      });
                                                                      this.props.updateWildCardFilter(this.state.tempWildCardFilters);
                                                                  }
                                                              }}
                                                          />
                                                      ) : (
                                                          <input
                                                              autoComplete="nope"
                                                              type="text"
                                                              className="form-control"
                                                              placeholder={config[keyItem].label}
                                                              value={
                                                                  (this.state.tempWildCardFilters[config[keyItem].searchKey] &&
                                                                      this.state.tempWildCardFilters[config[keyItem].searchKey].key) ||
                                                                  ""
                                                              }
                                                              onChange={e =>
                                                                  this.setState({
                                                                      tempWildCardFilters: {
                                                                          ...this.state.tempWildCardFilters,
                                                                          [config[keyItem].searchKey]: {
                                                                              filters:
                                                                                  this.state.tempWildCardFilters[config[keyItem].searchKey].filters,
                                                                              key: e.target.value.trim().length ? e.target.value : null
                                                                          }
                                                                      }
                                                                  })
                                                              }
                                                              onKeyPress={event => {
                                                                  if (event.key === "Enter") {
                                                                      this.props.updateWildCardFilter(this.state.tempWildCardFilters);
                                                                      this.setState({
                                                                          newWildCardFilters: this.state.tempWildCardFilters,
                                                                          selectedField: null
                                                                      });
                                                                  }
                                                              }}
                                                          />
                                                      )}
                                                  </>
                                              ) : (
                                                  <>
                                                      <i
                                                          className="far fa-calendar cursor-pointer"
                                                          onClick={() => this.showFilterDropDown(keyItem)}
                                                      ></i>
                                                      <div className="caln-div cursor-pointer" onClick={() => this.showFilterDropDown(keyItem)}>
                                                          <div className="caln-txt">Select Date</div>
                                                      </div>
                                                  </>
                                              )}
                                              {/* {hasWildCardOptions ?  : null} */}
                                              {config[keyItem].searchKey && this.renderFilters(keyItem)}
                                          </div>
                                      ) : null}
                                  </td>
                              ) : null
                          )
                        : null}
                    {hasActionColumn ? <td /> : null}
                </tr>
            </React.Fragment>
        );
    }
}

export default WildCardFilter;
