import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";
import Highlighter from "react-highlight-words";
import qs from "query-string";

class EditHistory extends Component {
    state = {
        logs: [],
        searchValue: "",
        sortKey: "versions.created_at"
    };

    componentDidMount = async () => {
        await this.props.getAllPropertyLogs();
    };
    searchHandler = async e => {
        e.preventDefault();
        this.props.handleGlobalSearchHistory(e.target.value);
    };
    setSortOrderParams = async (event, searchKey, val) => {
        await this.props.updateLogSortFilters(searchKey, val);
    };
    thousands_separators = num => {
        let numbe = num.toString();
        let number = numbe.split(".");
        number[0] = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number.join(".");
    };
    render() {
        const {
            logData,
            historyPaginationParams,
            handlePageClickHistory,
            handlePerPageChangeHistory,
            handleDeleteLog,
            handleRestoreLog,
            isProjectSettings = false,
            historyParams,
            hasEdit,
            hasInfoPage,
            hasLogDelete,
            hasLogRestore,
            cancelInfoPage,
            selectedProperty
        } = this.props;
        const { sortKey } = this.state;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);

        const propertyFields = ["header_style1", "header_style2", "para_style", "caption_style", "caption_style1", "table_style"];
        return (
            <React.Fragment>
                <div className="tab-active">
                    {!isProjectSettings ? (
                        <div className="otr-edit-delte col-md-12 text-right">
                            {hasInfoPage && (
                                <span
                                    onClick={() => {
                                        this.props.changeToHistory();
                                    }}
                                    className="edit-icn-bx"
                                >
                                    <i className="fas fa-info-circle"></i> View Details
                                </span>
                            )}
                            <span
                                onClick={() => {
                                    cancelInfoPage();
                                }}
                                className="edit-icn-bx"
                            >
                                <i className="fas fa-window-close"></i> Close
                            </span>

                            {hasEdit && (
                                <span
                                    onClick={() => {
                                        this.props.showEditPage(selectedProperty);
                                    }}
                                    className="edit-icn-bx"
                                >
                                    <i className="fas fa-pencil-alt"></i> Edit
                                </span>
                            )}
                        </div>
                    ) : null}
                    <div className="basic-dtl-otr">
                        <div className="dtl-sec col-md-12 log">
                            <div className="table-top-menu">
                                <div className="lft">
                                    <h2>Log</h2>
                                </div>
                                <div className="rgt">
                                    <div className="search" id="search-global">
                                        <form id="serach-sec">
                                            <input
                                                type="search"
                                                placeholder="Search"
                                                onKeyPress={event => {
                                                    if (event.key === "Enter") {
                                                        this.searchHandler(event);
                                                    }
                                                }}
                                                onChange={event => {
                                                    this.setState({ searchValue: event.target.value });
                                                    if (!event.target.value.trim().length) {
                                                        this.searchHandler(event);
                                                    }
                                                }}
                                                value={this.state.searchValue}
                                            />
                                            <i
                                                className="fas fa-times"
                                                onClick={e => {
                                                    this.setState({ searchValue: "" });
                                                    this.props.handleGlobalSearchHistory("");
                                                }}
                                            />
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-dtl region-mng">
                                <div className="tab-active buildng-tb">
                                    <div className="table-section table-scroll build-table">
                                        <table className="table table-common">
                                            <thead>
                                                <tr>
                                                    <th className="img-sq-box">
                                                        <img src="/img/bell.svg" />
                                                    </th>
                                                    <th className="build-code">All Logs</th>
                                                    <th
                                                        className="build-name cursor-pointer"
                                                        onClick={event => this.setSortOrderParams(event, sortKey)}
                                                    >
                                                        Date and Time
                                                        {historyParams && historyParams.order && historyParams.order[sortKey] ? (
                                                            <>
                                                                {historyParams.order[sortKey] === "asc" ? (
                                                                    <i
                                                                        className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}
                                                                        onClick={event => this.setSortOrderParams(event, sortKey)}
                                                                    ></i>
                                                                ) : (
                                                                    <i
                                                                        className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}
                                                                        onClick={event => this.setSortOrderParams(event, sortKey)}
                                                                    ></i>
                                                                )}
                                                            </>
                                                        ) : null}
                                                    </th>
                                                    <th className="type-dtl"> Action </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {logData && logData.data && logData.data.length ? (
                                                    <>
                                                        {logData.data.map((item, i) => (
                                                            <tr key={i}>
                                                                <td className="text-center">
                                                                    <img src="/img/bell.svg" />
                                                                </td>
                                                                <td>
                                                                    <ul>
                                                                        {item.associated_changes && item.associated_changes.length
                                                                            ? item.associated_changes.map(i => {
                                                                                  return Object.entries(i.changeset).map((dat, index) => {
                                                                                      return (
                                                                                          <li key={index}>
                                                                                              <b>
                                                                                                  <Highlighter
                                                                                                      searchWords={[
                                                                                                          historyParams && historyParams.search
                                                                                                              ? historyParams.search
                                                                                                              : ""
                                                                                                      ]}
                                                                                                      textToHighlight={item.user}
                                                                                                  />
                                                                                              </b>{" "}
                                                                                              {item.event === "restore" ? "restored" : "changed"} the
                                                                                              field{" "}
                                                                                              <b>
                                                                                                  <Highlighter
                                                                                                      searchWords={[
                                                                                                          historyParams && historyParams.search
                                                                                                              ? historyParams.search
                                                                                                              : ""
                                                                                                      ]}
                                                                                                      textToHighlight={dat[0].replace("_id", "")}
                                                                                                  />
                                                                                              </b>{" "}
                                                                                              from{" "}
                                                                                              <b>
                                                                                                  <Highlighter
                                                                                                      searchWords={[
                                                                                                          historyParams && historyParams.search
                                                                                                              ? historyParams.search
                                                                                                              : ""
                                                                                                      ]}
                                                                                                      textToHighlight={
                                                                                                          (dat[1][0] && dat[1][0].toString()) ||
                                                                                                          "null"
                                                                                                      }
                                                                                                  />
                                                                                              </b>{" "}
                                                                                              to{" "}
                                                                                              <b>
                                                                                                  <Highlighter
                                                                                                      searchWords={[
                                                                                                          historyParams && historyParams.search
                                                                                                              ? historyParams.search
                                                                                                              : ""
                                                                                                      ]}
                                                                                                      textToHighlight={
                                                                                                          (dat[1][1] && dat[1][1].toString()) ||
                                                                                                          "null"
                                                                                                      }
                                                                                                  />
                                                                                              </b>
                                                                                          </li>
                                                                                      );
                                                                                  });
                                                                              })
                                                                            : null}
                                                                        {Object.entries(item.changeset).map((data, index) => {
                                                                            return (
                                                                                <li key={index}>
                                                                                    <b>
                                                                                        <Highlighter
                                                                                            searchWords={[
                                                                                                historyParams && historyParams.search
                                                                                                    ? historyParams.search
                                                                                                    : ""
                                                                                            ]}
                                                                                            textToHighlight={item.user}
                                                                                        />
                                                                                    </b>{" "}
                                                                                    {propertyFields.includes(data[0]) ? (
                                                                                        <>
                                                                                            {item.event === "restore" ? "restored " : "changed "} the
                                                                                            report properties
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            {item.event === "restore" ? "restored " : "changed "} the
                                                                                            field{" "}
                                                                                            <b>
                                                                                                <Highlighter
                                                                                                    searchWords={[
                                                                                                        historyParams && historyParams.search
                                                                                                            ? historyParams.search
                                                                                                            : ""
                                                                                                    ]}
                                                                                                    textToHighlight={data[0]}
                                                                                                />
                                                                                            </b>{" "}
                                                                                            from{" "}
                                                                                            <b>
                                                                                                <Highlighter
                                                                                                    searchWords={[
                                                                                                        historyParams && historyParams.search
                                                                                                            ? historyParams.search
                                                                                                            : ""
                                                                                                    ]}
                                                                                                    textToHighlight={
                                                                                                        (data[1][0] && data[1][0].toString()) ||
                                                                                                        "null"
                                                                                                    }
                                                                                                />
                                                                                            </b>{" "}
                                                                                            to{" "}
                                                                                            <b>
                                                                                                <Highlighter
                                                                                                    searchWords={[
                                                                                                        historyParams && historyParams.search
                                                                                                            ? historyParams.search
                                                                                                            : ""
                                                                                                    ]}
                                                                                                    textToHighlight={
                                                                                                        (data[1][1] && data[1][1].toString()) ||
                                                                                                        "null"
                                                                                                    }
                                                                                                />
                                                                                            </b>
                                                                                        </>
                                                                                    )}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </td>
                                                                <td>
                                                                    <div className="date">
                                                                        <span>{item.created_at}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="type-dtl">
                                                                    <li className="dropdown dot-icn-arw">
                                                                        {item.restore && hasLogRestore && (
                                                                            <a
                                                                                className="ref"
                                                                                onClick={() =>
                                                                                    handleRestoreLog(
                                                                                        item.id,
                                                                                        "restore",
                                                                                        item.changeset,
                                                                                        item.associated_changes
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i className="fas fa-history cursor-hand" title={`Restore`}></i>
                                                                            </a>
                                                                        )}
                                                                        {hasLogDelete && (
                                                                            <a className="del" onClick={() => handleDeleteLog(item.id, "delete")}>
                                                                                <i className="fas fa-trash cursor-hand" title={`Delete`}></i>{" "}
                                                                            </a>
                                                                        )}
                                                                    </li>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <tr>
                                                        <td className="noRecordsColumn" colSpan={4}>
                                                            No records found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {logData.data && logData.data.length ? (
                                        <div className="table-bottom d-flex">
                                            <div className="count d-flex col-md-6">
                                                <div className="count-dtl">
                                                    Total Count: <span>{historyPaginationParams.totalCount}</span>
                                                </div>
                                                <div className="col-md-2 pr-2 selbx">
                                                    <select
                                                        className="form-control"
                                                        value={historyPaginationParams.perPage}
                                                        onChange={e => handlePerPageChangeHistory(e)}
                                                    >
                                                        <option value="10">10</option>
                                                        <option value="20">20</option>
                                                        <option value="30">30</option>
                                                        <option value="40">40</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="pagination-sec col-md-6">
                                                <ReactPaginate
                                                    previousLabel={
                                                        <span
                                                            data-place="top"
                                                            data-effect="solid"
                                                            data-tip={`Previous`}
                                                            data-background-color="#007bff"
                                                        >
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
                                                    pageCount={historyPaginationParams.totalPages}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageClickHistory}
                                                    containerClassName={"pagination"}
                                                    subContainerClassName={"pages pagination"}
                                                    activeClassName={"active"}
                                                    activeLinkClassName={"active"}
                                                    forcePage={historyPaginationParams.currentPage}
                                                />
                                                <ReactTooltip />
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(EditHistory);
