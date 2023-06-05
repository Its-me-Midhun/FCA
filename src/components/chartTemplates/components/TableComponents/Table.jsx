import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import ReactTooltip from "react-tooltip";

import Row from "../../../common/components/Row";
import SummaryRow from "../../../common/components/SummaryRow";
import Loader from "../../../common/components/Loader";
import WildCardFilter from "./WildCardFilter";

class Table extends Component {
    state = {
        isLoading: true,
        selectedFieldForCommonSearch: null,
        filterList: [],
        commonFilterParams: this.props.commonFilter || {},
        selectAll: "",
        idArray: [],
        isCancelApi: false,
        isOkApi: false
    };

    componentDidMount = async () => {
        await this.setState({
            isLoading: false
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;

        if (this.props.commonFilter) {
            if (!this.state.isOkApi && Object.keys(this.props.commonFilter).length !== 0) {
                let test = {};
                Object.keys(this.props.commonFilter).map(fil => {
                    if (
                        tab === "recommendations" ||
                        tab === "dashboard" ||
                        tab == "recommendation" ||
                        this.props.match.path == "/initiatives" ||
                        this.props.match.path == "/documents"
                    ) {
                        test = { ...test, [fil]: true };
                    } else {
                        let keyName = [fil] + "." + Object.keys(this.props.commonFilter[fil])[0];
                        test = { ...test, [keyName]: true };
                    }
                });
                this.setState({
                    isOkApi: test,
                    isCancelApi: test
                });
            }
        }
    };

    componentDidUpdate = prevProps => {
        if (prevProps.sortFilters !== this.props.sortFilters) {
            this.setState({
                sortFilters: this.props.sortFilters || {}
            });
        }
        if (prevProps.commonFilter !== this.props.commonFilter) {
            if (this.props.commonFilter) {
                const { selectAll } = [];
                let temp = selectAll;
                Object.keys(this.props.commonFilter).map(fil => {
                    if (
                        this.props.commonFilter[fil] &&
                        this.props.commonFilter[fil].name &&
                        this.props.commonFilter[fil].name.length == this.state.filterList.length
                    ) {
                        temp = { ...selectAll, [fil]: true };
                        this.setState({
                            selectAll: temp
                        });
                    }
                });
            } else {
                this.setState({
                    selectAll: {}
                });
            }
            this.setState({
                commonFilterParams: this.props.commonFilter || {},
                selectedFieldForCommonSearch: !this.props.commonFilter ? null : this.state.selectedFieldForCommonSearch
            });
            // if (Object.keys(prevProps.commonFilter) != 0 && Object.keys(this.props.commonFilter).length == 0) {
            //     this.props.updateCommonFilter(this.state.commonFilterParams);
            // }
        }
        if (prevProps.recomentationIds != this.props.recomentationIds) {
            if (!this.props.recomentationIds.length) {
                this.setState({
                    idArray: []
                });
                localStorage.removeItem("recommendationIds");
                localStorage.removeItem("selectAll");
            } else if (this.props.isAssignProject) {
                this.setState({
                    idArray: this.props.recomentationIds
                });
            }
        }
        if (prevProps.selectedAllClicked != this.props.selectedAllClicked) {
            let selectAllClicked = localStorage.getItem("selectAllClicked");
            if (!this.props.selectedAllClicked || !selectAllClicked) {
                this.setState({
                    idArray: []
                });
                localStorage.removeItem("recommendationIds");
                localStorage.removeItem("selectAll");
            }
        }
    };

    handleSelectRow = (e, id) => {
        if ((this.props.match.params.tab == "recommendations" || this.props.match.params.tab == "recommendation") && !this.props.isAssignProject) {
            // let temp = this.state.idArray
            let tempIds = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
            if (e.target.checked) {
                tempIds.push(id);
                this.setState({
                    idArray: tempIds
                });
                localStorage.setItem("recommendationIds", JSON.stringify(tempIds));
            } else {
                tempIds = tempIds.filter(t => t != id);
                this.setState({
                    idArray: tempIds
                });
                localStorage.setItem("recommendationIds", JSON.stringify(tempIds));
                localStorage.removeItem("selectAll");
                this.props.resetSelect();
            }
            //  this.props.handleSelect(e, id)
        } else {
            this.props.handleSelect(e, id);
        }
    };

    handleSelectAllRow = (e, dataItem) => {
        if ((this.props.match.params.tab == "recommendations" || this.props.match.params.tab == "recommendation") && !this.props.isAssignProject) {
            let temp = [];
            let tempIds = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];

            if (e.target.checked) {
                if (dataItem && dataItem.data) {
                    dataItem.data.map(d => temp.push(d.id));
                }
                // let test = [...temp, ...tempIds]
                // console.log("test-->",test)
                // temp = test
                localStorage.setItem("selectAll", true);
                // localStorage.setItem("selectAllClicked", true)
            } else {
                temp = [];
                localStorage.removeItem("selectAll");
                localStorage.setItem("selectAllClicked", false);
            }
            this.setState({
                idArray: temp
            });
            localStorage.setItem("recommendationIds", JSON.stringify(temp));
            this.props.handleSelectAll(e, dataItem);
        } else {
            this.props.handleSelectAll(e, dataItem);
        }
    };

    setSortOrderParams = async (event, searchKey, val, tableData) => {
        if (tableData && tableData.data && tableData.data.length) {
            var thIconsContainer = document.getElementById(`thIconsContainer_${searchKey}`);
            if (thIconsContainer && !thIconsContainer.contains(event.target)) {
                await this.props.updateTableSortFilters(searchKey, val);
            }
        }
    };
    setSortOrderParamsByArrow = async (event, searchKey, val, tableData) => {
        if (tableData && tableData.data && tableData.data.length) {
            await this.props.updateTableSortFilters(searchKey, val);
        }
    };

    showCommonSearchDropDown = async (keyItem, searchKey) => {
        let getListParsms = { field: searchKey };
        let filterList = this.state.selectedFieldForCommonSearch === keyItem ? null : await this.props.getListForCommonFilter(getListParsms);
        this.setState({
            selectedFieldForCommonSearch: this.state.selectedFieldForCommonSearch === keyItem ? null : keyItem,
            filterList
        });
    };

    setCommonFilterParams = async (commonSearchKey, value, commonSearchObjectKey, searchKey, keyItem) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        let tempList = this.state.commonFilterParams;

        if (
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab == "recommendation" ||
            this.props.match.path == "/initiatives" ||
            this.props.match.path == "/documents"
        ) {
            if (tempList[searchKey]) {
                if (!tempList[searchKey].includes(value)) {
                    tempList[searchKey].push(value);
                } else {
                    tempList[searchKey] = tempList[searchKey].filter(item => item !== value);

                    if (!tempList[searchKey].length) delete tempList[searchKey];
                }
            } else {
                tempList[searchKey] = [value];
            }
            let isSelectAll;
            if (tempList && tempList[searchKey] && tempList[searchKey].length === this.state.filterList.length) {
                isSelectAll = true;
            } else {
                isSelectAll = false;
            }

            // this.props.updateCommonFilter(tempList);
            if (Object.keys(tempList).length == 0) {
                let getListParsms = { field: searchKey };

                let filterList = await this.props.getListForCommonFilter(getListParsms);

                this.setState({
                    selectedFieldForCommonSearch: keyItem,
                    filterList
                });
            }

            this.setState(prevState => ({
                commonFilterParams: tempList,
                selectAll: { ...prevState.selectAll, [searchKey]: isSelectAll }
            }));
        } else {
            if (tempList[commonSearchKey]) {
                if (!tempList[commonSearchKey][commonSearchObjectKey].includes(value)) {
                    tempList[commonSearchKey][commonSearchObjectKey].push(value);
                } else {
                    tempList[commonSearchKey][commonSearchObjectKey] = tempList[commonSearchKey][commonSearchObjectKey].filter(
                        item => item !== value
                    );

                    if (!tempList[commonSearchKey][commonSearchObjectKey].length) delete tempList[commonSearchKey];
                }
            } else {
                tempList[commonSearchKey] = { [commonSearchObjectKey]: [value] };
            }
            let isSelectAll;
            if (tempList && tempList[commonSearchKey] && tempList[commonSearchKey][commonSearchObjectKey].length === this.state.filterList.length) {
                isSelectAll = true;
            } else {
                isSelectAll = false;
            }

            // this.props.updateCommonFilter(tempList);
            if (Object.keys(tempList).length == 0) {
                let getListParsms = { field: searchKey };
                let filterList = await this.props.getListForCommonFilter(getListParsms);

                this.setState({
                    selectedFieldForCommonSearch: keyItem,
                    filterList
                });
            }

            this.setState(prevState => ({
                commonFilterParams: tempList,
                selectAll: { ...prevState.selectAll, [commonSearchKey]: isSelectAll }
            }));
        }
    };

