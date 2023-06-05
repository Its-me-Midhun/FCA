import React from "react";
import { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

import ChartMain from "./ChartMain";
import ChartItemConfigModal from "./ChartItemConfigModal";
import Portal from "../../common/components/Portal";
import { CHART_ITEMS, DEFAULT_PROPERTY_VALUE, DOC_AND_IMAGE_BANDS } from "../constants";
import { shiftObjectProps } from "../utils";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import DocumentsMain from "./DoucmentsMain";
import actions from "../actions";
import { reorderArray, findPrevPathFromBreadCrump, popBreadCrumpData, addToBreadCrumpData } from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";
import SaveAsConfirmationModal from "../../project/components/MergeOrReplaceModalSelection";
import EntityDataEditModal from "./SmartChartDataEditForm";
import ImageBandConfigModal from "./ImageBandConfigModal";
import ImageListForBandModal from "./ImageListForBandModal";

const CreateSmartChart = ({
    getSmartChartMasterFilterDropDown,
    projectsDropdownData,
    exportSmartChartData,
    exportSmartChartDataResponse,
    masterFilterList,
    saveSmartChartData,
    saveSmartChartResponse = {},
    refreshTableData,
    deleteUserDocs,
    updateUserDocData,
    updateSmartChartProperty,
    viewReports,
    ...props
}) => {
    const [projectId, setProjectId] = useState("");
    const [chartData, setChartData] = useState({
        // user: localStorage.getItem("userId"),
        name: "",
        notes: "",
        properties_text: {
            project: {
                band1: {
                    mfilter: {},
                    type: {}
                }
            },
            assets: {
                band1: {
                    mfilter: {},
                    type: {}
                }
            },
            energy_mng: {
                band1: {
                    mfilter: {},
                    type: {}
                }
            }
        }
    });
    const [copyChartData, setCopyChartData] = useState({});
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const [chartsOrder, setChartsOrder] = useState({
        project: Object.keys(CHART_ITEMS.project),
        energy_mng: Object.keys(CHART_ITEMS.energy_mng),
        assets: Object.keys(CHART_ITEMS.assets)
    });
    const [showChartItemConfigModal, setShowChartItemConfigModal] = useState(false);
    const [selectedChartConfigData, setSelectedChartConfigData] = useState({});
    const [userDocs, setUserDocs] = useState([]);
    const firstRender = useRef(false);
    const [selectedExportProperty, setSelectedExportProperty] = useState("");
    const [selectedExportTemplate, setSelectedExportTemplate] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [chartConfigOrder, setChartConfigOrder] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDocDeleteConfirmModal, setShowDocDeleteConfirmModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState("");
    const [enableExport, setEnableExport] = useState(false);
    const [savedChartData, setSavedChartData] = useState(null);
    const initialData = useRef(null);
    const [selectedProperty, setSelectedProperty] = useState(props.location?.state?.property ? { ...props.location.state.property } : null);
    const [userImages, setUserImages] = useState([]);
    const isEdit = props.match.params.viewType && props.match.params.viewType === "edit" ? true : false;
    const [propertyName, setPropertyName] = useState("");
    const [isSaveAndExport, setIsSaveAndExport] = useState(false);
    const [showSaveAsConfirmationModal, setShowSaveAsConfirmationModal] = useState(false);
    const [showNewTemplateEditModal, setShowNewTemplateEditModal] = useState(false);
    const [showImageBandConfigModal, setShowImageBandConfigModal] = useState(false);
    const [showImageListForBandModal, setShowImageListForBandModal] = useState(false);
    const [isImageListView, setIsImageListView] = useState(false);
    const [showImageBandDeleteConfirmationModal, setShowImageBandDeleteConfirmationModal] = useState(false);
    const [imageBandData, setImageBandData] = useState({});
    const [toggleImageBandEditModal, setToggleImageBandEditModal] = useState(false);

    useEffect(() => {
        if (selectedProperty) {
            setPropertyName(selectedProperty.name);
            setChartData(prevChartData => {
                return {
                    ...prevChartData,
                    name: selectedProperty.name,
                    notes: selectedProperty.notes,
                    properties_text: JSON.parse(selectedProperty.properties_text)
                };
            });
            let updatedChartsOrderData = setChartsDataForEdit();
            setChartsOrder(updatedChartsOrderData);
            initialData.current = {
                ...chartData,
                name: selectedProperty.name,
                notes: selectedProperty.notes,
                properties_text: JSON.parse(selectedProperty.properties_text)
            };
        } else {
            initialData.current = { ...chartData };
        }
        props.getClientDropDownData();
        setCopyChartData({
            // user: localStorage.getItem("userId"),
            name: "",
            notes: "",
            properties_text: {
                ...DEFAULT_PROPERTY_VALUE
            }
        });
    }, []);

    useEffect(() => {
        if (props.smartChartReducer.uploadedDocListResponse?.data) {
            setUserDocs([...props.smartChartReducer.uploadedDocListResponse.data]);
        }
    }, [props.smartChartReducer.uploadedDocListResponse]);

    useEffect(() => {
        if (props.smartChartReducer.uploadedImageListResponse?.data) {
            setUserImages([...props.smartChartReducer.uploadedImageListResponse.data]);
        }
    }, [props.smartChartReducer.uploadedImageListResponse]);

    useEffect(() => {
        let clientList = props?.smartChartReducer?.getClientDropDownDataResponse?.data || [];
        if (clientList.length) {
            let defaultClient = null;
            if (selectedProperty) {
                defaultClient = { id: selectedProperty.client_id };
            } else {
                defaultClient = clientList.find(client => client.default == true);
            }
            if (defaultClient) {
                setSelectedClient(defaultClient.id);
                props.getTemplatePropertiesList({ client_id: defaultClient.id });
                props.getTemplateList({ client_id: defaultClient.id });
            }
        }
    }, [props.smartChartReducer.getClientDropDownDataResponse]);

    useEffect(() => {
        if (selectedClient) {
            refreshUploadedDocList();
            refreshUploadedImageList();
        }
    }, [selectedClient]);

    useEffect(() => {
        let propertyList = props?.smartChartReducer?.getTemplatePropertiesListResponse?.data || [];
        if (propertyList.length) {
            let defaultProperty = null;
            if (isEdit) {
                defaultProperty = { id: selectedProperty.template_property_id };
            } else {
                defaultProperty =
                    propertyList.find(property => property.sm_default === true) || propertyList.find(property => property.default === true);
            }
            if (defaultProperty) {
                setSelectedExportProperty(defaultProperty.id);
            }
        }
        let templateList = props?.smartChartReducer?.getTemplateListResponse?.data || [];
        if (templateList.length) {
            let defaultTemplate = null;
            if (isEdit) {
                defaultTemplate = { id: selectedProperty.template_id };
            } else {
                defaultTemplate =
                    templateList.find(property => property.sm_default === true) || templateList.find(property => property.default === true);
            }
            if (defaultTemplate) {
                setSelectedExportTemplate(defaultTemplate.id);
            }
        }
    }, [props.smartChartReducer.getTemplatePropertiesListResponse, props.smartChartReducer.getTemplateListResponse]);

    useEffect(() => {
        if (props.smartChartReducer.deleteUserDocResponse?.success && selectedDoc) {
            showAlert("Document deleted successfully");
            setSelectedDoc("");
        }
    }, [props.smartChartReducer.deleteUserDocResponse]);

    useEffect(() => {
        if (savedChartData) {
            if (_.isEqual(chartData, savedChartData) && !enableExport) {
                setEnableExport(true);
            }
            if (enableExport && !_.isEqual(chartData, savedChartData)) {
                setEnableExport(false);
            }
        }
    }, [chartData, savedChartData]);

    const setChartsDataForEdit = () => {
        let newChartsOrderData = {};
        let currentPropertyData = JSON.parse(selectedProperty.properties_text) || {};
        newChartsOrderData = Object.keys(currentPropertyData).reduce((resultData, currentProp, index) => {
            let defaultKeys = Object.keys(CHART_ITEMS[currentProp]);
            let selectedKeys = Object.keys(currentPropertyData[currentProp].band1.type);
            let updatedDefaultKeys = defaultKeys.filter(dKey => !selectedKeys.includes(dKey));

            return { ...resultData, [currentProp]: [...selectedKeys, ...updatedDefaultKeys] };
        }, {});
        return newChartsOrderData;
    };

    const setSmartChartData = (action, params = {}) => {
        const {
            bandName,
            chartKey,
            chart_view,
            chartConfigData = {},
            mfilterKey = "",
            filterValues = [],
            defaultValue = {},
            orderedKeys = {},
            isSelectAll,
            docId,
            entity,
            filterKey,
            configOrder = [],
            dropDownData = [],
            filterLabel,
            mediaKey,
            additionalKeysForConfig = {},
            imageBandConfig = {},
            imageBandKey
        } = params;
        switch (action) {
            case "mfilter":
                if (mfilterKey === "years") {
                    setChartData(prevState => {
                        return {
                            ...prevState,
                            properties_text: {
                                ...prevState.properties_text,
                                [entity]: {
                                    ...prevState.properties_text[entity],
                                    [bandName]: {
                                        ...prevState.properties_text[entity][bandName],
                                        mfilter: {
                                            ...removeMfilterEmptyKeys({
                                                ...prevState.properties_text[entity][bandName].mfilter,
                                                start: filterValues.start,
                                                end: filterValues.end
                                            })
                                        },
                                        filter_label: prevState.properties_text[entity][bandName]?.filter_label
                                            ? {
                                                  ...removeMfilterEmptyKeys({
                                                      ...prevState.properties_text[entity][bandName].filter_label,
                                                      ["start_year"]: filterValues.start ? [filterValues.start] : [],
                                                      ["end_year"]: filterValues.end ? [filterValues.end] : []
                                                  })
                                              }
                                            : {
                                                  ...removeMfilterEmptyKeys({
                                                      ["start_Year"]: filterValues.start ? [filterValues.start] : [],
                                                      ["end_Year"]: filterValues.end ? [filterValues.end] : []
                                                  })
                                              }
                                    }
                                }
                            }
                        };
                    });
                } else {
                    setChartData(prevState => {
                        return {
                            ...prevState,
                            properties_text: {
                                ...prevState.properties_text,
                                [entity]: {
                                    ...prevState.properties_text[entity],
                                    [bandName]: {
                                        ...prevState.properties_text[entity][bandName],
                                        mfilter: {
                                            ...removeMfilterEmptyKeys({
                                                ...prevState.properties_text[entity][bandName].mfilter,
                                                [mfilterKey]: [...filterValues],
                                                ...removeMfilterKeys(filterKey)
                                            })
                                        },
                                        filter_label: prevState.properties_text[entity][bandName]?.filter_label
                                            ? {
                                                  ...removeMfilterEmptyKeys({
                                                      ...prevState.properties_text[entity][bandName].filter_label,
                                                      [filterLabel]: [...getSelectedFilterNameFormIds(dropDownData, filterValues)]
                                                  })
                                              }
                                            : {
                                                  ...removeMfilterEmptyKeys({
                                                      [filterLabel]: [...getSelectedFilterNameFormIds(dropDownData, filterValues)]
                                                  })
                                              }
                                    }
                                }
                            }
                        };
                    });
                }

                break;
            case "customize_chart":
                if (params?.is_remove) {
                    setChartData(prevState => {
                        return {
                            ...prevState,
                            properties_text: {
                                ...prevState.properties_text,
                                [entity]: {
                                    ...prevState.properties_text[entity],
                                    [bandName]: {
                                        ...prevState.properties_text[entity][bandName],
                                        type: {
                                            ..._.omit(prevState.properties_text[entity][bandName].type, [chartKey])
                                        }
                                    }
                                }
                            }
                        };
                    });
                } else {
                    let prevChartConfig = copyChartData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey] || null;
                    setChartData(prevState => {
                        return {
                            ...prevState,
                            properties_text: {
                                ...prevState.properties_text,
                                [entity]: {
                                    ...prevState.properties_text[entity],
                                    [bandName]: {
                                        ...prevState.properties_text[entity][bandName],
                                        type: {
                                            ...shiftObjectProps(
                                                {
                                                    ...prevState.properties_text[entity][bandName].type,
                                                    [chartKey]: prevChartConfig ? prevChartConfig : defaultValue
                                                },
                                                chartsOrder[entity]
                                            )
                                        }
                                    }
                                }
                            }
                        };
                    });
                }
                break;
            case "config_chart":
                let newChartData = {};
                if (chartKey === "sorted_recom") {
                    newChartData = {
                        ...chartData,
                        properties_text: {
                            ...chartData.properties_text,
                            [entity]: {
                                ...chartData.properties_text[entity],
                                [bandName]: {
                                    ...chartData.properties_text[entity][bandName],
                                    type: {
                                        ...chartData.properties_text[entity][bandName].type,
                                        [chartKey]: {
                                            band1: {
                                                mfilter: {},
                                                type: ["building"],
                                                ...additionalKeysForConfig
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    setCopyChartData(prevState => {
                        return {
                            ...prevState,
                            properties_text: {
                                ...prevState.properties_text,
                                [entity]: {
                                    ...prevState.properties_text[entity],
                                    [bandName]: {
                                        ...prevState.properties_text[entity][bandName],
                                        type: {
                                            ...prevState.properties_text[entity][bandName].type,
                                            [chartKey]: {
                                                band1: {
                                                    mfilter: {},
                                                    type: ["building"],
                                                    ...additionalKeysForConfig
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        };
                    });
                } else {
                    newChartData = {
                        ...chartData,
                        properties_text: {
                            ...chartData.properties_text,
                            [entity]: {
                                ...chartData.properties_text[entity],
                                [bandName]: {
                                    ...chartData.properties_text[entity][bandName],
                                    type: {
                                        ...chartData.properties_text[entity][bandName].type,
                                        [chartKey]: { ...shiftObjectProps({ ...chartConfigData }, [...configOrder]), ...additionalKeysForConfig }
                                    }
                                }
                            }
                        }
                    };
                    setCopyChartData(prevState => {
                        return {
                            ...prevState,
                            properties_text: {
                                ...prevState.properties_text,
                                [entity]: {
                                    ...prevState.properties_text[entity],
                                    [bandName]: {
                                        ...prevState.properties_text[entity][bandName],
                                        type: {
                                            ...prevState.properties_text[entity][bandName].type,
                                            [chartKey]: { ...shiftObjectProps({ ...chartConfigData }, [...configOrder]), ...additionalKeysForConfig }
                                        }
                                    }
                                }
                            }
                        };
                    });
                    setChartConfigOrder(prevChartConfigOrder => {
                        return {
                            ...prevChartConfigOrder,
                            [chartKey]: [...configOrder]
                        };
                    });
                }
                setChartData({ ...newChartData });
                break;
            case "dnd":
                setChartsOrder(prevOrder => {
                    return {
                        ...prevOrder,
                        [entity]: orderedKeys
                    };
                });
                setChartData(prevState => {
                    return {
                        ...prevState,
                        properties_text: {
                            ...prevState.properties_text,
                            [entity]: {
                                ...prevState.properties_text[entity],
                                [bandName]: {
                                    ...prevState.properties_text[entity][bandName],
                                    type: {
                                        ...shiftObjectProps(
                                            {
                                                ...prevState.properties_text[entity][bandName].type
                                            },
                                            orderedKeys
                                        )
                                    }
                                }
                            }
                        }
                    };
                });
                break;
            case "selectAll":
                if (!isSelectAll) {
                    setChartData(prevState => {
                        return {
                            ...prevState,
                            properties_text: {
                                ...prevState.properties_text,
                                [entity]: {
                                    ...prevState.properties_text[entity],
                                    [bandName]: {
                                        ...prevState.properties_text[entity][bandName],
                                        type: {}
                                    }
                                }
                            }
                        };
                    });
                } else {
                    let prevChartTypes = { ...copyChartData.properties_text[entity].band1.type };
                    setChartData(prevState => {
                        return {
                            ...prevState,
                            properties_text: {
                                ...prevState.properties_text,
                                [entity]: {
                                    ...prevState.properties_text[entity],
                                    [bandName]: {
                                        ...prevState.properties_text[entity][bandName],
                                        type: {
                                            ...shiftObjectProps(
                                                {
                                                    ...prevChartTypes
                                                },
                                                chartsOrder[entity]
                                            )
                                        }
                                    }
                                }
                            }
                        };
                    });
                }
                break;
            case "docdnd":
                let mediaData = mediaKey === "user_doc" ? [...userDocs] : [...userImages];
                let selectedDoc = mediaData.find(doc => doc.id === docId);
                setCopyChartData(prevState => {
                    return {
                        ...prevState,
                        properties_text: {
                            ...prevState.properties_text,
                            [entity]: {
                                ...prevState.properties_text[entity],
                                [bandName]: {
                                    ...prevState.properties_text[entity][bandName],
                                    type: {
                                        ...prevState.properties_text[entity][bandName].type,
                                        [mediaKey + docId]: {
                                            id: selectedDoc?.id,
                                            name: selectedDoc?.name || selectedDoc?.gallery_image?.caption || ""
                                        }
                                    }
                                }
                            }
                        }
                    };
                });
                setChartsOrder(prevOrder => {
                    return {
                        ...prevOrder,
                        [entity]: orderedKeys
                    };
                });
                setChartData(prevState => {
                    return {
                        ...prevState,
                        properties_text: {
                            ...prevState.properties_text,
                            [entity]: {
                                ...prevState.properties_text[entity],
                                [bandName]: {
                                    ...prevState.properties_text[entity][bandName],
                                    type: {
                                        ...shiftObjectProps(
                                            {
                                                ...prevState.properties_text[entity][bandName].type,
                                                [mediaKey + docId]: {
                                                    id: selectedDoc?.id,
                                                    name: selectedDoc?.name || selectedDoc?.gallery_image?.caption || ""
                                                }
                                            },
                                            orderedKeys
                                        )
                                    }
                                }
                            }
                        }
                    };
                });
                break;
            case "image_band":
                let imageBandData = { data: [], config: { type: 1 } };
                let imageBandKey = "list_images" + uuid();
                setCopyChartData(prevState => {
                    return {
                        ...prevState,
                        properties_text: {
                            ...prevState.properties_text,
                            [entity]: {
                                ...prevState.properties_text[entity],
                                [bandName]: {
                                    ...prevState.properties_text[entity][bandName],
                                    type: {
                                        ...prevState.properties_text[entity][bandName].type,
                                        [imageBandKey]: { ...imageBandData }
                                    }
                                }
                            }
                        }
                    };
                });
                setChartsOrder(prevOrder => {
                    return {
                        ...prevOrder,
                        [entity]: [imageBandKey, ...prevOrder[entity]]
                    };
                });
                setChartData(prevState => {
                    return {
                        ...prevState,
                        properties_text: {
                            ...prevState.properties_text,
                            [entity]: {
                                ...prevState.properties_text[entity],
                                [bandName]: {
                                    ...prevState.properties_text[entity][bandName],
                                    type: {
                                        [imageBandKey]: { ...imageBandData },
                                        ...prevState.properties_text[entity][bandName].type
                                    }
                                }
                            }
                        }
                    };
                });
                break;
            case "config_image_band":
                console.log("imageBandConfig", imageBandConfig);
                setCopyChartData(prevState => {
                    return {
                        ...prevState,
                        properties_text: {
                            ...prevState.properties_text,
                            [entity]: {
                                ...prevState.properties_text[entity],
                                [bandName]: {
                                    ...prevState.properties_text[entity][bandName],
                                    type: {
                                        ...prevState.properties_text[entity][bandName].type,
                                        [chartKey]: { ...prevState.properties_text[entity][bandName].type[chartKey], ...imageBandConfig }
                                    }
                                }
                            }
                        }
                    };
                });
                setChartData(prevChartData => {
                    return {
                        ...prevChartData,
                        properties_text: {
                            ...prevChartData.properties_text,
                            [entity]: {
                                ...prevChartData.properties_text[entity],
                                [bandName]: {
                                    ...prevChartData.properties_text[entity][bandName],
                                    type: {
                                        ...prevChartData.properties_text[entity][bandName].type,
                                        [chartKey]: { ...prevChartData.properties_text[entity][bandName].type[chartKey], ...imageBandConfig }
                                    }
                                }
                            }
                        }
                    };
                });
                break;
            case "delete_image_band":
                setChartData(prevState => {
                    return {
                        ...prevState,
                        properties_text: {
                            ...prevState.properties_text,
                            [entity]: {
                                ...prevState.properties_text[entity],
                                [bandName]: {
                                    ...prevState.properties_text[entity][bandName],
                                    type: {
                                        ..._.omit(prevState.properties_text[entity][bandName].type, [chartKey])
                                    }
                                }
                            }
                        }
                    };
                });
                setCopyChartData(prevState => {
                    return {
                        ...prevState,
                        properties_text: {
                            ...prevState.properties_text,
                            [entity]: {
                                ...prevState.properties_text[entity],
                                [bandName]: {
                                    ...prevState.properties_text[entity][bandName],
                                    type: {
                                        ..._.omit(prevState.properties_text[entity][bandName].type, [chartKey])
                                    }
                                }
                            }
                        }
                    };
                });
                setChartsOrder(prevOrder => {
                    let prevKeyOrder = [...prevOrder[entity]];
                    prevKeyOrder = prevKeyOrder.filter(o => o !== chartKey);
                    return {
                        ...prevOrder,
                        [entity]: [...prevKeyOrder]
                    };
                });
                break;
            default:
        }
    };

    const getSelectedFilterNameFormIds = (dropDownData = [], selectedIds = []) => {
        let filteredNames = [];
        if (selectedIds.length) {
            dropDownData.map(data => {
                if (selectedIds.includes(data.id)) {
                    filteredNames.push(data.name + (data.description ? " (" + data.description + ")" : ""));
                }
            });
        }
        return filteredNames;
    };

    const removeMfilterKeys = key => {
        switch (key) {
            case "projects":
                return {
                    region_ids: [],
                    site_ids: [],
                    building_types: [],
                    building_ids: [],
                    start: "",
                    end: "",
                    fmp: [],
                    infrastructure_requests: [],
                    addition_ids: [],
                    color_scale: []
                };
            case "regions":
                return {
                    site_ids: [],
                    // building_types: [],
                    building_ids: [],
                    fmp: [],
                    infrastructure_requests: [],
                    addition_ids: [],
                    color_scale: []
                };
            case "sites":
                return {
                    // building_types: [],
                    building_ids: [],
                    fmp: [],
                    infrastructure_requests: [],
                    addition_ids: [],
                    color_scale: []
                };
            case "energy_mng_regions":
                return {
                    site_ids: [],
                    // building_types: [],
                    building_ids: [],
                    years: []
                };
            case "energy_mng_sites":
                return {
                    // building_types: [],
                    building_ids: [],
                    years: []
                };
            case "energy_mng_buildings":
                return {
                    years: []
                };
            case "asset_regions":
                return {
                    site_ids: [],
                    // building_types: [],
                    building_ids: []
                };
            case "asset_sites":
                return {
                    // building_types: [],
                    building_ids: []
                };
            default:
                return {};
        }
    };

    const removeMfilterEmptyKeys = (data, keyList = []) => {
        let shiftedObjectData = {};
        shiftedObjectData = Object.keys(data).reduce((resultData, currentProp, index) => {
            if ((currentProp === "start" || currentProp === "end") && data[currentProp] === "") {
                return resultData;
            } else if (currentProp !== "start" && currentProp !== "end" && !data[currentProp]?.length) {
                return resultData;
            }
            return { ...resultData, [currentProp]: data[currentProp] };
        }, {});
        return shiftedObjectData;
    };

    const rearrangeBands = (bands = {}) => {
        let resultBand = Object.keys(bands).reduce((bandData, currentBand, index) => {
            return { ...bandData, [`band${index + 1}`]: bands[currentBand] };
        }, {});
        return resultBand;
    };

    const exportSmartChart = async () => {
        if (props.smartChartReducer.saveSmartChartDataResponse?.id) {
            await exportSmartChartData({ property_id: props.smartChartReducer.saveSmartChartDataResponse.id });
            showLongAlert("Export initiated. The file will be sent to your email");
            props.history.push("/smartcharts/reports");
        }
    };

    const showAlert = msg => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = msg;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    const showLongAlert = msg => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = msg;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    const renderChartItemConfigModal = () => {
        if (!showChartItemConfigModal) return null;
        return (
            <Portal
                body={
                    <ChartItemConfigModal
                        setSmartChartData={setSmartChartData}
                        configData={selectedChartConfigData}
                        onCancel={() => setShowChartItemConfigModal(false)}
                        defaultData={copyChartData.properties_text}
                        configOrder={chartConfigOrder}
                    />
                }
                onCancel={() => setShowChartItemConfigModal(false)}
            />
        );
    };

    const openChartItemConfigModal = params => {
        const { entity, chartKey, bandName, isImageBand = false } = params;
        let selectedChartConfig = chartData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey]
            ? { ...chartData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey] }
            : {};
        setSelectedChartConfigData({ ...params, selectedChartConfig });
        if (isImageBand) {
            setShowImageBandConfigModal(true);
        } else {
            setShowChartItemConfigModal(true);
        }
    };

    const saveSmartChartConfigData = async (isExport = false, isSaveAs = false, templateData = null) => {
        if (validate()) {
            let tempSaveChartData = { ...chartData };
            if (chartData?.properties_text?.project?.band1?.mfilter && chartData.properties_text.project.band1.type?.sorted_recom) {
                tempSaveChartData.properties_text.project.band1.type.sorted_recom.band1.mfilter = {
                    ...chartData.properties_text.project.band1.mfilter
                };
            }
            if (chartData.properties_text.project.band1.type?.system) {
                tempSaveChartData.properties_text.project.band1.type.system = {
                    trade_ids: [],
                    ...chartData.properties_text.project.band1.type.system
                };
            }
            let updatedProjectDataWithDocs = {};
            let updatedEnergyMngDataWithDocs = {};
            let updatedAssetMngDataWithDocs = {};
            let tempProjectTypes = { ...tempSaveChartData.properties_text?.project?.band1?.type };
            updatedProjectDataWithDocs = updateDataWithUserDocs(tempProjectTypes);
            let tempEnergyMngTypes = { ...tempSaveChartData.properties_text?.energy_mng?.band1?.type };
            updatedEnergyMngDataWithDocs = updateDataWithUserDocs(tempEnergyMngTypes);
            let tempAssetMngTypes = { ...tempSaveChartData.properties_text?.assets?.band1?.type };
            updatedAssetMngDataWithDocs = updateDataWithUserDocs(tempAssetMngTypes);
            let updatedDataWithCustomKeys = setCustomDataForSave(updatedProjectDataWithDocs);
            tempSaveChartData.properties_text.project.band1.type = {
                ...updatedDataWithCustomKeys
            };
            tempSaveChartData.properties_text.energy_mng.band1.type = {
                ...updatedEnergyMngDataWithDocs
            };

            tempSaveChartData.properties_text.assets.band1.type = {
                ...updatedAssetMngDataWithDocs
            };
            tempSaveChartData.properties_text.energy_mng.band1.mfilter = {
                ...tempSaveChartData.properties_text.energy_mng.band1.mfilter,
                client_ids: [selectedClient]
            };
            tempSaveChartData.properties_text.assets.band1.mfilter = {
                ...tempSaveChartData.properties_text.assets.band1.mfilter,
                client_ids: [selectedClient]
            };
            let saveChartData = {
                ...chartData,
                properties_text: JSON.stringify(tempSaveChartData.properties_text)
            };
            if (selectedExportProperty) {
                saveChartData.template_property_id = selectedExportProperty;
            }
            if (selectedExportTemplate) {
                saveChartData.template_id = selectedExportTemplate;
            }
            saveChartData.client_id = selectedClient;

            let propertyId = "";
            if (props.match.params.viewType && props.match.params.viewType === "edit") {
                propertyId = selectedProperty.id;
            } else {
                propertyId = saveSmartChartResponse.id;
            }
            // console.log("JSON", JSON.stringify(tempSaveChartData.properties_text), isEdit);
            if (isExport) {
                setIsSaveAndExport(true);
            }
            if (isEdit && !isSaveAs) {
                await updateSmartChartProperty(propertyId, { ...saveChartData, modified_by: localStorage.getItem("userId") });
            } else {
                if (templateData) {
                    saveChartData = { ...saveChartData, name: templateData.name, notes: templateData.notes };
                }
                if (isExport) {
                    saveChartData = { ...saveChartData, is_export: true };
                    if (templateData.is_pdf) {
                        saveChartData = { ...saveChartData, is_pdf: true };
                    } else if (templateData.is_ppt) {
                        saveChartData = { ...saveChartData, is_ppt: true };
                    }
                }
                await saveSmartChartData({ ...saveChartData, user: localStorage.getItem("userId") });
            }
            setIsSaveAndExport(false);
            setSelectedProperty(prevProperty => {
                return {
                    ...prevProperty,
                    ...saveChartData
                };
            });
            setSavedChartData({ ...chartData });
            if (isExport) {
                showLongAlert("Export initiated. The file will be sent to your email");
                popBreadCrumpData();
                popBreadCrumpData();
                addToBreadCrumpData({
                    key: "reports",
                    name: "Report",
                    path: `/smartcharts/reports`
                });
                props.history.push("/smartcharts/reports");
            } else {
                showLongAlert(
                    isEdit && !isSaveAs
                        ? "Smart chart report template updated successfully"
                        : "Smart chart report template saved successfully, You can export the report now."
                );
                if (isSaveAs) {
                    popBreadCrumpData();
                    popBreadCrumpData();
                    addToBreadCrumpData({
                        key: "reporttemplates",
                        name: "Report Templates",
                        path: `/smartcharts/reporttemplates`
                    });
                    props.history.push("/smartcharts/reporttemplates");
                } else {
                    let prevUrl = findPrevPathFromBreadCrump() || "/smartcharts/reporttemplates";
                    popBreadCrumpData();
                    props.history.push(prevUrl);
                }
            }
        }
    };

    const updateDataWithUserDocs = entityTypeData => {
        let updatedData = Object.keys(entityTypeData).reduce((resultData, currentProp, index) => {
            if (currentProp.includes("user_doc")) {
                return {
                    ...resultData,
                    ["user_doc" + (index + 1)]: { id: entityTypeData[currentProp]?.id, name: entityTypeData[currentProp]?.name }
                };
            }
            if (currentProp.includes("image_doc")) {
                return {
                    ...resultData,
                    ["image_doc" + (index + 1)]: { id: entityTypeData[currentProp]?.id, name: entityTypeData[currentProp]?.name }
                };
            }
            if (currentProp.includes("list_images")) {
                return {
                    ...resultData,
                    ["list_images" + (index + 1)]: { ...entityTypeData[currentProp] }
                };
            }
            return { ...resultData, [currentProp]: entityTypeData[currentProp] };
        }, {});
        return updatedData;
    };

    const setCustomDataForSave = (data = {}) => {
        let customKeys = ["energy_band"];
        let newObjectData = {};
        newObjectData = Object.keys(data).reduce((resultData, currentProp, index) => {
            if (customKeys.includes(currentProp)) {
                return { ...resultData, ...getDataForCustomDataSave(currentProp, data[currentProp]) };
            }
            return { ...resultData, [currentProp]: data[currentProp] };
        }, {});
        return newObjectData;
    };

    const getDataForCustomDataSave = key => {
        switch (key) {
            case "energy_band":
                return {
                    energy_band: "",
                    em_eci_site_cost: { detailed_view: { chart_type: ["stacked_column_2d"] } },
                    em_eci_energy_cost: { summary_view: { chart_type: ["pie_2d"] } },
                    bld_brkdown_energy_cost: { summary_view: { chart_type: ["pie_2d"] } }
                };
            default:
                return {};
        }
    };

    const validate = () => {
        setShowErrorBorder(false);
        if (!selectedClient?.trim()?.length) {
            setShowErrorBorder(true);
            return false;
        }
        if (!selectedExportProperty?.trim()?.length) {
            setShowErrorBorder(true);
            return false;
        }
        if (!selectedExportTemplate?.trim()?.length) {
            setShowErrorBorder(true);
            return false;
        }
        if (!chartData.name && !chartData.name.trim().length) {
            setShowErrorBorder(true);
            return false;
        }
        if (
            chartData.properties_text.project.band1.type &&
            Object.keys(chartData.properties_text.project.band1.type).length &&
            (!chartData.properties_text.project.band1.mfilter?.project_ids || !chartData.properties_text.project.band1.mfilter?.project_ids?.length)
        ) {
            showAlert("Please select a project");
            return false;
        }
        if (
            (Object.keys(chartData.properties_text.energy_mng.band1.type).includes("water_band") ||
                Object.keys(chartData.properties_text.energy_mng.band1.type).includes("energy_band")) &&
            (!chartData.properties_text.energy_mng.band1.mfilter?.project_ids ||
                !chartData.properties_text.energy_mng.band1.mfilter?.project_ids?.length)
        ) {
            showLongAlert("Please select a project in Energy Reporting");
            return false;
        }
        if (
            !Object.keys(chartData.properties_text.energy_mng.band1.type).length &&
            !Object.keys(chartData.properties_text.assets.band1.type).length &&
            !Object.keys(chartData.properties_text.project.band1.type).length
        ) {
            showLongAlert("Please select at least one chart");
            return false;
        }
        return true;
    };

    const refreshUploadedDocList = async () => {
        await props.getUploadedDocList({ limit: 100, offset: 0, client_id: selectedClient });
    };

    const refreshUploadedImageList = async () => {
        await props.getUploadedImageList({ limit: 100, offset: 0, client_id: selectedClient, is_image: true });
    };

    const onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        let droppableId = result.destination?.droppableId || "";
        let droppedEntity = droppableId ? droppableId.split("-")[1] : "";
        let draggedEntity = result.draggableId?.split("-")[1] || "";
        if (result.source?.droppableId.includes("USERDOCS")) {
            let currentDocId = result.draggableId?.split("doc")?.[1] || "";
            const keyList = reorderArray(["user_doc" + currentDocId, ...chartsOrder[droppedEntity]], 0, result.destination.index);
            setSmartChartData("docdnd", {
                bandName: "band1",
                orderedKeys: keyList,
                docId: currentDocId,
                entity: droppedEntity,
                mediaKey: "user_doc"
            });
        }
        if (result.source?.droppableId.includes("USERIMAGES")) {
            let currentImageId = result.draggableId?.split("doc")?.[1] || "";
            const keyList = reorderArray(["image_doc" + currentImageId, ...chartsOrder[droppedEntity]], 0, result.destination.index);
            setSmartChartData("docdnd", {
                bandName: "band1",
                orderedKeys: keyList,
                docId: currentImageId,
                entity: droppedEntity,
                mediaKey: "image_doc"
            });
        } else {
            if (draggedEntity !== droppedEntity) {
                return;
            }
            const keyList = reorderArray(chartsOrder[droppedEntity], result.source.index, result.destination.index);
            setSmartChartData("dnd", {
                bandName: "band1",
                orderedKeys: keyList,
                entity: droppedEntity
            });
        }
    };

    const handleSelectClient = async value => {
        setSelectedClient(value);
        setSelectedExportProperty("");
        setSelectedExportTemplate("");
        if (value === "") {
            await props.getUploadedDocList({ limit: 100, offset: 0 });
        }
        if (value) {
            props.getTemplatePropertiesList({ client_id: value });
            props.getTemplateList({ client_id: value });
        }
        setChartData(prevState => {
            return {
                ...prevState,
                properties_text: {
                    ...prevState.properties_text,
                    project: {
                        ...prevState.properties_text.project,
                        band1: {
                            ...prevState.properties_text.project.band1,
                            mfilter: {}
                        }
                    },
                    assets: {
                        ...prevState.properties_text.assets,
                        band1: {
                            ...prevState.properties_text.assets.band1,
                            mfilter: {}
                        }
                    },
                    energy_mng: {
                        ...prevState.properties_text.energy_mng,
                        band1: {
                            ...prevState.properties_text.energy_mng.band1,
                            mfilter: {}
                        }
                    }
                }
            };
        });
    };

    const handleCancelClick = () => {
        if (_.isEqual(chartData, initialData.current)) {
            let prevUrl = findPrevPathFromBreadCrump() || "/smartcharts/reporttemplates";
            popBreadCrumpData();
            props.history.push(prevUrl);
        } else {
            setShowConfirmModal(true);
        }
    };

    const renderConfirmationModal = () => {
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to clear and lose all changes?"}
                        type="cancel"
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => setShowConfirmModal(false)}
                        onYes={() => {
                            let prevUrl = findPrevPathFromBreadCrump() || "/smartcharts/reporttemplates";
                            popBreadCrumpData();
                            props.history.push(prevUrl);
                        }}
                    />
                }
                onCancel={() => setShowConfirmModal(false)}
            />
        );
    };

    const checkForSaveAsNewTemplate = () => {
        let isFilterChanged = false;
        if (!_.isEqual(chartData.properties_text.project.band1.mfilter, initialData.current?.properties_text?.project?.band1?.mfilter)) {
            isFilterChanged = true;
        }
        if (!_.isEqual(chartData.properties_text.assets.band1.mfilter, initialData.current?.properties_text?.assets?.band1?.mfilter)) {
            isFilterChanged = true;
        }
        if (!_.isEqual(chartData.properties_text.energy_mng.band1.mfilter, initialData.current?.properties_text?.energy_mng?.band1?.mfilter)) {
            isFilterChanged = true;
        }
        return isFilterChanged;
    };

    const updateSmartChartConfigData = () => {
        if (validate()) {
            if (checkForSaveAsNewTemplate() && selectedProperty?.is_mapped) {
                setShowSaveAsConfirmationModal(true);
            } else {
                saveSmartChartConfigData();
            }
        }
    };

    const renderSaveAsConfirmationModal = () => {
        if (!showSaveAsConfirmationModal) return null;
        let exportCount = selectedProperty?.smart_export_count || 0;
        return (
            <Portal
                body={
                    <SaveAsConfirmationModal
                        onCancel={() => setShowSaveAsConfirmationModal(false)}
                        message={"Do you want to update this Template ?"}
                        subMessage1={
                            <>
                                This template is already connected to <span className="badge-red-circled">{exportCount}</span>{" "}
                                {`report${
                                    exportCount > 1 ? "s" : ""
                                }. Are you sure you want to update the template, or would you like to save it as a new template instead?`}
                            </>
                        }
                        buttonNo={{ label: "Save As New Template", value: "save_as", note: "" }}
                        buttonYes={{ label: "Update", value: "update", note: "" }}
                        hasCancelButton={true}
                        onSelection={selectedKey => (selectedKey === "save_as" ? toggleNewTemplateEditModal() : updateTemplateConfirm())}
                        viewReports={() => viewReports(selectedProperty?.id)}
                        isSmartChart={selectedProperty?.smart_export_count > 0 ? true : false}
                        smartChartBtnText={
                            <>
                                {" "}
                                View <span>{selectedProperty.smart_export_count || 0}</span>{" "}
                                {`Connected Report${selectedProperty.smart_export_count > 1 ? "s" : ""}`}
                            </>
                        }
                    />
                }
                onCancel={() => setShowSaveAsConfirmationModal(false)}
            />
        );
    };

    const handleSaveAsNewTemplate = data => {
        sessionStorage.removeItem("selectedProperty");
        setShowSaveAsConfirmationModal(false);
        setShowNewTemplateEditModal(false);
        saveSmartChartConfigData(false, true, data);
    };

    const updateTemplateConfirm = () => {
        setShowSaveAsConfirmationModal(false);
        saveSmartChartConfigData();
    };

    const toggleNewTemplateEditModal = () => {
        setShowNewTemplateEditModal(true);
    };

    const renderNewTemplateEditModal = () => {
        if (!showNewTemplateEditModal) return null;
        let newTemplateData = { name: chartData.name, notes: chartData.notes };
        return (
            <Portal
                body={
                    <EntityDataEditModal
                        onCancel={() => setShowNewTemplateEditModal(false)}
                        heading={isEdit ? "Save As New Template" : "Save & Export"}
                        selectedData={newTemplateData}
                        updateData={isEdit ? handleSaveAsNewTemplate : saveAndExportConfirm}
                        buttonText={"Save"}
                        hasExportType={!isEdit}
                    />
                }
                onCancel={() => setShowNewTemplateEditModal(false)}
            />
        );
    };

    const saveAndExportReportData = () => {
        if (validate()) {
            setShowNewTemplateEditModal(true);
        }
    };

    const saveAndExportConfirm = data => {
        setShowNewTemplateEditModal(false);
        saveSmartChartConfigData(true, false, data);
    };

    const renderImageBandConfigModal = () => {
        if (!showImageBandConfigModal) return null;
        return (
            <Portal
                body={
                    <ImageBandConfigModal
                        onCancel={() => setShowImageBandConfigModal(false)}
                        configData={selectedChartConfigData}
                        setSmartChartData={setSmartChartData}
                    />
                }
                onCancel={() => setShowImageBandConfigModal(false)}
            />
        );
    };

    const toggleImageListForBandModal = (params, isView = false) => {
        const { entity, chartKey, bandName } = params;
        let selectedChartConfig = chartData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey]
            ? { ...chartData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey] }
            : {};
        setSelectedChartConfigData({ ...params, selectedChartConfig });
        setIsImageListView(isView);
        setShowImageListForBandModal(true);
    };

    const renderImageListForBandModal = () => {
        if (!showImageListForBandModal) return null;
        return (
            <Portal
                body={
                    <ImageListForBandModal
                        onCancel={() => setShowImageListForBandModal(false)}
                        setSmartChartData={setSmartChartData}
                        selectedClient={selectedClient}
                        configData={selectedChartConfigData}
                        isView={isImageListView}
                    />
                }
                onCancel={() => setShowImageListForBandModal(false)}
            />
        );
    };

    const toggleImageBandDeleteConfirmationModal = bandData => {
        setImageBandData(bandData);
        setShowImageBandDeleteConfirmationModal(true);
    };

    const renderDeleteConfirmationModal = () => {
        if (!showImageBandDeleteConfirmationModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this image band?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => setShowImageBandDeleteConfirmationModal(false)}
                        onYes={deleteImageBandConfirm}
                    />
                }
                onCancel={() => setShowImageBandDeleteConfirmationModal(false)}
            />
        );
    };

    const deleteImageBandConfirm = () => {
        setSmartChartData("delete_image_band", {
            ...imageBandData
        });
        setShowImageBandDeleteConfirmationModal(false);
    };

    const editImageBand = band => {
        setSelectedChartConfigData(band);
        setToggleImageBandEditModal(true);
    };

    const renderImageBandEditModal = () => {
        if (!toggleImageBandEditModal) return null;
        let bandData = { name: selectedChartConfigData?.name || "Image Band" };
        return (
            <Portal
                body={
                    <EntityDataEditModal
                        onCancel={() => setToggleImageBandEditModal(false)}
                        heading={"Edit Image Band Name"}
                        selectedData={bandData}
                        updateData={updateImageBand}
                        buttonText={"Update"}
                        hasNotes={false}
                    />
                }
                onCancel={() => setToggleImageBandEditModal(false)}
            />
        );
    };

    const updateImageBand = params => {
        console.log("params", params, imageBandData);
        setSmartChartData("config_image_band", {
            ...selectedChartConfigData,
            imageBandConfig: { name: params?.name }
        });
    };

    // console.log("chartConfigData", chartData.properties_text);
    let exportPropertyList = props?.smartChartReducer?.getTemplatePropertiesListResponse?.data || [];
    let exportTemplateList = props?.smartChartReducer?.getTemplateListResponse?.data || [];
    let clientList = props?.smartChartReducer?.getClientDropDownDataResponse?.data || [];
    return (
        <>
            <div class="dtl-sec col-md-12 dshb layout-sm-outer">
                <div class="table-top-menu">
                    {isEdit ? (
                        <div class="recom-notify-img">
                            <img src={exclmIcon} alt="" />
                        </div>
                    ) : null}
                    <div class="lft-sec">
                        <h4>
                            {isEdit ? (
                                <>
                                    Edit <span>{propertyName}</span> Report Template{" "}
                                </>
                            ) : (
                                "New Report Template"
                            )}
                        </h4>
                    </div>
                    {isEdit && selectedProperty?.smart_export_count ? (
                        <div className="view-reports-sm-charts">
                            <button class="btn btn-primary view-report-btn" onClick={() => viewReports(selectedProperty?.id)}>
                                View <span>{selectedProperty.smart_export_count || 0}</span>{" "}
                                {`Connected Report${selectedProperty.smart_export_count > 1 ? "s" : ""}`}
                            </button>
                        </div>
                    ) : null}
                    <div class="rgt">
                        <button class="btn btn-save btn-cnl" onClick={() => handleCancelClick()}>
                            Cancel
                        </button>
                        <button class="btn btn-save" onClick={() => (isEdit ? updateSmartChartConfigData() : saveSmartChartConfigData())}>
                            {isEdit ? "Update" : "Save"}
                        </button>
                        {!isEdit ? (
                            <button class="btn btn-save btn-exp" onClick={() => saveAndExportReportData()}>
                                Save & Export
                                {isSaveAndExport ? <span className="spinner-border spinner-border-sm pl-2 ml-2" role="status"></span> : ""}
                            </button>
                        ) : (
                            <button class="btn btn-save btn-exp" onClick={() => toggleNewTemplateEditModal()}>
                                Save As New Template
                            </button>
                        )}
                    </div>
                </div>
                <div class="tab-dtl region-mng chart-drage-area">
                    <div class="tab-active location-sec">
                        <div className="row m-0">
                            <div className="col-md-12">
                                <div className="chart-hed-main">
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label>Client</label>
                                            <select
                                                className={`${
                                                    showErrorBorder && !selectedClient?.trim()?.length ? "error-border" : ""
                                                } form-control dropdown export-prop-select`}
                                                value={selectedClient}
                                                name="font_id"
                                                onChange={e => handleSelectClient(e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                {clientList.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Export Property</label>
                                            <select
                                                className={`${
                                                    showErrorBorder && !selectedExportProperty?.trim()?.length ? "error-border" : ""
                                                } form-control dropdown export-prop-select`}
                                                value={selectedExportProperty}
                                                name="font_id"
                                                onChange={e => {
                                                    let value = e.target.value;
                                                    setSelectedExportProperty(value);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {selectedClient &&
                                                    exportPropertyList.map(p => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name}{" "}
                                                            {exportPropertyList.some(temp => temp.sm_default) && p.sm_default
                                                                ? "(Active)"
                                                                : p.default
                                                                ? "(Active)"
                                                                : ""}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Export Template</label>
                                            <select
                                                className={`${
                                                    showErrorBorder && !selectedExportTemplate?.trim()?.length ? "error-border" : ""
                                                } form-control dropdown export-prop-select`}
                                                value={selectedExportTemplate}
                                                name="font_id"
                                                onChange={e => {
                                                    let value = e.target.value;
                                                    setSelectedExportTemplate(value);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {selectedClient &&
                                                    exportTemplateList.map(p => {
                                                        return (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name}{" "}
                                                                {exportTemplateList.some(temp => temp.sm_default) && p.sm_default
                                                                    ? "(Active)"
                                                                    : p.default
                                                                    ? "(Active)"
                                                                    : ""}
                                                            </option>
                                                        );
                                                    })}
                                            </select>
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className={`${showErrorBorder && !chartData.name.trim().length ? "error-border" : ""} form-control`}
                                                value={chartData.name}
                                                onChange={e => {
                                                    let value = e.target.value;
                                                    setChartData(prevChartData => {
                                                        return {
                                                            ...prevChartData,
                                                            name: value
                                                        };
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Notes</label>
                                            <textarea
                                                className="form-control textarea area-hgt"
                                                value={chartData.notes}
                                                onChange={e => {
                                                    let value = e.target.value;
                                                    setChartData(prevChartData => {
                                                        return {
                                                            ...prevChartData,
                                                            notes: value
                                                        };
                                                    });
                                                }}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="row m-0">
                                <div className="col-md-12 scroll-inside">
                                    <div id="accordion">
                                        {DOC_AND_IMAGE_BANDS.map((bandEntity, index) => (
                                            <DocumentsMain userDocs={bandEntity.key === "documents" ? userDocs : userImages} entity={bandEntity} />
                                        ))}
                                        {Object.keys(chartData.properties_text).map((entity, index) => (
                                            <ChartMain
                                                getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                                                projectsDropdownData={projectsDropdownData}
                                                projectId={projectId}
                                                setSmartChartData={setSmartChartData}
                                                chartData={chartData?.properties_text}
                                                copyChartData={copyChartData?.properties_text}
                                                masterFilterList={masterFilterList}
                                                openChartItemConfigModal={openChartItemConfigModal}
                                                chartKeys={chartsOrder[entity]}
                                                entity={entity}
                                                selectedClient={selectedClient}
                                                isEdit={isEdit}
                                                toggleImageListForBandModal={toggleImageListForBandModal}
                                                toggleImageBandDeleteConfirmationModal={toggleImageBandDeleteConfirmationModal}
                                                editImageBand={editImageBand}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DragDropContext>
                    </div>
                </div>
            </div>
            {renderChartItemConfigModal()}
            {renderConfirmationModal()}
            {renderSaveAsConfirmationModal()}
            {renderNewTemplateEditModal()}
            {renderImageBandConfigModal()}
            {renderImageListForBandModal()}
            {renderDeleteConfirmationModal()}
            {renderImageBandEditModal()}
        </>
    );
};
const mapStateToProps = state => {
    const { smartChartReducer } = state;
    return { smartChartReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(CreateSmartChart));
