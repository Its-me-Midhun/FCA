import React, { Component } from "react";

class FilterValue extends Component {



    render() {
        const { onCancel, filterValues } = this.props;
        console.log("filterValues", filterValues)
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
                                {filterValues && filterValues.length ? filterValues.map((f, key) => {
                                    console.log("filterValues", f)
                                    return f.name != 'Year' ? (f.value && f.value.length ? <><span className="badge-otr">{f.name} </span>{f.value.map(item => { return <span className="filter">{item}</span> })}<br /></> : null) :
                                        <><span className="badge-otr">{f.name}</span><span className="filter">Start : {f.value.start}</span><span className="filter">End :{f.value.end}</span></>
                                }) : null}

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FilterValue;
