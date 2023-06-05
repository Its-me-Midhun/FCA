import React, { Component } from "react";
import NumberFormat from "react-number-format";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import LoadingOverlay from "react-loading-overlay";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import LabelModule from "highcharts/modules/series-label";
import GridLight from "highcharts/themes/grid-light";
import Loader from "../../../common/components/Loader";

highchartsMore(Highcharts);
highcharts3d(Highcharts);
GridLight(Highcharts);
LabelModule(Highcharts);

Highcharts.setOptions({
    lang: {
        thousandsSep: ","
        // decimalPoint: '.',
    }
});

class ChartView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            totalAmount: 0,
            legendValues: [],
            legendArrayFunding: [],
            fundingSum: 0,
            state: false,
            isTargetEfci: false,
            loading: true,
            openSection: false,
            hasLoading: false,
            sortKey: "efci_versions.created_at",
            sortOrder: false,
            totalCostData: 0,
            isOpenColorCode: false,
            chartType: this.props.chartType || "pie2d"
        };
    }

    componentDidMount = () => {
        this.setState(
            {
                dataSource: null
            },
            () => this.renderChartData()
        );
        this.setState({
            loading: false
        });
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { graphData } = this.props;

        if (prevProps.graphData !== graphData) {
            this.setState(
                {
                    dataSource: null
                },
                () => this.renderChartData()
            );
        }
    };

    renderChartData = () => {
        const { graphData, chartDetailType } = this.props;
        const { chartType } = this.state;

        let capital_spending_plans = graphData && graphData.capital_spending_plans;
        let funding_options = graphData && graphData.funding_options;
        let labelValues = graphData && graphData.length ? graphData.map(gd => gd.data) : [];
        let mergedArray = [].concat.apply([], labelValues);
        let yearValues = [...new Set(graphData && graphData.length ? graphData.map(gd => gd.year) : [])];
        let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0);
        let currentTotal = sumOfAllValues;
        let holder = {};
        mergedArray.forEach(function (d) {
            if (holder.hasOwnProperty(d.name)) {
                holder[d.name] = holder[d.name] + d.amount;
            } else {
                holder[d.name] = d.amount;
            }
        });
        let chartValue = [];
        for (let prop in holder) {
            chartValue.push({ name: prop, y: holder[prop] });
        }

        this.setState({
            totalAmount: currentTotal,
            legendValues: chartValue
        });
        let legendArray = chartValue;
        holder = {};
        chartValue = [];
        let dataSource = {};

        if (chartDetailType !== "efci" && chartType !== "stackedcolumn2d" && chartType !== "stackedcolumn3d") {
            mergedArray.forEach(function (d) {
                if (holder.hasOwnProperty(d.name)) {
                    holder[d.name] = holder[d.name] + d.amount;
                } else {
                    holder[d.name] = d.amount;
                }
            });

            for (let prop in holder) {
                chartValue.push([prop, holder[prop]]);
            }

            if (chartValue.length) {
                dataSource = {
                    chart: {
                        type: "pie",
                        backgroundColor: "#FFFFFF",
                        options3d: {
                            enabled: chartType === "doughnut3d" || chartType === "pie3d" ? true : false,
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
                            innerSize: chartType === "doughnut2d" || chartType === "doughnut3d" ? 100 : 0,
                            allowPointSelect: true,
                            cursor: "pointer",
                            depth: 70,
                            showInLegend: true,
                            backgroundColor: "#FFFFFF",
                            dataLabels: {
                                enabled: true,
                                format: "{point.name}"
                            },

                            point: {
                                events: {
                                    legendItemClick: event => {
                                        if (event.target.visible) {
                                            currentTotal = currentTotal - event.target.options.y;
                                            legendArray = legendArray && legendArray.filter(l => l.name !== event.target.options.name);
                                        } else {
                                            currentTotal = currentTotal + event.target.options.y;
                                            legendArray.push(event.target.options);
                                        }
                                        this.setState({
                                            totalAmount: currentTotal,
                                            legendValues: legendArray
                                        });
                                    }
                                }
                            }
                        }
                    },
                    series: [
                        {
                            slicedOffset: chartType === "pie3d" || chartType === "doughnut3d" ? 50 : 25,
                            data: chartValue,
                            animation: false
                        }
                    ]
                };
            }
        } else if (chartDetailType !== "efci" && (chartType === "stackedcolumn2d" || chartType === "stackedcolumn3d")) {
            let data = [];

            graphData &&
                graphData.length &&
                graphData.map(gd => {
                    return data.push({ name: gd.name });
                });

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
                        enabled: chartType == "stackedcolumn3d" ? true : false,
                        alpha: 15,
                        beta: 15,
                        viewDistance: 25,
                        depth: 95
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
                            fontSize: "16px"
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
                            color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray"
                        },
                        formatter: function () {
                            return "$" + (this.total / 1000000).toFixed(2) + "M";
                        }
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
                        depth: 90,
                        showInLegend: true
                    },
                    series: {
                        events: {
                            legendItemClick: event => {
                                var sumOfCurrentLegend = event.target.yData.reduce(function (a, b) {
                                    return a + b;
                                }, 0);

                                if (event.target.visible) {
                                    currentTotal = currentTotal - sumOfCurrentLegend;
                                    legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name);
                                } else {
                                    currentTotal = currentTotal + sumOfCurrentLegend;
                                    legendArray.push({ name: event.target.options.name, y: sumOfCurrentLegend });
                                    let l = legendArray.length,
                                        flags = [],
                                        output = [];
                                    for (let i = 0; i < l; i++) {
                                        if (flags[legendArray[i].name]) continue;
                                        flags[legendArray[i].name] = true;
                                        output.push({ name: legendArray[i].name, y: legendArray[i].y });
                                    }
                                    legendArray = output;
                                }

                                this.setState({
                                    totalAmount: currentTotal,
                                    legendValues: legendArray
                                });
                            }
                        }
                    }
                },
                series: chartValues
            };
        } else {
            let barChartData = [];
            let lineChartValue = [];
            let legendArray = [];
            let sum = 0;
            if (capital_spending_plans && capital_spending_plans.length) {
                barChartData = capital_spending_plans.map(am => parseInt(am.amount));
                sum = capital_spending_plans.reduce((total, obj) => parseInt(obj.amount) + total, 0);
                legendArray.push({ name: "CSP", amount: sum });
                this.setState({
                    legendArrayFunding: legendArray
                });
            }
            let yearValues = [...new Set(capital_spending_plans && capital_spending_plans.length ? capital_spending_plans.map(gd => gd.year) : [])];
            funding_options.map((fo, key) => {
                legendArray.push({
                    name: fo.index,
                    order: fo.order,
                    amount: fo.annual_funding_options.reduce((total, obj) => parseFloat(obj.amount) + total, 0)
                });
            });
            this.setState({
                legendArrayFunding: legendArray
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
                        color: this.renderColors(key),
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
                                let tooltip = "";
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
                        },
                        events: {
                            legendItemClick: event => {
                                if (event.target.visible) {
                                    legendArray = legendArray && legendArray.filter(l => l.name !== event.target.options.name);
                                } else {
                                    let isValue = legendArray && legendArray && legendArray.find(la => la.name === event.target.options.name);
                                    if (!isValue) {
                                        legendArray.push({
                                            name: event.target.options.name,
                                            amount: event.target.options.annual_funding_options.reduce((total, obj) => parseFloat(obj) + total, 0)
                                        });
                                    }
                                }
                                this.setState({
                                    legendArrayFunding: legendArray
                                });
                            }
                        }
                    };
                });
            }

            sum = legendArray && legendArray.length ? legendArray.reduce((total, obj) => obj.amount + total, 0) : 0.0;

            let barData = [];
            this.setState({
                fundingSum: sum
            });

            barData = [
                {
                    type: "column",
                    stack: 1,
                    yAxis: 1,

                    events: {
                        legendItemClick: event => {
                            if (event.target.visible) {
                                legendArray = legendArray && legendArray.filter(l => l.name !== event.target.options.name);
                            } else {
                                let isValue = legendArray && legendArray && legendArray.find(la => la.name === event.target.options.name);
                                if (!isValue) {
                                    sum = event.target.options.data.reduce((total, obj) => obj + total, 0);
                                    legendArray.push({ name: event.target.options.name, amount: sum });
                                }
                            }
                            this.setState({
                                legendArrayFunding: legendArray
                            });
                        },
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
                    zoomType: "Xy",
                    type: "column",
                    options3d: {
                        enabled: chartType === "stackedcolumn3d" ? true : false,
                        alpha: 15,
                        beta: 15,
                        viewDistance: 25,
                        depth: 95
                    },
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
                            style: {
                                fontWeight: "bold",
                                fontFamily: "Poppins, sans-serif",
                                color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray"
                            },
                            formatter: function () {
                                return "$" + (this.total / 1000000).toFixed(2) + "M";
                            }
                        }
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
                colors: ["#2E86C1 ", "#E41C1C ", "#EE6B0B ", "#F2D205", "#6A8F3F", "#27AE60 "],
                tooltip: {
                    shared: true,
                    positioner: function (labelWidth, labelHeight, point) {
                        let x;
                        if (point.plotX - labelWidth / 1 > 0) {
                            x = point.plotX - labelWidth / 1;
                        } else {
                            x = 0;
                        }
                        return {
                            x: point.plotX,
                            y: -110
                        };
                    },
                    style: {
                        fontSize: "1.2em",
                        fontFamily: "Poppins, sans-serif",
                        backgroundColor: "black",
                        borderColor: "black",
                        borderRadius: 10,
                        borderWidth: 3,
                        zIndex: 9999
                    },
                    formatter: function () {
                        let s = "<b>" + this.x + "</b>";
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
                legend: {
                    height: "27px",
                    width: "600px",
                    padding: 12,
                    symbolPadding: 7,
                    itemMarginLeft: 4,
                    formatter: function () {
                        for (let i = 0; i < this.barDatachart.series.length; i++) {
                            this.chart.series[i].legendItem.attr({
                                translateX: -10
                            });
                        }
                    }
                },
                series: barData
            };
        }
        this.setState({
            dataSource
        });
    };

    renderColors = key => {
        // eslint-disable-next-line default-case
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

    handleChart = async e => {
        const { updateChartType = null } = this.props;
        await this.setState({
            chartType: e.target.value,
            totalAmount: 0
        });
        if (updateChartType) {
            updateChartType(this.state.chartType);
        }
        this.renderChartData();
    };

    renderOptions = () => {
        const { chartDetailType } = this.props;
        if (chartDetailType !== "efci") {
            return (
                <>
                    <option value="pie2d">Pie Chart 2D</option>
                    <option value="doughnut2d">Dounut Chart 2D</option>
                    <option value="pie3d">Pie Chart3D</option>
                    <option value="doughnut3d">Dounut Chart 3D</option>
                    <option value="stackedcolumn2d">Stackedcolumn Chart 2D</option>
                    <option value="stackedcolumn3d">Stackedcolumn Chart 3D</option>
                </>
            );
        } else {
            return (
                <>
                    <option value="stackedcolumn2d">Stackedcolumn Chart 2D</option>
                    <option value="stackedcolumn3d">Stackedcolumn Chart 3D</option>
                </>
            );
        }
    };

    render() {
        const { graphData, chartDetailType, chartName, projectName, isLoading, isChartBand } = this.props;
        const { dataSource, totalAmount, legendValues, legendArrayFunding, chartType } = this.state;
        let capital_spending_plans = graphData && graphData.capital_spending_plans;

        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                {chartDetailType !== "efci" ? (
                    <div className="">
                        {!isChartBand ? (
                            <div className="report-chart-dd">
                                <div className="selecbox-otr">
                                    <label>Chart Type</label>
                                    <div className="custom-selecbox m-1">
                                        <select onChange={e => this.handleChart(e)} value={chartType}>
                                            {this.renderOptions()}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <div className={`chart-area`}>
                            <div className="chart-ground">
                                <div className="top-hd">
                                    {graphData && graphData.length ? (
                                        <div className="hed-section-gr d-flex">
                                            <h1 className="line">
                                                <span>{projectName || ""}</span>
                                                {chartName || ""}
                                            </h1>
                                        </div>
                                    ) : null}
                                    <div className="chart-img">
                                        {dataSource && dataSource.series && dataSource.series.length && !isLoading ? (
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={dataSource}
                                                containerProps={{ style: { height: "400px", width: "800px" } }}
                                                allowChartUpdate
                                            />
                                        ) : (
                                            <div className="coming-soon no-data">
                                                <div className="coming-soon-img">
                                                    <img src="/img/no-data.svg" alt="" />
                                                </div>
                                                <div className="coming-txt">
                                                    <h3>NO DATA FOUND</h3>
                                                    <h4>There is no data to show you right now!!!</h4>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {dataSource && dataSource.series && dataSource.series.length ? (
                                    <div className="chart-footer">
                                        <div className="row">
                                            <div className="col-md-9 pr-0">
                                                <div className="result-list">
                                                    <ul>
                                                        {legendValues && legendValues.length
                                                            ? legendValues.map(cv => {
                                                                  return (
                                                                      <li>
                                                                          <div className="otr">
                                                                              <strong>{cv.name}</strong>

                                                                              <p>
                                                                                  <NumberFormat
                                                                                      value={parseFloat(cv.y / 1000000).toFixed(2)}
                                                                                      thousandSeparator={true}
                                                                                      displayType={"text"}
                                                                                      suffix={"M"}
                                                                                      prefix={"$ "}
                                                                                  />
                                                                                  - {cv.y ? Number(((cv.y / totalAmount) * 100).toFixed(1)) : 0}%
                                                                              </p>
                                                                          </div>
                                                                      </li>
                                                                  );
                                                              })
                                                            : null}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="result-total">
                                                    <strong>
                                                        TOTAL =
                                                        <NumberFormat
                                                            value={parseFloat((totalAmount ? totalAmount : 1) / 1000000).toFixed(2)}
                                                            suffix={"M"}
                                                            thousandSeparator={true}
                                                            displayType={"text"}
                                                            prefix={"$ "}
                                                        />
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="pb-0">
                        {!isChartBand ? (
                            <div className="report-chart-dd">
                                <div className="selecbox-otr">
                                    <label>Chart Type</label>
                                    <div className="custom-selecbox m-1">
                                        <select onChange={e => this.handleChart(e)} value={chartType}>
                                            {this.renderOptions()}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <div className="row full-height chart-area">
                            <div className="col-md-9 chart-ground reports">
                                {dataSource &&
                                dataSource.series &&
                                dataSource.series.length &&
                                dataSource.series[0].data &&
                                dataSource.series[0].data.length &&
                                capital_spending_plans ? (
                                    <div className="chart-ground">
                                        <div className="top-hd">
                                            <div className="hed-section-gr d-flex">
                                                <h1 className="line">
                                                    <span>{projectName || ""}</span>
                                                    {chartName || ""}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="chart-img left-chart">
                                    {dataSource &&
                                    dataSource.series &&
                                    dataSource.series.length &&
                                    dataSource.series[0].data &&
                                    dataSource.series[0].data.length &&
                                    capital_spending_plans ? (
                                        <HighchartsReact
                                            options={dataSource}
                                            containerProps={{ style: { height: "450px", width: "800px" } }}
                                            allowChartUpdate
                                        />
                                    ) : (
                                        <div className="coming-soon no-data">
                                            <div className="coming-soon-img">
                                                <img src="/img/no-data.svg" alt="" />
                                            </div>
                                            <div className="coming-txt">
                                                <h3>NO DATA FOUND</h3>
                                                <h4>There is no data to show you right now!!!</h4>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {dataSource && dataSource.series && dataSource.series.length ? (
                                    <div className="chart-footer">
                                        <div className="row">
                                            <div className="col-md-12 pr-0">
                                                <div className="result-list">
                                                    <ul>
                                                        {legendArrayFunding && legendArrayFunding.length
                                                            ? legendArrayFunding.map(cv => {
                                                                  return (
                                                                      <li>
                                                                          <div className="otr">
                                                                              <strong>{cv.name}</strong>

                                                                              <p>
                                                                                  <NumberFormat
                                                                                      value={parseFloat(cv.amount / 1000000).toFixed(2)}
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
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </LoadingOverlay>
        );
    }
}

export default ChartView;
