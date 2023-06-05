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
            specialReport: {
                name: "",
                note: "",
                description: ""
            },
            errorParams: {
                name: "",
                note: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            projectList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],

            selectedSpecialReport: props.match.params.id,
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
        const { selectedSpecialReport } = this.props;
        if (selectedSpecialReport) {
            await this.props.getDataById(selectedSpecialReport);
            const {
                specialReportReducer: {
                    getSpecialReportByIdResponse: { success, name, note, description }
                }
            } = this.props;

            if (success) {
                await this.setState({
                    specialReport: {
                        name,
                        note,
                        description
                    }
                });
            }
        }

        await this.setState({
            initiaValues: this.state.specialReport,
            isLoading: false
        });
    };

    validate = () => {
        const { specialReport } = this.state;
        let errorParams = {
            name: false,
            note: false
        };
        let showErrorBorder = false;

        if (!specialReport.name || !specialReport.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!specialReport.note || !specialReport.note.trim().length) {
            errorParams.note = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addSpecialReport = async () => {
        const { specialReport } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        if (dynamicUrl === "/special_reports") {
            await this.setState({
                specialReport: {
                    ...specialReport,
                    project: false,
                    region: false,
                    site: false,
                    building: false
                }
            });
        }
        const { handleAddSpecialReport } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddSpecialReport(this.state.specialReport);
            this.setState({
                isUploading: false
            });
        }
    };

    updateSpecialReport = async () => {
        const { specialReport } = this.state;
        const specialReport_id = this.props.match.params.id;
        const { handleUpdateSpecialReport } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateSpecialReport(specialReport_id, specialReport);
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
        if (_.isEqual(this.state.initiaValues, this.state.specialReport)) {
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
            specialReport: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/specialReport");
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

        const { specialReport, showErrorBorder, errorParams } = this.state;
        const { selectedSpecialReport } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">Basic Details</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-6 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Special Report Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={specialReport.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                specialReport: {
                                                                    ...specialReport,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Special Report Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Description</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Description"
                                                        className="custom-input form-control"
                                                        value={specialReport.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                specialReport: {
                                                                    ...specialReport,
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
                                                        value={specialReport.note}
                                                        onChange={e =>
                                                            this.setState({
                                                                specialReport: {
                                                                    ...specialReport,
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
                                    {selectedSpecialReport ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2"
                                            onClick={() => this.updateSpecialReport()}
                                        >
                                            Update Special Report
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addSpecialReport()}>
                                            Add Special Report
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
    const { projectReducer, buildingReducer, specialReportReducer } = state;
    return { projectReducer, buildingReducer, specialReportReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
