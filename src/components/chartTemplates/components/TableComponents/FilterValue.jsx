import React, { Component } from "react";

class FilterValue extends Component {

    renderListFilter = (values) => {

        console.log("values:filter-->", values)
        return Object.keys(values).map(fi => {

            if (values[fi] && values[fi].length) {

                return values[fi].map(r => { return <span className="filter">{fi} : {r}</span> })
            }
            else if (values[fi] && values[fi].name) {

                return values[fi].name.map(r => { return <span className="filter">{fi} : {r}</span> })
            }
            else if (values[fi] && values[fi].hospital_name) {
                return values[fi].hospital_name.map(r => { return <span className="filter">{fi} : {r}</span> })
            }
            else if (values[fi] && values[fi].file_type) {
                return values[fi].file_type.map(r => { return <span className="filter">{fi} : {r}</span> })
            }
            else if (values[fi] && values[fi].description) {
                return values[fi].description.map(r => { return <span className="filter">{fi} : {r}</span> })
            }
            else if (values[fi] && values[fi].file_name) {
                return values[fi].file_name.map(r => { return <span className="filter">{fi} : {r}</span> })
            }
            else if (values[fi] && values[fi].document_type) {
                return values[fi].document_type.map(r => { return <span className="filter">{fi} : {r}</span> })
            }

        })
    }

    renderWildCardFilter = (values) => {
        return Object.keys(values).map(fi => {
            return values[fi] && values[fi].key ? `${fi.replace('.', " ")} : ${values[fi].filters},${values[fi].key}`
                : ''
        })
    }

    render() {
        const { onCancel, filterValues } = this.props;

        return (
            <React.Fragment>
                <div
                    className="modal modal-region modal-view"
                    id="modalId"
                    style={{ display: "block" }}
                    tabIndex="-1"
                >
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
                                {filterValues && Object.keys(filterValues).map((f, key) => {
                                    if (f == "filters" && filterValues[f] && Object.keys(filterValues[f]).find(fi => filterValues[f][fi].key)) return <> <span className="badge-otr">Wild card filter </span><span className="filter">{this.renderWildCardFilter(filterValues[f])}</span></>
                                    if ((f == 'list' && filterValues[f] && (typeof (filterValues[f]) === "object"
                                        && (Object.entries(filterValues[f]).length != 0)))) return <> <span className="badge-otr">Common filter </span>
                                            {this.renderListFilter(filterValues[f])}
                                        </>
                                    if (f == "search" && filterValues[f]) return <> <span className="badge-otr">Global search : {filterValues[f]} </span></>
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
