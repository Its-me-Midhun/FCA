import React from "react";
import Loader from "../../common/components/Loader";
import ReactTooltip from "react-tooltip";

export const FilterItem = ({ dashboardFilterParams, elem, showDropDown, dropdownValues, handleFilterView, state, handleFilter, setState }) => {
    if (elem.key === "building_types") {
        dropdownValues["building_types"] = dropdownValues["building_types"]?.map(item => ({
            id: item.name,
            name: item.name,
            count: item.count
        }));
    }
    return (
        <div key={elem.key} className={dashboardFilterParams?.[elem.paramKey]?.length ? "col bg-th-filtered" : "col"}>
            <ReactTooltip
                id="master_filter_dropdown"
                className="rc-tooltip-custom-class"
                effect="solid"
                place="left"
                backgroundColor="#007bff"
                delayShow="500"
            />
            <div
                className={showDropDown === elem.key ? "dropdown-container dropdown-open" : "dropdown-container"}
                onClick={() => {
                    setState({
                        showDropDown: showDropDown === elem.key ? "" : elem.key,
                        search: ""
                    });
                    handleFilterView(elem.key, elem.paramKey);
                }}
            >
                <div
                    className="dropdown-toggle click-dropdown"
                    data-delay-show="500"
                    data-tip={`Select Master Dashboard Filters `}
                    data-effect="solid"
                    data-for="dashboard-icons"
                    data-place="left"
                    data-background-color="#007bff"
                >
                    {elem.label}
                    <span className="close-reg">
                        <i className="fas fa-chevron-down"></i>
                    </span>
                </div>

                <div className={showDropDown === elem.key ? "dropdown-menu  dropdown-active " : "dropdown-menu "}>
                    {dropdownValues[elem.key]?.length ? (
                        <>
                            <div
                                className="dropdown-menu drop-filtr pos-abs dp-rcm-overflow mt-0"
                                onClick={e => {
                                    e.stopPropagation();
                                }}
                            >
                                <div className="col-md-12 p-0 slt">
                                    <span className="dropdown-item build_search_drp">
                                        <input
                                            type="search"
                                            placeholder="Search..."
                                            value={state.search}
                                            onChange={e =>
                                                setState({
                                                    search: e.target.value
                                                })
                                            }
                                        />
                                        <i class="fas fa-times cursor-pointer cls-close" onClick={() => setState({ search: "" })} />
                                        <label className="container-check">
                                            Select all ({dropdownValues[elem.key]?.filter(fi => state[elem.paramKey]?.includes(fi.id)).length}
                                            )
                                            <input
                                                type="checkbox"
                                                checked={
                                                    state[elem.paramKey]?.length &&
                                                    dropdownValues[elem.key]?.filter(
                                                        item =>
                                                            item?.name?.toString()?.toLowerCase()?.includes(state.search?.toLocaleLowerCase()) ||
                                                            state[elem.paramKey].includes(item.id)
                                                    ).length === state[elem.paramKey]?.length
                                                        ? true
                                                        : false
                                                }
                                                onChange={e => {
                                                    let temp = [];
                                                    let tempName = [];
                                                    if (e.target.checked) {
                                                        dropdownValues[elem.key]
                                                            .filter(
                                                                item =>
                                                                    item?.name
                                                                        ?.toString()
                                                                        ?.toLowerCase()
                                                                        ?.includes(state.search?.toLocaleLowerCase()) ||
                                                                    item?.description
                                                                        ?.toString()
                                                                        ?.toLowerCase()
                                                                        ?.includes(state.search?.toLocaleLowerCase()) ||
                                                                    state[elem.paramKey].includes(item.id)
                                                            )
                                                            .forEach(item => {
                                                                temp.push(item.id);
                                                                tempName.push(item.name);
                                                            });
                                                        setState({
                                                            [elem.flag]: true,
                                                            [elem.paramKey]: temp,
                                                            [elem.nameKey]: tempName
                                                        });
                                                    } else {
                                                        setState({
                                                            [elem.flag]: state[elem.paramKey].length > 0 ? true : false,
                                                            [elem.paramKey]: [],
                                                            [elem.nameKey]: []
                                                        });
                                                    }
                                                }}
                                            />
                                            <span className="checkmark"></span>
                                            <button
                                                className="clear-btn-selection"
                                                // class="fas fa-times cursor-pointer cls-close"
                                                onClick={() =>
                                                    setState({
                                                        [elem.flag]: state[elem.paramKey].length > 0 ? true : false,
                                                        [elem.paramKey]: [],
                                                        [elem.nameKey]: []
                                                    })
                                                }
                                            >
                                                Clear
                                            </button>
                                        </label>
                                    </span>
                                </div>
                                {dropdownValues[elem.key]?.filter(fi => state[elem.paramKey]?.includes(fi.id)).length > 0 && (
                                    <div className="col-md-12 p-0 slt-ara border-bottom">
                                        {" "}
                                        {dropdownValues[elem.key]
                                            ?.filter(fi => state[elem.paramKey]?.includes(fi.id))
                                            .map(item => (
                                                <span className="dropdown-item">
                                                    <label className="container-check d-flex align-items-center">
                                                        <span
                                                            className="text-short"
                                                            data-tip={`${item.description ? `${item.name} (${item.description})` : ""}`}
                                                            data-for="master_filter_dropdown"
                                                        >
                                                            {item.name || "-"} {item.description ? `(${item.description})` : ""}
                                                        </span>
                                                        <span className="count-num"> ({item.count})</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={state[elem.paramKey].find(ci => ci === item.id) ? true : false}
                                                            onChange={e => {
                                                                if (e.target.checked) {
                                                                    setState({
                                                                        [elem.flag]: true,
                                                                        [elem.paramKey]: state[elem.paramKey]
                                                                            ? [...state[elem.paramKey], item.id]
                                                                            : [item.id],
                                                                        [elem.nameKey]: state[elem.nameKey]
                                                                            ? [...state[elem.nameKey], item.name]
                                                                            : [item.name]
                                                                    });
                                                                } else {
                                                                    let test = state[elem.paramKey];
                                                                    test = test?.filter(t => t !== item.id);
                                                                    let name = state[elem.nameKey];
                                                                    name = name?.filter(t => t !== item.name);
                                                                    setState({
                                                                        [elem.flag]: state[elem.paramKey]?.length > 0 ? true : false,
                                                                        [elem.paramKey]: test,
                                                                        [elem.nameKey]: name
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </span>
                                            ))}
                                    </div>
                                )}
                                {dropdownValues[elem.key]?.filter(fi => !state[elem.paramKey]?.includes(fi.id)).length > 0 && (
                                    <div className="col-md-12 p-0 slt-ara">
                                        {" "}
                                        {dropdownValues[elem.key]
                                            ?.filter(fi => !state[elem.paramKey]?.includes(fi.id))
                                            .filter(
                                                item =>
                                                    item?.name?.toString()?.toLowerCase()?.includes(state.search?.toLocaleLowerCase()) ||
                                                    item?.description?.toString()?.toLowerCase()?.includes(state.search?.toLocaleLowerCase())
                                            )
                                            .map(item => (
                                                <span className="dropdown-item" key={item.id}>
                                                    <label className="container-check d-flex align-items-center">
                                                        <span
                                                            className="text-short"
                                                            data-tip={`${item.description ? `${item.name} (${item.description})` : ""}`}
                                                            data-for="master_filter_dropdown"
                                                        >
                                                            {item.name || "-"} {item.description ? `(${item.description})` : ""}
                                                        </span>
                                                        <span className="count-num"> ({item.count})</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={state[elem.paramKey]?.find(ci => ci === item.id) ? true : false}
                                                            onChange={e => {
                                                                if (e.target.checked) {
                                                                    setState({
                                                                        [elem.flag]: true,
                                                                        [elem.paramKey]: state[elem.paramKey]
                                                                            ? [...state[elem.paramKey], item.id]
                                                                            : [item.id],
                                                                        [elem.nameKey]: state[elem.nameKey]
                                                                            ? [...state[elem.nameKey], item.name]
                                                                            : [item.name]
                                                                    });
                                                                } else {
                                                                    let test = state[elem.paramKey];
                                                                    test = test?.filter(t => t !== item.id);
                                                                    let name = state[elem.nameKey];
                                                                    name = name?.filter(t => t !== item.name);
                                                                    setState({
                                                                        [elem.flag]: state[elem.paramKey]?.length > 0 ? true : false,
                                                                        [elem.paramKey]: test,
                                                                        [elem.nameKey]: name
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </span>
                                            ))}
                                    </div>
                                )}
                                {!dropdownValues[elem.key]
                                    .filter(fi => !state[elem.paramKey]?.includes(fi.id))
                                    .filter(
                                        item =>
                                            item?.name?.toString()?.toLowerCase()?.includes(state.search?.toLocaleLowerCase()) ||
                                            item?.description?.toString()?.toLowerCase()?.includes(state.search?.toLocaleLowerCase())
                                    )
                                    .map(item => item)?.length &&
                                !dropdownValues[elem.key]?.filter(fi => state[elem.paramKey]?.includes(fi.id)).map(item => item).length ? (
                                    <div className="col-md-6 no-wrap">NO DATA</div>
                                ) : (
                                    dropdownValues[elem.key]
                                        .filter(fi => !state[elem.paramKey]?.includes(fi.id))
                                        .filter(
                                            item =>
                                                item?.name?.toString()?.toLowerCase()?.includes(state.search?.toLocaleLowerCase()) ||
                                                item?.description?.toString()?.toLowerCase()?.includes(state.search?.toLocaleLowerCase())
                                        )
                                        .map(item => item)?.length === 0 && <div className="col-md-6 no-wrap">NO MORE VALUES TO DISPLAY</div>
                                )}
                                <div className="col-md-12 mt-3 drp-btn">
                                    <button
                                        type="button"
                                        className="btn btn-primary btnRgion mr-2"
                                        onClick={() => {
                                            setState({
                                                showDropDown: ""
                                            });
                                            if (state[elem.flag]) {
                                                handleFilter(elem.paramKey, state[elem.paramKey], state[elem.nameKey], elem.label);
                                                setState({
                                                    [elem.flag]: false
                                                });
                                            }
                                        }}
                                    >
                                        OK
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary btnClr"
                                        onClick={() => {
                                            setState({
                                                showDropDown: "",
                                                [elem.flag]: false,
                                                [elem.paramKey]: [],
                                                [elem.nameKey]: []
                                            });
                                            if (dashboardFilterParams?.[elem.paramKey]?.length) {
                                                handleFilter(elem.paramKey, [], [], elem.label);
                                            }
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : state.dropDownLoader[elem.key] ? (
                        <div className="col-md-12 p-4">
                            <Loader />
                        </div>
                    ) : (
                        <div className="col-md-12 p-2"> No Data Found</div>
                    )}
                </div>
            </div>
        </div>
    );
};
