import React, { Component } from 'react';
import Table from '../../common/components/Table';

class DifferedMaintenance extends Component {
    state = {
        activeTab: true
    };

    setTotal(data) { 
        let total = 0;
        data.forEach(element => {
            total += parseFloat(element.amount)
        });
        return total;
    }

    renderSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;

        if (this.props.proDifferedMaintenance && this.props.proDifferedMaintenance.data) {
            this.props.proDifferedMaintenance.data.forEach(function (row) {
                row.data && row.data.length && row.data.forEach(function (item) {
                    obj.push(item);
                });
            })
            let yearHolder = {};
            obj.forEach(function (d) {
                if (yearHolder.hasOwnProperty(d.year)) {
                    yearHolder[d.year] = yearHolder[d.year] + parseFloat(d.amount);
                } else {
                    yearHolder[d.year] = parseFloat(d.amount);
                }
            });
            for (let prop in yearHolder) {
                subTotalByYear.push({ year: prop, amount: yearHolder[prop] });
            }
        }
        return subTotalByYear;
    }

    renderFutureSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;

        if (this.props.differedMaintenance && this.props.differedMaintenance.data) {
            this.props.differedMaintenance.data.forEach(function (row) {
                row.data && row.data.length && row.data.forEach(function (item) {
                    obj.push(item);
                });
            })
            let yearHolder = {};
            obj.forEach(function (d) {
                if (yearHolder.hasOwnProperty(d.year)) {
                    yearHolder[d.year] = yearHolder[d.year] + parseFloat(d.amount);
                } else {
                    yearHolder[d.year] = parseFloat(d.amount);
                }
            });
            for (let prop in yearHolder) {
                subTotalByYear.push({ year: prop, amount: yearHolder[prop] });
            }
        }
        return subTotalByYear;
    }

    render() {
        const { tableData } = this.props;
        let site =
            this.props.siteList.filter(item => {
                return (item.key == this.props.siteId)
            })
        let grandTotal = 0;
        let subTotalByYear = this.renderSubTotalRow();
        subTotalByYear.map(yeatData => {
            (grandTotal += yeatData.amount)
        })
        let subTotalFutureByYear = this.renderFutureSubTotalRow();
        subTotalFutureByYear.map(yeatData => {
            (grandTotal += yeatData.amount)
        })
        return (
            <>
                {this.props.differedMaintenance && this.props.differedMaintenance.data && this.props.differedMaintenance.data.length ?
                    <div class="tab-active location-sec image-sec tab-grey">
                        <div class="dtl-sec col-md-12">
                            <div class="table-top-menu allign-right">
                                <div class="lft">
                                    <h1></h1>
                                </div>

                                <div class="rgt">
                                    <button class={this.state.activeTab == true ? "btn-fci active" : "btn-fci"} data-toggle="modal" data-target="#Modal-build" onClick={() => { this.setState({ activeTab: true }) }}>
                                        Non EFCI
                            </button>
                                    <button class={this.state.activeTab == false ? "btn-fci active" : "btn-fci"} data-toggle="modal" data-target="#Modal-build" onClick={() => { this.setState({ activeTab: false }) }}>
                                        FCI Summary
                            </button>
                                </div>
                            </div>

                            {this.state.activeTab ?
                                <>
                                    <div class="table-topper">
                                        <div class="col-md-12 otr-topr">
                                            <h3>{`${this.props.differedMaintenance && this.props.differedMaintenance.data[0].data.length}`}-year Capital pending projections</h3>
                                            <h4>{site && site[0].label}</h4>
                                            <h4>Yearly capital spending summary by capital type</h4>
                                        </div>
                                    </div>

                                    <div class="table-section table-scroll build-fci">
                                        <table class="table table-common">
                                            <thead>
                                                <tr>
                                                    <th class="img-sq-box">
                                                        <img src="/img/sq-box.png" />
                                                    </th>
                                                    <th class="build-add">Building/Addition <i class="fas fa-sort"></i></th>
                                                    {this.props.differedMaintenance && this.props.differedMaintenance.data[0].data.map((i) => {
                                                        return (<>
                                                            <th class="build-year">{i.year} <i class="fas fa-sort"></i></th>
                                                        </>)
                                                    })}
                                                    <th class="action">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.differedMaintenance && this.props.differedMaintenance.data.map((item, i) => {
                                                    return (<>
                                                        <tr>
                                                            <td className="img-sq-box">
                                                                <img alt="" src="/img/sq-box.png" />
                                                            </td>
                                                            <td>{item.name} </td>
                                                            {item.data.map(data => {
                                                                return (<>
                                                                    <td><span class="txt-dl">${data.amount}</span></td>
                                                                </>)
                                                            })}
                                                            <td className="tot-dl"> ${this.setTotal(item.data)}</td>
                                                        </tr>
                                                    </>)
                                                }
                                                )}
                                                <tr class="subtotal">
                                                    <td class="text-center">
                                                        <img src="/img/sq-box.png" />
                                                    </td>
                                                    <td class="tot-dl">SUBTOTALS</td>
                                                    {subTotalFutureByYear.length ? (
                                                        <>
                                                            {subTotalFutureByYear.map((yeatData, i) => (
                                                                <td>
                                                                    <span className="tot-dl" key={i}>
                                                                        ${yeatData.amount.toFixed(2) || 0.0}
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        </>
                                                    ) : <>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                        </>}
                                                    <td>
                                                        <span className="tot-dl">${grandTotal.toFixed(2) || 0.0}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                :
                                <>
                                    <div class="table-topper">
                                        <div class="col-md-12 otr-topr">
                                            <h3>{`${this.props.proDifferedMaintenance && this.props.proDifferedMaintenance.data[0].data.length}`}-year Capital pending projections</h3>
                                            <h4>{site && site[0].label}</h4>
                                            <h4>Yearly capital spending summary by capital type</h4>
                                        </div>
                                    </div>

                                    <div class="table-section table-scroll build-fci">
                                        <table class="table table-common">
                                            <thead>
                                                <tr>
                                                    <th class="img-sq-box">
                                                        <img src="/img/sq-box.png" />
                                                    </th>
                                                    <th class="build-add">Building/Addition <i class="fas fa-sort"></i></th>
                                                    {this.props.proDifferedMaintenance && this.props.proDifferedMaintenance.data[0].data.map((i) => {
                                                        return (<>
                                                            <th class="build-year">{i.year} <i class="fas fa-sort"></i></th>
                                                        </>)
                                                    })}
                                                    <th class="action">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.proDifferedMaintenance && this.props.proDifferedMaintenance.data.map((item, i) => {
                                                    return (<>
                                                        <tr>
                                                            <td className="img-sq-box">
                                                                <img alt="" src="/img/sq-box.png" />
                                                            </td>
                                                            <td>{item.name} </td>
                                                            {item.data.map(data => {
                                                                return (<>
                                                                    <td><span class="txt-dl">${data.amount}</span></td>
                                                                </>)
                                                            })}
                                                            <td className="tot-dl"> ${this.setTotal(item.data)}</td>
                                                        </tr>
                                                    </>)
                                                }
                                                )}
                                                < tr class="subtotal">
                                                    <td class="text-center">
                                                        <img src="/img/sq-box.png" />
                                                    </td>
                                                    <td class="tot-dl">SUBTOTALS</td>
                                                    {subTotalByYear.length ? (
                                                        <>
                                                            {subTotalByYear.map((yeatData, i) => (
                                                                <td>
                                                                    <span className="tot-dl" key={i}>
                                                                        ${yeatData.amount.toFixed(2) || 0.0}
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        </>
                                                    ) :
                                                        <>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                            <td><span class="tot-dl">$00</span></td>
                                                        </>
                                                    }
                                                    <td>
                                                        <span className="tot-dl">${grandTotal.toFixed(2) || 0.0}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    :
                    ""
                }
            </>
        );
    }
}
export default DifferedMaintenance;
