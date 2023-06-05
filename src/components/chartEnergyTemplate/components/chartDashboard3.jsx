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
            "building_energy_usage_intensity",
            "building_total_energy_usage",
            "site_energy_use_intensity",
            "usage_analysis"
            // "heating_degree_days"
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

    renderXData = graphTypeData => {
        const tempArr = [];
        const yrs = Object.keys(graphTypeData);
        yrs.forEach(item => tempArr.push(...Object.keys(Object.fromEntries(graphTypeData[item]))));
        return [...new Set(tempArr)].sort();
    };

    renderChartDetails = (graphTypeData, showlabel, type) => {
        const tempSeries = [];

        const xdata = this.renderXData(graphTypeData);

        Object.keys(graphTypeData).forEach(item => {
            const yearValues = Object.fromEntries(graphTypeData[item]);
            const monthData = xdata.map(item => {
                if (yearValues[item]) {
                    return yearValues[item];
                }
                return 0;
            });

            tempSeries.push({
                name: item,
                data: monthData,
                dataLabels: {
                    enabled: monthData?.length === 1,
                    rotation: 360,
                    align: "center",
                    y: -5,
                    x: 0,
                    style: {
                        fontSize: "8px",
                        fontFamily: "Poppins,sans-serif"
                    },
                    format: `${this.renderFormatter(type)} {point.y:,.2f}`
                }
            });
        });

        return tempSeries;
    };

    renderChartTempDetails = graphTypeData => {
        const tempSeries = [];

        Object.keys(graphTypeData).forEach(item => {
            tempSeries.push({
                name: item,
                data: graphTypeData[item]
            });
        });

        return tempSeries;
    };

    renderYtext = type => {
        switch (type) {
            case "building_energy_cost_intensity": {
                return "$/SF";
            }
            case "building_energy_usage_intensity": {
                return "kBTU/SF";
            }
            case "site_energy_cost_intensity": {
                return "$/SF";
            }
            case "site_energy_use_intensity": {
                return "kBTU/SF";
            }

            default:
                return "";
        }
    };

    renderFormatter = type => {
        if (
            type === "building_energy_cost_intensity" ||
            type === "site_energy_cost_intensity" ||
            type === "building_total_energy_cost" ||
            type === "energy_unit_analysis"
        ) {
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
        const self = this;
        let graphTypeData = [];
        let chartTag = "";

        if (graphData) {
            switch (type) {
                case "building_energy_cost_intensity": {
                    graphTypeData = graphData["building_energy_cost_intensity"];

                    break;
                }
                case "building_energy_usage_intensity": {
                    graphTypeData = graphData["building_energy_usage_intensity"];
                    break;
                }
                case "site_energy_cost_intensity": {
                    graphTypeData = graphData["site_energy_cost_intensity"];
                    break;
                }
                case "site_energy_use_intensity": {
                    graphTypeData = graphData["site_energy_use_intensity"];
                    break;
                }
                case "building_total_energy_cost": {
                    graphTypeData = graphData["building_total_energy_cost"];
                    chartTag = "Cost";
                    break;
                }
                case "building_total_energy_usage": {
                    graphTypeData = graphData["building_total_energy_usage"];
                    chartTag = "Usage";
                    break;
                }
                case "usage_analysis": {
                    graphTypeData = graphData["usage_analysis"];
                    chartTag = "Usage";
                    break;
                }

                default:
                    break;
            }

            if (
                type === "building_energy_cost_intensity" ||
                type === "building_energy_usage_intensity" ||
                type === "site_energy_cost_intensity" ||
                type === "site_energy_use_intensity"
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
                            categories: this.renderXData(graphTypeData),

                            labels: {
                                rotation: 0,
                                style: {
                                    fontSize: "13px"
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
                    series: this.renderChartDetails(
                        graphTypeData,
                        type === "site_energy_cost_intensity" || type === "site_energy_use_intensity" ? true : false,
                        type
                    ),

                    legendView: "dash2"
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
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: "pie",
                        style: {
                            fontFamily: "Poppins, sans-serif"
                        }
                    },

                    title: {
                        text: ""
                    },

                    tooltip: {
                        style: {
                            fontSize: "12px"
                        },
                        formatter: function () {
                            return `<b>${this.key}</b> : ${this.percentage.toFixed(1)} %<br><span style="color:${this.color}">\u25CF</span> ${
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
                        pie: {
                            allowPointSelect: true,
                            cursor: "pointer",
                            showInLegend: false,
                            dataLabels: {
                                enabled: true,
                                style: {
                                    fontSize: "12px"
                                },
                                formatter: function () {
                                    return `<b>${this.point.name}</b> : ${this.point.percentage.toFixed(1)} %<br> <span style="color:${
                                        this.color
                                    }"></span>${this.series.name}: ${self.renderFormatter(type)} ${thousandsSeparators(
                                        this.y.toFixed(self.decimalFormatter(this.y))
                                    )}`;
                                }
                            }
                        },
                        series: {
                            point: {
                                events: {
                                    legendItemClick: function () {
                                        return false;
                                    }
                                }
                            }
                        }
                    },
                    series: [
                        {
                            name: chartTag,
                            colorByPoint: true,
                            data: graphTypeData
                        }
                    ],
                    legendView: "dash3"
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
            case "building_energy_cost_intensity":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Building Breakdown Energy Cost Intensity ($ per SF)`
                    : "Current Entity Building Breakdown Energy Cost Intensity ($ per SF)";
            case "building_energy_usage_intensity":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Building Breakdown Energy Use Intensity (kBTU per SF)`
                    : "Current Entity Building Breakdown Energy Use Intensity (kBTU per SF)";
            case "site_energy_cost_intensity":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Site Breakdown Energy Cost Intensity ($ per SF)`
                    : "Current Entity Site Breakdown for Site Energy Cost Intensity ($ per SF)";
            case "site_energy_use_intensity":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Site Breakdown Energy Use Intensity (kBTU per SF)`
                    : "Current Entity Site Breakdown for Site Energy Use Intensity (kBTU per SF)";
            case "building_total_energy_cost":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Annual Average Building Breakdown Total Energy Cost ($)`
                    : "Current Entity Annual Average Building Breakdown Total Energy Cost ($)";
            case "building_total_energy_usage":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Annual Average Building Breakdown Total Energy Usage (kBTU)`
                    : "Annual Average Building Breakdown Total Energy Usage (kBTU)";
            case "usage_analysis":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Annual Average Energy Unit Usage Analysis (kBTU)`
                    : "Annual Average Energy Unit Usage Analysis (kBTU)";

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
                                                                  containerProps={{ style: { height: "250px", width: "100%" } }}
                                                              />
                                                          ) : null}
                                                      </div>
                                                  </>
                                              ) : (
                                                  <div className="coming-soon no-data">
                                                      <div className="coming-soon-img">
                                                          <img src="/img/no-data.svg" />
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
