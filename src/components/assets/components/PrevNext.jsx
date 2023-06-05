import React from "react";
import ReactTooltip from "react-tooltip";

export const PrevNext = ({ tableData = [], currentId = "", showInfoPage }) => {
    const prevIndex = tableData?.findIndex(item => item.id === currentId) - 1;
    const prevData = tableData[prevIndex] || {};
    const nextIndex = tableData?.findIndex(item => item.id === currentId) + 1;
    const nextData = tableData[nextIndex] || {};
    return (
        <div className="button-slide-outer">
            <button
                className={`prev-btn ${!tableData?.length || (tableData && currentId === tableData[0]?.id) ? "cursor-diabled" : ""}`}
                disabled={!tableData?.length || (tableData && currentId === tableData[0]?.id)}
                onClick={() => showInfoPage(prevData?.id, prevData, true)}
                data-place="top"
                data-effect="solid"
                data-background-color="#007bff"
                data-tip="Previous"
                data-for="prv-nxt"
            >
                <i class="fas fa-chevron-left"></i>
            </button>
            <button
                className={`next-btn ${
                    !tableData?.length || (tableData && currentId === tableData[tableData?.length - 1]?.id) ? "cursor-diabled" : ""
                }`}
                disabled={!tableData?.length || (tableData && currentId === tableData[tableData?.length - 1]?.id)}
                onClick={() => showInfoPage(nextData?.id, nextData, true)}
                data-place="top"
                data-effect="solid"
                data-background-color="#007bff"
                data-tip="Next"
                data-for="prv-nxt"
            >
                <i class="fas fa-chevron-right"></i>
            </button>
            <ReactTooltip id="prv-nxt" />
        </div>
    );
};
