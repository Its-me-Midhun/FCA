import React, { Component } from "react";
import moment from "moment";
import NumberFormat from "react-number-format";

class WildCardFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            selectedField: null,
            tempWildCardFilters: this.props.wildCardFilter?.filters,
            newWildCardFilters: this.props.wildCardFilter?.filters,
            filterTextValues: {},
            filterDate: {},

            selectedDateFilterKey: {},
            filterKeys: this.props.wildCardFilter?.filterKeys
        };
    }

    componentDidMount = async () => {
        document.addEventListener("keydown", this.handleKeyPress);
        const { keys, config } = this.props;
        if (!this.state.newWildCardFilters) {
            let tempWcFilter = {};
            if (keys && keys.length) {
                keys.map((keyItem, i) => {
                    tempWcFilter[config[keyItem].searchKey] = { key: null, filters: ["contains"] };
                });
            }
            await this.setState({
                newWildCardFilters: tempWcFilter,
                tempWildCardFilters: tempWcFilter
            });
        }
        let tempFilterTextValues = {};
        if (keys && keys.length) {
            keys.map((keyItem, i) => {
                tempFilterTextValues[config[keyItem].searchKey] = null;
            });
        }
        this.setState({
            filterTextValues: tempFilterTextValues
        });
        this.setState({
            isLoading: false
        });
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress);
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

    setFilterKeys = (filterKey, searchKey) => {
        let tempWcFilter = this.state.newWildCardFilters;
        let tempFilterKeys = this.state.filterKeys;
        if (!tempWcFilter[searchKey].filters.includes(filterKey)) {
            tempWcFilter[searchKey].filters = [filterKey];
        } else {
            tempWcFilter[searchKey].filters = tempWcFilter[searchKey].filters.filter(item => item !== filterKey);
        }
        if (filterKey === "notnull") {
            tempWcFilter[searchKey].key = "";
            tempFilterKeys[searchKey] = `${""}||${"notnull"}`;
            this.props.updateWildCardFilter(tempWcFilter, tempFilterKeys);
            return true;
        } else if (tempWcFilter[searchKey].key && tempWcFilter[searchKey].key.trim().length) {
            tempFilterKeys[searchKey] = `${tempWcFilter[searchKey].key}||${tempWcFilter[searchKey].filters[0]}`;
            this.props.updateWildCardFilter(tempWcFilter, tempFilterKeys);
            return true;
        }
        this.setState({
            newWildCardFilters: tempWcFilter,
            filterKeys: tempFilterKeys
        });
    };

    dateFinder = dayString => {
        let dateRange = { from: "", to: "" };
        switch (dayString) {
            case "yesterday":
                dateRange.from = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).format("YYYY-MM-DD");
                break;
            case "today":
                dateRange.from = moment(new Date()).format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(1, "days").format("YYYY-MM-DD");
                break;
            case "tomorrow":
                dateRange.from = moment(new Date()).add(1, "days").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(2, "days").format("YYYY-MM-DD");
                break;
            case "last_month":
                dateRange.from = moment(new Date()).subtract(1, "months").startOf("month").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).subtract(1, "months").endOf("month").format("YYYY-MM-DD");
                break;
            case "this_month":
                dateRange.from = moment(new Date()).startOf("month").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).endOf("month").format("YYYY-MM-DD");
                break;
            case "next_month":
                dateRange.from = moment(new Date()).add(1, "months").startOf("month").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(1, "months").endOf("month").format("YYYY-MM-DD");
                break;
            case "last_week":
                dateRange.from = moment(new Date()).subtract(1, "weeks").startOf("week").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).subtract(1, "weeks").endOf("week").format("YYYY-MM-DD");
                break;
            case "this_week":
                dateRange.from = moment(new Date()).startOf("week").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).endOf("week").format("YYYY-MM-DD");
                break;
            case "next_week":
                dateRange.from = moment(new Date()).add(1, "weeks").startOf("week").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(1, "weeks").endOf("week").format("YYYY-MM-DD");
                break;
            case "last_year":
                dateRange.from = moment(new Date()).subtract(1, "years").startOf("year").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).subtract(1, "years").endOf("year").format("YYYY-MM-DD");
                break;
            case "this_year":
                dateRange.from = moment(new Date()).startOf("year").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).endOf("year").format("YYYY-MM-DD");
                break;
            case "next_year":
                dateRange.from = moment(new Date()).add(1, "years").startOf("year").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(1, "years").endOf("year").format("YYYY-MM-DD");
                break;

            default:
                break;
        }
        return dateRange;
    };

    setFilterKeysForDate = async (filterKey, searchKey, keyItem) => {
        let tempFilterKey = "in_between";
        let tempWcFilter = this.state.newWildCardFilters;
        let prevFilterKeys = this.state.filterKeys;

        if (this.state.selectedDateFilterKey[keyItem] !== filterKey) {
            await this.setState(prevState => ({
                selectedDateFilterKey: {
                    ...prevState.selectedDateFilterKey,
                    [keyItem]: filterKey
                }
            }));
            if (filterKey !== "in_between") {
                let selctedDate = await this.dateFinder(filterKey);
                await this.setState(prevState => ({
                    filterDate: {
                        ...prevState.filterDate,

                        [keyItem]: selctedDate
                    }
                }));
            }

            if (filterKey !== "in_between") {
                tempWcFilter[searchKey].filters = [tempFilterKey];
                tempWcFilter[searchKey].key = {
                    from: this.state.filterDate[keyItem].from,
                    to: this.state.filterDate[keyItem].to
                };
                if (keyItem === "uploaded_at") {
                    prevFilterKeys.min_created_at = this.state.filterDate[keyItem].from;
                    prevFilterKeys.max_created_at = this.state.filterDate[keyItem].to;
                } else if (keyItem === "updated_at") {
                    prevFilterKeys.min_updated_at = this.state.filterDate[keyItem].from;
                    prevFilterKeys.max_updated_at = this.state.filterDate[keyItem].to;
                } else if (keyItem === "upload_date") {
                    prevFilterKeys.from_date = this.state.filterDate[keyItem].from;
                    prevFilterKeys.to_date = this.state.filterDate[keyItem].to;
                } else if (keyItem === "created_at") {
                    prevFilterKeys.from_date = this.state.filterDate.from;
                    prevFilterKeys.to_date = this.state.filterDate.to;
                }
            } else {
                tempWcFilter[searchKey].filters = [tempFilterKey];
                tempWcFilter[searchKey].key = {
                    from: this.state.filterDate.from,
                    to: this.state.filterDate.to
                };
                if (keyItem === "uploaded_at") {
                    prevFilterKeys.min_created_at = this.state.filterDate.from;
                    prevFilterKeys.max_created_at = this.state.filterDate.to;
                } else if (keyItem === "updated_at") {
                    prevFilterKeys.min_updated_at = this.state.filterDate.from;
                    prevFilterKeys.max_updated_at = this.state.filterDate.to;
                } else if (keyItem === "upload_date") {
                    prevFilterKeys.from_date = this.state.filterDate.from;
                    prevFilterKeys.to_date = this.state.filterDate.to;
                } else if (keyItem === "created_at") {
                    prevFilterKeys.from_date = this.state.filterDate.from;
                    prevFilterKeys.to_date = this.state.filterDate.to;
                }
            }
        } else {
            this.setState(prevState => ({
                selectedDateFilterKey: {
                    ...prevState.selectedDateFilterKey,
                    [keyItem]: null
                }
            }));
            if (filterKey !== "in_between") {
                await this.setState({
                    filterDate: {}
                });
            }
            tempWcFilter[searchKey].key = null;
        }

        this.props.updateWildCardFilter(tempWcFilter, prevFilterKeys);
        this.setState({
            newWildCardFilters: tempWcFilter,
            filterKeys: prevFilterKeys
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
            { value: "dcontains", label: "Doesn't Contain" },
            { value: "equals", label: "Equals" },
            { value: "dequal", label: "Doesn't Equal" },
            { value: "begins", label: "Begins With" },
            { value: "ends", label: "Ends With" },
            { value: "notnull", label: "Not Null" }
        ];
        const dateFilterKeys = [
            { value: "in_between", label: "In between" },
            { value: null, label: null },
            { value: "yesterday", label: "Yesterday" },
            { value: "last_month", label: "Last Month" },
            { value: "today", label: "Today" },
            { value: "this_month", label: "This Month" },
            { value: "last_week", label: "Last Week" },
            { value: "last_year", label: "Last Year" },
            { value: "this_week", label: "This Week" },
            { value: "this_year", label: "This Year" }
        ];

        if (config[keyItem] && config[keyItem].type && config[keyItem].type === "date") {
            return (
                <div className="dropdown-menu drop-filtr sub-drop">
                    <div className="slct-date-otr">
                        <div className="place-holder">
                            <div className="col-md-2 p-0 labl-txt">From</div>
                            <div className="col-md-10 pr-0">
                                <input
                                    value={(this.state.filterDate[keyItem] && this.state.filterDate[keyItem].from) || this.state.filterDate.from}
                                    type="date"
                                    onChange={e =>
                                        this.setState({
                                            filterDate: {
                                                ...this.state.filterDate,
                                                from: e.target.value
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
                                    value={(this.state.filterDate[keyItem] && this.state.filterDate[keyItem].to) || this.state.filterDate.to}
                                    type="date"
                                    onChange={e =>
                                        this.setState({
                                            filterDate: {
                                                ...this.state.filterDate,
                                                to: e.target.value
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
                                    onClick={() => this.setFilterKeys(item.value, config[keyItem].searchKey)}
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
        let filterPresent = false;
        if (isFilterValue.key) {
            filterPresent = true;
        }
        await this.setState({
            newWildCardFilters: {
                ...this.state.newWildCardFilters,
                [closeValue.searchKey]: {
                    filters: ["contains"],
                    key: ""
                }
            },
            tempWildCardFilters: {
                ...this.state.tempWildCardFilters,
                [closeValue.searchKey]: {
                    filters: ["contains"],
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
                },
                filterKeys: {
                    ...this.state.filterKeys,
                    [closeValue.searchKey]: `${""}||${this.state.newWildCardFilters[closeValue.searchKey].filters[0]}`
                }
            },
            () => {
                if (filterPresent) {
                    this.props.updateWildCardFilter(this.state.newWildCardFilters, this.state.filterKeys);
                }
            }
        );
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return null;
        const { keys, config } = this.props;

        return (
            <React.Fragment>
                <tr className="viewImg filter-clp" id="collapse-filter">
                    <td />
                    {keys.length
                        ? keys.map((keyItem, i) =>
                              config[keyItem].isVisible ? (
                                  <td key={i} className="filter-select">
                                      {config[keyItem] && config[keyItem].hasWildCardSearch ? (
                                          <div className="formInp ">
                                              {config[keyItem] && config[keyItem].type !== "date" ? (
                                                  <>
                                                      <i
                                                          className="fas fa-times cursor-pointer cls"
                                                          onClick={() => this.handleCloseClick(config[keyItem])}
                                                      ></i>
                                                      <i className="fas fa-filter cursor-pointer" onClick={() => this.showFilterDropDown(keyItem)} />

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
                                                                          filters: this.state.tempWildCardFilters[config[keyItem].searchKey].filters,
                                                                          key: e.target.value.trim().length ? e.target.value : null
                                                                      }
                                                                  },
                                                                  filterKeys: {
                                                                      ...this.state.filterKeys,
                                                                      [config[keyItem].searchKey]: `${
                                                                          e.target.value?.trim().length ? e.target.value : ""
                                                                      }||${
                                                                          this.state.tempWildCardFilters[config[keyItem].searchKey].filters[0] || ""
                                                                      }`
                                                                  }
                                                              })
                                                          }
                                                          onKeyPress={event => {
                                                              if (event.key === "Enter") {
                                                                  this.props.updateWildCardFilter(
                                                                      this.state.tempWildCardFilters,
                                                                      this.state.filterKeys
                                                                  );
                                                                  this.setState({
                                                                      newWildCardFilters: this.state.tempWildCardFilters,
                                                                      selectedField: null
                                                                  });
                                                              }
                                                          }}
                                                      />
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
                                              {config[keyItem].searchKey && this.renderFilters(keyItem)}
                                          </div>
                                      ) : null}
                                  </td>
                              ) : null
                          )
                        : null}
                    <td />
                </tr>
            </React.Fragment>
        );
    }
}

export default WildCardFilter;
