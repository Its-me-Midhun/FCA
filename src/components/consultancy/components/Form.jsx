import React, { Component } from "react";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import regionActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData, findPrevPathFromBreadCrump, addToBreadCrumpData } from "../../../config/utils";
// import ImageUploadModal from "../../common/components/ImagesModal"
import ImageUploadModal from "./ConsultancyModal";
import exclmIcon from "../../../assets/img/recom-icon.svg";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            clients: "",
            consultancy_users: "",
            region: {
                consultancy_user_ids: [],
                // project_ids: [],
                client_id: "",
                name: "",
                code: "",
                comments: "",
                image: "",
                img_desc: "",
                image_name: ""
            },
            initiaValues: {},
            showErrorBorder: false,
            selectedConsultancyUsers: [],
            selectedRegion: props.match.params.id,
            showConfirmModal: false,
            imageUploadModal: false,
            selectedImage: "",
            uploadError: "",
            attachmentChanged: false,
            addButton: false
            // AllProjects: "",
            // selectedProjects: [],
        };
    }

    componentDidMount = async () => {
        const { selectedRegion } = this.state;
        if (selectedRegion) {
            await this.props.getDataById(selectedRegion);
            const {
                consultancyReducer: {
                    getConsultancyByIdResponse: { code, id, comments, name, success, image }
                }
            } = this.props;
            if (success) {
                // await this.props.getProjectsBasedOnClient(client.id);
                // const {
                //     consultancyReducer: {
                //         getProjectsBasedOnClientResponse: { projects: AllProjects }
                //     }
                // } = this.props;
                // await this.setState({
                //     AllProjects
                // });

                // let selectedProjects = [];
                // let project_ids = [];
                // if (projects.length) {
                //     projects.map(item => selectedProjects.push({ name: item.name, id: item.id }));
                //     projects.map(item => project_ids.push(item.id));
                // }
                await this.setState({
                    region: {
                        name,
                        code,
                        comments,
                        // image: { ...image, id: image && image.url ? id : null },
                        image: image.url ? image : [],
                        image_id: image ? image.url : "",
                        img_desc: image.description || ""
                    },
                    selectedImage: image
                });
            }
        }

        await this.setState({
            initiaValues: this.state.region,
            isLoading: false
        });
    };

    onSelectConsultancyUsers = async selectedConsultancyUsers => {
        const { region } = this.state;
        let tempUsers = [];
        if (selectedConsultancyUsers.length) {
            selectedConsultancyUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            region: {
                ...region,
                consultancy_user_ids: tempUsers
            },
            selectedConsultancyUsers
        });
    };

    handleClientSelect = async selectedClient => {
        const { region } = this.state;
        // await this.props.getProjectsBasedOnClient(region.client_id);
        // const {
        //     consultancyReducer: {
        //         getProjectsBasedOnClientResponse: { projects: AllProjects }
        //     }
        // } = this.props;
        await this.setState({
            // AllProjects,
            region: {
                ...region,
                client_id: selectedClient.value
                // project_ids: ""
            },
            selectedClient
        });
    };

    validate = () => {
        const { region } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!region.name.trim().length) {
            this.setState({
                errorMessage: "Please enter region name",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        return true;
    };

    addRegion = async () => {
        this.setState({ addButton: true });
        const { region } = this.state;
        const { handleAddRegion } = this.props;
        if (this.validate()) {
            popBreadCrumpData();
            await handleAddRegion(region);
        }
    };

    updateRegion = async () => {
        const { region, selectedImage } = this.state;
        const { handleUpdateRegion } = this.props;
        if (this.validate()) {
            popBreadCrumpData();
            if (!findPrevPathFromBreadCrump()) {
                addToBreadCrumpData({
                    key: "main",
                    name: "Consultancies",
                    path: "/consultancy"
                });
            }

            await handleUpdateRegion(region, selectedImage);
            this.props.history.push(findPrevPathFromBreadCrump() || "/consultancy");
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
        if (_.isEqual(this.state.initiaValues, this.state.region)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    handleAddAttachment = e => {
        this.setState({
            imageUploadModal: true
        });
    };

    clearForm = async () => {
        const { history } = this.props;
        await this.setState({
            region: {
                name: "",
                comments: ""
            },
            showConfirmModal: false
        });

        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({ key: "main", name: "Consultancies", path: "/consultancy" });
        }
        history.push(findPrevPathFromBreadCrump() || "/consultancy");
        popBreadCrumpData();
    };

    onSelectProjects = async selectedProjects => {
        const { region } = this.state;
        let tempProjects = [];
        if (selectedProjects.length) {
            selectedProjects.map(item => tempProjects.push(item.id));
        }
        await this.setState({
            region: {
                ...region,
                project_ids: tempProjects
            },
            selectedProjects
        });
    };

    handleAddImage = imageData => {
        this.setState({
            uploadError: "",
            imageUploadModal: false
        });
        if (!imageData.url) {
            this.setState({
                attachmentChanged: true,
                region: {
                    ...this.state.region,
                    image: imageData.file,
                    img_desc: imageData.comments
                },
                previewImage: URL.createObjectURL(imageData.file)
            });
        } else if (imageData.comments) {
            this.setState({
                region: {
                    ...this.state.region,
                    img_desc: imageData.comments
                }
            });
        }
    };

    handleImage = e => {};

    deleteImage = () => {
        this.setState({
            attachmentChanged: true,
            region: {
                ...this.state.region,
                image: null,
                img_desc: null,
                image_id: null,
                image_name: ""
            },
            selectedImage: null
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const {
            region,
            selectedConsultancyUsers,
            selectedRegion,
            showErrorBorder,
            addButton
        } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{ selectedRegion ? "Edit Consultancy" : "Add Consultancy"}</li>
                        </ul>
                        <div className="tab-active location-sec recom-sec main-dtl-add">
                            <div className="col-md-12 detail-recom add-details-outer">
                                <div className="m-details-img-sec">
                                    <form autoComplete="nope">
                                        <div className="row align-items-stretch">
                                            <div className="col-md-8 p-0 m-details-content-outer">
                                                <div className="m-details-content-block">
                                                    <div className="d-flex content-block-2 mt-1">
                                                        {selectedRegion ? (
                                                            <div className="content-block-outer br-btm">
                                                                <div className="content-inp-card">
                                                                    <div className="form-group">
                                                                        <label>Consultancy Code</label>
                                                                        <input
                                                                            autoComplete="nope"
                                                                            type="text"
                                                                            className="custom-input form-control"
                                                                            value={region.code || ""}
                                                                            readOnly={true}
                                                                            placeholder="Consultancy Code"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}

                                                        <div
                                                            className={`${
                                                                selectedRegion
                                                                    ? "content-block-outer br-left br-btm"
                                                                    : "content-block-outer br-left br-btm w-100"
                                                            }`}
                                                        >
                                                            <div className="content-inp-card">
                                                                <div className="form-group">
                                                                    <label>Consultancy Name *</label>
                                                                    <input
                                                                        autoComplete="nope"
                                                                        type="text"
                                                                        className={`${
                                                                            showErrorBorder && !region.name.trim().length ? "error-border " : ""
                                                                        }custom-input form-control`}
                                                                        value={region.name}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                region: {
                                                                                    ...region,
                                                                                    name: e.target.value
                                                                                }
                                                                            })
                                                                        }
                                                                        placeholder="Consultancy Name"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="content-block-outer">
                                                        <div className="content-inp-card">
                                                            <div className="form-group">
                                                                <label>Comments </label>
                                                                <textarea
                                                                    autoComplete="nope"
                                                                    placeholder="Comments"
                                                                    className="custom-input form-control"
                                                                    value={region.comments}
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            region: {
                                                                                ...region,
                                                                                comments: e.target.value
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 m-details-img-outer main-image-outer1">
                                                <div className="details-img-block">
                                                    {this.state.selectedImage && this.state.selectedImage.url ? (
                                                        <>
                                                            {this.state.region.image && this.state.selectedImage !== this.state.region.image ? (
                                                                <>
                                                                    <div
                                                                        className={
                                                                            selectedConsultancyUsers
                                                                                ? "custom-image-upload edit-addtn"
                                                                                : "custom-image-upload"
                                                                        }
                                                                        onClick={this.handleAddAttachment}
                                                                    >
                                                                        <label for="file-input">
                                                                            {this.state.region.image.name ? (
                                                                                <i className="fas fa-pencil-alt"></i>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                    <img src={`${this.state.previewImage}`} alt="" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div
                                                                        className="custom-image-upload edit-addtn"
                                                                        onClick={this.handleAddAttachment}
                                                                    >
                                                                        <label for="file-input">
                                                                            {this.state.region.image && this.state.region.image.name ? (
                                                                                <i className="fas fa-pencil-alt"></i>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                    <img src={`${this.state.selectedImage.url}`} alt="" />
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {this.state.previewImage ? (
                                                                <>
                                                                    <div
                                                                        className="custom-image-upload edit-addtn"
                                                                        onClick={this.handleAddAttachment}
                                                                    >
                                                                        <label for="file-input">
                                                                            {this.state.region.image && this.state.region.image.name ? (
                                                                                <i className="fas fa-pencil-alt"></i>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                    <img src={`${this.state.previewImage}`} alt="" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="custom-image-upload " onClick={this.handleAddAttachment}>
                                                                        <label for="file-input">Add Image</label>
                                                                    </div>
                                                                    <img src="/img/no-image.png" alt="" />
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                    {this.state.imageUploadModal ? (
                                                        <>
                                                            <Portal
                                                                body={
                                                                    <ImageUploadModal
                                                                        imageList={this.state.region.image ? [this.state.region.image] : []}
                                                                        img_desc={this.state.region.img_desc ? this.state.region.img_desc : ""}
                                                                        isRecomentaionView={true}
                                                                        handleImage={this.handleImage}
                                                                        handleAddImage={this.handleAddImage}
                                                                        deleteImageRecomention={this.deleteImage}
                                                                        onCancel={() =>
                                                                            this.setState({
                                                                                imageUploadModal: false
                                                                            })
                                                                        }
                                                                    />
                                                                }
                                                                onCancel={() =>
                                                                    this.setState({
                                                                        imageUploadModal: false
                                                                    })
                                                                }
                                                            />{" "}
                                                        </>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="add-btn-wrapper">
                                <button type="button" className="button btn-clear" data-dismiss="modal" onClick={() => this.cancelForm()}>
                                    Cancel
                                </button>

                                {selectedRegion ? (
                                    <button type="button" className="button btn-save ml-2" onClick={() => this.updateRegion()}>
                                        Update
                                    </button>
                                ) : (
                                    <button disabled={addButton} type="button" className="button btn-save ml-2" onClick={() => this.addRegion()}>
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { consultancyReducer } = state;
    return { consultancyReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions })(Form));
