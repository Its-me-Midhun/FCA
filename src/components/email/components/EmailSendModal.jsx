import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../actions";
import { Multiselect } from "multiselect-react-dropdown";
import ToastMsg from "../../common/components/ToastMessage";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class EmailSendModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploading: false,
            formParams: {
                subject: "",
                message: "",
                email: [],
                selectedUser_Ids: [],
                file: []
            },
            alertMessage: "",
            errorParams: {
                subject: false,
                email: false
            },
            showErrorBorder: false,
            userList: [],
            selectedUsers: [],
            isLoadingMultiSelect: false,
            isLoadingAttachment: false
        };
    }
    componentDidMount = async () => {
        await this.props.getAllUserMailid();

        await this.setState({
            userList: this.props.emailReducer.allUserEmailList
        });
    };
    deleteAttachment = async index => {
        let fileArray = Object.values(this.state.formParams.file);
        fileArray.splice(index, 1);
        if (!fileArray.length) {
            await this.setState({
                formParams: {
                    ...this.state.formParams,
                    file: []
                }
            });
        }
        await this.setState({
            formParams: {
                ...this.state.formParams,
                file: fileArray
            }
        });
    };
    sendMailWithAttachment = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            let em = { user_ids: formParams.selectedUser_Ids };
            let inbox_id = localStorage.getItem("userId");
            let params = new FormData();
            params.append("subject", formParams.subject);
            params.append("message", formParams.message);
            params.append("from_user_id", inbox_id);

            params.append("user_ids", JSON.stringify(em));

            if (formParams.file && formParams.file.length) {
                formParams.file.map((item, i) => params.append("file", item));
            }
            this.setState({
                isUploading: true
            });
            await this.props.sendEmail(params);
            if (this.props.emailReducer.sendMailWithAttachmentResponse && this.props.emailReducer.sendMailWithAttachmentResponse.error) {
                await this.setState({ alertMessage: this.props.masterTradeReducer.updateTradeResponse.error });
                this.showAlert();
                this.setState({
                    isUploading: false
                });
            } else {
                this.setState({
                    alertMessage: this.props.emailReducer.sendMailWithAttachmentResponse.message || "Email Send"
                });
                this.showAlert();
            }

            this.props.onCancel();
        }
    };
    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };
    onUserSelect = async selectedList => {
        const { formParams } = this.state;
        let tempUserList = [];
        let tempUserId = [];
        selectedList.map(item => tempUserList.push(item.email));
        selectedList.map(item => tempUserId.push(item.id));
        await this.setState({
            formParams: {
                ...formParams,
                email: tempUserList,
                selectedUser_Ids: tempUserId
            },

            selectedUsers: selectedList
        });
    };

    validate = () => {
        const { formParams } = this.state;

        let errorParams = {
            subject: false,
            email: false
        };
        let showErrorBorder = false;
        if (!formParams.subject || !formParams.subject.trim().length) {
            errorParams.subject = true;
            showErrorBorder = true;
        }
        if (!formParams.email.length) {
            errorParams.email = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    handleAddAttachment = async e => {
        await this.setState({
            formParams: {
                ...this.state.formParams,
                file: [...this.state.formParams.file, ...e.target.files]
            }
        });
    };

    selectAllUsers = async () => {
        await this.setState({
            isLoadingMultiSelect: true
        });
        const { userList, selectedUsers } = this.state;
        if (!(selectedUsers && userList && selectedUsers.length === userList.length)) {
            this.onUserSelect(userList);
        } else {
            this.onUserSelect([]);
        }
        await this.setState({
            isLoadingMultiSelect: false
        });
    };

    render() {
        const { onCancel, hasAttachment = false, isEventEmail = false, attachmentForEmail = null } = this.props;
        const { userList, selectedUsers, isLoadingMultiSelect, showErrorBorder, errorParams, email, formParams, isLoadingAttachment ,isUploading} = this.state;

        return (
            <React.Fragment>
                <div className="modal modal-region modal-view inbox-modal" id="modalId" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    <div className="txt-hed">Send Mail</div>
                                </h5>
                                <button type="button" className="close" onClick={this.props.onCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <div className="upload-area not-draggable">
                                    <div className="upload-sec cursor-hand" role="button" tabIndex="0">
                                        <input type="file" multiple="" autocomplete="off" tabIndex="-1" style={{ display: "none" }} />
                                    </div>
                                </div>
                                <div className="col-md-12 main-sec">
                                    <div className="form-row">
                                        <div className="form-group col-12 fom-cros-lable">
                                            <label>
                                                To <span>*</span>
                                            </label>
                                            <div className="rem-txt">
                                                {userList && userList.length ? (
                                                    <label className="container-check">
                                                        Select All Available Users
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="customCheck"
                                                            name="example1"
                                                            checked={
                                                                selectedUsers.length && userList.length && selectedUsers.length === userList.length
                                                            }
                                                            onChange={() => this.selectAllUsers()}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className={`form-group col-12 ${showErrorBorder && errorParams.email ? "error-border" : ""}`}>
                                            {!isLoadingMultiSelect ? (
                                                <Multiselect
                                                    options={userList ? userList : []}
                                                    selectedValues={selectedUsers}
                                                    onSelect={this.onUserSelect}
                                                    onRemove={this.onUserSelect}
                                                    displayValue="email"
                                                    showCheckbox={true}
                                                    showArrow={true}
                                                    closeOnSelect={false}
                                                    className="form-control"
                                                />
                                            ) : null}
                                        </div>

                                        <div className="form-group col-12">
                                            <label>Subject*</label>
                                            <input
                                                type="text"
                                                placeholder="Subject"
                                                value={formParams.subject}
                                                onChange={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            subject: e.target.value
                                                        }
                                                    });
                                                }}
                                                className={`form-control ${showErrorBorder && errorParams.subject ? "error-border" : ""}`}
                                            />
                                        </div>

                                        <div className="form-group col-12">
                                            <label>Description</label>
                                            <textarea
                                                placeholder="Description"
                                                value={formParams.message}
                                                onChange={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            message: e.target.value
                                                        }
                                                    });
                                                }}
                                                className="form-control textarea"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div class="drag-otr col-md-12">
                                        <p>Select files to attach...</p>
                                        <input type="file" multiple class="custome-file-input" id="customFile" onChange={this.handleAddAttachment} />
                                        <span class="show-btn">Browse</span>
                                    </div>
                                    {formParams.file.length ? (
                                        <div className="col-md-12 pl-0 mb-3 mt-3 pr-0">
                                            <div className="upload-sec">
                                                <div className="table-hed">
                                                    <h3> files</h3>
                                                </div>
                                                <div className="form-group uplod-sec-fld mb-2">
                                                    <div className="upload-files-nme mt-0">
                                                        {formParams.file.map((item, i) => (
                                                            <span className="badge-nme" key={i}>
                                                                <label>{item.name || "Event Screenshot "} </label>
                                                                <i className="material-icons close-icon" onClick={() => this.deleteAttachment(i)}>
                                                                    <img src="/img/close-icn-white.svg" />
                                                                </i>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="btn-sec">
                                    <div className="text-right btnOtr edit-cmn-btn">
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion "
                                            class="btn btn-create save"
                                            onClick={() => this.sendMailWithAttachment()}
                                        >
                                            Send
                                            {this.state.isUploading ? (
                                                <span className="spinner-border spinner-border-sm pl-2 ml-2" role="status"></span>
                                            ) : (
                                                ""
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btnClr mr-1"
                                            data-dismiss="modal"
                                            onClick={this.props.onCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(EmailSendModal));
