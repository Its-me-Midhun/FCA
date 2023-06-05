import React, { Component } from "react";
import NumberFormat from "react-number-format";
import ReactTooltip from "react-tooltip";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
// import HighChartExport from 'highcharts/modules/exporting';
import HighChartExportModule from "highcharts/modules/export-data";
import LabelModule from "highcharts/modules/series-label";
import GridLight from "highcharts/themes/grid-light";
import GridLightSource from "highcharts/themes/grid-light.src";
import Loader from "../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import { thousandsSeparators } from "../../../config/utils";

highchartsMore(Highcharts);
// require('highcharts/modules/export-data')(Highcharts);

highcharts3d(Highcharts);
// HighChartExport(Highcharts);
// HighChartExportModule(Highcharts)
GridLight(Highcharts);
// GridLightSource(Highcharts)
LabelModule(Highcharts);

Highcharts.setOptions({
    lang: {
        thousandsSep: ","
        // decimalPoint: '.',
    }
});

class ChartDasboard extends Component {
    state = {
        chartArray: [
            // "monthly_electricity_cost",
            // "monthly_electricity_usage",
            // "monthly_gas_cost",
            // "monthly_gas_usage",
            // "monthly_total_energy_cost",
            // "monthly_total_energy_usage",
            "cooling_degree_days",
            "heating_degree_days"
        ],
        dataSource: {},
        totalAmount: 0,
        legendValues: [],
        legendArrayFunding: [],
        viewData: null
    };

    renderColors = key => {
        switch (key) {
            case 0:
                return "#E41C1C ";
            case 1:
                return "#EE6B0B ";
            case 2:
                return "#F2D205 ";
            case 3:
                return "#6A8F3F ";
        }
    };

    renderChartDetails = graphTypeData => {
        const tempSeries = [];

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        Object.keys(graphTypeData).forEach(item => {
            const yearValues = Object.fromEntries(graphTypeData[item]);
            const monthData = months.map(item => {
                if (yearValues[item]) {
                    return yearValues[item];
                }
                return 0;
            });

            tempSeries.push({
                name: item,
                data: monthData
            });
        });

        return tempSeries;
    };

    renderChartTempDetails = graphTypeData => {
        // const tempSeries = [];

        // Object.keys(graphTypeData).forEach(item => {
        //     tempSeries.push({
        //         name: item,
        //         data: graphTypeData[item]
        //     });
        // });

        return graphTypeData;
    };

    renderYtext = type => {
        switch (type) {
            case "monthly_electricity_cost": {
                return "$";
            }
            case "monthly_electricity_usage": {
                return "MMBTU";
            }
            case "monthly_gas_cost": {
                return "$";
            }
            case "monthly_gas_usage": {
                return "MMBTU";
            }
            case "monthly_total_energy_cost": {
                return "$";
            }
            case "monthly_total_energy_usage": {
                return "MMBTU";
            }
            default:
                return "";
        }
    };

    renderFormatter = type => {
        if (type === "monthly_electricity_cost" || type === "monthly_gas_cost" || type === "monthly_total_energy_cost") {
            return "$";
        } else return "";
    };

    decimalFormatter = val => {
        if (val < 1000) {
            return 2;
        } else return 0;
    };

