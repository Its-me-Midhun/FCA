import React from "react";
import ReactTooltip from "react-tooltip";
import { SORT_KEYS } from "../constants";
import GlobalSearch from "./GlobalSearch";
import refreshIcon from "../../../assets/img/img-refresh.svg";

function TopControls({
    selectedImages,
    imageList,
    handleSelectAll,
    onEditImage,
    params,
    handleGlobalSearch,
    handleSort,
    handleSortOrder,
    sortOrder,
    isAssignView,
    resetAllFilters,
    resetSort,
    hasEdit,
    handleChangeAssignFilter,
    assignFilter,
    refreshImages,
    resetAll,
    showLogs,
    toggleShowSelected,
    showSelected,
    exportImages,
    exportImagesPdf,
    exportImageLoader,
    exportImagePdfLoader,
    isSmartChartView
}) {
    const isSameProject = selectedImages.every(img => img?.project?.id === selectedImages[0]?.project?.id);
    const isSameTypeImage = selectedImages.every(img => img?.is_asset_image === selectedImages[0]?.is_asset_image);
    return (
        <div className="sort-otr mb-2">
            <div className="left-control">
                <div className="btn">
                    <label className="container-check">
                        <input
                            type="checkbox"
                            checked={imageList.length >= 1 && selectedImages.length === imageList.length ? true : false}
                            onChange={e => handleSelectAll(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Select All ({selectedImages.length})
                    </label>
                </div>
                {!isAssignView && (
                    <button className="btn btn-log" onClick={showLogs}>
                        <i className="fas fa-history"></i>
                        Logs
                    </button>
                )}
                <button
                    className="btn btn-edit"
                    onClick={e => {
                        e.preventDefault();
                        refreshImages();
                    }}
                >
                    <span className="icon mr-1">
                        <img src={refreshIcon} alt="" />
                    </span>
                    <span className="text">Refresh</span>
                </button>
                {selectedImages.length > 0 && (
                    <>
                        <button className="btn btn-edit" onClick={() => handleSelectAll(false)}>
                            <i className="fas fa-times-circle"></i>
                            Clear <span>{selectedImages.length}</span>
                        </button>
                    </>
                )}
                {selectedImages.length && hasEdit ? (
                    <>
                        <button
                            className={`btn btn-edit ${!isSameTypeImage ? "cursor-diabled" : ""}`}
                            data-tip={!isSameTypeImage ? "Please select same type of images to edit" : ""}
                            data-place="bottom"
                            data-effect="solid"
                            data-background-color="#007bff"
                            onClick={e => (isSameTypeImage ? onEditImage(e) : null)}
                        >
                            <i className="fas fa-pencil-alt"></i>
                            Edit <span>{selectedImages.length}</span>
                        </button>
                        {/* <button className="btn btn-del" onClick={onEditImage}>
                            <i className="fas fa-trash"></i>
                            Delete
                        </button> */}
                    </>
                ) : null}
                {selectedImages.length ? (
                    <>
                        {!showSelected ? (
                            <button className="btn btn-edit" onClick={toggleShowSelected}>
                                <i className="fas fa-eye"></i>
                                Show <span>{selectedImages.length}</span>
                            </button>
                        ) : (
                            <button className="btn btn-edit" onClick={toggleShowSelected}>
                                <i className="fas fa-eye"></i>
                                Show All
                            </button>
                        )}
                        <button
                            className={`btn btn-edit  ${!isSameProject ? "cursor-diabled" : ""}`}
                            data-tip={!isSameProject ? "Please select same project to export" : ""}
                            data-place="bottom"
                            data-effect="solid"
                            data-background-color="#007bff"
                            onClick={() => (isSameProject ? exportImages(selectedImages) : null)}
                        >
                            {!exportImageLoader ? (
                                <i className="fas fa-solid fa-file-word"></i>
                            ) : (
                                <div className="edit-icn-bx icon-btn-sec d-inline-block mr-1">
                                    <div className="spinner-border" role="status"></div>
                                </div>
                            )}
                            Export <span>{selectedImages.length} </span> (Word)
                        </button>
                        <button
                            className={`btn btn-edit  ${!isSameProject ? "cursor-diabled" : ""}`}
                            data-tip={!isSameProject ? "Please select same project to export" : ""}
                            data-place="bottom"
                            data-effect="solid"
                            data-background-color="#007bff"
                            onClick={() => (isSameProject ? exportImagesPdf(selectedImages) : null)}
                        >
                            {!exportImagePdfLoader ? (
                                <i className="fas fa-solid fa-file-pdf"></i>
                            ) : (
                                <div className="edit-icn-bx icon-btn-sec d-inline-block mr-1">
                                    <div className="spinner-border" role="status"></div>
                                </div>
                            )}
                            Export <span>{selectedImages.length} </span> (PDF)
                        </button>
                        <ReactTooltip />
                    </>
                ) : null}
            </div>
            <GlobalSearch handleGlobalSearch={handleGlobalSearch} globalSearchKey={params.search} />

            <div className="view ml-2 mr-2 cursor-hand">
                <div
                    className="view-inner"
                    data-tip={`Reset Filters`}
                    data-effect="solid"
                    data-place="bottom"
                    data-background-color="#007bff"
                    onClick={() => resetAllFilters()}
                >
                    <img src="/img/filter-off.svg" alt="" className="fil-ico1" />
                </div>
            </div>
            <div className="view mr-2">
                <div
                    className={`view-inner`}
                    data-place="bottom"
                    data-effect="solid"
                    data-tip={`Reset Sort`}
                    data-background-color="#007bff"
                    onClick={() => resetSort()}
                >
                    <img src="/img/t-arrow-off.svg" alt="" className="sort-ico flr-crs" />
                </div>
            </div>
            <div className="view mr-2  cursor-hand">
                <div
                    className="view-inner"
                    data-place="bottom"
                    data-effect="solid"
                    data-tip={`Reset All`}
                    data-background-color="#007bff"
                    onClick={() => resetAll()}
                >
                    <img src="/img/refresh-dsh.svg" alt="" className="fil-ico" />
                </div>
            </div>
            <ReactTooltip />
            {isAssignView && !isSmartChartView && (
                <div className="sort mr-2">
                    <select className="form-control" value={assignFilter} onChange={e => handleChangeAssignFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="notUsed">Not Assigned Here</option>
                    </select>
                </div>
            )}
            <div className="sort">
                <label className="label-txt d-flex align-items-center">Sort By</label>
                <select className="form-control" value={params.order ? Object.keys(params?.order)[0] : ""} onChange={e => handleSort(e.target.value)}>
                    {/* <option value={""}>Sort By</option> */}
                    {SORT_KEYS.map(item => (
                        <option value={item.sortKey} key={item.sortKey}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="sort">
                <select className="form-control" value={sortOrder} onChange={e => handleSortOrder(e.target.value)}>
                    <option value="asc">ASC</option>
                    <option value="desc">DESC</option>
                </select>
            </div>
        </div>
    );
}

export default TopControls;
