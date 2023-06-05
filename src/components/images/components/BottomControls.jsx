import React from "react";

function BottomControls({ totalCount, loadedCount, limit, handleLimitChange }) {
    return (
        <div class="table-bottom d-flex">
            <div class="count d-flex col-md-6">
                <div class="count-dtl">
                    Count: <span>{`${loadedCount} / ${totalCount || 0}`}</span>
                </div>
                <div class="col-md-2 pr-2 selbx">
                    <select value={limit} class="form-control" onChange={e => handleLimitChange(e.target.value)}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value="300">300</option>
                        <option value="500">500</option>
                    </select>
                </div>
            </div>
            {/* <div class="pagination-sec col-md-6">
                <ul class="pagination">
                    <li class="previous disabled">
                        <a tabindex="0" role="button" aria-disabled="true" aria-label="Previous page">
                            <span data-place="top" data-effect="solid" data-tip="Previous" data-background-color="#007bff" currentitem="false">
                                &lt;
                            </span>
                        </a>
                    </li>
                    <li class="active">
                        <a role="button" class="active" tabindex="0" aria-label="Page 1 is your current page" aria-current="page">
                            1
                        </a>
                    </li>
                    <li class="next disabled">
                        <a tabindex="0" role="button" aria-disabled="true" aria-label="Next page">
                            <span data-place="top" data-effect="solid" data-tip="Next" data-background-color="#007bff" currentitem="false">
                                &gt;
                            </span>
                        </a>
                    </li>
                </ul>
            </div> */}
        </div>
    );
}

export default BottomControls;