    // updateCommonFilterHandler = (searchKey) => {
    //     const { commonFilterParams } = this.state;
    //     if (Object.keys(commonFilterParams).length !== 0) {
    //         this.props.updateCommonFilter(commonFilterParams);

    //         this.setState(prevState => ({
    //             isCancelApi: { ...prevState.isCancelApi, [searchKey]: true }
    //         }));
    //     }

    //     this.setState({
    //         selectedFieldForCommonSearch: null
    //     });
    // };

    // cancelCommonFilterHandler = (commonSearchKey, commonSearchObjectKey, keyItem, searchKey) => {
    //     const {
    //         match: {
    //             params: { tab }
    //         }
    //     } = this.props;
    //     let tempList = this.state.commonFilterParams;

    //     if (tab === "recommendations" || tab === "dashboard" || this.props.match.path == "/initiatives") {

    //         if (tempList[searchKey]) {

    //             delete tempList[searchKey];
    //             if (this.state.isCancelApi[keyItem.searchKey]) {
    //                 this.props.updateCommonFilter(tempList);
    //             }
    //         }

    //         this.setState(prevState => ({
    //             selectedFieldForCommonSearch: null,
    //             selectAll: { ...prevState.selectAll, [keyItem.searchKey]: false }
    //         }));
    //     }
    //     else {

