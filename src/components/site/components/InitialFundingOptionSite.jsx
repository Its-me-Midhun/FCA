import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router-dom";

class InitialFundingOptionSite extends Component {
    state = {
        selectedProjectAnnualFunding: null,
        initialProjectAnnualFunding: null,
        selectedEfci: null,
        initialEfci: null,
        selectedTotalProjectFunding: null,
        initialTotalProjectFunding: null,
        site_fci: {}
    };

    render() {
        const {
            // efciSiteData: { funding_options = [], no_of_years },
            efciSiteData,
            hiddenFundingOptionList,
            toggleLoader,
            updateEfciInInitialFundingOptions,
            updateFundingEfciData,
            handleHideFundingOptions,
            isDashboard
        } = this.props;
        return (
            <>
                <table className={`${isDashboard ? "table table-common table-bordered" : "table table-common"}`}>
                    <thead>
                        <tr>
                            {!isDashboard ? (
                                <th className="img-sq-box">
                                    <img src="/img/sq-box.png" alt="" />
                                </th>
                            ) : null}
                            <th className={`${!isDashboard ? "f-name" : "wdthChartfo"}`}>Funding</th>
                            {!isDashboard ? <th className="f-cost">Project Annual Funding</th> : null}
                            <th className={`${!isDashboard ? "f-efci" : "table-widjet-width"}`}>EFCI</th>
                            <th className={`${!isDashboard ? "f-total" : "wdthChartfo"}`}>Total Project Funding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {efciSiteData && efciSiteData.funding_options && efciSiteData.funding_options.length
                            ? uniqBy(efciSiteData.funding_options, "funding").map((item, key) => (
                                  <tr>
                                      {!isDashboard ? (
                                          <td className="text-center cursor-hand">
                                              <i
                                                  className={
                                                      hiddenFundingOptionList && hiddenFundingOptionList.includes(item.id)
                                                          ? "fa fa-eye-slash"
                                                          : "fa fa-eye"
                                                  }
                                                  onClick={() => handleHideFundingOptions(item.id)}
                                              />
                                          </td>
                                      ) : null}
                                      <td>{!isDashboard ? item.funding : `FO-${key + 1}`}</td>
                                      {!isDashboard ? (
                                          <td className="pos-table-otr-sec pos-otr ">
                                              <div className="pos-sec">
                                                  <>
                                                      <NumberFormat
                                                          // id="input"
                                                          className={`${
                                                              this.props.disableClick
                                                                  ? "form-control fc-no-dot cursor-notallowed"
                                                                  : "form-control fc-no-dot"
                                                          }`}
                                                          value={item.funding_cost}
                                                          thousandSeparator={true}
                                                          prefix={"$ "}
                                                          onValueChange={async values => {
                                                              const { value } = values;
                                                              await this.props.updateProjectAnnualFunding(item.id, value);
                                                          }}
                                                          displayType={this.props.disableClick ? "text" : "input"}
                                                          onFocus={async () => {
                                                              await this.setState({
                                                                  selectedProjectAnnualFunding: item.id,
                                                                  initialFundingCost: item.funding_cost
                                                              });
                                                          }}
                                                          onKeyPress={async event => {
                                                              if (event.key === "Enter") {
                                                                  await this.setState({ target: event.target });
                                                                  let site_fci = {
                                                                      value: item.funding_cost
                                                                  };
                                                                  // await this.setState({
                                                                  //     site_fci
                                                                  // }, async () => {
                                                                  //     await toggleLoader();
                                                                  //     await this.props.updateSiteFundingOption(this.state.selectedProjectAnnualFunding, site_fci)
                                                                  // });

                                                                  //   ----------------loader not showing ---------------
                                                                  await this.setState({
                                                                      site_fci
                                                                  });

                                                                  await toggleLoader();
                                                                  await this.props.updateSiteFundingOption(
                                                                      this.state.selectedProjectAnnualFunding,
                                                                      site_fci
                                                                  );
                                                                  // ----------------------------------------------
                                                                  await this.setState({
                                                                      selectedProjectAnnualFunding: item.id,
                                                                      initialFundingCost: item.funding_cost
                                                                  });
                                                                  await toggleLoader();
                                                                  this.state.target.blur();
                                                              }
                                                          }}
                                                          onBlur={async () => {
                                                              await this.props.updateProjectAnnualFunding(item.id, this.state.initialFundingCost);
                                                              await this.setState({
                                                                  selectedProjectAnnualFunding: null,
                                                                  initialFundingCost: null
                                                              });
                                                          }}
                                                      />
                                                      {this.state.selectedProjectAnnualFunding === item.id ? (
                                                          <i className="fas fa-times cursor-pointer"></i>
                                                      ) : null}
                                                      {item.edited ? (
                                                          <i
                                                              className="fa fa-circle edited-dot cursor-hand"
                                                              aria-hidden="true"
                                                              onClick={() =>
                                                                  this.props.showLogsTableFundingOption &&
                                                                  this.props.showLogsTableFundingOption(item.id)
                                                              }
                                                          ></i>
                                                      ) : null}
                                                  </>
                                              </div>
                                          </td>
                                      ) : null}
                                      {/* <td className="pos-table-otr-sec pos-otr"> */}
                                      <td className={`pos-table-otr-sec pos-otr`} style={{ backgroundColor: `${item.efci_color || ""}` }}>
                                          <div className="pos-sec">
                                              <>
                                                  <NumberFormat
                                                      id="input"
                                                      // className="form-control fc-no-dot"
                                                      className={`form-control fc-no-dot ${item.efci_color ? "text-light" : ""} ${
                                                          this.props.disableClick ? "cursor-notallowed" : ""
                                                      }`}
                                                      displayType={this.props.disableClick ? "text" : "input"}
                                                      style={{ backgroundColor: `${item.efci_color || ""}` }}
                                                      value={item.efci}
                                                      onValueChange={async values => {
                                                          const { value } = values;
                                                          await this.props.updateEfciInInitialFundingOptions(item.efci_id, value);
                                                      }}
                                                      onFocus={async () => {
                                                          await this.setState({
                                                              selectedEfci: item.efci_id,
                                                              initialEfci: item.efci
                                                          });
                                                      }}
                                                      onKeyPress={async event => {
                                                          if (event.key === "Enter") {
                                                              await this.setState(
                                                                  {
                                                                      target: event.target,
                                                                      efciValue: event.target.value
                                                                  },
                                                                  async () => {
                                                                      await toggleLoader();
                                                                      await updateFundingEfciData(item.efci_id, { value: this.state.efciValue });
                                                                      await this.setState({
                                                                          selectedEfci: null,
                                                                          initialEfci: this.state.efciValue
                                                                      });
                                                                      await toggleLoader();
                                                                      this.state.target.blur();
                                                                  }
                                                              );
                                                          }
                                                      }}
                                                      onBlur={async event => {
                                                          await this.props.updateEfciInInitialFundingOptions(item.efci_id, this.state.initialEfci);
                                                          await this.setState({
                                                              selectedEfci: null,
                                                              initialEfci: null
                                                          });
                                                      }}
                                                  />
                                                  {this.state.selectedEfci === item.efci_id ? <i className="fas fa-times"></i> : null}
                                                  {item.efci_edited ? (
                                                      <i
                                                          className="fa fa-circle edited-dot cursor-hand"
                                                          aria-hidden="true"
                                                          onClick={() =>
                                                              this.props.showLogsTableFundingEfci && this.props.showLogsTableFundingEfci(item.efci_id)
                                                          }
                                                      ></i>
                                                  ) : null}
                                              </>
                                          </div>
                                      </td>
                                      <td className="pos-table-otr-sec pos-otr">
                                          <div className="pos-sec">
                                              <>
                                                  <NumberFormat
                                                      // id="input1"
                                                      className={`form-control fc-no-dot ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                      displayType={this.props.disableClick ? "text" : "input"}
                                                      value={parseInt(item.expected_cost)}
                                                      thousandSeparator={true}
                                                      prefix={"$ "}
                                                      onFocus={async () => {
                                                          await this.setState({
                                                              selectedTotalProjectFunding: item.id,
                                                              initialTotalProjectFunding: item.expected_cost
                                                          });
                                                      }}
                                                      onValueChange={async values => {
                                                          const { value } = values;
                                                          await this.props.updateTotalProjectFunding(item.id, value);
                                                      }}
                                                      onKeyPress={async event => {
                                                          const total = parseInt(
                                                              parseInt(item.expected_cost) / (efciSiteData.no_of_years ? efciSiteData.no_of_years : 1)
                                                          );
                                                          if (event.key === "Enter") {
                                                              await this.setState({
                                                                  target: event.target
                                                              });
                                                              await toggleLoader();
                                                              await this.props.updateSiteFundingOption(this.state.selectedTotalProjectFunding, {
                                                                  value: total
                                                              });
                                                              await this.props.updateTotalProjectFunding(item.id, item.expected_cost);
                                                              await this.setState({
                                                                  selectedTotalProjectFunding: item.id,
                                                                  initialTotalProjectFunding: item.expected_cost
                                                              });
                                                              await toggleLoader();
                                                              this.state.target.blur();
                                                          }
                                                      }}
                                                      onBlur={async () => {
                                                          await this.props.updateTotalProjectFunding(item.id, this.state.initialTotalProjectFunding);
                                                          await this.setState({
                                                              selectedTotalProjectFunding: null,
                                                              initialTotalProjectFunding: null
                                                          });
                                                      }}
                                                  />
                                                  {this.state.selectedTotalProjectFunding === item.id ? <i className="fas fa-times"></i> : null}
                                                  {item.edited || item.efci_edited ? (
                                                      <i
                                                          className="fa fa-circle edited-dot cursor-hand"
                                                          aria-hidden="true"
                                                          onClick={() =>
                                                              this.props.showLogsTotalFundingOption &&
                                                              this.props.showLogsTotalFundingOption(item.id, efciSiteData.no_of_years)
                                                          }
                                                      ></i>
                                                  ) : null}
                                              </>
                                          </div>
                                      </td>
                                  </tr>
                              ))
                            : null}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(InitialFundingOptionSite);
