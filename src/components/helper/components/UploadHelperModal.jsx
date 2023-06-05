import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import helperActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData } from "../../../config/utils";

class UploadHelperModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            helperType: "Text",
            errorMessage: "",
            consultancy_users: "",
            helperContent: {
                fileType: "",
                description: "",
                fileData: null,
                fileUrl: ""
            },
            initiaValues: {},
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        this.setState({
            isLoading: false
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to clear and lose all changes?"}
                        type="cancel"
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
        if (_.isEqual(this.state.initiaValues, this.state.project)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        await this.setState({
            helperContent: {
                fileType: "",
                description: "",
                fileData: null,
                fileUrl: ""
            }
        });
        this.props.onCancel();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleAddAttachment = async e => {
        this.setState({
            uploadError: ""
        });
        if (this.isIterable(e.target.files)) {
            Object.values(e.target.files).map(async (attachment, i) => {
                let ext = attachment.name.split(".").pop();
                const acceptableExt = ["pdf", "png", "jpg", "gif"];
                if (acceptableExt.includes(ext.toLowerCase())) {
                    if (attachment.size < 100000000) {
                        this.setState({
                            attachmentChanged: true,
                            helperContent: {
                                ...this.state.project,
                                fileData: e.target.files[0],
                                fileType: ext.toLowerCase(),
                                fileUrl: await this.props.uploadHelperDocToAWS(e.target.files[0])
                            }
                        });
                    } else {
                        this.setState({
                            uploadError: "File is too big. Files with size greater than 100MB is not allowed."
                        });
                    }
                } else {
                    this.setState({
                        attachmentChanged: false,
                        uploadError: "* Upload pdf or png or jpg or gif Files !!!"
                    });
                }
            });
        }
        return true;
    };

    handleUpdateContent = () => {
        const { helperContent, helperType } = this.state;
        let returnVal = {
            "content-type": helperContent.fileType,
            description: helperType === "Text" ? helperContent.description : null,
            file_url: helperType === "File" ? helperContent.fileUrl : null
        };
        this.props.handleUpdateHelper(returnVal);
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;
        const { isUploading } = this.props;
        const { helperContent, helperType, showErrorBorder, uploadError } = this.state;

        return (
            <React.Fragment>
                <div
                    className="modal modal-region"
                    id="modalId"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Update Content
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="add-project">
                                <div className="modal-body region-otr">
                                    <div className="building-form">
                                        <div className="form-group">
                                            <div className="formInp">
                                                <label>Type *</label>
                                                <div className="selectOtr">
                                                    <select
                                                        className={`form-control`}
                                                        onChange={e =>
                                                            this.setState({
                                                                helperType: e.target.value
                                                            })
                                                        }
                                                        value={helperType}
                                                    >
                                                        <option value="Text">Text</option>
                                                        <option value="File">File</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {helperType === "File" ? (
                                            <div className="col-md-12 upldFile btnAddCam p-0">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="attachmentFiles"
                                                    name="projectFile"
                                                    onChange={async e => {
                                                        await this.handleAddAttachment(e);
                                                    }}
                                                />
                                                <div className="upld-otr d-flex">
                                                    <label
                                                        htmlFor="attachmentFiles"
                                                        className={`${
                                                            showErrorBorder && !helperContent.fileData ? "error-border " : ""
                                                        }custom-file-uploadd cursor-pointer`}
                                                        title={
                                                            helperContent.fileData && helperContent.fileData.name ? helperContent.fileData.name : null
                                                        }
                                                    >
                                                        {console.log(`helperContenatdfileData`, helperContent.fileData)}
                                                        {helperContent.fileData ? (
                                                            helperContent.fileData.name && helperContent.fileData.name.length > 25 ? (
                                                                helperContent.fileData.name.substring(0, 25) + "..."
                                                            ) : (
                                                                helperContent.fileData.name
                                                            )
                                                        ) : (
                                                            <>
                                                                <img src="/img/upload.png" alt="" />
                                                                Upload Files *
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-danger">{uploadError}</span>
                                                </div>
                                                <p className="upld">Upload xls or xlsm or xlsx Files</p>
                                            </div>
                                        ) : (
                                            <textarea
                                                className={`form-control`}
                                                value={helperContent.description}
                                                onChange={e =>
                                                    this.setState({
                                                        helperContent: {
                                                            ...helperContent,
                                                            description: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        )}
                                        <div className="text-center btnOtr">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btnClr col-md-6"
                                                data-dismiss="modal"
                                                onClick={() => this.cancelForm()}
                                            >
                                                Cancel
                                            </button>
                                            {isUploading ? (
                                                <button type="button" className="btn btn-primary btnRgion col-md-6">
                                                    <div className="button-loader d-flex justify-content-center align-items-center">
                                                        <div className="spinner-border text-white" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => this.handleUpdateContent()}
                                                    className="btn btn-primary btnRgion col-md-6"
                                                >
                                                    Update
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default withRouter(UploadHelperModal);
