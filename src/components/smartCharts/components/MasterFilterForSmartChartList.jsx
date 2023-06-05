import React, { useState } from "react";
import { MASTER_FILTER_KEYS } from "../constants";
import funnelIcon from "../../../assets/img/tunnel.svg";

const MasterFilterForSmartChartList = ({
    getSmartChartMasterFilterDropDown,
    masterFilterList = {},
    masterFilters = {},
    selectedFiltersList = {},
    updateMfilterForSmartChartList,
    filterEntity = "",
    ...props
}) => {
    const [selectedDropDown, setSelectedDropdown] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState({});

    const handleClickDropdown = async (key, paramKey) => {
        setSelectedItems(selectedFiltersList?.[paramKey]?.length ? [...selectedFiltersList[paramKey]] : []);
        setSelectedDropdown(prevValue => (prevValue === key ? "" : key));
        if (selectedDropDown !== key) await getSmartChartMasterFilterDropDown(key, filterEntity, getParamsForMasterFilter(key));
    };

    const getParamsForMasterFilter = key => {
        let currentUser = localStorage.getItem("userId") || "";
        switch (key) {
            case "projects":
                return {
                    client_id: selectedFiltersList?.client_ids?.length ? selectedFiltersList.client_ids[0] : null,
                    user_id: currentUser
                };
            case "clients":
                return {
                    user_id: currentUser
                };
        }
    };

    const renderFilteredList = selectedItem => {
        const searchValue = search[selectedItem];
        let filteredList = [];
        if (masterFilterList[selectedItem]?.length) {
            filteredList = searchValue?.trim()?.length
                ? masterFilterList[selectedItem].filter(item => item.name?.toString()?.toLowerCase()?.includes(searchValue?.toLocaleLowerCase()))
                : masterFilterList[selectedItem];
        }

        return filteredList;
    };

    const handleSelectDropdown = (selectedId, key = "") => {
        if (key == "clients") {
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

    const updateFilter = (key, paramKey) => {
        updateMfilterForSmartChartList({
            mfilterKey: paramKey,
            filterValues: [...selectedItems]
        });
        setSelectedDropdown(prevValue => (prevValue === key ? "" : key));
        setSelectedItems([]);
    };

    const handleCancelFilter = (key, paramKey) => {
        setSelectedDropdown("");
        setSelectedItems([]);
    };
    return (
        <div class="grid-lft">
            <div class="grid-inner d-flex">
                {MASTER_FILTER_KEYS[filterEntity]?.map((item, i) => (
                    <>
                        <div
                            class={`grid-box position-relative ${selectedFiltersList?.[item.paramKey]?.length ? "bg-th-filtered" : "pro-grid"}`}
                            onClick={() => handleClickDropdown(item.key, item.paramKey)}
                        >
                            <div class={`dropdown-container ${selectedDropDown === item.key ? "dropdown-open" : ""} `}>
                                <div className="dropdown-toggle click-dropdown">
                                    {item.label}
                                    <span className="close-reg">
                                        <i className="fas fa-chevron-down" />
                                    </span>
                                </div>
                                {selectedDropDown === item.key && (
                                    <div className={`dropdown-menu p-0 ${selectedDropDown === item.key ? "dropdown-active" : ""}`}>
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
                                                            onClick={e => item.key !== "clients" && handleSelectAll(item.key, e.target.checked)}
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
                                                    onClick={() => updateFilter(item.key, item.paramKey)}
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
                    </>
                ))}
            </div>
            {/* <div
                className={`itm-tp`}
                data-for="master-img-filter"
                data-tip={"Filter"}
                // onClick={this.props.toggleAdvancedFilters}
                data-toggle="collapse"
                href="#collapseExample"
            >
                <img src={funnelIcon} className="img-width" alt="" />
            </div> */}
        </div>
    );
};

export default MasterFilterForSmartChartList;
