import React, { Component } from "react";

class ViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            viewFilter: "all",
            keyList: this.props.keys,
            searchKey: ""
        };
    }

    componentDidMount = async () => {
        await this.setState({
            isLoading: false
        });
    };

    handleDropdownChange = (event = null) => {
        const { config } = this.props;
        let tempKeys = this.props.keys;
        let dropDownValue = (event && event.target && event.target.value) || this.state.viewFilter;
        if (dropDownValue === "visible") {
            tempKeys = tempKeys.filter(keyItem => config[keyItem].isVisible === true);
        } else if (dropDownValue === "inVisible") {
            tempKeys = tempKeys.filter(keyItem => config[keyItem].isVisible === false);
        }
        if (this.state.searchKey && this.state.searchKey.trim().length) {
            tempKeys = tempKeys.filter(
                keyItem =>
                    config[keyItem] &&
                    config[keyItem].label &&
                    config[keyItem].label
                        .toString()
                        .toLowerCase()
                        .includes(this.state.searchKey.toLowerCase())
            );
        }
        this.setState({
            keyList: tempKeys,
            viewFilter: dropDownValue
        });
    };

    isAllSelected = () => {
        const { config, keys } = this.props;
        const { keyList } = this.state;
        let count = 0;
        keys.map(keyItem => {
            if (config[keyItem].isVisible) {
                count++;
            }
        });
        if (keys.length === count) {
            return true;
        }
        return false;
    };

    handleHideColumn = async keyItem => {
        await this.props.handleHideColumn(keyItem);
        this.handleDropdownChange();
    };

    handleSearch = event => {
        const { config } = this.props;
        let tempKeys = this.props.keys;
        let searchValue = (event && event.target && event.target.value) || this.state.searchKey;
        if (searchValue && searchValue.trim().length) {
            tempKeys = tempKeys.filter(keyItem => {
                return (
                    config[keyItem] &&
                    config[keyItem].label &&
                    config[keyItem].label
                        .toString()
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                );
            });
        }
        if (this.state.viewFilter === "visible") {
            tempKeys = tempKeys.filter(keyItem => config[keyItem].isVisible === true);
        } else if (this.state.viewFilter === "inVisible") {
            tempKeys = tempKeys.filter(keyItem => config[keyItem].isVisible === false);
        }
        this.setState({
            keyList: tempKeys
        });
    };

    render() {
        const { isLoading, keyList, viewFilter } = this.state;
        if (isLoading) return null;
        const { onCancel, config, keys } = this.props;
        console.log("oi",config)
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
                                    <div className="txt-hed">View Details</div>
                                    <div className="selct-otr">
                                        <select
                                            className="form-control"
                                            onChange={e => this.handleDropdownChange(e)}
                                            value={this.state.viewFilter}
                                        >
                                            <option value="all">All</option>
                                            <option value="visible">Visible</option>
                                            <option value="inVisible">Not Visible</option>
                                        </select>
                                    </div>
                                </h5>
                                <button type="button" className="close" onClick={onCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <div className="col-md-12 formInp search">
                                    <i className="fas fa-search" />
                                    <input
                                        type="text"
                                        className="form-control"
                                        onChange={async e => {
                                            await this.setState({
                                                searchKey: e.target.value
                                            });
                                            this.handleSearch(e);
                                        }}
                                        value={this.state.searchKey}
                                        placeholder="Search Now"
                                    />
                                </div>

                                <div className="col-md-12 check-otr d-flex checkbox-sec">
                                    {keyList.length ? (
                                        <>
                                            {viewFilter === "all" ? (
                                                <>
                                                    <div className="col-md-6 box-otr">
                                                        <div className="rem-txt">
                                                            <label className="container-check">
                                                                Select All
                                                                <input
                                                                    type="checkbox"
                                                                    checked={this.isAllSelected()}
                                                                    onChange={() =>
                                                                        this.handleHideColumn(
                                                                            this.isAllSelected()
                                                                                ? "deselectAll"
                                                                                : "selectAll"
                                                                        )
                                                                    }
                                                                />
                                                                <span className="checkmark" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6"></div>
                                                </>
                                            ) : null}
                                            {keyList.map((keyItem, i) => (
                                                <div key={i} className="col-md-6 box-otr">
                                                    <div className="rem-txt">
                                                        <label className="container-check">
                                                            {config[keyItem].label}
                                                            <input
                                                                type="checkbox"
                                                                checked={config[keyItem].isVisible}
                                                                onChange={() =>
                                                                    this.handleHideColumn(keyItem)
                                                                }
                                                            />
                                                            <span className="checkmark" />
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                            <div className="col-md-12 text-center mt-5">
                                                No records found!
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ViewModal;
