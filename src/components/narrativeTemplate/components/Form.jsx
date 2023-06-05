import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import projectActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData, findPrevPathFromBreadCrump } from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            consultancies: "",
            consultancy_users: [],
            client_users: [],
            buildings: [],
            narrativeTemplate: {
                name: "",
                text_format: "",
                description: ""
            },
            errorParams: {
                name: "",
                text_format: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            projectList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],

            selectedNarrativeTemplate: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            selectedBuilding: qs.parse(this.props.location.search.bid) || null,
            initialConsultancyUsers: [],
            initialClientUsers: []
        };
    }

    componentDidMount = async () => {
        const { selectedNarrativeTemplate } = this.props;
        if (selectedNarrativeTemplate) {
            await this.props.getDataById(selectedNarrativeTemplate);
            const {
                narrativeTemplateReducer: {
                    getNarrativeTemplateByIdResponse: { success, name, text_format, description }
                }
            } = this.props;

            if (success) {
                await this.setState({
                    narrativeTemplate: {
                        name,
                        text_format,
                        description
                    }
                });
            }
        }

        await this.setState({
            initiaValues: this.state.narrativeTemplate,
            isLoading: false
        });
    };

    validate = () => {
        const { narrativeTemplate } = this.state;
        let errorParams = {
            name: false,
            text_format: false
        };
        let showErrorBorder = false;

        if (!narrativeTemplate.name || !narrativeTemplate.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!narrativeTemplate.text_format || !narrativeTemplate.text_format.trim().length) {
            errorParams.text_format = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addNarrativeTemplate = async () => {
        const { narrativeTemplate } = this.state;
        const { handleAddNarrativeTemplate } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddNarrativeTemplate(narrativeTemplate);
            this.setState({
                isUploading: false
            });
        }
    };

    updateNarrativeTemplate = async () => {
        const { narrativeTemplate } = this.state;
        const narrativeTemplate_id = this.props.match.params.id;
        const { handleUpdateNarrativeTemplate } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateNarrativeTemplate(narrativeTemplate_id, narrativeTemplate);
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
        if (_.isEqual(this.state.initiaValues, this.state.narrativeTemplate)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { history } = this.props;
        await this.setState({
            narrativeTemplate: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/narrativeTemplate");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleConsultancySelect = async e => {
        const { narrativeTemplate } = this.state;
        if (narrativeTemplate.client_id && narrativeTemplate.consultancy_id) {
            await this.props.getAllBuildingsDropdown({ client_id: narrativeTemplate.client_id, consultancy_id: narrativeTemplate.consultancy_id });
        }

        await this.props.getAllClientss({ consultancy_id: narrativeTemplate.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: narrativeTemplate.consultancy_id });
        const {
            narrativeTemplateReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            narrativeTemplate: {
                ...narrativeTemplate,
                client_id: "",
                client_user_ids: []
            }
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { narrativeTemplate, showErrorBorder, errorParams } = this.state;
        const { selectedNarrativeTemplate } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedNarrativeTemplate ? "Edit Narrative Template" : "Add Narrative Template"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-6 basic-box">
                                                <div className="codeOtr">
                                                    <h4>NarrativeTemplate Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={narrativeTemplate.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                narrativeTemplate: {
                                                                    ...narrativeTemplate,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter NarrativeTemplate Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Description</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Comments"
                                                        className="custom-input form-control"
                                                        value={narrativeTemplate.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                narrativeTemplate: {
                                                                    ...narrativeTemplate,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12 basic-box comment-form template-field">
                                                <div className="codeOtr">
                                                    <h4>Template *</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Template"
                                                        className={`${
                                                            showErrorBorder && errorParams.text_format ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={narrativeTemplate.text_format}
                                                        onChange={e =>
                                                            this.setState({
                                                                narrativeTemplate: {
                                                                    ...narrativeTemplate,
                                                                    text_format: e.target.value
                                                                }
                                                            })
                                                        }
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
                                        onClick={() => this.cancelForm()}
                                    >
                                        Cancel
                                    </button>
                                    {selectedNarrativeTemplate ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2"
                                            onClick={() => this.updateNarrativeTemplate()}
                                        >
                                            Update Narrative Template
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2"
                                            onClick={() => this.addNarrativeTemplate()}
                                        >
                                            Add Narrative Template
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
    const { projectReducer, buildingReducer, narrativeTemplateReducer } = state;
    return { projectReducer, buildingReducer, narrativeTemplateReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
