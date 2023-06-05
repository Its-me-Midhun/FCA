import React, { Component, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import actions from "../actions";
import MasterFilter from "./MasterFilter";
import AdvancedFilter from "./AdvancedFilter";
import ImageGrid from "./ImageGrid";
import ImageList from "./ImageList";
import Loader from "../../common/components/Loader";
import ImageLogs from "./ImageLogs";

import TopControls from "./TopControls";
import UploadForm from "./Form";
import Portal from "../../common/components/Portal";
import ImageViewModal from "./ImageViewModal";
import BottomControls from "./BottomControls";
import LoadingOverlay from "react-loading-overlay";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import { addToBreadCrumpData, checkPermission } from "../../../config/utils";
import history from "../../../config/history";
import { entities } from "../../common/constants";
import qs from "query-string";
import AutoSizer from "react-virtualized-auto-sizer";
import moment from "moment";
import { MASTER_FILTERS } from "../constants";

export class ImageMain extends PureComponent {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
    }
    state = {
        imageList: [],
        imageParams:
            this.props.imageReducer.entityParams[this.props.match.params.id || this.props.isSmartChartView ? "assign" : "master"].imageParams,
        sortOrder: this.props.imageReducer.entityParams[this.props.match.params.id || this.props.isSmartChartView ? "assign" : "master"].sortOrder,
        isGridView: this.props.imageReducer.entityParams[this.props.match.params.id || this.props.isSmartChartView ? "assign" : "master"].isGridView,
        showAdvancedFilter: false,
        hasMore: false,
        showSelectBox: true,
        selectedImages:
            this.props.imageReducer.entityParams[this.props.match.params.id || this.props.isSmartChartView ? "assign" : "master"].selectedImages,
        selectedDeleteImages: [],
        singleImageEdit: {},
        showUploadSingleForm: false,
        showUploadForm: false,
        showImageViewModal: false,
        selectedImage: {},
        isLoading: false,
        isAssignView: this.props.match.params.id || this.props.isSmartChartView ? true : false,
        showConfirmModal: false,
        assignFilter: "notUsed",
        masterFilters:
            this.props.imageReducer.entityParams[this.props.match.params.id || this.props.isSmartChartView ? "assign" : "master"].masterFilters,
        favFilter: "all",
        showRecommendation: false,
        isFilterReset:
            this.props.imageReducer.entityParams[this.props.match.params.id || this.props.isSmartChartView ? "assign" : "master"].isFilterReset,
        showSelected:
            this.props.imageReducer.entityParams[this.props.match.params.id || this.props.isSmartChartView ? "assign" : "master"].showSelected,
        exportImageLoader: false,
        exportImagePdfLoader: false,
        touchedImageId: null
    };

    componentDidMount = async () => {
        try {
            const { imageParams, showSelected, selectedImages } = this.state;
            let index = sessionStorage.getItem("imageIndex") ? parseInt(sessionStorage.getItem("imageIndex")) : 0;
            let selectedImage = sessionStorage.getItem("selectedImage") ? JSON.parse(sessionStorage.getItem("selectedImage")) : null;
            let limit = Math.ceil((index + 1) / imageParams.limit) * imageParams.limit;
            if (selectedImage?.id) {
                this.setState({ selectedImage: selectedImage, showImageViewModal: true });
                sessionStorage.removeItem("selectedImage");
            }
            await this.getInitialFilters();
            await this.refreshImageList(false, limit);
            if (index) {
                let scrollItem = Math.floor(index / 5);
                this.scrollRef.current.scrollToItem(scrollItem);
                this.setState({ touchedImageId: showSelected ? selectedImages[index]?.id : this.state.imageList[index]?.id });
                sessionStorage.removeItem("imageIndex");
            }
        } catch (error) {
            console.log(error);
        }
    };

    refreshImageList = async (isFetchMore = false, limit) => {
        await this.setState({ isLoading: !isFetchMore ? true : false });
        if (!isFetchMore) {
            await this.setState({
                imageList: [],
                hasMore: false,
                imageParams: { ...this.state.imageParams, offset: 1, limit: limit ? limit : this.state.imageParams?.limit }
                // selectedImages: []
            });
            this.updateEntityParams();
            this.props.updateSelectedImages(this.state.selectedImages);
        }
        const {
            match: {
                params: { id }
            },
            entity
        } = this.props;

        if (id) {
            if (entity === entities.RECOMMENDATIONS) {
                await this.props.getAllImagesByRecommendation(this.state.imageParams, id);
            } else if (entity === entities.NARRATIVES) {
                const {
                    location: { search }
                } = this.props;
                const query = qs.parse(search);
                let params = {
                    ...this.state.imageParams,
                    project_id: query.pid,
                    building_id: query.building_id,
                    narratable_id: query.narratable_id,
                    narratable_type: query.narratable_type
                };
                await this.props.getAllImagesByNarrative(params);
            }
        } else {
            await this.props.getAllImages(this.state.imageParams);
        }
        const { success, images, count } = this.props.imageReducer.imagesResponse;
        if (success) {
            await this.setState({ imageList: isFetchMore ? [...this.state.imageList, ...images] : images, totalCount: count });
            this.setState({ hasMore: this.state.imageList.length >= count ? false : true });
        }
        this.setState({ isLoading: false });
    };

    getInitialFilters = async () => {
        const {
            match: {
                params: { id }
            }
        } = this.props;
        // recommendation pull view
        if (id) {
            await this.resetEntityParams();
            const { entityData, entity } = this.props;

            if (entity === entities.RECOMMENDATIONS) {
                let params = {
                    project_ids: [entityData.project?.id],
                    building_ids: [entityData.building?.id]
                };
                // getting trade list based on recommendation (project, building)
                await this.props.getFilterLists("trades", params);
                const {
                    masterFilterList: { trades }
                } = this.props.imageReducer;
                let trade_ids = trades?.length && trades.some(el => el.id === entityData?.trade?.id) ? [entityData?.trade?.id] : [];

                // getting system list based on recommendation (project, building, trade)
                await this.props.getFilterLists("systems", params);
                const {
                    masterFilterList: { systems }
                } = this.props.imageReducer;
                let system_ids = systems?.length && systems.some(el => el.id === entityData?.system?.id) ? [entityData?.system?.id] : [];

                // getting sub system list based on recommendation (project, building, trade, system)
                await this.props.getFilterLists("sub_systems", { ...params, system_ids });
                const {
                    masterFilterList: { sub_systems }
                } = this.props.imageReducer;
                let sub_system_ids =
                    sub_systems?.length && sub_systems.some(el => el.id === entityData?.sub_system?.id) ? [entityData?.sub_system?.id] : [];
                await this.setState({
                    imageParams: {
                        ...this.state.imageParams,
                        ...params,
                        trade_ids,
                        system_ids,
                        sub_system_ids
                    },
                    masterFilters: {
                        trade_ids,
                        system_ids,
                        sub_system_ids,
                        user_ids: [],
                        image_tag_ids: []
                    }
                });
            } else if (entity === entities.NARRATIVES) {
                const {
                    location: { search }
                } = this.props;
                const query = qs.parse(search);
                let params = {
                    project_ids: [query.pid],
                    building_ids: [query.building_id],
                    trade_ids: [query.trade_id]
                };
                let system_ids = [];
                let sub_system_ids = [];
                if (query.narratable_type === "System") {
                    // getting system list based on narrative (project, building, trade)
                    await this.props.getFilterLists("systems", params);
                    const {
                        masterFilterList: { systems }
                    } = this.props.imageReducer;
                    system_ids = systems?.length && systems.some(el => el.id === query.narratable_id) ? [query.narratable_id] : [];
                } else if (query.narratable_type === "SubSystem") {
                    // getting system list based on narrative (project, building, trade)
                    await this.props.getFilterLists("systems", params);
                    const {
                        masterFilterList: { systems }
                    } = this.props.imageReducer;
                    system_ids = systems?.length && systems.some(el => el.id === query.system_id) ? [query.system_id] : [];
                    // getting sub system list based on narrative (project, building, trade, system)
                    await this.props.getFilterLists("sub_systems", { ...params, system_ids });
                    const {
                        masterFilterList: { sub_systems }
                    } = this.props.imageReducer;
                    sub_system_ids = sub_systems?.length && sub_systems.some(el => el.id === query.narratable_id) ? [query.narratable_id] : [];
                }

                await this.setState({
                    imageParams: {
                        ...this.state.imageParams,
                        ...params,
                        system_ids,
                        sub_system_ids
                    },
                    masterFilters: {
                        system_ids,
                        sub_system_ids,
                        user_ids: [],
                        image_tag_ids: []
                    }
                });
            }
        } else {
            //smartchart image pull view
            const { entity } = this.props;
            if (entity === entities.SMART_CHARTS) {
                if (this.props?.selectedFilters?.client_ids?.length) {
                    await this.setState({
                        imageParams: {
                            ...this.state.imageParams,
                            client_ids: [...this.props.selectedFilters.client_ids]
                        },
                        masterFilters: { ...this.state.masterFilters, client_ids: [...this.props.selectedFilters.client_ids] }
                    });
                }
            } else {
                //master view
                if (!this.state.isFilterReset && !this.isMasterFiltered()) {
                    await this.props.getFilterLists("clients");
                    const { defaultClient } = this.props.imageReducer;
                    if (defaultClient) {
                        await this.setState({
                            imageParams: {
                                ...this.state.imageParams,
                                client_ids: [defaultClient]
                            },
                            masterFilters: { ...this.state.masterFilters, client_ids: [defaultClient] }
                        });
                    }
                }
            }
        }
    };
    isMasterFiltered = () => {
        let flag = false;
        MASTER_FILTERS.forEach(item => {
            if (this.state.imageParams[item.paramKey]?.length) {
                flag = true;
                return;
            }
        });
        return flag;
    };

    updateMasterFilters = masterFilters => {
        // const { masterFilters } = this.state;
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    ...masterFilters,
                    offset: 1
                },
                masterFilters
            },
            () => {
                this.updateEntityParams();
                this.refreshImageList();
            }
        );
    };

    // handleMasterFilterSelect = async (selectedFilter, selectedData, isChecked) => {
    //     const { masterFilters } = this.state;
    //     if (isChecked) {
    //         await this.setState({ masterFilters: { ...masterFilters, [selectedFilter]: [...masterFilters[selectedFilter], selectedData] } });
    //     } else {
    //         await this.setState({
    //             masterFilters: { ...masterFilters, [selectedFilter]: masterFilters[selectedFilter].filter(k => k !== selectedData) }
    //         });
    //     }
    //     this.updateEntityParams();
    // };
    // handleMasterFilterSelectAll = async (selectedFilter, selectedDatas, isChecked) => {
    //     const { masterFilters } = this.state;
    //     let temp = [];
    //     selectedDatas.map(data => temp.push(data.id));
    //     await this.setState({ masterFilters: { ...masterFilters, [selectedFilter]: isChecked ? temp : [] } });
    //     this.updateEntityParams();
    // };

    handleGlobalSearch = search => {
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    search,
                    offset: 1
                }
            },
            () => {
                this.updateEntityParams();
                this.refreshImageList();
            }
        );
    };

    handleLimitChange = value => {
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    offset: 1,
                    limit: value
                }
            },
            () => {
                this.updateEntityParams();
                this.refreshImageList();
            }
        );
    };

    updateAdvancedFilters = filters => {
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    offset: 1,
                    filters
                }
            },
            () => {
                this.updateEntityParams();
                this.refreshImageList();
            }
        );
    };

    updateRecomAssignedFilter = assigned => {
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    offset: 1,
                    recommendation_image_assigned_true: assigned || null
                }
            },
            () => {
                this.updateEntityParams();
                this.refreshImageList();
            }
        );
    };

    updateImageModifyFilter = assigned => {
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    offset: 1,
                    image_modify_filter: assigned || null
                }
            },
            () => {
                this.updateEntityParams();
                this.refreshImageList();
            }
        );
    };
    updateAssetImage = assigned => {
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    offset: 1,
                    is_asset_image: assigned || null
                }
            },
            () => {
                this.updateEntityParams();
                this.refreshImageList();
            }
        );
    };

    fetchMoreImages = () => {
        const { imageParams } = this.state;
        this.setState(
            {
                imageParams: { ...imageParams, offset: imageParams.offset + 1 }
            },
            () => this.refreshImageList(true)
        );
    };

    toggleAdvancedFilters = () => {
        this.setState({ showAdvancedFilter: !this.state.showAdvancedFilter });
    };

    setGridView = async bool => {
        await this.setState({ isGridView: bool });
        this.updateEntityParams();
    };

    handleMultiSelectImage = (img, isChecked) => {
        const { selectedImages } = this.state;
        this.setState({ selectedImages: isChecked ? [...selectedImages, img] : selectedImages.filter(t => t.id !== img.id) }, () => {
            this.props.updateSelectedImages(this.state.selectedImages);
            this.updateEntityParams();
        });
    };

    handleSelectAll = async isChecked => {
        let temp = this.state.imageList;
        if (this.state.isAssignView) {
            temp = temp.filter(img => img.not_assigned);
        }
        await this.setState({ selectedImages: isChecked ? temp : [] });
        if (!isChecked) {
            this.setState({ showSelected: false });
        }
        this.props.updateSelectedImages(this.state.selectedImages);
    };

    handleSort = sortValue => {
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    offset: 1,
                    order: sortValue ? { [sortValue]: this.state.sortOrder } : null
                }
            },
            () => {
                this.updateEntityParams();
                this.refreshImageList();
            }
        );
    };
    handleSortOrder = order => {
        const { imageParams } = this.state;
        this.setState({ sortOrder: order });
        if (imageParams.order) {
            this.setState(
                {
                    imageParams: {
                        ...imageParams,
                        offset: 1,
                        order: { [Object.keys(imageParams.order)[0]]: order }
                    }
                },
                () => {
                    this.updateEntityParams();
                    this.refreshImageList();
                }
            );
        }
    };

    handleMultiEditImage = e => {
        e.preventDefault();
        this.setState({ showUploadForm: !this.state.showUploadForm });
    };

    handleEditImage = (data, key) => {
        if (key === "next" || key === "prev") {
            this.setState({ singleEditimage: [data], touchedImageId: data.id, showUploadSingleForm: true });
        } else {
            this.setState({ singleEditimage: [data], touchedImageId: data.id, showUploadSingleForm: !this.state.showUploadSingleForm });
        }
    };

    handleDeleteImage = async images => {
        // checking if the selected image mapped to any recommendations
        let recomAssigned = images.some(img => img?.recommendations?.length);
        if (recomAssigned) {
            this.setState({ alertMessage: "Image(s) cannot be deleted. It is used by one or more recommendations" }, () => this.showLongAlert());
        } else {
            this.setState({
                showConfirmModal: true,
                selectedDeleteImages: images
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        let selected_count = this.state.selectedDeleteImages.length;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={
                            selected_count == 1 || selected_count == 0
                                ? `Do you want to delete this image: `
                                : ` Do you want to delete ${selected_count} images:`
                        }
                        message={
                            selected_count == 1 || selected_count == 0
                                ? `This action cannot be reverted, are you sure that you need to delete this image?`
                                : `This action cannot be reverted, are you sure that you need to delete these images?`
                        }
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteImageOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteImageOnConfirm = async () => {
        const { selectedDeleteImages } = this.state;
        let { imageList } = this.state;
        this.setState({
            showConfirmModal: false,
            isLoading: true
        });
        let imgIds = selectedDeleteImages.map(img => img.id);
        await this.props.deleteImage({ deleteImages: imgIds });
        const { status, message } = this.props.imageReducer.deleteImageResponse;

        if (!status) {
            await this.setState({
                alertMessage: message || "Something went wrong. please try again.",
                showConfirmModal: false
            });
            this.showLongAlert();
        } else {
            // await this.refreshImageList();
            imageList = imageList.filter(img => !imgIds.includes(img.id));
            await this.setState({
                showConfirmModal: false,
                alertMessage: message,
                selectedImages: [],
                selectedDeleteImages: [],
                showUploadForm: false,
                selectedImage: {},
                showImageViewModal: false,
                showUploadSingleForm: false,
                imageList,
                showSelected: false
            });
            this.showLongAlert();
        }

        this.setState({
            isLoading: false
        });
    };

    showLongAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    handleAddImage = e => {
        e.preventDefault();
        this.setState({ selectedImages: [], selectedImage: {}, showUploadForm: !this.state.showUploadForm });
    };

    renderUploadModal = () => {
        const { showUploadForm, selectedImages, selectedImage } = this.state;
        if (!showUploadForm) return null;
        const { entityData, entity, AssetName } = this.props;
        let assetName = "";
        if (entity === entities.RECOMMENDATIONS && entityData.recommendation_type === "asset" && AssetName) {
            assetName = this.props.AssetName;
        }
        return (
            <Portal
                body={
                    <UploadForm
                        assetName={assetName}
                        isAssignView={this.state.isAssignView}
                        selectedImages={selectedImages}
                        refreshImageList={this.refreshImageList}
                        onCancel={() => this.setState({ showUploadForm: false })}
                        handleDelete={this.handleDeleteImage}
                        hasDelete={checkPermission("forms", "image_management", "delete")}
                        handleNext={this.handleNextForm}
                        handlePrev={this.handlePrevForm}
                        imageList={this.state.imageList}
                        entityData={this.props.entityData}
                        updateImagesAfterEdit={this.updateImagesAfterEdit}
                        updateImageListAfterUpdate={this.updateImageListAfterUpdate}
                    />
                }
                onCancel={() => this.setState({ showUploadForm: false })}
            />
        );
    };

    renderUploadSingleModal = () => {
        const { showUploadSingleForm, singleEditimage } = this.state;
        if (!showUploadSingleForm) return null;
        const { entityData, entity, AssetName } = this.props;
        let assetName = "";
        if (entity === entities.RECOMMENDATIONS && entityData.recommendation_type === "asset" && AssetName) {
            assetName = this.props.AssetName;
        }
        return (
            <Portal
                body={
                    <UploadForm
                        assetName={assetName}
                        isAssignView={this.state.isAssignView}
                        selectedImages={singleEditimage}
                        refreshImageList={this.refreshImageList}
                        onCancel={() => this.setState({ showUploadSingleForm: false })}
                        handleDelete={this.handleDeleteImage}
                        hasDelete={checkPermission("forms", "image_management", "delete")}
                        handleNext={this.handleNextForm}
                        handlePrev={this.handlePrevForm}
                        imageList={this.state.imageList}
                        entityData={this.props.entityData}
                        updateImagesAfterEdit={this.updateImagesAfterEdit}
                        updateImageListAfterUpdate={this.updateImageListAfterUpdate}
                    />
                }
                onCancel={() => this.setState({ showUploadSingleForm: false })}
            />
        );
    };

    viewImageModal = data => {
        this.setState({ selectedImage: data, showImageViewModal: true, touchedImageId: data?.id });
    };

    toggleLogsModal = () => {
        this.setState({
            openLogs: !this.state.openLogs
        });
    };

    renderLogsModal = () => {
        const { openLogs } = this.state;
        if (!openLogs) return null;
        return <Portal body={<ImageLogs onCancel={this.toggleLogsModal} />} onCancel={this.toggleLogsModal} />;
    };

    renderImageViewModal = () => {
        const { showImageViewModal, selectedImage, isAssignView, showSelected, selectedImages, imageList } = this.state;
        if (!showImageViewModal) return null;
        return (
            <Portal
                body={
                    <ImageViewModal
                        hasEdit={checkPermission("forms", "image_management", "edit")}
                        selectedImg={selectedImage}
                        onCancel={() => this.setState({ showImageViewModal: false })}
                        handleEdit={this.handleEditImage}
                        handleFavClick={this.handleFavClick}
                        viewRecommendations={this.viewRecommendations}
                        isAssignView={isAssignView}
                        handleNext={this.handleNext}
                        handlePrev={this.handlePrev}
                        imageList={showSelected ? selectedImages : imageList}
                        handleInputCaptionData={this.handleInputCaptionData}
                        viewAssets={this.viewAssets}
                    />
                }
                onCancel={() => this.setState({ showImageViewModal: false })}
            />
        );
    };

    resetAll = () => {
        const { limit, offset } = this.state.imageParams;
        const {
            match: {
                params: { id }
            },
            entityData
        } = this.props;
        this.setState({ imageParams: { ...this.state.imageParams, order: { name: "asc" } }, sortOrder: "asc", showAdvancedFilter: false });
        if (id) {
            const { entity } = this.props;
            if (entity === entities.RECOMMENDATIONS) {
                this.setState({
                    imageParams: {
                        limit,
                        offset,
                        order: { name: "asc" },
                        sortOrder: "asc",
                        filters: {},
                        search: "",
                        project_ids: [entityData.project?.id],
                        building_ids: [entityData.building?.id],
                        trade_ids: [entityData.trade?.id]
                    },
                    masterFilters: {
                        project_ids: [entityData.project?.id],
                        building_ids: [entityData.building?.id],
                        trade_ids: [entityData.trade?.id],
                        system_ids: [],
                        sub_system_ids: [],
                        user_ids: [],
                        image_tag_ids: [],
                        client_ids: [],
                        region_ids: [],
                        site_ids: []
                    }
                });
            } else if (entity === entities.NARRATIVES) {
                const {
                    location: { search }
                } = this.props;
                const query = qs.parse(search);
                this.setState({
                    imageParams: {
                        limit,
                        offset,
                        order: { name: "asc" },
                        sortOrder: "asc",
                        filters: {},
                        search: "",
                        project_ids: [query.pid],
                        building_ids: [query.building_id],
                        trade_ids: [query.trade_id]
                    },
                    masterFilters: {
                        project_ids: [query.pid],
                        building_ids: [query.building_id],
                        trade_ids: [query.trade_id],
                        system_ids: [],
                        sub_system_ids: [],
                        user_ids: [],
                        image_tag_ids: [],
                        client_ids: [],
                        region_ids: [],
                        site_ids: []
                    }
                });
            }
        } else {
            const { defaultClient } = this.props.imageReducer;
            this.setState({
                imageParams: {
                    limit,
                    offset,
                    order: { name: "asc" },
                    sortOrder: "asc",
                    search: "",
                    filters: {},
                    client_ids: defaultClient ? [defaultClient] : []
                },
                masterFilters: {
                    client_ids: defaultClient ? [defaultClient] : [],
                    building_ids: [],
                    trade_ids: [],
                    system_ids: [],
                    sub_system_ids: [],
                    user_ids: [],
                    image_tag_ids: [],
                    project_ids: [],
                    region_ids: [],
                    site_ids: []
                },
                isFilterReset: true
            });
        }
        this.updateEntityParams();
        this.refreshImageList();
    };

    resetAllFilters = () => {
        const { limit, offset, order } = this.state.imageParams;
        const {
            match: {
                params: { id }
            },
            entityData
        } = this.props;
        if (id) {
            const { entity } = this.props;
            if (entity === entities.RECOMMENDATIONS) {
                this.setState(
                    {
                        imageParams: {
                            limit,
                            offset,
                            order,
                            filters: {},
                            search: "",
                            project_ids: [entityData.project?.id],
                            building_ids: [entityData.building?.id],
                            trade_ids: [entityData.trade?.id]
                        },
                        masterFilters: {
                            project_ids: [entityData.project?.id],
                            building_ids: [entityData.building?.id],
                            trade_ids: [entityData.trade?.id],
                            system_ids: [],
                            sub_system_ids: [],
                            user_ids: [],
                            image_tag_ids: [],
                            client_ids: [],
                            region_ids: [],
                            site_ids: []
                        },
                        showAdvancedFilter: false
                    },
                    () => this.refreshImageList()
                );
            } else if (entity === entities.NARRATIVES) {
                const {
                    location: { search }
                } = this.props;
                const query = qs.parse(search);
                this.setState(
                    {
                        imageParams: {
                            limit,
                            offset,
                            order,
                            filters: {},
                            search: "",
                            project_ids: [query.pid],
                            building_ids: [query.building_id],
                            trade_ids: [query.trade_id]
                        },
                        masterFilters: {
                            project_ids: [query.pid],
                            building_ids: [query.building_id],
                            trade_ids: [query.trade_id],
                            system_ids: [],
                            sub_system_ids: [],
                            user_ids: [],
                            image_tag_ids: [],
                            client_ids: [],
                            region_ids: [],
                            site_ids: []
                        },
                        showAdvancedFilter: false
                    },
                    () => this.refreshImageList()
                );
            }
        } else {
            const { defaultClient } = this.props.imageReducer;
            this.setState(
                {
                    imageParams: { limit, offset, order, search: "", filters: {}, client_ids: defaultClient ? [defaultClient] : [] },
                    masterFilters: {
                        client_ids: defaultClient ? [defaultClient] : [],
                        building_ids: [],
                        trade_ids: [],
                        system_ids: [],
                        sub_system_ids: [],
                        user_ids: [],
                        image_tag_ids: [],
                        project_ids: [],
                        region_ids: [],
                        site_ids: []
                    },
                    isFilterReset: true,
                    showAdvancedFilter: false
                },
                () => {
                    this.updateEntityParams();
                    this.refreshImageList();
                }
            );
        }
    };
    resetSort = () => {
        this.setState({ imageParams: { ...this.state.imageParams, order: { name: "asc" } }, sortOrder: "asc" }, () => {
            this.updateEntityParams();
            this.refreshImageList();
        });
    };

    handleChangeAssignFilter = value => {
        this.setState({ assignFilter: value });
    };

    handleChangeFavFilter = value => {
        this.setState({ favFilter: value });
    };

    handleFavClick = async (id, favourite) => {
        await this.setState(prevState => {
            const imageList = prevState.imageList.map(item => {
                if (item.id === id) {
                    item.favourite = favourite;
                    return item;
                } else return item;
            });
            const selectedImages = prevState.selectedImages.map(item => {
                if (item.id === id) {
                    item.favourite = favourite;
                    return item;
                } else return item;
            });
            return { imageList, selectedImages };
        });

        this.props.addToFav({ id, favourite });
    };

    viewRecommendations = selectedImage => {
        const { imageList, showImageViewModal, showSelected, selectedImages } = this.state;
        let currImgList = showSelected ? selectedImages : imageList;
        let selectedProject = selectedImage.project?.id || "";
        let selectedIndex = currImgList?.findIndex(item => item?.id === selectedImage?.id);
        sessionStorage.setItem("imageIndex", selectedIndex);
        sessionStorage.setItem("selectedImage", showImageViewModal ? JSON.stringify(selectedImage) : null);
        addToBreadCrumpData({
            key: "Name",
            name: selectedImage.name,
            path: `/images/imageInfo/${selectedImage.id}/recommendations?pid=${selectedProject}`
        });
        addToBreadCrumpData({
            key: "assignedInfo",
            name: "Recommendations",
            path: `/images/imageInfo/${selectedImage.id}/recommendations?pid=${selectedProject}`
        });
        history.push(`/images/imageInfo/${selectedImage.id}/recommendations?pid=${selectedProject}`);
    };
    viewAssets = selectedImage => {
        const { imageList, showImageViewModal, showSelected, selectedImages } = this.state;
        let currImgList = showSelected ? selectedImages : imageList;
        let selectedProject = selectedImage.project?.id || "";
        let selectedIndex = currImgList?.findIndex(item => item?.id === selectedImage?.id);
        sessionStorage.setItem("imageIndex", selectedIndex);
        sessionStorage.setItem("selectedImage", showImageViewModal ? JSON.stringify(selectedImage) : null);
        addToBreadCrumpData({
            key: "Name",
            name: selectedImage.name,
            path: `/images/imageInfo/${selectedImage.id}/assets?pid=${selectedProject}`
        });
        addToBreadCrumpData({
            key: "assignedInfo",
            name: "Assets",
            path: `/images/imageInfo/${selectedImage.id}/assets?pid=${selectedProject}`
        });
        history.push(`/images/imageInfo/${selectedImage.id}/assets?pid=${selectedProject}`);
    };

    updateEntityParams = async () => {
        const { imageParams, masterFilters, isGridView, sortOrder, isFilterReset, showSelected, selectedImages } = this.state;
        let entityParams = {
            imageParams,
            masterFilters,
            isGridView,
            sortOrder,
            isFilterReset,
            showSelected,
            selectedImages,
            type: this.props.match.params.id ? "assign" : "master"
        };
        await this.props.updateEntityParams(entityParams);
    };

    resetEntityParams = async () => {
        await this.setState({
            isGridView: true,
            imageParams: {
                limit: 100,
                offset: 1,
                search: "",
                filters: {},
                order: null
            },
            sortOrder: "asc",
            masterFilters: {
                client_ids: [],
                project_ids: [],
                region_ids: [],
                site_ids: [],
                building_ids: [],
                trade_ids: [],
                system_ids: [],
                sub_system_ids: [],
                user_ids: [],
                image_tag_ids: []
            },
            isFilterReset: false,
            showSelected: false,
            selectedImages: []
        });
        this.updateEntityParams();
    };

    toggleShowSelected = async e => {
        e.preventDefault();
        await this.setState({ showSelected: !this.state.showSelected });
        this.updateEntityParams();
    };

    exportImages = async images => {
        let params = [];
        let project_id = images.every(img => img.project?.id === images[0]?.project?.id) ? images[0]?.project?.id : "";
        let building_name = images.every(img => img.building?.id === images[0]?.building?.id) ? images[0]?.building?.name : "";
        let trade_id = images.every(img => img.trade?.id === images[0]?.trade?.id) ? images[0]?.trade?.id : "";
        images.forEach(element => {
            params.push({
                key: element.s3_image_key,
                caption: element.caption,
                building: element.building.name,
                name: element.name,
                trade: element.trade.name
            });
        });
        this.setState({ exportImageLoader: true });
        await this.props.exportImages({ image_list: params, project_id, building_name, trade_id, username: localStorage.getItem("user") });
        this.setState({ exportImageLoader: false });
    };

    exportImagesPdf = async images => {
        let params = [];
        let project_id = images.every(img => img.project?.name === images[0]?.project?.name) ? images[0]?.project?.id : "";
        let building_name = images.every(img => img.building?.id === images[0]?.building?.id) ? images[0]?.building?.name : "";
        let trade_id = images.every(img => img.trade?.id === images[0]?.trade?.id) ? images[0]?.trade?.id : "";
        images.forEach(element => {
            params.push({
                key: element.s3_image_key,
                caption: element.caption,
                building: element.building.name,
                name: element.name,
                trade: element.trade.name
            });
        });
        this.setState({ exportImagePdfLoader: true });
        await this.props.exportImagesPdf({ image_list: params, project_id, building_name, trade_id, username: localStorage.getItem("user") });
        this.setState({ exportImagePdfLoader: false });
    };
    handleNext = id => {
        const { selectedImages, isAssignView, assignFilter, showSelected } = this.state;
        let imageList = this.state.imageList;
        if (isAssignView && assignFilter === "notUsed") {
            imageList = imageList.filter(img => img.not_assigned);
        }
        imageList = showSelected ? selectedImages : imageList;
        let current_index = imageList?.findIndex(item => item.id === id);
        let selectedImage = imageList[current_index + 1];
        selectedImage?.id && this.viewImageModal(selectedImage);
    };

    updateImagesAfterEdit = async (id, isEdit = false) => {
        const { success, s3_image_key } = this.props.imageReducer.saveEditedImageResponse;
        if (success) {
            await this.setState(prevState => {
                const imageList = prevState.imageList.map(item => {
                    if (item.id === id) {
                        item.is_edited = isEdit;
                        item.s3_eimage_key = isEdit ? s3_image_key : "";
                        return item;
                    } else return item;
                });
                const selectedImages = prevState.selectedImages.map(item => {
                    if (item.id === id) {
                        item.is_edited = isEdit;
                        item.s3_eimage_key = isEdit ? s3_image_key : "";
                        return item;
                    } else return item;
                });
                return { imageList, selectedImages };
            });
        }
    };

    updateImageListAfterUpdate = async (data, editedImages) => {
        const {
            imageReducer: {
                projectList: { projects },
                buildingList: { buildings },
                tradeList: { trades },
                systemList: { systems },
                subsystemList: { sub_systems }
            },
            assetReducer: { dropDownList }
        } = this.props;
        const { editedData, removed_tags, tags } = data;
        editedImages.forEach(({ id }) => {
            this.setState(prevState => {
                const imageList = prevState.imageList.map(item => {
                    if (item.id === id) {
                        // updating the existing images if any data changed
                        item.project = editedData.hasOwnProperty("project_id")
                            ? projects?.filter(p => p.id === editedData.project_id)[0] || {}
                            : item.project;
                        item.building = editedData.hasOwnProperty("building_id")
                            ? buildings?.filter(p => p.id === editedData.building_id)[0] || {}
                            : item.building;
                        item.trade = editedData.hasOwnProperty("trade_id") ? trades?.filter(p => p.id === editedData.trade_id)[0] || {} : item.trade;
                        item.system = editedData.hasOwnProperty("system_id")
                            ? systems?.filter(p => p.id === editedData.system_id)[0] || {}
                            : item.system;
                        item.sub_system = editedData.hasOwnProperty("subsystem_id")
                            ? sub_systems?.filter(p => p.id === editedData.subsystem_id)[0] || {}
                            : item.sub_system;
                        item.caption = editedData.hasOwnProperty("caption") ? editedData.caption : item.caption;
                        item.updated_at = moment().format();

                        item.client = editedData.hasOwnProperty("client_id")
                            ? dropDownList?.clients?.filter(p => p.id === editedData.client_id)[0] || {}
                            : item.client;
                        item.region = editedData.hasOwnProperty("region_id")
                            ? dropDownList?.regions?.filter(p => p.id === editedData.region_id)[0] || {}
                            : item.region;
                        item.site = editedData.hasOwnProperty("site_id")
                            ? dropDownList?.sites?.filter(p => p.id === editedData.site_id)[0] || {}
                            : item.site;
                        // removing the the tags
                        if (removed_tags.length) {
                            item.labels = item.labels.filter(fi => removed_tags.forEach(rem => rem !== fi.name));
                        }
                        // adding newly created tags
                        tags.forEach(tag => {
                            if (item.labels.findIndex(lab => lab.name === tag) === -1) {
                                item.labels.push({ name: tag });
                            }
                        });
                        return item;
                    } else return item;
                });
                const selectedImages = prevState.selectedImages.map(item => {
                    if (item.id === id) {
                        // updating the existing images if any data changed
                        item.project = editedData.hasOwnProperty("project_id")
                            ? projects?.filter(p => p.id === editedData.project_id)[0] || {}
                            : item.project;
                        item.building = editedData.hasOwnProperty("building_id")
                            ? buildings?.filter(p => p.id === editedData.building_id)[0] || {}
                            : item.building;
                        item.trade = editedData.hasOwnProperty("trade_id") ? trades?.filter(p => p.id === editedData.trade_id)[0] || {} : item.trade;
                        item.system = editedData.hasOwnProperty("system_id")
                            ? systems?.filter(p => p.id === editedData.system_id)[0] || {}
                            : item.system;
                        item.sub_system = editedData.hasOwnProperty("subsystem_id")
                            ? sub_systems?.filter(p => p.id === editedData.subsystem_id)[0] || {}
                            : item.sub_system;
                        item.caption = editedData.hasOwnProperty("caption") ? editedData.caption : item.caption;
                        item.updated_at = moment().format();

                        item.client = editedData.hasOwnProperty("client_id")
                            ? dropDownList?.clients?.filter(p => p.id === editedData.client_id)[0] || {}
                            : item.client;
                        item.region = editedData.hasOwnProperty("region_id")
                            ? dropDownList?.regions?.filter(p => p.id === editedData.region_id)[0] || {}
                            : item.region;
                        item.site = editedData.hasOwnProperty("site_id")
                            ? dropDownList?.sites?.filter(p => p.id === editedData.site_id)[0] || {}
                            : item.site;
                        // removing the the tags
                        if (removed_tags.length) {
                            item.labels = item.labels.filter(fi => removed_tags.forEach(rem => rem !== fi.name));
                        }
                        // adding newly created tags
                        tags.forEach(tag => {
                            if (item.labels.findIndex(lab => lab.name === tag) === -1) {
                                item.labels.push({ name: tag });
                            }
                        });
                        return item;
                    } else return item;
                });

                return { imageList, selectedImages };
            });
        });
    };

    handlePrev = id => {
        const { selectedImages, isAssignView, assignFilter, showSelected } = this.state;
        let imageList = this.state.imageList;
        if (isAssignView && assignFilter === "notUsed") {
            imageList = imageList.filter(img => img.not_assigned);
        }
        imageList = showSelected ? selectedImages : imageList;
        let current_index = imageList?.findIndex(item => item.id === id);
        let selectedImage = imageList[current_index - 1];
        selectedImage?.id && this.viewImageModal(selectedImage);
    };
    handleNextForm = id => {
        const { selectedImages, isAssignView, assignFilter, showSelected } = this.state;
        let imageList = this.state.imageList;
        if (isAssignView && assignFilter === "notUsed") {
            imageList = imageList.filter(img => img.not_assigned);
        }
        imageList = showSelected ? selectedImages : imageList;
        let current_index = imageList?.findIndex(item => item.id === id);
        let selectedImage = imageList[current_index + 1];
        this.handleEditImage(selectedImage, "next");
    };
    handlePrevForm = id => {
        const { selectedImages, isAssignView, assignFilter, showSelected } = this.state;
        let imageList = this.state.imageList;
        if (isAssignView && assignFilter === "notUsed") {
            imageList = imageList.filter(img => img.not_assigned);
        }
        imageList = showSelected ? selectedImages : imageList;
        let current_index = imageList?.findIndex(item => item.id === id);
        let selectedImage = imageList[current_index - 1];
        this.handleEditImage(selectedImage, "prev");
    };
    handleInputCaptionData = async caption => {
        let caption_id = caption?.image_ids[0];
        if (caption_id) {
            this.setState(prevState => {
                const imageList = prevState.imageList.map(item => {
                    if (item.id === caption_id) {
                        item.caption = caption?.caption;
                        return item;
                    } else return item;
                });
                const selectedImages = prevState.selectedImages.map(item => {
                    if (item.id === caption_id) {
                        item.caption = caption?.caption;
                        return item;
                    } else return item;
                });
                return { imageList, selectedImages };
            });
        }
    };

    render() {
        const {
            showAdvancedFilter,
            isGridView,
            hasMore,
            showSelectBox,
            selectedImages,
            imageParams,
            totalCount,
            sortOrder,
            isLoading,
            isAssignView,
            assignFilter,
            masterFilters,
            favFilter,
            showSelected,
            exportImageLoader,
            exportImagePdfLoader,
            touchedImageId
        } = this.state;
        const { isSmartChartView = false } = this.props;
        let hasEdit = checkPermission("forms", "image_management", "edit");
        let hasCreate = checkPermission("forms", "image_management", "create");
        let hasDelete = checkPermission("forms", "image_management", "delete");
        let imageList = this.state.imageList;
        if (isAssignView && assignFilter === "notUsed" && !isSmartChartView) {
            imageList = imageList.filter(img => img.not_assigned);
        }
        imageList = showSelected ? selectedImages : imageList;

        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                <>
                    <div
                        className={`dtl-sec col-md-12 image-manage ${isAssignView && `pull-img-box`} ${showAdvancedFilter ? "filter-open" : ""}`}
                        id="main"
                    >
                        {this.renderUploadModal()}
                        {this.renderUploadSingleModal()}
                        {this.renderImageViewModal()}
                        {this.renderLogsModal()}
                        {this.renderConfirmationModal()}
                        <>
                            <div className="flt-area-new">
                                <MasterFilter
                                    toggleAdvancedFilters={this.toggleAdvancedFilters}
                                    onAddImage={this.handleAddImage}
                                    setGridView={this.setGridView}
                                    updateMasterFilters={this.updateMasterFilters}
                                    isAssignView={isAssignView}
                                    imageParams={imageParams}
                                    hasCreate={hasCreate}
                                    // handleValueSelect={this.handleMasterFilterSelect}
                                    // handleValueSelectAll={this.handleMasterFilterSelectAll}
                                    masterFilters={masterFilters}
                                    isSmartChartView={isSmartChartView}
                                />
                                {showAdvancedFilter && (
                                    <AdvancedFilter
                                        filters={imageParams.filters}
                                        updateAdvancedFilters={this.updateAdvancedFilters}
                                        updateRecomAssignedFilter={this.updateRecomAssignedFilter}
                                        updateImageModifyFilter={this.updateImageModifyFilter}
                                        updateAssetImage={this.updateAssetImage}
                                        imageParams={imageParams}
                                    />
                                )}
                            </div>
                            <TopControls
                                showLogs={this.toggleLogsModal}
                                onEditImage={this.handleMultiEditImage}
                                selectedImages={selectedImages}
                                imageList={imageList}
                                handleSelectAll={this.handleSelectAll}
                                handleGlobalSearch={this.handleGlobalSearch}
                                params={imageParams}
                                handleSort={this.handleSort}
                                handleSortOrder={this.handleSortOrder}
                                sortOrder={sortOrder}
                                isAssignView={isAssignView}
                                resetAllFilters={this.resetAllFilters}
                                resetSort={this.resetSort}
                                hasEdit={hasEdit}
                                handleChangeAssignFilter={this.handleChangeAssignFilter}
                                assignFilter={assignFilter}
                                refreshImages={this.refreshImageList}
                                handleChangeFavFilter={this.handleChangeFavFilter}
                                favFilter={favFilter}
                                resetAll={this.resetAll}
                                toggleShowSelected={this.toggleShowSelected}
                                showSelected={showSelected}
                                exportImages={this.exportImages}
                                exportImagesPdf={this.exportImagesPdf}
                                exportImageLoader={exportImageLoader}
                                exportImagePdfLoader={exportImagePdfLoader}
                                isSmartChartView={isSmartChartView}
                            />
                        </>
                        {isGridView ? (
                            <div className={`infinite-scroll-component infinite-scroll`}>
                                <AutoSizer>
                                    {({ width, height }) => {
                                        width = width - 10;
                                        return (
                                            <div className={"image-sec"} style={{ width, height }}>
                                                <ImageGrid
                                                    imageData={imageList}
                                                    showSelectBox={showSelectBox}
                                                    handleMultiSelectImage={this.handleMultiSelectImage}
                                                    selectedImages={selectedImages}
                                                    viewImageModal={this.viewImageModal}
                                                    handleEdit={this.handleEditImage}
                                                    handleDelete={this.handleDeleteImage}
                                                    fetchMoreImages={this.fetchMoreImages}
                                                    hasMore={hasMore}
                                                    isAssignView={isAssignView}
                                                    hasDelete={hasDelete}
                                                    hasEdit={hasEdit}
                                                    handleFavClick={this.handleFavClick}
                                                    viewRecommendations={this.viewRecommendations}
                                                    height={height}
                                                    width={width}
                                                    handleInputCaptionData={this.handleInputCaptionData}
                                                    viewAssets={this.viewAssets}
                                                    listRef={this.scrollRef}
                                                    touchedImageId={touchedImageId}
                                                    isSmartChartView={isSmartChartView}
                                                />
                                            </div>
                                        );
                                    }}
                                </AutoSizer>
                            </div>
                        ) : (
                            <div className={"cnt-sec"}>
                                <ImageList
                                    imageData={imageList}
                                    showSelectBox={showSelectBox}
                                    handleMultiSelectImage={this.handleMultiSelectImage}
                                    selectedImages={selectedImages}
                                    viewImageModal={this.viewImageModal}
                                    handleEdit={this.handleEditImage}
                                    handleDelete={this.handleDeleteImage}
                                    fetchMoreImages={this.fetchMoreImages}
                                    hasMore={hasMore}
                                    isAssignView={isAssignView}
                                    hasDelete={hasDelete}
                                    hasEdit={hasEdit}
                                    handleFavClick={this.handleFavClick}
                                    viewRecommendations={this.viewRecommendations}
                                    handleInputCaptionData={this.handleInputCaptionData}
                                />
                            </div>
                        )}
                        <BottomControls
                            handleLimitChange={this.handleLimitChange}
                            loadedCount={imageList.length}
                            totalCount={totalCount}
                            limit={imageParams.limit}
                        />
                    </div>
                </>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { imageReducer, assetReducer } = state;
    return { imageReducer, assetReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(ImageMain));
