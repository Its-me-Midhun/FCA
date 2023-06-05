import moment from "moment";
import React, { Component } from "react";

class FilterValue extends Component {
    renderListFilter = values => {
        console.log("values", values);
        return Object.keys(values).map(fi => {
            if (values[fi] && values[fi].length) {
                return values[fi].map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].name) {
                return values[fi].name.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].year) {
                return values[fi].year.map(r => {
                    return <span className="filter">year : {r}</span>;
                });
            } else if (values[fi] && values[fi].month) {
                return values[fi].month.map(r => {
                    return <span className="filter">month : {r}</span>;
                });
            } else if (values[fi] && values[fi].account_type) {
                return values[fi].account_type.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].meter) {
                return values[fi].meter.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].meter_type) {
                return values[fi].meter_type.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].hospital_name) {
                return values[fi].hospital_name.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].file_type) {
                return values[fi].file_type.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].description) {
                return values[fi].description.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].file_name) {
                return values[fi].file_name.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            } else if (values[fi] && values[fi].document_type) {
                return values[fi].document_type.map(r => {
                    return (
                        <span className="filter">
                            {fi} : {r}
                        </span>
                    );
                });
            }
        });
    };

    renderWildCardFilter = values => {
        return Object.keys(values).map(fi => {
            return values[fi] && values[fi].key
                ? `${fi.replace(".", " ")} : ${values[fi].filters},${
                      typeof values[fi].key !== "string" && typeof values[fi].key === "object"
                          ? values[fi].key
                              ? moment(values[fi]?.key.from).format("MM-DD-YYYY hh:mm A") +
                                "," +
                                moment(values[fi].key.to).format("MM-DD-YYYY hh:mm A")
                              : values[fi].key
                          : values[fi].key
                  }`
                : "";
        });
    };

    render() {
        const { onCancel, filterValues } = this.props;
        return (
            <React.Fragment>
                <div className="modal modal-region modal-view" id="modalId" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    <div className="txt-hed">Applied Filters </div>
                                </h5>
                                <button type="button" className="close" onClick={onCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr filter-apply">
                                {filterValues &&
                                    Object.keys(filterValues).map((f, key) => {
                                        if (f === "filters" && filterValues[f] && Object.keys(filterValues[f]).find(fi => filterValues[f][fi].key))
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Wild card filter </span>
                                                    <span className="filter">{this.renderWildCardFilter(filterValues[f])}</span>
                                                </>
                                            );
                                        if (
                                            f === "list" &&
                                            filterValues[f] &&
                                            typeof filterValues[f] === "object" &&
                                            Object.entries(filterValues[f]).length !== 0
                                        )
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Common filter </span>
                                                    {this.renderListFilter(filterValues[f])}
                                                </>
                                            );
                                        if (f === "search" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Global search : {filterValues[f]} </span>
                                                </>
                                            );
                                        if (f === "surveyor" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Surveyor : {filterValues[f]} </span>
                                                </>
                                            );
                                        if (f === "image_or_not" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Images Present : {filterValues[f] === "true" ? "Yes" : "No"} </span>
                                                </>
                                            );
                                        if (f === "infrastructure_request" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Infrastructure Request : {filterValues[f]} </span>
                                                </>
                                            );
                                        if (f === "water" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Water Present : {filterValues[f]} </span>
                                                </>
                                            );
                                        if (f === "energy" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Energy Present : {filterValues[f]} </span>
                                                </>
                                            );
                                        if (f === "fmp" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">FMP Present : {filterValues[f]} </span>
                                                </>
                                            );
                                        if (f === "facility_master_plan" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">FMP Present : {filterValues[f]} </span>
                                                </>
                                            );
                                        if (f === "recommendation_type" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Recommendation Type : {filterValues[f]} </span>
                                                </>
                                            );
                                        if (f === "budget_priority" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">Budget Priority : {filterValues[f]} </span>
                                                </>
                                            );

                                        if (f === "recommendation_assigned_true" && filterValues[f])
                                            return (
                                                <>
                                                    {" "}
                                                    <span className="badge-otr">
                                                        Recommendation Assigned : {filterValues[f] === "true" ? "Yes" : "No"}{" "}
                                                    </span>
                                                </>
                                            );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FilterValue;
