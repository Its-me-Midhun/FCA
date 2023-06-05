// import React, { Component } from "react";
// import _ from "lodash";
// import NumberFormat from "react-number-format";
// import { withRouter } from "react-router-dom";

// class AnnualEFCICalculation extends Component {
//     state = {
//         loading: false,
//         selectedCell: null,
//         initialCellValue: null,
//     };

//     componentDidMount() {
//         let yearList = [];
//         _.orderBy(this.props.efciData.annual_fcis[1], 'year', 'asc').map(i => (yearList = [...yearList, i.year]));
//         this.setState({
//             yearList: yearList
//         });
//     }

//     convertToMillion = value => {
//         let data = 0;
//         data = value / 1000000;
//         return data.toFixed(1);
//     };

//     render() {
//         const {
//             efciData: { funding_options = [], annual_fcis, actual_fcis },
//             setColor,
//             actualFunding,
//             hiddenFundingOptionList
//         } = this.props;
//         const { yearList } = this.state;
//         let data = Object.values(annual_fcis && annual_fcis);

//         return (
//             <React.Fragment>
//                 <table className="table table-common table-froze">
//                     <thead>
//                         <tr>
//                             <th className="img-sq-box">
//                                 <img src="/img/sq-box.png" alt="" />
//                             </th>
//                             <th className="build-add">
//                                 Title<i className="fas fa-sort"></i>
//                             </th>
//                             {yearList &&
//                                 yearList.length &&
//                                 yearList.map((item, i) => (
//                                     <th key={i} className="build-year">
//                                         {item} <i className="fas fa-sort"></i>
//                                     </th>
//                                 ))}
//                             <th className="action">EFCI</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {funding_options && funding_options.length ? (
//                             funding_options.map((item, index) => (
//                                 <>
//                                 {hiddenFundingOptionList === undefined || !hiddenFundingOptionList.includes(item.id) ? (
//                                 <React.Fragment key={index}>
//                                     <tr>
//                                         <td className="text-center">
//                                             <img src="/img/sq-box.png" alt="" />
//                                         </td>
//                                         <td className="pos-otr">{`$ ${this.convertToMillion(actualFunding[index])} M Annual Funding`}</td>
//                                         {_.orderBy(data[index], 'year', 'asc').map((amount, index) => (
//                                             <td key={index}
//                                                 className={`${amount.edited ? "close-otr-section" : ""} pos-otr`}
//                                                 style={{ backgroundColor: `${setColor(amount.value) || ""}` }}
//                                             >
//                                                 <div className="pos-sec">
//                                                     <>
//                                                         <NumberFormat
//                                                             className={`${amount.value < 0 ? "fc-neg " : ""}form-control fc-no-dot ${setColor(amount.value) ? "text-light" : ""
//                                                                 }  ${this.props.disableClick ? "cursor-notallowed" : ""}`}
//                                                             style={{ backgroundColor: `${setColor(amount.value) || ""}` }}
//                                                             value={amount.value && amount.value || ""}
//                                                             displayType={this.props.disableClick ? "text" : "input"}
//                                                             onFocus={async () => {
//                                                                 await this.setState({
//                                                                     selectedCell: amount.id,
//                                                                     initialCellValue: amount.value
//                                                                 });
//                                                             }}
//                                                             onValueChange={async values => {
//                                                                 const { value } = values;
//                                                                 // await this.props.handleAnnualEfci(amount.id, value, amount.index);
//                                                                 return this.props.isApi ? "" : await this.props.handleAnnualEfci(amount.id, value, amount.index);

//                                                             }}
//                                                             onKeyPress={async event => {
//                                                                 if (event.key === "Enter") {
//                                                                     await this.setState({
//                                                                         target: event.target
//                                                                     })
//                                                                     await this.props.updateAnnualEFCI(amount.id, amount.value);
//                                                                     await this.setState({
//                                                                         selectedCell: null,
//                                                                         initialCellValue: amount.value
//                                                                     });
//                                                                     this.state.target.blur();
//                                                                 }
//                                                             }}
//                                                             onBlur={async () => {
//                                                                 await this.props.handleAnnualEfci(amount.id, this.state.initialCellValue, amount.index);
//                                                                 await this.setState({
//                                                                     selectedCell: null,
//                                                                     initialCellValue: null
//                                                                 });
//                                                             }}
//                                                         />
//                                                         {this.state.selectedCell === amount.id ? <i className="fas fa-times"></i> : null}
//                                                         {amount.edited ?
//                                                             <i className="fa fa-circle cursor-hand" aria-hidden="true"
//                                                             onClick={() => {
//                                                                 this.props.showLog && this.props.showLog(amount.id,"annualEfci")                                                            }}
//                                                             ></i>
//                                                             : null
//                                                         }
//                                                     </>
//                                                 </div>
//                                             </td>
//                                         ))}
//                                         <td
//                                             className={`${setColor(actual_fcis[index].value) ? "text-light" : ""}`}
//                                             style={{ backgroundColor: `${setColor(actual_fcis[index].value) || ""}` }}
//                                         >
//                                             <span className="tot-dtl">{actual_fcis[index].value}</span>
//                                         </td>
//                                     </tr>
//                                 </React.Fragment>
//                             ):null}</>))
//                         ) : (
//                                 <td> No data</td>
//                             )}
//                     </tbody>
//                 </table>
//             </React.Fragment>
//         );
//     }
// }

// export default withRouter(AnnualEFCICalculation);
