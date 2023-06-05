import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import LoadingOverlay from "react-loading-overlay";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import actions from "../actions";
import NumberFormat from "react-number-format";
import qs from "query-string";
import exclmIcon from "../../../assets/img/recom-icon.svg";
import { getCurrentAge, getUsefullLifeRemaining } from "../../../config/utils";
import ReactTooltip from "react-tooltip";

const initialData = {
    asset_name: "",
    asset_tag: "",
    asset_note: "",
    client_asset_condition_id: "",
    description: "",
    installed_year: "",
    service_life: "",
    usefull_life_remaining: "",
    crv: "",
    manufacturer: "",
    year_manufactured: "",
    model_number: "",
    serial_number: "",
    capacity: "",
    capacity_unit: "",
    criticality: "",
    area_served: "",

    client_id: "",
    system_id: "",
    sub_system_id: "",
    trade_id: "",
    region_id: "",
    site_id: "",
    building_id: "",
    addition_id: "",
    floor_id: "",
    room_number: "",
    room_name: "",
    location: "",
    architectural_room_number: "",
    additional_room_description: "",

    uniformat_level_1_id: "",
    uniformat_level_2_id: "",
    uniformat_level_3_id: "",
    uniformat_level_4_id: "",
    uniformat_level_5_id: "",
    uniformat_level_6_id: "",
    uniformat_level_6_description: "",

    asset_type_id: "",
    asset_description: "",
    asset_barcode: "",
    asset_client_id: "",
    asset_cmms_id: "",

    warranty_start: "",
    warranty_end: "",
    install_date: "",
    startup_date: "",
    upstream_asset_barcode_number: "",
    linked_asset_barcode_number: "",
    source_panel_barcode_number: "",
    source_panel_emergency: "",
    asset_status_id: "",
    notes: "",

    main_category_id: "",
    sub_category_1_id: "",
    sub_category_2_id: "",
    subcategory2_description: "",
    sub_category_3_id: "",
    guid: "",
    source_panel_name: "",
    skysite_hyperlink: "",
    quantity: "",

    rtls_tag: "",
    latitude: "",
    longitude: "",
    current_age: "",
    age: "",
    new_asset: "",
    parent_global_id: "",
    survey_global_id: "",
    survey_id: "",
    survey_property_note: "",
    capacity_status: "",
    installed_year_status: "",
    name_plate_status: "",
    qa_notes: "",
    additional_qa_notes: "",
    surveyor: "",
    editor: "",
    survey_date_created: "",
    survey_date_edited: ""
};
class Form extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            data: { ...initialData, client_id: query.c_id, region_id: query.r_id, site_id: query.s_id, building_id: query.b_id },
            errorParams: {
                name: ""
            },
            initialValues: {},
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        this.getInitialDropdowns();
        if (this.props.selectedData) {
            const data = await this.props.getAssetById();
            if (data.success) {
                await this.setState({
                    data: {
                        asset_name: data.asset_name,
                        asset_tag: data.asset_tag,
                        asset_note: data.asset_note,
                        client_asset_condition_id: data.client_asset_condition?.id,
                        description: data.client_asset_condition?.description,
                        installed_year: data.installed_year,
                        service_life: data.service_life,
                        usefull_life_remaining: data.usefull_life_remaining,
                        crv: data.crv,
                        manufacturer: data.manufacturer,
                        year_manufactured: data.year_manufactured,
                        model_number: data.model_number,
                        serial_number: data.serial_number,
                        capacity: data.capacity,
                        capacity_unit: data.capacity_unit,
                        criticality: data.criticality,
                        area_served: data.area_served,
                        client_id: data.client?.id,
                        trade_id: data.trade?.id,
                        system_id: data.system?.id,
                        sub_system_id: data.sub_system?.id,

                        region_id: data.region?.id,
                        site_id: data.site?.id,
                        building_id: data.building?.id,
                        addition_id: data.addition?.id,
                        floor_id: data.floor?.id,
                        room_number: data.room_number,
                        room_name: data.room_name,
                        location: data.location,
                        architectural_room_number: data.architectural_room_number,
                        additional_room_description: data.additional_room_description,
                        uniformat_level_1_id: data.uniformat_level_1?.id,
                        uniformat_level_2_id: data.uniformat_level_2?.id,
                        uniformat_level_3_id: data.uniformat_level_3?.id,
                        uniformat_level_4_id: data.uniformat_level_4?.id,
                        uniformat_level_5_id: data.uniformat_level_5?.id,
                        uniformat_level_6_id: data.uniformat_level_6?.id,
                        asset_type_id: data.asset_type?.id,
                        asset_description: data.asset_description,
                        asset_barcode: data.asset_barcode,
                        asset_client_id: data.asset_client_id,
                        asset_cmms_id: data.asset_cmms_id,
                        warranty_start: data.warranty_start,
                        warranty_end: data.warranty_end,
                        install_date: data.install_date,
                        startup_date: data.startup_date,
                        upstream_asset_barcode_number: data.upstream_asset_barcode_number,
                        linked_asset_barcode_number: data.linked_asset_barcode_number,
                        source_panel_barcode_number: data.source_panel_barcode_number,
                        source_panel: data.source_panel,
                        asset_status_id: data.asset_status?.id,
                        notes: data.notes,
                        building_type: data?.building_type?.name,
                        main_category_id: data?.main_category?.id,
                        sub_category_1_id: data?.sub_category_1?.id,
                        sub_category_2_id: data?.sub_category_2?.id,
                        sub_category_3_id: data?.sub_category_3?.id,
                        guid: data?.guid,
                        source_panel_name: data?.source_panel_name,
                        skysite_hyperlink: data?.skysite_hyperlink,
                        quantity: data.quantity,
                        uniformat_level_6_description: data.uniformat_level_6?.uniformat_level_6_description,
                        rtls_tag: data?.rtls_tag,
                        latitude: data?.latitude,
                        longitude: data?.longitude,
                        current_age: data?.current_age,
                        age: data?.age,
                        new_asset: data?.new_asset,
                        parent_global_id: data?.parent_global_id,
                        survey_global_id: data?.survey_global_id,
                        survey_id: data?.survey_id,
                        survey_property_note: data?.survey_property_note,
                        capacity_status: data?.capacity_status,
                        installed_year_status: data?.installed_year_status,
                        name_plate_status: data?.name_plate_status,
                        qa_notes: data?.qa_notes,
                        additional_qa_notes: data?.additional_qa_notes,
                        surveyor: data?.surveyor,
                        editor: data?.editor,
                        survey_date_created: data?.survey_date_created,
                        survey_date_edited: data?.survey_date_edited,
                        subcategory2_description: data?.sub_category_2?.subcategory2_description
                    }
                });
                this.getSelectedDataDropdown();
            }
        } else {
            await this.getSelectedRecommendationData();
        }
        await this.setState({
            initialValues: this.state.data,
            isLoading: false
        });
    };

    getSelectedRecommendationData = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        if (query?.isRecomAsset) {
            const fd = JSON.parse(sessionStorage.getItem("currentFormData"));
            await this.setState({
                data: {
                    client_id: fd?.client_id,
                    // trade_id:fd?.trade_id,
                    region_id: fd?.region_id,
                    site_id: fd?.site_id,
                    building_id: fd?.building_id,
                    addition_id: fd?.addition_id,
                    floor_id: fd?.floor_id,
                    room_number: fd?.room,
                    building_type: fd?.building_type
                }
            });
            this.props.getDropdownList("asset_statuses", {
                client_id: fd?.client_id
            });
            this.props.getDropdownList("asset_types", {
                client_id: fd?.client_id
            });
            this.props.getDropdownList("asset_conditions", {
                client_id: fd?.client_id
            });
            this.props.getDropdownList("regions", {
                client_id: fd?.client_id
            });
            this.props.getDropdownList("sites", {
                region_id: fd?.region_id
            });
            this.props.getDropdownList("buildings", {
                site_id: fd?.site_id
            });
            this.props.getDropdownList("floors", {
                building_id: fd?.building_id
            });
            this.props.getDropdownList("additions", {
                building_id: fd?.building_id
            });
        }
    };

    getInitialDropdowns = () => {
        this.props.getDropdownList("clients");
        this.props.getDropdownList("uniformat_level_1s");
        if (!this.props.selectedData) {
            const { client_id, region_id, site_id, building_id, trade_id, system_id, sub_system_id } = this.state.data;
            if (client_id) {
                this.props.getDropdownList("trades", {
                    client_id: this.state.data.client_id
                });
                this.props.getDropdownList("asset_statuses", {
                    client_id: this.state.data.client_id
                });
                this.props.getDropdownList("asset_types", {
                    client_id: this.state.data.client_id
                });
                this.props.getDropdownList("asset_conditions", {
                    client_id: this.state.data.client_id
                });
                this.props.getDropdownList("regions", {
                    client_id: this.state.data.client_id
                });
                this.props.getDropdownList("main_categories", {
                    client_id: this.state.data.client_id
                });
            }
            if (region_id)
                this.props.getDropdownList("sites", {
                    region_id: this.state.data.region_id
                });
            if (site_id)
                this.props.getDropdownList("buildings", {
                    site_id: this.state.data.site_id
                });
            if (building_id) {
                this.props.getDropdownList("floors", {
                    building_id: this.state.data.building_id
                });
                this.props.getDropdownList("additions", {
                    building_id: this.state.data.building_id
                });
            }
            if (trade_id)
                this.props.getDropdownList("systems", {
                    client_id: this.state.data.client_id,
                    trade_id: this.state.data.trade_id
                });
            if (system_id)
                this.props.getDropdownList("sub_systems", {
                    client_id: this.state.data.client_id,
                    system_id: this.state.data.system_id
                });
        }
    };

    getSelectedDataDropdown = () => {
        this.props.getDropdownList("asset_statuses", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("asset_types", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("asset_conditions", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("regions", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("sites", {
            region_id: this.state.data.region_id
        });
        this.props.getDropdownList("buildings", {
            site_id: this.state.data.site_id
        });
        this.props.getDropdownList("floors", {
            building_id: this.state.data.building_id
        });
        this.props.getDropdownList("additions", {
            building_id: this.state.data.building_id
        });
        this.props.getDropdownList("uniformat_level_2s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id
        });
        this.props.getDropdownList("uniformat_level_3s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id
        });
        this.props.getDropdownList("uniformat_level_4s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id
        });
        this.props.getDropdownList("uniformat_level_5s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id,
            uniformat_level_4_id: this.state.data.uniformat_level_4_id
        });
        this.props.getDropdownList("uniformat_level_6s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id,
            uniformat_level_4_id: this.state.data.uniformat_level_4_id,
            uniformat_level_5_id: this.state.data.uniformat_level_5_id
        });
        this.props.getDropdownList("main_categories", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("sub_category_1s", {
            client_id: this.state.data.client_id,
            main_category_id: this.state.data.main_category_id
        });
        this.props.getDropdownList("sub_category_2s", {
            client_id: this.state.data.client_id,
            main_category_id: this.state.data.main_category_id,
            sub_category_1_id: this.state.data.sub_category_1_id
        });
        this.props.getDropdownList("sub_category_3s", {
            client_id: this.state.data.client_id,
            main_category_id: this.state.data.main_category_id,
            sub_category_1_id: this.state.data.sub_category_1_id,
            sub_category_2_id: this.state.data.sub_category_2_id
        });
        this.props.getDropdownList("trades", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("systems", {
            client_id: this.state.data.client_id,
            trade_id: this.state.data.trade_id
        });
        this.props.getDropdownList("sub_systems", {
            client_id: this.state.data.client_id,
            system_id: this.state.data.system_id
        });
    };

    validate = () => {
        const { data } = this.state;
        let errorParams = {};
        let showErrorBorder = false;

        if (!data.asset_name || !data.asset_name.trim().length) {
            errorParams.asset_name = true;
            showErrorBorder = true;
        }
        if (!data.client_id?.trim().length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        if (!data.region_id?.trim().length) {
            errorParams.region_id = true;
            showErrorBorder = true;
        }
        if (!data.site_id?.trim().length) {
            errorParams.site_id = true;
            showErrorBorder = true;
        }
        if (!data.building_id?.trim().length) {
            errorParams.building_id = true;
            showErrorBorder = true;
        }
        if (!data.trade_id?.trim().length) {
            errorParams.trade_id = true;
            showErrorBorder = true;
        }
        if (!data.system_id?.trim().length) {
            errorParams.system_id = true;
            showErrorBorder = true;
        }
        if (!data.sub_system_id?.trim().length) {
            errorParams.sub_system_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addData = async () => {
        const { data } = this.state;
        const { handleAddData } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await handleAddData(data);
            this.setState({
                isUploading: false
            });
        }
    };

    updateData = async () => {
        const { data, initialValues } = this.state;
        const { handleUpdateData } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            let newData = {};
            newData.asset_name = data.asset_name;
            Object.entries(data).map(([key, value]) => {
                if (value !== initialValues[key]) {
                    newData[key] = value;
                }
            });
            await handleUpdateData(newData);
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
        if (_.isEqual(this.state.initialValues, this.state.data)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { cancelForm } = this.props;
        await this.setState({
            data: initialData
        });
        cancelForm();
    };

    handleChange = async e => {
        const { name, value } = e.target;
        const {
            assetReducer: { dropDownList }
        } = this.props;
        await this.setState({
            data: {
                ...this.state.data,
                [name]: value
            },
            errorParams: {
                ...this.state.errorParams,
                [name]: !value?.trim()?.length
            }
        });
        if (name === "uniformat_level_1_id") {
            this.handleLevel1Select();
        } else if (name === "uniformat_level_2_id") {
            this.handleLevel2Select();
        } else if (name === "uniformat_level_3_id") {
            this.handleLevel3Select();
        } else if (name === "uniformat_level_4_id") {
            this.handleLevel4Select();
        } else if (name === "uniformat_level_5_id") {
            this.handleLevel5Select();
        } else if (name === "uniformat_level_6_id") {
            this.handleLevel6Select();
            let res = value && value.length && dropDownList?.uniformat_level_6s.filter(item => item.id === value);
            this.setState({
                data: {
                    ...this.state.data,
                    uniformat_level_6_description: res.length && res[0]?.uniformat_level_6_description
                }
            });
        } else if (name === "client_id") {
            this.handleClientSelect();
        } else if (name === "region_id") {
            this.handleRegionSelect();
        } else if (name === "site_id") {
            this.handleSiteSelect();
        } else if (name === "building_id") {
            this.handleBuildingSelect();
        } else if (name === "main_category_id") {
            this.handleMainCategorySelect();
        } else if (name === "sub_category_1_id") {
            this.handleSubCategory1Select();
        } else if (name === "sub_category_2_id") {
            this.handleSubCategory2Select();
            let res = value && value.length && dropDownList?.sub_category_2s.filter(item => item?.id === value);
            this.setState({
                data: {
                    ...this.state.data,
                    subcategory2_description: res.length && res[0]?.subcategory2_description
                }
            });
        } else if (name === "trade_id") {
            this.handleTradeSelect();
        } else if (name === "system_id") {
            this.handleSystemSelect();
        } else if (name === "client_asset_condition_id"){
            let res =  value && value.length &&  dropDownList?.asset_conditions.filter(item => item.id === value)
            console.log("o",res)
            this.setState({
                data: {
                    ...this.state.data,
                    description: res.length && res[0]?.description
                }
            });
            // this.setState({assetConditionData :res })
        }
    };

    handleLevel1Select = async () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_2_id: "",
                uniformat_level_3_id: "",
                uniformat_level_4_id: "",
                uniformat_level_5_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_2_id: true,
                uniformat_level_3_id: true,
                uniformat_level_4_id: true,
                uniformat_level_5_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_2s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id
        });
    };

    handleLevel2Select = async () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_3_id: "",
                uniformat_level_4_id: "",
                uniformat_level_5_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_3_id: true,
                uniformat_level_4_id: true,
                uniformat_level_5_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_3s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id
        });
    };
    handleLevel3Select = async () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_4_id: "",
                uniformat_level_5_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_4_id: true,
                uniformat_level_5_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_4s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id
        });
    };
    handleLevel4Select = async () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_5_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_5_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_5s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id,
            uniformat_level_4_id: this.state.data.uniformat_level_4_id
        });
    };
    handleLevel5Select = async () => {
        this.setState({
            data: {
                ...this.state.data,
                uniformat_level_6_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                uniformat_level_6_id: true
            }
        });
        this.props.getDropdownList("uniformat_level_6s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id,
            uniformat_level_4_id: this.state.data.uniformat_level_4_id,
            uniformat_level_5_id: this.state.data.uniformat_level_5_id
        });
    };
    handleLevel6Select = async () => {
        // this.setState({
        //     data: {
        //         ...this.state.data,
        //         uniformat_level_6_id: "",
        //     },
        //     errorParams: {
        //         ...this.state.errorParams,
        //         uniformat_level_6_id: true
        //     }
        // });
        this.props.getDropdownList("uniformat_level_6s", {
            uniformat_level_1_id: this.state.data.uniformat_level_1_id,
            uniformat_level_2_id: this.state.data.uniformat_level_2_id,
            uniformat_level_3_id: this.state.data.uniformat_level_3_id,
            uniformat_level_4_id: this.state.data.uniformat_level_4_id,
            uniformat_level_5_id: this.state.data.uniformat_level_5_id,
            uniformat_level_6_id: this.state.data.uniformat_level_6_id
        });
    };

    handleClientSelect = async () => {
        this.setState({
            data: {
                ...this.state.data,
                asset_type_id: "",
                asset_status_id: "",
                client_asset_condition_id: "",
                region_id: "",
                site_id: "",
                building_id: "",
                addition_id: "",
                floor_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                asset_type_id: false,
                asset_status_id: false,
                client_asset_condition_id: false,
                region_id: false,
                site_id: false,
                building_id: false,
                addition_id: false,
                floor_id: false
            }
        });
        this.props.getDropdownList("regions", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("asset_statuses", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("asset_types", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("asset_conditions", {
            client_id: this.state.data.client_id
        });
        this.props.getDropdownList("main_categories", {
            client_id: this.state.data.client_id
        });
    };

    handleRegionSelect = async () => {
        this.setState({
            data: {
                ...this.state.data,
                site_id: "",
                building_id: "",
                addition_id: "",
                floor_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                site_id: false,
                building_id: false,
                addition_id: false,
                floor_id: false
            }
        });
        this.props.getDropdownList("sites", {
            region_id: this.state.data.region_id
        });
    };
    handleTradeSelect = async () => {
        this.setState({
            data: {
                ...this.state.data,
                system_id: "",
                sub_system_id: ""
            }
            // errorParams: {
            //     ...this.state.errorParams,
            //     site_id: false,
            //     building_id: false,
            //     addition_id: false,
            //     floor_id: false
            // }
        });
        this.props.getDropdownList("systems", {
            trade_id: this.state.data.trade_id,
            client_id: this.state.data.client_id
        });
    };
    handleSystemSelect = async () => {
        this.setState({
            data: {
                ...this.state.data,
                sub_system_id: ""
            }
            // errorParams: {
            //     ...this.state.errorParams,
            //     site_id: false,
            //     building_id: false,
            //     addition_id: false,
            //     floor_id: false
            // }
        });
        this.props.getDropdownList("sub_systems", {
            client_id: this.state.data.client_id,
            system_id: this.state.data.system_id
        });
    };

    handleSiteSelect = async () => {
        this.setState({
            data: {
                ...this.state.data,
                building_id: "",
                addition_id: "",
                floor_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                building_id: false,
                addition_id: false,
                floor_id: false
            }
        });
        this.props.getDropdownList("buildings", {
            site_id: this.state.data.site_id
        });
    };

    handleBuildingSelect = async () => {
        this.setState({
            data: {
                ...this.state.data,
                addition_id: "",
                floor_id: "",
                building_type: this.props.assetReducer.dropDownList?.buildings?.find(item => item.id === this.state.data.building_id)?.building_type
            },
            errorParams: {
                ...this.state.errorParams,
                addition_id: false,
                floor_id: false
            }
        });
        this.props.getDropdownList("floors", {
            building_id: this.state.data.building_id
        });
        this.props.getDropdownList("additions", {
            building_id: this.state.data.building_id
        });
    };

    handleMainCategorySelect = async () => {
        this.setState({
            data: {
                ...this.state.data,
                sub_category_1_id: "",
                sub_category_2_id: "",
                sub_category_3_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                sub_category_1_id: true,
                sub_category_2_id: true,
                sub_category_3_id: true
            }
        });
        this.props.getDropdownList("sub_category_1s", {
            client_id: this.state.data.client_id,
            main_category_id: this.state.data.main_category_id
        });
    };

    handleSubCategory1Select = async () => {
        this.setState({
            data: {
                ...this.state.data,
                sub_category_2_id: "",
                sub_category_3_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                sub_category_2_id: true,
                sub_category_3_id: true
            }
        });
        this.props.getDropdownList("sub_category_2s", {
            client_id: this.state.data.client_id,
            main_category_id: this.state.data.main_category_id,
            sub_category_1_id: this.state.data.sub_category_1_id
        });
    };

    handleSubCategory2Select = async () => {
        this.setState({
            data: {
                ...this.state.data,
                sub_category_3_id: ""
            },
            errorParams: {
                ...this.state.errorParams,
                sub_category_3_id: true
            }
        });
        this.props.getDropdownList("sub_category_3s", {
            client_id: this.state.data.client_id,
            main_category_id: this.state.data.main_category_id,
            sub_category_1_id: this.state.data.sub_category_1_id,
            sub_category_2_id: this.state.data.sub_category_2_id
        });
    };
    render() {
        const { isLoading } = this.state;
        const { data, showErrorBorder, errorParams } = this.state;
        const {
            selectedData,
            assetReducer: { dropDownList }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);

        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedData ? "Edit Asset" : "Add Asset"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="otr-asset-grp">
                                                <InputBox
                                                    label="Asset Name *"
                                                    name="asset_name"
                                                    value={data.asset_name}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Asset Description "
                                                    name="asset_description"
                                                    value={data.asset_description}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <SelectBox
                                                    label="Asset Type "
                                                    name="asset_type_id"
                                                    value={data.asset_type_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={dropDownList?.asset_types}
                                                />
                                                <SelectBox
                                                    label="Asset Status"
                                                    name="asset_status_id"
                                                    value={data.asset_status_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={dropDownList?.asset_statuses}
                                                />
                                                <SelectBox
                                                    label="Asset Condition"
                                                    name="client_asset_condition_id"
                                                    value={data.client_asset_condition_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={dropDownList?.asset_conditions}
                                                />
                                                <InputBox
                                                    isDisabled
                                                    label="Asset Condition Description"
                                                    name="asset_condition_description"
                                                    value={data?.description ? data?.description || "" : ""}
                                                    type="text"
                                                    // handleChange={this.handleChange}
                                                    // errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Criticality"
                                                    name="criticality"
                                                    value={data.criticality}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Asset Tag"
                                                    name="asset_tag"
                                                    value={data.asset_tag}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="GUID"
                                                    name="guid"
                                                    value={data.guid}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Model Number"
                                                    name="model_number"
                                                    value={data.model_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Serial Number"
                                                    name="serial_number"
                                                    value={data.serial_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Capacity"
                                                    name="capacity"
                                                    value={data.capacity}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Capacity Unit"
                                                    name="capacity_unit"
                                                    value={data.capacity_unit}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Capacity Status"
                                                    name="capacity_status"
                                                    value={data.capacity_status}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Asset Barcode "
                                                    name="asset_barcode"
                                                    value={data.asset_barcode}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Asset Client ID "
                                                    name="asset_client_id"
                                                    value={data.asset_client_id}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Asset CMMS ID "
                                                    name="asset_cmms_id"
                                                    value={data.asset_cmms_id}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Name Plate Status"
                                                    name="name_plate_status"
                                                    value={data.name_plate_status}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />

                                                <InputBox
                                                    label="RTLS Tag"
                                                    name="rtls_tag"
                                                    value={data.rtls_tag}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                            </div>
                                            {/* ----------------------------- */}
                                            <div className="otr-asset-grp">
                                                <SelectBox
                                                    label="Client *"
                                                    name="client_id"
                                                    value={data.client_id}
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                    optionsList={dropDownList?.clients || []}
                                                    isDisabled={query.isRecomAsset || query.c_id}
                                                />
                                                <SelectBox
                                                    label="Region *"
                                                    name="region_id"
                                                    value={data.region_id}
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                    optionsList={data.client_id ? dropDownList?.regions : []}
                                                    isDisabled={query.isRecomAsset || query.r_id}
                                                />
                                                <SelectBox
                                                    label="Site *"
                                                    name="site_id"
                                                    value={data.site_id}
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                    optionsList={data.region_id ? dropDownList?.sites : []}
                                                    isDisabled={query.isRecomAsset || query.s_id}
                                                />
                                                <SelectBox
                                                    label="Building *"
                                                    name="building_id"
                                                    value={data.building_id}
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                    optionsList={data.site_id ? dropDownList?.buildings : []}
                                                    isDisabled={query.isRecomAsset || query.b_id}
                                                />
                                                <InputBox
                                                    label="Building Type"
                                                    name="building_type"
                                                    value={data.building_type}
                                                    isDisabled
                                                    errorParams={errorParams}
                                                />
                                                <SelectBox
                                                    label="Addition"
                                                    name="addition_id"
                                                    value={data.addition_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.building_id ? dropDownList?.additions : []}
                                                    isDisabled={query.isRecomAsset}
                                                />
                                                <SelectBox
                                                    label="Floor"
                                                    name="floor_id"
                                                    value={data.floor_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.building_id ? dropDownList?.floors : []}
                                                    isDisabled={query.isRecomAsset}
                                                />
                                                <InputBox
                                                    label="Room Number"
                                                    name="room_number"
                                                    value={data.room_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    isDisabled={query.isRecomAsset}
                                                />
                                                <InputBox
                                                    label="Room Name"
                                                    name="room_name"
                                                    value={data.room_name}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Location"
                                                    name="location"
                                                    value={data.location}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Architectural Room Number"
                                                    name="architectural_room_number"
                                                    value={data.architectural_room_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Additional Room Description"
                                                    name="additional_room_description"
                                                    value={data.additional_room_description}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Longitude"
                                                    name="longitude"
                                                    value={data.longitude}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Latitude"
                                                    name="latitude"
                                                    value={data.latitude}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                            </div>
                                            {/* ----------------------------- */}

                                            <div className="otr-asset-grp">
                                                <InputBox
                                                    label="Manufacturer"
                                                    name="manufacturer"
                                                    value={data.manufacturer}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Year Manufactured</h4>
                                                        <NumberFormat
                                                            autoComplete={"nope"}
                                                            className=" custom-input form-control"
                                                            placeholder="Year Manufactored"
                                                            value={parseInt(data.year_manufactured) || ""}
                                                            format="####"
                                                            displayType={"input"}
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        year_manufactured: value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Installed Year</h4>
                                                        <NumberFormat
                                                            autoComplete={"nope"}
                                                            className=" custom-input form-control"
                                                            placeholder="Installed Year"
                                                            value={parseInt(data.installed_year) || ""}
                                                            format="####"
                                                            displayType={"input"}
                                                            isAllowed={({ value }) => value <= new Date().getFullYear()}
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        installed_year: value,
                                                                        usefull_life_remaining: getUsefullLifeRemaining(value, data.service_life),
                                                                        current_age:getCurrentAge(value)
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <InputBox
                                                    label="Install Year Status"
                                                    name="installed_year_status"
                                                    value={data.installed_year_status}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    isDisabled
                                                    label="Current Age"
                                                    name="current_age"
                                                    value={data.current_age}
                                                    type="text"
                                                    // handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Service Life</h4>
                                                        <NumberFormat
                                                            autoComplete={"nope"}
                                                            className=" custom-input form-control"
                                                            placeholder="Installed Year"
                                                            value={parseInt(data.service_life) || ""}
                                                            format="####"
                                                            displayType={"input"}
                                                            // isAllowed={({ value }) => value <= new Date().getFullYear()}
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        service_life: value,
                                                                        usefull_life_remaining: getUsefullLifeRemaining(data.installed_year, value)
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <InputBox
                                                    dataTip={
                                                        data.usefull_life_remaining
                                                            ? `Year= ${new Date().getFullYear() + data.usefull_life_remaining}`
                                                            : ""
                                                    }
                                                    label="Useful Life Remaining"
                                                    name="usefull_life_remaining"
                                                    value={data.usefull_life_remaining}
                                                    type="text"
                                                    isDisabled
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>CRV</h4>
                                                        <NumberFormat
                                                            autoComplete={"nope"}
                                                            className="custom-input form-control"
                                                            placeholder="CRV"
                                                            value={parseInt(data.crv) || ""}
                                                            thousandSeparator={true}
                                                            displayType={"input"}
                                                            prefix={"$ "}
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        crv: value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                {/* ------------------------------ */}
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Warranty Start</h4>
                                                        <DatePicker
                                                            autoComplete={"nope"}
                                                            placeholderText="MM/DD/YYYY"
                                                            className="custom-input form-control"
                                                            selected={data.warranty_start ? new Date(data.warranty_start) : ""}
                                                            onChange={date => {
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        warranty_start: date ? new Date(date) : null
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Warranty End</h4>
                                                        <DatePicker
                                                            autoComplete={"nope"}
                                                            placeholderText="MM/DD/YYYY"
                                                            className="custom-input form-control"
                                                            selected={data.warranty_end ? new Date(data.warranty_end) : ""}
                                                            onChange={date => {
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        warranty_end: date ? new Date(date) : null
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Install Date</h4>
                                                        <DatePicker
                                                            autoComplete={"nope"}
                                                            placeholderText="MM/DD/YYYY"
                                                            className="custom-input form-control"
                                                            selected={data.install_date ? new Date(data.install_date) : ""}
                                                            onChange={date => {
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        install_date: date ? new Date(date) : null
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Startup Date</h4>
                                                        <DatePicker
                                                            autoComplete={"nope"}
                                                            placeholderText="MM/DD/YYYY"
                                                            className="custom-input form-control"
                                                            selected={data.startup_date ? new Date(data.startup_date) : ""}
                                                            onChange={date => {
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        startup_date: date ? new Date(date) : null
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                {/* ------------------------------ */}
                                                <SelectBox
                                                    label="Uniformat Level 1 "
                                                    name="uniformat_level_1_id"
                                                    value={data.uniformat_level_1_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={dropDownList?.uniformat_level_1s || []}
                                                />
                                                <SelectBox
                                                    label="Uniformat Level 2 "
                                                    name="uniformat_level_2_id"
                                                    value={data.uniformat_level_2_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.uniformat_level_1_id ? dropDownList?.uniformat_level_2s : []}
                                                />
                                                <SelectBox
                                                    label="Uniformat Level 3 "
                                                    name="uniformat_level_3_id"
                                                    value={data.uniformat_level_3_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.uniformat_level_2_id ? dropDownList?.uniformat_level_3s : []}
                                                />
                                                <SelectBox
                                                    label="Uniformat Level 4 "
                                                    name="uniformat_level_4_id"
                                                    value={data.uniformat_level_4_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.uniformat_level_3_id ? dropDownList?.uniformat_level_4s : []}
                                                />
                                                <SelectBox
                                                    label="Uniformat Level 5 "
                                                    name="uniformat_level_5_id"
                                                    value={data.uniformat_level_5_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.uniformat_level_4_id ? dropDownList?.uniformat_level_5s : []}
                                                />{" "}
                                                <SelectBox
                                                    label="Uniformat Level 6 "
                                                    name="uniformat_level_6_id"
                                                    value={data.uniformat_level_6_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.uniformat_level_5_id ? dropDownList?.uniformat_level_6s : []}
                                                />
                                                <InputBox
                                                    isDisabled
                                                    label="Uniformat Level 6 Description"
                                                    name="uniformat_level_6_description"
                                                    value={
                                                        data.uniformat_level_6_id && data?.uniformat_level_6_description
                                                            ? data.uniformat_level_6_description || ""
                                                            : ""
                                                    }
                                                    type="text"
                                                />
                                                {/* <div className={`col-md-${3} basic-box`}></div> */}
                                                <SelectBox
                                                    label="Main Category "
                                                    name="main_category_id"
                                                    value={data.main_category_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data?.client_id ? dropDownList?.main_categories : []}
                                                />
                                                <SelectBox
                                                    label="Sub Category 1 "
                                                    name="sub_category_1_id"
                                                    value={data.sub_category_1_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.main_category_id ? dropDownList?.sub_category_1s : []}
                                                />
                                                <SelectBox
                                                    label="Sub Category 2 "
                                                    name="sub_category_2_id"
                                                    value={data.sub_category_2_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.sub_category_1_id ? dropDownList?.sub_category_2s : []}
                                                />
                                                <InputBox
                                                    isDisabled
                                                    label="Sub Category 2 Description"
                                                    name="subcategory2_description"
                                                    value={data?.subcategory2_description ? data?.subcategory2_description || "" : ""}
                                                    type="text"
                                                    // handleChange={this.handleChange}
                                                    // errorParams={errorParams}
                                                />
                                                <SelectBox
                                                    label="Sub Category 3 "
                                                    name="sub_category_3_id"
                                                    value={data.sub_category_3_id}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={data.sub_category_2_id ? dropDownList?.sub_category_3s : []}
                                                />
                                                <SelectBox
                                                    label="Trade *"
                                                    name="trade_id"
                                                    value={data.trade_id}
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                    optionsList={data.client_id ? dropDownList?.trades : []}
                                                    isDisabled={query.isRecomAsset || query.r_id}
                                                />
                                                <SelectBox
                                                    label="System *"
                                                    name="system_id"
                                                    value={data.system_id}
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                    optionsList={data.trade_id ? dropDownList?.systems : []}
                                                    isDisabled={query.isRecomAsset || query.r_id}
                                                />
                                                <SelectBox
                                                    label="Sub-System *"
                                                    name="sub_system_id"
                                                    value={data.sub_system_id}
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                    optionsList={data.system_id ? dropDownList?.sub_systems : []}
                                                    isDisabled={query.isRecomAsset || query.r_id}
                                                />
                                                {/* <InputBox
                                                    label="Current Age"
                                                    name="current_age"
                                                    value={data.current_age}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                /> */}
                                                {/* <InputBox
                                                    label="Age"
                                                    name="age"
                                                    value={data.age}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                /> */}
                                            </div>

                                            {/* ----------------------------- */}
                                            <div className="otr-asset-grp">
                                                <InputBox
                                                    label="Asset Survey Id"
                                                    name="survey_id"
                                                    value={data.survey_id}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                {/* <InputBox
                                                    label="Asset Survey Global ID"
                                                    name="asset_survey_global_id"
                                                    value={data.asset_survey_global_id}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                /> */}
                                                <InputBox
                                                    label=" Asset Survey Property Notes"
                                                    name="survey_property_note"
                                                    value={data.survey_property_note}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Capacity Status"
                                                    name="capacity_status"
                                                    value={data.capacity_status}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Install Year Status "
                                                    name="installed_year_status"
                                                    value={data.installed_year_status}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Name Plate Status"
                                                    name="name_plate_status"
                                                    value={data.name_plate_status}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    showErrorBorder={showErrorBorder}
                                                    errorParams={errorParams}
                                                />
                                                {/* <InputBox
                                                    label="Source Panel Barcode Number"
                                                    name="source_panel_barcode_number"
                                                    value={data.source_panel_barcode_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                /> */}
                                                <InputBox
                                                    label="Asset Survey QA/QC Notes"
                                                    name="qa_notes"
                                                    value={data.qa_notes}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Asset Survey Additional QA/QC Notes"
                                                    name="additional_qa_notes"
                                                    value={data.additional_qa_notes}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Asset Survey Date Created</h4>
                                                        <DatePicker
                                                            autoComplete={"nope"}
                                                            placeholderText="MM/DD/YYYY"
                                                            className="custom-input form-control"
                                                            selected={data.survey_date_created ? new Date(data.survey_date_created) : ""}
                                                            onChange={date => {
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        survey_date_created: date ? new Date(date) : null
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <InputBox
                                                    label="Asset Survey Surveyor"
                                                    name="surveyor"
                                                    value={data.surveyor}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Asset Survey Date Edited</h4>
                                                        <DatePicker
                                                            autoComplete={"nope"}
                                                            placeholderText="MM/DD/YYYY"
                                                            className="custom-input form-control"
                                                            selected={data.survey_date_edited ? new Date(data.survey_date_edited) : ""}
                                                            onChange={date => {
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        survey_date_edited: date ? new Date(date) : null
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <InputBox
                                                    label="Asset Survey Editor"
                                                    name="editor"
                                                    value={data.editor}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Parent Global ID"
                                                    name="parent_global_id"
                                                    value={data.parent_global_id}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />

                                                <SelectBox
                                                    label="Is This a New Asset"
                                                    name="new_asset"
                                                    value={data.new_asset}
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                    optionsList={[
                                                        { id: "yes", name: "Yes" },
                                                        { id: "no", name: "No" }
                                                    ]}
                                                />
                                                {/* <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Quantity</h4>
                                                        <NumberFormat
                                                            autoComplete={"nope"}
                                                            className=" custom-input form-control"
                                                            placeholder="Quantity"
                                                            thousandSeparator
                                                            value={parseInt(data.quantity) || ""}
                                                            displayType={"input"}
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        quantity: value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div> */}
                                            </div>
                                            {/* ------------------------------------------------ */}
                                            <div className="otr-asset-grp">
                                                <InputBox
                                                    label="Area Served"
                                                    name="area_served"
                                                    value={data.area_served}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Upstream Asset Barcode Numbers"
                                                    name="upstream_asset_barcode_number"
                                                    value={data.upstream_asset_barcode_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Linked Asset Barcode Numbers"
                                                    name="linked_asset_barcode_number"
                                                    value={data.linked_asset_barcode_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Source Panel Name"
                                                    name="source_panel_name"
                                                    value={data.source_panel_name}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Source Panel Barcode Number"
                                                    name="source_panel_barcode_number"
                                                    value={data.source_panel_barcode_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Source Panel Emergency/ Normal"
                                                    name="source_panel"
                                                    value={data.source_panel}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Skysite Hyperlink"
                                                    name="skysite_hyperlink"
                                                    value={data.skysite_hyperlink}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <InputBox
                                                    label="Asset Notes"
                                                    name="asset_note"
                                                    value={data.asset_note}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    errorParams={errorParams}
                                                />
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Quantity</h4>
                                                        <NumberFormat
                                                            autoComplete={"nope"}
                                                            className=" custom-input form-control"
                                                            placeholder="Quantity"
                                                            thousandSeparator
                                                            value={parseInt(data.quantity) || ""}
                                                            displayType={"input"}
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    data: {
                                                                        ...data,
                                                                        quantity: value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* -------------------------------------- */}
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
                                    {selectedData ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateData()}>
                                            Update
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addData()}>
                                            Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { assetReducer } = state;
    return { assetReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Form)
);

const InputBox = ({ dataTip, label, name, value, handleChange, type, showErrorBorder, errorParams, isDisabled = false, col = 3 }) => {
    return (
        <div className={`col-md-${col} basic-box`}>
            <ReactTooltip id="asset_details" effect="solid" backgroundColor="#007bff" place="top" />
            <div className="codeOtr" data-tip={dataTip} data-for="asset_details">
                <h4>{label}</h4>
                <input
                    autoComplete={"nope"}
                    type={type}
                    className={`${showErrorBorder && errorParams[name] ? "error-border " : ""} ${
                        isDisabled ? "cursor-diabled" : ""
                    } custom-input form-control`}
                    value={value}
                    name={name}
                    onChange={handleChange}
                    placeholder={label.replace("*", "")}
                    disabled={isDisabled}
                />
            </div>
        </div>
    );
};

const SelectBox = ({ label, name, value, handleChange, showErrorBorder, errorParams, optionsList, isDisabled = false, col = 3 }) => {
    return (
        <div className={`col-md-${col} basic-box`}>
            <div className="codeOtr">
                <h4>{label}</h4>
                <div className="custom-selecbox">
                    <select
                        value={value}
                        onChange={handleChange}
                        disabled={isDisabled}
                        name={name}
                        className={`custom-selecbox ${isDisabled ? "cursor-diabled" : ""} ${
                            showErrorBorder && errorParams[name] ? "error-border" : ""
                        }`}
                    >
                        <option value="">Select</option>
                        {optionsList?.length
                            ? optionsList.map((item, i) => (
                                  <option value={item.id} key={item.id}>
                                      {item.name} {name === "building_id" && item.description ? `(${item.description})` : ""}
                                  </option>
                              ))
                            : null}
                    </select>
                </div>
            </div>
        </div>
    );
};
