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
import { popBreadCrumpData, findPrevPathFromBreadCrump, convertToXML, removeAllTags } from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
const editorConfiguration = {
    toolbar: [
        // "fontFamily",
        // "fontSize",
        // "|",
        "bold",
        "italic",
        "underLine",
        "|",
        "alignment:left",
        "alignment:right",
        "alignment:center",
        "alignment:justify",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        // "outdent",
        // "indent",
        "highlight",
        "|",
        "undo",
        "redo"
        // "heading"
    ],
    removePlugins: ["Title", "ListStyle"],
    fillEmptyBlocks :false,
    alignment: {
        options: ["left", "right", "center", "justify"]
    },
    highlight: {
        options: [
            { model: "yellowMarker", class: "marker-yellow", title: "Yellow marker", color: "var(--ck-highlight-marker-yellow)", type: "marker" },
            { model: "greenMarker", class: "marker-green", title: "Green marker", color: "#32CD32", type: "marker" },
            { model: "pinkMarker", class: "marker-pink", title: "Pink marker", color: "#FF00FF", type: "marker" },
            { model: "blueMarker", class: "marker-blue", title: "Blue marker", color: "#0000FF", type: "marker" }
        ]
    },
    placeholder: "Type Here..."
};

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
            reportNoteTemplate: {
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

            selectedReportNoteTemplate: props.match.params.id,
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
        const { selectedReportNoteTemplate } = this.props;
        if (selectedReportNoteTemplate) {
            await this.props.getDataById(selectedReportNoteTemplate);
            const {
                reportNoteTemplateReducer: {
                    getReportNoteTemplateByIdResponse: { success, name, text_format, description }
                }
            } = this.props;

            if (success) {
                await this.setState({
                    reportNoteTemplate: {
                        name,
                        text_format,
                        description
                    }
                });
            }
        }

        await this.setState({
            initiaValues: this.state.reportNoteTemplate,
            isLoading: false
        });
    };

    validate = () => {
        const { reportNoteTemplate } = this.state;
        let errorParams = {
            name: false,
            text_format: false
        };
        let showErrorBorder = false;

        if (!reportNoteTemplate.name || !reportNoteTemplate.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!reportNoteTemplate.text_format || !reportNoteTemplate.text_format.trim().length) {
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

    addReportNoteTemplate = async () => {
        const { reportNoteTemplate } = this.state;
        const { handleAddReportNoteTemplate } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddReportNoteTemplate(reportNoteTemplate);
            this.setState({
                isUploading: false
            });
        }
    };

    updateReportNoteTemplate = async () => {
        const { reportNoteTemplate } = this.state;
        const reportNoteTemplate_id = this.props.match.params.id;
        const { handleUpdateReportNoteTemplate } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateReportNoteTemplate(reportNoteTemplate_id, reportNoteTemplate);
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
        if (_.isEqual(this.state.initiaValues, this.state.reportNoteTemplate)) {
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
            reportNoteTemplate: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/reportNoteTemplate");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleConsultancySelect = async e => {
        const { reportNoteTemplate } = this.state;
        if (reportNoteTemplate.client_id && reportNoteTemplate.consultancy_id) {
            await this.props.getAllBuildingsDropdown({ client_id: reportNoteTemplate.client_id, consultancy_id: reportNoteTemplate.consultancy_id });
        }

        await this.props.getAllClientss({ consultancy_id: reportNoteTemplate.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: reportNoteTemplate.consultancy_id });
        const {
            reportNoteTemplateReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            reportNoteTemplate: {
                ...reportNoteTemplate,
                client_id: "",
                client_user_ids: []
            }
        });
    };

    handleChangeNote = data => {
        let note_xml = convertToXML([data], 1);
        let removedAllTags = removeAllTags(data);
        // this.setState({
        //     project: {
        //         ...this.state.project,
        //         notes: removedAllTags,
        //         note_xml: note_xml,
        //         note_html: data
        //     }
        // });
        this.setState({
            reportNoteTemplate: {
                ...this.state.reportNoteTemplate,
                text_format: data
            }
        })
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { reportNoteTemplate, showErrorBorder, errorParams } = this.state;
        const { selectedReportNoteTemplate } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedReportNoteTemplate ? "Edit Report Note Template" : "Add Report Note Template"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-6 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Report Note Template Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={reportNoteTemplate.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                reportNoteTemplate: {
                                                                    ...reportNoteTemplate,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Report Note Template Name"
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
                                                        value={reportNoteTemplate.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                reportNoteTemplate: {
                                                                    ...reportNoteTemplate,
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
                                                    {/* <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Template"
                                                        className={`${
                                                            showErrorBorder && errorParams.text_format ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={reportNoteTemplate.text_format}
                                                        onChange={e =>
                                                            this.setState({
                                                                reportNoteTemplate: {
                                                                    ...reportNoteTemplate,
                                                                    text_format: e.target.value
                                                                }
                                                            })
                                                        }
                                                    /> */}
                                                      <CKEditor
                                                                editor={Editor}
                                                                config={editorConfiguration}
                                                                id="report-note-template"
                                                                data={reportNoteTemplate.text_format || ""}
                                                                onChange={(event, editor) => {
                                                                    const data = editor.getData();
                                                                    this.handleChangeNote(data);
                                                                }}
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
                                    {selectedReportNoteTemplate ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2 btn-rpt-note"
                                            onClick={() => this.updateReportNoteTemplate()}
                                        >
                                            Update ReportNote Template
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2 btn-rpt-note"
                                            onClick={() => this.addReportNoteTemplate()}
                                        >
                                            Add ReportNote Template
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
    const { projectReducer, buildingReducer, reportNoteTemplateReducer } = state;
    return { projectReducer, buildingReducer, reportNoteTemplateReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
