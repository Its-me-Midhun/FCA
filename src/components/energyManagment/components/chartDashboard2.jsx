import React, { Component } from "react";
import NumberFormat from "react-number-format";
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
            "Monthly_Electricity_Cost",
            "Monthly_Electricity_Usage",
            "Monthly_Gas_Cost",
            "Monthly_Gas_Usage ",
            "Monthly_Energy_Cost",
            "Monthly_Energy_Usage ",
            "Cooling_Degree_Days",
            "Heating_Degree_Days"
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

    renderChart = type => {
        const { graphData, funding_options, capital_spending_plans } = this.props;
        let graphTypeData = [];
        let sumMerged = [];
        if (graphData) {
            switch (type) {
                case "Electricity": {
                    graphTypeData = graphData["Electricity"];
                    break;
                }
                case "category": {
                    graphTypeData = graphData["category"];
                    break;
                }
                case "building": {
                    graphTypeData = graphData["building"];

                    break;
                }
                case "funding_source": {
                    graphTypeData = graphData["funding_source"];
                    break;
                }
                case "priority": {
                    graphTypeData = graphData["priority"];
                    break;
                }
            }
            let dataSource = {};
            let sumValue = graphData["building"] && graphData["building"].length ? graphData["building"].map(gd => gd.data) : [];
            sumMerged = [].concat.apply([], sumValue);
            let sumOfAllValues = sumMerged.reduce((total, obj) => obj.amount + total, 0);
            let labelValues = graphTypeData && graphTypeData.length ? graphTypeData.map(gd => gd.data) : [];
            let mergedArray = [].concat.apply([], labelValues);
            let uniqueKeys = Object.keys(mergedArray).map(key => mergedArray[key].name);
            let yearValues = [...new Set(graphTypeData && graphTypeData.length ? graphTypeData.map(gd => gd.year) : [])];
            let uniqueYear = yearValues && yearValues.length && yearValues.map(yr => ({ label: yr.toString() }));
            let currentTotal = sumOfAllValues;
            var holder = {};
            let chartValue = [];
            let legendArray = [];
            if (type != "EFCI" && (type == "priority" || type == "trade")) {
                mergedArray &&
                    mergedArray.length &&
                    mergedArray.forEach(function (d) {
                        if (holder.hasOwnProperty(d.name)) {
                            holder[d.name] = holder[d.name] + d.amount;
                        } else {
                            holder[d.name] = d.amount;
                        }
                    });

                for (var prop in holder) {
                    legendArray.push({ name: prop, y: holder[prop] });
                }
            }

            if (type != "priority" && type != "EFCI" && type != "trade") {
                legendArray = [];
                mergedArray.forEach(function (d) {
                    if (holder.hasOwnProperty(d.name)) {
                        holder[d.name] = holder[d.name] + d.amount;
                    } else {
                        holder[d.name] = d.amount;
                    }
                });

                for (var prop in holder) {
                    chartValue.push([prop, holder[prop]]);
                    legendArray.push({ name: prop, y: holder[prop] });
                }

                dataSource = {
                    chart: {
                        type: "pie",
                        backgroundColor: "#FFFFFF",
                        // width: 800,
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        },
                        style: {
                            fontFamily: "Poppins, sans-serif"
                        }
                    },

                    navigation: {
                        buttonOptions: {
                            theme: {
                                "stroke-width": 1,
                                stroke: "silver",
                                r: 0,
                                states: {
                                    hover: {
                                        fill: "#bada55"
                                    },
                                    select: {
                                        stroke: "#039",
                                        fill: "#bbadab"
                                    }
                                }
                            }
                        }
                    },
                    // colors: ['#2E86C1 ', '#9B59B6  ', '#53B5F7 ', '#27AE60 ', '#CB4335 ', '#64E572',
                    //     '#FF9655', '#FFF263', '#6AF9C4'],
                    title: {
                        text: ""
                    },
                    accessibility: {
                        point: {
                            valueSuffix: "%"
                        }
                    },

                    tooltip: {
                        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
                    },
                    plotOptions: {
                        pie: {
                            innerSize: 0,
                            allowPointSelect: true,
                            cursor: "pointer",
                            depth: 30,
                            showInLegend: true,
                            backgroundColor: "#FFFFFF",
                            dataLabels: {
                                enabled: true,
                                format: "{point.name}"
                            },
                            showInLegend: this.props.dataView == "region" || this.props.dataView == "project" ? false : true,
                            legend: {
                                enabled: this.props.dataView == "region" || this.props.dataView == "project" ? false : true
                            }
                            // point: {
                            //     events: {
                            //         legendItemClick: (event) => {
                            //             if (event.target.visible) {
                            //                 currentTotal = currentTotal - event.target.options.y
                            //                 legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name)
                            //             }
                            //             else {
                            //                 currentTotal = currentTotal + event.target.options.y
                            //                 legendArray.push(event.target.options)
                            //             }
                            //             this.setState({
                            //                 totalAmount: currentTotal,
                            //                 legendValues: legendArray
                            //             })

                            //         }
                            //     }
                            // },
                        }
                    },
                    series: [
                        {
                            slicedOffset: 50,
                            // borderColor: 'white',
                            data: chartValue,
                            animation: false
                        }
                    ]
                };
                let rtrnValue = {
                    dataSource,
                    chartValues: legendArray,
                    currentTotal
                };
                return rtrnValue;
            } else if (type == "priority" || type == "trade") {
                let data = [];
                var holder = {};
                graphTypeData &&
                    graphTypeData.length &&
                    graphTypeData.map(gd => {
                        return data.push({ name: gd.name });
                    });
                mergedArray &&
                    mergedArray.length &&
                    mergedArray.forEach(function (d) {
                        if (holder.hasOwnProperty(d.name)) {
                            holder[d.name] = [...holder[d.name], d.amount];
                        } else {
                            holder[d.name] = [d.amount];
                        }
                    });
                var chartValues = [];

                for (var prop in holder) {
                    chartValues.push({ name: prop, data: holder[prop] });
                }
                dataSource = {
                    chart: {
                        type: "column",
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            viewDistance: 25,
                            depth: 40
                        },
                        backgroundColor: "#FFFFFF",
                        style: {
                            fontFamily: "Poppins, sans-serif"
                        }
                    },

                    title: {
                        text: ""
                    },

                    xAxis: {
                        categories: yearValues,
                        labels: {
                            skew3d: true,
                            style: {
                                fontSize: "12px"
                            }
                        }
                    },

                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: "",
                            skew3d: true
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: "bold",
                                // format: '$ {point.y:.1f}',
                                color:
                                    // theme
                                    (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray"
                            },
                            formatter: function () {
                                return "$" + (this.total / 1000000).toFixed(2) + "M";
                            }
                            // borderRadius: 2,
                            // backgroundColor: '#edf2f6',
                            // borderWidth: 1,
                            // borderColor: '#AAA',
                            // y: -5
                        }
                    },

                    tooltip: {
                        headerFormat: "<b>{point.key}</b><br>",
                        pointFormat: `<span style="color:{series.color}">\u25CF</span> {series.name}: $ {point.y} `
                    },
                    labels: {
                        formatter: function () {
                            return Highcharts.numberFormat(this.value, 2, ",", " ");
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: "normal",
                            depth: 40,
                            showInLegend: true
                        }
                        // series: {
                        //     events: {
                        //         legendItemClick: (event) => {
                        //             var sumOfCurrentLegend = event.target.yData.reduce(function (a, b) {
                        //                 return a + b;
                        //             }, 0);

                        //             if (event.target.visible) {
                        //                 currentTotal = currentTotal - sumOfCurrentLegend
                        //                 legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name)

                        //             }
                        //             else {
                        //                 currentTotal = currentTotal + sumOfCurrentLegend
                        //                 legendArray.push({ name: event.target.options.name, y: sumOfCurrentLegend })
                        //                 let l = legendArray.length, flags = [], output = []
                        //                 for (let i = 0; i < l; i++) {
                        //                     if (flags[legendArray[i].name]) continue;
                        //                     flags[legendArray[i].name] = true;
                        //                     output.push({ name: legendArray[i].name, y: legendArray[i].y });
                        //                 }
                        //                 legendArray = output

                        //             }

                        //             this.setState({
                        //                 totalAmount: currentTotal,
                        //                 legendValues: legendArray

                        //             })
                        //         }
                        //     }
                        // }
                    },
                    series: chartValues,
                    legend: {
                        enabled: this.props.dataView == "region" || this.props.dataView == "project" ? false : true
                    }
                };
                let rtrnValue = {
                    dataSource,
                    chartValues: legendArray,
                    currentTotal
                };
                return rtrnValue;
            } else if (type == "EFCI") {
                let barChartData = [];
                let lineChartValue = [];
                let legendArray = [];

                let sum = 0;
                let year = this.props.endYear;
                if (capital_spending_plans && capital_spending_plans.length) {
                    barChartData = capital_spending_plans.map(am => parseInt(am.amount));
                    sum = capital_spending_plans.reduce((total, obj) => parseInt(obj.amount) + total, 0);
                    legendArray.push({ name: "CSP", amount: sum });

                    // if (filterView == "csp" || filterView == "both") {
                    //     sum = capital_spending_plans.reduce((total, obj) => parseInt(obj.amount) + total, 0)
                    //     legendArray.push({ name: "CSP", amount: sum })
                    //     this.setState({
                    //         legendArrayFunding: legendArray,
                    //     })
                    // }
                }

                let yearValues = [
                    ...new Set(capital_spending_plans && capital_spending_plans.length ? capital_spending_plans.map(gd => gd.year) : [])
                ];
                funding_options.map((fo, key) => {
                    legendArray.push({
                        name: fo.index,
                        order: fo.order,
                        amount: fo.annual_funding_options.reduce((total, obj) => parseFloat(obj.amount) + total, 0)
                    });
                });

                if (funding_options && funding_options.length) {
                    lineChartValue = funding_options.map((fo, key) => {
                        return {
                            name: fo.index,
                            type: "spline",
                            annual_funding_options: fo.annual_funding_options && fo.annual_funding_options.map(am => parseFloat(am.amount)),
                            actual_cost: fo.actual_cost,
                            funding_cost: fo.funding_cost,
                            order: fo.order,
                            data: fo.annual_efcis && fo.annual_efcis.map(am => parseFloat(am.value)),
                            plotOptions: {
                                line: {
                                    marker: {
                                        enabled: false
                                    }
                                },
                                label: {
                                    style: {
                                        color: "black"
                                    }
                                },
                                series: {
                                    enableMouseTracking: false
                                }
                            },

                            marker: {
                                enabled: false,
                                fillColor: this.renderColors(key)
                            },
                            lineWidth: 3,
                            lineColor: this.renderColors(key),
                            crosshair: true,
                            label: {
                                style: {
                                    align: "end",
                                    fontSize: "1.0em",
                                    fontFamily: "Poppins, sans-serif"
                                },
                                formatter: function () {
                                    var tooltip = "";
                                    tooltip +=
                                        '<div style="color:black;background-color:' +
                                        this.color +
                                        ' !important">FO ' +
                                        this.options.order +
                                        " : " +
                                        this.yData[this.yData.length - 1] +
                                        "</div>";
                                    return tooltip;
                                }
                            },
                            tooltip: {
                                shared: true
                            }
                        };
                    });
                }
                let barData = [];
                barData = [
                    {
                        type: "column",
                        stack: 1,
                        yAxis: 1,

                        events: {
                            // legendItemClick: (event) => {
                            //     if (event.target.visible) {
                            //         legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name)
                            //     }
                            //     else {
                            //         sum = event.target.options.data.reduce((total, obj) => obj + total, 0)
                            //         legendArray.push({ name: event.target.options.name, amount: sum })
                            //     }
                            //     this.setState({
                            //         legendArrayFunding: legendArray,
                            //     })

                            // },
                            load() {
                                let chart = this,
                                    pointWidth = chart.series[0].points[0].pointWidth;

                                chart.container.addEventListener("mousemove", function (event) {
                                    chart.series[0].points.forEach(point => {
                                        if (
                                            event.chartX > point.plotX + chart.plotLeft - pointWidth / 2 &&
                                            event.chartX < point.plotX + point.pointWidth / 2 + chart.plotLeft
                                        ) {
                                            point.series.chart.tooltip.refresh(point);
                                        }
                                    });
                                });
                            }
                        },
                        data: barChartData,
                        name: "CSP",
                        tooltip: {
                            valuePrefix: "$ "
                        }
                    },
                    ...lineChartValue
                ];
                dataSource = {
                    chart: {
                        backgroundColor: "#fff",
                        plotBackgroundColor: "#fcffc5"
                    },
                    title: {
                        text: ""
                    },
                    chart: {
                        zoomType: "Xy"
                    },
                    xAxis: [
                        {
                            categories: yearValues,
                            crosshair: true,
                            labels: {
                                style: {
                                    fontSize: "1.1em",
                                    fontFamily: "Poppins, sans-serif"
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            title: {
                                text: ""
                            },
                            labels: {
                                format: "{value} ",
                                style: {
                                    fontSize: "1.1em",
                                    fontFamily: "Poppins, sans-serif",
                                    fontWeight: "500px"
                                }
                            },
                            opposite: true,
                            crosshairs: false

                            // stackLabels: {
                            //     enabled: true,
                            // }
                            // crosshair: true
                        },
                        {
                            labels: {
                                format: "$ {value}",
                                style: {
                                    fontSize: "1.1em",
                                    fontFamily: "Poppins, sans-serif"
                                },
                                allowDecimals: true,
                                formatter: function () {
                                    return this.value / 1000000 + "M";
                                }
                            },
                            title: {
                                text: "",
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            stackLabels: {
                                enabled: true,
                                enabled: true,
                                style: {
                                    fontWeight: "bold",
                                    fontFamily: "Poppins, sans-serif",
                                    color:
                                        // theme
                                        (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray"
                                },
                                formatter: function () {
                                    return "$" + (this.total / 1000000).toFixed(2) + "M";
                                }
                                // borderRadius: 2,
                                // backgroundColor: '#edf2f6',
                                // borderWidth: 1,
                                // borderColor: '#AAA',
                                // y: -5
                            }
                            // crosshair: true
                        }
                    ],
                    plotOptions: {
                        column: {
                            stacking: "normal",
                            states: {
                                inactive: {
                                    enabled: false
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: this.props.dataView == "region" || this.props.dataView == "project" ? false : true,
                        fontSize: "1.1em",
                        fontFamily: "Poppins, sans-serif"
                    },
                    colors: ["#2E86C1 ", "#E41C1C ", "#EE6B0B ", "#F2D205", "#6A8F3F", "#27AE60 "],
                    tooltip: {
                        shared: true,
                        //  followPointer: true,
                        //                 positioner: function(boxWidth, boxHeight, point) {
                        //      return {x:point.plotX + 10, y:point.plotY - 10
                        //   }
                        // },
                        // positioner: function (labelWidth, labelHeight, point) {
                        //     var x;
                        //     if (point.plotX - labelWidth / 1 > 0) {
                        //         x = point.plotX - labelWidth / 1;
                        //     } else {
                        //         x = 0
                        //     }
                        //     return {
                        //         x: point.plotX, y: -110
                        //     }
                        // },
                        style: {
                            fontSize: "1.2em",
                            fontFamily: "Poppins, sans-serif",
                            backgroundColor: "black",
                            borderColor: "black",
                            borderRadius: 10,
                            borderWidth: 3
                        },
                        formatter: function () {
                            var s = "<b>" + this.x + "</b>";
                            this.points.map((point, key) => {
                                let currentIndex = point.series.userOptions.data.indexOf(point.y);
                                let amount = 0;
                                if (point.series.userOptions.annual_funding_options) {
                                    amount = Highcharts.numberFormat(point.series.userOptions.annual_funding_options[currentIndex], 0, ".", ",");
                                }
                                return (s +=
                                    "<br/><b>" +
                                    point.series.name +
                                    " : </b> " +
                                    `${point.series.userOptions.annual_funding_options ? `$ ${amount} / ` : ""}` +
                                    `${point.series.name === "CSP" ? `$ ${Highcharts.numberFormat(point.y, 0, ".", ",")}` : point.y}`);
                            });

                            return s;
                        }
                    },
                    series: barData
                };
                let rtrnValue = {
                    dataSource,
                    legendArray
                };
                return rtrnValue;
            }
        }
    };

    renderHeading = type => {
        switch (type) {
            case "Monthly_Electricity_Cost":
                return "Current Entity Monthly Electricity Cost";
            case "Monthly_Electricity_Usage":
                return "Current Entity Monthly Electricity Usage (MMBTU)";
            case "Monthly_Gas_Cost":
                return "Current Entity Monthly Gas Cost ($)";
            case "Monthly_Gas_Usage ":
                return "Current Entity Monthly Gas Usage (MMBTU)";
            case "Monthly_Energy_Cost":
                return "Current Entity Monthly Total Energy Cost ($)";
            case "Monthly_Energy_Usage ":
                return "Current Entity Monthly Total Energy Usage (MMBTU)";
            case "Cooling_Degree_Days":
                return "Cooling Degree Days";
            case "Heating_Degree_Days":
                return "Heating Degree Days";
        }
    };

    render() {
        const { chartArray, dataSource, totalAmount, legendValues, legendArrayFunding } = this.state;
        const { graphData } = this.props;
        var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

        console.log(chartArray, dataSource, totalAmount, legendValues, legendArrayFunding);

        return (
            <div className={isFullscreen ? "chart-area chart-coming-soon fln-src" : "chart-area chart-coming-soon"} id={"dashboard"}>
                <div className="chart-ground">
                    {chartArray && chartArray.length
                        ? chartArray.map((ca, key) => {
                              return (
                                  <div className="col-md-4 cursor-pointer " key={key}>
                                      <LoadingOverlay
                                          active={this.props.isLoading || (this.props.isLoadingEFCI && ca == "EFCI")}
                                          spinner={<Loader />}
                                          fadeSpeed={10}
                                      >
                                          <div className="box-order">
                                              {ca != "EFCI" ? (
                                                  this.renderChart(ca).dataSource.series &&
                                                  this.renderChart(ca).dataSource.series.length &&
                                                  this.renderChart(ca).dataSource.series[0] &&
                                                  this.renderChart(ca).dataSource.series[0].data &&
                                                  this.renderChart(ca).dataSource.series[0].data.length ? (
                                                      <>
                                                          <div onClick={() => this.props.handleChartView(ca)}>
                                                              <HighchartsReact
                                                                  highcharts={Highcharts}
                                                                  options={this.renderChart(ca).dataSource}
                                                                  allowChartUpdate
                                                                  containerProps={{ style: { height: "300px", width: "100%" } }}
                                                              />
                                                          </div>
                                                          <div className="chart-footer">
                                                              <div className="row ">
                                                                  <div clas="col-md-12">
                                                                      <button className="btn btn-more" data-toggle="collapse" data-target={`#chart`}>
                                                                          <img src="/img/down-arrow.svg" />
                                                                      </button>
                                                                  </div>
                                                              </div>
                                                              <div className="row collapse" id={`chart`}>
                                                                  <div className="col-md-12">
                                                                      <div className="result-list">
                                                                          <ul>
                                                                              {this.renderChart(ca) &&
                                                                              this.renderChart(ca).chartValues &&
                                                                              this.renderChart(ca).chartValues.length
                                                                                  ? this.renderChart(ca).chartValues.map((cv, i) => {
                                                                                        return (
                                                                                            <li key={i}>
                                                                                                <div className="otr">
                                                                                                    <strong>{cv.name}</strong>

                                                                                                    <p>
                                                                                                        <NumberFormat
                                                                                                            value={parseFloat(cv.y / 1000000).toFixed(
                                                                                                                2
                                                                                                            )}
                                                                                                            thousandSeparator={true}
                                                                                                            displayType={"text"}
                                                                                                            suffix={"M"}
                                                                                                            prefix={"$ "}
                                                                                                        />
                                                                                                        -
                                                                                                        {cv.y
                                                                                                            ? Number(
                                                                                                                  (
                                                                                                                      (cv.y /
                                                                                                                          (this.renderChart(ca)
                                                                                                                              .currentTotal
                                                                                                                              ? this.renderChart(ca)
                                                                                                                                    .currentTotal
                                                                                                                              : 1)) *
                                                                                                                      100
                                                                                                                  ).toFixed(1)
                                                                                                              )
                                                                                                            : 0}
                                                                                                        %
                                                                                                    </p>
                                                                                                </div>
                                                                                            </li>
                                                                                        );
                                                                                    })
                                                                                  : null}
                                                                          </ul>
                                                                      </div>
                                                                  </div>
                                                                  {/* <div class="col-md-12">
                                                    <div class="result-total"><strong>TOTAL =<span> <NumberFormat
                                                        value={parseInt(
                                                            this.renderChart(ca).currentTotal ? this.renderChart(ca).currentTotal : 0.00
                                                        )}
                                                        thousandSeparator={true}
                                                        displayType={"text"}
                                                        prefix={"$ "}
                                                    /> </span></strong></div>
                                                </div> */}
                                                              </div>
                                                          </div>
                                                      </>
                                                  ) : (
                                                      <div className="coming-soon no-data">
                                                          <div className="coming-soon-img">
                                                              <img src="/img/no-data.svg" />
                                                          </div>
                                                          <div className="coming-txt">
                                                              <h3>NO DATA FOUND</h3>
                                                              <h4>There is no data to show you right now!!!</h4>
                                                          </div>
                                                      </div>
                                                  )
                                              ) : // <>{(this.props.dataView == "region" || this.props.dataView == "project") ? <div className="table-topper efc-topr ">
                                              //     <div class="coming-soon">
                                              //         <div class="coming-soon-img">
                                              //             <img src="/img/coming-soon.svg" />
                                              //         </div>
                                              //         <h3>COMING SOON</h3>
                                              //         <h4>This feature will be comming soon....
                                              //      </h4>
                                              //     </div>
                                              // </div> :
                                              this.renderChart(ca).dataSource.series &&
                                                this.renderChart(ca).dataSource.series.length &&
                                                this.renderChart(ca).dataSource.series &&
                                                this.renderChart(ca).dataSource.series[0].data &&
                                                this.renderChart(ca).dataSource.series[0].data.length ? (
                                                  <>
                                                      <div onClick={() => this.props.handleChartView(ca)}>
                                                          {this.renderChart(ca).dataSource.series && this.renderChart(ca).dataSource.series.length ? (
                                                              <HighchartsReact
                                                                  highcharts={Highcharts}
                                                                  options={this.renderChart(ca).dataSource}
                                                                  allowChartUpdate
                                                                  containerProps={{ style: { height: "300px", width: "100%" } }}
                                                              />
                                                          ) : null}
                                                      </div>
                                                      <div className="chart-footer">
                                                          <div className="row ">
                                                              <div className="col-md-12">
                                                                  <button className="btn btn-more" data-toggle="collapse" data-target={`#chart`}>
                                                                      <img src="/img/down-arrow.svg" />
                                                                  </button>
                                                              </div>
                                                          </div>
                                                          <div className="row collapse" id={`chart`}>
                                                              <div className="col-md-12">
                                                                  <div className="result-list">
                                                                      <ul>
                                                                          {this.renderChart(ca) &&
                                                                          this.renderChart(ca).legendArray &&
                                                                          this.renderChart(ca).legendArray.length
                                                                              ? this.renderChart(ca).legendArray.map(cv => {
                                                                                    return (
                                                                                        <li>
                                                                                            <div className="otr">
                                                                                                <strong>{cv.name}</strong>

                                                                                                <p>
                                                                                                    <NumberFormat
                                                                                                        value={parseFloat(
                                                                                                            cv.amount / 1000000
                                                                                                        ).toFixed(2)}
                                                                                                        thousandSeparator={true}
                                                                                                        displayType={"text"}
                                                                                                        suffix={"M"}
                                                                                                        prefix={"$ "}
                                                                                                    />
                                                                                                </p>
                                                                                            </div>
                                                                                        </li>
                                                                                    );
                                                                                })
                                                                              : null}
                                                                      </ul>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </>
                                              ) : (
                                                  <div className="coming-soon no-data">
                                                      <div className="coming-soon-img">
                                                          <img src="/img/no-data.svg" />
                                                      </div>
                                                      <div className="coming-txt">
                                                          <h3>NO DATA FOUND</h3>
                                                          <h4>There is no data to show you right now!!!</h4>
                                                      </div>
                                                  </div>
                                              )}

                                              <h3>{this.renderHeading(ca)}</h3>
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
