import React, { Component } from "react";

class FilterValue extends Component {
    render() {
        const { onCancel, filterNames } = this.props;
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
                                {filterNames?.regions?.length ? (
                                    <>
                                        <span className="badge-otr">Regions</span>
                                        <div>
                                            {filterNames?.regions?.map(item => (
                                                <span className="filter">{item}</span>
                                            ))}
                                        </div>
                                        <br />
                                    </>
                                ) : null}
                                {filterNames?.sites?.length ? (
                                    <>
                                        <span className="badge-otr">Sites</span>
                                        <div>
                                            {filterNames?.sites?.map(item => (
                                                <span className="filter">{item}</span>
                                            ))}
                                        </div>
                                        <br />
                                    </>
                                ) : null}

                                {filterNames?.buildingTypes?.length ? (
                                    <>
                                        <span className="badge-otr">Building Types</span>
                                        <div>
                                            {filterNames?.buildingTypes?.map(item => (
                                                <span className="filter">{item}</span>
                                            ))}
                                        </div>
                                        <br />
                                    </>
                                ) : null}
                                {filterNames?.buildings?.length ? (
                                    <>
                                        <span className="badge-otr">Buildings</span>
                                        <div>
                                            {filterNames?.buildings?.map(item => (
                                                <span className="filter">{item}</span>
                                            ))}
                                        </div>
                                        <br />
                                    </>
                                ) : null}
                                {filterNames?.years?.length ? (
                                    <>
                                        <span className="badge-otr">Years</span>
                                        <div>
                                            {filterNames?.years?.map(item => (
                                                <span className="filter">{item}</span>
                                            ))}
                                        </div>
                                        <br />
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FilterValue;
