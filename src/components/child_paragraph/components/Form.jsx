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
            buildings: [],
            childParagraph: {
                name: "",
                special_report_id: "",
                report_paragraph_id: "",
                note: "",
                description: ""
            },
            // 110124e2-44ae-4fe0-9438-b294e2195009
            errorParams: {
                name: "",
                note: "",
                special_report_id: "",
                report_paragraph_id: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            projectList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],

            selectedChildParagraph: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            selectedBuilding: qs.parse(this.props.location.search.bid) || null,
            initialConsultancyUsers: [],
            initialClientUsers: [],
            special_reports: [],
            report_paragraphs: []
        };
    }

    componentDidMount = async () => {
        const { selectedChildParagraph } = this.props;
        await this.getSpecialReportsDropdown();
        if (selectedChildParagraph) {
            await this.props.getDataById(selectedChildParagraph);
            const {
                childParagraphReducer: {
                    getChildParagraphByIdResponse: { success, name, special_report, report_paragraph, note, description }
                }
            } = this.props;

            if (success) {
                await this.getReportParagraphsDropdown(special_report?.id || null);
                await this.setState({
                    childParagraph: {
                        name,
                        special_report_id: special_report?.id || null,
                        report_paragraph_id: report_paragraph?.id || null,
                        note,
                        description
                    }
                });
            }
        }
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        if (dynamicUrl.split("_").length && dynamicUrl.split("_")[0] === "/child") {
            localStorage.setItem("spReportEntityData", "");
        }

        await this.setState({
            initiaValues: this.state.childParagraph,
            isLoading: false
        });
    };

    getSpecialReportsDropdown = async () => {
        await this.props.getSpecialReportsDropdown();
        const {
            childParagraphReducer: {
                getSpecialReportsDropdownResponse: { success, list }
            }
        } = this.props;

        if (success) {
            await this.setState({
                special_reports: list
            });
        }
    };

    getReportParagraphsDropdown = async id => {
        await this.props.getReportParagraphsDropdown(id);
        const {
            childParagraphReducer: {
                getReportParagraphsDropdownResponse: { success, list }
            }
        } = this.props;

        if (success) {
            await this.setState({
                report_paragraphs: list
            });
        }
    };

    validate = () => {
        const { childParagraph } = this.state;
        let errorParams = {
            name: false,
            note: false,
            special_report_id: false,
            report_paragraph_id: false
        };
        let showErrorBorder = false;

        if (!childParagraph.name || !childParagraph.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!childParagraph.note || !childParagraph.note.trim().length) {
            errorParams.note = true;
            showErrorBorder = true;
        }
        if (!childParagraph.special_report_id || !childParagraph.special_report_id.trim().length) {
            errorParams.special_report_id = true;
            showErrorBorder = true;
        }
        if (!childParagraph.report_paragraph_id || !childParagraph.report_paragraph_id.trim().length) {
            errorParams.report_paragraph_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addChildParagraph = async () => {
        const { childParagraph } = this.state;
        const { handleAddChildParagraph } = this.props;

        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let tempChildParagraph = {
            name: childParagraph.name,
            note: childParagraph.note,
            description: childParagraph.description
        };
        if (dynamicUrl.split("_").length && dynamicUrl.split("_")[0] === "/child") {
            tempChildParagraph.special_report_id = childParagraph.special_report_id;
            tempChildParagraph.report_paragraph_id = childParagraph.report_paragraph_id;
        } else if (dynamicUrl.split("_").length) {
            let entityType = dynamicUrl.split("_")[0].replace("/", "");
            tempChildParagraph[`${entityType}_special_report_id`] = childParagraph.special_report_id;
            tempChildParagraph[`${entityType}_report_paragraph_id`] = childParagraph.report_paragraph_id;
        }

        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddChildParagraph(tempChildParagraph);
            this.setState({
                isUploading: false
            });
        }
    };

    updateChildParagraph = async () => {
        const { childParagraph } = this.state;
        const childParagraph_id = this.props.match.params.id;
        const { handleUpdateChildParagraph } = this.props;

        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let tempChildParagraph = {
            name: childParagraph.name,
            note: childParagraph.note,
            description: childParagraph.description
        };
        if (dynamicUrl.split("_").length && dynamicUrl.split("_")[0] === "/child") {
            tempChildParagraph.special_report_id = childParagraph.special_report_id;
            tempChildParagraph.report_paragraph_id = childParagraph.report_paragraph_id;
        } else if (dynamicUrl.split("_").length) {
            let entityType = dynamicUrl.split("_")[0].replace("/", "");
            tempChildParagraph[`${entityType}_special_report_id`] = childParagraph.special_report_id;
            tempChildParagraph[`${entityType}_report_paragraph_id`] = childParagraph.report_paragraph_id;
        }

        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateChildParagraph(childParagraph_id, tempChildParagraph);
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
        if (_.isEqual(this.state.initiaValues, this.state.childParagraph)) {
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
            childParagraph: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/childParagraph");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { childParagraph, showErrorBorder, errorParams, special_reports = [], report_paragraphs = [] } = this.state;
        const { selectedChildParagraph } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedChildParagraph ? "Edit Child Paragraph" : "Add Child Paragraph"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Child Paragraph Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={childParagraph.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                childParagraph: {
                                                                    ...childParagraph,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Child Paragraph Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Special Report *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className={`${
                                                                showErrorBorder && errorParams.special_report_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    childParagraph: {
                                                                        ...childParagraph,
                                                                        special_report_id: e.target.value
                                                                    }
                                                                });
                                                                await this.getReportParagraphsDropdown(this.state.childParagraph.special_report_id);
                                                            }}
                                                            value={childParagraph.special_report_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {special_reports && special_reports.length
                                                                ? special_reports.map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Report Paragraph *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className={`${
                                                                showErrorBorder && errorParams.report_paragraph_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    childParagraph: {
                                                                        ...childParagraph,
                                                                        report_paragraph_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                            value={childParagraph.report_paragraph_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {report_paragraphs && report_paragraphs.length
                                                                ? report_paragraphs.map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Description</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Description"
                                                        className="custom-input form-control"
                                                        value={childParagraph.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                childParagraph: {
                                                                    ...childParagraph,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12 basic-box comment-form template-field">
                                                <div className="codeOtr">
                                                    <h4>Note *</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Note"
                                                        className={`${
                                                            showErrorBorder && errorParams.note ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={childParagraph.note}
                                                        onChange={e =>
                                                            this.setState({
                                                                childParagraph: {
                                                                    ...childParagraph,
                                                                    note: e.target.value
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
                                    {selectedChildParagraph ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2"
                                            onClick={() => this.updateChildParagraph()}
                                        >
                                            Update Child Paragraph
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addChildParagraph()}>
                                            Add Child Paragraph
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
    const { projectReducer, buildingReducer, childParagraphReducer } = state;
    return { projectReducer, buildingReducer, childParagraphReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
