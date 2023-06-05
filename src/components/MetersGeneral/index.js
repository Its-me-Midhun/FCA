import React, { useEffect, useState } from "react";
import MeterGeneralView from "./components/MeterGeneralView";
import { addToBreadCrumpData, popBreadCrumpData } from "../../config/utils";
import { useDispatch, useSelector } from "react-redux";
import { addMeterTemplate, getMeterClientList, getMeterList, getMeterTemplateById, updateMeterTemplate } from "./actions";
import { meterTemplateTableData } from "../meterManagement/components/tableConfig";
import _ from "lodash";
import Portal from "../common/components/Portal";
import ViewModal from "../common/components/ViewModal";
import MeterForm from "./components/Form";

const MetersGeneral = props => {
    const dispatch = useDispatch();

    const {
        match: {
            params: { settingType }
        }
    } = props;
    const {
        meterReducer: {
            entityParams: { paginationParams, params, selectedEntity },
            getMeterListResponse: { meters, count },
            addMeterTemplateResponse,
            updateMeterTemplateResponse,
            getMeterTemplateByIdResponse,
            getClientListResponse
        }
    } = useSelector(state => state);

    const A = useSelector(e => e.meterReducer);
    const C = useSelector(e => e.commonReducer);

    console.log("A", A);

    const { getMeterListResponse } = useSelector(state => state.meterReducer);
    // debugger;

    const initialState = {
        section: "",
        tableData: { ...meterTemplateTableData, data: meters ?? [] },
        // selectedMeterTemplate: selectedEntity,
        showWildCardFilter: false,
        paginationParams,
        showViewModal: false,
        isLoading: false,
        params,
        alertMessage: "",
        inputs: {}
    };
    const [state, setState] = useState(initialState);
    useEffect(() => {
        refreshAccountList();
        // dispatch(getMeterClientList());
    }, []);

    const refreshAccountList = async () => {
        setState({ ...state, isLoading: true });
        // const { params, paginationParams, tableData } = state;

        let meterList = [];
        let totalCount = 0;
        dispatch(getMeterList(params));
        meterList = A.getMeterListResponse ? meters : [];
        totalCount = A.getMeterListResponse ? count : 0;

        if (meterList && !meterList.length && paginationParams.currentPage) {
            setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            dispatch(getMeterList(params));
            meterList = A.getMeterListResponse ? A.getMeterListResponse : [];
            totalCount = A.getMeterListResponse ? count : 0;
        }

        let project_permission = {};
        project_permission =
            C.getMenuItemsResponse && C.getMenuItemsResponse.user_permissions && C.getMenuItemsResponse.user_permissions.meters
                ? C.getMenuItemsResponse.user_permissions.meters || {}
                : {};
        let region_logs = {};
        region_logs =
            C.getMenuItemsResponse && C.getMenuItemsResponse.user_permissions && C.getMenuItemsResponse.user_permissions.meters
                ? C.getMenuItemsResponse.user_permissions.meters || {}
                : {};

        if (meterList && !meterList?.length && props?.meterReducer?.getMeterListResponse && props?.meterReducer?.getMeterListResponse?.error) {
            await setState({ alertMessage: props.meterReducer.getMeterListResponse.error });
            // showAlert();
        }

        setState({
            tableData: {
                ...state?.tableData,
                data: meterList,
                config: A.entityParams.tableConfig || state?.tableData.config
            },
            meterList,
            showWildCardFilter: state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            permissions: project_permission,
            logPermission: region_logs,
            isLoading: false
        });
        // updateEntityParams();
        return true;
    };

    useEffect(() => {
        if (meters && count) {
            setState({
                ...state,
                tableData: { ...state.tableData, data: meters },
                paginationParams: { ...state.paginationParams, totalCount: count, totalPages: Math.ceil(count / paginationParams.perPage) }
            });
        }
    }, [meters, count]);

    const showAddForm = () => {
        const { history } = props;
        setState({ ...state, section: "add" });
        addToBreadCrumpData({ key: "add", name: "Add Users", path: "/meters/add" });
        history.push(`/meters/add`);
    };

    const isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, meterTemplateTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };

    const handlePerPageChange = ({ target: { value } }) => {
        setState({ ...state, paginationParams: { ...state.paginationParams, perPage: value } });
    };

    const toggleWildCardFilter = () => {
        setState({ ...state, showWildCardFilter: !state.showWildCardFilter });
    };

    const resetAllFilters = () => {
        setState({
            ...state,
            paginationParams: { ...state.paginationParams, totalPages: 0, perPage: 100, currentPage: 0 }
        });
    };

    const updateWildCardFilter = newFilter => {
        setState({
            ...state,
            params: {
                ...state.params,
                offset: 0,
                filters: newFilter
            },
            paginationParams: {
                ...state.paginationParams,
                currentPage: 0
            }
        });
    };

    const handleDeleteItem = async id => {};

    const updateSelectedRow = row => {
        setState({ ...state, selectedRow: row });
    };

    const onSubmit = () => {
        console.log(state.inputs);
    };

    const showEditPage = id => {
        const { history } = props;
        setState({ ...state, editId: id, section: "edit" });
        addToBreadCrumpData({ key: "add", name: "Edit Trade Users", path: "/meter/edit" });
        history.push("/meter/edit");
    };

    useEffect(() => {
        setState({ ...state, section: settingType });
    }, [settingType]);

    const showViewModal = () => {
        setState({ ...state, showViewModal: true });
    };

    const onCancel = () => {
        const { history } = props;
        history.push("/Meter-sample/view");
        popBreadCrumpData();

        setState({ ...state, section: "view" });
    };

    const handleHideColumn = async keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll") {
            setState({
                ...state,
                tableData: {
                    ...state.tableData,
                    config: {
                        ...state.tableData.config,
                        [keyItem]: {
                            ...state.tableData.config[keyItem],
                            isVisible: !state.tableData.config[keyItem].isVisible
                        }
                    }
                }
            });
        } else {
            let tempConfig = state.tableData.config;
            state.tableData.keys.map(item => {
                if (keyItem === "selectAll") {
                    tempConfig[item].isVisible = true;
                } else {
                    tempConfig[item].isVisible = false;
                }
            });
            setState({
                ...state,
                tableData: {
                    ...state.tableData,
                    config: tempConfig
                }
            });
        }
        return true;
    };

    const handleAddMeterTemplate = async narrativeTemplate => {
        console.log("narrativeTemplate", narrativeTemplate);
        const { history } = props;
        dispatch(addMeterTemplate(narrativeTemplate));
        if (addMeterTemplateResponse && addMeterTemplateResponse.error) {
            setState({
                alertMessage: addMeterTemplateResponse.error
            });
            // showAlert();
        } else {
            setState({
                alertMessage: addMeterTemplateResponse && addMeterTemplateResponse.message
            });
            // showAlert();
            // await refreshMeterList();
            history.push(`/meters`);
        }
    };

    const handleUpdateMeterTemplate = async (meterTemplate_id, meterTemplate) => {
        const { history } = props;
        dispatch(updateMeterTemplate(meterTemplate_id, { ...meterTemplate }));
        if (updateMeterTemplateResponse && updateMeterTemplateResponse.error) {
            setState({ alertMessage: updateMeterTemplateResponse.error });
            // showAlert();
        } else {
            setState({
                alertMessage: (updateMeterTemplateResponse && updateMeterTemplateResponse.message) || "Meter Template updated successfully"
            });
            // showAlert();
            // await refreshMeterList();
            history.push(`/meters`);
            setState({
                selectedMeterTemplate: ""
            });
        }
    };
    const getDataById = async meterTemplateId => {
        dispatch(getMeterTemplateById(meterTemplateId));
        return getMeterTemplateByIdResponse;
    };
    return (
        <>
            {state.showViewModal ? (
                <Portal
                    body={
                        <ViewModal
                            keys={state.tableData.keys}
                            config={state.tableData.config}
                            handleHideColumn={handleHideColumn}
                            onCancel={() => setState({ ...state, showViewModal: false })}
                        />
                    }
                    onCancel={() => setState({ ...state, showViewModal: false })}
                />
            ) : null}
            {state.section === "add" || state.section === "edit" ? (
                <div>
                    <MeterForm
                        selectedMeterTemplate={state.selectedMeterTemplate}
                        handleAddMeterTemplate={handleAddMeterTemplate}
                        handleUpdateMeterTemplate={handleUpdateMeterTemplate}
                        getDataById={getDataById}
                        meterReducer={A}
                    />
                </div>
            ) : (
                <>
                    <MeterGeneralView
                        data={state.tableData}
                        handleDeleteItem={handleDeleteItem}
                        handleHideColumn={handleHideColumn}
                        isColunmVisibleChanged={isColunmVisibleChanged}
                        showViewModal={state.showViewModal}
                        // showEditPage={showEditPage}
                        updateSelectedRow={updateSelectedRow}
                        updateWildCardFilter={updateWildCardFilter}
                        toggleWildCardFilter={toggleWildCardFilter}
                        resetAllFilters={resetAllFilters}
                        showAddForm={showAddForm}
                        showWildCardFilter={state.showWildCardFilter}
                        handlePerPageChange={handlePerPageChange}
                        paginationParams={state.paginationParams}
                    />
                </>
            )}
        </>
    );
};

export default MetersGeneral;