    renderChart = type => {
        const { graphData } = this.props;
        let self = this;
        let graphTypeData = [];

        if (graphData) {
            switch (type) {
                case "monthly_electricity_cost": {
                    graphTypeData = graphData["monthly_electricity_cost"];
                    break;
                }
                case "monthly_electricity_usage": {
                    graphTypeData = graphData["monthly_electricity_usage"];
                    break;
                }
                case "monthly_gas_cost": {
                    graphTypeData = graphData["monthly_gas_cost"];
                    break;
                }
                case "monthly_gas_usage": {
                    graphTypeData = graphData["monthly_gas_usage"];
                    break;
                }
                case "monthly_total_energy_cost": {
                    graphTypeData = graphData["monthly_total_energy_cost"];
                    break;
                }
                case "monthly_total_energy_usage": {
                    graphTypeData = graphData["monthly_total_energy_usage"];
                    break;
                }
                case "cooling_degree_days": {
                    graphTypeData = graphData["cooling_degree_days"];
                    break;
                }
                case "heating_degree_days": {
                    graphTypeData = graphData["heating_degree_days"];
                    break;
                }

                default:
                    break;
            }

            if (
                type === "monthly_electricity_cost" ||
                type === "monthly_electricity_usage" ||
                type === "monthly_gas_cost" ||
                type === "monthly_gas_usage" ||
                type === "monthly_total_energy_cost" ||
                type === "monthly_total_energy_usage"
            ) {
                let dataSource = {
                    exporting: { enabled: false },
                    chart: {
                        type: "column",
                        backgroundColor: "#FFFFFF",
                        style: {
                            fontFamily: "Poppins, sans-serif"
                        }
                    },

                    title: {
                        text: ""
                    },

                    xAxis: [
                        {
                            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

                            labels: {
                                style: {
                                    fontSize: "16px"
                                }
                            }
                        }
                    ],

                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: this.renderYtext(type),
                            style: {
                                textTransform: "none"
                            }
                        },

                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: "bold",

                                color:
                                    // theme
                                    (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray"
                            },
                            formatter: function () {
                                return this.renderFormatter(type) + (this.total / 1000000).toFixed(2) + "M";
                            }
                        }
                    },

                    tooltip: {
                        formatter: function () {
                            return `<b>${this.key}</b><br><span style="color:${this.series.color}">\u25CF</span> ${
                                this.series.name
                            }: ${self.renderFormatter(type)} ${thousandsSeparators(this.y.toFixed(self.decimalFormatter(this.y)))}`;
                        }
                    },
                    labels: {
                        formatter: function () {
                            return Highcharts.numberFormat(this.value, 2, ",", " ");
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: this.renderChartDetails(graphTypeData)
                };
                let rtrnValue = {
                    dataSource,
                    type
                };

                return rtrnValue;
            } else {
                let dataSource = {
                    exporting: { enabled: false },
                    chart: {
                        type: "line",
                        backgroundColor: "#FFFFFF",
                        style: {
                            fontFamily: "Poppins, sans-serif"
                        }
                    },

                    title: {
                        text: ""
                    },

                    xAxis: [
                        {
                            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

                            labels: {
                                style: {
                                    fontSize: "16px"
                                }
                            }
                        }
                    ],

                    yAxis: {
                        title: {
                            text: "Temperature (°F)"
                        }
                    },

                    tooltip: {
                        formatter: function () {
                            return `<b>${this.key}</b><br><span style="color:${this.series.color}">\u25CF</span> ${
                                this.series.name
                            }: ${self.renderFormatter(type)} ${thousandsSeparators(this.y.toFixed(self.decimalFormatter(this.y)))}`;
                        }
                    },
                    labels: {
                        formatter: function () {
                            return Highcharts.numberFormat(this.value, 2, ",", " ");
                        }
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            }
                            // pointStart: 2010
                        }
                    },
                    series: this.renderChartTempDetails(graphTypeData)
                };
                let rtrnValue = {
                    dataSource,
                    type
                };

