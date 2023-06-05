import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import actions from "../actions";
import { connect } from "react-redux";
import { AssetSettingsEntities } from "../config";
import exclmIcon from "../../../assets/img/recom-icon.svg";
class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            data: {
                name: "",
                uniformat_level_1_id: null,
                uniformat_level_2_id: null,
                uniformat_level_3_id: null,
                uniformat_level_4_id: null,
                uniformat_level_5_id: null,
                uniformat_level_6_id: null,
                uniformat_level_6_description:null
            },
            errorParams: {
                name: false,
                uniformat_level_1_id: false,
                uniformat_level_2_id: false,
                uniformat_level_3_id: false,
                uniformat_level_4_id: false,
                uniformat_level_5_id: false,
                uniformat_level_6_id: null
            },
            initialValues: {},
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        if (this.props.selectedData) {
            await this.getInitialData();
        }
        if (
            settingType === "level2" ||
            settingType === "level3" ||
            settingType === "level4" ||
            settingType === "level5" ||
            settingType === "level6"
        ) {
            this.props.getDropdownList("uniformat_level_1s");
        }
        await this.setState({
            initialValues: this.state.data,
            isLoading: false
        });
    };

    getInitialData = async () => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        const {
            name,
            uniformat_level_1 = null,
            uniformat_level_2 = null,
            uniformat_level_3 = null,
            uniformat_level_4 = null,
            uniformat_level_5 = null,
            uniformat_level_6_description=null
        } = await this.props.getData();
        this.setState({ data: { ...this.state.data, name } });
        if (
            settingType === "level2" ||
            settingType === "level3" ||
            settingType === "level4" ||
            settingType === "level5" ||
            settingType === "level6"
        ) {
            this.setState({ data: { ...this.state.data, uniformat_level_1_id: uniformat_level_1?.id } });
        }
        if (settingType === "level3" || settingType === "level4" || settingType === "level5" || settingType === "level6") {
            this.props.getDropdownList("uniformat_level_2s", {
                uniformat_level_1_id: uniformat_level_1?.id
            });
            this.setState({ data: { ...this.state.data, uniformat_level_2_id: uniformat_level_2?.id } });
        }
        if (settingType === "level4" || settingType === "level5" || settingType === "level6") {
            this.props.getDropdownList("uniformat_level_3s", {
                uniformat_level_1_id: uniformat_level_1?.id,
                uniformat_level_2_id: uniformat_level_2?.id
            });
            this.setState({ data: { ...this.state.data, uniformat_level_3_id: uniformat_level_3?.id } });
        }
        if (settingType === "level5" || settingType === "level6") {
            this.props.getDropdownList("uniformat_level_4s", {
                uniformat_level_1_id: uniformat_level_1?.id,
                uniformat_level_2_id: uniformat_level_2?.id,
                uniformat_level_3_id: uniformat_level_3?.id
            });

            this.setState({ data: { ...this.state.data, uniformat_level_4_id: uniformat_level_4?.id } });
        }
        if (settingType === "level6") {
            this.props.getDropdownList("uniformat_level_5s", {
                uniformat_level_1_id: uniformat_level_1?.id,
                uniformat_level_2_id: uniformat_level_2?.id,
                uniformat_level_3_id: uniformat_level_3?.id,
                uniformat_level_4_id: uniformat_level_4?.id
            });

            this.setState({ data: { ...this.state.data, uniformat_level_5_id: uniformat_level_5?.id,uniformat_level_6_description:uniformat_level_6_description } });
        }
    };

    validate = () => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        const { data } = this.state;
        let errorParams = {
            name: false
        };
        let showErrorBorder = false;

        if (!data.name || !data.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (
            (settingType === "level2" ||
                settingType === "level3" ||
                settingType === "level4" ||
                settingType === "level5" ||
                settingType === "level6") &&
            !data?.uniformat_level_1_id?.trim()?.length
        ) {
            errorParams.uniformat_level_1_id = true;
            showErrorBorder = true;
        }
        if (
            (settingType === "level3" || settingType === "level4" || settingType === "level5" || settingType === "level6") &&
            !data?.uniformat_level_2_id?.trim()?.length
        ) {
            errorParams.uniformat_level_2_id = true;
            showErrorBorder = true;
        }
        if ((settingType === "level4" || settingType === "level5" || settingType === "level6") && !data?.uniformat_level_3_id?.trim()?.length) {
            errorParams.uniformat_level_3_id = true;
            showErrorBorder = true;
        }
        if ((settingType === "level5" || settingType === "level6") && !data?.uniformat_level_4_id?.trim()?.length) {
            errorParams.uniformat_level_4_id = true;
            showErrorBorder = true;
        }
        if (settingType === "level6" && !data?.uniformat_level_5_id?.trim()?.length) {
            errorParams.uniformat_level_5_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addData = async () => {
        let data = this.state.data;
        // filter only keys with value
        data = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== ""));
        const { handleAddData } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await handleAddData(data);
            this.setState({
                isUploading: false
            });
        }
    };

    updateData = async () => {
        let data = this.state.data;
        // filter only keys with value
        data = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== ""));
        const { handleUpdateData } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await handleUpdateData(data);
            this.setState({
                isUploading: false
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.clearForm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    cancelForm = () => {
        if (_.isEqual(this.state.initialValues, this.state.data)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { cancelForm } = this.props;
        await this.setState({
            data: {
                name: ""
            }
        });
        cancelForm();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleChange = async e => {
        const { name, value } = e.target;
        await this.setState({
            data: {
                ...this.state.data,
                [name]: value
            },
            errorParams: {
                ...this.state.errorParams,
                [name]: !value?.trim()?.length
            }
        });
    };

    handleLevel1Select = () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_2_id: "",
                uniformat_level_3_id: "",
                uniformat_level_4_id: "",
                uniformat_level_5_id: "",
                uniformat_level_6_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_2_id: true,
                uniformat_level_3_id: true,
                uniformat_level_4_id: true,
                uniformat_level_5_id: true,
                uniformat_level_6_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_2s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id
        });
    };

    handleLevel2Select = () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_3_id: "",
                uniformat_level_4_id: "",
                uniformat_level_5_id: "",
                uniformat_level_6_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_3_id: true,
                uniformat_level_4_id: true,
                uniformat_level_5_id: true,
                uniformat_level_6_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_3s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id
        });
    };
    handleLevel3Select = () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_4_id: "",
                uniformat_level_5_id: "",
                uniformat_level_6_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_4_id: true,
                uniformat_level_5_id: true,
                uniformat_level_6_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_4s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id
        });
    };
    handleLevel4Select = () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_5_id: "",
                uniformat_level_6_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_5_id: true,
                uniformat_level_6_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_5s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id,
            uniformat_level_4_id: this.state.data.uniformat_level_4_id
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { data, showErrorBorder, errorParams } = this.state;
        const {
            selectedData,
            match: {
                params: { settingType }
            },
            assetSettingsReducer: { dropDownList }
        } = this.props;
        console.log("data",data)
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">
                                {selectedData ? `Edit ${AssetSettingsEntities[settingType].name}` : `Add ${AssetSettingsEntities[settingType].name}`}
                            </li>
                        </ul>
                        <form autoComplete={"off"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Name *</h4>
                                                    <input
                                                        autoComplete={"off"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={data.name}
                                                        name="name"
                                                        onChange={this.handleChange}
                                                        placeholder="Enter Name"
                                                    />
                                                </div>
                                            </div>
                                            {(settingType === "level2" ||
                                                settingType === "level3" ||
                                                settingType === "level4" ||
                                                settingType === "level5" ||
                                                settingType === "level6") && (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Uniformat level 1</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"off"}
                                                                className={`${
                                                                    showErrorBorder && errorParams.uniformat_level_1_id ? "error-border " : ""
                                                                }custom-selecbox form-control`}
                                                                name="uniformat_level_1_id"
                                                                onChange={async e => {
                                                                    await this.handleChange(e);
                                                                    if (settingType !== "level2") {
                                                                        this.handleLevel1Select();
                                                                    }
                                                                }}
                                                                value={data.uniformat_level_1_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {dropDownList["uniformat_level_1s"]?.length
                                                                    ? dropDownList["uniformat_level_1s"].map((item, i) => (
                                                                          <option value={item.id} key={i}>
                                                                              {item.name}
                                                                          </option>
                                                                      ))
                                                                    : null}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {(settingType === "level3" ||
                                                settingType === "level4" ||
                                                settingType === "level5" ||
                                                settingType === "level6") && (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Uniformat level 2</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"off"}
                                                                className={`${
                                                                    showErrorBorder && errorParams.uniformat_level_2_id ? "error-border " : ""
                                                                }custom-selecbox form-control`}
                                                                name="uniformat_level_2_id"
                                                                onChange={async e => {
                                                                    await this.handleChange(e);
                                                                    if (settingType !== "level3") {
                                                                        this.handleLevel2Select();
                                                                    }
                                                                }}
                                                                value={data.uniformat_level_2_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {data.uniformat_level_1_id && dropDownList["uniformat_level_2s"]?.length
                                                                    ? dropDownList["uniformat_level_2s"].map((item, i) => (
                                                                          <option value={item.id} key={i}>
                                                                              {item.name}
                                                                          </option>
                                                                      ))
                                                                    : null}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {(settingType === "level4" || settingType === "level5" || settingType === "level6") && (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Uniformat level 3</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"off"}
                                                                className={`${
                                                                    showErrorBorder && errorParams.uniformat_level_3_id ? "error-border " : ""
                                                                }custom-selecbox form-control`}
                                                                name="uniformat_level_3_id"
                                                                onChange={async e => {
                                                                    await this.handleChange(e);
                                                                    if (settingType !== "level4") {
                                                                        this.handleLevel3Select();
                                                                    }
                                                                }}
                                                                value={data.uniformat_level_3_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {data.uniformat_level_2_id && dropDownList["uniformat_level_3s"]?.length
                                                                    ? dropDownList["uniformat_level_3s"].map((item, i) => (
                                                                          <option value={item.id} key={i}>
                                                                              {item.name}
                                                                          </option>
                                                                      ))
                                                                    : null}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {(settingType === "level5" || settingType === "level6") && (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Uniformat level 4</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"off"}
                                                                className={`${
                                                                    showErrorBorder && errorParams.uniformat_level_4_id ? "error-border " : ""
                                                                }custom-selecbox form-control`}
                                                                name="uniformat_level_4_id"
                                                                onChange={async e => {
                                                                    await this.handleChange(e);
                                                                    if (settingType !== "level5") {
                                                                        this.handleLevel4Select();
                                                                    }
                                                                }}
                                                                value={data.uniformat_level_4_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {data.uniformat_level_3_id && dropDownList["uniformat_level_4s"]?.length
                                                                    ? dropDownList["uniformat_level_4s"].map((item, i) => (
                                                                          <option value={item.id} key={i}>
                                                                              {item.name}
                                                                          </option>
                                                                      ))
                                                                    : null}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {settingType === "level6" && (
                                                <>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Uniformat level 5</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"off"}
                                                                className={`${
                                                                    showErrorBorder && errorParams.uniformat_level_5_id ? "error-border " : ""
                                                                }custom-selecbox form-control`}
                                                                name="uniformat_level_5_id"
                                                                onChange={async e => {
                                                                    this.handleChange(e);
                                                                }}
                                                                value={data.uniformat_level_5_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {data.uniformat_level_4_id && dropDownList["uniformat_level_5s"]?.length
                                                                    ? dropDownList["uniformat_level_5s"].map((item, i) => (
                                                                          <option value={item.id} key={i}>
                                                                              {item.name}
                                                                          </option>
                                                                      ))
                                                                    : null}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                   <div className="col-md-4 basic-box">
                                                   <div className="codeOtr">
                                                       <h4>Uniformat Level 6 Description</h4>
                                                       <input
                                                           autoComplete={"off"}
                                                           type="text"
                                                           className="custom-input form-control"
                                                           value={data?.uniformat_level_6_description}
                                                           name="uniformat_level_6_description"
                                                           onChange={this.handleChange}
                                                           placeholder="Uniformat Level 6 Description"
                                                       />
                                                   </div>
                                               </div>
                                               </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 text-right btnOtr edit-cmn-btn">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btnClr col-md-2 mr-1"
                                        data-dismiss="modal"
                                        onClick={() => this.cancelForm()}
                                    >
                                        Cancel
                                    </button>
                                    {selectedData ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateData()}>
                                            Update
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addData()}>
                                            Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { assetSettingsReducer } = state;
    return { assetSettingsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Form)
);
