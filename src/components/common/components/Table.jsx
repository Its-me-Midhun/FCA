import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Row from "./Row";
import SummaryRow from "./SummaryRow";
import SummaryRowEnergy from "./SummaryRowEnergy";
import Loader from "./Loader";
import WildCardFilter from "./WildCardFilter";

class Table extends Component {
    state = {
        selectedFieldForCommonSearch: null,
        filterList: [],
        commonFilterParams: this.props.commonFilter || {},
        selectAll: "",
        idArray: [],
        isCancelApi: false,
        isOkApi: false,
        isLoadingDrop: false,
        valuee: "",
        sourceData: [],
        exportFilters: this.props.exportFilters || {}
    };

    componentDidMount = async () => {
        document.addEventListener("mousedown", this.handleClickOutside);
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
                        tab === "recommendation" ||
                        this.props.match.path === "/initiatives" ||
                        this.props.match.path === "/dashboard" ||
                        this.props.match.path === "/documents"
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
                exportFilters: this.props.exportFilters || {},
                selectedFieldForCommonSearch: !this.props.commonFilter ? null : this.state.selectedFieldForCommonSearch
            });
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
        if (prevProps.selectedAllClicked !== this.props.selectedAllClicked) {
            let selectAllClicked = localStorage.getItem("selectAllClicked");
            if (!this.props.selectedAllClicked || !selectAllClicked) {
                this.setState({
                    idArray: []
                });
                localStorage.removeItem("recommendationIds");
                localStorage.removeItem("selectAll");
            }
        }
        if (prevProps.tableData !== this.props.tableData) {
            ReactTooltip.rebuild();
        }
    };

    componentWillUnmount = () => {
        document.removeEventListener("mousedown", this.handleClickOutside);
    };

    setWrapperRef = node => {
        this.wrapperRef = node;
    };

    handleClickOutside = event => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                selectedFieldForCommonSearch: ""
            });
        }
    };

    handleSelectRow = (e, id) => {
        if ((this.props.match.params.tab === "recommendations" || this.props.match.params.tab == "recommendation") && !this.props.isAssignProject) {
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
        } else {
            this.props.handleSelect(e, id);
        }
    };

    handleSelectAllRow = (e, dataItem) => {
        if ((this.props.match.params.tab === "recommendations" || this.props.match.params.tab == "recommendation") && !this.props.isAssignProject) {
            let temp = [];
            if (e.target.checked) {
                if (dataItem && dataItem.data) {
                    dataItem.data.map(d => temp.push(d.id));
                }
                localStorage.setItem("selectAll", true);
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

    showCommonSearchDropDown = async keyItem => {
        const {
            tableData,
            match: {
                params: { tab }
            }
        } = this.props;
        const searchKey =
            tab === "recommendations" || tab === "dashboard" ? tableData.config[keyItem]?.getListTable : tableData.config[keyItem]?.searchKey;
        this.setState({ isLoadingDrop: true, selectedFieldForCommonSearch: this.state.selectedFieldForCommonSearch === keyItem ? null : keyItem });
        let getListParsms = { field: searchKey };
        let filterList = this.state.selectedFieldForCommonSearch === keyItem ? null : await this.props.getListForCommonFilter(getListParsms);
        this.setState({
            filterList,
            isLoadingDrop: false
        });
    };

    setCommonFilterParams = async (keyItem, data) => {
        const {
            match: {
                params: { tab }
            },
            tableData: { config }
        } = this.props;
        const { commonSearchKey, commonSearchObjectKey, searchKey, filterIdKey } = config[keyItem] || {};
        const { id: valueId, name: value } = data;
        let tempList = this.state.commonFilterParams;
        let exportFilters = this.state.exportFilters;
        if (
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab === "recommendation" ||
            this.props.match.path === "/initiatives" ||
            this.props.match.path === "/dashboard" ||
            this.props.match.path === "/documents"
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
            /***************** for data export filters  #start*/
            if (filterIdKey && valueId) {
                if (exportFilters[filterIdKey]) {
                    if (!exportFilters[filterIdKey].includes(valueId)) {
                        exportFilters[filterIdKey].push(valueId);
                    } else {
                        exportFilters[filterIdKey] = exportFilters[filterIdKey].filter(item => item !== valueId);

                        if (!exportFilters[filterIdKey].length) delete exportFilters[filterIdKey];
                    }
                } else {
                    exportFilters[filterIdKey] = [valueId];
                }
            } else {
                if (exportFilters[searchKey]) {
                    if (!exportFilters[searchKey].includes(value)) {
                        exportFilters[searchKey].push(value);
                    } else {
                        exportFilters[searchKey] = exportFilters[searchKey].filter(item => item !== value);

                        if (!exportFilters[searchKey].length) delete exportFilters[searchKey];
                    }
                } else {
                    exportFilters[searchKey] = [value];
                }
            }
            /***************** for data export filters  #end*/
            let isSelectAll;
            if (tempList && tempList[searchKey] && tempList[searchKey].length === this.state.filterList.length) {
                isSelectAll = true;
            } else {
                isSelectAll = false;
            }

            this.setState(prevState => ({
                commonFilterParams: tempList,
                selectAll: { ...prevState.selectAll, [searchKey]: isSelectAll }
            }));
        } else {
            if (tempList[commonSearchKey] && tempList[commonSearchKey][commonSearchObjectKey]) {
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

            this.setState(prevState => ({
                commonFilterParams: tempList,
                selectAll: { ...prevState.selectAll, [commonSearchKey]: isSelectAll }
            }));
        }
    };

    updateCommonFilterHandler = searchKey => {
        const { commonFilterParams, exportFilters } = this.state;
        this.setState({
            valuee: ""
        });
        if (Object.keys(commonFilterParams).length !== 0) {
            this.props.updateCommonFilter(commonFilterParams, exportFilters);

            this.setState(prevState => ({
                isOkApi: { ...prevState.isOkApi, [searchKey]: true },
                isCancelApi: { ...prevState.isCancelApi, [searchKey]: true }
            }));
        }
        if (this.state.isOkApi[searchKey] || this.checkHasCommonFilters() || this.state.isCancelApi[searchKey]) {
            this.props.updateCommonFilter(this.state.commonFilterParams, this.state.exportFilters);
            this.setState(prevState => ({
                isOkApi: { ...prevState.isOkApi, [searchKey]: false },
                isCancelApi: { ...prevState.isCancelApi, [searchKey]: false }
            }));
        }
        this.setState({
            selectedFieldForCommonSearch: null
        });
    };

    cancelCommonFilterHandler = keyItem => {
        const {
            match: {
                params: { tab }
            },
            tableData: { config }
        } = this.props;
        const { commonSearchKey, searchKey, filterIdKey } = config[keyItem] || {};
        let tempList = this.state.commonFilterParams;
        let { exportFilters } = this.state;
        this.setState({
            valuee: ""
        });
        if (
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab === "recommendation" ||
            this.props.match.path === "/initiatives" ||
            this.props.match.path === "/dashboard" ||
            this.props.match.path === "/documents"
        ) {
            if (tempList[searchKey]) {
                delete tempList[searchKey];
                if (filterIdKey && exportFilters[filterIdKey]) {
                    delete exportFilters[filterIdKey];
                } else if (exportFilters[searchKey]) {
                    delete exportFilters[searchKey];
                }
                if (this.state.isCancelApi[searchKey]) {
                    this.props.updateCommonFilter(tempList, exportFilters);
                }
            }
            if (this.state.isCancelApi[searchKey] || this.checkHasCommonFilters()) {
                this.props.updateCommonFilter(this.state.commonFilterParams, this.state.exportFilters);
                this.setState(prevState => ({
                    isCancelApi: { ...prevState.isCancelApi, [searchKey]: !this.state.isCancelApi[searchKey] },
                    isOkApi: { ...prevState.isOkApi, [searchKey]: false }
                }));
            }

            this.setState(prevState => ({
                selectedFieldForCommonSearch: null,
                selectAll: { ...prevState.selectAll, [searchKey]: false }
            }));
        } else {
            if (tempList[commonSearchKey]) {
                delete tempList[commonSearchKey];
                if (this.state.isCancelApi[searchKey]) {
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
                selectAll: { ...prevState.selectAll, [commonSearchKey]: false }
            }));
        }
    };
    selectAllHandler = async (keyItem, allSelect) => {
        const {
            match: {
                params: { tab }
            },
            tableData: { config }
        } = this.props;
        if (
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab === "recommendation" ||
            this.props.match.path === "/initiatives" ||
            this.props.match.path === "/dashboard" ||
            this.props.match.path === "/documents"
        ) {
            // const selctAll = !this.state.selectAll[keyItem.searchKey];
            const selctAll = !allSelect;
            let { filterList, exportFilters } = this.state;
            let filterListToCheck = this.state.commonFilterParams[keyItem?.searchKey] ? this.state.commonFilterParams[keyItem?.searchKey] : [];
            filterList = filterList?.filter(
                item =>
                    item.name?.toString()?.toLowerCase()?.includes(this.state.valuee?.toLowerCase()) ||
                    item.description?.toString()?.toLowerCase()?.includes(this.state.valuee?.toLowerCase()) ||
                    filterListToCheck?.includes(item.name)
            );
            let filterListName = filterList.map(item => item.name);
            let filterListId = filterList.map(item => item.id);
            let tempList = this.state.commonFilterParams;
            tempList[keyItem.searchKey] = selctAll ? filterListName : {};

            /***************** for data export filters  #start*/
            if (keyItem.filterIdKey) {
                exportFilters[keyItem.filterIdKey] = selctAll ? filterListId : {};
            } else {
                exportFilters[keyItem.searchKey] = selctAll ? filterListName : {};
            }
            /***************** for data export filters  #end*/

            this.setState(prevState => ({
                selectAll: { ...prevState.selectAll, [keyItem.searchKey]: selctAll },
                commonFilterParams: tempList,
                exportFilters
            }));
        } else {
            // const selctAll = !this.state.selectAll[keyItem.commonSearchKey];
            // let { filterList } = this.state;
            const selctAll = !allSelect;
            let { filterList } = this.state;
            let filterListToCheck =
                (this.state.commonFilterParams[keyItem?.commonSearchKey] &&
                    this.state.commonFilterParams[keyItem?.commonSearchKey][keyItem?.commonSearchObjectKey]) ||
                [];
            filterList = filterList?.filter(
                item =>
                    item.name?.toString()?.toLowerCase()?.includes(this.state.valuee?.toLowerCase()) ||
                    item.description?.toString()?.toLowerCase()?.includes(this.state.valuee?.toLowerCase()) ||
                    filterListToCheck.includes(item.name)
            );
            filterList = filterList?.filter(
                item =>
                    item.name?.toString()?.toLowerCase()?.includes(this.state.valuee?.toLowerCase()) ||
                    item.description?.toString()?.toLowerCase()?.includes(this.state.valuee?.toLowerCase())
            );
            filterList = filterList.map(item => item.name);
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

    clearDropdown = (commonSearchKey, commonSearchObjectKey, keyItem, searchKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        let tempList = this.state.commonFilterParams;
        if (
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab === "recommendation" ||
            this.props.match.path === "/initiatives" ||
            this.props.match.path === "/dashboard" ||
            this.props.match.path === "/documents"
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
                // selectedFieldForCommonSearch: null,
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
                // selectedFieldForCommonSearch: null,
                selectAll: { ...prevState.selectAll, [keyItem.commonSearchKey]: false }
            }));
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

        let { filterList, valuee } = this.state;
        filterList = filterList?.filter(item => item.name !== null && item.name !== "");

        let filterListToCheck =
            tab === "recommendations" ||
            tab === "dashboard" ||
            tab === "recommendation" ||
            this.props.match.path === "/initiatives" ||
            this.props.match.path === "/documents" ||
            this.props.match.path === "/dashboard"
                ? this.state.commonFilterParams[config[keyItem].searchKey]
                    ? this.state.commonFilterParams[config[keyItem].searchKey]
                    : []
                : (this.state.commonFilterParams[config[keyItem].commonSearchKey] &&
                      this.state.commonFilterParams[config[keyItem].commonSearchKey][config[keyItem].commonSearchObjectKey]) ||
                  [];
        let selectedValues = filterList?.filter(item => filterListToCheck?.includes(item.name));
        filterList = filterList?.filter(item => !filterListToCheck?.includes(item.name));
        filterList = filterList?.filter(
            item =>
                item.name?.toString()?.toLowerCase()?.includes(valuee?.toLowerCase()) ||
                item.description?.toString()?.toLowerCase()?.includes(valuee?.toLowerCase())
        );

        const { isLoadingDrop } = this.state;

        return (
            <div className="dropdown-menu drop-filtr pos-abs dp-rcm-overflow">
                {!isLoadingDrop ? (
                    <>
                        <div className="col-md-12 p-0 slt">
                            <span className="dropdown-item build_search_drp">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    value={this.state.valuee}
                                    onChange={e =>
                                        this.setState({
                                            valuee: e.target.value
                                        })
                                    }
                                />
                                <i class="fas fa-times cursor-pointer cls-close" onClick={() => this.setState({ valuee: "" })} />
                                <label className="container-check">
                                    Select all ({selectedValues.length})
                                    <input
                                        type="checkbox"
                                        checked={
                                            // tab === "recommendations" ||
                                            // tab === "dashboard" ||
                                            // tab === "recommendation" ||
                                            // this.props.match.path === "/initiatives" ||
                                            // this.props.match.path === "/dashboard" ||
                                            // this.props.match.path === "/documents"
                                            //     ? this.state.selectAll && this.state.selectAll[config[keyItem].searchKey]
                                            //     : this.state.selectAll && this.state.selectAll[config[keyItem].commonSearchKey]
                                            filterList.length + selectedValues.length === selectedValues.length
                                        }
                                        onClick={() =>
                                            this.selectAllHandler(
                                                config[keyItem],
                                                filterList.length + selectedValues.length === selectedValues.length
                                            )
                                        }
                                    />
                                    <span className="checkmark"></span>
                                    <button
                                        className="clear-btn-selection"
                                        onClick={() =>
                                            this.clearDropdown(
                                                config[keyItem].commonSearchKey,
                                                config[keyItem].commonSearchObjectKey,
                                                config[keyItem],
                                                config[keyItem].searchKey
                                            )
                                        }
                                    >
                                        Clear
                                    </button>
                                </label>
                            </span>
                        </div>
                        {selectedValues?.length > 0 && (
                            <div className="col-md-12 p-0 slt-ara border-bottom">
                                {selectedValues?.map((item, i) => (
                                    <span key={i} className="dropdown-item">
                                        <ReactTooltip id="building-dropdown" />
                                        {item.name !== null && item.name !== "" ? (
                                            <FilterItem
                                                item={item}
                                                keyItem={keyItem}
                                                getCapitalTypeData={this.getCapitalTypeData}
                                                setCommonFilterParams={this.setCommonFilterParams}
                                                checked={true}
                                            />
                                        ) : null}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="col-md-12 p-0 slt-ara">
                            {filterList?.length > 0 &&
                                filterList?.map((item, i) => (
                                    <span key={i} className="dropdown-item">
                                        <ReactTooltip id="building-dropdown" />
                                        {item.name !== null && item.name !== "" ? (
                                            <FilterItem
                                                item={item}
                                                keyItem={keyItem}
                                                getCapitalTypeData={this.getCapitalTypeData}
                                                setCommonFilterParams={this.setCommonFilterParams}
                                                checked={false}
                                            />
                                        ) : null}
                                    </span>
                                ))}

                            {!filterList?.length && !selectedValues.length ? (
                                <div className="col-md-6 no-wrap">NO DATA</div>
                            ) : (
                                filterList?.length === 0 && <div className="col-md-6 no-wrap">NO MORE VALUES TO DISPLAY</div>
                            )}
                        </div>
                        {filterList?.length || selectedValues?.length ? (
                            <div className="col-md-12 mt-3 drp-btn">
                                <button
                                    type="button"
                                    className="btn btn-primary mr-2"
                                    onClick={() => this.updateCommonFilterHandler(config[keyItem].searchKey)}
                                >
                                    OK
                                </button>
                                <button type="button" className="btn btn-primary btnClr" onClick={() => this.cancelCommonFilterHandler(keyItem)}>
                                    Cancel
                                </button>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <Loader />
                )}
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
                tab === "recommendation" ||
                this.props.match.path === "/initiatives" ||
                this.props.match.path === "/dashboard" ||
                this.props.match.path === "/documents"
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

    getCapitalTypeData = key => {
        switch (key) {
            case "NI":
                return "Non-Infrastructure";
            case "DM":
                return "Deferred Maintenance";
            case "FC":
                return "Future Capital";
            default:
                return "-";
        }
    };

    render() {
        const {
            tableData: originalTableData,
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
            summaryRowDataEnergy,
            showRestoreModal,
            isImportHistory = false,
            handleDownloadItem,
            hasPadding = false,
            permissions,
            handleSelect,
            isAssignProject,
            hasEdit,
            hasDelete,
            hasAssignToTrade = false,
            hasAssignToSystem = false,
            hasAssignToSubSystem = false,
            handleAssignToTrade,
            handleAssignToSystem,
            handleAssignToSubSystem,
            hasExport,
            isReportTemplate = false,
            handleToggleSlider,
            hasWildCardOptions = true,
            selectedRecomIds,
            handleSelectRecom,
            handleSelectAllRecom,
            handleSpecialReportActions,
            isBudgetPriority,
            isFullscreen,
            tableRef,
            hasAssignToSpecialReport = null,
            hasAssignToReportParagraph = null,
            hasAssignToChildParagraph = null,
            hasMultiAction = false,
            handleMultiSelect,
            everyItemCheckedPerPage,
            priorityElementsData = [],
            hasTableImport,
            handleDownloadItemImport,
            showEditExportPage,
            tableActionClass = "",
            hasTabActive,
            isInputMode,
            handleCellFocus,
            handleCellValueChange,
            handleColumnPin,
            pinnedColumnsRef,
            hasPin
        } = this.props;

        // sorting the table keys if any of the column is pinned
        const { keys, config } = originalTableData || {};
        const pinnedKeys = keys.filter(key => config[key] && config[key].pinned);
        const unpinnedKeys = keys.filter(key => !(config[key] && config[key].pinned));
        const sortedKeys = [...pinnedKeys, ...unpinnedKeys];
        let tableData = { ...originalTableData, keys: sortedKeys };
        let columnCount = 2;
        return (
            <div
                ref={tableRef}
                className={`table-section table-scroll ${
                    isBudgetPriority && !isFullscreen ? "overflow-table-hght" : isBudgetPriority && isFullscreen ? "recom-max-view" : ""
                } overflow-hght ${hasPadding ? "table-top-padd" : ""} ${!tableData?.data?.length ? "no-data-table" : ""} ${
                    hasActionColumn && !isBuildingLocked ? "" : "table-no-fixed"
                }`}
            >
                <table className={`table table-common table-min-height ${hasMultiAction ? "sticky-table-otr" : ""}`}>
                    <thead>
                        <tr ref={this.setWrapperRef}>
                            {this.props.match.params.section === "initiativeInfo" &&
                            !isAssignProject &&
                            this.props.match.params?.tab === "recommendation" ? (
                                <th className="img-sq-box seting-type checkbox-container">
                                    <label className="container-checkbox cursor-hand m-0">
                                        <input
                                            type="checkbox"
                                            checked={
                                                (tableData &&
                                                    tableData.data &&
                                                    this.state.idArray.length &&
                                                    this.state.idArray.length == tableData.data.length) ||
                                                this.props.selectedAllClicked
                                            }
                                            onChange={e => this.handleSelectAllRow(e, tableData)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                            ) : this.props.match.params.section === "imageInfo" || hasMultiAction ? (
                                <th className="img-sq-box seting-type checkbox-container">
                                    <label className="container-checkbox cursor-hand m-0">
                                        <input
                                            type="checkbox"
                                            checked={tableData.data?.length >= 1 && everyItemCheckedPerPage}
                                            onChange={e => handleSelectAllRecom(e.target.checked)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                            ) : (
                                <th className="img-sq-box seting-type checkbox-container">
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
                                                    (tableParams.filters[tableData.config[keyItem].searchKey].filters.includes("not_null") ||
                                                        tableParams.filters[tableData.config[keyItem].searchKey].filters.includes("null"))) ||
                                                this.checkHasCommonFilters(
                                                    tableData.config[keyItem].commonSearchKey,
                                                    tableData.config[keyItem].commonSearchObjectKey,
                                                    tableData.config[keyItem].searchKey
                                                )
                                                    ? " bg-th-filtered"
                                                    : ""
                                            } ${tableData.config[keyItem]?.pinned ? "pinned" : ""} cursor-pointer`}
                                            ref={tableData.config[keyItem]?.pinned ? ref => (pinnedColumnsRef[keyItem] = ref) : null}
                                            style={{ ...tableData.config[keyItem]?.style }}
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
                                                {hasPin && (
                                                    <button type="button" className="close" onClick={() => handleColumnPin(keyItem)}>
                                                        <span
                                                            className="close-reg cut-close ml-2"
                                                            data-place="top"
                                                            data-effect="solid"
                                                            data-tip={tableData.config[keyItem]?.pinned ? `Unpin Column` : `Pin Column`}
                                                            data-background-color="#007bff"
                                                        >
                                                            <i class="fas fa-thumbtack"></i>
                                                        </span>
                                                    </button>
                                                )}
                                                {tableData.config[keyItem].hasCommonSearch ? (
                                                    <>
                                                        <span
                                                            className="close-reg dropdown-toggle"
                                                            onClick={e => {
                                                                this.showCommonSearchDropDown(keyItem);
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
                                                        {tableParams.order["options.name"] === "asc" ? (
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
                                                        ) : tableParams.order["options.name"] === "desc" ? (
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
                                <th
                                    className={`action ${
                                        isReportTemplate
                                            ? "w-action"
                                            : isImportHistory || hasMultiAction
                                            ? "imp-history-action"
                                            : handleSpecialReportActions ||
                                              (hasAssignToSpecialReport && hasAssignToReportParagraph && hasAssignToChildParagraph)
                                            ? "wide-action"
                                            : isBudgetPriority
                                            ? "action-wide"
                                            : tableActionClass
                                    }`}
                                >
                                    Action
                                </th>
                            ) : null}
                        </tr>
                    </thead>
                    <tbody id="common-table-body">
                        {showWildCardFilter ? (
                            <WildCardFilter
                                updateWildCardFilter={updateWildCardFilter}
                                wildCardFilter={wildCardFilter}
                                hasWildCardOptions={hasWildCardOptions}
                                hasActionColumn={hasActionColumn}
                                keys={tableData.keys}
                                config={tableData.config}
                                isAsset={this.props.match.params.section === "assetinfo"}
                            />
                        ) : null}
                        {tableData.data && tableData.data.length ? (
                            <>
                                {tableData.data.map((dataItem, i) => (
                                    <Row
                                        keys={tableData.keys}
                                        config={tableData.config}
                                        rowData={dataItem}
                                        rowIndex={i}
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
                                            this.props.match.params.tab === "recommendations" ? this.state.idArray : this.props.recomentationIds
                                        }
                                        selectedAllClicked={this.props.selectedAllClicked}
                                        hasEdit={hasEdit}
                                        hasDelete={hasDelete}
                                        hasAssignToTrade={hasAssignToTrade}
                                        hasAssignToSystem={hasAssignToSystem}
                                        hasAssignToSubSystem={hasAssignToSubSystem}
                                        handleAssignToTrade={handleAssignToTrade}
                                        handleAssignToSystem={handleAssignToSystem}
                                        handleAssignToSubSystem={handleAssignToSubSystem}
                                        isReportTemplate={isReportTemplate}
                                        handleToggleSlider={handleToggleSlider}
                                        hasExport={hasExport}
                                        handleSelectRecom={handleSelectRecom}
                                        selectedRecomIds={selectedRecomIds}
                                        handleSpecialReportActions={handleSpecialReportActions}
                                        isAssignAsset={this.props.isAssignAsset}
                                        handleSelectAsset={this.props.handleSelectAsset}
                                        selectedAsset={this.props.selectedAsset}
                                        hasAssignToSpecialReport={hasAssignToSpecialReport}
                                        hasAssignToReportParagraph={hasAssignToReportParagraph}
                                        hasAssignToChildParagraph={hasAssignToChildParagraph}
                                        hasMultiAction={hasMultiAction}
                                        handleMultiSelect={handleMultiSelect}
                                        priorityElementsData={priorityElementsData}
                                        isBudgetPriority={isBudgetPriority}
                                        hasViewIcon={this.props.hasViewIcon}
                                        hasTabActive={hasTabActive}
                                        isInputMode={isInputMode}
                                        handleCellFocus={handleCellFocus}
                                        handleCellValueChange={handleCellValueChange}
                                    />
                                ))}
                                <SummaryRow
                                    keys={tableData.keys}
                                    config={tableData.config}
                                    tableData={tableData}
                                    tableParams={tableParams}
                                    summaryRowData={summaryRowData}
                                />
                                <SummaryRowEnergy
                                    keys={tableData.keys}
                                    config={tableData.config}
                                    tableData={tableData}
                                    tableParams={tableParams}
                                    summaryRowData={summaryRowDataEnergy}
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
                </table>
            </div>
        );
    }
}

export const FilterItem = ({ item, keyItem, setCommonFilterParams, getCapitalTypeData, checked }) => {
    return (
        <label className="container-check d-flex align-items-center">
            <span
                className="text-short"
                data-tip={
                    item.name?.length + item?.description?.length > 25
                        ? `${keyItem === "capital_type" ? getCapitalTypeData(item.name) : item.name} ${
                              item.description ? `(${item.description})` : ""
                          }`
                        : null
                }
                data-effect="solid"
                data-for="building-dropdown"
                data-place="left"
                data-background-color="#007bff"
                data-delay-show="500"
            >
                {keyItem === "capital_type" ? getCapitalTypeData(item.name) : item.name} {item.description ? `(${item.description})` : ""}
            </span>
            <span className="count-num"> ({item.count})</span>
            <input
                type="checkbox"
                checked={checked}
                onClick={e => {
                    setCommonFilterParams(keyItem, item);
                }}
            />
            <span className="checkmark"></span>
        </label>
    );
};

export default withRouter(Table);
