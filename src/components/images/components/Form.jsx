import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import UploadContainer from "./UploadContainer";
import actions from "../actions";
import SelectBox from "./SelectBox";
import DuplicateModal from "../../project/components/MergeOrReplaceModalSelection";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import _ from "lodash";
import SummaryModal from "./SummaryModal";
import Draggable from "react-draggable";
import Autosuggest from "react-autosuggest";
import CaptionChangeModal from "./CaptionChangeModal";
import moment from "moment";
import { resetCursor, toTitleCase } from "../../../config/utils";
import ReactTooltip from "react-tooltip";
import ImageEditModal from "./ImageEditModal";
import TuiImageEditor from "tui-image-editor";
import assetActions from "../../assets/actions";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";

const initialState = {
    isUploading: false,
    images: [],
    filesCount: 0,
    projectList: [],
    buildingList: [],
    tradeList: [],
    user_name: localStorage.getItem("user"),
    imageData: {
        user_id: localStorage.getItem("userId"),
        project_id: "",
        building_id: "",
        trade_id: "",
        system_id: "",
        subsystem_id: "",
        captionchange: false,
        client_id: "",
        region_id: "",
        site_id: ""
    },
    errorParams: {
        project_id: false,
        building_id: false,
        trade_id: false,
        client_id: false,
        region_id: false,
        site_id: false
    },
    changecaptionmodal: false,
    tags: [],
    duplicateImages: [],
    overwriteImages: [],
    showDuplicateModal: false,
    showErrorBorder: false,
    errorMessage: "",
    initialValues: {},
    initialImages: [],
    showConfirmModal: false,
    showConfirmModalLose: false,
    uploadedFiles: {
        imagesCount: 0,
        overWriteCount: 0,
        lockedImagesCount: 0
    },
    showSummaryModal: false,
    alertMessage: "",
    startTime: "",
    endTime: "",
    chunkSize: 20,
    initialPerce: 0,
    initialTags: [],
    captionMaxLength: 100,
    selectedLabelId: "",
    labelList: [],
    labelSuggestions: [],
    image_changed: false,
    rotate: 0,
    showNextConfirmationModal: false,
    showPrevConfirmationModal: false,
    invalid_file_type: "",
    invalid_error_code: "",
    showInvalidFileModal: false,
    showImageEditModal: false,
    currentTab: "details",
    showRestoreConfirmModal: false,
    imgchang: false,
    isAssetImage: false
};
export class UploadForm extends Component {
    constructor(props) {
        super(props);
        this.imageEditorRef = React.createRef();
        this.state = initialState;
        this.isImageEdit = false;
    }

