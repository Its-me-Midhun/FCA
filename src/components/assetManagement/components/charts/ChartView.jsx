import React, { Component } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import LabelModule from "highcharts/modules/series-label";
import GridLight from "highcharts/themes/grid-light";
import { Dropdown } from "react-bootstrap";
import * as htmlToImage from "html-to-image";
import ReactTooltip from "react-tooltip";
import Loader from "../../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import NumberFormat from "react-number-format";
import moment from "moment";
import customEvent from "highcharts-custom-events";
import * as Service from "../../../common/services";
import { thousandsSeparators, getExportErrorMessage } from "../../../../config/utils";
import * as assetServices from "./../../services";
import SelectExportTypeWordModal from "../../../common/components/SelectExportTypeWordModal";
import Portal from "../../../common/components/Portal";

highchartsMore(Highcharts);
highcharts3d(Highcharts);
GridLight(Highcharts);
LabelModule(Highcharts);
customEvent(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
Highcharts.setOptions({
    lang: {
        thousandsSep: ","
    }
});

class ChartView extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.chartContainerRef = React.createRef();
        this.observer = null;
    }

    state = {
        dataSource: null,
        isOpenColorCode: false,
        totalValue: 0,
        legendValues: [],
        isExporting: false,
        alertMessage: "",
        showExportTypeModal: false
    };

    componentDidMount = () => {
        this.setState(
            {
                dataSource: null
            },
            () => this.renderChart()
        );
        try {
            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === "attributes" && mutation.attributeName === "class") {
                        let currentElement1 = this.chartContainerRef?.current?.parentNode;
                        console.log("currentElement", currentElement1);
                        while (currentElement1 !== null) {
                            if (currentElement1.classList?.contains("acsb-stop-animations")) {
                                currentElement1.classList.remove("acsb-stop-animations");
                                break;
                            }
                            currentElement1 = currentElement1.parentNode;
                        }
                    }
                });
            });

            let currentElement = this.chartContainerRef?.current?.parentNode;

            while (currentElement !== null) {
                this.observer.observe(currentElement, { attributes: true });
                currentElement = currentElement.parentNode;
            }
        } catch (error) {
            console.error(error);
            this.observer.disconnect();
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { graphData, chartType } = this.props;

        if (prevProps.graphData !== graphData) {
            this.setState(
                {
                    dataSource: {}
                },
                () => this.renderChart()
            );
        }
        if (prevProps.currentTab !== this.props.currentTab) {
            this.setState(
                {
                    dataSource: {}
                },
                () => this.renderChart()
            );
        }
        if (prevProps.chartType !== chartType) {
            this.setState(
                {
                    dataSource: {}
                },
                () => this.renderChart()
            );
        }
        if (prevProps.chartView !== this.props.chartView) {
            this.setState(
                {
                    dataSource: {}
                },
                () => this.renderChart()
            );
        }
        if (prevProps.chartPopup !== this.props.chartPopup) {
            this.renderChart();
        }
      
    };

    componentWillUnmount() {
        this.observer.disconnect();
    }

    renderChartDetails = (graphTypeData, type) => {
        const { chartView } = this.props;
        let tempSeries = [];
        let legendValues = [];
        switch (type) {
            case "End_Of_Life_By_Year":
                graphTypeData?.length &&
                    graphTypeData.forEach(item => {
                        const rangeData = item.data.map(i => ({
                            conditionName: item.condtion?.name,
                            y: i.values || 0,
                            conditionId: item.condtion?.id
                        }));
                        const valueSum = item.data.reduce((total, obj) => obj.values + total, 0);
                        tempSeries.push({
                            name: item.condtion?.name,
                            data: rangeData,
                            color: item.condtion?.color
                        });
                        legendValues.push({ name: item.condtion?.name, y: valueSum });
                    });
                break;
            case "Asset_Age_By_Condition":
                graphTypeData?.length &&
                    graphTypeData.forEach(item => {
                        const rangeData = item.data.map(i => ({
                            conditionName: item.condtion?.name,
                            y: i.values || 0,
                            conditionId: item.condtion?.id
                        }));
                        const valueSum = item.data.reduce((total, obj) => obj.values + total, 0);
                        tempSeries.push({
                            name: item.condtion?.name,
                            data: rangeData,
                            color: item.condtion?.color
                        });
                        legendValues.push({ name: item.condtion?.name, y: valueSum });
                    });
                break;
            case "Assets_Capital_Spending_Plan":
                if (chartView[type] === "column") {
                    graphTypeData?.length &&
                        graphTypeData.forEach(item => {
                            const rangeData = item.data.map(i => ({
                                y: parseInt(i.money?.money) || 0,
                                assetCount: i.money?.asset_count,
                                conditionId: item.condtion?.id,
                                conditionName: item.condtion?.name
                            }));
                            const valueSum = item.data.reduce((total, obj) => parseInt(obj.money?.money) + total, 0);
                            tempSeries.push({
                                name: item.condtion?.name,
                                data: rangeData,
                                color: item.condtion?.color
                            });
                            legendValues.push({ name: item.condtion?.name, y: valueSum });
                        });
                } else {
                    const categories = ["Expired", "Next year", "2 Years", "3-5 Years", "6-10 Years", "10+ Years", "Unknown"];
                    let temp = [];
                    categories.map(cat => temp.push(graphTypeData.find(item => item.range === cat)));
                    temp?.length &&
                        temp.forEach(item => {
                            tempSeries.push({
                                name: item.range,
                                assetCount: item.values?.asset_count,
                                y: parseInt(item.values?.value),
                                color: item.values?.colour
                            });
                            legendValues.push({ name: item.range, y: parseInt(item.values?.value) });
                        });
                }
                break;
            case "SFCI":
                let data = [];
                graphTypeData?.length &&
                    graphTypeData.forEach(item => {
                        data.push({
                            name: item.name,
                            y: parseFloat(item.y),
                            CRV: parseInt(item.crv),
                            total: parseInt(item.total),
                            color: item.color,
                            subSystemId: item.id
                        });
                    });
                tempSeries = [
                    {
                        name: "Benchmark",
                        data
                    }
                ];
                break;
            default:
                break;
        }
        let totalSum = legendValues.reduce((total, obj) => obj.y + total, 0);
        this.setState({ legendValues, totalValue: totalSum });
        return tempSeries;
    };

    renderYtext = type => {
        switch (type) {
            case "End_Of_Life_By_Year": {
                return "Asset Count";
            }
            case "Assets_Capital_Spending_Plan": {
                return "";
            }
            case "Asset_Age_By_Condition": {
                return "Asset Count";
            }
            case "SFCI": {
                return "";
            }
            default:
                return "";
        }
    };

    renderChart = () => {
        const { graphData, currentTab, chartType, chartPopup, chartView } = this.props;
        let dataSource = {};
        let graphTypeData = {};
        let self = this;
        if (graphData && Object.keys(graphData)?.length) {
            switch (currentTab) {
                case "End_Of_Life_By_Year": {
                    graphTypeData = graphData["end_of_life_chart"];
                    break;
                }
                case "Assets_Capital_Spending_Plan": {
                    if (chartView.Assets_Capital_Spending_Plan === "column") {
                        graphTypeData = graphData["money_bar_chart"];
                    } else {
                        graphTypeData = graphData["money_chart"];
                    }
                    break;
                }
                case "Asset_Age_By_Condition": {
                    graphTypeData = graphData["age_chart"];
                    break;
                }
                case "SFCI": {
                    graphTypeData = graphData["benchmark"];
                    break;
                }
                default:
                    break;
            }
            const chartValue = this.renderChartDetails(graphTypeData, currentTab);
            if (chartView[currentTab] === "column") {
                dataSource = {
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    chart: {
                        type: "column",
                        zoomType: "xy",
                        options3d: {
                            enabled: chartType === "3d" ? true : false,
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
                        categories: this.renderCategories(currentTab),
                        labels: {
                            skew3d: true,
                            style: {
                                fontSize: "14px",
                                cursor: "pointer"
                            },
                            autoRotation: undefined,
                            events: {
                                click: function () {
                                    const rangeIndex = this.pos;
                                    let clickedCategory = this.axis.categories[rangeIndex] || "";
                                    let selectedSeries = this.chart.options?.series || [];
                                    self.props.showChartPopup({
                                        heading: self.renderHeading(currentTab),
                                        category: clickedCategory,
                                        series: selectedSeries,
                                        rangeIndex,
                                        name: null,
                                        entityId: null,
                                        data: "",
                                        type: currentTab,
                                        isCategory: true
                                    });
                                }
                            },
                            formatter: item => {
                                const isSelectedCategory =
                                    chartPopup.data.isCategory && chartPopup.data.type === currentTab && chartPopup.data.category === item.value;
                                const color = isSelectedCategory ? "#007bff" : "black";
                                const fontWeight = isSelectedCategory ? "bold" : "normal";
                                return `<span style="color: ${color}; font-weight: ${fontWeight}" onClick={}>${item.value}</span>`;
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: this.renderYtext(currentTab),
                            skew3d: true
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: "bold",
                                format: currentTab === "Assets_Capital_Spending_Plan" ? "$ {point.y:.1f}" : "",
                                color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray"
                            },
                            formatter: function () {
                                return currentTab === "Assets_Capital_Spending_Plan" ? "$" + (this.total / 1000000).toFixed(2) + "M" : this.total;
                            }
                        }
                    },

                    tooltip: {
                        headerFormat: "<b>{point.key}</b><br>",
                        pointFormat:
                            currentTab === "Assets_Capital_Spending_Plan"
                                ? `<span style="color:{series.color}">\u25CF</span> {series.name}: <b>$ {point.y}</b>  
                                    <br/>
                                    <span style="color:{series.color}">\u25CF</span> Total Assets: <b>{point.assetCount}</b>`
                                : `<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} `
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
                        },
                        series: {
                            point: {
                                events: {
                                    click: event => {
                                        this.props.showChartPopup({
                                            heading: this.renderHeading(currentTab),
                                            category: event.point.category,
                                            name: event.point.conditionName,
                                            entityId: event.point.conditionId,
                                            data: event.point.y,
                                            type: currentTab
                                        });
                                    }
                                }
                            },
                            events: {
                                legendItemClick: event => this.handleLegendItemClick(event, "column")
                            },
                            allowPointSelect: true,
                            cursor: "pointer",
                            states: {
                                select: {
                                    color: null,
                                    borderWidth: !chartPopup.data.isCategory && chartPopup.data.type === currentTab ? 2 : null,
                                    borderColor: !chartPopup.data.isCategory && chartPopup.data.type === currentTab ? "black" : null
                                }
                            }
                        }
                    },
                    series: chartValue,
                    legend: {
                        enabled: true,
                        width: "100%",
                        className: "custom-chart-legend"
                    }
                };
            } else if (chartView[currentTab] === "pie") {
                dataSource = {
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    chart: {
                        type: "pie",
                        backgroundColor: "#FFFFFF",
                        style: {
                            fontFamily: "Poppins, sans-serif"
                        },
                        options3d: {
                            enabled: chartType === "3d" ? true : false,
                            alpha: 45,
                            beta: 0
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
                    tooltip: {
                        pointFormat: "{series.name}: <b>$ {point.y}</b><br/>Total Assets: <b>{point.assetCount}</b>"
                    },
                    accessibility: {
                        point: {
                            valuePrefix: "$"
                        }
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
                                formatter: function () {
                                    return `<b>${this.point.name}: ${this.point.percentage.toFixed(1)} %</b><br> ${
                                        this.series.name
                                    }: $ ${thousandsSeparators(this.y)}`;
                                }
                                //here
                            },
                            point: {
                                events: {
                                    legendItemClick: event => this.handleLegendItemClick(event, "pie")
                                }
                            }
                        },
                        series: {
                            point: {
                                events: {
                                    click: event => {
                                        this.props.showChartPopup({
                                            heading: this.renderHeading(currentTab),
                                            category: "",
                                            name: event.point.name,
                                            data: event.point.y,
                                            type: currentTab,
                                            chartView: chartView[currentTab]
                                        });
                                    }
                                }
                            },
                            allowPointSelect: true,
                            cursor: "pointer",
                            states: {
                                select: {
                                    color: null,
                                    borderWidth: chartPopup.data.type === currentTab ? 2 : null,
                                    borderColor: chartPopup.data.type === currentTab ? "black" : null
                                }
                            }
                        }
                    },
                    series: [
                        {
                            name: "CSP",
                            slicedOffset: 20,
                            colorByPoint: true,
                            data: chartValue
                        }
                    ],

                    legend: {
                        enabled: true,
                        width: "100%",
                        className: "custom-chart-legend"
                    }
                };
            } else if (chartView[currentTab] === "bar") {
                dataSource = {
                    exporting: { enabled: false },
                    chart: {
                        name: "sfci_chart",
                        type: "bar",
                        style: {
                            fontFamily: "Poppins, sans-serif"
                        },
                        marginLeft: 90,
                        animation: {
                            duration: 1000,
                            easing: "easeOutBounce"
                        },
                        backgroundColor: "#FFFFFF",
                        options3d: {
                            enabled: chartType === "3d" ? true : false,
                            alpha: 15,
                            beta: 15,
                            viewDistance: 25,
                            depth: 40
                        }
                    },
                    title: {
                        text: ""
                    },
                    subtitle: {
                        text: ""
                    },
                    xAxis: {
                        id: "x-axis-1",
                        categories: this.renderCategories(currentTab, graphTypeData),
                        title: {
                            text: null
                        },
                        scrollbar: {
                            enabled: this.renderCategories(currentTab, graphTypeData)?.length > 8 ? true : false
                        },
                        labels: {
                            enabled: true,
                            style: {
                                cursor: "pointer"
                            }
                            // formatter: item => {
                            //     const color = this.state.current === item.value && this.state.currentSite == item.pos ? "#007bff" : "black";
                            //     const fontWeight = this.state.current === item.value && this.state.currentSite == item.pos ? "bold" : "normal";
                            //     return `<span style="color: ${color}; font-weight: ${fontWeight}" onClick={}>${item.value}</span>`;
                            // }
                        },
                        min: 0,
                        max: this.renderCategories(currentTab, graphTypeData)?.length > 8 ? 8 : null
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: "",
                            align: "high"
                        },
                        labels: {
                            overflow: "justify",
                            useHTML: true
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            var s = `<b>${this.point.name}</b>
                                    <br/><span>SFCI : ${this.y} <span>
                                    <br/><span>Project Total : ${
                                        this.point.total != null ? "$ " + (this.point.total / 1000000).toFixed(3) + "M" : ""
                                    } </span>
                                    <br/><span>CRV : ${this.point.CRV != null ? "$ " + (this.point.CRV / 1000000).toFixed(3) + "M" : ""} </span>`;
                            return s;
                        }
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                        series: {
                            point: {
                                events: {
                                    click: event => {
                                        this.props.showChartPopup({
                                            heading: this.renderHeading(currentTab),
                                            category: event.point.category,
                                            name: event.point.name,
                                            entityId: event.point.subSystemId,
                                            data: event.point.y,
                                            type: currentTab
                                        });
                                    }
                                }
                            },
                            allowPointSelect: true,
                            cursor: "pointer",
                            states: {
                                select: {
                                    color: null,
                                    borderWidth: !this.state.isSelectedOne ? 2 : null,
                                    borderColor: !this.state.isSelectedOne ? "black" : null
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: chartValue
                };
            }

            this.setState({
                dataSource
            });
        }
    };

    renderCategories = (type, data) => {
        let categories = [];
        switch (type) {
            case "End_Of_Life_By_Year":
                categories = ["Expired", "Next Year", "2 Years", "3-5 Years", "6-10 Years", "10+ Years", "Unknown"];
                break;

            case "Asset_Age_By_Condition":
                categories = ["0-5", "6-10", "11-15", "16-20", "21-25", "26+", "Unknown"];
                break;
            case "Assets_Capital_Spending_Plan":
                categories = ["Expired", "Next Year", "2 Years", "3-5 Years", "6-10 Years", "10+ Years", "Unknown"];
                break;
            case "SFCI":
                categories = data.map(item => item.name);
                break;

            default:
                break;
        }
        return categories;
    };

    handleLegendItemClick = (event, type) => {
        let currentTotal = this.state.totalValue;
        let legendArray = this.state.legendValues;
        if (type === "column") {
            let sumOfCurrentLegend = event.target.yData.reduce(function (a, b) {
                return a + b;
            }, 0);
            if (event.target.visible) {
                currentTotal = currentTotal - sumOfCurrentLegend;
                legendArray = legendArray && legendArray.filter(l => l.name !== event.target.options.name);
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
        } else if (type === "pie") {
            if (event.target.visible) {
                currentTotal = currentTotal - event.target.options.y;
                legendArray = legendArray && legendArray.filter(l => l.name !== event.target.options.name);
            } else {
                currentTotal = currentTotal + event.target.options.y;
                legendArray.push(event.target.options);
            }
        }

        this.setState({
            totalValue: currentTotal,
            legendValues: legendArray
        });
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
            default:
                break;
        }
    };

    handleChart = e => {
        this.setState(
            {
                chartType: e.target.value,
                totalAmount: 0
            },
            () => this.renderChart()
        );
    };

    renderOptions = chartType => {
        return (
            <>
                <option value="2d">Chart 2D</option>
                <option value="3d">Chart 3D</option>
            </>
        );
    };

    toggleFullscreen = event => {
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

    convertToImage = imgType => {
        this.setState({ isExporting: true });
        let self = this;
        const userName = localStorage.getItem("user");
        const currentDate = moment().format("MM_DD_YYYY HH_mm_ss");
        const heading = `${this.props?.clientName || ""} ${this.renderHeading(this.props.currentTab)}`;
        const name = `${heading}-${userName}-${currentDate}`;
        if (imgType === "jpeg") {
            htmlToImage.toJpeg(document.getElementById("chartItem"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.jpeg`;
                link.href = dataUrl;
                link.click();
                link.remove();
                self.setState({ isExporting: false });
            });
        } else if (imgType === "png") {
            htmlToImage.toPng(document.getElementById("chartItem"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.png`;
                link.href = dataUrl;
                link.click();
                link.remove();
                self.setState({ isExporting: false });
            });
        } else if (imgType === "svg") {
            function filter(node) {
                return node.tagName !== "i";
            }
            htmlToImage.toSvgDataURL(document.getElementById("chartItem"), { filter: filter }, { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = "chart.svg";
                link.href = dataUrl;
                link.click();
                link.remove();
                self.setState({ isExporting: false });
            });
        }
    };

    renderHeading = type => {
        switch (type) {
            case "End_Of_Life_By_Year":
                return "Assets End of Service Life by Year and Condition";
            case "Assets_Capital_Spending_Plan":
                return "Assets Capital Spending Plan by End of Service Life";
            case "Asset_Age_By_Condition":
                return "Assets Age by Condition";
            case "SFCI":
                return "System Facility Condition Index";
            default:
                break;
        }
    };
    handleChartView = (type, key) => {
        let { chartView } = this.props;
        chartView = {
            ...chartView,
            [key]: type
        };
        this.props.handleChartView(chartView);
    };

    getExportChartData = () => {
        const { currentTab, graphData, chartView } = this.props;
        let graphTypeData = {};
        switch (currentTab) {
            case "End_Of_Life_By_Year": {
                graphTypeData = graphData["end_of_life_chart"];
                break;
            }
            case "Assets_Capital_Spending_Plan": {
                if (chartView.Assets_Capital_Spending_Plan === "column") {
                    graphTypeData = graphData["money_bar_chart"];
                } else {
                    graphTypeData = graphData["money_chart"];
                }
                break;
            }
            case "Asset_Age_By_Condition": {
                graphTypeData = graphData["age_chart"];
                break;
            }
            case "SFCI": {
                graphTypeData = graphData["benchmark"];
                break;
            }
            default:
                break;
        }
        return graphTypeData;
    };

    exportChartFromServer = async type => {
        try {
            if (this.chartRef) {
                this.setState({ isExporting: true });
                const { clientName, currentTab, clientId } = this.props;
                const { totalValue, legendValues } = this.state;

                const userName = localStorage.getItem("user");
                const heading = [`${clientName} Asset Management`, this.renderHeading(currentTab)];
                //formatted legends
                const legends = legendValues.map(item => ({
                    name: item.name,
                    y: `${currentTab === "Assets_Capital_Spending_Plan" ? "$ " : ""}${
                        currentTab === "Assets_Capital_Spending_Plan"
                            ? thousandsSeparators(parseFloat(item.y / 1000000).toFixed(2))
                            : thousandsSeparators(item.y)
                    }${currentTab === "Assets_Capital_Spending_Plan" ? "M" : ""}`,
                    percentage: `${item.y ? Number(((item.y / totalValue) * 100).toFixed(1)) : 0}%`
                }));

                // formatted total value
                const total = totalValue
                    ? `${currentTab === "Assets_Capital_Spending_Plan" ? "$ " : ""}${
                          currentTab === "Assets_Capital_Spending_Plan"
                              ? thousandsSeparators(parseFloat(totalValue / 1000000).toFixed(2))
                              : thousandsSeparators(totalValue)
                      }${currentTab === "Assets_Capital_Spending_Plan" ? "M" : ""}`
                    : null;

                const resp = await Service.getActiveChartProperties({ client_id: clientId });
                const { legend, x_axis, y_axis, data_labels } = resp?.data?.properties;
                let svg = this.chartRef.getSVG({
                    chart: { height: 500, width: 832 },
                    legend: {
                        enabled: currentTab !== "SFCI" ? legend?.show_legend : false,
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
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: "bold",
                                    fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : "",
                                    color: data_labels?.color ? `#${data_labels?.color}` : ""
                                }
                            }
                        },
                        bar:
                            currentTab === "SFCI"
                                ? {
                                      dataLabels: {
                                          enabled: true,
                                          fontWeight: "bold",
                                          fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : "",
                                          color: data_labels?.color ? `#${data_labels?.color}` : ""
                                      }
                                  }
                                : null
                    },
                    credits: { enabled: false },
                    xAxis: [
                        {
                            categories: this.renderCategories(currentTab, this.getExportChartData()),
                            labels: {
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
                                    if (currentTab === "Assets_Capital_Spending_Plan") {
                                        return "$" + (this.total / 1000000).toFixed(2) + "M";
                                    }
                                    return this.total;
                                }
                            }
                        }
                    ]
                });

                const blob = new Blob([svg], { type: "image/svg+xml" });
                let formData = new FormData();
                formData.append("image", blob);
                // formData.append("heading", JSON.stringify(heading));
                formData.append("legend", JSON.stringify(legends));
                total && formData.append("total", total);
                formData.append("client_id", clientId);
                formData.append("username", userName);
                formData.append("chart_type", currentTab);
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

    exportDataTable = async file_type => {
        try {
            this.setState({ isExporting: true });
            const { selectedMasterFilters, currentTab, clientId, sfci_sort_by } = this.props;
            const userName = localStorage.getItem("user");
            const { sfciSortName, sfciSortValue } = this.props;
            let is_sort;
            if (sfci_sort_by === "value") {
                is_sort = sfciSortValue === true ? "asc" : "desc";
            } else {
                is_sort = sfciSortName === true ? "asc" : "desc";
            }
            const params = {
                chart_type: currentTab,
                username: userName,
                client_id: clientId,
                recommendation_assigned: selectedMasterFilters.recommendaton_assigned,
                asset_condition_ids: selectedMasterFilters.asset_condition_ids || [],
                asset_status_ids: selectedMasterFilters.asset_status_ids || [],
                asset_type_ids: selectedMasterFilters.asset_type_ids || [],
                building_ids: selectedMasterFilters.building_ids || [],
                building_type_ids: selectedMasterFilters.building_type_ids || [],
                region_ids: selectedMasterFilters.region_ids || [],
                site_ids: selectedMasterFilters.site_ids || []
            };
            if (currentTab == "SFCI") {
                params.sfci_sort_type = sfci_sort_by;
                params.sfci_sort_order = is_sort;
            }
            let res = {};
            res = file_type === "excel" ? await assetServices.exportDataTableToExcel(params) : await assetServices.exportDataTableToWord(params);
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
                            this.exportDataTable(file_type);
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
            isLoading,
            currentTab,
            viewContent,
            chartType,
            handleChart,
            hasChartExport = true,
            chartView,
            sfciSortValue,
            sfci_sort_by,
            sfciSortName
        } = this.props;
        const { dataSource, totalValue, legendValues, isExporting } = this.state;
        const hasToggleView = currentTab === "Assets_Capital_Spending_Plan";
        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                {this.renderExportTypeModal()}
                <div className="tab-active">
                    <div className="chart-right-flt fil-item" id={"selectDropdownParent"}>
                        <div class="hed-section-gr col-md-5">
                            <h1 className="line">
                                {this.props.clientName && <span className="mb-2">{this.props.clientName} Asset Management</span>}
                                {this.renderHeading(currentTab)}
                            </h1>
                        </div>
                        <div className="right-chrt-sec">
                            {hasToggleView && (
                                <div className="right-section mr-2">
                                    <div className="min-tab-buttons">
                                        <button
                                            className={`${chartView[currentTab] === "pie" ? "active" : null}`}
                                            onClick={() => this.handleChartView("pie", currentTab)}
                                        >
                                            <i className="fas fa-chart-pie"></i>Summary View{" "}
                                        </button>
                                        <button
                                            className={`${chartView[currentTab] === "column" ? "active" : null}`}
                                            onClick={() => this.handleChartView("column", currentTab)}
                                        >
                                            <i>
                                                <img src="/img/detail-view.png" alt="" />
                                            </i>
                                            Detailed View{" "}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {currentTab === "SFCI" && (
                                <>
                                    <button
                                        type="button"
                                        className={
                                            sfci_sort_by === "name"
                                                ? "btn btn-outline-secondary ml-1 act-btn btn-chart-blue"
                                                : "btn btn-outline-secondary ml-1 btn-chart-blue"
                                        }
                                        onClick={() => {
                                            this.props.filterSfciChart("name", !sfciSortName);
                                        }}
                                    >
                                        Name
                                        {sfciSortName === false ? (
                                            <i className={`fas fa-long-arrow-alt-down table-param-rep`}></i>
                                        ) : sfciSortName === true ? (
                                            <i className={`fas fa-long-arrow-alt-up table-param-rep`}></i>
                                        ) : null}
                                    </button>
                                    <button
                                        type="button"
                                        className={
                                            sfci_sort_by === "value"
                                                ? "btn btn-outline-secondary mr-2 ml-2 act-btn btn-chart-blue"
                                                : "btn btn-outline-secondary mr-2 ml-2 btn-chart-blue"
                                        }
                                        onClick={() => {
                                            this.props.filterSfciChart("value", !sfciSortValue);
                                        }}
                                    >
                                        Value
                                        {sfciSortValue === false ? (
                                            <i className={`fas fa-long-arrow-alt-down table-param-rep`}></i>
                                        ) : sfciSortValue === true ? (
                                            <i className={`fas fa-long-arrow-alt-up table-param-rep`}></i>
                                        ) : null}
                                    </button>
                                </>
                            )}

                            <div className="selecbox-otr" id={"selectDropdown"}>
                                <div className="custom-selecbox">
                                    <select onChange={e => handleChart(e)} value={chartType}>
                                        {this.renderOptions(viewContent)}
                                    </select>
                                </div>
                            </div>
                            {hasChartExport ? (
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
                                            <Dropdown.Item onClick={() => this.convertToImage("png")}>Export to PNG</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.convertToImage("jpeg")}>Export to JPEG</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.exportChartFromServer("word")}>Export to Word</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.exportChartFromServer("pdf")}>Export to PDF</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.exportChartFromServer("ppt")}>Export to PPT</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.showExportTypeModal(true)}>Export Table Data</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            ) : null}
                            <a
                                className="nav-link min-mize icon-min-mize cursor-hand"
                                data-for="table-top-icons"
                                data-tip="Go Back To Dashboard"
                                data-place="left"
                                onClick={() => this.props.handleChartClick("dashboard")}
                            >
                                <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                <ReactTooltip id="table-top-icons" effect="solid" place="bottom" backgroundColor="#007bff" />
                            </a>
                        </div>
                    </div>
                    <div className={`chart-area`} id={"chartItem"}>
                        <div className="chart-ground">
                            <div className="top-hd">
                                {/* <div className="hed-section-gr d-flex">
                                    <h1 className="line">
                                        {this.props.clientName && <span className="mb-2">{this.props.clientName} Asset Management</span>}
                                        {this.renderHeading(currentTab)}
                                    </h1>
                                </div> */}

                                <div ref = {this.chartContainerRef} className="chart-img d-flex justify-content-center align-items-center">
                                    {dataSource && dataSource.series && dataSource.series.length ? (
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={dataSource}
                                            containerProps={{ style: { height: "350px", width: "800px" } }}
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
                            {dataSource && dataSource.series && dataSource.series.length && legendValues?.length ? (
                                <div className="chart-footer">
                                    <div className="row">
                                        <div className="col-md-9 bdt-left-style pr-0">
                                            <div className="result-list">
                                                <ul className="align-items-start">
                                                    {legendValues && legendValues.length
                                                        ? legendValues.map(cv => {
                                                              return (
                                                                  <li>
                                                                      <div className="">
                                                                          <strong>{cv.name}</strong>
                                                                          <p>
                                                                              {" "}
                                                                              <NumberFormat
                                                                                  value={
                                                                                      currentTab === "Assets_Capital_Spending_Plan"
                                                                                          ? parseFloat(cv.y / 1000000).toFixed(2)
                                                                                          : cv.y
                                                                                  }
                                                                                  thousandSeparator={true}
                                                                                  displayType={"text"}
                                                                                  suffix={currentTab === "Assets_Capital_Spending_Plan" ? "M" : ""}
                                                                                  prefix={currentTab === "Assets_Capital_Spending_Plan" ? "$" : ""}
                                                                              />{" "}
                                                                              - {cv.y ? Number(((cv.y / totalValue) * 100).toFixed(1)) : 0}%
                                                                          </p>
                                                                      </div>
                                                                  </li>
                                                              );
                                                          })
                                                        : null}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-3 bdt-right-style">
                                            <div className="result-total">
                                                <strong>
                                                    TOTAL =
                                                    <NumberFormat
                                                        value={
                                                            currentTab === "Assets_Capital_Spending_Plan"
                                                                ? parseFloat(totalValue / 1000000).toFixed(2)
                                                                : totalValue
                                                        }
                                                        suffix={currentTab === "Assets_Capital_Spending_Plan" ? "M" : ""}
                                                        prefix={currentTab === "Assets_Capital_Spending_Plan" ? "$" : ""}
                                                        thousandSeparator={true}
                                                        displayType={"text"}
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
            </LoadingOverlay>
        );
    }
}

export default ChartView;
