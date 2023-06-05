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
class CategoryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            data: {
                name: "",
                client_id: "",
                main_category_id: "",
                sub_category_1_id: "",
                sub_category_2_id: "",
                sub_category_3_id: "",
                subcategory2_description:""
            },
            errorParams: {
                name: false,
                client_id: false,
                main_category_id: false,
                sub_category_1_id: false,
                sub_category_2_id: false,
                sub_category_3_id: false
            },
            initialValues: {},
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        if (this.props.selectedData) {
            await this.getInitialData();
        }
        this.props.getDropdownList("clients", { order: { "clients.name": "asc" } });
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
        const { name, client, main_category = null, sub_category_1 = null, sub_category_2 = null ,subcategory2_description=null} = await this.props.getData();
        this.setState({ data: { ...this.state.data, name, client_id: client?.id } });
        if (settingType === "subCategory1" || settingType === "subCategory2" || settingType === "subCategory3") {
            this.props.getDropdownList("main_categories", {
                client_id: client?.id
            });
            this.setState({ data: { ...this.state.data, main_category_id: main_category?.id } });
        }
        if (settingType === "subCategory2" || settingType === "subCategory3") {
            this.props.getDropdownList("sub_category_1s", {
                client_id: client?.id,
                main_category_id: main_category?.id
            });
            this.setState({ data: { ...this.state.data, sub_category_1_id: sub_category_1?.id ,subcategory2_description:subcategory2_description} });
        }
        if (settingType === "subCategory3") {
            this.props.getDropdownList("sub_category_2s", {
                client_id: client?.id,
                main_category_id: main_category?.id,
                sub_category_1_id: sub_category_1?.id
            });
            this.setState({ data: { ...this.state.data, sub_category_2_id: sub_category_2?.id } });
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

        if (!data.name?.trim()?.length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!data.client_id?.trim()?.length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        if (
            (settingType === "subCategory1" || settingType === "subCategory2" || settingType === "subCategory3") &&
            !data?.main_category_id?.trim()?.length
        ) {
            errorParams.main_category_id = true;
            showErrorBorder = true;
        }
        if ((settingType === "subCategory2" || settingType === "subCategory3") && !data?.sub_category_1_id?.trim()?.length) {
            errorParams.sub_category_1_id = true;
            showErrorBorder = true;
        }
        if (settingType === "subCategory3" && !data?.sub_category_2_id?.trim()?.length) {
            errorParams.sub_category_2_id = true;
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

    handleChange = async e => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
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
        if (settingType !== "mainCategory" && name === "client_id") {
            this.handleClientSelect();
        } else if (settingType !== "subCategory1" && name === "main_category_id") {
            this.handleMainCategorySelect();
        } else if (settingType !== "subCategory2" && name === "sub_category_1_id") {
            this.handleSubCategory1Select();
        }
    };

    handleClientSelect = () => {
        this.setState({
            data: {
                ...this.state.data,
                main_category_id: "",
                sub_category_1_id: "",
                sub_category_2_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                main_category_id: false,
                sub_category_1_id: false,
                sub_category_2_id: false
            }
        });
        this.props.getDropdownList("main_categories", {
            client_id: this.state.data.client_id
        });
    };

    handleMainCategorySelect = () => {
        this.setState({
            data: {
                ...this.state.data,
                sub_category_1_id: "",
                sub_category_2_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                sub_category_1_id: false,
                sub_category_2_id: false
            }
        });
        this.props.getDropdownList("sub_category_1s", {
            client_id: this.state.data.client_id,
            main_category_id: this.state.data.main_category_id
        });
    };

    handleSubCategory1Select = () => {
        this.setState({
            data: {
                ...this.state.data,
                sub_category_2_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                sub_category_2_id: false
            }
        });
        this.props.getDropdownList("sub_category_2s", {
            client_id: this.state.data.client_id,
            main_category_id: this.state.data.main_category_id,
            sub_category_1_id: this.state.data.sub_category_1_id
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
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
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
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Client *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete={"nope"}
                                                            className={`${
                                                                showErrorBorder && errorParams.client_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            name="client_id"
                                                            onChange={this.handleChange}
                                                            value={data.client_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {dropDownList["clients"]?.length
                                                                ? dropDownList["clients"].map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {(settingType === "subCategory1" || settingType === "subCategory2" || settingType === "subCategory3") && (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Main Category *</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"nope"}
                                                                className={`${
                                                                    showErrorBorder && errorParams.main_category_id ? "error-border " : ""
                                                                }custom-selecbox form-control`}
                                                                name="main_category_id"
                                                                onChange={this.handleChange}
                                                                value={data.main_category_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {data.client_id && dropDownList["main_categories"]?.length
                                                                    ? dropDownList["main_categories"].map((item, i) => (
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
                                            {(settingType === "subCategory2" || settingType === "subCategory3") && (
                                                <>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Sub Category 1 *</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"nope"}
                                                                className={`${
                                                                    showErrorBorder && errorParams.sub_category_1_id ? "error-border " : ""
                                                                }custom-selecbox form-control`}
                                                                name="sub_category_1_id"
                                                                onChange={this.handleChange}
                                                                value={data.sub_category_1_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {data.main_category_id && dropDownList["sub_category_1s"]?.length
                                                                    ? dropDownList["sub_category_1s"].map((item, i) => (
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
                                                     <h4>Sub Category 2 Description</h4>
                                                     <input
                                                         autoComplete={"nope"}
                                                         type="text"
                                                         className="custom-input form-control"
                                                         value={data?.subcategory2_description}
                                                         name="subcategory2_description"
                                                         onChange={this.handleChange}
                                                         placeholder="Enter Sub Category Description"
                                                     />
                                                 </div>
                                             </div>
                                             </>
                                            )}
                                            {settingType === "subCategory3" && (
                                                <>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Sub Category 2 *</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"nope"}
                                                                className={`${
                                                                    showErrorBorder && errorParams.sub_category_2_id ? "error-border " : ""
                                                                }custom-selecbox form-control`}
                                                                name="sub_category_2_id"
                                                                onChange={this.handleChange}
                                                                value={data.sub_category_2_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {data.sub_category_1_id && dropDownList["sub_category_2s"]?.length
                                                                    ? dropDownList["sub_category_2s"].map((item, i) => (
                                                                          <option value={item.id} key={i}>
                                                                              {item.name}
                                                                          </option>
                                                                      ))
                                                                    : null}
                                                            </select>
                                                        </div>
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
    })(CategoryForm)
);
