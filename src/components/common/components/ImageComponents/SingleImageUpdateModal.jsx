import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ConfirmationModal from "../ConfirmationModal";
import Portal from "../Portal";
import Loader from "../Loader";
import { toTitleCase } from "../../../../config/utils";

class SingleImageUpdateModal extends Component {
    state = {
        isUpdating: false,
        missingRequiredFields: false,
        image: {},
        showNarrCompletedComfirmModal: false
    };

    componentDidMount = () => {
        const { image } = this.props;
        this.setState({ image });
    };

    handleUpdateComment = async () => {
        const { image } = this.state;
        if (!image.description) {
            this.setState({
                isUpdating: false,
                missingRequiredFields: true
            });
            return false;
        }
        let usedImageFound = false;
        if (this.props.isReportImage) {
            usedImageFound = this.props.checkIfNarrativeImageUsed(image.id);
        }
        if (usedImageFound && this.props.narrativeCompleted) {
            this.setState({ showNarrCompletedComfirmModal: true });
        } else {
            await this.updateComment();
        }
    };

    updateComment = async () => {
        const { image } = this.state;
        this.setState({
            isUpdating: true
        });
        await this.props.updateImage({
            id: image.id,
            description: image.description,
            printable: image.printable
        });
        await this.setState({
            image: {},
            isUpdating: false,
            missingRequiredFields: false
        });
        this.props.onCancel();
    };

    handleDescription = e => {
        const { image } = this.state;
        this.setState({
            image: {
                ...image,
                description: toTitleCase(e.target.value)
            }
        });
    };

    renderNarrCompletedConfirmationModal = () => {
        const { showNarrCompletedComfirmModal } = this.state;
        if (!showNarrCompletedComfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you really want to update this Image?"}
                        message={"This narrative is marked as completed. This action will mark the narrative as incomplete."}
                        onNo={() => this.setState({ showNarrCompletedComfirmModal: false })}
                        onYes={() => {
                            this.setState({ showNarrCompletedComfirmModal: false });
                            this.updateComment();
                        }}
                    />
                }
                onCancel={() => this.setState({ showNarrCompletedComfirmModal: false })}
            />
        );
    };

    render() {
        const { image, isUpdating, missingRequiredFields } = this.state;
        const { onCancel } = this.props;

        return (
            <React.Fragment>
                <div id="modalId" className={"modal modal-region modal-add-img gal-image-modal width-img-modal"} style={{ display: "block" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={onCancel}>
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <div className="otr-add-img">
                                    <div className="add-imges col-md-12 p-0">
                                        <h3>Update Image</h3>

                                        <div className="innr-img">
                                            <label className={`drag-otr cursor-pointer`} params htmlFor="attachmentFiles">
                                                <img src={image?.thumb || image?.url} alt="" />
                                                <p>{image.name}</p>
                                            </label>
                                            <div className="comments form-group">
                                                <div className="col-md-12 formInp p-0 cmntImg">
                                                    <label>Comments</label>
                                                    <textarea
                                                        className={`${
                                                            missingRequiredFields && !image.description ? "error-border" : ""
                                                        } form-control`}
                                                        placeholder="Enter Comments"
                                                        value={image?.description || ""}
                                                        onChange={e => this.handleDescription(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12 text-right p-0">
                                                {!isUpdating ? (
                                                    <>
                                                        <label className="btn btn-light mr-2 mt-2" onClick={() => onCancel()}>
                                                            Cancel
                                                        </label>
                                                        <label
                                                            className="update-comment btn-primary cursor-pointer"
                                                            onClick={() => this.handleUpdateComment()}
                                                        >
                                                            Update Comment
                                                        </label>
                                                    </>
                                                ) : (
                                                    <label className="custom-file-uploadd cursor-pointer" style={{ position: "relative" }}>
                                                        <Loader />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderNarrCompletedConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default withRouter(SingleImageUpdateModal);