    //         if (tempList[commonSearchKey]) {

    //             delete tempList[commonSearchKey];
    //             if (this.state.isCancelApi[keyItem.searchKey]) {
    //                 this.props.updateCommonFilter(tempList);
    //             }

    //         }

    //         this.setState(prevState => ({
    //             selectedFieldForCommonSearch: null,
    //             selectAll: { ...prevState.selectAll, [keyItem.commonSearchKey]: false }
    //         }));
    //     }
    // };
    updateCommonFilterHandler = searchKey => {
        const { commonFilterParams } = this.state;
        if (Object.keys(commonFilterParams).length !== 0) {
            this.props.updateCommonFilter(commonFilterParams);

            this.setState(prevState => ({
                isOkApi: { ...prevState.isOkApi, [searchKey]: true },
                isCancelApi: { ...prevState.isCancelApi, [searchKey]: true }
            }));
        }
        if (this.state.isOkApi[searchKey] || this.checkHasCommonFilters() || this.state.isCancelApi[searchKey]) {
            this.props.updateCommonFilter(this.state.commonFilterParams);
            this.setState(prevState => ({
                isOkApi: { ...prevState.isOkApi, [searchKey]: false },
                isCancelApi: { ...prevState.isCancelApi, [searchKey]: false }
            }));
        }
        // else if (Object.keys(commonFilterParams).length == 0) {
        //     this.props.updateCommonFilter(this.state.commonFilterParams);
        // }

        this.setState({
            selectedFieldForCommonSearch: null
        });
    };

