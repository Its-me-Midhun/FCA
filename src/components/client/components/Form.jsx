import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import { Multiselect } from "multiselect-react-dropdown";
import PhoneInput from "react-phone-number-input/input"

import clientActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { EMAIL } from "../../../config/validation";
import regionAction from "../../region/actions"
import {
    addToBreadCrumpData,
    popBreadCrumpData,
    findPrevPathFromBreadCrump, findPrevPathFromBreadCrumpData
} from "../../../config/utils";
// import ImageUploadModal from "../../common/components/ImagesModal"
import ImageUploadModal from "./ClientImageModal"
import LoadingOverlay from "react-loading-overlay";
import exclmIcon from "../../../assets/img/recom-icon.svg";
class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            roles: "",
            groups: "",
            consultancies: "",
            clients: "",
            projects: "",
            buildings: "",
            client: {
                name: "",
                code: "",
                image: "",
                img_desc: "",
                image_name: "",
                comments: "",
            },
            initiaValues: {},
            selectedClient: props.selectedClient,
            showConfirmModal: false,
            showErrorBorder: false,
            imageUploadModal: false,
            selectedImage: "",
            uploadError: "",
            attachmentChanged: false,
            selectedProjects: [],
            selectedBuildings: [],
            passwordMessage: "",
            role_name: "",
            addButton: false
        };
    }

    componentDidMount = async () => {
        const { selectedClient } = this.state;
        await this.props.getAllConsultanciesDropdown();
        const {
            regionReducer: {
                getAllConsultanciesDropdownResponse: { consultancies }
            }
        } = this.props;
        if (selectedClient) {
            await this.props.getDataById(selectedClient);
            const {
                clientReducer: {
                    getClientByIdResponse: { name, consultancy, code, image, comments, success }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    client: {
                        name,
                        code,
                        comments,
                        image: image.url ? image : [],
                        image_id: image ? image.url : '',
                        img_desc: image.description || "",
                        consultancy_id: consultancy ? consultancy.id : null
                    },
                    selectedImage: image
                });
            }
        }

        await this.setState({
            initiaValues: this.state.client,

            consultancies,
            isLoading: false,
        });
    };

    validate = () => {
        let role = localStorage.getItem("role");
        const { client } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!client.name && !client.name.trim().length) {
            this.setState({
                errorMessage: "Please enter client name",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        if (role === 'super_admin' && !client.consultancy_id ) {
            this.setState({
                errorMessage: "Please enter consultancy",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        return true;
    };

    addBuildingType = async () => {
        this.setState({ addButton: true })
        const { client } = this.state;
        const { handleAddClient } = this.props;
        if (this.validate()) {
            popBreadCrumpData();
            this.setState({ isLoading: true })
            await handleAddClient(client);
            this.setState({ isLoading: false })
        }
    };

    updateBuildingType = async () => {

        const { client, selectedImage } = this.state;
        const { handleUpdateClient } = this.props;

        if (this.validate()) {
            popBreadCrumpData();
            this.setState({ isLoading: true })
            await handleUpdateClient(client, selectedImage);
            this.setState({ isLoading: false })

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
                        message={
                            "This action cannot be reverted, are you sure that you need to cancel?"
                        }
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.clearForm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    cancelForm = () => {
        if (_.isEqual(this.state.initiaValues, this.state.client)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { history } = this.props;
        this.setState({
            client: {
                name: ""
            }
        });
        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({ key: "main", name: "client", path: "/client" });
        }
        history.push(findPrevPathFromBreadCrump() || "/client");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };
    handleAddAttachment = e => {

        this.setState({
            imageUploadModal: true
        })
    };



    handleImage = (e) => {

    }

    deleteImage = () => {
        this.setState({
            attachmentChanged: true,
            client: {
                ...this.state.client,
                image: null,
                img_desc: null,
                image_id: null,
                image_name: "",
            },
            selectedImage: null,

        })
    }

    handleAddImage = (imageData) => {
        this.setState({
            uploadError: "",
            imageUploadModal: false
        });
        if (!imageData.url) {
            this.setState({
                attachmentChanged: true,
                client: {
                    ...this.state.client,
                    image: imageData.file,
                    img_desc: imageData.comments
                },
                previewImage: URL.createObjectURL(imageData.file)
            });
        }
        else if (imageData.comments) {
            this.setState({
                client: {
                    ...this.state.client,
                    img_desc: imageData.comments
                },
            });
        }
    }

    handleConsultancySelect = async e => {
        this.setState({
            client: {
                ...this.state.client,
                consultancy_id: e.target.value
            },
        });
    };


    render() {
        let role = localStorage.getItem("role");
        const { isLoading } = this.state;

        //if (isLoading) return <Loader />;

        const { client, selectedClient, showErrorBorder, roles, groups, projects, selectedProjects, buildings, selectedBuildings, consultancies, clients, role_name, addButton } = this.state;
        return (
            <React.Fragment>

                <div className="dtl-sec col-md-12">

                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedClient? "Edit Client" : "Add Client" }</li>
                        </ul>

                        <div className="tab-active location-sec recom-sec main-dtl-add">
                            <div className="col-md-12 detail-recom add-details-outer">
                                <div className="m-details-img-sec">
                                    <form autoComplete="nope">
                                        <div className="row align-items-stretch">

                                            <div className="col-md-8 p-0 m-details-content-outer">
                                                <div className="m-details-content-block">
                                                    <div className="d-flex content-block-2 mt-1">
                                                        {selectedClient ?
                                                            <div className="content-block-outer br-btm">
                                                                <div className="content-inp-card">
                                                                    <div className="form-group">
                                                                        <label>Client code *</label>
                                                                        <input
                                                                            autoComplete="nope"
                                                                            type="text"
                                                                            className="custom-input form-control"
                                                                            value={client.code || ''}
                                                                            readOnly={true}
                                                                            placeholder="Consultancy Code"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : ""}




                                                        <div className={`${role === "super_admin" ? "content-block-outer br-left br-btm" : "content-block-outer br-left br-btm w-100"}`}>
                                                            <div className="content-inp-card">
                                                                <div className="form-group">
                                                                    <label>Name *</label>
                                                                    <input
                                                                        autoComplete="nope"
                                                                        type="text"
                                                                        className={`${showErrorBorder && !client.name.trim().length
                                                                            ? "error-border "
                                                                            : ""
                                                                            }form-control custom-input`}
                                                                        value={client.name}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                client: {
                                                                                    ...client,
                                                                                    name: e.target.value
                                                                                }
                                                                            })
                                                                        }
                                                                        placeholder="Name"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {role === "super_admin" ?

                                                            <div className={`${selectedClient ? "content-block-outer br-left br-btm" : "content-block-outer br-left br-btm wd-100"}`}>
                                                                <div className="content-inp-card">
                                                                    <div className="form-group">
                                                                        <label>Consultancy *</label>
                                                                        <div className="custom-selecbox">
                                                                            <select
                                                                                autoComplete="nope"
                                                                                className={`${showErrorBorder &&
                                                                                    (!client.consultancy_id ||
                                                                                        !client.consultancy_id.trim().length)
                                                                                    ? "error-border "
                                                                                    : ""
                                                                                    }custom-selecbox form-control`}
                                                                                onChange={async e => {
                                                                                    await this.setState({
                                                                                        client: {
                                                                                            ...client,
                                                                                            consultancy_id: e.target.value
                                                                                        }
                                                                                    });
                                                                                }}
                                                                                value={client.consultancy_id}
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {consultancies && consultancies.length
                                                                                    ? consultancies.map((item, i) => (
                                                                                        <option value={item.id} key={i}>
                                                                                            {item.name}
                                                                                        </option>
                                                                                    ))
                                                                                    : null}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div> : null}


                                                    </div>

                                                    <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}></LoadingOverlay>
                                                    <div className="content-block-outer">
                                                        <div className="content-inp-card">
                                                            <div className="form-group">
                                                                <label>Comments </label>
                                                                <textarea
                                                                    autoComplete="nope"
                                                                    placeholder="Comments"
                                                                    className="custom-input form-control"
                                                                    value={client.comments}
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            client: {
                                                                                ...client,
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
                                                    {this.state.selectedImage &&
                                                        this.state.selectedImage.url ?
                                                        <>
                                                            {this.state.selectedImage !== this.state.client.image ?
                                                                <>
                                                                    <div className={selectedClient ? "custom-image-upload edit-addtn"
                                                                        : "custom-image-upload"} onClick={this.handleAddAttachment}>
                                                                        <label for="file-input">
                                                                            {this.state.client.image.name ?
                                                                                <i className='fas fa-pencil-alt'></i>
                                                                                : ""}
                                                                        </label>
                                                                    </div>
                                                                    <img src={`${this.state.previewImage}`} alt="" />
                                                                </>
                                                                :
                                                                <>
                                                                    <div className="custom-image-upload edit-addtn" onClick={this.handleAddAttachment}>
                                                                        <label for="file-input">
                                                                            {this.state.client.image.name ?
                                                                                <i className='fas fa-pencil-alt'></i>
                                                                                : ""}
                                                                        </label>
                                                                    </div>
                                                                    <img src={`${this.state.selectedImage.url}`} alt="" />
                                                                </>
                                                            }
                                                        </> :
                                                        <>
                                                            {this.state.previewImage ?
                                                                <>
                                                                    <div className="custom-image-upload edit-addtn" onClick={this.handleAddAttachment}>
                                                                        <label for="file-input">
                                                                            {this.state.client.image && this.state.client.image.name ?
                                                                                <i className='fas fa-pencil-alt'></i>
                                                                                : ""}
                                                                        </label>
                                                                    </div>
                                                                    <img src={`${this.state.previewImage}`} alt="" />
                                                                </>
                                                                :
                                                                <>
                                                                    <div className="custom-image-upload " onClick={this.handleAddAttachment}>
                                                                        <label for="file-input">
                                                                            Add Image
                                    </label>
                                                                    </div>
                                                                    <img src="/img/no-image.png" alt="" />
                                                                </>
                                                            }
                                                        </>
                                                    }
                                                    {this.state.imageUploadModal ? <>
                                                        <Portal
                                                            body={
                                                                <ImageUploadModal
                                                                    imageList={this.state.client.image ? [this.state.client.image] : []}
                                                                    img_desc={this.state.client.img_desc ? this.state.client.img_desc : ""}
                                                                    isRecomentaionView={true}
                                                                    handleImage={this.handleImage}
                                                                    handleAddImage={this.handleAddImage}
                                                                    deleteImageRecomention={this.deleteImage}
                                                                    onCancel={() => this.setState({
                                                                        imageUploadModal: false
                                                                    })} />}
                                                            onCancel={() => this.setState({
                                                                imageUploadModal: false
                                                            })}
                                                        /> </> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>




                            </div>

                            <div className="add-btn-wrapper">

                                <button
                                    type="button"
                                    className="button btn-clear"
                                    data-dismiss="modal"
                                    onClick={() => this.cancelForm()}
                                >
                                    Cancel
                        </button>

                                {selectedClient ? (
                                    <button
                                        type="button"
                                        className="button btn-save ml-2"
                                        onClick={() => this.updateBuildingType()}
                                    >
                                        Update client
                                    </button>
                                ) : (
                                        <button
                                            disabled={addButton}
                                            type="button"
                                            className="button btn-save ml-2"
                                            onClick={() => this.addBuildingType()}
                                        >
                                            Add New client
                                        </button>
                                    )}
                            </div>

                        </div>
                        {/* <div className="tab-active build-dtl">
                            <div className="otr-common-edit custom-col">

                                <div className="basic-otr">
                                    <div className="basic-dtl-otr basic-sec ">
                                        {selectedClient ? (
                                            <div className={`${selectedClient ? "col-md-3 basic-box" : "col-md-3 basic-box"}`}>


                                                <div className="codeOtr">
                                                    <h4>Client Code</h4>
                                                    <input
                                                        type="text"
                                                        className="custom-input form-control"
                                                        value={client.code || ''}
                                                        readOnly={true}
                                                        placeholder="Consultancy Code"
                                                    />
                                                </div>
                                            </div>

                                        ) : null}
                                        <div className={`${selectedClient ? "col-md-3 basic-box" : "col-md-3 basic-box"}`}  >

                                            <div className="codeOtr">
                                                <h4>Name *</h4>
                                                <input
                                                    type="text"
                                                    className={`${showErrorBorder && !client.name.trim().length
                                                        ? "error-border "
                                                        : ""
                                                        }form-control custom-input`}
                                                    value={client.name}
                                                    onChange={e =>
                                                        this.setState({
                                                            client: {
                                                                ...client,
                                                                name: e.target.value
                                                            }
                                                        })
                                                    }
                                                    placeholder="Name"
                                                />

                                            </div>
                                        </div>
                                        {role === "super_admin" ?
                                            <div className={`${selectedClient ? "col-md-3 basic-box" : "col-md-3 basic-box"}`}>
                                                <div className="codeOtr">
                                                    <h4>Consultancy *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className={`${showErrorBorder &&
                                                                (!client.consultancy_id ||
                                                                    !client.consultancy_id.trim().length)
                                                                ? "error-border "
                                                                : ""
                                                                }custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    client: {
                                                                        ...client,
                                                                        consultancy_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                            value={client.consultancy_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {consultancies && consultancies.length
                                                                ? consultancies.map((item, i) => (
                                                                    <option value={item.id} key={i}>
                                                                        {item.name}
                                                                    </option>
                                                                ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div> : null}


                                        <div className={`${selectedClient ? "col-md-3 basic-box comment-form" : "col-md-3 basic-box comment-form"}`} >
                                            <div className="codeOtr">
                                                <h4>Comments</h4>
                                                <textarea
                                                    placeholder="Comments"
                                                    className="custom-input form-control"
                                                    value={client.comments}
                                                    onChange={e =>
                                                        this.setState({
                                                            client: {
                                                                ...client,
                                                                comments: e.target.value
                                                            }
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className={`${selectedClient ? "col-md-3 back-set" : "col-md-3 back-set"}`}>
                                            <div className="details-img-block details-img-new">
                                                {this.state.selectedImage &&
                                                    this.state.selectedImage.url ?
                                                    <>
                                                        {this.state.selectedImage !== this.state.client.image ?
                                                            <>
                                                                <div className={selectedClient ? "custom-image-upload edit-addtn"
                                                                    : "custom-image-upload"} onClick={this.handleAddAttachment}>
                                                                    <label for="file-input">
                                                                        {this.state.client.image.name ?
                                                                            <i className='fas fa-pencil-alt'></i>
                                                                            : ""}
                                                                    </label>
                                                                </div>
                                                                <img src={`${this.state.previewImage}`} alt="" />
                                                            </>
                                                            :
                                                            <>
                                                                <div className="custom-image-upload edit-addtn" onClick={this.handleAddAttachment}>
                                                                    <label for="file-input">
                                                                        {this.state.client.image.name ?
                                                                            <i className='fas fa-pencil-alt'></i>
                                                                            : ""}
                                                                    </label>
                                                                </div>
                                                                <img src={`${this.state.selectedImage.url}`} alt="" />
                                                            </>
                                                        }
                                                    </> :
                                                    <>
                                                        {this.state.previewImage ?
                                                            <>
                                                                <div className="custom-image-upload edit-addtn" onClick={this.handleAddAttachment}>
                                                                    <label for="file-input">
                                                                        {this.state.client.image && this.state.client.image.name ?
                                                                            <i className='fas fa-pencil-alt'></i>
                                                                            : ""}
                                                                    </label>
                                                                </div>
                                                                <img src={`${this.state.previewImage}`} alt="" />
                                                            </>
                                                            :
                                                            <>
                                                                <div className="custom-image-upload " onClick={this.handleAddAttachment}>
                                                                    <label for="file-input">
                                                                        Add Image
                                    </label>
                                                                </div>
                                                                <img src="/img/no-image.png" alt="" />
                                                            </>
                                                        }
                                                    </>
                                                }

                                                {this.state.imageUploadModal ? <>
                                                    <Portal
                                                        body={
                                                            <ImageUploadModal
                                                                imageList={this.state.client.image ? [this.state.client.image] : []}
                                                                img_desc={this.state.client.img_desc ? this.state.client.img_desc : ""}
                                                                isRecomentaionView={true}
                                                                handleImage={this.handleImage}
                                                                handleAddImage={this.handleAddImage}
                                                                deleteImageRecomention={this.deleteImage}
                                                                onCancel={() => this.setState({
                                                                    imageUploadModal: false
                                                                })} />}
                                                        onCancel={() => this.setState({
                                                            imageUploadModal: false
                                                        })}
                                                    /> </> : null}
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
                                {selectedClient ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary btnRgion col-md-2"
                                        onClick={() => this.updateBuildingType()}
                                    >
                                        Update client
                                    </button>
                                ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2"
                                            onClick={() => this.addBuildingType()}
                                        >
                                            Add New client
                                        </button>
                                    )}
                            </div>
                        </div>

                    </div> */}
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>

        );
    }
}

const mapStateToProps = state => {
    const { clientReducer, regionReducer } = state;
    return { clientReducer, regionReducer };
};

export default withRouter(
    connect(mapStateToProps, { ...clientActions, ...regionAction })(From)
);
