import React, { useEffect, useState } from "react";
import qs from "query-string";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import meterActions, {
    addMeterTemplate,
    getMeterAccounts,
    getMeterBuildingList,
    getMeterClientList,
    getMeterRegionList,
    getMeterSiteList
} from "../actions";
import { popBreadCrumpData, findPrevPathFromBreadCrump, popBreadCrumpRecData } from "../../../config/utils";
import { useDispatch, useSelector } from "react-redux";

const MeterForm = props => {
    const dispatch = useDispatch();
    const initialValues = {
        isLoading: true,
        isUploading: false,
        errorMessage: "",
        clients: [],
        regions: [],
        sites: [],
        buildings: [],
        accounts: [],
        meterTemplate: {
            client_id: "",
            region_id: "",
            site_id: "",
            building_id: "",
            account_id: "",
            meter_type: "",
            meter: "",
            description: "",
            account_description: "",
            account_type: ""
        },
        errorParams: {
            client_id: "",
            region_id: "",
            site_id: "",
            building_id: "",
            account_id: "",
            meter_type: "",
            meter: ""
        },
        initiaValues: {},
        isNewProject: true,
        selectedClient: {},
        projectList: [],
        selectedConsultancyUsers: [],
        selectedClientUsers: [],
        // selectedMeterTemplate: props.match.params.id,
        uploadError: "",
        attachmentChanged: false,
        showConfirmModal: false,
        showErrorBorder: false,
        selectedBuilding: qs.parse(props?.location?.search?.bid) || null,
        initialConsultancyUsers: [],
        initialClientUsers: [],
        userRole: localStorage.getItem("role")
    };
    const [state, setState] = useState(initialValues);

    console.log("satte", state);
    console.log("propsForm", props);

    const A = useSelector(e => e.meterReducer);
    console.log("A@@@@@@@@@", A);

    useEffect(() => {
        handleClientDetails();
        if (state.selectedMeterTemplate) {
            props.getDataById(state.selectedMeterTemplate);
            const {
                meterReducer: {
                    getMeterTemplateByIdResponse: { success, client, region, site, building, meter_type, meter, account, description }
                }
            } = props;

            if (success) {
                setState({
                    ...state,
                    meterTemplate: {
                        client_id: client?.id,
                        region_id: region?.id,
                        site_id: site?.id,
                        building_id: building?.id,
                        account_id: account?.id,
                        meter_type,
                        meter,
                        account_description: account?.description,
                        account_type: account?.account_type,
                        description: description
                    }
                });
            }
        }

        setState({
            ...state,
            initiaValues: state.meterTemplate,
            isLoading: false
        });
    }, []);

    useEffect(() => {
        let {
            getClientListResponse: { clients },
            getRegionListResponse: { regions },
            getSiteListResponse: { sites },
            getBuildingListResponse: { buildings },
            getAccountsListResponse: { accounts }
        } = A;
        console.log("sites", sites);

        if (clients) {
            console.log("state", state);
            setState({
                ...state,
                clients
            });
            // dispatch(getMeterRegionList(clients.id));
        }
        if (state.meterTemplate.client_id && regions)
            setState({
                ...state,
                regions
            });

        if (sites)
            setState({
                ...state,
                sites
            });
        if (buildings) {
            setState({
                ...state,
                buildings
            });
        }
        if (accounts) {
            setState({
                ...state,
                accounts
            });
        }
    }, [A]);

    useEffect(() => {
        const { client_id, region_id, site_id, building_id } = state.meterTemplate;
        console.log("client_id", client_id);

        if (client_id) {
            handleRegionDetails(client_id);
        }
        if (region_id) {
            handleSiteDetails(client_id, { region_id });
        }
        if (site_id) {
            handleBuildingDetails(client_id, { site_id });
        }
        if (building_id) {
            handleAccountDetails({ building_id });
        }
    }, [state.meterTemplate]);

    // const componentDidUpdate = (prevProps, prevState) => {
    // let { client_id, region_id, site_id, building_id } = state?.meterTemplate;

    // if (client_id !== prevState?.meterTemplate?.client_id) {
    //     client_id && handleRegionDetails(client_id);
    // }
    // if (region_id !== prevState?.meterTemplate?.region_id) {
    //     region_id &&  handleSiteDetails(client_id, { region_id });
    // }
    // if (site_id !== prevState?.meterTemplate?.site_id) {
    //     site_id &&  handleBuildingDetails(client_id, { site_id });
    // }setState
    // if (building_id !== prevState?.meterTemplate?.building_id) {
    //     building_id &&  handleAccountDetails({ building_id });
    // }
    // };

    const handleAccountDetails = async params => {
        // const { getMeterAccounts } = props;
        dispatch(getMeterAccounts(params));
        // let { accounts } = A.getAccountsListResponse;
    };

    const handleClientDetails = async () => {
        const clientID = localStorage.getItem("clientId");

        if (state.userRole === "client_user") {
            await dispatch(getMeterClientList());
            let { clients } = A.getClientListResponse;
            setState({
                ...state,
                clients: clients?.filter(item => item.id === clientID),
                meterTemplate: {
                    client_id: clientID
                }
            });
        } else {
            await dispatch(getMeterClientList());
            let { clients } = A.getClientListResponse;
            console.log("state", state);
            setState({
                ...state,
                clients
            });
        }
    };

    const handleRegionDetails = async id => {
        // const { getMeterRegionList } = props;
        dispatch(getMeterRegionList(id));
    };

    const handleSiteDetails = async (id, params) => {
        // const { getMeterSiteList } = props;
        dispatch(getMeterSiteList(id, params));
    };

    const handleBuildingDetails = async (id, params) => {
        // const { getMeterBuildingList } = props;
        dispatch(getMeterBuildingList(id, params));
        // let { buildings } = A.getBuildingListResponse;
    };

    let showErrorBorder;
    let errorParams;
    const validate = () => {
        const { meterTemplate } = state;
        errorParams = {
            client_id: false,
            region_id: false,
            site_id: false,
            building_id: false,
            account_id: false,
            // meter_type: false,
            meter: false,
            description: false
        };
        showErrorBorder = false;

        console.log("errorParams", errorParams);
        if (!meterTemplate.client_id || !meterTemplate.client_id.trim().length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.region_id || !meterTemplate.region_id.trim().length) {
            errorParams.region_id = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.site_id || !meterTemplate.site_id.trim().length) {
            errorParams.site_id = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.building_id || !meterTemplate.building_id.trim().length) {
            errorParams.building_id = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.account_id || !meterTemplate.account_id.trim().length) {
            errorParams.account_id = true;
            showErrorBorder = true;
        }
        // if (!meterTemplate.meter_type || !meterTemplate.meter_type.trim().length) {
        //     errorParams.meter_type = true;
        //     showErrorBorder = true;
        // }
        if (!meterTemplate.meter || !meterTemplate.meter.trim().length) {
            errorParams.meter = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.description || !meterTemplate.description.trim().length) {
            errorParams.description = true;
            showErrorBorder = true;
        }

        setState({
            ...state,
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    const addTemplate = async () => {
        const { meterTemplate } = state;
        console.log("first@@@@@@@@@@@");
        // const { handleAddMeterTemplate } = props;
        // if (validate()) {
        setState({
            ...state,
            isUploading: true
        });
        popBreadCrumpRecData();
        let tmpObj = { ...meterTemplate };
        delete tmpObj.account_type;
        delete tmpObj.account_description;
        dispatch(addMeterTemplate({ ...tmpObj }));
        // await handleAddMeterTemplate({ ...tmpObj });
        setState({
            ...state,
            isUploading: false
        });
        // }
    };

    const updateMeterTemplate = async () => {
        const { meterTemplate } = state;
        const meterTemplate_id = props.match.params.id;
        const { handleUpdateMeterTemplate } = props;
        if (validate()) {
            setState({
                ...state,
                isUploading: true
            });
            popBreadCrumpData();
            let tmpObj = { ...meterTemplate };
            delete tmpObj.account_type;
            delete tmpObj.account_description;
            await handleUpdateMeterTemplate(meterTemplate_id, tmpObj);
            setState({
                ...state,
                isUploading: false
            });
        }
    };

    const renderConfirmationModal = () => {
        const { showConfirmModal } = state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => setState({ ...state, showConfirmModal: false })}
                        onYes={clearForm}
                    />
                }
                onCancel={() => setState({ ...state, showConfirmModal: false })}
            />
        );
    };

    const cancelForm = () => {
        if (_.isEqual(state.initiaValues, state.meterTemplate)) {
            clearForm();
        } else {
            setState({
                ...state,
                showConfirmModal: true
            });
        }
    };

    const clearForm = async () => {
        const { history } = props;
        await setState({
            ...state,
            meterTemplate: {
                client_id: "",
                region_id: "",
                site_id: "",
                building_id: "",
                account_id: "",
                meter_type: "",
                meter: "",
                description: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/narrativeTemplate");
        popBreadCrumpData();
    };

    const isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };
    return (
        // <div>fgghj</div>
        <div>
            <div className="dtl-sec col-md-12">
                <div className="tab-dtl region-mng">
                    <ul>
                        <li className="active">Basic Details</li>
                    </ul>
                    <form autoComplete={"nope"}>
                        <div className="tab-active build-dtl">
                            <div className="otr-common-edit custom-col">
                                <div className="basic-otr">
                                    <div className="basic-dtl-otr basic-sec">
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Select Client *</h4>
                                                <div className="custom-selecbox">
                                                    <select
                                                        disabled={state.userRole === "client_user"}
                                                        autoComplete="nope"
                                                        className={`${
                                                            showErrorBorder && errorParams.client_id ? "error-border " : ""
                                                        }custom-selecbox form-control`}
                                                        onChange={e =>
                                                            setState({
                                                                ...state,
                                                                meterTemplate: {
                                                                    ...state.meterTemplate,
                                                                    client_id: e.target.value,
                                                                    region_id: ""
                                                                }
                                                            })
                                                        }
                                                        value={state?.meterTemplate?.client_id}
                                                    >
                                                        <option value="">Select</option>
                                                        {state?.clients?.map(item => (
                                                            <option value={item?.id}>{item?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Select Region *</h4>
                                                <div className="custom-selecbox">
                                                    <select
                                                        autoComplete="nope"
                                                        className={`${
                                                            showErrorBorder && errorParams.region_id ? "error-border " : ""
                                                        }custom-selecbox form-control`}
                                                        onChange={e =>
                                                            setState({
                                                                ...state,
                                                                meterTemplate: {
                                                                    ...state.meterTemplate,
                                                                    region_id: e.target.value,
                                                                    site_id: ""
                                                                }
                                                            })
                                                        }
                                                        value={state?.meterTemplate?.region_id}
                                                        disabled={!state?.regions?.length}
                                                    >
                                                        <option value="">Select</option>
                                                        {state?.regions?.map(item => (
                                                            <option value={item?.id}>{item?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Select Site *</h4>
                                                <div className="custom-selecbox">
                                                    <select
                                                        autoComplete="nope"
                                                        className={`${
                                                            showErrorBorder && errorParams.site_id ? "error-border " : ""
                                                        }custom-selecbox form-control`}
                                                        onChange={e =>
                                                            setState({
                                                                ...state,
                                                                meterTemplate: {
                                                                    ...state.meterTemplate,
                                                                    site_id: e.target.value,
                                                                    building_id: ""
                                                                }
                                                            })
                                                        }
                                                        value={state?.meterTemplate?.site_id}
                                                        disabled={!state?.sites?.length}
                                                    >
                                                        <option value="">Select</option>
                                                        {state?.sites?.map(item => (
                                                            <option value={item?.id}>{item?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Select Building *</h4>
                                                <div className="custom-selecbox">
                                                    <select
                                                        autoComplete="nope"
                                                        className={`${
                                                            showErrorBorder && errorParams.building_id ? "error-border " : ""
                                                        }custom-selecbox form-control`}
                                                        onChange={e =>
                                                            setState({
                                                                ...state,
                                                                meterTemplate: {
                                                                    ...state.meterTemplate,
                                                                    building_id: e.target.value,
                                                                    account_id: ""
                                                                }
                                                            })
                                                        }
                                                        value={state?.meterTemplate?.building_id}
                                                        disabled={!state?.buildings?.length}
                                                    >
                                                        <option value="">Select</option>
                                                        {state?.buildings?.map(item => (
                                                            <option value={item?.id}>
                                                                {item.name} {item.description ? `(${item.description})` : ""}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Select Account Number *</h4>
                                                <div className="custom-selecbox">
                                                    <select
                                                        autoComplete="nope"
                                                        className={`${
                                                            showErrorBorder && errorParams.account_id ? "error-border " : ""
                                                        }custom-selecbox form-control`}
                                                        onChange={e => {
                                                            let tempAcc = state?.accounts.find(state => state.id === e.target.value);

                                                            setState({
                                                                ...state,
                                                                meterTemplate: {
                                                                    ...state.meterTemplate,
                                                                    account_id: e.target.value,
                                                                    meter_type: tempAcc?.account_type,
                                                                    account_type: tempAcc?.account_type,
                                                                    account_description: tempAcc?.description
                                                                }
                                                            });
                                                        }}
                                                        value={state?.meterTemplate?.account_id}
                                                        disabled={!state?.accounts?.length}
                                                    >
                                                        <option value="">Select</option>
                                                        {state?.accounts?.map(item => (
                                                            <option value={item?.id}>
                                                                {item?.number}
                                                                {item?.account_type ? ` (${item?.account_type})` : null}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Account Type</h4>
                                                <input
                                                    disabled={true}
                                                    autoComplete="nope"
                                                    type="text"
                                                    className={`custom-input form-control`}
                                                    onChange={e =>
                                                        setState({
                                                            ...state,
                                                            meterTemplate: {
                                                                ...state.meterTemplate,
                                                                meter: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={state?.meterTemplate?.account_type}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Account Description</h4>
                                                <textarea
                                                    disabled={true}
                                                    autoComplete="nope"
                                                    type="text"
                                                    className={`custom-input form-control height-70px`}
                                                    value={state?.meterTemplate?.account_description}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Enter Meter Number *</h4>
                                                <input
                                                    autoComplete="nope"
                                                    type="text"
                                                    className={`${
                                                        showErrorBorder && errorParams.meter ? "error-border " : ""
                                                    }custom-input form-control`}
                                                    placeholder="Enter Meter Name"
                                                    onChange={e =>
                                                        setState({
                                                            ...state,
                                                            meterTemplate: {
                                                                ...state.meterTemplate,
                                                                meter: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={state?.meterTemplate?.meter}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Select Meter Type</h4>
                                                <div className="custom-selecbox">
                                                    <select
                                                        autoComplete="nope"
                                                        className={`${
                                                            showErrorBorder && errorParams.meter_type ? "error-border " : ""
                                                        }custom-selecbox form-control`}
                                                        // onChange={e =>
                                                        //     setState({
                                                        //         meterTemplate: {
                                                        //             ...meterTemplate,
                                                        //             meter_type: e.target.value
                                                        //         }
                                                        //     })
                                                        // }
                                                        disabled={true}
                                                        value={state?.meterTemplate?.meter_type}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Electricity">Electricity</option>
                                                        <option value="Gas">Gas</option>
                                                        <option value="Water">Water</option>
                                                        <option value="Sewer">Sewer</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-8 basic-box">
                                            <div className="codeOtr">
                                                <h4>Description *</h4>
                                                <textarea
                                                    autoComplete="nope"
                                                    placeholder="Notes"
                                                    className={`${
                                                        showErrorBorder && errorParams.description ? "error-border " : ""
                                                    }custom-input form-control height-70px`}
                                                    onChange={e =>
                                                        setState({
                                                            ...state,
                                                            meterTemplate: {
                                                                ...state.meterTemplate,
                                                                description: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={state?.meterTemplate?.description}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 text-right btnOtr edit-cmn-btn">
                                <button
                                    type="button"
                                    className="btn btn-secondary btnClr col-md-2 mr-1"
                                    data-dismiss="modal"
                                    onClick={() => cancelForm()}
                                >
                                    Cancel
                                </button>
                                {/* {selectedMeterTemplate ? (
                                    <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() =>  updateMeterTemplate()}>
                                        Update Meter Template
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() =>  addTemplate()}>
                                        Add Meter Value
                                    </button>
                                )} */}
                                <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => addTemplate()}>
                                    Add Meter Value
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MeterForm;