    componentDidMount = async () => {
        await this.refreshImageData();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps?.selectedImages[0]?.id !== this.props?.selectedImages[0]?.id) {
            await this.refreshImageData();
            this.setImageEditor();
        }
        if (prevState.isAssetImage !== this.state.isAssetImage && this.state.isAssetImage) {
            this.props.getDropdownList("clients");
        }
    };

    refreshImageData = async () => {
        const { entityData } = this.props;
        // for single edit
        if (this.props.selectedImages?.length === 1) {
            const { user, project, building, trade, system, sub_system, caption, labels, is_asset_image, client, region, site } =
                this.props.selectedImages[0];
            if (is_asset_image) {
                this.props.getDropdownList("clients");
                this.props.getDropdownList("regions", { client_id: client?.id });
                this.props.getDropdownList("sites", { region_id: region?.id });
            } else {
                this.getproject(project.id);
                this.props.getProjectList({ user_id: user?.id });
                this.props.getBuildingList({ project_id: project.id, user_id: user?.id });
                this.props.getTradeList({ project_id: project.id });
                this.props.getSystemList({ project_id: project.id, trade_id: trade.id });
                if (system.id) this.props.getSubsystemList({ project_id: project.id, system_id: system.id });
            }
            await this.setState({
                imageData: {
                    ...this.state.imageData,
                    user_id: user?.id,
                    caption,
                    project_id: project.id,
                    building_id: building.id,
                    trade_id: trade.id,
                    system_id: system.id,
                    subsystem_id: sub_system.id,
                    client_id: client?.id,
                    region_id: region?.id,
                    site_id: site?.id
                },
                user_name: user?.name,
                tags: labels || [],
                isAssetImage: is_asset_image
            });
            this.getLabelList({ project_id: project.id });
            // for multi edit
        } else if (this.props.selectedImages?.length >= 1) {
            this.props.getDropdownList("clients");
            let commonFields = this.getSharedData(this.props.selectedImages);
            const { user, project, building, trade, system, sub_system, caption, labels, is_asset_image, client, region, site } = commonFields;
            if (is_asset_image) {
                this.props.getDropdownList("clients");
                if (region) {
                    this.props.getDropdownList("regions", { client_id: client?.id });
                }
                if (site) {
                    this.props.getDropdownList("sites", { region_id: region?.id });
                }
            } else {
                if (project?.id) {
                    this.getproject(project?.id);
                    this.props.getProjectList({ user_id: user?.id });
                    this.props.getBuildingList({ project_id: project?.id, user_id: user?.id });
                    this.props.getTradeList({ project_id: project?.id });
                }
                if (trade?.id) {
                    this.props.getSystemList({ project_id: project?.id, trade_id: trade?.id });
                }
                if (system?.id) {
                    this.props.getSubsystemList({ project_id: project?.id, system_id: system?.id });
                }
                this.getLabelList({ project_id: project?.id });
            }
            let tags = [];
            if (labels && Object.keys(labels)?.length) {
                tags = Object.keys(labels).map(elem => ({ name: labels[elem]?.name }));
            }
            await this.setState({
                imageData: {
                    ...this.state.imageData,
                    user_id: user?.id || "",
                    caption: caption || "",
                    project_id: project?.id || "",
                    building_id: building?.id || "",
                    trade_id: trade?.id || "",
                    system_id: system?.id || "",
                    subsystem_id: sub_system?.id || "",
                    client_id: client?.id || "",
                    region_id: region?.id || "",
                    site_id: site?.id || ""
                },
                user_name: user?.name || "",
                tags: tags,
                isAssetImage: is_asset_image
            });
            // for add
        } else {
            await this.setState({
                imageData: { ...this.state.imageData, user_id: localStorage.getItem("userId") },
                user_name: localStorage.getItem("user")
            });
            if (this.state.isAssetImage) {
                this.props.getDropdownList("clients");
            } else {
                let userId = localStorage.getItem("role") !== "super_admin" ? localStorage.getItem("userId") : null;
                this.props.getProjectList({ user_id: userId });
                const defaultproject = localStorage.getItem("default_project");
                if (entityData?.id) {
                    const { trade, building, system, sub_system, project } = entityData;
                    await this.handleProjectSelect(project?.id);
                    await this.handleBuildingSelect(building.id);
                    await this.handleTradeSelect(trade.id);
                    await this.handleSystemSelect(system.id);
                    await this.handleSubsytemSelect(sub_system.id);
                } else if (defaultproject) {
                    await this.handleProjectSelect(defaultproject);
                }
            }
        }
        this.setState({ initialValues: this.state.imageData, initialImages: this.state.images, initialTags: _.cloneDeep(this.state.tags) });
    };

    getLabelList = async params => {
        let labelList = [];
        await this.props.getLabelList(params);
        const { getLabelList } = this.props.imageReducer;
        if (getLabelList.success) {
            labelList = getLabelList?.labels || [];
        }
        this.setState({
            labelList
        });
    };

    getSharedData = arr => {
        const firstObj = arr[0];
        const result = {};
        for (const key in firstObj) {
            const values = arr?.map(obj => obj && obj[key]);
            if (typeof firstObj[key] === "object" && firstObj[key] !== null) {
                const nestedResult = this.getSharedData(values);
                result[key] = nestedResult;
            } else if (new Set(values).size === 1) {
                result[key] = firstObj[key];
            } else {
                result[key] = null;
            }
        }
        return result;
    };
    // populateAllCommonFields = (images = []) => {
    //     let commonFields = {
    //         user: null,
    //         project: null,
    //         building: null,
    //         trade: null,
    //         system: null,
    //         sub_system: null,
    //         caption: null,
    //         labels: [],
    //         client: null,
    //         region: null,
    //         site: null,
    //         is_asset_image: null
    //     };
    //     let merged = [];
    //     images.forEach(img => {
    //         Object.keys(commonFields).forEach(key => {
    //             if (commonFields[key] !== false) {
    //                 if (key !== "caption") {
    //                     commonFields[key] = !commonFields[key]
    //                         ? img[key]?.id
    //                         : commonFields[key] && commonFields[key] !== img[key]?.id
    //                         ? false
    //                         : commonFields[key] && commonFields[key] === img[key]?.id
    //                         ? img[key]?.id
    //                         : null;
    //                 } else {
    //                     commonFields[key] = !commonFields[key]
    //                         ? img[key]
    //                         : commonFields[key] && commonFields[key] !== img[key]
    //                         ? false
    //                         : commonFields[key] && commonFields[key] === img[key]
    //                         ? img[key]
    //                         : null;
    //                 }
    //             }
    //         });
    //         let eachImgLabel = img.labels.map(elem => elem.name);
    //         merged = [...merged, eachImgLabel];
    //     });
    //     let commonTags = merged.shift().filter(v => {
    //         return merged.every(a => {
    //             return a.indexOf(v) !== -1;
    //         });
    //     });
    //     commonFields.labels = commonTags.map(elem => ({ name: elem }));
    //     return commonFields;
    // };

    handleFileInput = async (files, invalid_files) => {
        const tooManyFiles = invalid_files?.some(file => file.errors?.[0]?.code === "too-many-files");
        this.setState({
            filesCount: files?.length || 0,
            images: files,
            invalid_file_type: invalid_files,
            invalid_error_code: tooManyFiles ? "too-many-files" : "non-image-file",
            showInvalidFileModal: invalid_files.length ? true : false
        });
    };

    getproject = async id => {
        await this.props.getSelectedProject(id);
        const { selectedProject } = this.props.imageReducer;
        await this.setState({
            captionMaxLength: selectedProject.img_length
        });
    };

    handleClientSelect = async id => {
        this.setState({
            imageData: {
                ...this.state.imageData,
                client_id: id,
                region_id: "",
                site_id: "",
                project_id: "",
                building_id: "",
                trade_id: "",
                system_id: "",
                subsystem_id: ""
            }
        });
        this.props.getDropdownList("regions", {
            client_id: id
        });
    };
    handleRegionSelect = async id => {
        this.setState({
            imageData: {
                ...this.state.imageData,
                region_id: id,
                site_id: ""
            }
        });
        this.props.getDropdownList("sites", {
            region_id: id
        });
    };
    handleSiteSelect = async id => {
        this.setState({
            imageData: {
                ...this.state.imageData,
                site_id: id
            }
        });
    };

    handleProjectSelect = async id => {
        // let userId = localStorage.getItem("role") !== "super_admin" ? localStorage.getItem("userId") : null;
        await this.setState({
            imageData: { ...this.state.imageData, project_id: id, building_id: "", trade_id: "", system_id: "", subsystem_id: "" }
        });
        this.getproject(id);
        this.props.getBuildingList({ project_id: id, user_id: this.state.imageData?.user_id });
        this.props.getTradeList({ project_id: id });
        await this.props.getUserDefaultTrade(id);
        const { getUserDefaultTradeResponse } = this.props.imageReducer;
        if (getUserDefaultTradeResponse?.id) {
            this.handleTradeSelect(getUserDefaultTradeResponse?.id);
        }
        this.getLabelList({ project_id: id });
    };
    handleBuildingSelect = async id => {
        await this.setState({ imageData: { ...this.state.imageData, building_id: id } });
    };
    handleTradeSelect = async id => {
        await this.setState({ imageData: { ...this.state.imageData, trade_id: id, system_id: "", subsystem_id: "" } });
        this.props.getSystemList({ project_id: this.state.imageData.project_id, trade_id: id });
    };
    handleSystemSelect = async id => {
        const { imageData } = this.state;
        await this.setState({ imageData: { ...imageData, system_id: id, subsystem_id: "" } });
        this.props.getSubsystemList({ project_id: imageData.project_id, trade_id: imageData.trade_id, system_id: id });
    };
    handleSubsytemSelect = async id => {
        await this.setState({ imageData: { ...this.state.imageData, subsystem_id: id } });
    };

    validate = () => {
        const { imageData, images, isAssetImage } = this.state;
        const { selectedImages } = this.props;
        let errorParams = {};
        let errorMessage = "";
        let showErrorBorder = false;
        if (!isAssetImage) {
            if (!selectedImages?.length && !images?.length) {
                errorMessage = "Please choose images";
                showErrorBorder = true;
            } else if (!imageData.user_id?.trim().length) {
                errorMessage = "No User Found";
                showErrorBorder = true;
                errorParams.user_id = true;
            } else if (!imageData.project_id?.trim().length) {
                errorMessage = "Please select project";
                showErrorBorder = true;
                errorParams.project_id = true;
            } else if (!imageData.building_id?.trim().length) {
                errorMessage = "Please select building";
                showErrorBorder = true;
                errorParams.building_id = true;
            } else if (!imageData.trade_id?.trim().length) {
                errorMessage = "Please select trade";
                showErrorBorder = true;
                errorParams.trade_id = true;
            }
        } else {
            if (!selectedImages?.length && !images?.length) {
                errorMessage = "Please choose images";
                showErrorBorder = true;
            } else if (!imageData.user_id?.trim().length) {
                errorMessage = "No User Found";
                showErrorBorder = true;
                errorParams.user_id = true;
            } else if (!imageData.client_id?.trim().length) {
                errorMessage = "Please select client";
                showErrorBorder = true;
                errorParams.client_id = true;
            } else if (!imageData.region_id?.trim().length) {
                errorMessage = "Please select region";
                showErrorBorder = true;
                errorParams.region_id = true;
            } else if (!imageData.site_id?.trim().length) {
                errorMessage = "Please select site";
                showErrorBorder = true;
                errorParams.site_id = true;
            }
        }

        this.setState({
            showErrorBorder,
            errorParams,
            errorMessage
        });
        if (showErrorBorder) return false;
        return true;
    };

    handleImageUpload = async () => {
        if (this.validate()) {
            let containDuplicates = await this.checkDuplicateImages();
            if (!containDuplicates) {
                this.sendFilesAsChunks();
            } else {
                this.toggleDuplicateModal();
            }
        }
    };

    convertHeicToJpeg = filename => {
        const lowercasedFilename = filename.toLowerCase();
        if (lowercasedFilename.endsWith(".heic") || lowercasedFilename.endsWith(".HEIC")) {
            const newFilename = filename.replace(/\.heic$/i, ".jpeg");
            return newFilename;
        }
        return filename;
    };

    checkDuplicateImages = async () => {
        const {
            imageData: { user_id, project_id, building_id, trade_id, system_id, subsystem_id, client_id, region_id, site_id },
            images,
            isAssetImage
        } = this.state;
        let imageCheckParams = {
            image_list: [],
            user_id,
            project_id,
            building_id,
            trade_id,
            system_id,
            subsystem_id,
            client_id,
            region_id,
            site_id
        };

        images.map(item => imageCheckParams.image_list.push(this.convertHeicToJpeg(item.name)));
        await this.props.checkDuplicateImages(imageCheckParams, isAssetImage);
        const { success, duplicate_list } = this.props.imageReducer.duplicateImages;
        if (success) {
            if (duplicate_list?.length) {
                this.setState({ duplicateImages: duplicate_list });
                return true;
            } else {
                return false;
            }
        } else {
            console.log("something went wrong");
        }
    };

    sendFilesAsChunks = async () => {
        await this.props.setProgressZero(0);
        this.setState({ isUploading: true, startTime: new Date() });
        const { images, overwriteImages, chunkSize } = this.state;
        let fileQueue = [...images];
        let stop = false;
        while (fileQueue.length && !stop) {
            if (fileQueue.length > chunkSize) {
                let tempQueue = fileQueue;
                let chunks = tempQueue.splice(0, chunkSize);
                let chunkOwriteImg = [];
                if (overwriteImages.length) {
                    chunkOwriteImg = overwriteImages.filter(item => chunks.some(chunk => this.convertHeicToJpeg(chunk.name) === item));
                }
                fileQueue = tempQueue;
                const res = await this.uploadToServer(chunks, chunkOwriteImg);
                if (!res) stop = true;
            } else {
                let chunks = fileQueue;
                let chunkOwriteImg = [];
                if (overwriteImages.length) {
                    chunkOwriteImg = overwriteImages.filter(item => chunks.some(chunk => this.convertHeicToJpeg(chunk.name) === item));
                }
                fileQueue = [];
                const res = await this.uploadToServer(chunks, chunkOwriteImg);
                if (!res) stop = true;
            }
        }
        this.setState(
            {
                isUploading: false,
                showSummaryModal: true,
                initialPerce: 0,
                endTime: new Date(),
                alertMessage: stop ? "Upload Failed. Please refresh and try again." : "Upload Completed Successfully"
            },
            () => {
                this.props.refreshImageList();
                // this.props.onCancel();
                this.showAlert();
            }
        );
    };

    uploadToServer = async (data, overwriteImages) => {
        const {
            imageData,
            uploadedFiles: { imagesCount, overWriteCount, lockedImagesCount },
            chunkSize,
            images,
            initialPerce,
            isAssetImage
        } = this.state;
        let totalApiCall = Math.ceil(images?.length / chunkSize);
        let formData = new FormData();
        let forlder_tags = [];
        let tags = this.state.tags.map(tag => tag.name).filter(tag => tag);
        Object.entries(imageData)
            .filter(([key, value]) => value)
            .map(([key, value]) => formData.append(`${key}`, value));

        data.forEach((item, index) => {
            forlder_tags.push(item.path);
            formData.append(`image${index + 1}`, item);
        });
        if (isAssetImage) {
            overwriteImages = { data: overwriteImages };
        }
        formData.append("owrite_images", JSON.stringify(overwriteImages));
        if (isAssetImage) {
            tags = { data: tags };
            forlder_tags = { data: forlder_tags };
            formData.append("tags", JSON.stringify(tags));
            formData.append("folder_tags", JSON.stringify(forlder_tags));
        } else {
            formData.append("tags", JSON.stringify(tags));
            formData.append("folder_tags", JSON.stringify(forlder_tags));
        }

        await this.props.uploadImage(formData, totalApiCall, initialPerce, isAssetImage);
        const { success, error, success_images, overwritten_images, locked_images } = this.props.imageReducer.imageUploadResponse;
        if (success) {
            this.setState({
                uploadedFiles: {
                    imagesCount: imagesCount + success_images?.length + overwritten_images?.length,
                    overWriteCount: overWriteCount + overwritten_images?.length,
                    lockedImagesCount: lockedImagesCount + locked_images?.length
                },
                initialPerce: initialPerce + 100
            });
            return true;
        } else {
            console.log("upload failed", error);
            return false;
        }
    };

    toggleDuplicateModal = () => {
        this.setState({
            showDuplicateModal: !this.state.showDuplicateModal
        });
    };

    renderDuplicateModal = () => {
        const { showDuplicateModal, duplicateImages } = this.state;

        if (!showDuplicateModal) return null;
        return (
            <Portal
                body={
                    <DuplicateModal
                        onCancel={this.toggleDuplicateModal}
                        message={"Duplicate Images Found !"}
                        subMessage={`${
                            duplicateImages?.length > 1 ? `${duplicateImages?.length} Images` : `${duplicateImages?.length} Image`
                        } already exist.`}
                        subMessage1={`Do you want to merge or replace ?`}
                        buttonNo={{ label: "Replace", value: "replace", note: " (Upload all and Overwrite Duplicates)" }}
                        buttonYes={{ label: "Merge", value: "merge", note: " (Upload all and Skip Duplicates)" }}
                        hasCancelButton={true}
                        onSelection={this.onDuplicateSelection}
                    />
                }
                onCancel={this.toggleDuplicateModal}
            />
        );
    };
    // toggleInvalidFileModal = () => {
    //     this.setState({
    //         showInvalidFileModal: !this.state.showInvalidFileModal
    //     });
    // };

    renderInvalidTypeModal = () => {
        const { showInvalidFileModal, invalid_file_type, invalid_error_code } = this.state;

        if (!showInvalidFileModal) return null;
        const invalid_file_count = invalid_file_type && invalid_file_type.length;
        const fileText = invalid_file_count === 1 ? "File" : "Files";
        const message =
            invalid_error_code === "too-many-files"
                ? "You can only upload up to 10 images at a time within a recommendation. If you wish to upload more than 10 images, please use the image management menu."
                : `We Detected and Removed ${invalid_file_count} Non-Image ${fileText}`;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        // heading={"Do you want to clear and lose all changes?"}
                        message={message}
                        singleOk={true}
                        onlyOk={() => this.setState({ showInvalidFileModal: false })}
                        cancel={() => this.setState({ showInvalidFileModal: false })}
                    />
                }
                // onCancel={() => this.setState({ showInvalidFileModal: false })}
            />
        );
    };

    onDuplicateSelection = async type => {
        const { duplicateImages } = this.state;
        this.toggleDuplicateModal();
        switch (type) {
            case "replace":
                await this.setState({ overwriteImages: duplicateImages });
                this.sendFilesAsChunks();
                break;
            case "merge":
                await this.setState(state => {
                    const images = state.images?.filter(img => duplicateImages.some(dupImg => this.convertHeicToJpeg(img.name) !== dupImg));
                    const filesCount = images.length;
                    return { images, filesCount };
                });
                this.sendFilesAsChunks();
                break;

            default:
                break;
        }
    };

    cancelForm = () => {
        const { initialValues, imageData, images, initialImages, initialTags, tags, image_changed } = this.state;

        if (
            (_.isEqual(initialImages, images) && _.isEqual(initialTags, tags) && !image_changed && this.state.imgchang?.ui?.submenu === false) ||
            (this.state.imgchang?.ui?.submenu === undefined && _.isEqual(initialValues, imageData))
        ) {
            this.props.onCancel();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };
    handleTabChangeConfirm = () => {
        if (this.state.imgchang?.ui?.submenu !== false && this.state.currentTab === "edit image") {
            this.setState({
                showConfirmModalLose: true
            });
        } else {
            this.handleTabChange("details");
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
                        heading={"Do you want to cancel and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => this.props.onCancel()}
                        cancel={() => this.setState({ showConfirmModal: false })}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    validateEdit = editedDatas => {
        let errorParams = {};
        let errorMessage = "";
        let showErrorBorder = false;
        if (editedDatas.hasOwnProperty("project_id") && !editedDatas?.project_id?.trim().length) {
            errorMessage = "Please select project";
            showErrorBorder = true;
            errorParams.project_id = true;
        } else if (editedDatas.hasOwnProperty("building_id") && !editedDatas?.building_id?.trim().length) {
            errorMessage = "Please select building";
            showErrorBorder = true;
            errorParams.building_id = true;
        } else if (editedDatas.hasOwnProperty("trade_id") && !editedDatas?.trade_id?.trim().length) {
            errorMessage = "Please select trade";
            showErrorBorder = true;
            errorParams.trade_id = true;
        } else if (editedDatas.hasOwnProperty("client_id") && !editedDatas?.client_id?.trim().length) {
            errorMessage = "Please select client";
            showErrorBorder = true;
            errorParams.client_id = true;
        } else if (editedDatas.hasOwnProperty("region_id") && !editedDatas?.region_id?.trim().length) {
            errorMessage = "Please select region";
            showErrorBorder = true;
            errorParams.region_id = true;
        } else if (editedDatas.hasOwnProperty("site_id") && !editedDatas?.site_id?.trim().length) {
            errorMessage = "Please select site";
            showErrorBorder = true;
            errorParams.site_id = true;
        }
        this.setState({
            showErrorBorder,
            errorParams,
            errorMessage
        });
        if (showErrorBorder) return false;
        return true;
    };

    handleUpdate = async () => {
        let { imageData, initialValues } = this.state;
        const { selectedImages } = this.props;
        let image_ids = [];
        let editedData = {};
        selectedImages.map(img => image_ids.push(img.id));

        // taking edited data only
        Object.entries(imageData).forEach(([key, value]) => {
            if (!_.isEqual(value, initialValues[key])) {
                editedData[key] = value;
            }
        });

        // validating edited fields
        if (this.validateEdit(editedData)) {
            if (editedData.hasOwnProperty("caption") && selectedImages.some(item => item.recommendations?.length)) {
                this.setState({
                    changecaptionmodal: true
                });
            } else {
                this.updateImageData();
            }
        }
    };

    updateImageData = async () => {
        let { imageData, tags, initialTags, initialValues, image_changed } = this.state;
        const { selectedImages } = this.props;
        let image_ids = [];
        let editedData = {};
        selectedImages.map(img => image_ids.push(img.id));
        Object.entries(imageData).forEach(([key, value]) => {
            if (!_.isEqual(value, initialValues[key])) {
                editedData[key] = value;
            }
        });
        this.setState({ isUploading: true });
        // taking removed tags
        tags = tags.map(tag => tag.name).filter(tag => tag);
        let removed_tags = initialTags.filter(object1 => !tags.some(object2 => object1.name === object2)) || [];
        if (removed_tags?.length) {
            removed_tags = removed_tags.map(tag => tag.name);
        }
        // // if image rotated
        if (image_changed && this.state.rotate) {
            await this.props.rotateImages({ degree: this.state.rotate, image_upload_id: selectedImages[0].id });
            const { s3_image_key, s3_thumbnail_key } = this.props.imageReducer.rotateImageResponse;
            selectedImages[0].s3_thumbnail_key = s3_thumbnail_key;
            selectedImages[0].s3_image_key = s3_image_key;
            // this.setState({ image_changed: false, rotate: 0 });
        }

        await this.props.updateImage({ ...editedData, tags, removed_tags, image_ids, rotate: image_changed });
        this.setState({ image_changed: false, rotate: 0 });
        const { success, error, message } = this.props.imageReducer.imageUpdateResponse;
        if (success) {
            this.setState(
                {
                    isUploading: false,
                    alertMessage: message
                },
                () => {
                    // this.props.refreshImageList();
                    this.updateCurrentImages({ editedData, removed_tags, tags });
                    if (!this.isImageEdit) {
                        this.props.onCancel();
                        this.showAlert();
                    }
                }
            );
        } else {
            this.setState(
                {
                    isUploading: false,
                    alertMessage: error
                },
                () => {
                    this.showAlert();
                }
            );
        }
        this.isImageEdit = false;
    };

    renderCaptionChangeConfirmationModal = () => {
        const { changecaptionmodal } = this.state;
        if (!changecaptionmodal) return null;
        return (
            <Portal
                body={
                    <CaptionChangeModal
                        onCancel={() => this.setState({ changecaptionmodal: false })}
                        message={"Do you want the updated Caption pushed to ALL image Captions in recommendations with this image?"}
                        buttonNo={{ label: "No", value: "no", note: "Caption updated ONLY in Image Management Gallery" }}
                        buttonYes={{
                            label: "Yes",
                            value: "yes",
                            note: "Caption updated in Image Management Gallery AND in ALL Recommendations containing this image"
                        }}
                        hasCancelButton={true}
                        onSelection={this.onImageCaptionSelect}
                    />
                }
            />
        );
    };
    onImageCaptionSelect = async type => {
        switch (type) {
            case "no":
                await this.setState({ imageData: { ...this.state.imageData, captionchange: false }, changecaptionmodal: false });
                this.updateImageData();
                break;
            case "yes":
                await this.setState({ imageData: { ...this.state.imageData, captionchange: true }, changecaptionmodal: false });
                this.updateImageData();
                break;

            default:
                break;
        }
    };

    updateCurrentImages = data => {
        this.props.updateImageListAfterUpdate(data, this.props.selectedImages);
    };

    renderConfirmationLabelModal = () => {
        const { showLabelModal, tags, selectedLabelId } = this.state;
        if (!showLabelModal) return null;
        if (showLabelModal)
            return (
                <Portal
                    body={
                        <ConfirmationModal
                            heading={"Do you want to delete this label?"}
                            message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                            type="cancel"
                            onNo={() => this.setState({ showLabelModal: false, selectedLabelId: "" })}
                            onYes={() =>
                                this.setState({
                                    tags: tags.filter((tag, idx) => idx !== selectedLabelId),
                                    showLabelModal: false,
                                    selectedLabelId: ""
                                })
                            }
                        />
                    }
                    onCancel={() => this.setState({ showLabelModal: false, selectedLabelId: "" })}
                />
            );
    };

    labelDelete = index => {
        this.setState({ showLabelModal: true, selectedLabelId: index });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            labelSuggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            labelSuggestions: []
        });
    };

    getSuggestions = value => {
        let { labelList, tags } = this.state;
        labelList = labelList.filter(item => !tags.some(tag => tag.name === item.name));
        const inputValue = value?.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : labelList.filter(item => item.name?.toString()?.toLowerCase().includes(inputValue));
    };

    getSuggestionValue = suggestion => suggestion?.name || "";

    renderSuggestion = suggestion => <span>{suggestion?.name}</span>;

    setRotate = () => {
        this.setState({ image_changed: true });
        if (this.state.rotate === 270) {
            this.setState({ rotate: 0 });
        } else {
            this.setState({ rotate: this.state.rotate + 90 });
        }
    };

    confirmViewNext = () => {
        const { selectedImages, handleNext } = this.props;
        const { initialValues, imageData, images, initialImages, initialTags, tags, image_changed } = this.state;
        if (_.isEqual(initialValues, imageData) && _.isEqual(initialImages, images) && _.isEqual(initialTags, tags) && !image_changed) {
            handleNext(selectedImages[0].id);
        } else {
            this.setState({
                showNextConfirmationModal: true
            });
        }
    };
    confirmViewPrev = () => {
        const { selectedImages, handlePrev } = this.props;
        const { initialValues, imageData, images, initialImages, initialTags, tags, image_changed } = this.state;
        if (_.isEqual(initialValues, imageData) && _.isEqual(initialImages, images) && _.isEqual(initialTags, tags) && !image_changed) {
            handlePrev(selectedImages[0].id);
        } else {
            this.setState({
                showPrevConfirmationModal: true
            });
        }
    };
    renderNextConfirmationModal = () => {
        const { selectedImages, handleNext } = this.props;
        const { showNextConfirmationModal } = this.state;
        if (!showNextConfirmationModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showNextConfirmationModal: false })}
                        onYes={() => {
                            this.setState(initialState);
                            handleNext(selectedImages[0].id);
                        }}
                        cancel={() => this.setState({ showNextConfirmationModal: false })}
                    />
                }
                onCancel={() => this.setState({ showNextConfirmationModal: false })}
            />
        );
    };
    renderPrevConfirmationModal = () => {
        const { selectedImages, handlePrev } = this.props;
        const { showPrevConfirmationModal } = this.state;
        if (!showPrevConfirmationModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showPrevConfirmationModal: false })}
                        onYes={() => {
                            this.setState(initialState);
                            handlePrev(selectedImages[0].id);
                        }}
                        cancel={() => this.setState({ showPrevConfirmationModal: false })}
                    />
                }
                onCancel={() => this.setState({ showPrevConfirmationModal: false })}
            />
        );
    };

    renderImageEditModal = () => {
        const { showImageEditModal } = this.state;
        if (showImageEditModal) {
            return <ImageEditModal />;
        }
        return null;
    };

    handleTabChange = async key => {
        this.setState({ showConfirmModalLose: false, currentTab: key }, () => {
            if (key === "edit image") {
                this.setImageEditor();
            }
        });
    };
    renderConfirmationModalLose = () => {
        const { showConfirmModalLose } = this.state;
        if (!showConfirmModalLose) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to change the tab and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModalLose: false })}
                        onYes={() => {
                            this.handleTabChange("details");
                            this.state.imgchang.destroy();
                        }}
                        cancel={() => this.setState({ showConfirmModalLose: false })}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLose: false })}
            />
        );
    };

    setImageEditor = () => {
        let _this = this;
        if (!this.imageEditorRef.current) {
            return;
        }
        const myTheme = {
            "header.display": "none"
        };
        const { selectedImages = [] } = this.props;
        let loadingImageUrl = selectedImages[0]?.is_edited
            ? `${selectedImages[0]?.s3_eimage_key}?${moment(selectedImages[0]?.updated_at).format()}&date=${Date.now()}
            `
            : `${selectedImages[0]?.s3_image_key}?${moment(selectedImages[0]?.updated_at).format()}&date=${Date.now()}`;
        const tuiEditor = new TuiImageEditor(this.imageEditorRef.current, {
            includeUI: {
                loadImage: {
                    path: loadingImageUrl,
                    name: "SampleImage"
                },
                uiSize: {
                    height: "495px"
                },
                // locale: {
                //     Crop: "Crop Image",
                //     Flip: "Flip",
                //     Rotate: "Rotate",
                //     Draw: "Draw",
                //     Shape: "Shape",
                //     Icon: "Icon",
                //     Mask: "Mask",
                //     Text: "Text",
                //     Filter: "Filter"
                // },
                shape: {
                    strokeWidth: 20
                },
                menu: ["crop", "flip", "rotate", "draw", "shape", "icon", "mask", "text", "filter"],
                menuBarPosition: "left",
                theme: myTheme
            },
            selectionStyle: {
                cornerSize: 50,
                rotatingPointOffset: 1000,
                cornerStyle: "circle",
                cornerStrokeColor: "#FFFFFF",
                cornerColor: "#FFFFFF",
                borderColor: "#FFFFFF",
                transparentCorners: false
            }
        });

        this.setState({
            imgchang: tuiEditor
        });

        // tuiEditor.loadImageFromURL = (function () {
        //     var cached_function = tuiEditor.loadImageFromURL;
        //     function waitUntilImageEditorIsUnlocked(imageEditor) {
        //         return new Promise((resolve, reject) => {
        //             const interval = setInterval(() => {
        //                 if (!tuiEditor._isLocked) {
        //                     clearInterval(interval);
        //                     resolve();
        //                 }
        //             }, 100);
        //         });
        //     }
        //     return function () {
        //         return waitUntilImageEditorIsUnlocked(tuiEditor).then(() => cached_function.apply(this, arguments));
        //     };
        // })();
        // tuiEditor
        //     .loadImageFromURL(loadingImageUrl, "SampleImage")
        //     .then(result => {
        //         tuiEditor.ui.resizeEditor({
        //             // imageSize: {  newHeight: "495px" }
        //         });
        //     })
        //     .catch(err => {
        //         console.error("Something went wrong:!!!!", err);
        //     });
        tuiEditor.ui.shape.options.strokeWidth = 20;
        tuiEditor.ui.shape.options.stroke = "#ff4040";
        tuiEditor.ui.text._els.textRange._value = 250;
        tuiEditor.ui.text._els.textColorpicker._color = "#ff4040";
        tuiEditor.ui.draw.color = "#ff4040";
        // tuiEditor.ui.draw._els.drawColorPicker._color = "#ff4040";
        // tuiEditor.ui.draw._els.drawColorPicker.picker.palette.options.color = "#ff4040";
        // tuiEditor.ui.draw._els.drawColorPicker.picker.options.color = "#ff4040";
        // tuiEditor.ui.draw._els.drawColorPicker.picker.layout.options.color = "#ff4040";
        tuiEditor.ui.icon._els.iconColorpicker._color = "#ff4040";
        window.fabric.Object.prototype.controls.mtr.offsetY = -110;
        document.getElementById("#imageDownload").addEventListener("click", async function (e) {
            const { initialValues, imageData, images, initialImages, initialTags, tags, image_changed } = _this.state;
            _this.isImageEdit = true;
            let currentImageFormat = selectedImages[0].s3_image_key.split(/[#?]/)[0].split(".").pop().trim();
            let currentImageId = selectedImages[0].id;
            let imageUrl = tuiEditor.toDataURL({
                format: currentImageFormat === "jpg" || currentImageFormat === "jpeg" ? "jpeg" : "png",
                quality: 1
            });
            const blobImage = await (await fetch(imageUrl)).blob();
            let formData = new FormData();
            formData.append("image_upload_id", selectedImages[0]?.id);
            formData.append("edit_image", blobImage);
            _this.setState({ isUploading: true });

            let isFieldUpdate =
                _.isEqual(initialValues, imageData) && _.isEqual(initialImages, images) && _.isEqual(initialTags, tags) && !image_changed;

            if (!isFieldUpdate) {
                await _this.handleUpdate();
            }
            await _this.props.saveEditedImage(formData);
            await _this.updateImageData();
            _this.setState(
                {
                    isUploading: false,
                    alertMessage: "Image saved successfully"
                },
                async () => {
                    _this.props.onCancel();
                    _this.showAlert();
                    _this.props.updateImagesAfterEdit(currentImageId, true);
                }
            );
        });
    };

    handleRestoreEditedImage = () => {
        this.setState({
            showRestoreConfirmModal: true
        });
    };

    renderRestoreConfirmationModal = () => {
        const { showRestoreConfirmModal } = this.state;
        if (!showRestoreConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this image?"}
                        message={""}
                        onNo={() => this.setState({ showRestoreConfirmModal: false })}
                        onYes={this.handleRestoreEditedImageConfirm}
                        type={"restore"}
                        isRestore={true}
                    />
                }
                onCancel={() => this.setState({ showRestoreConfirmModal: false })}
            />
        );
    };

    handleRestoreEditedImageConfirm = async () => {
        const { selectedImages = [] } = this.props;
        let currentImageId = selectedImages[0].id;
        this.setState({
            showRestoreConfirmModal: false
        });
        await this.props.restoreEditedImage({ image_upload_id: selectedImages[0]?.id });
        this.setState(
            {
                alertMessage: "Restored image successfully"
            },
            () => {
                this.props.onCancel();
                this.showAlert();
                this.props.updateImagesAfterEdit(currentImageId, false);
            }
        );
    };

    render() {
        const {
            isUploading,
            filesCount,
            imageData,
            showErrorBorder,
            errorMessage,
            uploadedFiles,
            showSummaryModal,
            duplicateImages,
            startTime,
            endTime,
            images,
            tags,
            errorParams,
            labelSuggestions,
            user_name,
            currentTab,
            isAssetImage
        } = this.state;
        const {
            imageReducer: { projectList, buildingList, tradeList, systemList, subsystemList, uploadProgress },
            assetReducer: { dropDownList },
            selectedImages,
            imageList
        } = this.props;
        let isEdit = selectedImages?.length > 0 ? true : false;
        return (
            <React.Fragment>
                {this.renderDuplicateModal()}
                {this.renderConfirmationModal()}
                {this.renderInvalidTypeModal()}
                {this.renderCaptionChangeConfirmationModal()}

                {this.renderConfirmationModalLose()}
                {this.renderConfirmationLabelModal()}
                {this.renderNextConfirmationModal()}
                {this.renderPrevConfirmationModal()}
                {this.renderRestoreConfirmationModal()}
                {showSummaryModal ? (
                    <SummaryModal
                        onCancel={this.props.onCancel}
                        images={images}
                        startTime={startTime}
                        endTime={endTime}
                        uploadedFiles={uploadedFiles}
                        duplicateImages={duplicateImages}
                    />
                ) : (
                    <div
                        id="modalId-image"
                        className="modal modal-region modal-img-upload edit-img-wrap"
                        style={{ display: "block", cursor: "move" }}
                    >
                        <ReactTooltip id={selectedImages[0]?.id} effect="solid" place="left" backgroundColor="#1383D9" />

                        <Draggable cancel=".not-draggable">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    {selectedImages?.length === 1 && isEdit && (
                                        <div>
                                            <button
                                                className={`arrow-butn-left ${selectedImages[0]?.id === imageList[0]?.id ? "cursor-diabled" : ""}`}
                                                disabled={selectedImages[0]?.id === imageList[0]?.id}
                                                onClick={() => this.confirmViewPrev()}
                                                data-place="top"
                                                data-effect="solid"
                                                data-tip="Previous"
                                                data-for={selectedImages[0]?.id}
                                            >
                                                <i class="fas fa-chevron-left"></i>
                                            </button>

                                            <button
                                                class={`arrow-butn-right ${
                                                    selectedImages[0]?.id === imageList[imageList.length - 1]?.id ? "cursor-diabled" : ""
                                                }`}
                                                disabled={selectedImages[0]?.id === imageList[imageList.length - 1]?.id}
                                                onClick={() => this.confirmViewNext()}
                                                data-place="top"
                                                data-effect="solid"
                                                data-tip="Next"
                                                data-for={selectedImages[0]?.id}
                                            >
                                                <i class="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}
                                    <div className="modal-header">
                                        <h3>
                                            {selectedImages?.length > 1 ? "Edit Images" : selectedImages?.length ? "Edit Image" : "Upload Images"}
                                        </h3>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.cancelForm}>
                                            <span aria-hidden="true">
                                                <img src="/img/close.svg" alt="" />
                                            </span>
                                        </button>
                                    </div>

                                    <div className="modal-body region-otr outer-right-tabpane">
                                        {isEdit ? (
                                            <ul className="nav-ul-tab">
                                                <li
                                                    className={currentTab === "details" ? "active cursor-hand" : "cursor-hand"}
                                                    onClick={() => this.handleTabChangeConfirm("details")}
                                                >
                                                    Edit Details
                                                </li>
                                                <li
                                                    className={currentTab === "edit image" ? "active cursor-hand" : "cursor-hand"}
                                                    onClick={() => this.handleTabChange("edit image")}
                                                >
                                                    Edit Image
                                                </li>
                                            </ul>
                                        ) : null}
                                        {currentTab === "edit image" ? (
                                            <>
                                                <div ref={this.imageEditorRef} className="not-draggable"></div>
                                                {/* <div class="btn-outer text-right" id="#editImageButtons">
                                                    <button class="btn-save mr-3">
                                                        <img src="img/save-icn.svg" /> Save
                                                    </button>
                                                    <button class="btn-cancel mr-3">
                                                        <img src="img/cancel-ico-mod.svg" /> Cancel
                                                    </button>
                                                    <button class="btn-save btn-reset">
                                                        <img src="img/reset-ico-mod.svg" />{" "}
                                                    </button>
                                                </div> */}
                                            </>
                                        ) : (
                                            <div className="form-area flex-wrap">
                                                <div className="form-sec">
                                                    <div className="form-group">
                                                        <label>User</label>
                                                        <input
                                                            disabled
                                                            type="text"
                                                            value={imageData.user_id ? user_name : ""}
                                                            className="form-control not-draggable"
                                                            placeholder="Username"
                                                        />
                                                    </div>
                                                    <SelectBox
                                                        className="not-draggable"
                                                        label="Is Asset Image"
                                                        disabled={isEdit}
                                                        value={isAssetImage}
                                                        handleChange={e => this.setState({ isAssetImage: e.target.value === "true" })}
                                                        hasEmptySelect={false}
                                                        optionsList={[
                                                            { id: true, name: "Yes" },
                                                            { id: false, name: "No" }
                                                        ]}
                                                    />
                                                    {isAssetImage ? (
                                                        <>
                                                            <SelectBox
                                                                className="not-draggable"
                                                                label="Client *"
                                                                value={imageData.client_id}
                                                                handleChange={e => this.handleClientSelect(e.target.value)}
                                                                disabled={this.props.isAssignView}
                                                                optionsList={dropDownList?.clients || []}
                                                                showErrorBorder={showErrorBorder && errorParams.client_id}
                                                            />
                                                            <SelectBox
                                                                className="not-draggable"
                                                                label="Region *"
                                                                value={imageData.region_id}
                                                                handleChange={e => this.handleRegionSelect(e.target.value)}
                                                                disabled={this.props.isAssignView}
                                                                optionsList={dropDownList?.regions || []}
                                                                showErrorBorder={showErrorBorder && errorParams.region_id}
                                                            />
                                                            <SelectBox
                                                                className="not-draggable"
                                                                label="Site *"
                                                                value={imageData.site_id}
                                                                handleChange={e => this.handleSiteSelect(e.target.value)}
                                                                disabled={this.props.isAssignView}
                                                                optionsList={dropDownList?.sites || []}
                                                                showErrorBorder={showErrorBorder && errorParams.site_id}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <SelectBox
                                                                className="not-draggable"
                                                                label="Project *"
                                                                value={imageData.project_id}
                                                                handleChange={e => this.handleProjectSelect(e.target.value)}
                                                                disabled={this.props.isAssignView}
                                                                optionsList={projectList?.projects}
                                                                showErrorBorder={showErrorBorder && errorParams.project_id}
                                                            />
                                                            <SelectBox
                                                                className="not-draggable"
                                                                label="Building *"
                                                                value={imageData.building_id}
                                                                disabled={this.props.isAssignView}
                                                                handleChange={e => this.handleBuildingSelect(e.target.value)}
                                                                isBuilding
                                                                optionsList={imageData?.project_id ? buildingList?.buildings : []}
                                                                showErrorBorder={showErrorBorder && errorParams.building_id}
                                                            />
                                                            <SelectBox
                                                                className="not-draggable"
                                                                label={`Trade *`}
                                                                value={imageData.trade_id}
                                                                disabled={this.props.isAssignView}
                                                                handleChange={e => this.handleTradeSelect(e.target.value)}
                                                                optionsList={imageData?.project_id ? tradeList?.trades : []}
                                                                showErrorBorder={showErrorBorder && errorParams.trade_id}
                                                            />
                                                            <SelectBox
                                                                className="not-draggable"
                                                                label="System"
                                                                disabled={this.props.isAssignView}
                                                                value={imageData.system_id}
                                                                handleChange={e => this.handleSystemSelect(e.target.value)}
                                                                optionsList={imageData?.trade_id ? systemList?.systems : []}
                                                            />
                                                            <SelectBox
                                                                className="not-draggable"
                                                                label="Sub System"
                                                                disabled={this.props.isAssignView}
                                                                value={imageData.subsystem_id}
                                                                handleChange={e => this.handleSubsytemSelect(e.target.value)}
                                                                optionsList={imageData?.system_id ? subsystemList?.sub_systems : []}
                                                            />
                                                        </>
                                                    )}

                                                    {isEdit ? (
                                                        <div className="form-group col-md-12 p-0">
                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                <label>Caption</label>
                                                                <span style={{ color: "#7D8185" }}>
                                                                    {imageData.caption?.trim().length ? imageData.caption?.trim().length : 0}/
                                                                    {this.state.captionMaxLength}
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                maxLength={this.state.captionMaxLength}
                                                                value={imageData.caption}
                                                                onChange={e => {
                                                                    resetCursor(e);
                                                                    this.setState({
                                                                        imageData: { ...imageData, caption: toTitleCase(e.target.value) }
                                                                    });
                                                                }}
                                                                className="form-control not-draggable"
                                                                placeholder="Caption"
                                                            />
                                                            {!imageData.caption && this.props.assetName && (
                                                                <label class="container-check mt-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={imageData.caption}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                imageData: {
                                                                                    ...imageData,
                                                                                    caption: e.target.checked ? this.props.assetName : ""
                                                                                }
                                                                            })
                                                                        }
                                                                        className="form-control not-draggable"
                                                                    />
                                                                    <span class="checkmark"></span> Copy Asset Name
                                                                </label>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="upload-area not-draggable position-relative">
                                                    <label>{isEdit ? "" : "Upload Images"}</label>
                                                    <UploadContainer
                                                        isEdit={isEdit}
                                                        handleFileInput={this.handleFileInput}
                                                        filesCount={selectedImages?.length || filesCount}
                                                        isUploading={isUploading}
                                                        uploadedFiles={uploadedFiles}
                                                        selectedImages={selectedImages}
                                                        uploadProgress={uploadProgress}
                                                        setRotate={this.setRotate}
                                                        rotate={this.state.rotate}
                                                        isAssignView={this.props.isAssignView}
                                                    />
                                                </div>
                                                <div className="form-group outer col-md-12 p-0 d-flex flex-wrap label-add-outer">
                                                    <label className="col-12 p-0">Common Labels</label>
                                                    {tags.length > 0 &&
                                                        tags.map((item, index) => (
                                                            <div className="form-group d-flex align-items-center label-del col-md-2 pl-0">
                                                                <div className="col-md-10 pl-0 pr-1">
                                                                    <Autosuggest
                                                                        suggestions={labelSuggestions}
                                                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                                        getSuggestionValue={this.getSuggestionValue}
                                                                        renderSuggestion={this.renderSuggestion}
                                                                        inputProps={{
                                                                            type: "text",
                                                                            value: tags[index]?.name || "",
                                                                            onChange: (e, { newValue }) => {
                                                                                tags[index].name = newValue;
                                                                                this.setState({ tags });
                                                                            },
                                                                            className: "form-control not-draggable",
                                                                            placeholder: "Label"
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div class="col-md-2 pl-1 pr-0">
                                                                    <button
                                                                        className="del-button not-draggable"
                                                                        onClick={() => {
                                                                            this.labelDelete(index);
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-trash" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    <button
                                                        className="btn add-button-wrapper not-draggable"
                                                        onClick={() => this.setState({ tags: [...tags, { name: "" }] })}
                                                    >
                                                        + Add
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="btnOtr">
                                            {!isEdit && this.props.isAssignView && (
                                                <span className="not-draggable" style={{ backgroundColor: "#ffff0085" }}>
                                                    Please note: Your images will be added to the gallery with the current recommendation scope after
                                                    uploading, but please wait a few minutes for image processing to complete. Then, you can select
                                                    and assign them to the recommendation.{" "}
                                                </span>
                                            )}
                                            <span className="errorMessage">{errorMessage}</span>

                                            <button
                                                type="button"
                                                className="btn btn-secondary btnClr not-draggable"
                                                data-dismiss="modal"
                                                onClick={this.cancelForm}
                                            >
                                                Cancel
                                            </button>
                                            {this.props.hasDelete ? (
                                                <button
                                                    type="button"
                                                    class="btn btn-primary btnDlt not-draggable"
                                                    onClick={() => this.props.handleDelete(selectedImages)}
                                                >
                                                    Delete{" "}
                                                </button>
                                            ) : null}
                                            {currentTab === "edit image" ? (
                                                <>
                                                    {selectedImages[0]?.is_edited ? (
                                                        <>
                                                            <ReactTooltip
                                                                id={selectedImages[0]?.id}
                                                                effect="solid"
                                                                place="left"
                                                                backgroundColor="#1383D9"
                                                            />
                                                            <button
                                                                class="btn-save btn-reset"
                                                                onClick={() => this.handleRestoreEditedImage()}
                                                                data-place="top"
                                                                data-effect="solid"
                                                                data-tip="Restore Original Image"
                                                                data-for={selectedImages[0]?.id}
                                                            >
                                                                Restore
                                                            </button>
                                                        </>
                                                    ) : null}
                                                    <button
                                                        type="button"
                                                        className={`btn btn-primary btnRgion not-draggable ${
                                                            selectedImages[0]?.is_edited ? "btn-img-save" : ""
                                                        }`}
                                                        id="#imageDownload"
                                                        disabled={isUploading}
                                                    >
                                                        Save{" "}
                                                        {isUploading && <span className="spinner-border spinner-border-sm pl-2" role="status"></span>}
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btnRgion not-draggable"
                                                    disabled={isUploading}
                                                    onClick={isEdit ? this.handleUpdate : this.handleImageUpload}
                                                >
                                                    {isEdit ? "Update" : "Upload Image"}{" "}
                                                    {isUploading && <span className="spinner-border spinner-border-sm pl-2" role="status"></span>}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Draggable>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { imageReducer, assetReducer } = state;
    return { imageReducer, assetReducer };
};

const { getDropdownList } = assetActions;

export default withRouter(connect(mapStateToProps, { ...actions, getDropdownList })(UploadForm));
