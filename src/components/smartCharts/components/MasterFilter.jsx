import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { MASTER_FILTER_KEYS } from "../constants";

const MasterFilter = ({
    entity,
    getSmartChartMasterFilterDropDown,
    masterFilterList = {},
    masterFilters = {},
    setSmartChartData,
    currentBand,
    selectedFiltersList = {},
    selectedClient,
    rowIndex,
    ...props
}) => {
    const [selectedDropDown, setSelectedDropdown] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState({});
    const [yearsFilter, setYearsFilter] = useState({ start: "", end: "" });
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const handleClickDropdown = async (key, paramKey) => {
        setSelectedItems(selectedFiltersList?.[paramKey]?.length ? [...selectedFiltersList[paramKey]] : []);
        if (selectedFiltersList?.start) {
            setYearsFilter(prevValue => {
                return {
                    start: selectedFiltersList.start,
                    end: selectedFiltersList.end
                };
            });
        }
        setSelectedDropdown(prevValue => (prevValue === key ? "" : key));
        if (selectedDropDown !== key) await getSmartChartMasterFilterDropDown(key, entity, getParamsForMasterFilter(key));
    };

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [masterFilterList, selectedItems]);

    const getParamsForMasterFilter = key => {
        let currentUser = localStorage.getItem("userId") || "";
        switch (key) {
            case "projects":
                return {
                    client_id: selectedClient || null,
                    user_id: currentUser
                };
            case "regions":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    user_id: currentUser
                    // client_id: selectedClient || null
                };
            case "sites":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    region_id: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    user_id: currentUser
                    // client_id: selectedClient || null
                };
            case "building_types":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    region_id: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_id: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    user_id: currentUser,
                    client_id: selectedClient || null
                };
            case "buildings":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    region_id: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_id: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    building_type_id: selectedFiltersList?.building_types ? [...selectedFiltersList.building_types] : null,
                    user_id: currentUser
                    // client_id: selectedClient || null
                };
            case "energy_mng_projects":
                return {
                    client_id: selectedClient || null,
                    user_id: currentUser
                };
            case "energy_mng_regions":
                return {
                    client_id: selectedClient || null
                };
            case "energy_mng_sites":
                return {
                    region_ids: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    client_id: selectedClient || null
                };
            case "energy_mng_buildings":
                return {
                    region_ids: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_ids: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    client_id: selectedClient || null
                };
            case "energy_mng_years":
                return {
                    region_ids: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_ids: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    building_ids: selectedFiltersList?.building_ids ? [...selectedFiltersList.building_ids] : null,
                    client_id: selectedClient || null
                };
            case "asset_regions":
                return {
                    client_id: selectedClient || null
                };
            case "asset_sites":
                return {
                    region_ids: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    client_id: selectedClient || null
                };
            case "asset_buildings":
                return {
                    region_ids: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_ids: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    client_id: selectedClient || null
                };
            case "years":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    region_id: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_id: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    building_type_id: selectedFiltersList?.building_types ? [...selectedFiltersList.building_types] : null,
                    building_id: selectedFiltersList?.building_ids ? [...selectedFiltersList.building_ids] : null,
                    user_id: currentUser,
                    client_id: selectedClient || null
                };
            case "fmp":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    region_id: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_id: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    building_id: selectedFiltersList?.building_ids ? [...selectedFiltersList.building_ids] : null,
                    building_type_id: selectedFiltersList?.building_types ? [...selectedFiltersList.building_types] : null,
                    user_id: currentUser
                };
            case "infrastructure_requests":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    region_id: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_id: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    building_id: selectedFiltersList?.building_ids ? [...selectedFiltersList.building_ids] : null,
                    building_type_id: selectedFiltersList?.building_types ? [...selectedFiltersList.building_types] : null,
                    user_id: currentUser
                };
            case "additions":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    region_id: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_id: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    building_id: selectedFiltersList?.building_ids ? [...selectedFiltersList.building_ids] : null,
                    building_type_id: selectedFiltersList?.building_types ? [...selectedFiltersList.building_types] : null,
                    user_id: currentUser
                };
            case "fci":
                return {
                    project_id: selectedFiltersList?.project_ids ? [...selectedFiltersList.project_ids] : null,
                    region_id: selectedFiltersList?.region_ids ? [...selectedFiltersList.region_ids] : null,
                    site_id: selectedFiltersList?.site_ids ? [...selectedFiltersList.site_ids] : null,
                    building_id: selectedFiltersList?.building_ids ? [...selectedFiltersList.building_ids] : null,
                    building_type_id: selectedFiltersList?.building_types ? [...selectedFiltersList.building_types] : null,
                    user_id: currentUser
                };
        }
    };

    const renderFilteredList = selectedItem => {
        const searchValue = search[selectedItem];
        // console.log("filteredList", masterFilterList);
        let filteredList = [];
        if (masterFilterList[selectedItem]?.length) {
            filteredList = searchValue?.trim()?.length
                ? masterFilterList[selectedItem].filter(item => item.name?.toString()?.toLowerCase()?.includes(searchValue?.toLocaleLowerCase()))
                : masterFilterList[selectedItem];
        }

        return filteredList;
    };

    const handleSelectDropdown = (selectedId, key = "") => {
        if (key == "projects" || key === "energy_mng_projects") {
            setSelectedItems([selectedId]);
        } else {
            let tempSelectedItems = [...selectedItems];
            if (selectedItems.includes(selectedId)) {
                tempSelectedItems = tempSelectedItems.filter(id => id !== selectedId);
            } else {
                tempSelectedItems.push(selectedId);
            }
            setSelectedItems([...tempSelectedItems]);
        }
    };

    const handleSelectAll = async (key, isChecked) => {
        let temp = [];
        if (masterFilterList[key]?.length) {
            masterFilterList[key].map(data => temp.push(data.id));
        }
        setSelectedItems(isChecked ? [...temp] : []);
    };

    const validate = () => {
        setShowErrorBorder(false);
        if (yearsFilter?.start && !yearsFilter?.end?.toString()?.trim()?.length) {
            setShowErrorBorder(true);
            return false;
        }
        if (yearsFilter?.end && !yearsFilter?.start?.toString()?.trim()?.length) {
            setShowErrorBorder(true);
            return false;
        }
        return true;
    };

    const updateFilter = (key, paramKey, label) => {
        if (key === "years") {
            if (!validate()) {
                return false;
            }
            // return false;
        }
        setSmartChartData("mfilter", {
            mfilterKey: paramKey,
            bandName: currentBand,
            filterValues: key === "years" ? yearsFilter : [...selectedItems],
            entity: entity,
            filterKey: key,
            dropDownData: masterFilterList?.[key] || [],
            filterLabel: label
        });
        setSelectedDropdown(prevValue => (prevValue === key ? "" : key));
        setSelectedItems([]);
    };

    const handleCancelFilter = (key, paramKey) => {
        setSelectedDropdown("");
        setSelectedItems([]);
    };

    const getYearValuesForFilter = type => {
        let yearValues = [];
        let dropDownData = masterFilterList?.years?.length ? [...masterFilterList?.years] : [];
        if (dropDownData.length) {
            const { start, end } = yearsFilter;
            switch (type) {
                case "start":
                    if (end) {
                        yearValues = dropDownData.filter(y => y <= end);
                    } else {
                        yearValues = [...dropDownData];
                    }
                    break;
                case "end":
                    if (start) {
                        yearValues = dropDownData.filter(y => y >= start);
                    } else {
                        yearValues = [...dropDownData];
                    }
                    break;
            }
        }
        return yearValues;
    };

    const getMasterFilterKeys = (keysList = []) => {
        let filterKeys = [];
        if (entity === "project") {
            if (rowIndex === 0) {
                filterKeys = keysList.slice(0, 5);
            } else {
                filterKeys = keysList.slice(5, 10);
            }
        } else {
            filterKeys = [...keysList];
        }
        return filterKeys;
    };

    return (
        <>
            <div class="col-md-12 p-0 pad-50">
                <div class="d-flex itm-nmb">
                    {getMasterFilterKeys(MASTER_FILTER_KEYS[entity]).map((item, i) => (
                        <div class={`col ${selectedFiltersList?.[item.paramKey]?.length ? "bg-th-filtered" : ""}`}>
                            <div class={`dropdown-container ${selectedDropDown === item.key ? "dropdown-open" : ""} `}>
                                <div class="dropdown-toggle click-dropdown" onClick={() => handleClickDropdown(item.key, item.paramKey)}>
                                    {item.label}
                                    <span class="close-reg">
                                        <i class="fas fa-chevron-down"></i>
                                    </span>
                                </div>
                                {selectedDropDown === item.key && (
                                    <div className={`dropdown-menu p-0 ${selectedDropDown === item.key ? "dropdown-active" : ""}`}>
                                        <ReactTooltip id="smart-chart-master-filter" />
                                        <div className="drop-filtr dp-rcm-overflow" onClick={e => e.stopPropagation()}>
                                            <div className="col-md-12 p-0 border-bottom pt-1">
                                                <span className="dropdown-item build_search_drp">
                                                    <input
                                                        type="search"
                                                        placeholder="Search..."
                                                        value={search[item.key]}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            setSearch(prevSearch => {
                                                                return { ...prevSearch, [item.key]: value };
                                                            });
                                                        }}
                                                    />
                                                    <i
                                                        class="fas fa-times cursor-pointer cls-close"
                                                        onClick={() =>
                                                            setSearch(prevSearch => {
                                                                return { ...prevSearch, [item.key]: "" };
                                                            })
                                                        }
                                                    />
                                                </span>
                                            </div>
                                            <div className="col-md-12 p-0 border-bottom pt-1">
                                                <div className="dropdown-item select_section_outer">
                                                    <label className="container-check">
                                                        Select all
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selectedItems.length && masterFilterList[item.key]?.length == selectedItems.length
                                                            }
                                                            onClick={e => item.key !== "projects" && handleSelectAll(item.key, e.target.checked)}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <button className="clear-btn-selection" onClick={() => setSelectedItems([])}>
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                            {/* checked items */}
                                            {/* {masterFilterList[item.key]?.filter(fi => masterFilters[item.paramKey]?.includes(fi.id))?.length > 0 && ( */}
                                            <div className="col-md-12 p-0 slt-ara border-bottom">
                                                {masterFilterList[item.key]
                                                    ?.filter(fi => selectedItems?.includes(fi.id))
                                                    ?.map(data => (
                                                        <span className="dropdown-item" key={data.id}>
                                                            <label className="container-check">
                                                                <span
                                                                    className="text-short"
                                                                    data-tip={
                                                                        data.name?.length + data?.description?.length > 25
                                                                            ? `${data.name} ${data.description ? `(${data.description})` : ""}`
                                                                            : null
                                                                    }
                                                                    data-effect="solid"
                                                                    data-for="smart-chart-master-filter"
                                                                    data-place="left"
                                                                    data-background-color="#007bff"
                                                                    data-delay-show="500"
                                                                >
                                                                    {data.name} {data.description ? `(${data.description})` : ""}
                                                                </span>
                                                                {/* {data.name}
                                                        {data?.description ? ` (${data.description})` : ""} */}
                                                                {/* <span className="float-right">({data.count})</span> */}
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedItems.includes(data.id)}
                                                                    onChange={e => handleSelectDropdown(data.id, item.key)}
                                                                />
                                                                <span className="checkmark" />
                                                            </label>
                                                        </span>
                                                    ))}
                                            </div>
                                            {/* )} */}
                                            {/* unchecked items */}

                                            {renderFilteredList(item.key)?.filter(fi => !masterFilters[item.paramKey]?.includes(fi.id))?.length ? (
                                                <div className="col-md-12 p-0 slt-ara">
                                                    {renderFilteredList(item.key)
                                                        ?.filter(fi => !selectedItems?.includes(fi.id))
                                                        ?.map(data => (
                                                            <span className="dropdown-item" key={data.id}>
                                                                <label className="container-check">
                                                                    <span
                                                                        className="text-short"
                                                                        data-tip={
                                                                            data.name?.length + data?.description?.length > 25
                                                                                ? `${data.name} ${data.description ? `(${data.description})` : ""}`
                                                                                : null
                                                                        }
                                                                        data-effect="solid"
                                                                        data-for="smart-chart-master-filter"
                                                                        data-place="left"
                                                                        data-background-color="#007bff"
                                                                        data-delay-show="500"
                                                                    >
                                                                        {data.name} {data.description ? `(${data.description})` : ""}
                                                                    </span>
                                                                    {/* {data.name}
                                                            {data?.description ? ` (${data.description})` : ""} */}
                                                                    {/* <span className="float-right">({data.description})</span> */}
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={false}
                                                                        onChange={e =>
                                                                            // this.props.handleValueSelect(item.paramKey, data.id, e.target.checked)
                                                                            handleSelectDropdown(data.id, item.key)
                                                                        }
                                                                    />
                                                                    <span className="checkmark" />
                                                                </label>
                                                            </span>
                                                        ))}
                                                </div>
                                            ) : (
                                                <div className={`col-md-12`}>
                                                    {masterFilterList[item.key]?.filter(fi => masterFilters[item.paramKey]?.includes(fi.id))
                                                        ?.length === 0 &&
                                                    renderFilteredList(item.key)?.filter(fi => !masterFilters[item.paramKey]?.includes(fi.id))
                                                        ?.length === 0
                                                        ? "No data Found"
                                                        : "No more values to display"}
                                                </div>
                                            )}
                                            <div className="col-md-12 drp-btn">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => updateFilter(item.key, item.paramKey, item.label)}
                                                >
                                                    ok
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btnClr ml-2"
                                                    onClick={() => handleCancelFilter(item.key, item.paramKey)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {entity === "project" && rowIndex === 0 ? (
                        <div class={`col ${selectedFiltersList?.start ? "bg-th-filtered" : ""}`}>
                            <div class={`dropdown-container ${selectedDropDown === "years" ? "dropdown-open" : ""} `}>
                                <div class="dropdown-toggle click-dropdown" onClick={() => handleClickDropdown("years", "years")}>
                                    Years
                                    <span class="close-reg">
                                        <i class="fas fa-chevron-down"></i>
                                    </span>
                                </div>
                                <div className={selectedDropDown === "years" ? "dropdown-menu year-drop  dropdown-active" : "dropdown-menu "}>
                                    <div
                                        className="drop-filtr pb-3"
                                        onClick={e => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div className="col-md-12 p-0 slt-ara">
                                            <div className="year-outer ">
                                                <div>
                                                    <button
                                                        className="clear-btn-selection sm-chart-year-fil-clr"
                                                        onClick={() => setYearsFilter({ start: "", end: "" })}
                                                    >
                                                        Clear
                                                    </button>
                                                </div>

                                                <div className="col-xl-12 selecbox-otr p-0 mb-4">
                                                    <span className="dropdown-item p-0">
                                                        <label>Start Year</label>
                                                        <div className="custom-selecbox w-100">
                                                            <select
                                                                className={`${
                                                                    showErrorBorder && !yearsFilter?.start?.toString()?.trim()?.length
                                                                        ? "error-border"
                                                                        : ""
                                                                }`}
                                                                value={yearsFilter.start}
                                                                name={"start"}
                                                                onChange={e => {
                                                                    e.stopPropagation();
                                                                    let yearValue = parseInt(e.target.value) || "";
                                                                    setYearsFilter(prevValue => {
                                                                        return {
                                                                            ...prevValue,
                                                                            start: yearValue
                                                                        };
                                                                    });
                                                                }}
                                                            >
                                                                <option value="">Select</option>
                                                                {getYearValuesForFilter("start").map(year => {
                                                                    return <option value={year}>{year}</option>;
                                                                })}
                                                            </select>
                                                        </div>
                                                    </span>
                                                </div>
                                                <div className="col-xl-12 p-0 selecbox-otr p-0">
                                                    <span className="dropdown-item  p-0">
                                                        <label>End Year</label>
                                                        <div className="custom-selecbox w-100">
                                                            <select
                                                                className={`${
                                                                    showErrorBorder && !yearsFilter?.end?.toString()?.trim()?.length
                                                                        ? "error-border"
                                                                        : ""
                                                                }`}
                                                                value={yearsFilter.end}
                                                                name={"end"}
                                                                onChange={e => {
                                                                    e.stopPropagation();
                                                                    let yearValue = parseInt(e.target.value) || "";
                                                                    setYearsFilter(prevValue => {
                                                                        return {
                                                                            ...prevValue,
                                                                            end: yearValue
                                                                        };
                                                                    });
                                                                }}
                                                            >
                                                                <option value="">Select</option>
                                                                {getYearValuesForFilter("end").map(year => {
                                                                    return <option value={year}>{year}</option>;
                                                                })}
                                                            </select>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 mt-3 drp-btn">
                                            <button
                                                type="button"
                                                className="btn btn-primary btnRgion mr-2"
                                                onClick={() => updateFilter("years", "years", "Years")}
                                            >
                                                OK
                                            </button>
                                            <button type="button" className="btn btn-primary btnClr" onClick={() => handleCancelFilter()}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {entity === "energy_mng" ? (
                <div class="col-md-4 p-0 pad-50">
                    <div class="d-flex itm-nmb">
                        <div class={`col ${selectedFiltersList?.project_ids?.length ? "bg-th-filtered" : ""}`}>
                            <div class={`dropdown-container ${selectedDropDown === "energy_mng_projects" ? "dropdown-open" : ""} `}>
                                <div class="dropdown-toggle click-dropdown" onClick={() => handleClickDropdown("energy_mng_projects", "project_ids")}>
                                    Projects (Recommendation)
                                    <span class="close-reg">
                                        <i class="fas fa-chevron-down"></i>
                                    </span>
                                </div>
                                {selectedDropDown === "energy_mng_projects" && (
                                    <div className={`dropdown-menu p-0 ${selectedDropDown === "energy_mng_projects" ? "dropdown-active" : ""}`}>
                                        <ReactTooltip id="smart-chart-master-filter" />
                                        <div className="drop-filtr dp-rcm-overflow" onClick={e => e.stopPropagation()}>
                                            <div className="col-md-12 p-0 border-bottom pt-1">
                                                <span className="dropdown-item build_search_drp">
                                                    <input
                                                        type="search"
                                                        placeholder="Search..."
                                                        value={search.energy_mng_projects}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            setSearch(prevSearch => {
                                                                return { ...prevSearch, energy_mng_projects: value };
                                                            });
                                                        }}
                                                    />
                                                    <i
                                                        class="fas fa-times cursor-pointer cls-close"
                                                        onClick={() =>
                                                            setSearch(prevSearch => {
                                                                return { ...prevSearch, energy_mng_projects: "" };
                                                            })
                                                        }
                                                    />
                                                </span>
                                            </div>
                                            <div className="col-md-12 p-0 border-bottom pt-1">
                                                <div className="dropdown-item select_section_outer">
                                                    <label className="container-check">
                                                        Select all
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selectedItems.length &&
                                                                masterFilterList.energy_mng_projects?.length == selectedItems.length
                                                            }
                                                            onClick={e => ""}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <button className="clear-btn-selection" onClick={() => setSelectedItems([])}>
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-12 p-0 slt-ara border-bottom">
                                                {masterFilterList.energy_mng_projects
                                                    ?.filter(fi => selectedItems?.includes(fi.id))
                                                    ?.map(data => (
                                                        <span className="dropdown-item" key={data.id}>
                                                            <label className="container-check">
                                                                <span
                                                                    className="text-short"
                                                                    data-tip={
                                                                        data.name?.length + data?.description?.length > 25
                                                                            ? `${data.name} ${data.description ? `(${data.description})` : ""}`
                                                                            : null
                                                                    }
                                                                    data-effect="solid"
                                                                    data-for="smart-chart-master-filter"
                                                                    data-place="left"
                                                                    data-background-color="#007bff"
                                                                    data-delay-show="500"
                                                                >
                                                                    {data.name} {data.description ? `(${data.description})` : ""}
                                                                </span>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedItems.includes(data.id)}
                                                                    onChange={e => handleSelectDropdown(data.id, "energy_mng_projects")}
                                                                />
                                                                <span className="checkmark" />
                                                            </label>
                                                        </span>
                                                    ))}
                                            </div>
                                            {renderFilteredList("energy_mng_projects")?.filter(fi => !masterFilters.project_ids?.includes(fi.id))
                                                ?.length ? (
                                                <div className="col-md-12 p-0 slt-ara">
                                                    {renderFilteredList("energy_mng_projects")
                                                        ?.filter(fi => !selectedItems?.includes(fi.id))
                                                        ?.map(data => (
                                                            <span className="dropdown-item" key={data.id}>
                                                                <label className="container-check">
                                                                    <span
                                                                        className="text-short"
                                                                        data-tip={
                                                                            data.name?.length + data?.description?.length > 25
                                                                                ? `${data.name} ${data.description ? `(${data.description})` : ""}`
                                                                                : null
                                                                        }
                                                                        data-effect="solid"
                                                                        data-for="smart-chart-master-filter"
                                                                        data-place="left"
                                                                        data-background-color="#007bff"
                                                                        data-delay-show="500"
                                                                    >
                                                                        {data.name} {data.description ? `(${data.description})` : ""}
                                                                    </span>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={false}
                                                                        onChange={e => handleSelectDropdown(data.id, "energy_mng_projects")}
                                                                    />
                                                                    <span className="checkmark" />
                                                                </label>
                                                            </span>
                                                        ))}
                                                </div>
                                            ) : (
                                                <div className={`col-md-12`}>
                                                    {masterFilterList["energy_mng_projects"]?.filter(fi =>
                                                        masterFilters["project_ids"]?.includes(fi.id)
                                                    )?.length === 0 &&
                                                    renderFilteredList("energy_mng_projects")?.filter(
                                                        fi => !masterFilters["project_ids"]?.includes(fi.id)
                                                    )?.length === 0
                                                        ? "No data Found"
                                                        : "No more values to display"}
                                                </div>
                                            )}
                                            <div className="col-md-12 drp-btn">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => updateFilter("energy_mng_projects", "project_ids", "Projects")}
                                                >
                                                    ok
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btnClr ml-2"
                                                    onClick={() => handleCancelFilter("energy_mng_projects", "project_ids", "Projects")}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};
export default MasterFilter;
