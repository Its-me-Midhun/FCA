import React, { Component } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import ReactTooltip from "react-tooltip";
import LabelModule from "highcharts/modules/series-label";
import GridLight from "highcharts/themes/grid-light";
import { Dropdown } from "react-bootstrap";
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Loader from "../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import { addEvents } from "./utils";
import moment from "moment";
import { getExportErrorMessage, thousandsSeparators } from "../../../config/utils";
import * as Service from "../../common/services";
import Portal from "../../common/components/Portal";
import SelectExportTypeWordModal from "../../common/components/SelectExportTypeWordModal";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as EnergyService from "../services";
highchartsMore(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
highcharts3d(Highcharts);
GridLight(Highcharts);
LabelModule(Highcharts);

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
        this.myChartRef = React.createRef();
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
        totalCostData: 0,
        isOpenColorCode: false,
        dataFilter: [],
        pieFilter: [],
        percentageValues: {},
        totalArr: [],
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
        if (prevState?.dataFilter.length !== this.state.dataFilter.length) {
            this.renderTotalValue(this.state.dataSource?.series);
        }
        if (prevState?.pieFilter !== this.state.pieFilter) {
            this.renderPercentagePie();
        }
        if (prevState?.dataSource !== this.state.dataSource) {
            const { currentTab: tabVal } = this.props;
            if (
                tabVal === "building_total_energy_cost" ||
                tabVal === "building_total_energy_usage" ||
                tabVal === "energy_unit_analysis" ||
                tabVal === "usage_analysis"
            ) {
                this.renderPercentagePie();
            }
            this.renderTotalValue(this.state.dataSource?.series);
        }
    };

    renderPercentagePie = () => {
        let data = this.state.dataSource?.series?.[0]?.data;
        let filtered = this.state.pieFilter;

        let sum = data?.filter(item => !filtered.includes(item?.name)).reduce((s, { y }) => s + y, 0);

        let result = data
            ?.filter(item => !filtered.includes(item?.name))
            .map(({ name, y }) => ({ name: name, percentage: ((y * 100) / sum).toFixed(1) }));

        let res = result?.length && Object.fromEntries(result?.map(Object.values));

        this.setState({
            percentageValues: res
        });

        this.renderTotalValue(this.state.dataSource?.series);
    };

    arrSum = arr => {
        const sum = arr.reduce((partialSum, a) => partialSum + a, 0);
        return parseFloat(sum?.toFixed(this.decimalFormatter(sum)));
    };

    renderTotalValue = arr => {
        let status = this.state.type;
        if (
            status === "building_total_energy_cost" ||
            status === "building_total_energy_usage" ||
            status === "energy_unit_analysis" ||
            status === "usage_analysis"
        ) {
            let tot = arr?.[0].data?.filter(x => !this.state.pieFilter.includes(x.name)).reduce((n, { y }) => n + y, 0);
            this.setState({
                totalAmount: parseFloat(tot?.toFixed(this.decimalFormatter(tot)))
            });
            return;
        }

        let tempArr = [];
        // eslint-disable-next-line no-unused-expressions
        arr?.filter(x => !this.state.dataFilter.includes(x?.name)).forEach(item => tempArr.push(this.arrSum(item?.data)));
        this.setState({
            totalAmount: this.arrSum(tempArr)
        });
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
            case "building_energy_star_ratings": {
                return "Rating";
            }
            case "cooling_degree_days": {
                return "Temperature (°F)";
            }
            case "heating_degree_days": {
                return "Temperature (°F)";
            }
            default:
                return "";
        }
    };

    renderFormatter = type => {
        if (
            type === "monthly_electricity_cost" ||
            type === "monthly_gas_cost" ||
            type === "monthly_total_energy_cost" ||
            type === "building_energy_cost_intensity" ||
            type === "site_energy_cost_intensity" ||
            type === "building_total_energy_cost" ||
            type === "energy_unit_analysis"
        ) {
            return "$";
        } else return "";
    };

    decimalFormatter = (val, tab) => {
        if (tab && tab === "building_energy_star_ratings") return 0;

        if (val < 1000) {
            return 2;
        } else return 0;
    };

    renderXData = graphTypeData => {
        const tempArr = [];
        const yrs = Object.keys(graphTypeData);
        yrs.forEach(item => tempArr.push(...Object.keys(Object.fromEntries(graphTypeData[item]))));

        return [...new Set(tempArr)].sort();
    };

    renderChartDetailsSecondary = (graphTypeData, showlabel, type) => {
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
                        fontSize: "10px",
                        fontFamily: "Poppins,sans-serif"
                    },
                    format: `${this.renderFormatter(type)} ${type !== "building_energy_star_ratings" ? "{point.y:,.2f}" : "{point.y}"}`
                }
            });
        });

        return tempSeries;
    };

    updateHide = val => {
        this.setState(prevState => ({
            dataFilter: [...prevState.dataFilter, val]
        }));
    };

    updateShow = val => {
        let tempArr = this.state.dataFilter;
        tempArr = tempArr.filter(item => item !== val);
        this.setState({
            dataFilter: tempArr
        });
    };

    filterPie = obj => {
        let tempArr = this.state.pieFilter;
        if (obj?.visible === false) {
            tempArr.push(obj?.name);
            tempArr = [...new Set(tempArr)];
        } else if (obj?.visible === true) {
            tempArr = tempArr.filter(item => {
                return item !== obj?.name;
            });
        }
        this.setState({
            pieFilter: tempArr
        });
    };

    renderChartData = () => {
        const { graphData, viewContent, currentTab, chartType } = this.props;
        let self = this;
        let graphTypeData = [];
        let dataSource = {};
        let chartTag = "";
        switch (currentTab) {
            case "monthly_electricity_cost": {
                graphTypeData = graphData["monthly_electricity_cost"];
                break;
            }
            case "building_energy_star_ratings": {
                graphTypeData = graphData["building_energy_star_ratings"];
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
            case "energy_unit_analysis": {
                graphTypeData = graphData["energy_unit_analysis"];
                chartTag = "Cost";
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
            (viewContent === "detailView" && currentTab === "monthly_electricity_cost") ||
            currentTab === "monthly_electricity_usage" ||
            currentTab === "monthly_gas_cost" ||
            currentTab === "monthly_gas_usage" ||
            currentTab === "monthly_total_energy_cost" ||
            currentTab === "monthly_total_energy_usage"
        ) {
            dataSource = {
                exporting: { enabled: false },
                chart: {
                    type: "column",
                    width: 1200,
                    height: 300,
                    options3d: {
                        enabled: chartType === "stackedcolumn3d" ? true : false,
                        alpha: 10,
                        beta: 10,
                        viewDistance: 15,
                        depth: 50
                    },
                    backgroundColor: "#FFFFFF",
                    style: {
                        fontFamily: "Poppins, sans-serif"
                    }
                },

                title: {
                    text: this.renderHeading(currentTab)
                },

                xAxis: [
                    {
                        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

                        labels: {
                            skew3d: true,
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
                        text: this.renderYtext(currentTab),
                        skew3d: true
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
                            return this.renderFormatter(currentTab) + (this.total / 1000000).toFixed(2) + "M";
                        }
                    }
                },

                tooltip: {
                    formatter: function () {
                        return `<b>${this.key}</b><br><span style="color:${this.series.color}">\u25CF</span> ${
                            this.series.name
                        }:${self.renderFormatter(currentTab)} ${thousandsSeparators(this.y.toFixed(self.decimalFormatter(this.y)))}`;
                    }
                },
                labels: {
                    formatter: function () {
                        return Highcharts.numberFormat(this.value, 2, ",", " ");
                    }
                },
                plotOptions: {
                    column: {
                        pointPadding: 5,
                        borderWidth: 1,
                        pointWidth: 10
                    },
                    series: {
                        events: {
                            hide: function ({ target: { userOptions } }) {
                                self.updateHide(userOptions?.name);
                            },
                            show: function ({ target: { userOptions } }) {
                                self.updateShow(userOptions?.name);
                            }
                        }
                    }
                },
                series: this.renderChartDetails(graphTypeData),
                legendView: "dash1"
            };
        } else if (
            (viewContent === "detailView" && currentTab === "building_energy_cost_intensity") ||
            currentTab === "building_energy_usage_intensity" ||
            currentTab === "site_energy_cost_intensity" ||
            currentTab === "site_energy_use_intensity" ||
            currentTab === "building_energy_star_ratings"
        ) {
            dataSource = {
                exporting: { enabled: false },
                chart: {
                    type: "column",
                    backgroundColor: "#FFFFFF",
                    style: {
                        fontFamily: "Poppins, sans-serif"
                    },
                    width: 1200,
                    height: 300,
                    options3d: {
                        enabled: chartType === "stackedcolumn3d" ? true : false,
                        alpha: 10,
                        beta: 10,
                        viewDistance: 15,
                        depth: 50
                    }
                },

                title: {
                    text: this.renderHeading(currentTab)
                },

                xAxis: [
                    {
                        categories: this.renderXData(graphTypeData),

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
                    ...(currentTab === "building_energy_star_ratings" && {
                        tickPositioner: function () {
                            var positions = [20, 40, 60, 80, 100];
                            return positions;
                        }
                    }),
                    title: {
                        text: this.renderYtext(currentTab),
                        skew3d: false,
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
                            return this.renderFormatter(currentTab) + (this.total / 1000000).toFixed(2) + "M";
                        }
                    }
                },

                tooltip: {
                    formatter: function () {
                        return `<b>${this.key}</b><br><span style="color:${this.series.color}">\u25CF</span> ${
                            this.series.name
                        }:${self.renderFormatter(currentTab)} ${thousandsSeparators(this.y.toFixed(self.decimalFormatter(this.y, currentTab)))}`;
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
                    },
                    series: {
                        events: {
                            hide: function ({ target: { userOptions } }) {
                                self.updateHide(userOptions?.name);
                            },
                            show: function ({ target: { userOptions } }) {
                                self.updateShow(userOptions?.name);
                            }
                        }
                    }
                },
                series: this.renderChartDetailsSecondary(
                    graphTypeData,
                    currentTab === "site_energy_cost_intensity" || currentTab === "site_energy_use_intensity" ? true : false,
                    currentTab
                ),
                legendView: "dash2"
            };
        } else if (
            (viewContent === "detailView" && currentTab === "building_total_energy_cost") ||
            currentTab === "building_total_energy_usage" ||
            currentTab === "energy_unit_analysis" ||
            currentTab === "usage_analysis"
        ) {
            dataSource = {
                exporting: { enabled: false },
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: "pie",
                    height: 400,
                    style: {
                        fontFamily: "Poppins, sans-serif"
                    },
                    options3d: {
                        enabled: chartType === "stackedcolumn3d" ? true : false,
                        alpha: 45,
                        beta: 0
                    },
                    events: {
                        load: ({ target: { series } }) => {
                            let tempObj = {};
                            // eslint-disable-next-line no-unused-expressions
                            series[0].points?.forEach(item => (tempObj[item?.name] = item?.percentage.toFixed(1)));
                            self.setState({
                                percentageValues: tempObj
                            });
                        }
                    }
                },

                title: {
                    text: this.renderHeading(currentTab)
                },

                tooltip: {
                    style: {
                        fontSize: "13.5px"
                    },
                    formatter: function () {
                        return `<b>${this.key}</b> : ${this.point.percentage.toFixed(1)} %<br><span style="color:${this.color}">\u25CF</span> ${
                            this.series.name
                        }:${self.renderFormatter(currentTab)} ${thousandsSeparators(this.y.toFixed(self.decimalFormatter(this.y)))}`;
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
                        depth: 35,
                        showInLegend: true,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: "bold",
                                fontSize: "12.5px"
                            },
                            formatter: function () {
                                return `<b>${this.point.name}: ${this.point.percentage.toFixed(1)} %</b><br> <span style="color:${
                                    this.color
                                }"></span>${this.series.name}: ${self.renderFormatter(currentTab)} ${thousandsSeparators(
                                    this.y.toFixed(self.decimalFormatter(this.y))
                                )}`;
                            }
                        },

                        point: {
                            events: {
                                legendItemClick: event => {
                                    if (event.target?.options?.visible === undefined) {
                                        this.filterPie({ name: event.target?.name, visible: false });
                                    } else if (event.target?.options?.visible === false) {
                                        this.filterPie({ name: event.target?.name, visible: true });
                                    } else this.filterPie({ name: event.target?.name, visible: false });
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
        } else {
            dataSource = {
                exporting: { enabled: false },
                chart: {
                    type: "line",
                    backgroundColor: "#FFFFFF",
                    height: 300,
                    style: {
                        fontFamily: "Poppins, sans-serif"
                    },
                    options3d: {
                        enabled: chartType === "stackedcolumn3d" ? true : false,
                        alpha: 10,
                        beta: 10,
                        viewDistance: 15,
                        depth: 50
                    }
                },

                title: {
                    text: this.renderHeading(currentTab)
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
                        }:${self.renderFormatter(currentTab)} ${thousandsSeparators(this.y.toFixed(self.decimalFormatter(this.y)))}`;
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
                        },
                        events: {
                            hide: function ({ target: { userOptions } }) {
                                self.updateHide(userOptions?.name);
                            },
                            show: function ({ target: { userOptions } }) {
                                self.updateShow(userOptions?.name);
                            }
                        }
                    }
                },
                series: graphTypeData,
                legendView: "dash1"
            };
        }
        this.setState({
            dataSource,
            type: currentTab
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

    convertToImage = (imgType, tab) => {
        this.setState({ isExporting: true });
        let self = this;
        let userName = localStorage.getItem("user");
        let name = `${this.renderHeading(tab)}_${userName}_${moment().format("MM_DD_YYYY HH_mm_ss")}`;
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

    setColor = value => {
        const { colorCodes } = this.props;
        let colorCode = "";
        colorCodes &&
            colorCodes.length &&
            colorCodes.map(color => (value >= color.range_start && value <= color.range_end ? (colorCode = color.code) : ""));
        return colorCode;
    };

    setColoCode = async () => {
        this.setState({
            isOpenColorCode: !this.state.isOpenColorCode
        });
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

    hideTotal = () => {
        let status = this.state.type;
        let filtered = [
            "building_energy_cost_intensity",
            "building_energy_usage_intensity",
            "site_energy_cost_intensity",
            "site_energy_use_intensity",
            "building_energy_star_ratings"
        ];
        return !filtered.includes(status);
    };

    pieStatus = () => {
        let status = this.state.type;
        let filtered = ["building_total_energy_cost", "building_total_energy_usage", "energy_unit_analysis", "usage_analysis"];
        return filtered.includes(status);
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
            case "building_energy_cost_intensity":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Building Breakdown Energy Cost Index ($ per SF)`
                    : "Current Entity Building Breakdown Energy Cost Intensity ($ per SF)";
            case "building_energy_usage_intensity":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Building Breakdown Energy Use Intensity (kBTU per SF)`
                    : "Current Entity Building Breakdown Energy Use Intensity (kBTU per SF)";
            case "site_energy_cost_intensity":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Site Breakdown Energy Cost Index ($ per SF)`
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
                    : "Current Entity Annual Average  Building Breakdown Total Energy Usage (kBTU)";
            case "energy_unit_analysis":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Annual Average Energy Unit Cost Analysis ($ per MMBTU)`
                    : "Current Entity Annual Average Energy Unit Cost Analysis ($ per MMBTU)";
            case "usage_analysis":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Annual Average Energy Unit Usage Analysis (kBTU)`
                    : "Annual Average Energy Unit Usage Analysis (kBTU)";
            case "building_energy_star_ratings":
                return this.renderHeaderDetails()
                    ? `${this.renderHeaderDetails()} Energy Star Rating Analysis`
                    : "Annual Average Energy Unit Usage Analysis (kBTU)";
            default:
                return null;
        }
    };

    getGraphDataForExport = () => {
        const { graphData, currentTab } = this.props;
        let graphTypeData = {};
        switch (currentTab) {
            case "monthly_electricity_cost": {
                graphTypeData = graphData["monthly_electricity_cost"];
                break;
            }
            case "building_energy_star_ratings": {
                graphTypeData = graphData["building_energy_star_ratings"];
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
                break;
            }
            case "building_total_energy_usage": {
                graphTypeData = graphData["building_total_energy_usage"];
                break;
            }
            case "energy_unit_analysis": {
                graphTypeData = graphData["energy_unit_analysis"];
                break;
            }
            case "usage_analysis": {
                graphTypeData = graphData["usage_analysis"];
                break;
            }

            default:
                break;
        }
        return graphTypeData;
    };

    exportChartFromServer = async type => {
        try {
            if (this.myChartRef) {
                let self = this;
                this.setState({ isExporting: true });
                const { currentTab } = this.props;
                const resp = await Service.getActiveChartProperties({ client_id: this.props.clientDetails?.id });
                const { legend, x_axis, y_axis, data_labels } = resp?.data?.properties;
                let svg = this.myChartRef.getSVG({
                    chart: { height: 400, width: 666 },
                    credits: { enabled: false },
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
                        column: {
                            dataLabels: {
                                enabled: currentTab === "site_energy_use_intensity" || currentTab === "site_energy_cost_intensity" ? true : false,
                                style: {
                                    fontWeight: "bold",
                                    fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : "",
                                    color: data_labels?.color ? `#${data_labels?.color}` : ""
                                }
                            }
                        },
                        series: {
                            label: {
                                connectorAllowed: false,
                                style: {
                                    fontWeight: "bold",
                                    fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : ""
                                }
                            }
                        }
                    },
                    xAxis: [
                        {
                            categories:
                                currentTab === "monthly_electricity_cost" ||
                                currentTab === "monthly_electricity_usage" ||
                                currentTab === "monthly_gas_cost" ||
                                currentTab === "monthly_gas_usage" ||
                                currentTab === "monthly_total_energy_cost" ||
                                currentTab === "monthly_total_energy_usage" ||
                                currentTab === "cooling_degree_days" ||
                                currentTab === "heating_degree_days"
                                    ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                    : currentTab === "building_total_energy_usage" ||
                                      currentTab === "usage_analysis" ||
                                      currentTab === "building_total_energy_cost" ||
                                      currentTab === "energy_unit_analysis"
                                    ? []
                                    : this.renderXData(this.getGraphDataForExport()),

                            labels: {
                                skew3d: true,
                                rotation: 0,
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
                                text: this.renderYtext(currentTab),
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
                                }
                            }
                        }
                    ]
                });
                const userName = localStorage.getItem("user");
                const blob = new Blob([svg], { type: "image/svg+xml" });
                const heading = this.renderHeading(currentTab).split("/");
                let formData = new FormData();
                formData.append("image", blob);
                formData.append("heading", JSON.stringify(heading));
                formData.append("client_id", this.props.clientDetails?.id);
                formData.append("username", userName);
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

    getMasterFilters = () => {
        const {
            masterFilters: { building_types, ...rest },
            chartEnergyReducer: { getBuildingTypeFilter }
        } = this.props;
        if (building_types?.length && getBuildingTypeFilter?.building_types?.length) {
            rest.building_type_ids = getBuildingTypeFilter?.building_types
                .filter(bu => building_types.find(elem => elem === bu.name))
                .map(elem => elem.id);
        }
        return rest;
    };

    exportDataTable = async file_type => {
        try {
            this.setState({ isExporting: true });
            const { clientDetails } = this.props;
            const userName = localStorage.getItem("user");
            const masterFilters = this.getMasterFilters();
            let params = {
                chart_type: this.getExportType(),
                user_name: userName,
                client_id: clientDetails?.id,
                ...masterFilters
            };
            let res = {};
            res = file_type === "excel" ? await EnergyService.exportDataTableToExcel(params) : await EnergyService.exportDataTableToWord(params);
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

    getExportType = () => {
        const { dataView, currentTab } = this.props;
        let export_type = "";
        switch (currentTab) {
            case "building_energy_usage_intensity":
                export_type = "building_breakdown_energy_intensity";
                break;
            case "building_total_energy_usage":
                export_type = "building_breakdown_total_energy";
                break;
            case "site_energy_use_intensity":
                export_type = "site_breakdown_energy_intensity";
                break;
            case "usage_analysis":
                export_type = "energy_unit_usage";
                break;
            default:
                return "";
        }
        return export_type;
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
        const { currentTab, viewContent, chartType, handleChart, closeHandler, hasChartExport = true } = this.props;
        const { dataSource, totalAmount, percentageValues, dataFilter, pieFilter, isExporting } = this.state;

        return (
            <LoadingOverlay
                active={this.props.loading || this.props.isLoading || this.state.hasLoading || this.props.efciLoading}
                spinner={<Loader />}
                fadeSpeed={10}
            >
                <div className="tab-active">
                    {this.renderExportTypeModal()}
                    <div className="chart-right-flt fil-item custom-fil-item" id={"selectDropdownParent"}>
                        {dataSource && dataSource.title?.text ? (
                            <div className="hed-section-gr d-flex col-md-5">
                                <h1 className="line">
                                    {dataSource.title?.text.split("/")[0]}
                                    <br />
                                    {dataSource.title?.text.split("/")[1]}
                                </h1>
                            </div>
                        ) : null}

                        <div className="d-flex">
                            <div className="selecbox-otr" id={"selectDropdown"}>
                                <label>Chart Type</label>
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
                                            <Dropdown.Item onClick={() => this.convertToImage("png", currentTab)}>Export to PNG</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.convertToImage("jpeg", currentTab)}>Export to JPEG</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.exportChartFromServer("word")}>Export to Word</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.exportChartFromServer("pdf")}>Export to PDF</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.exportChartFromServer("ppt")}>Export to PPT</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.showExportTypeModal(true)}>Export Table Data</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            ) : null}
                            {currentTab === "building_energy_star_ratings" ? null : (
                                <a
                                    className="nav-link min-mize icon-min-mize cursor-hand"
                                    data-for="table-top-icons"
                                    data-tip="Go Back To Dashboard"
                                    data-place="left"
                                    onClick={() => closeHandler(currentTab)}
                                >
                                    <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                    <ReactTooltip id="table-top-icons" effect="solid" place="bottom" backgroundColor="#007bff" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className={`chart-area ${currentTab == "all" ? "chart-coming-soon" : ""}`} id={"chartItem"} ref={this.chartRef}>
                        {currentTab != "all" ? (
                            <>
                                <div className="chart-ground">
                                    <div className={`top-hd ${!this.pieStatus() ? "custom-chart-tophd" : "custom-chart-tophd-pie"}`}>
                                        <div className="chart-img d-flex justify-content-center align-items-center">
                                            {dataSource && dataSource.series && dataSource.series.length ? (
                                                <HighchartsReact
                                                    highcharts={Highcharts}
                                                    options={{
                                                        ...dataSource,
                                                        title: {
                                                            text: ""
                                                        }
                                                    }}
                                                    containerProps={{ style: { height: "500px", width: "1200px" } }}
                                                    allowChartUpdate
                                                    callback={chart => {
                                                        addEvents(Highcharts, chart);
                                                        if (!chart.renderer?.forExport) {
                                                            this.myChartRef = chart;
                                                        }
                                                    }}
                                                    ref={this.myChartRef}
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
                                            <div className="row  d-flex justify-content-center align-items-center mt-2">
                                                <div className="col-md-12 pr-0">
                                                    <div className="result-list tg-view-container">
                                                        {dataSource.series && dataSource.series.length
                                                            ? (() => {
                                                                  switch (dataSource?.legendView) {
                                                                      case "dash1":
                                                                          return (
                                                                              <>
                                                                                  <table class="tg-table">
                                                                                      <thead>
                                                                                          <tr>
                                                                                              <th class="tg-table-x"></th>
                                                                                              <th class="tg-table-x">Jan</th>
                                                                                              <th class="tg-table-x">Feb</th>
                                                                                              <th class="tg-table-x">Mar</th>
                                                                                              <th class="tg-table-x">Apr</th>
                                                                                              <th class="tg-table-x">May</th>
                                                                                              <th class="tg-table-x">Jun</th>
                                                                                              <th class="tg-table-x">Jul</th>
                                                                                              <th class="tg-table-x">Aug</th>
                                                                                              <th class="tg-table-x">Sep</th>
                                                                                              <th class="tg-table-x">Oct</th>
                                                                                              <th class="tg-table-x">Nov</th>
                                                                                              <th class="tg-table-x">Dec</th>
                                                                                              <th class="tg-table-x">Total</th>
                                                                                          </tr>
                                                                                      </thead>
                                                                                      <tbody>
                                                                                          {dataSource.series
                                                                                              .filter(item => !dataFilter.includes(item?.name))
                                                                                              .map(x => (
                                                                                                  <tr>
                                                                                                      <td className="tg-table-year">{x?.name}</td>
                                                                                                      {x.data.map(y => (
                                                                                                          <td className="tg-table-ax">
                                                                                                              {y?.y
                                                                                                                  ? `${this.renderFormatter(
                                                                                                                        this.state.type
                                                                                                                    )} ${thousandsSeparators(
                                                                                                                        y?.y.toFixed(
                                                                                                                            this.decimalFormatter(y)
                                                                                                                        )
                                                                                                                    )}`
                                                                                                                  : `${this.renderFormatter(
                                                                                                                        this.state.type
                                                                                                                    )} ${thousandsSeparators(
                                                                                                                        parseFloat(
                                                                                                                            y.toFixed(
                                                                                                                                this.decimalFormatter(
                                                                                                                                    y
                                                                                                                                )
                                                                                                                            )
                                                                                                                        )
                                                                                                                    )}`}
                                                                                                          </td>
                                                                                                      ))}

                                                                                                      <td className="tg-table-total">
                                                                                                          {`${this.renderFormatter(
                                                                                                              this.state.type
                                                                                                          )} ${thousandsSeparators(
                                                                                                              this.arrSum(x.data)
                                                                                                          )}`}
                                                                                                      </td>
                                                                                                  </tr>
                                                                                              ))}
                                                                                      </tbody>
                                                                                  </table>
                                                                              </>
                                                                          );
                                                                      case "dash2":
                                                                          const [dash2obj] = dataSource.xAxis;
                                                                          return (
                                                                              <table class="tg-table">
                                                                                  <thead>
                                                                                      <tr>
                                                                                          <th class="tg-table-x"></th>
                                                                                          {dash2obj?.categories.map(item => (
                                                                                              <th class="tg-table-x">{item}</th>
                                                                                          ))}
                                                                                      </tr>
                                                                                  </thead>
                                                                                  <tbody>
                                                                                      {dataSource.series
                                                                                          .filter(item => !dataFilter.includes(item?.name))
                                                                                          .map(x => (
                                                                                              <tr>
                                                                                                  <td class="tg-table-year">{x?.name}</td>
                                                                                                  {x.data.map(y => (
                                                                                                      <td class="tg-table-ax">
                                                                                                          {y?.y
                                                                                                              ? `${this.renderFormatter(
                                                                                                                    this.state.type
                                                                                                                )} ${thousandsSeparators(
                                                                                                                    y?.y.toFixed(
                                                                                                                        this.decimalFormatter(y)
                                                                                                                    )
                                                                                                                )}`
                                                                                                              : `${this.renderFormatter(
                                                                                                                    this.state.type
                                                                                                                )} ${thousandsSeparators(
                                                                                                                    parseFloat(
                                                                                                                        y.toFixed(
                                                                                                                            this.decimalFormatter(y)
                                                                                                                        )
                                                                                                                    )
                                                                                                                )}`}
                                                                                                      </td>
                                                                                                  ))}
                                                                                              </tr>
                                                                                          ))}
                                                                                  </tbody>
                                                                              </table>
                                                                          );
                                                                      case "dash3":
                                                                          return (
                                                                              <table class="tg-table">
                                                                                  <thead>
                                                                                      <tr>
                                                                                          {dataSource?.series[0]?.data
                                                                                              ?.filter(x => x && !pieFilter.includes(x.name))
                                                                                              ?.map(
                                                                                                  item =>
                                                                                                      item?.name && (
                                                                                                          <th class="tg-table-x">{`${item?.name}: ${
                                                                                                              percentageValues?.[item?.name]
                                                                                                          } %`}</th>
                                                                                                      )
                                                                                              )}
                                                                                      </tr>
                                                                                  </thead>
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          {dataSource.series[0].data
                                                                                              .filter(x => !pieFilter.includes(x.name))
                                                                                              .map(item => (
                                                                                                  <td class="tg-table-ax">
                                                                                                      {item?.y &&
                                                                                                          `${this.renderFormatter(
                                                                                                              this.state.type
                                                                                                          )} ${thousandsSeparators(
                                                                                                              parseFloat(
                                                                                                                  item?.y.toFixed(
                                                                                                                      this.decimalFormatter(item?.y)
                                                                                                                  )
                                                                                                              )
                                                                                                          )}`}
                                                                                                  </td>
                                                                                              ))}
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          );

                                                                      default:
                                                                          break;
                                                                  }
                                                              })()
                                                            : null}
                                                    </div>
                                                    {this.hideTotal() && (
                                                        <div className="col-md-12">
                                                            <div className="result-total">
                                                                <strong>
                                                                    TOTAL =
                                                                    <span>{`${this.renderFormatter(this.state.type)} ${thousandsSeparators(
                                                                        totalAmount
                                                                    )}`}</span>
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    )}
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
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { chartEnergyReducer } = state;
    return {
        chartEnergyReducer
    };
};
export default withRouter(connect(mapStateToProps, {})(ChartView));