                return rtrnValue;
            }
        }
    };

    renderHeaderDetails = () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;

        if (section === "energyinfo") {
            return `${this.props.clientDetails?.name} Enterprise /`;
        }
        if (section === "buildinginfo") {
            return `${this.props.clientDetails?.name} Building /`;
        }
        if (section === "regioninfo") {
            return `${this.props.clientDetails?.name} Region /`;
        }
        if (section === "siteinfo") {
            return `${this.props.clientDetails?.name} Site /`;
        }
    };

    renderHeading = type => {
        switch (type) {
            case "monthly_electricity_cost":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Monthly Electricity Cost ($)`
                    : "Current Entity Monthly Electricity Cost ($)";
            case "monthly_electricity_usage":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Monthly Electricity Usage (MMBTU)`
                    : "Current Entity Monthly Electricity Usage (MMBTU)";
            case "monthly_gas_cost":
                return this.renderHeaderDetails() ? `${this.renderHeaderDetails()} Monthly Gas Cost ($)` : "Current Entity Monthly Gas Cost ($)";
            case "monthly_gas_usage":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Monthly Gas Usage (MMBTU)`
                    : "Current Entity Monthly Gas Usage (MMBTU)";
            case "monthly_total_energy_cost":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Monthly Total Energy Cost ($)`
                    : "Current Entity Monthly Total Energy Cost ($)";
            case "monthly_total_energy_usage":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Monthly Total Energy Usage (MMBTU)`
                    : "Current Entity Monthly Total Energy Usage (MMBTU)";
            case "cooling_degree_days":
                return this.renderHeaderDetails() ? `${this.renderHeaderDetails()} Cooling Degree Days` : "Cooling Degree Days";
            case "heating_degree_days":
                return this.renderHeaderDetails() ? `${this.renderHeaderDetails()} Heating Degree Days` : "Heating Degree Days";
            default:
                return null;
        }
    };

    render() {
        const { chartArray, dataSource, totalAmount, legendValues, legendArrayFunding } = this.state;
        const { graphData } = this.props;
        var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

        return (
            <div
                className={isFullscreen ? "chart-graph-outr chart-area chart-coming-soon fln-src" : " chart-graph-outr chart-area chart-coming-soon"}
                id={"dashboard"}
            >
                <div className="chart-ground align-base pt-1">
                    {chartArray && chartArray.length && Object.keys(this.props.graphData).length !== 0
                        ? chartArray.map((ca, key) => {
                              return (
                                  <div className={`col-md-6 mb-2 ${key % 2 === 0 ? "pr-0" : ""}`} key={key}>
                                      <LoadingOverlay active={this.props.isLoading} spinner={<Loader />} fadeSpeed={10}>
                                          <div className="box-order h-auto">
                                              {this.renderChart(ca).dataSource.series &&
                                              this.renderChart(ca).dataSource.series.length &&
                                              this.renderChart(ca).dataSource.series &&
                                              this.renderChart(ca).dataSource.series[0].data &&
                                              this.renderChart(ca).dataSource.series[0].data.length ? (
                                                  <>
                                                      <div className="hed-chart-bnr chart-mod-head">
                                                          <div>
                                                              <h3 className="energydash-header-sub">{this.renderHeading(ca).split("/")?.[0]}</h3>
                                                              <h3 className="energydash-header-main">{this.renderHeading(ca).split("/")?.[1]}</h3>
                                                          </div>
                                                          <div className="right-section">
                                                              <div className="min-tab-buttons bg-transparent custom-head-height">
                                                                  <a
                                                                      className="nav-link calcicons min-mize custom-head-height"
                                                                      data-for="table-top-icons"
                                                                      data-tip="Maximize Chart"
                                                                      data-place="left"
                                                                      onClick={() => this.props.handleChartView(ca)}
                                                                  >
                                                                      <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                                                      <ReactTooltip
                                                                          id="table-top-icons"
                                                                          effect="solid"
                                                                          place="bottom"
                                                                          backgroundColor="#007bff"
                                                                      />
                                                                  </a>
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div>
                                                          {this.renderChart(ca).dataSource.series && this.renderChart(ca).dataSource.series.length ? (
                                                              <HighchartsReact
                                                                  highcharts={Highcharts}
                                                                  options={this.renderChart(ca).dataSource}
                                                                  allowChartUpdate
                                                                  containerProps={{ style: { height: "300px", width: "100%" } }}
                                                              />
                                                          ) : null}
                                                      </div>
                                                  </>
                                              ) : (
                                                  <div className="coming-soon no-data">
                                                      <div className="coming-soon-img">
                                                          <img src="/img/no-data.svg" style={{ height: "270px" }} />
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                      </LoadingOverlay>
                                  </div>
                              );
                          })
                        : null}
                </div>
            </div>
        );
    }
}
export default ChartDasboard;
