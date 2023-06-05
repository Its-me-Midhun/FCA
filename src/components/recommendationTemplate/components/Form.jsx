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
import NumberFormat from "react-number-format";
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
    fillEmptyBlocks :true,
    removePlugins: ["Title", "ListStyle"],
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
            recommendationTemplate: {
                name: "",
                text_format: "",
                description: "",
                cost_per_unit: "",
                unit: ""
            },
            errorParams: {
                name: "",
                text_format: ""
            },
            initiaValues: {},
            selectedRecommendationTemplate: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const { selectedRecommendationTemplate } = this.props;
        if (selectedRecommendationTemplate) {
            await this.props.getDataById(selectedRecommendationTemplate);
            const {
                recommendationTemplateReducer: {
                    getRecommendationTemplateByIdResponse: { success, name, text_format, description, unit, cost_per_unit }
                }
            } = this.props;

            if (success) {
                await this.setState({
                    recommendationTemplate: {
                        name,
                        text_format,
                        description,
                        unit,
                        cost_per_unit
                    }
                });
            }
        }

        await this.setState({
            initiaValues: this.state.recommendationTemplate,
            isLoading: false
        });
    };

    validate = () => {
        const { recommendationTemplate } = this.state;
        let errorParams = {
            name: false,
            text_format: false
        };
        let showErrorBorder = false;

        if (!recommendationTemplate.name || !recommendationTemplate.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!recommendationTemplate.text_format || !recommendationTemplate.text_format.trim().length) {
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

    addRecommendationTemplate = async () => {
        const { recommendationTemplate } = this.state;
        const { handleAddRecommendationTemplate } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddRecommendationTemplate(recommendationTemplate);
            this.setState({
                isUploading: false
            });
        }
    };

    updateRecommendationTemplate = async () => {
        const { recommendationTemplate } = this.state;
        const recommendationTemplate_id = this.props.match.params.id;
        const { handleUpdateRecommendationTemplate } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateRecommendationTemplate(recommendationTemplate_id, recommendationTemplate);
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
        if (_.isEqual(this.state.initiaValues, this.state.recommendationTemplate)) {
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
            recommendationTemplate: {
                name: "",
                comments: ""
            }
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/recommendationTemplate");
        popBreadCrumpData();
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
            recommendationTemplate: {
                ...this.state.recommendationTemplate,
                description: data
            }
        })
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { recommendationTemplate, showErrorBorder, errorParams } = this.state;
        const { selectedRecommendationTemplate } = this.props;

        return (
            <React.Fragment>
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
                                                    <h4>Recommendation Template Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={recommendationTemplate.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                recommendationTemplate: {
                                                                    ...recommendationTemplate,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Recommendation Template Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Cost Per Unit</h4>
                                                    <NumberFormat
                                                        displayType="input"
                                                        prefix="$"
                                                        thousandSeparator={true}
                                                        autoComplete={"nope"}
                                                        placeholder="Cost Per Unit"
                                                        className="custom-input form-control"
                                                        value={recommendationTemplate.cost_per_unit}
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            this.setState({
                                                                recommendationTemplate: {
                                                                    ...recommendationTemplate,
                                                                    cost_per_unit: value
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Unit</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`custom-input form-control`}
                                                        value={recommendationTemplate.unit}
                                                        onChange={e =>
                                                            this.setState({
                                                                recommendationTemplate: {
                                                                    ...recommendationTemplate,
                                                                    unit: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Unit"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 basic-box comment-form template-field">
                                                <div className="codeOtr">
                                                    <h4>Template *</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Template"
                                                        className={`${
                                                            showErrorBorder && errorParams.text_format ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={recommendationTemplate.text_format}
                                                        onChange={e =>
                                                            this.setState({
                                                                recommendationTemplate: {
                                                                    ...recommendationTemplate,
                                                                    text_format: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 basic-box comment-form template-field">
                                                <div className="codeOtr">
                                                    <h4>Report Notes</h4>
                                                    {/* <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Report Notes"
                                                        className={`custom-input form-control`}
                                                        value={recommendationTemplate.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                recommendationTemplate: {
                                                                    ...recommendationTemplate,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
                                                    /> */}
                                                    <CKEditor
                                                        editor={Editor}
                                                        config={editorConfiguration}
                                                        id="recommendation-note-template"
                                                        data={recommendationTemplate.description || ""}
                                                        
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
                                    {selectedRecommendationTemplate ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-3"
                                            onClick={() => this.updateRecommendationTemplate()}
                                        >
                                            Update Recommendation Template
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-3"
                                            onClick={() => this.addRecommendationTemplate()}
                                        >
                                            Add Recommendation Template
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
    const { projectReducer, buildingReducer, recommendationTemplateReducer } = state;
    return { projectReducer, buildingReducer, recommendationTemplateReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
