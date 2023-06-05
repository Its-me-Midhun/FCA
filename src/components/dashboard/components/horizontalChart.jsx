import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import * as htmlToImage from "html-to-image";
import NumberFormat from "react-number-format";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import * as Service from "../../common/services";
import { getExportErrorMessage, thousandsSeparators } from "../../../config/utils";
import ReactTooltip from "react-tooltip";
import dashboardAction from "../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SelectExportTypeWordModal from "../../common/components/SelectExportTypeWordModal";
import Portal from "../../common/components/Portal";
import ReactSelect from "react-select";
require("highcharts/modules/exporting")(Highcharts);
highchartsMore(Highcharts);
highcharts3d(Highcharts);
Highcharts.setOptions({
    lang: {
        thousandsSep: ","
    }
});

class FcaChart extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.chartContainerRef = React.createRef();
        this.observer = null;
    }
    state = {
        datasource: {},
        legendArray: [],
        total: 0,
        isFullscreen: this.props.isFullScreen === "horizontal_chart" ? true : false,
        showHorizontalData: "",
        labelValue: [],
        isSelectedOne: false,
        currentPosition: null,
        isExporting: false,
        showExportTypeModal: false
    };
    componentDidMount = async () => {
        if (this.props.popUpData.showHorizontalData) {
            this.setState(
                {
                    currentHorizontal: this.props.popUpData.currentHorizontal,
                    currentPosition: this.props.popUpData.currentPosition,
                    isSelectedOne: this.props.popUpData.isSelectedOne
                },
                async () => await this.renderChartData()
            );
        } else {
            await this.renderChartData();
        }
        try {
            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === "attributes" && mutation.attributeName === "class") {
                        let currentElement1 = this.chartContainerRef?.current?.parentNode;
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

    componentWillUnmount() {
        this.observer.disconnect();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.horizontalChartArray !== this.props.horizontalChartArray) {
            await this.renderChartData();
            await Highcharts.charts.map(chart => {
                let count = this.state.isFullscreen ? 8 : 5;
                if (chart && chart.userOptions.chart.name === "horizontal_chart") {
                    chart.xAxis[0].setExtremes(0, this.state.labelValues.length > count ? count : null);
                }
            });
        }
        if (prevProps.showHorizontalData !== this.props.showHorizontalData) {
            if (!this.props.showHorizontalData) {
                this.setState({
                    currentHorizontal: "",
                    isSelectedOne: true,
                    currentPosition: null
                });
            }
        }
        if (prevState.isSelectedOne !== this.state.isSelectedOne) {
            await this.renderChartData();
        }
    };

    renderChartData = () => {
        let dataSource = {};
        let rtrnValue = {};
        let holder = {};
        let holderName = {};
        let chartValues = [];
        let data = [];
        let legendArray = [];
        let labelValues = [];
        let testArray = [];
        let graphData = this.props.horizontalChartArray;
        graphData &&
            graphData.value &&
            graphData.value.length &&
            graphData.value.map(gd => {
                labelValues.push(gd.name);
                testArray.push(gd.data);
            });
        let testValues = [];
        let mergedDataArray = [];
        testArray && testArray.length && testArray.map(gd => gd.map(t => mergedDataArray.push(t)));
        let mergedArray = [].concat.apply([], mergedDataArray);

        mergedArray.forEach(function (d) {
            if (holder.hasOwnProperty(d.name)) {
                holder[d.name] = [...holder[d.name], d.amount];
            } else {
                holder[d.name] = [d.amount];
            }
        });

        let totalArray = mergedArray;
        totalArray &&
            totalArray.length &&
            totalArray.forEach(function (d) {
                if (holderName.hasOwnProperty(d.name)) {
                    holderName[d.name] = holderName[d.name] + d.amount;
                } else {
                    holderName[d.name] = d.amount;
                }
            });

        for (var prop in holder) {
            legendArray.push({ name: prop, y: holderName[prop] });
        }

        let chart_keys = [];
        let chartValue = [];
        let siteKeys = [];
        graphData && graphData.value && graphData.value.map(x => x.data.map(y => (chart_keys.includes(y.name) ? "" : chart_keys.push(y.name))));
        graphData && graphData.value && graphData.value.length && graphData.value.map(x => siteKeys.push(x.site));
        let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0);
        let currentTotal = sumOfAllValues;
        let final_array = [];
        chart_keys.map(x => (final_array[x] = []));
        chart_keys.map(k =>
            graphData.value.map(x =>
                x.data.map(y => y.name).includes(k) ? x.data.map(z => (z.name == k ? final_array[k].push(z.amount) : "")) : final_array[k].push(0)
            )
        );
        let colorValues = {};
        graphData?.value?.length &&
            graphData.value.forEach(elem => {
                elem.data.forEach(dat => {
                    if (!colorValues.hasOwnProperty(dat.name)) {
                        colorValues[dat.name] = dat?.color;
                    }
                });
            });
        for (var prop in final_array) {
            chartValue.push({
                name: prop,
                data: final_array[prop],
                color: colorValues[prop]
            });
        }

        dataSource = {
            exporting: {
                enabled: false
            },
            chart: {
                name: "horizontal_chart",
                type: "bar",
                style: {
                    fontFamily: "Poppins, sans-serif"
                },
                marginLeft: 90,
                animation: this.props.viewContent && this.props.viewContent !== "horizontal_chart" ? false : true,
                backgroundColor: "#FFFFFF"

                // animation: {
                //     duration: 1000
                // },

                // height: this.state.fullScreen ? 450 : 300,
                // width: this.state.fullScreen ? 800 : 500,
            },
            title: {
                text: ""
            },
            colors: [
                "#0018A8",
                "#bada55",
                "#66FF00",
                "#800080",
                "#3E8EDE",
                "#00bfff",
                "#7B68EE",
                "#7fe5f0",
                "#8a2be2",
                "#407294",
                "#5ac18e",
                "#576675",
                "#008080",
                "#ffd700",
                "#7CFC00",
                "#ffa500",
                "#00ffff",
                "#40e0d0",
                "#0000ff",
                "#b0e0e6",
                "#c6e2ff",
                "#003366",
                "#7fffd4",
                "#00ff00",
                "#4ca3dd",
                "#468499",
                "#00ced1",
                "#6897bb"
            ],
            xAxis: {
                categories: labelValues,
                scrollbar: {
                    enabled: this.state.isFullscreen
                        ? labelValues && labelValues.length > 8
                            ? true
                            : false
                        : labelValues && labelValues.length > 5
                        ? true
                        : false
                },
                labels: {
                    enabled: true,

                    style: {
                        cursor: "pointer"
                    },
                    formatter: item => {
                        const color = this.state.currentHorizontal === item.value && this.state.currentPosition == item.pos ? "#007bff" : "black";
                        const fontWeight = this.state.currentHorizontal === item.value && this.state.currentPosition == item.pos ? "bold" : "normal";
                        return `<span style="color: ${color}; font-weight: ${fontWeight}" onClick={}>${item.value}</span>`;
                    }
                },

                min: 0,
                max: this.state.isFullscreen ? (labelValues && labelValues.length > 8 ? 8 : null) : labelValues && labelValues.length > 5 ? 5 : null
                // events: {
                //     afterSetExtremes: function () {
                //         var xAxis = this,
                //             numberOfPoints = xAxis.series[0].points.length - 1,
                //             minRangeValue = xAxis.getExtremes().min,
                //             maxRangeValue = xAxis.getExtremes().max;

                //         if (minRangeValue < 0) {
                //             xAxis.setExtremes(null, xAxis.options.max);
                //         } else if (maxRangeValue > numberOfPoints) {
                //             xAxis.setExtremes(numberOfPoints - xAxis.options.max, numberOfPoints);
                //         }
                //     }
                // },
            },
            yAxis: {
                min: 0,
                title: {
                    text: ""
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
                }
            },
            legend: {
                enabled: this.state.isFullscreen ? true : false
            },
            tooltip: {
                formatter: function () {
                    let currentData =
                        graphData && graphData.value && graphData.value.length && graphData.value.find(gd => gd.name == this.point.category);
                    // if (currentData) {
                    var s =
                        currentData && currentData.building_type
                            ? "<b>" + this.point.category + " ( " + currentData.building_type + " ) " + "</b>"
                            : "<b>" + this.point.category + "</b>";
                    if (currentData != null && currentData.hospital_name)
                        s += `<br/><span>Parent Building :  ${currentData != null ? currentData.hospital_name : ""} </span>`;
                    if (siteKeys && siteKeys[this.point.index]) s += `<br/><span>Site :  ${siteKeys ? siteKeys[this.point.index] : ""} </span>`;
                    // }

                    s += `<br/><span> ` + this.point.series.name + (" : $ " + (this.y / 1000000).toFixed(2) + "M");
                    if (currentData && currentData.description != null)
                        s += `<br/><span>Description :  ${currentData && currentData.description != null ? currentData.description : ""} </span>`;
                    s += `<br/><span style="color:{series.color}">\u25CF</span> Click To View Details</span>`;
                    return s;
                }
            },

            plotOptions: {
                series: {
                    stacking: "normal",
                    events: {
                        legendItemClick: event => {
                            var sumOfCurrentLegend = event.target.yData.reduce(function (a, b) {
                                return a + b;
                            }, 0);
                            legendArray = [...this.state.legendArray];
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
                                legendArray,
                                currentTotal
                            });
                        }
                    },
                    point: {
                        events: {
                            click: event => {
                                let category = event.point.category;
                                this.setState({
                                    currentHorizontal: event.point.category,
                                    currentPosition: event.point.index,
                                    isSelectedOne: false
                                });
                                let currentData =
                                    this.props.horizontalChartArray?.value?.length &&
                                    this.props.horizontalChartArray.value.find(gd => gd.name === category);
                                this.props.viewDetails(event.point, currentData, false, event.point.category, event.point.index);
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
            series: chartValue
        };
        this.setState({
            dataSource,
            legendArray,
            currentTotal,
            labelValues
        });
    };

    handleFullView = () => {
        this.setState(
            {
                isFullscreen: !this.state.isFullscreen
            },
            async () => {
                this.props.handleViewDetails("horizontal_chart");
                if (!this.state.isFullscreen) {
                    Highcharts.charts.map(chart => {
                        if (chart && chart.userOptions.chart.name === "horizontal_chart") {
                            while (chart.series.length > 0) chart.series[0].remove(true);
                        }
                    });
                }
                await this.renderChartData();

                Highcharts.charts.map(chart => {
                    chart && chart.reflow();
                });
                if (!this.state.isFullscreen) {
                    Highcharts.charts.map(chart => {
                        if (chart && chart.userOptions.chart.name === "horizontal_chart")
                            chart.xAxis[0].setExtremes(0, this.state.labelValues.length > 5 ? 5 : null);
                    });
                } else {
                    Highcharts.charts.map(chart => {
                        if (chart && chart.userOptions.chart.name === "horizontal_chart")
                            chart.xAxis[0].setExtremes(0, this.state.labelValues.length > 8 ? 8 : null);
                    });
                }
            }
        );
    };

    convertToImage = imgType => {
        this.setState({ isExporting: true });
        let self = this;
        let name = this.props.renderHeading("horizontal_chart");
        if (imgType === "jpeg") {
            htmlToImage.toJpeg(document.getElementById("chartItem-horizontal"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.jpeg`;
                link.href = dataUrl;
                link.click();
                link.remove();
                self.setState({ isExporting: false });
            });
        } else if (imgType === "png") {
            htmlToImage.toPng(document.getElementById("chartItem3"), { quality: 0.95 }).then(function (dataUrl) {
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
            htmlToImage.toSvgDataURL(document.getElementById("chartItem3"), { filter: filter }, { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = "chart.svg";
                link.href = dataUrl;
                link.click();
                link.remove();
                self.setState({ isExporting: false });
            });
        }
    };

    exportChartFromServer = async type => {
        try {
            if (this.chartRef) {
                this.setState({ isExporting: true });
                const { horizontalChartArray, individualFilters, dashboardFilterParams } = this.props;
                const { currentTotal, legendArray } = this.state;
                const userName = localStorage.getItem("user");
                const heading = [this.renderChartHeading()];
                let totalYears = this.props.getTotalYears();
                const export_type =
                    individualFilters.horizontal_chart_type?.split("_")[0] === "system"
                        ? individualFilters.horizontal_chart_type?.split("_")[0]
                        : individualFilters.horizontal_chart_type;
                const trade_ids = export_type === "system" ? [individualFilters.horizontal_chart_type?.split("_")[1]] : [];
                //formatted legends
                const legends = legendArray.map(item => ({
                    name: item.name,
                    y: `$ ${thousandsSeparators(parseFloat(item.y / 1000000).toFixed(2))}M`,
                    percentage: `${item.y ? Number(((item.y / currentTotal) * 100).toFixed(1)) : 0}%`
                }));

                // formatted total value
                const total = `$ ${thousandsSeparators(parseFloat((currentTotal ? currentTotal : 1) / 1000000).toFixed(2))}M`;
                const projectId = horizontalChartArray?.value?.every(item => item?.project_id === horizontalChartArray?.value[0]?.project_id)
                    ? horizontalChartArray?.value[0]?.project_id
                    : "";
                const projectName = projectId ? horizontalChartArray?.value[0]?.project_name : "";
                projectName && heading.splice(0, 0, projectName);

                const resp = await Service.getActiveChartProperties({ project_id: projectId });
                const { legend, x_axis, y_axis, data_labels } = resp?.data?.properties;
                let svg = this.chartRef.getSVG({
                    chart: { height: 500, width: 832 },
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
                    credits: { enabled: false },
                    xAxis: [
                        {
                            categories: this.chartRef?.xAxis[0]?.categories,

                            labels: {
                                enabled: true,

                                style: {
                                    cursor: "pointer",
                                    fontSize: x_axis?.font_size ? `${x_axis?.font_size}px` : "",
                                    color: x_axis?.color ? `#${x_axis?.color}` : ""
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
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
                            allowDecimals: false,
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: "bold",
                                    // format: '$ {point.y:.1f}',
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
                const blob = new Blob([svg], { type: "image/svg+xml" });
                const filter = {
                    project_ids: dashboardFilterParams?.project_ids?.length ? dashboardFilterParams?.project_ids : projectId ? [projectId] : [],
                    region_ids: dashboardFilterParams.region_ids || [],
                    site_ids: dashboardFilterParams.site_ids || [],
                    building_ids: dashboardFilterParams.building_ids || []
                };
                let formData = new FormData();
                formData.append("image", blob);
                formData.append("heading", JSON.stringify(heading));
                formData.append("legend", JSON.stringify(legends));
                total && formData.append("total", total);
                formData.append("project_id", projectId);
                formData.append("username", userName);
                formData.append("chart_type", "horizontal_chart");
                formData.append("export_type", export_type);
                formData.append("display", individualFilters.display);
                formData.append("years", totalYears);
                if (trade_ids?.length) {
                    formData.append("trade_ids", JSON.stringify(trade_ids));
                }
                formData.append("filter", JSON.stringify(filter));
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

    exportToExcel = async () => {
        this.setState({ isExporting: true });
        await this.props.exportToExcel("horizontalChart");
        this.setState({ isExporting: false });
    };
    renderChartHeading = () => {
        const noOfYears = this.props.getTotalYears();
        const { individualFilters } = this.props;
        const drop1 =
            individualFilters.display === "building"
                ? "Building"
                : individualFilters.display === "site"
                ? "Site"
                : individualFilters.display === "region"
                ? "Region"
                : individualFilters.display === "project"
                ? "Project"
                : "";

        const drop2 =
            individualFilters.horizontal_chart_type === "categories"
                ? "Category"
                : individualFilters.horizontal_chart_type === "trades"
                ? "Trade"
                : individualFilters.horizontal_chart_type === "funding_sources"
                ? "Funding Source"
                : individualFilters.horizontal_chart_type === "priorities"
                ? "Term"
                : individualFilters.horizontal_chart_type === "criticality"
                ? "Criticality"
                : individualFilters.horizontal_chart_type === "capital_type"
                ? "Capital Type"
                : individualFilters.horizontal_chart_type?.split("_")[0] === "system"
                ? `${individualFilters.horizontal_chart_type?.split("_")[2]} System`
                : "";

        return `FCA ${noOfYears} Year Total CSP  By ${drop1} And ${drop2} `;
    };

    exportDataTableToWord = async (chart_type, sort_type, sort_name, display_type, file_type) => {
        try {
            this.setState({ isExporting: true });
            const { horizontalChartArray, dashboardFilterParams, horizontalSortName, horizontalSortValue } = this.props;
            const { getBuildingTypeFilter } = this.props.dashboardReducer;
            const userName = localStorage.getItem("user");
            const buildning_name = (dashboardFilterParams && dashboardFilterParams?.building_types) || {};
            const building_type_ids =
                (buildning_name &&
                    getBuildingTypeFilter?.building_types?.filter((item, i) => buildning_name.some(elm => elm === item.name)).map(item => item.id)) ||
                [];
            const defaultProjectId = horizontalChartArray?.value?.every(item => item?.project_id === horizontalChartArray?.value[0]?.project_id)
                ? horizontalChartArray?.value[0]?.project_id
                : "";
            let is_sort;
            if (sort_type === "value") {
                is_sort = horizontalSortValue === true ? "asc" : "desc";
            } else {
                is_sort = horizontalSortName === true ? "asc" : "desc";
            }
            const horizontal_chart_type = chart_type?.split("_")[0] === "system" ? chart_type?.split("_")[0] : chart_type;
            const trade_ids = horizontal_chart_type === "system" && chart_type?.split("_")[1] ? [chart_type?.split("_")[1]] : [];
            const params = {
                horizontal_chart_type,
                chart_type: "horizontal_chart",
                chart_sort_by: sort_type,
                chart_sort_order: is_sort,
                display: display_type,
                user_name: userName,
                user_id: localStorage.getItem("userId"),
                consultrancy_ids: dashboardFilterParams.consultancy_ids || [],
                client_ids: dashboardFilterParams.client_ids || [],
                trade_ids,
                project_ids: dashboardFilterParams?.project_ids?.length
                    ? dashboardFilterParams?.project_ids
                    : defaultProjectId
                    ? [defaultProjectId]
                    : [],
                region_ids: dashboardFilterParams.region_ids || [],
                site_ids: dashboardFilterParams.site_ids || [],
                building_ids: dashboardFilterParams.building_ids || [],
                building_types: building_type_ids.length ? building_type_ids : [],
                color_scale: dashboardFilterParams.fci_color || [],
                start: dashboardFilterParams.start_year,
                end: dashboardFilterParams.end_year,
                infrastructure_requests: dashboardFilterParams.infrastructure_requests || []
            };
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

    renderExportTypeModal = () => {
        const { showExportTypeModal } = this.state;
        const { individualFilters, horizontalSortName } = this.props;

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
                            this.exportDataTableToWord(
                                individualFilters.horizontal_chart_type,
                                individualFilters.chart_sort_by,
                                horizontalSortName,
                                individualFilters.display,
                                file_type
                            );
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
        const { individualFilters, horizontalSortName, horizontalSortValue, dashboardFilterParams } = this.props;
        const { isFullscreen, isExporting } = this.state;
        let dropDownValue1 = [
            { label: "Building", value: "building" },
            { label: "Site", value: "site" },
            { label: "Region", value: "region" },
            { label: "Project", value: "project" }
        ];

        let dropDownValue2 = [
            { label: "Category", value: "categories" },
            { label: "Funding Source", value: "funding_sources" },
            { label: "Term", value: "priorities" },
            { label: "Criticality", value: "criticality" },
            { label: "Capital Type", value: "capital_type" },
            { label: "Trade", value: "trades" }
        ];

        const system_nodes = this.props.projectReducer.getTradeSettingsDropdownResponse?.trades;
        let isSingleProject =
            !dashboardFilterParams?.project_ids || (dashboardFilterParams?.project_ids && dashboardFilterParams?.project_ids?.length === 1);
        if (system_nodes?.length && isSingleProject) {
            dropDownValue2.push({
                label: "System",
                options: system_nodes.map(item => ({ label: item?.name + " System", value: `system_${item?.id}_${item?.name}` }))
            });
        }
        const selectedDrop2Value = dropDownValue2.reduce((acc, item) => {
            if (item.options) {
                const matchingOption = item.options.find(option => option.value === individualFilters.horizontal_chart_type);
                if (matchingOption) {
                    acc = matchingOption;
                }
            } else if (item.value === individualFilters.horizontal_chart_type) {
                acc = item;
            }
            return acc;
        }, null);
        return (
            <div className={isFullscreen ? "sld-ara w-100" : "sld-ara"}>
                <ReactTooltip id="filter-name" className="rc-tooltip-custom-class" />
                {this.renderExportTypeModal()}
                <div className={"hed-set"}>
                    <h2>{!isFullscreen ? `${this.props.renderHeading("horizontal_chart")}` : `${this.renderChartHeading()}`}</h2>
                    <div className="btn-grp remove-when-downloading">
                        <button
                            type="button"
                            className={
                                individualFilters.chart_sort_by === "name"
                                    ? "btn btn-outline-secondary ml-2 act-btn"
                                    : "btn btn-outline-secondary ml-2 "
                            }
                            onClick={() => {
                                this.props.filterHorizontalChart("name", !horizontalSortName);
                            }}
                            data-delay-show="500"
                            data-tip={`Sort Chart By Name `}
                            data-effect="solid"
                            data-for="filter-name"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            Name
                            {horizontalSortName === false ? (
                                <i className={"fas fa-long-arrow-alt-down table-param-rep text-danger"}></i>
                            ) : horizontalSortName === true ? (
                                <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                            ) : null}
                        </button>
                        <button
                            type="button"
                            className={
                                individualFilters.chart_sort_by === "value"
                                    ? "btn btn-outline-secondary mr-2 act-btn"
                                    : "btn btn-outline-secondary mr-2 "
                            }
                            onClick={() => {
                                this.props.filterHorizontalChart("value", !horizontalSortValue);
                            }}
                            data-delay-show="500"
                            data-tip={`Sort Chart By Value`}
                            data-effect="solid"
                            data-for="filter-name"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            Value
                            {horizontalSortValue === false ? (
                                <i className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}></i>
                            ) : horizontalSortValue === true ? (
                                <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                            ) : null}
                        </button>
                        <div
                            className="categ-select-box"
                            data-delay-show="500"
                            data-tip={`Select Chart Type`}
                            data-effect="solid"
                            data-for="filter-name"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            <ReactSelect
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={dropDownValue1}
                                value={dropDownValue1.find(item => item.value === individualFilters.display)}
                                onChange={async value => {
                                    await this.props.handleMapChange(value?.value, "horizontal_chart", "display");
                                }}
                            />
                        </div>
                        <div
                            className="categ-select-box wid-sel-bx-160 pl-2"
                            data-delay-show="500"
                            data-tip={`Select Chart Type `}
                            data-effect="solid"
                            data-for="filter-name"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            <ReactSelect
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={selectedDrop2Value}
                                onChange={async value => {
                                    await this.props.handleMapChange(value?.value, "horizontal_chart", "horizontal_chart_type");
                                }}
                                options={dropDownValue2}
                            />
                        </div>
                        <div
                            className="fl-srn"
                            onClick={() => this.handleFullView()}
                            data-delay-show="500"
                            data-tip={this.state.isFullscreen ? `Minimize Chart` : `Maximize Chart`}
                            data-effect="solid"
                            data-for="filter-name"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            <img src="/img/restore.svg" alt="" className="set-icon-width" />
                        </div>
                        <div className="">
                            <Dropdown>
                                <Dropdown.Toggle
                                    id="dropdown-basic"
                                    className="hgt-35 export-btn"
                                    data-delay-show="500"
                                    data-tip={` Export Options`}
                                    data-effect="solid"
                                    data-for="filter-name"
                                    data-place="left"
                                    data-background-color="#007bff"
                                >
                                    {isExporting ? (
                                        <div className="edit-icn-bx icon-btn-sec export-loader">
                                            <div className="spinner-border text-primary" role="status"></div>
                                        </div>
                                    ) : (
                                        <i className="fa fa-bars" aria-hidden="true"></i>
                                    )}
                                </Dropdown.Toggle>

                                <Dropdown.Menu id="dropdown-menu">
                                    {/* <Dropdown.Item href="" onClick={(e) => this.toggleFullscreen(e)}>View Fullscreen</Dropdown.Item> */}
                                    <Dropdown.Item onClick={() => this.convertToImage("png")}>Export to PNG</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.convertToImage("jpeg")}>Export to JPEG</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.exportChartFromServer("word")}>Export to Word</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.exportChartFromServer("pdf")}>Export to PDF</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.exportChartFromServer("ppt")}>Export to PPT</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.showExportTypeModal(true)}>Export Table Data</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                {this.state.dataSource && this.state.dataSource.series && this.state.dataSource.series.length ? (
                    <div ref={this.chartContainerRef} className={isFullscreen ? "graph-ara" : "chart-dash"} id="chartItem-horizontal">
                        <HighchartsReact
                            highcharts={Highcharts}
                            allowChartUpdate
                            options={this.state.dataSource}
                            containerProps={
                                isFullscreen
                                    ? {
                                          style: {
                                              height: "400px",
                                              width: "800px"
                                          }
                                      }
                                    : { style: { height: "300px", width: "550px" } }
                            }
                            ref={this.chartRef}
                            callback={chart => {
                                if (!chart.renderer?.forExport) {
                                    this.chartRef = chart;
                                }
                            }}
                        />
                        {isFullscreen ? (
                            <div className="chart-footer">
                                <div className="row">
                                    <div className="col-md-9 pr-0">
                                        <div className="result-list">
                                            <ul>
                                                {this.state.legendArray && this.state.legendArray.length
                                                    ? this.state.legendArray.map(cv => {
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
                                                                          />
                                                                          - {cv.y ? Number(((cv.y / this.state.currentTotal) * 100).toFixed(1)) : 0}%
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
                                                    value={parseFloat((this.state.currentTotal ? this.state.currentTotal : 1) / 1000000).toFixed(2)}
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
                ) : (
                    <div className={isFullscreen ? "coming-soon no-data no-dat" : "coming-soon no-data"}>
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
        );
    }
}

const mapStateToProps = state => {
    const { dashboardReducer, projectReducer } = state;
    return {
        dashboardReducer,
        projectReducer
    };
};
let { getBuildingTypeFilter } = dashboardAction;

export default withRouter(
    connect(mapStateToProps, {
        getBuildingTypeFilter
    })(FcaChart)
);
