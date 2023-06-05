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
import { Dropdown } from "react-bootstrap";
import ReactToPdf from "react-to-pdf";
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Loader from "../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import InitialFundingOptionSite from "./InitialFundingOptionSite";
import InitialFundingOptionsTable from "../../building/components/InitialFundingOptionsTable";

import ConfirmationModal from "../../common/components/ConfirmationModal";
import EFCILogs from "../../common/components/EFCILogs";
import LogsInfo from "../../common/components/LogsInfo";
import Portal from "../../common/components/Portal";

import moment from "moment";
import ColorCodeData from "../../common/components/ColoCodeData";
import { getExportErrorMessage, thousandsSeparators } from "../../../config/utils";
import * as Service from "../../common/services";
import ReactTooltip from "react-tooltip";
import SelectExportTypeWordModal from "../../common/components/SelectExportTypeWordModal";

highchartsMore(Highcharts);
highcharts3d(Highcharts);
GridLight(Highcharts);
LabelModule(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const options = {
    orientation: "landscape",
    unit: "in",
    format: [4, 2]
};

Highcharts.setOptions({
    lang: {
        thousandsSep: ","
        // decimalPoint: '.',
    }
});

let stylePopUp = {
    position: "absolute",
    transform: "translate3d(909px, 43px, 0px)",
    top: "0px",
    left: "0px",
    willChange: "transform"
    //  will-change: "transform"
};
class ChartView extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    state = {
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
        isOpenColorCode: false,
        isExporting: false,
        showExportTypeModal: false
    };

    componentDidMount = () => {
        const { viewContent, graphData } = this.props;
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
        const { viewContent, graphData } = this.props;
        if (prevProps.graphData != graphData) {
            this.renderChartData();
        }
        if (prevProps.currentTab != this.props.currentTab) {
            this.setState(
                {
                    dataSource: {}
                },
                () => this.renderChartData()
            );
        }
        if (prevProps.chartType != this.props.chartType) {
            this.setState(
                {
                    dataSource: {}
                    // totalAmount: 0
                },
                () => this.renderChartData()
            );
        }
        if (prevProps.viewContent != this.props.viewContent) {
            this.setState(
                {
                    dataSource: {}
                },
                () => this.renderChartData()
            );
        }
    };

    renderChartData = () => {
        const { graphData, viewContent, currentTab, buildingArray, funding_options, capital_spending_plans, filterView, chartType } = this.props;
        let labelValues = graphData && graphData.length ? graphData.map(gd => gd.data) : [];
        let mergedArray = [].concat.apply([], labelValues);
        let uniqueKeys = Object.keys(mergedArray).map(key => mergedArray[key].name);
        let yearValues = [...new Set(graphData && graphData.length ? graphData.map(gd => gd.year) : [])];
        let uniqueYear = yearValues && yearValues.length && yearValues.map(yr => ({ label: yr.toString() }));
        let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0);
        let currentTotal = sumOfAllValues;
        var holder = {};
        mergedArray.forEach(function (d) {
            if (holder.hasOwnProperty(d.name)) {
                holder[d.name] = holder[d.name] + d.amount;
            } else {
                holder[d.name] = d.amount;
            }
        });
        let colorValues = {};
        graphData?.length &&
            graphData.forEach(elem => {
                elem.data.forEach(dat => {
                    if (!colorValues.hasOwnProperty(dat.name)) {
                        colorValues[dat.name] = dat?.color;
                    }
                });
            });
        var chartValue = [];
        for (var prop in holder) {
            // chartValue.push({ name: prop, y: holder[prop] });
            chartValue.push({ name: prop, color: colorValues[prop], y: holder[prop] });
        }

        this.setState({
            totalAmount: currentTotal,
            legendValues: chartValue
        });
        let legendArray = chartValue;
        holder = {};
        chartValue = [];
        let dataSource = {};
        if (viewContent == "totalView" && currentTab != "csp&efci") {
            mergedArray.forEach(function (d) {
                if (holder.hasOwnProperty(d.name)) {
                    holder[d.name] = holder[d.name] + d.amount;
                } else {
                    holder[d.name] = d.amount;
                }
            });

            for (var prop in holder) {
                // chartValue.push([prop, holder[prop]]);
                chartValue.push({ name: prop, color: colorValues[prop], y: holder[prop] });
            }

            if (chartValue.length) {
                dataSource = {
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    chart: {
                        type: "pie",
                        backgroundColor: "#FFFFFF",
                        // width: 800,
                        options3d: {
                            enabled: chartType == "doughnut3d" || chartType == "pie3d" ? true : false,
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

                    // tooltip: {
                    //     pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
                    // },
                    tooltip: {
                        style: {
                            fontSize: "13.5px"
                        },
                        formatter: function () {
                            return `<b>${this.point.name}</b> : ${this.point.percentage.toFixed(1)} %<br><span style="color:${
                                this.color
                            }">\u25CF</span> ${"Cost"}: $ ${thousandsSeparators(this.y)}`;
                        }
                    },
                    plotOptions: {
                        pie: {
                            innerSize: chartType == "doughnut2d" || chartType == "doughnut3d" ? 100 : 0,
                            allowPointSelect: true,
                            cursor: "pointer",
                            depth: 70,
                            showInLegend: true,
                            backgroundColor: "#FFFFFF",
                            dataLabels: {
                                enabled: true,
                                // format: "{point.name}"
                                formatter: function () {
                                    return `<b>${this.point.name}: ${this.point.percentage.toFixed(1)} %</b><br> ${"Cost"}: $ ${thousandsSeparators(
                                        this.y
                                    )}`;
                                }
                            },

                            point: {
                                events: {
                                    legendItemClick: event => {
                                        if (event.target.visible) {
                                            currentTotal = currentTotal - event.target.options.y;
                                            legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name);
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
                            slicedOffset: chartType == "pie3d" || chartType == "doughnut3d" ? 50 : 25,
                            // borderColor: 'white',
                            data: chartValue,
                            animation: false
                        }
                    ]
                };
            }
        } else if (viewContent == "detailView") {
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
                // chartValues.push({ name: prop, data: holder[prop] });
                chartValues.push({ name: prop, color: colorValues[prop], data: holder[prop] });
            }
            dataSource = {
                exporting: { enabled: false },
                credits: { enabled: false },
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
        } else if (currentTab == "csp&efci" && viewContent == "totalView") {
            const { fundingSum, legendArrayFunding } = this.state;
            let barChartData = [];
            let lineChartValue = [];
            let legendArray = [];
            let sum = 0;
            let year = this.props.endYear;
            if (capital_spending_plans && capital_spending_plans.length) {
                barChartData = capital_spending_plans.map(am => parseInt(am.amount));
                if (filterView == "csp" || filterView == "both") {
                    sum = capital_spending_plans.reduce((total, obj) => parseInt(obj.amount) + total, 0);
                    legendArray.push({ name: "CSP", amount: sum });
                    this.setState({
                        legendArrayFunding: legendArray
                    });
                }
            }
            let yearValues = [...new Set(capital_spending_plans && capital_spending_plans.length ? capital_spending_plans.map(gd => gd.year) : [])];
            if (filterView == "efci" || filterView == "both") {
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
            }
            if (funding_options && funding_options.length) {
                lineChartValue = funding_options.map((fo, key) => {
                    return {
                        name: `FO ${fo.order}`,
                        type: "spline",
                        amount: fo.annual_funding_options.reduce((total, obj) => parseFloat(obj.amount) + total, 0),
                        order: fo.order,
                        data: fo.annual_efcis && fo.annual_efcis.map(am => parseFloat(am.value)),
                        color: this.renderColors(key),
                        marker: {
                            enabled: false,
                            fillColor: this.renderColors(key)
                        },
                        lineWidth: 3,
                        lineColor: this.renderColors(key),
                        crosshair: true,
                        tooltip: {
                            shared: true
                        },
                        events: {
                            legendItemClick: event => {
                                if (event.target.visible) {
                                    legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name);
                                } else {
                                    let isValue = legendArray && legendArray && legendArray.find(la => la.name == event.target.options.name);
                                    console.log("isValue-->", isValue);
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
            if (filterView == "both") {
                barData = [
                    {
                        type: "column",
                        stack: 1,
                        yAxis: 1,

                        events: {
                            legendItemClick: event => {
                                if (event.target.visible) {
                                    legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name);
                                } else {
                                    let isValue = legendArray && legendArray && legendArray.find(la => la.name == event.target.options.name);
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
            } else if (filterView == "efci") {
                barData = [...lineChartValue];
            } else {
                barData = [
                    {
                        type: "column",

                        stack: 1,
                        yAxis: 1,
                        events: {
                            legendItemClick: event => {
                                if (event.target.visible) {
                                    legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name);
                                } else {
                                    let isValue = legendArray && legendArray && legendArray.find(la => la.name == event.target.options.name);
                                    if (!isValue) {
                                        sum = event.target.options.data.reduce((total, obj) => obj + total, 0);
                                        legendArray.push({ name: event.target.options.name, amount: sum });
                                    }
                                }
                                this.setState({
                                    legendArrayFunding: legendArray
                                });
                            }
                        },
                        data: barChartData,

                        tooltip: {
                            valuePrefix: "$ "
                        }
                    }
                ];
            }
            dataSource = {
                title: {
                    text: ""
                },
                chart: {
                    zoomType: "Xy"
                },
                exporting: { enabled: false },
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
                        },
                        color: "#003F2D"
                    },
                    spline: {
                        enableMouseTracking: true,
                        label: {
                            enabled: true,
                            minFontSize: "12px",
                            connectorAllowed: true,
                            connectorNeighbourDistance: 5,
                            formatter: function () {
                                var tooltip = "";
                                tooltip += `<span style="color:${this.color};background-color:${this.color} !important">
                                        ${this.yData[this.yData.length - 1]}
                                        </span>`;
                                return tooltip;
                            },
                            style: {
                                fontWeight: "bold",
                                // align: "end",
                                fontSize: "1.0em",
                                fontFamily: "Poppins, sans-serif",
                                useHTML: true
                            }
                        }
                    }
                },
                colors: ["#2E86C1 ", "#E41C1C ", "#EE6B0B ", "#F2D205", "#6A8F3F", "#27AE60 "],
                tooltip: {
                    shared: true,
                    //  followPointer: true,
                    //                 positioner: function(boxWidth, boxHeight, point) {
                    //      return {x:point.plotX + 10, y:point.plotY - 10
                    //   }
                    // },
                    positioner: function (labelWidth, labelHeight, point) {
                        var x;
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
                legend: {
                    // fontSize: "1.1em",
                    fontFamily: "Poppins, sans-serif",
                    height: "27px",
                    width: "600px",
                    padding: 12,
                    symbolPadding: 7,
                    itemMarginLeft: 4,
                    formatter: function () {
                        for (var i = 0; i < this.barDatachart.series.length; i++) {
                            this.chart.series[i].legendItem.attr({
                                translateX: -10
                            });
                        }
                    },
                    labelFormatter: function () {
                        if (this.name === "CSP") {
                            return `${this.name}`;
                        } else {
                            let amountStr = `$ ${(this.options?.amount / 1000000).toFixed(2)} M`;
                            return `${amountStr} ${this.name}`;
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
        switch (key) {
            case 0:
                return "#FF0000";
            case 1:
                return "#F58220";
            case 2:
                return "#FFDD00";
            case 3:
                return "#00A657";
            default:
                return "";
        }
    };

    handleChart = e => {
        this.setState(
            {
                chartType: e.target.value,
                totalAmount: 0
                // legendValues: []
            },
            () => this.renderChartData()
        );
    };

    renderOptions = chartType => {
        if (chartType === "totalView") {
            return (
                <>
                    <option value="pie2d">Pie Chart 2D</option>
                    <option value="doughnut2d">Donut Chart 2D</option>
                    <option value="pie3d">Pie Chart3D</option>
                    <option value="doughnut3d">Donut Chart 3D</option>
                </>
            );
        } else if (chartType === "detailView") {
            return (
                <>
                    <option value="stackedcolumn2d">Chart 2D</option>
                    <option value="stackedcolumn3d">Chart 3D</option>
                </>
            );
        }
    };

    toggleFullscreen = event => {
        var dropdown = document.getElementById("selectDropdown");
        var element = document.getElementById("chartItem");

        var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        if (event instanceof HTMLElement) {
            element = event;
        }

        element.requestFullScreen =
            element.requestFullScreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            function () {
                return false;
            };
        document.cancelFullScreen =
            document.cancelFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            function () {
                return false;
            };

        if (isFullscreen) {
            document.cancelFullScreen();
        } else {
            element.requestFullScreen();
        }
        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
    };

    printDiv = event => {
        var originalContentsBackup = document.body.innerHTML;

        var dropdown = document.getElementById("dropdown-basic");
        var dropdownMenu = document.getElementById("dropdown-menu");
        dropdownMenu.remove();
        dropdown.remove();
        var printContents = document.getElementById("chartItem").innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        if (event instanceof HTMLElement) {
            originalContentsBackup = event;
        }
        document.body.innerHTML = originalContentsBackup;
    };

    showTarget = () => {
        const { isTargetEfci } = this.state;
        this.setState({
            isTargetEfci: !isTargetEfci
        });
    };

    // componentDidUpdate=prevState=>{
    //     console.log("popUp:Update",prevState.isTargetEfci,this.state.isTargetEfci)
    //     if(prevState.isTargetEfci!=this.state.isTargetEfci){
    //         var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
    //         console.log("popUp",isFullscreen)
    //         if( this.state.isTargetEfci){
    //             let popUp=document.querySelector('.fade show')
    //                             var element = document.getElementById('chartBody');
    //                             console.log("popUp:Element",popUp)
    //                             // popUp && element.appendChild(popUp);
    //         }
    //     }

    // }

    convertToImage = (imgType, noOfYears) => {
        this.setState({ isExporting: true });
        let self = this;
        const { projectData } = this.props;
        let userName = localStorage.getItem("user");
        let name = `${projectData && projectData.project_name ? `${projectData.project_name}-` : ""}${
            projectData && projectData.name
        } ${noOfYears}-Year CS By ${this.renderTypeHeading(this.props.currentTab)}-${userName}-${moment().format("MM_DD_YYYY HH_mm_ss")}`;
        if (imgType == "jpeg") {
            htmlToImage.toJpeg(document.getElementById("chartItem"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.jpeg`;
                link.href = dataUrl;
                link.click();
                self.setState({ isExporting: false });
                // document.body.innerHTML = originalContentsBackup;
            });
        } else if (imgType == "png") {
            htmlToImage.toPng(document.getElementById("chartItem"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.png`;
                link.href = dataUrl;
                link.click();
                self.setState({ isExporting: false });
                // document.body.innerHTML = originalContentsBackup;
            });
        } else if (imgType == "svg") {
            function filter(node) {
                return node.tagName !== "i";
            }
            htmlToImage.toSvgDataURL(document.getElementById("chartItem"), { filter: filter }, { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = "chart.svg";
                link.href = dataUrl;
                link.click();
                self.setState({ isExporting: false });
            });
        }
    };

    printDocument = () => {
        const input = document.getElementById("chartItem");
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            // pdf.scaleFactor = 2;
            pdf.addImage(imgData, "JPEG", 0, 0);
            // pdf.output('dataurlnewwindow');
            pdf.save("download.pdf");
        });
    };

    handleHideFundingOptions = async id => {
        let tempList = this.props.hiddenFundingOptionList;
        if (tempList.includes(id)) {
            tempList = tempList.filter(item => item !== id);
        } else {
            tempList.push(id);
        }
        await this.props.updateHiddenFundingOption(tempList);
    };

    lockIcon(basicDetails) {
        return (
            <div className={`${basicDetails === true ? "locking-center locked" : "locking-center unlocked"}`}>
                <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsxlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="20px"
                    height="23.759px"
                    viewBox="0 0 20 23.759"
                    enable-background="new 0 0 20 23.759"
                    xmlspace="preserve"
                >
                    <g>
                        <path
                            fill="#FFFFFF"
                            d="M5.883,7.534c0,0.008,0.002,0.015,0.002,0.021c0.003-2.528,1.962-4.6,4.37-4.615
		c2.407-0.016,4.392,2.029,4.424,4.558c0-0.007,0.002-0.014,0.002-0.021l0.018,2.944l2.8-0.019l-0.018-2.944H17.48
		C17.426,3.308,14.196-0.026,10.238,0C6.28,0.025,3.09,3.402,3.086,7.553H3.083l0.018,2.944l2.8-0.019L5.883,7.534z"
                        />
                        <g>
                            <g>
                                <path
                                    fill="none"
                                    d="M11.597,14.63c0-0.926-0.715-1.677-1.597-1.677c-0.882,0-1.596,0.751-1.596,1.677
				c0,0.728,0.443,1.34,1.059,1.572l-0.967,2.96h3.01l-0.967-2.96C11.154,15.97,11.597,15.357,11.597,14.63z"
                                />
                                <g>
                                    <path
                                        fill="none"
                                        d="M11.597,14.63c0-0.926-0.715-1.677-1.597-1.677c-0.882,0-1.596,0.751-1.596,1.677
					c0,0.728,0.443,1.34,1.059,1.572l-0.967,2.96h3.01l-0.967-2.96C11.154,15.97,11.597,15.357,11.597,14.63z"
                                    />
                                    <path
                                        fill="#FFFFFF"
                                        d="M19.2,10.313h-0.787v0.024H0.618C0.265,10.424,0,10.757,0,11.152v11.766c0,0.462,0.36,0.841,0.8,0.841
					H19.2c0.441,0,0.8-0.379,0.8-0.841V11.152C20,10.69,19.641,10.313,19.2,10.313z M11.505,19.162h-3.01l0.967-2.96
					c-0.616-0.232-1.059-0.845-1.059-1.572c0-0.926,0.714-1.677,1.596-1.677c0.882,0,1.597,0.751,1.597,1.677
					c0,0.728-0.443,1.34-1.059,1.572L11.505,19.162z"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        );
    }

    unlockIcon(basicDetails) {
        return (
            <div className={`${basicDetails === true ? "locking-center un-lck locked" : "locking-center un-lck unlocked"}`}>
                <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsxlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="29.382px"
                    height="23.759px"
                    viewBox="0 0 29.382 23.759"
                    enable-background="new 0 0 29.382 23.759"
                    xmlspace="preserve"
                >
                    <g>
                        <path
                            fill="#FFFFFF"
                            d="M17.509,7.534c0,0.008,0.002,0.015,0.002,0.021c0.003-2.528,1.963-4.6,4.37-4.615s4.392,2.029,4.425,4.558
		c0-0.007,0.002-0.014,0.002-0.021l0.018,2.944l2.801-0.019l-0.018-2.944h-0.003C29.052,3.308,25.821-0.026,21.863,0
		c-3.958,0.025-7.147,3.402-7.152,7.553h-0.003l0.018,2.944l2.801-0.019L17.509,7.534z"
                        />
                        <g>
                            <g>
                                <path
                                    fill="none"
                                    d="M11.597,14.63c0-0.926-0.715-1.677-1.597-1.677s-1.597,0.751-1.597,1.677c0,0.728,0.443,1.34,1.059,1.572
				l-0.967,2.96h3.01l-0.967-2.96C11.153,15.97,11.597,15.357,11.597,14.63z"
                                />
                                <g>
                                    <path
                                        fill="none"
                                        d="M11.597,14.63c0-0.926-0.715-1.677-1.597-1.677s-1.597,0.751-1.597,1.677c0,0.728,0.443,1.34,1.059,1.572
					l-0.967,2.96h3.01l-0.967-2.96C11.153,15.97,11.597,15.357,11.597,14.63z"
                                    />
                                    <path
                                        fill="#FFFFFF"
                                        d="M19.2,10.313h-0.787v0.024H0.618C0.265,10.424,0,10.757,0,11.152v11.766c0,0.462,0.36,0.841,0.8,0.841
					h18.4c0.44,0,0.8-0.379,0.8-0.841V11.152C20,10.69,19.641,10.313,19.2,10.313z M11.505,19.162h-3.01l0.967-2.96
					c-0.615-0.232-1.059-0.845-1.059-1.572c0-0.926,0.715-1.677,1.597-1.677s1.597,0.751,1.597,1.677
					c0,0.728-0.443,1.34-1.059,1.572L11.505,19.162z"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        );
    }

    showLogsTable = async id => {
        this.setState({
            openSection: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getAnnualEfciColumnLogs(id, this.state.sortKey);
        this.setState({ hasLoading: false });
    };

    showLogsTableFunding = async id => {
        this.setState({
            openSection1: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getAnnualFundingCalculationColumnLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    showLogsTableFunding = async id => {
        this.setState({
            openSection1: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getAnnualFundingCalculationColumnLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    showLogsTableFundingOption = async id => {
        const { sortKey } = this.state;
        this.setState({
            openSection2: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getFundingOptionLogs(id, sortKey);
        this.setState({
            hasLoading: false
        });
    };

    showLogsTableFundingEfci = async id => {
        this.setState({
            openSection3: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getFundingEfciLog1(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    showLogsTotalFundingOption = async (id, noOfYears) => {
        await this.setState({
            noOfYears: noOfYears,
            selectedColumnId: id,
            hasLoading: true,
            openSection4: true
        });
        await this.props.getTotalFundingLogs(id, this.state.sortKey);
        this.setState({ hasLoading: false });
    };

    renderFormModal3 = () => {
        const { openSection3 } = this.state;
        if (!openSection3) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.annualEfciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelFundingCostEfciOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingEfci={this.sortFundingEfci}
                        value="value"
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    sortAnnualEfci = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortSiteEfciLog(selectedColumnId, sortKey, 6);
    };

    sortTotalFundingCost = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortSiteEfciLog(selectedColumnId, sortKey, 4);
    };

    showRestorePanelFundingCostEfciOpen = (id, changeSet) => {
        this.setState({
            openFundingCostEfciRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    onCancel = () => {
        this.setState({
            openSection: false,
            openSection1: false,
            openSection2: false,
            openSection3: false,
            openSection4: false,
            openCSP: false,
            openCspPanel: false,
            openFdPanel: false,
            openFdEfci: false,
            openTotalFdEfci: false,
            openAnnualefci: false,
            openSiteAnnualefci: false,
            openSiteAnnualFdOption: false,
            openSiteFdOption: false,
            openSiteFdOptionEfci: false,
            openSiteTotalFdOptionEfci: false,
            openAnnualFD: false
        });
    };

    renderFormModal4 = () => {
        const { openSection4 } = this.state;
        if (!openSection4) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.annualEfciLog}
                        onCancel={this.onCancel}
                        // restoreAnnualEfci={this.restoreTotalFunding}
                        restoreAnnualEfci={this.showRestorePanelTotalFundingCostOpen}
                        hasLoading={this.state.hasLoading}
                        numberOfYears={this.state.noOfYears}
                        totalFunding={true}
                        sortFundingEfci={this.sortTotalFundingCost}
                        deleteLog={this.deleteLog}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    renderFundingCostEfciRestoreModalLog = () => {
        const { openFundingCostEfciRestore, changeSet, associated_changes } = this.state;
        if (!openFundingCostEfciRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openFundingCostEfciRestore: false })}
                        onYes={this.restoreFundingEfci}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openFundingCostEfciRestore: false })}
            />
        );
    };

    restoreFundingEfci = async id => {
        this.setState({
            hasLoading: true
        });
        // await updateFcis(data.id, { value: data.value });
        await this.props.restoreFundingEFCILog(this.state.restoreId);
        this.setState({
            openSection3: false,
            hasLoading: false,
            openFundingCostEfciRestore: false
        });
    };

    showRestorePanelTotalFundingCostOpen = async (id, changeSet) => {
        let data = await this.totalFundingCost(changeSet);
        this.setState({
            openTotalFundingCostRestore: true,
            restoreId: id,
            changeSet: data
        });
    };

    totalFundingCost = async changeSet => {
        let data = {};
        data = { value: [changeSet.value[0] * this.state.noOfYears, changeSet.value[1] * this.state.noOfYears] };
        return data;
    };

    renderFundingTotalFundingCostRestoreModalLog = () => {
        const { openTotalFundingCostRestore, changeSet, associated_changes } = this.state;
        if (!openTotalFundingCostRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openTotalFundingCostRestore: false })}
                        onYes={this.restoreTotalFunding}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openTotalFundingCostRestore: false })}
            />
        );
    };

    restoreTotalFunding = async id => {
        this.setState({
            hasLoading: true
        });
        // await updateFcis(data.id, {value: data.value });
        await this.props.restoreTotalFundingLog(this.state.restoreId);
        this.setState({
            openSection4: false,
            hasLoading: false,
            openTotalFundingCostRestore: false
        });
    };

    deleteConfirmationModal = () => {
        const { showDeleteConfirmModal } = this.state;
        if (!showDeleteConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this log ?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showDeleteConfirmModal: false })}
                        onYes={this.deleteConfirmLog}
                    />
                }
                onCancel={() => this.setState({ showDeleteConfirmModal: false })}
            />
        );
    };

    deleteLog = async id => {
        this.setState({
            showDeleteConfirmModal: true,
            deleteId: id
        });
    };

    deleteConfirmLog = async id => {
        this.setState({ hasLoading: true });
        await this.props.deleteEfciLogData(this.state.deleteId);
        this.setState({
            hasLoading: false,
            showDeleteConfirmModal: false,
            openSection: false,
            openSection1: false,
            openSection2: false,
            openSection3: false,
            openSection4: false,
            openCSP: false,
            openCspPanel: false,
            openFdPanel: false,
            openFdEfci: false,
            openTotalFdEfci: false,
            openAnnualefci: false,
            openSiteAnnualefci: false,
            openSiteAnnualFdOption: false,
            openSiteFdOption: false,
            openSiteFdOptionEfci: false,
            openSiteTotalFdOptionEfci: false,
            openAnnualFD: false
        });
    };

    //building
    showLogsTableFundingCostEfci = async id => {
        this.setState({
            openFdEfci: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getFundingCostEfciLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    showLogsTableTotalFundingCostEfci = async (id, noOfYears) => {
        this.setState({
            openTotalFdEfci: true,
            selectedColumnId: id,
            hasLoading: true,
            noOfYears: noOfYears
        });
        await this.props.getTotalFundingCostEfciLogs(id, this.state.sortKey);
        this.setState({ hasLoading: false });
    };

    renderFormModalFdCostEfci = () => {
        const { openFdEfci } = this.state;
        if (!openFdEfci) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelProjectFundingEfciLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingEfci={this.sortFundingEfci}
                        value={"value"}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    showRestorePanelProjectFundingEfciLogOpen = (id, changeSet) => {
        this.setState({
            openFundingEfciLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderProjectFundingEfciRestoreModalLog = () => {
        const { openFundingEfciLogRestore, changeSet, associated_changes } = this.state;
        if (!openFundingEfciLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openFundingEfciLogRestore: false })}
                        onYes={this.restoreFundingCostEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openFundingEfciLogRestore: false })}
            />
        );
    };

    sortFundingEfci = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 3);
    };

    sortTotalFundingCost = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 4);
    };

    restoreFundingCostEfciLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreFundingCostEfciLog(this.state.restoreId);
        this.setState({
            openFdEfci: false,
            hasLoading: false,
            openFundingEfciLogRestore: false
        });
    };

    renderFormModalTotalFdCostEfci = () => {
        const { openTotalFdEfci } = this.state;
        if (!openTotalFdEfci) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelTotalFundingCostOpenBuilding}
                        hasLoading={this.state.hasLoading}
                        numberOfYears={this.state.noOfYears}
                        totalFunding={true}
                        sortFundingEfci={this.sortTotalFundingCost}
                        deleteLog={this.deleteLog}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    showRestorePanelTotalFundingCostOpenBuilding = async (id, changeSet) => {
        let data = await this.totalFundingCost(changeSet);
        this.setState({
            openTotalFundingCostRestore: true,
            restoreId: id,
            changeSet: data
        });
    };

    renderFundingTotalFundingCostRestoreModalLog = () => {
        const { openTotalFundingCostRestore, changeSet, associated_changes } = this.state;
        if (!openTotalFundingCostRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openTotalFundingCostRestore: false })}
                        onYes={this.restoreTotalFundingCostEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openTotalFundingCostRestore: false })}
            />
        );
    };

    restoreTotalFundingCostEfciLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreTotalFundingCostEfciLog(this.state.restoreId);
        this.setState({
            openTotalFdEfci: false,
            hasLoading: false,
            openTotalFundingCostRestore: false
        });
    };
    setColoCode = async () => {
        this.setState({
            isOpenColorCode: !this.state.isOpenColorCode
        });
    };

    exportChartFromServer = async (type, noOfYears) => {
        try {
            if (this.chartRef) {
                this.setState({ isExporting: true });
                const { legendArrayFunding, legendValues, totalAmount } = this.state;
                const { projectData, efciData, currentTab, selectedSystem, dataView, sectionId } = this.props;
                let url_string = window.location.href;
                let url = new URL(url_string);
                const userName = localStorage.getItem("user");
                const project_id = url.searchParams.get("pid");
                const resp = await Service.getActiveChartProperties({ project_id });
                const { legend, x_axis, y_axis, data_labels } = resp?.data?.properties;
                let heading = [];
                let legends = [];
                let total = null;
                let svg = "";
                if (currentTab === "csp&efci") {
                    svg = this.chartRef.getSVG({
                        chart: { height: 400, width: 666, backgroundColor: "#FFFFFF" },
                        legend: {
                            itemDistance: 50,
                            enabled: legend?.show_legend,
                            backgroundColor: legend?.backgroundColor ? `#${legend?.backgroundColor}` : "",
                            borderColor: legend?.borderColor ? `#${legend?.borderColor}` : "",
                            borderWidth: legend?.borderWidth || null,
                            borderRadius: legend?.borderRadius || null,
                            itemStyle: {
                                color: legend?.font_color ? `#${legend?.font_color}` : "",
                                fontSize: legend?.font_size ? `${legend?.font_size}px` : "",
                                fontWeight: legend?.bold ? "bold" : ""
                            }
                        },
                        credits: { enabled: false },
                        xAxis: [
                            {
                                categories: this.chartRef.xAxis[0].categories,
                                crosshair: true,
                                labels: {
                                    skew3d: true,
                                    style: {
                                        fontSize: x_axis?.font_size ? `${x_axis?.font_size}px` : "",
                                        color: x_axis?.color ? `#${x_axis?.color}` : ""
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
                                        fontSize: y_axis?.font_size ? `${y_axis?.font_size}px` : "",
                                        color: y_axis?.color ? `#${y_axis?.color}` : "",
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
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: y_axis?.font_size ? `${y_axis?.font_size}px` : "",
                                        color: y_axis?.color ? `#${y_axis?.color}` : ""
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
                                        fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : "",
                                        color: data_labels?.color ? `#${data_labels?.color}` : ""
                                    },
                                    formatter: function () {
                                        return "$" + (this.total / 1000000).toFixed(2) + "M";
                                    }
                                }
                            }
                        ]
                    });
                    legends = legendArrayFunding.map(item => ({
                        name: item.name,
                        y: `$ ${thousandsSeparators(parseFloat(item.amount / 1000000).toFixed(2))}M`
                    }));
                    heading = [
                        `${projectData && projectData.project_name ? `${projectData.project_name}-` : ""}${
                            projectData?.name ? projectData?.name : ""
                        }`,
                        `${noOfYears}-Year Capital Spending Plan Funding Options & EFCI`
                    ];
                } else {
                    svg = this.chartRef.getSVG({
                        chart: { height: 400, width: 666 },
                        credits: { enabled: false },
                        xAxis: [
                            {
                                categories: this.chartRef.xAxis[0].categories,
                                labels: {
                                    skew3d: true,
                                    style: {
                                        fontSize: x_axis?.font_size ? `${x_axis?.font_size}px` : "",
                                        color: x_axis?.color ? `#${x_axis?.color}` : ""
                                    }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                allowDecimals: false,
                                min: 0,
                                title: {
                                    text: "",
                                    skew3d: true
                                },
                                labels: {
                                    style: {
                                        fontSize: y_axis?.font_size ? `${y_axis?.font_size}px` : "",
                                        color: y_axis?.color ? `#${y_axis?.color}` : ""
                                    }
                                },
                                stackLabels: {
                                    enabled: true,
                                    style: {
                                        fontWeight: "bold",
                                        fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : "",
                                        color: data_labels?.color ? `#${data_labels?.color}` : ""
                                    },
                                    formatter: function () {
                                        return "$" + (this.total / 1000000).toFixed(2) + "M";
                                    }
                                }
                            }
                        ],

                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: true,
                                    fontWeight: "bold",
                                    fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : "",
                                    color: data_labels?.color ? `#${data_labels?.color}` : ""
                                }
                            }
                        },
                        legend: {
                            enabled: legend?.show_legend,
                            backgroundColor: legend?.backgroundColor ? `#${legend?.backgroundColor}` : "",
                            borderColor: legend?.borderColor ? `#${legend?.borderColor}` : "",
                            borderWidth: legend?.borderWidth || null,
                            borderRadius: legend?.borderRadius || null,
                            itemStyle: {
                                color: legend?.font_color ? `#${legend?.font_color}` : "",
                                fontSize: legend?.font_size ? `${legend?.font_size}px` : "",
                                fontWeight: legend?.bold ? "bold" : ""
                            }
                        }
                    });
                    heading = [
                        `${projectData && projectData.project_name ? `${projectData.project_name} - ` : ""}${
                            projectData?.name ? projectData?.name : ""
                        }`,
                        `${noOfYears}-Year Capital Spending Plan by ${this.renderTypeHeading(currentTab)} - ${this.props.startYear} to ${
                            this.props.endYear
                        }`
                    ];
                    legends = legendValues.map(item => ({
                        name: item.name,
                        y: `$ ${thousandsSeparators(parseFloat(item.y / 1000000).toFixed(2))}M`,
                        percentage: `${item.y ? Number(((item.y / totalAmount) * 100).toFixed(1)) : 0}%`
                    }));
                    total = `$ ${thousandsSeparators(parseFloat((totalAmount ? totalAmount : 1) / 1000000).toFixed(2))}M`;
                }

                const blob = new Blob([svg], { type: "image/svg+xml" });
                //formatted legends

                let formData = new FormData();
                formData.append("image", blob);
                formData.append("heading", JSON.stringify(heading));
                formData.append("legend", JSON.stringify(legends));
                formData.append("project_id", project_id);
                formData.append("username", userName);
                formData.append("chart_type", "proj_fca_chart");
                formData.append("export_type", this.getExportType());
                formData.append("years", noOfYears);
                if (currentTab === "system") {
                    formData.append("trade_ids", JSON.stringify([selectedSystem.id]));
                }
                let filter = {};
                switch (dataView) {
                    case "building":
                        filter.building_ids = [sectionId];
                        break;
                    case "site":
                        filter.site_ids = [sectionId];
                        break;
                    case "region":
                        filter.region_ids = [sectionId];
                        break;
                    default:
                        break;
                }
                formData.append("filter", JSON.stringify(filter));
                total && formData.append("total", total);
                let res;
                if (type === "word") {
                    res = await Service.exportChartToWord(formData);
                } else if (type === "pdf") {
                    res = await Service.exportChartToPdf(formData);
                } else if (type === "ppt") {
                    res = await Service.exportChartToPpt(formData);
                }
                if (res && res.data) {
                    const { data } = res;
                    const name = res.headers["content-disposition"].split("filename=");
                    const fileName = name[1].split('"')[1];
                    const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.setAttribute("download", `${fileName}`); //any other extension
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
                this.setState({ isExporting: false });
            }
        } catch (error) {
            console.log(error);
            this.setState({ isExporting: false, alertMessage: "Oops..Export Failed!" }, () => this.showAlert());
        }
    };

    renderTypeHeading = type => {
        switch (type) {
            case "trade":
                return "Trade";
            case "system":
                const { selectedSystem } = this.props;
                return `${selectedSystem.name} System`;
            case "category":
                return "Category";
            case "building":
                return this.renderChartNameByHierarchy();
            case "funding_source":
                return "Funding Source";
            case "priority":
                return "Term";
            case "EFCI":
                return "CSP & EFCI";
            case "criticalities":
                return "Criticality";
            case "capital_types":
                return "Capital Type";
            default:
                return "";
        }
    };

    renderChartNameByHierarchy = () => {
        const { dataView = "" } = this.props;
        switch (dataView) {
            case "project":
                return "Region";
            case "region":
                return "Site";
            case "site":
                return "Building";
            case "building":
                return "Building Addition";
            case "default":
                return "";
        }
    };

    exportDataTable = async file_type => {
        try {
            this.setState({ isExporting: true });
            const { startYear, endYear, dataView = "", projectId, currentTab, sectionId, selectedSystem } = this.props;
            const userName = localStorage.getItem("user");
            const user_id = localStorage.getItem("userId");
            let url_string = window.location.href;
            let url = new URL(url_string);
            const project_id = url.searchParams.get("pid");
            let params = {
                chart_type: "proj_fca_chart",
                user_name: userName,
                project_ids: project_id ? [project_id] : [],
                start: startYear,
                end: endYear,
                user_id
            };
            switch (dataView) {
                case "region":
                    params.region_ids = [sectionId];
                    break;
                case "site":
                    params.site_ids = [sectionId];
                    break;
                case "building":
                    params.building_ids = [sectionId];
                    break;
                default:
                    break;
            }
            params.export_type = this.getExportType();
            if (currentTab === "system") {
                params.trade_ids = [selectedSystem.id];
            }
            let res = {};
            res = file_type === "excel" ? await Service.exportDataTableToExcel(params) : await Service.exportDataTableToWord(params);
            if (res && res.data) {
                const { data } = res;
                const name = res.headers["content-disposition"].split("filename=");
                const fileName = name[1].split('"')[1];
                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", `${fileName}`); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
            this.setState({ isExporting: false });
        } catch (error) {
            let err = await getExportErrorMessage(error);
            this.setState({ isExporting: false, alertMessage: err }, () => this.showAlert());
        }
    };

    exportEFCIDataTable = async file_type => {
        try {
            this.setState({ isExporting: true });
            const { startYear, endYear, dataView = "", projectId, currentTab, sectionId, checkedArray = [] } = this.props;
            const userName = localStorage.getItem("user");
            const user_id = localStorage.getItem("userId");
            let url_string = window.location.href;
            let url = new URL(url_string);
            const project_id = this.props.dataView == "project" ? projectId : url.searchParams.get("pid");
            const region_ids = checkedArray.map(item => item.id);

            let params = {
                chart_type: "export_efci_chart",
                user_name: userName,
                project_id: project_id ? project_id : "",
                region_ids: region_ids || [],
                start: startYear,
                end: endYear,
                user_id
            };
            // switch (dataView) {
            //     case "region":
            //         params.region_ids = [sectionId];
            //         break;
            //     case "site":
            //         params.site_ids = [sectionId];
            //         break;
            //     case "building":
            //         params.building_ids = [sectionId];
            //         break;
            //     default:
            //         break;
            // }
            // params.export_type = this.getExportType();
            let res = {};
            res = file_type === "word" ? await Service.exportEfciToWord(params) : await Service.exportEFCIDataTableToExcel(params);
            if (res && res.data) {
                const { data } = res;
                const name = res.headers["content-disposition"].split("filename=");
                const fileName = name[1].split('"')[1];
                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", `${fileName}`); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
            this.setState({ isExporting: false });
        } catch (error) {
            console.log(error);
            let err = await getExportErrorMessage(error);
            this.setState({ isExporting: false, alertMessage: err }, () => this.showAlert());
        }
    };

    getExportType = () => {
        const { dataView, currentTab } = this.props;
        let export_type = "";
        switch (currentTab) {
            case "trade":
                export_type = "trades";
                break;
            case "system":
                export_type = "system";
                break;
            case "category":
                export_type = "categories";
                break;
            case "building":
                export_type =
                    dataView === "project"
                        ? "regions"
                        : dataView === "region"
                        ? "sites"
                        : dataView === "site"
                        ? "buildings"
                        : dataView === "building"
                        ? "additions"
                        : "";
                break;
            case "funding_source":
                export_type = "funding_sources";
                break;
            case "priority":
                export_type = "priorities";
                break;
            case "csp&efci":
                export_type = "efci_chart";
                break;
            case "EFCI":
                export_type = "efci";
                break;
            case "criticalities":
                export_type = "criticality";
                break;
            case "capital_types":
                export_type = "capital_type";
                break;
            default:
                break;
        }
        return export_type;
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    renderExportTypeModal = () => {
        const { showExportTypeModal } = this.state;
        const { currentTab } = this.props;
        if (!showExportTypeModal) return null;
        return (
            <Portal
                body={
                    <SelectExportTypeWordModal
                        onCancel={() => this.showExportTypeModal(false)}
                        isBuildingAddition={false}
                        isWordExcel={true}
                        onOk={(sort_type, file_type) => {
                            this.showExportTypeModal(false);
                            if (currentTab === "csp&efci") {
                                this.exportEFCIDataTable(file_type);
                            } else {
                                this.exportDataTable(file_type);
                            }
                        }}
                    />
                }
                onCancel={() => this.showExportTypeModal(false)}
            />
        );
    };
    showExportTypeModal = showExportTypeModal => {
        this.setState({ showExportTypeModal });
    };
    render() {
        const {
            graphData,
            errorBuilding,
            isLoading,
            currentTab,
            projectData,
            viewContent,
            endYear,
            startYear,
            funding_options,
            filterValues,
            setFilterModal,
            chartType,
            handleChart,
            buildingArray,
            handleBuilding,
            hasChartExport = true
        } = this.props;
        const { dataSource, totalAmount, legendValues, legendArrayFunding, fundingSum, isOpenColorCode, isExporting } = this.state;
        let labelValues = graphData && graphData.length ? graphData.map(gd => gd.data) : [];
        let mergedArray = [].concat.apply([], labelValues);
        let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0);
        var holder = {};
        mergedArray.forEach(function (d) {
            if (holder.hasOwnProperty(d.name)) {
                holder[d.name] = holder[d.name] + d.amount;
            } else {
                holder[d.name] = d.amount;
            }
        });
        var chartValue = [];
        for (var prop in holder) {
            chartValue.push({ name: prop, value: holder[prop] });
        }
        let noOfYears = endYear - startYear + 1;
        let filterCount = 0;
        filterValues &&
            Object.keys(filterValues).map(f =>
                ((f == "list" && filterValues[f] && typeof filterValues[f] === "object" && Object.entries(filterValues[f]).length != 0) ||
                    (f == "filters" && filterValues[f] && Object.keys(filterValues[f]).find(fi => filterValues[f][fi].key)) ||
                    f == "search") &&
                filterValues[f]
                    ? (filterCount = filterCount + 1)
                    : null
            );
        return (
            <LoadingOverlay active={this.props.loading || this.props.isLoading || this.state.hasLoading} spinner={<Loader />} fadeSpeed={10}>
                {this.renderFormModal3()}
                {this.renderFormModal4()}
                {this.renderFundingTotalFundingCostRestoreModalLog()}
                {this.deleteConfirmationModal()}
                {this.renderFundingCostEfciRestoreModalLog()}
                {this.renderFormModalFdCostEfci()}
                {this.renderProjectFundingEfciRestoreModalLog()}
                {this.renderFormModalTotalFdCostEfci()}
                {this.renderExportTypeModal()}

                {currentTab != "csp&efci" ? (
                    <div className="tab-active">
                        <div className="chart-right-flt fil-item" id={"selectDropdownParent"}>
                            {graphData && graphData.length ? (
                                <div className="hed-section-gr d-flex">
                                    <h1 className="line">
                                        <span>
                                            {projectData && projectData.project_name ? `${projectData.project_name} - ` : ""}{" "}
                                            {projectData.description ? `${projectData.description} (${projectData.name})` : projectData?.name || ""}{" "}
                                        </span>
                                        {noOfYears}-Year Capital Spending Plan by {this.renderTypeHeading(currentTab)} - {this.props.startYear} to{" "}
                                        {this.props.endYear}{" "}
                                    </h1>
                                </div>
                            ) : null}
                            <div class="right-chrt-sec">
                                <div className="selecbox-otr" id={"selectDropdown"}>
                                    <div className="custom-selecbox">
                                        <select onChange={e => handleChart(e)} value={chartType}>
                                            {this.renderOptions(viewContent)}
                                        </select>
                                    </div>
                                </div>
                                {hasChartExport ? (
                                    // <div className="dp-drop ">
                                    //     <Dropdown>
                                    //         <Dropdown.Toggle id="dropdown-basic">
                                    //             <i className="fa fa-bars" aria-hidden="true"></i>
                                    //         </Dropdown.Toggle>
                                    //         <Dropdown.Menu id="dropdown-menu">
                                    //             <Dropdown.Item href="" onClick={(e) => this.toggleFullscreen(e)}>View Fullscreen</Dropdown.Item>
                                    //             <Dropdown.Item onClick={() => this.convertToImage("png", noOfYears)}>Export to PNG</Dropdown.Item>
                                    //             <Dropdown.Item onClick={() => this.convertToImage("jpeg", noOfYears)}>Export to JPEG</Dropdown.Item>
                                    //             {this.props.dataView == "site" || this.props.dataView == "building" ? (
                                    //                 <Dropdown.Item onClick={() => this.props.exportToXsl()}>Export to Excel</Dropdown.Item>
                                    //             ) : null}
                                    //         </Dropdown.Menu>
                                    //     </Dropdown>
                                    // </div>
                                    <div className="dp-drop ">
                                        <Dropdown>
                                            <Dropdown.Toggle id="dropdown-basic" className="export-btn">
                                                {isExporting ? (
                                                    <div className="edit-icn-bx icon-btn-sec export-loader">
                                                        <div className="spinner-border text-primary" role="status"></div>
                                                    </div>
                                                ) : (
                                                    <i className="fa fa-bars" aria-hidden="true"></i>
                                                )}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu id="dropdown-menu">
                                                <Dropdown.Item onClick={() => this.convertToImage("png", noOfYears)}>Export to PNG</Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.convertToImage("jpeg", noOfYears)}>Export to JPEG</Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.exportChartFromServer("word", noOfYears)}>
                                                    Export to Word
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.exportChartFromServer("pdf", noOfYears)}>
                                                    Export to PDF
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.exportChartFromServer("ppt", noOfYears)}>
                                                    Export to PPT
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.showExportTypeModal(true)}>Export Table Data</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                ) : null}
                            </div>
                            {filterValues && filterCount != 0 ? (
                                <div className="view-inner filter-apply filter-numbr " onClick={setFilterModal}>
                                    <img
                                        src=" /img/filter.svg"
                                        alt=""
                                        className={"filtrImg"}
                                        data-tip="Applied Filters"
                                        data-background-color="#007bff"
                                        currentitem="false"
                                    />
                                    <div className="arrow-sec"></div>
                                    <span className="notifyTxt">{filterCount}</span>
                                </div>
                            ) : null}
                            <a
                                className="nav-link min-mize icon-min-mize cursor-hand"
                                data-for="table-top-icons"
                                data-tip="Go Back To Dashboard"
                                data-place="left"
                                onClick={() => this.props.handleChartView("all")}
                            >
                                <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                <ReactTooltip id="table-top-icons" effect="solid" place="bottom" backgroundColor="#007bff" />
                            </a>
                        </div>
                        <div className={`chart-area ${currentTab == "all" ? "chart-coming-soon" : ""}`} id={"chartItem"} ref={this.chartRef}>
                            {currentTab != "all" ? (
                                <>
                                    <div className="chart-ground">
                                        <div className="top-hd">
                                            {/* {graphData && graphData.length ? (
                                                <div className="hed-section-gr d-flex">
                                                    <h1 className="line">
                                                        <span>
                                                            {projectData && projectData.project_name ? `${projectData.project_name} - ` : ""}{" "}
                                                            {projectData && projectData.name}{" "}
                                                        </span>
                                                        {noOfYears}-Year Capital Spending Plan by {this.renderTypeHeading(currentTab)} -{" "}
                                                        {this.props.startYear} to {this.props.endYear}{" "}
                                                    </h1>
                                                </div>
                                            ) : null} */}

                                            <div className="chart-img">
                                                {dataSource && dataSource.series && dataSource.series.length ? (
                                                    <HighchartsReact
                                                        highcharts={Highcharts}
                                                        options={dataSource}
                                                        containerProps={{ style: { height: "400px", width: "800px" } }}
                                                        allowChartUpdate
                                                        ref={this.chartRef}
                                                        callback={chart => {
                                                            if (!chart.renderer?.forExport) {
                                                                this.chartRef = chart;
                                                            }
                                                        }}
                                                    />
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
                                                                                          {" "}
                                                                                          <NumberFormat
                                                                                              value={parseFloat(cv.y / 1000000).toFixed(2)}
                                                                                              thousandSeparator={true}
                                                                                              displayType={"text"}
                                                                                              suffix={"M"}
                                                                                              prefix={"$ "}
                                                                                          />{" "}
                                                                                          -{" "}
                                                                                          {cv.y ? Number(((cv.y / totalAmount) * 100).toFixed(1)) : 0}
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
                                </>
                            ) : (
                                <div className="table-topper efc-topr ">
                                    <div className="col-md-12 otr-topr ">
                                        <h3>Coming Soon</h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="tab-active pb-0">
                        <div className="chart-right-flt btnPsn lgd-otr">
                            <button className="btn save-data lgd lgd-btn" onClick={() => this.setColoCode()}>
                                <img src="/img/color-wheel.svg" alt="" className="img-whel" /> <span className="txt-spn ">Legend</span>
                            </button>
                            {isOpenColorCode ? (
                                <>
                                    <ColorCodeData
                                        // isCodeLoading={this.state.isCodeLoading}
                                        isOpenColorCode={isOpenColorCode}
                                        colorCodes={this.props.colorCodes}
                                    />
                                </>
                            ) : null}
                            <button className="btn save-data resetBtn" onClick={() => this.props.loadData()}>
                                {" "}
                                Load Data
                            </button>
                            <button className="btn save-data" onClick={() => this.props.saveData()}>
                                Save Data
                            </button>

                            <div className={`${this.state.isTargetEfci ? "dropdown popup show" : "dropdown popup"}`}>
                                <button
                                    className="btn target-data dropdown-toggle"
                                    onClick={() => this.showTarget()}
                                    type="button"
                                    id="dropdownMenuButton"
                                    x-placement="bottom-start"
                                >
                                    Target EFCI
                                </button>
                                {this.state.isTargetEfci ? (
                                    <div
                                        className={`${this.state.isTargetEfci ? "dropdown-menu-view  show" : "dropdown-menu-view "}`}
                                        aria-labelledby="dropdownMenuButton"
                                        style={{ display: "block" }}
                                    >
                                        <h3>Initial Funding Options</h3>
                                        <div className="table-section table-scroll build-fci funding table-small">
                                            {this.props.dataView != "site" ? (
                                                <InitialFundingOptionsTable
                                                    efciBuildingData={this.props.efciSiteData}
                                                    toggleLoader={this.props.toggleLoader}
                                                    isDashboard={true}
                                                    hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                                    updateFundingOptionEfci={this.props.updateFundingOptionEfci}
                                                    updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                                    updateFundingOption1={this.props.updateFundingOption1}
                                                    updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                                                    updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                                    handleHideFundingOptions={this.handleHideFundingOptions}
                                                    updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                                    getFundingOptionLogs={this.props.getFundingOptionLogs}
                                                    restoreFundingOptionLog={this.props.restoreFundingOptionLog}
                                                    getFundingEfciLog1={this.props.getFundingEfciLog1}
                                                    restoreFundingEFCILog={this.props.restoreFundingEFCILog}
                                                    getTotalFundingLogs={this.props.getTotalFundingLogs}
                                                    restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                                                    getCSPLogs={this.props.getCSPLogs}
                                                    restoreCSP={this.props.restoreCSP}
                                                    deleteEfciLogData={this.props.deleteEfciLogData}
                                                    annualEfciLog={this.props.annualEfciLog}
                                                    annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                                                    deleteLog={this.deleteLog}
                                                    showLogsTableTotalFundingCostEfci={this.showLogsTableTotalFundingCostEfci}
                                                    showLogsTableFundingCostEfci={this.showLogsTableFundingCostEfci}
                                                    logCount={this.props.logCount}
                                                    logPaginationParams={this.props.logPaginationParams}
                                                    handlePageClickLogs={this.props.handlePageClickLogs}
                                                    handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                                />
                                            ) : (
                                                <InitialFundingOptionSite
                                                    efciSiteData={this.props.efciSiteData}
                                                    isDashboard={true}
                                                    updatePercentage={this.props.updatePercentage}
                                                    updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                                                    updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                                    updateSiteFundingOption={this.props.updateSiteFundingOption}
                                                    updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                                    updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                                    updateFcis={this.props.updateFcis}
                                                    updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                                    updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                                    updateFundingEfciData={this.props.updateFundingEfciData}
                                                    updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                                    updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                                    hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                                    toggleLoader={this.props.toggleLoader}
                                                    handleHideFundingOptions={this.handleHideFundingOptions}
                                                    getFundingOptionLogs={this.props.getFundingOptionLogs}
                                                    showLogsTable={this.showLogsTable}
                                                    showLogsTableFunding={this.showLogsTableFunding}
                                                    restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}
                                                    showLogsTableFundingOption={this.showLogsTableFundingOption}
                                                    getFundingEfciLog={this.props.getFundingEfciLog}
                                                    showLogsTableFundingEfci={this.showLogsTableFundingEfci}
                                                    getTotalFundingLog={this.props.getTotalFundingLog}
                                                    restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                                                    showLogsTotalFundingOption={this.showLogsTotalFundingOption}
                                                    annualEfciLog={this.props.annualEfciLog}
                                                    annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                                                    deleteLog={this.deleteLog}
                                                    logCount={this.props.logCount}
                                                    logPaginationParams={this.props.logPaginationParams}
                                                    handlePageClickLogs={this.props.handlePageClickLogs}
                                                    handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {/* <div className="dp-drop pl-2">
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">
                                        <i className="fa fa-bars" aria-hidden="true"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu id="dropdown-menu">
                                        <Dropdown.Item href="" onClick={(e) => this.toggleFullscreen(e)}>View Fullscreen</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.convertToImage("png", noOfYears)}>Export to PNG</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.convertToImage("jpeg", noOfYears)}>Export to JPEG</Dropdown.Item>
                                        {(this.props.dataView=="site") ? <Dropdown.Item onClick={() => this.props.exportToXsl()}>Export to Excel</Dropdown.Item>:null}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div> */}
                            <div className="dp-drop pl-2">
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic" className="export-btn">
                                        {isExporting ? (
                                            <div className="edit-icn-bx icon-btn-sec export-loader">
                                                <div className="spinner-border text-primary" role="status"></div>
                                            </div>
                                        ) : (
                                            <i className="fa fa-bars" aria-hidden="true"></i>
                                        )}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu id="dropdown-menu">
                                        <Dropdown.Item onClick={() => this.convertToImage("png", noOfYears)}>Export to PNG</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.convertToImage("jpeg", noOfYears)}>Export to JPEG</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.exportChartFromServer("word", noOfYears)}>Export to Word</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.exportChartFromServer("pdf", noOfYears)}>Export to PDF</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.exportChartFromServer("ppt", noOfYears)}>Export to PPT</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.showExportTypeModal(true)}>Export Table Data</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            {this.props.hasGoBackToDashboard && (
                                <a
                                    className="nav-link cursor-hand efci-icon-min"
                                    data-for="table-top-icons"
                                    data-tip="Go Back To Dashboard"
                                    data-place="left"
                                    onClick={() => this.props.handleChartView("all")}
                                >
                                    <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                    <ReactTooltip id="table-top-icons" effect="solid" place="bottom" backgroundColor="#007bff" />
                                </a>
                            )}
                        </div>

                        <div className="row full-height chart-area" id={"chartItem"}>
                            {this.props.renderConfirmationModal()}
                            {this.props.renderConfirmationLoad()}

                            <div className="col-md-3 pr-0 sidepanel">
                                <ul className="nav nav-bar">
                                    {buildingArray && buildingArray.length ? (
                                        <>
                                            {this.props.dataView != "building" ? (
                                                <li className="active">
                                                    <label className="container-check" for={`selectAll`}>
                                                        <span>Select All</span>
                                                        <input
                                                            type="checkbox"
                                                            value={"selectAll"}
                                                            onChange={e => this.props.handleSelectAllBuilding(e)}
                                                            id={`selectAll`}
                                                            name={"selectAll"}
                                                            disabled={this.props.dataView == "building"}
                                                            checked={buildingArray.length == this.props.buildingIds.length}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </li>
                                            ) : null}
                                            {buildingArray.map((building, index) => {
                                                return (
                                                    <li className="active">
                                                        <label className="container-check" for={`0${index + 1}`}>
                                                            <span
                                                            // onClick={() => this.props.handleRedirect(building.id)}
                                                            >
                                                                {building.name}
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                value={building.id}
                                                                onChange={e => this.props.handleBuilding(e, building, index)}
                                                                id={`0${index + 1}`}
                                                                name={building.name}
                                                                disabled={this.props.dataView == "building"}
                                                                checked={building.checked}
                                                            />
                                                            {this.props.dataView != "building" ? (
                                                                <button onClick={() => this.props.viewOneBuilding(building, index)}>View only</button>
                                                            ) : null}
                                                            <span className="checkmark"></span>
                                                        </label>

                                                        <div
                                                            className="lock-main lckBuilding cursor-pointer"
                                                            onClick={() => this.props.handleLock(building.id, !building.locked)}
                                                        >
                                                            {building.locked ? this.lockIcon(true) : this.unlockIcon(false)}
                                                        </div>
                                                    </li>
                                                );
                                            })}{" "}
                                        </>
                                    ) : null}
                                </ul>
                                {errorBuilding ? <div className={"error-check-box"}>**Choose At least One Building</div> : null}
                            </div>
                            <div className="col-md-9 chart-ground ">
                                <div className="top-hd">
                                    <div className="hed-section-gr d-flex">
                                        <h1 className="line">
                                            <span>
                                                {projectData && projectData.project_name ? `${projectData.project_name} - ` : ""}{" "}
                                                {projectData.description
                                                    ? `${projectData.description} (${projectData.name})`
                                                    : projectData?.name || ""}{" "}
                                            </span>{" "}
                                            {noOfYears}-Year Capital Spending Plan Funding Options & EFCI
                                        </h1>

                                        {/* <div className="chart-right-flt" id=""> */}
                                        {/* <div className="selecbox-otr " id=""> */}
                                        {/* <button className="btn target-data" onClick={() => this.props.resetEfci()} > Reset Data</button> */}

                                        {/* <Popover id={"testId"} placement="bottom" isOpen={this.state.isTargetEfci} target="Popover1" toggle={() => this.showTarget()}>
                                                    <PopoverHeader>Initial Funding Options</PopoverHeader>
                                                    <PopoverBody> <div className="table-section table-scroll build-fci funding table-small">
                                                        {this.props.dataView != "site" ? <InitialFundingOptionsTable
                                                            efciBuildingData={this.props.efciSiteData}
                                                            toggleLoader={this.props.toggleLoader}
                                                            isDashboard={true}
                                                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                                            updateFundingOptionEfci={this.props.updateFundingOptionEfci}
                                                            updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                                            updateFundingOption1={this.props.updateFundingOption1}
                                                            updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                                                            isDashboard={true}
                                                            updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                                            handleHideFundingOptions={this.handleHideFundingOptions}
                                                            updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}

                                                        /> : <InitialFundingOptionSite
                                                                efciSiteData={this.props.efciSiteData}
                                                                isDashboard={true}
                                                                updatePercentage={this.props.updatePercentage}
                                                                updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                                                                updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                                                updateSiteFundingOption={this.props.updateSiteFundingOption}
                                                                updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                                                updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                                                updateFcis={this.props.updateFcis}
                                                                updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                                                updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                                                updateFundingEfciData={this.props.updateFundingEfciData}
                                                                updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                                                updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                                                toggleLoader={this.props.toggleLoader}
                                                                handleHideFundingOptions={this.handleHideFundingOptions}
                                                                updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}

                                                            />}</div></PopoverBody>
                                                </Popover> */}

                                        {/* </div> */}
                                        {/* </div> */}
                                    </div>

                                    {/* <div className="chart-img" > */}

                                    {/* </div> */}
                                </div>
                                <div className="chart-img left-chart">
                                    {dataSource &&
                                    dataSource.series &&
                                    dataSource.series.length &&
                                    dataSource.series[0].data &&
                                    dataSource.series[0].data.length ? (
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={dataSource}
                                            containerProps={{ style: { height: "450px", width: "800px" } }}
                                            allowChartUpdate
                                            ref={this.chartRef}
                                            callback={chart => {
                                                if (!chart.renderer?.forExport) {
                                                    this.chartRef = chart;
                                                }
                                            }}
                                        />
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
                                                                                  {" "}
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
                                            {/* <div className="col-md-3">
                                            <div className="result-total">
                                                <strong>TOTAL =<NumberFormat
                                                    value={parseInt(
                                                        fundingSum ? fundingSum : 0.00
                                                    )}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                /></strong>
                                            </div>
                                        </div> */}
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
