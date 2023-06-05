import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import actions from "../../assets/actions";
import NumberFormat from "react-number-format";
import { getCurrentAge, getUsefullLifeRemaining } from "../../../config/utils";
import ReactTooltip from "react-tooltip";
class AssetForm extends Component {
    handleChange = async e => {
        const { name, value } = e.target;
        await this.props.handleChangeAssetForm(e);
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
            this.handleLevel6Select(value);
        } else if (name === "main_category_id") {
            this.handleMainCategorySelect();
        } else if (name === "sub_category_1_id") {
            this.handleSubCategory1Select();
        } else if (name === "sub_category_2_id") {
            this.handleSubCategory2Select(value);
        } else if (name === "client_asset_condition_id") {
            this.handleAssetConditionSelect(value);
        }
    };

    handleLevel1Select = async () => {
        let data = {
            ...this.props.assetFormData,
            uniformat_level_2_id: "",
            uniformat_level_3_id: "",
            uniformat_level_4_id: "",
            uniformat_level_5_id: "",
            uniformat_level_6_id: ""
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("uniformat_level_2s", {
            uniformat_level_1_id: this.props.assetFormData.uniformat_level_1_id
        });
    };

    handleLevel2Select = async () => {
        let data = {
            ...this.props.assetFormData,
            uniformat_level_3_id: "",
            uniformat_level_4_id: "",
            uniformat_level_5_id: "",
            uniformat_level_6_id: ""
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("uniformat_level_3s", {
            uniformat_level_1_id: this.props.assetFormData.uniformat_level_1_id,
            uniformat_level_2_id: this.props.assetFormData.uniformat_level_2_id
        });
    };
    handleLevel3Select = async () => {
        let data = {
            ...this.props.assetFormData,
            uniformat_level_4_id: "",
            uniformat_level_5_id: "",
            uniformat_level_6_id: ""
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("uniformat_level_4s", {
            uniformat_level_1_id: this.props.assetFormData.uniformat_level_1_id,
            uniformat_level_2_id: this.props.assetFormData.uniformat_level_2_id,
            uniformat_level_3_id: this.props.assetFormData.uniformat_level_3_id
        });
    };
    handleLevel4Select = async () => {
        let data = {
            ...this.props.assetFormData,
            uniformat_level_5_id: "",
            uniformat_level_6_id: ""
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("uniformat_level_5s", {
            uniformat_level_1_id: this.props.assetFormData.uniformat_level_1_id,
            uniformat_level_2_id: this.props.assetFormData.uniformat_level_2_id,
            uniformat_level_3_id: this.props.assetFormData.uniformat_level_3_id,
            uniformat_level_4_id: this.props.assetFormData.uniformat_level_4_id
        });
    };
    handleLevel5Select = async () => {
        let data = {
            ...this.props.assetFormData,
            uniformat_level_6_id: ""
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("uniformat_level_6s", {
            uniformat_level_1_id: this.props.assetFormData.uniformat_level_1_id,
            uniformat_level_2_id: this.props.assetFormData.uniformat_level_2_id,
            uniformat_level_3_id: this.props.assetFormData.uniformat_level_3_id,
            uniformat_level_4_id: this.props.assetFormData.uniformat_level_4_id,
            uniformat_level_5_id: this.props.assetFormData.uniformat_level_5_id
        });
    };
    handleLevel6Select = async value => {
        const {
            assetReducer: { dropDownList }
        } = this.props;
        const uniformat_level_6_description = dropDownList?.uniformat_level_6s?.find(elem => elem.id === value)?.uniformat_level_6_description || "";
        let data = {
            ...this.props.assetFormData,
            uniformat_level_6_description
        };
        this.props.setAssetFormData(data);
    };

    handleClientSelect = async () => {
        let data = {
            ...this.props.assetFormData,
            asset_type_id: "",
            asset_status_id: "",
            client_asset_condition_id: "",
            region_id: "",
            site_id: "",
            building_id: "",
            addition_id: "",
            floor_id: ""
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("regions", {
            client_id: this.props.assetFormData.client_id
        });
        this.props.getDropdownList("asset_statuses", {
            client_id: this.props.assetFormData.client_id
        });
        this.props.getDropdownList("asset_types", {
            client_id: this.props.assetFormData.client_id
        });
        this.props.getDropdownList("asset_conditions", {
            client_id: this.props.assetFormData.client_id
        });
        this.props.getDropdownList("main_categories", {
            client_id: this.props.assetFormData.client_id
        });
    };

    handleMainCategorySelect = async () => {
        let data = {
            ...this.props.assetFormData,
            sub_category_1_id: "",
            sub_category_2_id: "",
            sub_category_3_id: ""
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("sub_category_1s", {
            client_id: this.props.assetFormData.client_id,
            main_category_id: this.props.assetFormData.main_category_id
        });
    };

    handleSubCategory1Select = async () => {
        let data = {
            ...this.props.assetFormData,
            sub_category_2_id: "",
            sub_category_3_id: ""
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("sub_category_2s", {
            client_id: this.props.assetFormData.client_id,
            main_category_id: this.props.assetFormData.main_category_id,
            sub_category_1_id: this.props.assetFormData.sub_category_1_id
        });
    };

    handleSubCategory2Select = async value => {
        const {
            assetReducer: { dropDownList }
        } = this.props;
        const subcategory2_description = dropDownList?.sub_category_2s?.find(elem => elem.id === value)?.subcategory2_description || "";
        let data = {
            ...this.props.assetFormData,
            sub_category_3_id: "",
            subcategory2_description
        };
        this.props.setAssetFormData(data);
        this.props.getDropdownList("sub_category_3s", {
            client_id: this.props.assetFormData.client_id,
            main_category_id: this.props.assetFormData.main_category_id,
            sub_category_1_id: this.props.assetFormData.sub_category_1_id,
            sub_category_2_id: this.props.assetFormData.sub_category_2_id
        });
    };
    handleAssetConditionSelect = async value => {
        const {
            assetReducer: { dropDownList }
        } = this.props;
        const description = dropDownList?.asset_conditions?.find(elem => elem.id === value)?.description || "";
        let data = {
            ...this.props.assetFormData,
            description
        };
        this.props.setAssetFormData(data);
    };
    render() {
        const { showErrorBorder } = this.props;
        const {
            assetReducer: { dropDownList }
        } = this.props;
        const { assetFormData, clientList, regionList, siteList, buildingList, additionList, floorList, tradeList, systemList, subSystemList } =
            this.props;
        return (
            <div className="dtl-sec col-md-12 p-0 mt-0 mb-0">
                <div className="tab-dtl region-mng">
                    <form autoComplete={"nope"}>
                        <div className="tab-active build-dtl">
                            <div className="otr-common-edit custom-col  border-0 p-0">
                                <div className="basic-otr">
                                    <div className="basic-dtl-otr basic-sec">
                                        <div className="otr-asset-grp">
                                            <InputBox label="Asset Code" value={assetFormData.code} type="text" isDisabled />
                                            <InputBox
                                                label="Asset Name *"
                                                name="asset_name"
                                                value={assetFormData.asset_name}
                                                type="text"
                                                handleChange={this.handleChange}
                                                showErrorBorder={showErrorBorder && !assetFormData?.asset_name?.trim()?.length}
                                            />
                                            <SelectBox label="Client *" value={assetFormData.client_id} optionsList={clientList || []} isDisabled />
                                            <InputBox
                                                label="Asset Description "
                                                name="asset_description"
                                                value={assetFormData.asset_description}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <SelectBox
                                                label="Asset Type "
                                                name="asset_type_id"
                                                value={assetFormData.asset_type_id}
                                                handleChange={this.handleChange}
                                                optionsList={dropDownList?.asset_types}
                                            />
                                            <SelectBox
                                                label="Asset Status"
                                                name="asset_status_id"
                                                value={assetFormData.asset_status_id}
                                                handleChange={this.handleChange}
                                                optionsList={dropDownList?.asset_statuses}
                                            />
                                            <SelectBox
                                                label="Asset Condition"
                                                name="client_asset_condition_id"
                                                value={assetFormData.client_asset_condition_id}
                                                handleChange={this.handleChange}
                                                showErrorBorder={showErrorBorder && !assetFormData?.client_asset_condition_id?.trim()?.length}
                                                optionsList={dropDownList?.asset_conditions}
                                            />
                                            <InputBox
                                                isDisabled
                                                label="Asset Condition Description"
                                                name="description"
                                                value={assetFormData.description}
                                                type="text"
                                            />
                                            <InputBox
                                                label="Criticality"
                                                name="criticality"
                                                value={assetFormData.criticality}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Asset Tag"
                                                name="asset_tag"
                                                value={assetFormData.asset_tag}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="GUID"
                                                name="guid"
                                                value={assetFormData.guid}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Model Number"
                                                name="model_number"
                                                value={assetFormData.model_number}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Serial Number"
                                                name="serial_number"
                                                value={assetFormData.serial_number}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Capacity"
                                                name="capacity"
                                                value={assetFormData.capacity}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Capacity Unit"
                                                name="capacity_unit"
                                                value={assetFormData.capacity_unit}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Capacity Status"
                                                name="capacity_status"
                                                value={assetFormData.capacity_status}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Asset Barcode "
                                                name="asset_barcode"
                                                value={assetFormData.asset_barcode}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Asset Client ID "
                                                name="asset_client_id"
                                                value={assetFormData.asset_client_id}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Asset CMMS ID "
                                                name="asset_cmms_id"
                                                value={assetFormData.asset_cmms_id}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Name Plate Status"
                                                name="name_plate_status"
                                                value={assetFormData.name_plate_status}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="RTLS Tag"
                                                name="rtls_tag"
                                                value={assetFormData.rtls_tag}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                        </div>
                                        {/* ----------------------------- */}
                                        <div className="otr-asset-grp">
                                            <SelectBox
                                                label="Region *"
                                                value={assetFormData.region_id}
                                                optionsList={assetFormData.client_id ? regionList : []}
                                                isDisabled
                                            />
                                            <SelectBox
                                                label="Site *"
                                                name="site_id"
                                                value={assetFormData.site_id}
                                                optionsList={assetFormData.region_id ? siteList : []}
                                                isDisabled
                                            />
                                            <SelectBox
                                                label="Building *"
                                                name="building_id"
                                                value={assetFormData.building_id}
                                                optionsList={assetFormData.site_id ? buildingList : []}
                                                isDisabled
                                            />
                                            <InputBox label="Building Type" value={assetFormData.building_type} isDisabled />
                                            <SelectBox
                                                label="Addition"
                                                value={assetFormData.addition_id}
                                                optionsList={assetFormData.building_id ? additionList : []}
                                                isDisabled
                                            />
                                            <SelectBox
                                                label="Floor"
                                                value={assetFormData.floor_id}
                                                optionsList={assetFormData.building_id ? floorList : []}
                                                isDisabled
                                            />
                                            <InputBox label="Room Number" value={assetFormData.room_number} type="text" isDisabled />
                                            <InputBox
                                                label="Room Name"
                                                name="room_name"
                                                value={assetFormData.room_name}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Location"
                                                name="location"
                                                value={assetFormData.location}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Architectural Room Number"
                                                name="architectural_room_number"
                                                value={assetFormData.architectural_room_number}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Additional Room Description"
                                                name="additional_room_description"
                                                value={assetFormData.additional_room_description}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Longitude"
                                                name="longitude"
                                                value={assetFormData.longitude}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Latitude"
                                                name="latitude"
                                                value={assetFormData.latitude}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                        </div>
                                        {/* ----------------------------- */}
                                        <div className="otr-asset-grp">
                                            <InputBox
                                                label="Manufacturer"
                                                name="manufacturer"
                                                value={assetFormData.manufacturer}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Year Manufactured</h4>
                                                    <NumberFormat
                                                        autoComplete={"nope"}
                                                        className=" custom-input form-control"
                                                        placeholder="Year Manufactored"
                                                        value={parseInt(assetFormData.year_manufactured) || ""}
                                                        format="####"
                                                        displayType={"input"}
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            let data = {
                                                                ...assetFormData,
                                                                year_manufactured: value
                                                            };
                                                            this.props.setAssetFormData(data);
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
                                                        value={parseInt(assetFormData.installed_year) || ""}
                                                        format="####"
                                                        displayType={"input"}
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            let data = {
                                                                ...assetFormData,
                                                                installed_year: value,
                                                                usefull_life_remaining: getUsefullLifeRemaining(value, assetFormData.service_life),
                                                                current_age: getCurrentAge(value)
                                                            };
                                                            this.props.setAssetFormData(data);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <InputBox
                                                label="Install Year Status"
                                                name="installed_year_status"
                                                value={assetFormData.installed_year_status}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                isDisabled
                                                label="Current Age"
                                                name="current_age"
                                                value={assetFormData.current_age}
                                                type="text"
                                                // handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Service Life"
                                                name="service_life"
                                                value={assetFormData.service_life}
                                                type="text"
                                                handleChange={e => {
                                                    const { value } = e.target;
                                                    let data = {
                                                        ...assetFormData,
                                                        service_life: value,
                                                        usefull_life_remaining: getUsefullLifeRemaining(assetFormData.installed_year, value)
                                                    };
                                                    this.props.setAssetFormData(data);
                                                }}
                                            />
                                            <InputBox
                                                label="Useful Life Remaining"
                                                name="usefull_life_remaining"
                                                value={assetFormData.usefull_life_remaining}
                                                type="text"
                                                isDisabled
                                                handleChange={this.handleChange}
                                                dataTip={
                                                    assetFormData.usefull_life_remaining
                                                        ? `Year= ${new Date().getFullYear() + assetFormData.usefull_life_remaining}`
                                                        : ""
                                                }
                                            />
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>CRV</h4>
                                                    <NumberFormat
                                                        autoComplete={"nope"}
                                                        className="custom-input form-control"
                                                        placeholder="CRV"
                                                        value={parseInt(assetFormData.crv) || ""}
                                                        thousandSeparator={true}
                                                        displayType={"input"}
                                                        prefix={"$ "}
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            let data = {
                                                                ...assetFormData,
                                                                crv: value
                                                            };
                                                            this.props.setAssetFormData(data);
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
                                                        selected={assetFormData.warranty_start ? new Date(assetFormData.warranty_start) : ""}
                                                        onChange={date => {
                                                            let data = {
                                                                ...assetFormData,
                                                                warranty_start: date ? new Date(date) : null
                                                            };
                                                            this.props.setAssetFormData(data);
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
                                                        selected={assetFormData.warranty_end ? new Date(assetFormData.warranty_end) : ""}
                                                        onChange={date => {
                                                            let data = {
                                                                ...assetFormData,
                                                                warranty_end: date ? new Date(date) : null
                                                            };
                                                            this.props.setAssetFormData(data);
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
                                                        selected={assetFormData.install_date ? new Date(assetFormData.install_date) : ""}
                                                        onChange={date => {
                                                            let data = {
                                                                ...assetFormData,
                                                                install_date: date ? new Date(date) : null
                                                            };
                                                            this.props.setAssetFormData(data);
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
                                                        selected={assetFormData.startup_date ? new Date(assetFormData.startup_date) : ""}
                                                        onChange={date => {
                                                            let data = {
                                                                ...assetFormData,
                                                                startup_date: date ? new Date(date) : null
                                                            };
                                                            this.props.setAssetFormData(data);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* ------------------------------ */}
                                            <SelectBox
                                                label="Uniformat Level 1 "
                                                name="uniformat_level_1_id"
                                                value={assetFormData.uniformat_level_1_id}
                                                handleChange={this.handleChange}
                                                optionsList={dropDownList?.uniformat_level_1s || []}
                                            />
                                            <SelectBox
                                                label="Uniformat Level 2 "
                                                name="uniformat_level_2_id"
                                                value={assetFormData.uniformat_level_2_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData.uniformat_level_1_id ? dropDownList?.uniformat_level_2s : []}
                                            />
                                            <SelectBox
                                                label="Uniformat Level 3 "
                                                name="uniformat_level_3_id"
                                                value={assetFormData.uniformat_level_3_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData.uniformat_level_2_id ? dropDownList?.uniformat_level_3s : []}
                                            />
                                            <SelectBox
                                                label="Uniformat Level 4 "
                                                name="uniformat_level_4_id"
                                                value={assetFormData.uniformat_level_4_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData.uniformat_level_3_id ? dropDownList?.uniformat_level_4s : []}
                                            />
                                            <SelectBox
                                                label="Uniformat Level 5 "
                                                name="uniformat_level_5_id"
                                                value={assetFormData.uniformat_level_5_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData.uniformat_level_4_id ? dropDownList?.uniformat_level_5s : []}
                                            />
                                            <SelectBox
                                                label="Uniformat Level 6 "
                                                name="uniformat_level_6_id"
                                                value={assetFormData.uniformat_level_6_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData.uniformat_level_5_id ? dropDownList?.uniformat_level_6s : []}
                                            />
                                            <InputBox
                                                isDisabled
                                                label="Uniformat Level 6 Description"
                                                name="uniformat_level_6_description"
                                                value={
                                                    assetFormData.uniformat_level_6_id && assetFormData?.uniformat_level_6_description
                                                        ? assetFormData.uniformat_level_6_description || ""
                                                        : ""
                                                }
                                                type="text"
                                            />
                                            {/* <div className={`col-md-${3} basic-box`}></div> */}
                                            <SelectBox
                                                label="Main Category "
                                                name="main_category_id"
                                                value={assetFormData.main_category_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData?.client_id ? dropDownList?.main_categories : []}
                                            />
                                            <SelectBox
                                                label="Sub Category 1 "
                                                name="sub_category_1_id"
                                                value={assetFormData.sub_category_1_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData.main_category_id ? dropDownList?.sub_category_1s : []}
                                            />
                                            <SelectBox
                                                label="Sub Category 2 "
                                                name="sub_category_2_id"
                                                value={assetFormData.sub_category_2_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData.sub_category_1_id ? dropDownList?.sub_category_2s : []}
                                            />
                                            <InputBox
                                                isDisabled
                                                label="Sub Category 2 Description"
                                                name="subcategory2_description"
                                                value={assetFormData?.subcategory2_description ? assetFormData?.subcategory2_description || "" : ""}
                                                type="text"
                                                // handleChange={this.handleChange}
                                                // errorParams={errorParams}
                                            />
                                            <SelectBox
                                                label="Sub Category 3 "
                                                name="sub_category_3_id"
                                                value={assetFormData.sub_category_3_id}
                                                handleChange={this.handleChange}
                                                optionsList={assetFormData.sub_category_2_id ? dropDownList?.sub_category_3s : []}
                                            />
                                            <SelectBox label="Trade *" value={assetFormData.trade_id} optionsList={tradeList || []} isDisabled />
                                            <SelectBox
                                                label="System *"
                                                name="system_id"
                                                value={assetFormData.system_id}
                                                optionsList={systemList || []}
                                                isDisabled
                                            />
                                            <SelectBox
                                                label="Sub-System *"
                                                name="sub_system_id"
                                                value={assetFormData.sub_system_id}
                                                optionsList={subSystemList || []}
                                                isDisabled
                                            />
                                        </div>
                                        {/* ----------------------------- */}
                                        <div className="otr-asset-grp">
                                            <InputBox
                                                label="Asset Survey Id"
                                                name="survey_id"
                                                value={assetFormData.survey_id}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label=" Asset Survey Property Notes"
                                                name="survey_property_note"
                                                value={assetFormData.survey_property_note}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Capacity Status"
                                                name="capacity_status"
                                                value={assetFormData.capacity_status}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Install Year Status "
                                                name="installed_year_status"
                                                value={assetFormData.installed_year_status}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Name Plate Status"
                                                name="name_plate_status"
                                                value={assetFormData.name_plate_status}
                                                type="text"
                                                handleChange={this.handleChange}
                                                showErrorBorder={showErrorBorder}
                                            />
                                            {/* <InputBox
                                                    label="Source Panel Barcode Number"
                                                    name="source_panel_barcode_number"
                                                    value={assetFormData.source_panel_barcode_number}
                                                    type="text"
                                                    handleChange={this.handleChange}
                                                    
                                                /> */}
                                            <InputBox
                                                label="Asset Survey QA/QC Notes"
                                                name="qa_notes"
                                                value={assetFormData.qa_notes}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Asset Survey Additional QA/QC Notes"
                                                name="additional_qa_notes"
                                                value={assetFormData.additional_qa_notes}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Asset Survey Date Created</h4>
                                                    <DatePicker
                                                        autoComplete={"nope"}
                                                        placeholderText="MM/DD/YYYY"
                                                        className="custom-input form-control"
                                                        selected={
                                                            assetFormData.survey_date_created ? new Date(assetFormData.survey_date_created) : ""
                                                        }
                                                        onChange={date => {
                                                            let data = {
                                                                ...assetFormData,
                                                                survey_date_created: date ? new Date(date) : null
                                                            };
                                                            this.props.setAssetFormData(data);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <InputBox
                                                label="Asset Survey Surveyor"
                                                name="surveyor"
                                                value={assetFormData.surveyor}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Asset Survey Date Edited</h4>
                                                    <DatePicker
                                                        autoComplete={"nope"}
                                                        placeholderText="MM/DD/YYYY"
                                                        className="custom-input form-control"
                                                        selected={assetFormData.survey_date_edited ? new Date(assetFormData.survey_date_edited) : ""}
                                                        onChange={date => {
                                                            let data = {
                                                                ...assetFormData,
                                                                survey_date_edited: date ? new Date(date) : null
                                                            };
                                                            this.props.setAssetFormData(data);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <InputBox
                                                label="Asset Survey Editor"
                                                name="editor"
                                                value={assetFormData.editor}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Parent Global ID"
                                                name="parent_global_id"
                                                value={assetFormData.parent_global_id}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />

                                            <SelectBox
                                                label="Is This a New Asset"
                                                name="new_asset"
                                                value={assetFormData.new_asset}
                                                handleChange={this.handleChange}
                                                optionsList={[
                                                    { id: "yes", name: "Yes" },
                                                    { id: "no", name: "No" }
                                                ]}
                                            />
                                        </div>
                                        {/* ------------------------------------------------ */}
                                        <div className="otr-asset-grp">
                                            <InputBox
                                                label="Area Served"
                                                name="area_served"
                                                value={assetFormData.area_served}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Upstream Asset Barcode Numbers"
                                                name="upstream_asset_barcode_number"
                                                value={assetFormData.upstream_asset_barcode_number}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Linked Asset Barcode Numbers"
                                                name="linked_asset_barcode_number"
                                                value={assetFormData.linked_asset_barcode_number}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Source Panel Name"
                                                name="source_panel_name"
                                                value={assetFormData.source_panel_name}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Source Panel Barcode Number"
                                                name="source_panel_barcode_number"
                                                value={assetFormData.source_panel_barcode_number}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Source Panel Emergency/ Normal"
                                                name="source_panel"
                                                value={assetFormData.source_panel}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Skysite Hyperlink"
                                                name="skysite_hyperlink"
                                                value={assetFormData.skysite_hyperlink}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <InputBox
                                                label="Asset Notes"
                                                name="asset_note"
                                                value={assetFormData.asset_note}
                                                type="text"
                                                handleChange={this.handleChange}
                                            />
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Quantity</h4>
                                                    <NumberFormat
                                                        autoComplete={"nope"}
                                                        className=" custom-input form-control"
                                                        placeholder="Quantity"
                                                        name="quantity"
                                                        thousandSeparator
                                                        value={parseInt(assetFormData.quantity) || ""}
                                                        displayType={"input"}
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            let data = {
                                                                ...assetFormData,
                                                                quantity: value
                                                            };
                                                            this.props.setAssetFormData(data);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
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
    })(AssetForm)
);

const InputBox = ({ label, name, value, handleChange, type, showErrorBorder, isDisabled = false, col = 3, dataTip }) => {
    return (
        <div className={`col-md-${col} basic-box`}>
            <ReactTooltip id="asset_details" effect="solid" backgroundColor="#007bff" place="top" />
            <div className="codeOtr" data-tip={dataTip} data-for="asset_details">
                <h4>{label}</h4>
                <input
                    autoComplete={"nope"}
                    type={type}
                    className={`${showErrorBorder ? "error-border " : ""} ${isDisabled ? "cursor-diabled" : ""} custom-input form-control`}
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
                        className={`custom-selecbox ${isDisabled ? "cursor-diabled" : ""} ${showErrorBorder ? "error-border" : ""}`}
                    >
                        <option value="">Select</option>
                        {optionsList?.length
                            ? optionsList.map((item, i) => (
                                  <option value={item.id} key={item.id}>
                                      {item.name}
                                  </option>
                              ))
                            : null}
                    </select>
                </div>
            </div>
        </div>
    );
};
