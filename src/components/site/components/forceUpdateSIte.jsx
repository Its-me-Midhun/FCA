import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";


class InitialFundingTable extends Component {
    state = {
        selectedProjectAnnualFunding: null,
        initialProjectAnnualFunding: null,
        selectedEfci: null,
        initialEfci: null,
        selectedTotalProjectFunding: null,
        initialTotalProjectFunding: null,
        isChecked: []
    };

    handleTotalFundingCost = (value) => {
        const { efciData } = this.props;
        let total = 0;
        total = value * efciData.no_of_years;
        return parseInt(total);
    }

    setValue = (value) => {
        this.setState({
            totalFD: value
        })
    }

    handleSelectField = (e) => {
        const { isChecked } = this.state
        let tempArray = isChecked
        if (e.target.checked) {
            tempArray.push(e.target.value)
        }
        else {
            tempArray = tempArray.filter(ta => ta !== e.target.value)
        }
        this.setState({
            isChecked: tempArray
        })
    }

    render() {
        const {
            efciData,
            setColor,
            hideFundingOptionSiteList,
            isDashboard,
            tempArray
        } = this.props;
        let sortByIndex = _.orderBy(
            tempArray &&
            tempArray.length &&
            tempArray,
            "index",
            "asc"
        );
        const {isChecked}=this.state
        return (
            <div
                class="modal modal-region logs-modal efci-log"
                style={{ display: "block" }}
                id="modalId"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <LoadingOverlay active={this.props.hasLoading} spinner={<Loader />} fadeSpeed={10}>
                    <div class="modal-dialog log-width" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">
                                    EFCI
                                </h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => this.props.onCancel()}
                                >
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div class="modal-body region-otr build-type-mod">
                                <div class="clr-list tab-clr">
                                    <div class="table-section"></div>
                                    <table className={`"table table-common table-bordered"`}>
                                        <thead>
                                            <tr>

                                                <th className={'f-name'} >Funding</th>
                                                <th className={'f-efci'}>EFCI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tempArray &&
                                                tempArray.length ?
                                                //                             this.props.efciData.funding_options.map((item, index) => (
                                                //                                 <React.Fragment key={index}>
                                                //
                                                <>
                                                    {sortByIndex.map((item, index) => (


                                                        <React.Fragment >
                                                            <tr>
                                                                <td>{`FO-${item.index}`}</td>
                                                                <td className={`pos-table-otr-sec pos-otr`} style={{ backgroundColor: `${setColor(item.value) || ""}` }} >
                                                                    <div className="pos-sec">
                                                                        <label className="container-check" for={`checkEdit${item.index}`} ><span >
                                                                            <input type="checkbox"
                                                                                value={item.index}
                                                                                onChange={(e) => this.handleSelectField(e)}
                                                                                id={`checkEdit${item.index}`}
                                                                                name={"checkEdit"}
                                                                            // disabled={this.props.dataView == "building"}
                                                                            // checked={checkedArray.length == this.props.checkedIds.length}
                                                                            />
                                                                            <span className="checkmark"></span>
                                                                        </span></label>
                                                                        <>
                                                                            <NumberFormat
                                                                                // className={`${!this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"} ${item.efci_color ? "text-light" : ""}`}
                                                                                className={`form-control fc-no-dot ${setColor(item.value) ? "text-light" : ""} ${(this.props.disableClick || (isChecked && isChecked.length && isChecked.find(i => i == item.index) ? false : true)) ? "cursor-notallowed" : ""}`}
                                                                                // displayType={this.props.efciBuildingData && this.props.efciBuildingData.locked ? "text" : "input"}
                                                                                displayType={(this.props.disableClick || (isChecked && isChecked.length && isChecked.find(i => i == item.index) ? false : true)) ? "text" : "input"}
                                                                                style={{ backgroundColor: `${setColor(item.value) || ""}` }}
                                                                                disabled={isChecked && isChecked.length && isChecked.find(i => i == item.index) ? false : true}
                                                                                value={item.value}
                                                                                onValueChange={async values => {
                                                                                    const { value } = values;
                                                                                    return await this.props.forceUpdateData(value, item.index, index);
                                                                                    // await this.props.handleFundingCostEfci(item.id, value);
                                                                                }}

                                                                                onFocus={async () => {
                                                                                    await this.setState({
                                                                                        selectedEfci: item.id,
                                                                                        initialEfci: item.value
                                                                                    });
                                                                                }}

                                                                                onKeyPress={async event => {
                                                                                    if (event.key === "Enter") {
                                                                                        await this.setState({
                                                                                            target: event.target
                                                                                        }, async () => {
                                                                                            await this.props.forceUpdateData(this.state.target.value, item.index, index);
                                                                                        });
                                                                                        this.state.target.blur();
                                                                                        this.setState({
                                                                                            selectedEfci: null
                                                                                        })
                                                                                    }
                                                                                }}
                                                                            // onBlur={async () => {
                                                                            //     await this.props.forceUpdateData(item.id, this.state.initialEfci, index);
                                                                            //     await this.setState({
                                                                            //         selectedEfci: null,
                                                                            //         initialEfci: null
                                                                            //     });
                                                                            // }}
                                                                            />
                                                                            {/* {this.state.selectedEfci === item.id ? <i className="fas fa-times"></i> : null} */}
                                                                            {/* {item.edited ? <i className="fa fa-circle edited-dot cursor-hand" aria-hidden="true"
                                                        onClick={() => this.props.showLog && this.props.showLog(item.id, "fundingCostEfci")}
                                                    ></i> : null} */}
                                                                        </>
                                                                    </div>
                                                                </td>



                                                            </tr>

                                                        </React.Fragment>
                                                    ))}



                                                </>
                                                :
                                                <td colSpan={5}>No data found</td>
                                            }
                                        </tbody>
                                    </table>

                                </div>
                                {tempArray &&
                                    tempArray.length ? <div class="text-center btnOtr mt-2 mb-3" onClick={() => this.props.onCancel()}><button type="button" class="btn btn-secondary btnClr col-md-6" data-dismiss="modal">Cancel</button>
                                        <button type="button" class="btn btn-primary btnRgion col-md-6" disabled={!this.props.isValueChanged} onClick={() => this.props.saveData()}>Save</button></div> : null}
                            </div></div>
                    </div>
                </LoadingOverlay>
            </div>
        );
    }
}

export default withRouter(InitialFundingTable);