    cancelCommonFilterHandler = (commonSearchKey, commonSearchObjectKey, keyItem, searchKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        let tempList = this.state.commonFilterParams;

        if (
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab == "recommendation" ||
            this.props.match.path == "/initiatives" ||
            this.props.match.path == "/documents"
        ) {
            if (tempList[searchKey]) {
                delete tempList[searchKey];
                if (this.state.isCancelApi[keyItem.searchKey]) {
                    this.props.updateCommonFilter(tempList);
                }
            }
            if (this.state.isCancelApi[searchKey] || this.checkHasCommonFilters()) {
                this.props.updateCommonFilter(this.state.commonFilterParams);
                this.setState(prevState => ({
                    isCancelApi: { ...prevState.isCancelApi, [searchKey]: !this.state.isCancelApi[searchKey] },
                    isOkApi: { ...prevState.isOkApi, [searchKey]: false }
                }));
            }

            this.setState(prevState => ({
                selectedFieldForCommonSearch: null,
                selectAll: { ...prevState.selectAll, [keyItem.searchKey]: false }
            }));
        } else {
            if (tempList[commonSearchKey]) {
                delete tempList[commonSearchKey];
                if (this.state.isCancelApi[keyItem.searchKey]) {
                    this.props.updateCommonFilter(tempList);
                }
            }
            if (this.state.isCancelApi[searchKey] || this.checkHasCommonFilters()) {
                this.props.updateCommonFilter(this.state.commonFilterParams);
                this.setState(prevState => ({
                    isCancelApi: { ...prevState.isCancelApi, [searchKey]: !this.state.isCancelApi[searchKey] },
                    isOkApi: { ...prevState.isOkApi, [searchKey]: false }
                }));
            }

            this.setState(prevState => ({
                selectedFieldForCommonSearch: null,
                selectAll: { ...prevState.selectAll, [keyItem.commonSearchKey]: false }
            }));
        }
    };
    selectAllHandler = async keyItem => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab == "recommendation" ||
            this.props.match.path == "/initiatives" ||
            this.props.match.path == "/documents"
        ) {
            const selctAll = !this.state.selectAll[keyItem.searchKey];
            let { filterList } = this.state;
            filterList = filterList.filter(item => item !== null);
            let tempList = this.state.commonFilterParams;

            if (selctAll) {
                tempList[keyItem.searchKey] = filterList;
                this.setState(prevState => ({
                    selectAll: { ...prevState.selectAll, [keyItem.searchKey]: selctAll },
                    commonFilterParams: tempList
                }));
            } else {
                this.setState(prevState => ({
                    selectAll: { ...prevState.selectAll, [keyItem.searchKey]: selctAll },
                    commonFilterParams: {}
                }));
            }
        } else {
            const selctAll = !this.state.selectAll[keyItem.commonSearchKey];
            let { filterList } = this.state;
            filterList = filterList.filter(item => item !== null);
            let tempList = this.state.commonFilterParams;

            if (selctAll) {
                tempList[keyItem.commonSearchKey] = { [keyItem.commonSearchObjectKey]: filterList };
                this.setState(prevState => ({
                    selectAll: { ...prevState.selectAll, [keyItem.commonSearchKey]: selctAll },
                    commonFilterParams: tempList
                }));
            } else {
                this.setState(prevState => ({
                    selectAll: { ...prevState.selectAll, [keyItem.commonSearchKey]: selctAll },
                    commonFilterParams: {}
                }));
            }
        }
    };

    renderFiltersForCommonSearch = keyItem => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (this.state.selectedFieldForCommonSearch !== keyItem) {
            return null;
        }
        const {
            tableData: { config }
        } = this.props;

        let { filterList } = this.state;
        filterList = filterList.filter(item => item !== null && item !== "");

        let filterListToCheck =
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab == "recommendation" ||
            this.props.match.path == "/initiatives" ||
            this.props.match.path == "/documents"
                ? this.state.commonFilterParams[config[keyItem].searchKey]
                    ? this.state.commonFilterParams[config[keyItem].searchKey]
                    : []
                : (this.state.commonFilterParams[config[keyItem].commonSearchKey] &&
                      this.state.commonFilterParams[config[keyItem].commonSearchKey][config[keyItem].commonSearchObjectKey]) ||
                  [];
        return (
            <div className="dropdown-menu drop-filtr">
                <div className="col-md-12 p-0 slt">
                    <span className="dropdown-item">
                        <label className="container-check">
                            Select all
                            <input
                                type="checkbox"
                                checked={
                                    tab === "recommendations" ||
                                    tab === "dashboard" ||
                                    tab == "recommendation" ||
                                    this.props.match.path == "/initiatives" ||
                                    this.props.match.path == "/documents"
                                        ? this.state.selectAll && this.state.selectAll[config[keyItem].searchKey]
                                        : this.state.selectAll && this.state.selectAll[config[keyItem].commonSearchKey]
                                }
                                onClick={() => this.selectAllHandler(config[keyItem])}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </span>
                </div>
                <div className="col-md-12 p-0 chk-ara">
                    {filterList.length ? (
                        filterList.map((item, i) => (
                            <span key={i} className="dropdown-item">
                                {item !== null && item !== "" ? (
                                    <label className="container-check">
                                        {item}
                                        <input
                                            type="checkbox"
                                            checked={filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item)}
                                            onClick={e => {
                                                this.setCommonFilterParams(
                                                    config[keyItem].commonSearchKey,
                                                    item,
                                                    config[keyItem].commonSearchObjectKey,
                                                    config[keyItem].searchKey,
                                                    keyItem
                                                );
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                ) : null}
                            </span>
                        ))
                    ) : (
                        <div className="col-md-6 no-wrap">No data</div>
                    )}
                </div>
                {filterList.length ? (
                    <div className="col-md-12 mt-3 drp-btn">
                        <button
                            type="button"
                            className="btn btn-primary btnClr"
                            onClick={() =>
                                this.cancelCommonFilterHandler(
                                    config[keyItem].commonSearchKey,
                                    config[keyItem].commonSearchObjectKey,
                                    config[keyItem],
                                    config[keyItem].searchKey
                                )
                            }
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btnRgion"
                            onClick={() => this.updateCommonFilterHandler(config[keyItem].searchKey)}
                        >
                            OK
                        </button>
                    </div>
                ) : null}
            </div>
        );
    };

    checkHasCommonFilters = (commonSearchKey, commonSearchObjectKey, searchKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        const { tableParams = null } = this.props;
        if (tableParams) {
            if (
                tab === "recommendations" ||
                tab === "dashboard" ||
                tab == "recommendation" ||
                this.props.match.path == "/initiatives" ||
                this.props.match.path == "/documents"
            ) {
                if (tableParams.list && tableParams.list[searchKey] && tableParams.list[searchKey].length) {
                    return true;
                }
            } else {
                if (
                    tableParams.list &&
                    tableParams.list[commonSearchKey] &&
                    tableParams.list[commonSearchKey][commonSearchObjectKey] &&
                    tableParams.list[commonSearchKey][commonSearchObjectKey].length
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    render() {
        const {
            tableData,
            updateCurrentViewAllUsers,
            currentViewAllUsers,
            handleDeleteItem,
            showWildCardFilter,
            showEditPage,
            showInfoPage,
            hasInfoPage = true,
            selectedRowId,
            updateSelectedRow,
            updateWildCardFilter,
            wildCardFilter,
            handleHideColumn,
            hasColumnClose = false,
            hasSort = true,
            hasActionColumn = true,
            tableParams = null,
            isBuildingLocked,
            handleCutPaste,
            summaryRowData,
            showRestoreModal,
            isImportHistory = false,
            handleDownloadItem,
            hasPadding = false,
            permissions,
            handleSelect,
            isAssignProject,
            hasEdit,
            hasDelete,
            hasExport,
            isReportTemplate = false,
            handleToggleSlider
        } = this.props;
        let columnCount = 2;
        return (
            <LoadingOverlay active={this.state.isLoading && !tableData.config} spinner={<Loader />} fadeSpeed={10}>
                <div
                    className={`table-section table-scroll overflow-hght ${hasPadding ? "table-top-padd" : ""} ${
                        hasActionColumn && !isBuildingLocked ? "" : "table-no-fixed"
                    }`}
                >
                    <table className="table table-common table-min-height">
                        <thead>
                            <tr>
                                {this.props.match.params.section == "initiativeInfo" && !isAssignProject ? (
                                    <th class="img-sq-box seting-type checkbox-container">
                                        <label class="container-checkbox cursor-hand m-0">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    (tableData &&
                                                        tableData.data &&
                                                        this.state.idArray.length &&
                                                        this.state.idArray.length == tableData.data.length) ||
                                                    this.props.selectedAllClicked
                                                }
                                                onClick={e => this.handleSelectAllRow(e, tableData)}
                                            />
                                            <span class="checkmark"></span>
                                        </label>
                                    </th>
                                ) : (
                                    <th class="img-sq-box seting-type checkbox-container">
                                        <img alt="" src="/img/sq-box.png" />
                                    </th>
                                )}
                                {tableData.keys &&
                                    tableData.keys.map((keyItem, i) => {
                                        return tableData.config && tableData.config[keyItem] && tableData.config[keyItem].isVisible ? (
                                            <th
                                                key={i}
                                                className={`${tableData.config[keyItem].class}${
                                                    (tableParams &&
                                                        tableParams.filters &&
                                                        tableParams.filters[tableData.config[keyItem].searchKey] &&
                                                        tableParams.filters[tableData.config[keyItem].searchKey].key) ||
                                                    (tableParams &&
                                                        tableParams.filters &&
                                                        tableParams.filters[tableData.config[keyItem].searchKey].filters.includes("not_null")) ||
                                                    this.checkHasCommonFilters(
                                                        tableData.config[keyItem].commonSearchKey,
                                                        tableData.config[keyItem].commonSearchObjectKey,
                                                        tableData.config[keyItem].searchKey
                                                    )
                                                        ? " bg-th-filtered"
                                                        : ""
                                                } cursor-pointer`}
                                                onClick={event =>
                                                    hasSort
                                                        ? this.setSortOrderParams(
                                                              event,
                                                              tableData.config[keyItem].searchKey,
                                                              tableData.config[keyItem].label,
                                                              tableData
                                                          )
                                                        : null
                                                }
                                            >
                                                {tableData.config[keyItem].label}
                                                <span id={`thIconsContainer_${tableData.config[keyItem].searchKey}`}>
                                                    {tableData.config[keyItem].hasCommonSearch ? (
                                                        <>
                                                            <span
                                                                className="close-reg dropdown-toggle"
                                                                onClick={e => {
                                                                    this.showCommonSearchDropDown(keyItem, tableData.config[keyItem].searchKey);
                                                                }}
                                                            >
                                                                <i className="fas fa-chevron-down"></i>
                                                            </span>
                                                            {this.renderFiltersForCommonSearch(keyItem)}
                                                        </>
                                                    ) : hasColumnClose ? (
                                                        <button type="button" className="close" onClick={() => handleHideColumn(keyItem)}>
                                                            <span aria-hidden="true">
                                                                <img src="/img/close.svg" alt="" />
                                                            </span>
                                                        </button>
                                                    ) : tableData.config[keyItem].hasCutPaste ? (
                                                        permissions && permissions.edit == false ? (
                                                            ""
                                                        ) : (
                                                            <button type="button" className="close" onClick={() => handleCutPaste(keyItem)}>
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="close-reg cut-close"
                                                                    data-place="top"
                                                                    data-effect="solid"
                                                                    data-tip={`Move Costs to Another Year`}
                                                                    data-background-color="#007bff"
                                                                >
                                                                    <i className="fas fa-cut" />
                                                                </span>
                                                                {/* <ReactTooltip/> */}
                                                            </button>
                                                        )
                                                    ) : null}

                                                    {tableParams && tableParams.order && tableParams.order[tableData.config[keyItem].searchKey] ? (
                                                        <>
                                                            {tableParams.order[tableData.config[keyItem].searchKey] === "asc" ? (
                                                                <i
                                                                    className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}
                                                                    onClick={event =>
                                                                        hasSort
                                                                            ? this.setSortOrderParamsByArrow(
                                                                                  event,
                                                                                  tableData.config[keyItem].searchKey,
                                                                                  tableData.config[keyItem].label,
                                                                                  tableData
                                                                              )
                                                                            : null
                                                                    }
                                                                ></i>
                                                            ) : (
                                                                <i
                                                                    className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}
                                                                    onClick={event =>
                                                                        hasSort
                                                                            ? this.setSortOrderParamsByArrow(
                                                                                  event,
                                                                                  tableData.config[keyItem].searchKey,
                                                                                  tableData.config[keyItem].label,
                                                                                  tableData
                                                                              )
                                                                            : null
                                                                    }
                                                                ></i>
                                                            )}
                                                        </>
                                                    ) : null}
                                                    {tableParams &&
                                                    tableParams.order &&
                                                    tableParams.maintenance_year &&
                                                    tableParams.maintenance_year.length &&
                                                    keyItem.split("_")[1] == tableParams.maintenance_year[0] ? (
                                                        <>
                                                            {tableParams.order["maintenance_years.amount"] === "asc" ? (
                                                                <i
                                                                    className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}
                                                                    onClick={event =>
                                                                        hasSort
                                                                            ? this.setSortOrderParamsByArrow(
                                                                                  event,
                                                                                  tableData.config[keyItem].searchKey,
                                                                                  tableData.config[keyItem].label,
                                                                                  tableData
                                                                              )
                                                                            : null
                                                                    }
                                                                ></i>
                                                            ) : tableParams.order["maintenance_years.amount"] === "desc" ? (
                                                                <i
                                                                    className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}
                                                                    onClick={event =>
                                                                        hasSort
                                                                            ? this.setSortOrderParamsByArrow(
                                                                                  event,
                                                                                  tableData.config[keyItem].searchKey,
                                                                                  tableData.config[keyItem].label,
                                                                                  tableData
                                                                              )
                                                                            : null
                                                                    }
                                                                ></i>
                                                            ) : null}
                                                        </>
                                                    ) : null}
                                                    {tableParams &&
                                                    tableParams.order &&
                                                    tableParams.index &&
                                                    tableParams.index.length &&
                                                    keyItem.split("t")[2] == tableParams.index[0] ? (
                                                        <>
                                                            {tableParams.order["priority_elements.element"] === "asc" ? (
                                                                <i
                                                                    className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}
                                                                    onClick={event =>
                                                                        hasSort
                                                                            ? this.setSortOrderParamsByArrow(
                                                                                  event,
                                                                                  tableData.config[keyItem].searchKey,
                                                                                  tableData.config[keyItem].label,
                                                                                  tableData
                                                                              )
                                                                            : null
                                                                    }
                                                                ></i>
                                                            ) : tableParams.order["priority_elements.element"] === "desc" ? (
                                                                <i
                                                                    className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}
                                                                    onClick={event =>
                                                                        hasSort
                                                                            ? this.setSortOrderParamsByArrow(
                                                                                  event,
                                                                                  tableData.config[keyItem].searchKey,
                                                                                  tableData.config[keyItem].label,
                                                                                  tableData
                                                                              )
                                                                            : null
                                                                    }
                                                                ></i>
                                                            ) : null}
                                                        </>
                                                    ) : null}
                                                </span>
                                            </th>
                                        ) : null;
                                    })}
                                {hasActionColumn && !isBuildingLocked && !isAssignProject ? (
                                    <th className={`action ${isReportTemplate ? "width-200px" : ""}`}>Action</th>
                                ) : null}
                            </tr>
                        </thead>
                        <tbody id="common-table-body">
                            {showWildCardFilter ? (
                                <WildCardFilter
                                    updateWildCardFilter={updateWildCardFilter}
                                    wildCardFilter={wildCardFilter}
                                    keys={tableData.keys}
                                    config={tableData.config}
                                />
                            ) : null}
                            {tableData.data && tableData.data.length ? (
                                <>
                                    {tableData.data.map((dataItem, i) => (
                                        <Row
                                            keys={tableData.keys}
                                            config={tableData.config}
                                            rowData={dataItem}
                                            key={i}
                                            updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                                            currentViewAllUsers={currentViewAllUsers}
                                            handleDeleteItem={handleDeleteItem}
                                            showEditPage={showEditPage}
                                            showInfoPage={showInfoPage}
                                            hasInfoPage={isAssignProject ? false : hasInfoPage}
                                            updateSelectedRow={updateSelectedRow}
                                            selectedRowId={selectedRowId || null}
                                            hasActionColumn={isAssignProject ? false : hasActionColumn}
                                            tableParams={tableParams}
                                            isBuildingLocked={isBuildingLocked}
                                            showRestoreModal={showRestoreModal}
                                            isImportHistory={isImportHistory}
                                            handleDownloadItem={handleDownloadItem}
                                            permissions={permissions}
                                            handleSelect={this.handleSelectRow}
                                            isAssignProject={isAssignProject}
                                            recomentationIds={
                                                this.props.match.params.tab == "recommendations" ? this.state.idArray : this.props.recomentationIds
                                            }
                                            selectedAllClicked={this.props.selectedAllClicked}
                                            hasEdit={hasEdit}
                                            hasDelete={hasDelete}
                                            isReportTemplate={isReportTemplate}
                                            handleToggleSlider={handleToggleSlider}
                                            hasExport={hasExport}
                                        />
                                    ))}
                                    <SummaryRow
                                        keys={tableData.keys}
                                        config={tableData.config}
                                        tableData={tableData}
                                        tableParams={tableParams}
                                        summaryRowData={summaryRowData}
                                    />
                                </>
                            ) : (
                                <tr className="text-center">
                                    {tableData.keys.map(keyItem => {
                                        if (tableData.config && tableData.config[keyItem]?.isVisible) {
                                            columnCount += 1;
                                        }
                                    })}
                                    <td className="noRecordsColumn" colSpan={columnCount}>
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {/* {tableData.data && tableData.data.length ?
                            <tfoot class="table-foot">
                                <SummaryRow
                                    keys={tableData.keys}
                                    config={tableData.config}
                                    tableData={tableData}
                                    tableParams={tableParams}
                                    summaryRowData={summaryRowData}
                                /></tfoot>
                            : null} */}
                    </table>
                </div>
            </LoadingOverlay>
        );
    }
}

export default withRouter(Table);
