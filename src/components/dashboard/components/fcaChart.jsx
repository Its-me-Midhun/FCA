import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import * as htmlToImage from "html-to-image";
import NumberFormat from "react-number-format";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import LabelModule from "highcharts/modules/series-label";
import * as Service from "../../common/services";
import { getExportErrorMessage, thousandsSeparators } from "../../../config/utils";
import ReactTooltip from "react-tooltip";
import dashboardAction from "../actions";
import projectActions from "../../project/actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SelectExportTypeModal from "../../common/components/SelectExportTypeWordModal";
import Portal from "../../common/components/Portal";
import ReactSelect from "react-select";
require("highcharts/modules/exporting")(Highcharts);
highchartsMore(Highcharts);
highcharts3d(Highcharts);
LabelModule(Highcharts);

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
        dataSource: {},
        legendArray: [],
        total: 0,
        isFullscreen: this.props.isFullScreen === "chart" ? true : false,
        reload: false,
        currentChart: null,
        isSelectedOne: false,
        projectName: "",
        isExporting: false,
        showExportTypeModal: false
    };
    componentDidMount = async () => {
        if (this.props.popUpData.showChartData) {
            this.setState({
                currentChart: this.props.popUpData.currentChart,
                isSelectedOne: this.props.popUpData.isSelectedOne
            });
        }
        await this.renderChartData();
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
        if (prevProps.chartArray !== this.props.chartArray) {
            await this.renderChartData();
        }
        if (prevProps.showChartData !== this.props.showChartData) {
            if (!this.props.showChartData) {
                this.setState({
                    currentChart: "",
                    isSelectedOne: true
                });
            }
        }
        if (prevState.isSelectedOne !== this.state.isSelectedOne) {
            await this.renderChartData();
        }
    };

    renderChartData = () => {
        let dataSource = {};
        let holderName = {};
        let chartValues = [];
        let legendArray = [];
        let graphData = this.props.chartArray;
        let source = {};

        this.setState({
            projectName: graphData.value[0]?.project_name
        });

        // for chart data
        graphData?.value?.length &&
            graphData.value.forEach(elem => {
                elem.data.forEach(dat => {
                    if (source.hasOwnProperty(dat.name)) {
                        source[dat.name].data = [...source[dat.name].data, [elem.year, dat.amount]];
                    } else {
                        source[dat.name] = { name: dat.name, color: dat?.color, data: [[elem.year, dat.amount]] };
                    }
                });
            });

        //for custom legends
        graphData?.value?.length &&
            graphData.value.forEach(elem => {
                elem.data.forEach(d => {
                    if (holderName.hasOwnProperty(d.name)) {
                        holderName[d.name] = holderName[d.name] + d.amount;
                    } else {
                        holderName[d.name] = d.amount;
                    }
                });
            });

        let currentTotal = 0;
        Object.values(holderName).map(value => (currentTotal = currentTotal + value));
        Object.keys(source)
            .sort((a, b) => (a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1))
            .forEach(prop => {
                chartValues.push({ name: prop, color: source[prop]?.color, data: source[prop]?.data });
                legendArray.push({ name: prop, y: holderName[prop] });
            });

        dataSource = {
            exporting: { enabled: false },
            chart: {
                name: "chart",
                type: "column",
                plotBorderWidth: 0.5,
                zoomType: "xy",
                options3d: {
                    enabled: false,
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
                categories: [],
                labels: {
                    skew3d: true,
                    // style: {
                    //     fontSize: '14px'
                    // },
                    style: {
                        cursor: "pointer"
                    },
                    formatter: item => {
                        const color = this.state.currentChart === item.value ? "#007bff" : "black";
                        const fontWeight = this.state.currentChart === item.value ? "bold" : "normal";
                        return `<span style="color: ${color}; font-weight: ${fontWeight}" onClick={}>${item.value}</span>`;
                    }
                }
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
                }
            },
            legend: {
                enabled: this.state.isFullscreen ? true : false,
                maxHeight: 62
            },
            tooltip: {
                headerFormat: "<b>{point.key}</b><br>",
                pointFormat: `<span style="color:{series.color}">\u25CF</span> {series.name}: $ {point.y} <br> <span style="color:{series.color}">\u25CF</span> Click To View Details</span>`
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
                            legendArray = [...this.state.legendArray];
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
                            this.setState({
                                legendArray,
                                currentTotal
                            });
                        }
                    },
                    point: {
                        events: {
                            click: event => {
                                this.setState({ currentChart: event.point.category, isSelectedOne: false });
                                let currentData =
                                    this.props.chartArray &&
                                    this.props.chartArray.value &&
                                    this.props.chartArray.value.length &&
                                    this.props.chartArray.value.find(gd => gd.year == event.point.category);
                                this.props.viewDetailsChart(event.point, currentData, this.state.isSelectedOne, this.state.currentChart);
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
            series: chartValues
        };
        this.setState({
            dataSource,
            legendArray,
            currentTotal
        });
    };

    handleFullView = () => {
        this.setState(
            {
                isFullscreen: !this.state.isFullscreen
            },
            async () => {
                if (!this.state.isFullscreen) {
                    Highcharts.charts.forEach(chart => {
                        if (chart && chart.userOptions.chart.name === "chart") {
                            while (chart.series.length > 0) chart.series[0].remove(true);
                        }
                    });
                }
                await this.renderChartData();

                Highcharts.charts.forEach(chart => {
                    chart && chart.reflow();
                });
                await this.props.handleViewDetails("chart");
            }
        );
    };

    convertToImage = (imgType, noOfYears) => {
        this.setState({ isExporting: true });
        let self = this;
        let name = this.props.renderHeading("chart");
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

    exportChartFromServer = async type => {
        try {
            if (this.chartRef) {
                this.setState({ isExporting: true });
                const { chartArray, individualFilters, dashboardFilterParams } = this.props;
                const { currentTotal, legendArray } = this.state;
                const userName = localStorage.getItem("user");
                const heading = [this.props.renderHeading("chart")];
                let totalYears = this.props.getTotalYears();
                const export_type =
                    individualFilters.chart_type?.split("_")[0] === "system"
                        ? individualFilters.chart_type?.split("_")[0]
                        : individualFilters.chart_type;
                const trade_ids = export_type === "system" ? [individualFilters.chart_type?.split("_")[1]] : [];
                //formatted legends
                const legends = legendArray.map(item => ({
                    name: item.name,
                    y: `$ ${thousandsSeparators(parseFloat(item.y / 1000000).toFixed(2))}M`,
                    percentage: `${item.y ? Number(((item.y / currentTotal) * 100).toFixed(1)) : 0}%`
                }));

                // formatted total value
                const total = `$ ${thousandsSeparators(parseFloat((currentTotal ? currentTotal : 1) / 1000000).toFixed(2))}M`;
                const projectId = chartArray?.value?.every(item => item?.project_id === chartArray?.value[0]?.project_id)
                    ? chartArray?.value[0]?.project_id
                    : "";
                const projectName = projectId ? chartArray?.value[0]?.project_name : "";
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
                            categories: [],
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
                // formData.append("heading", JSON.stringify(heading));
                formData.append("legend", JSON.stringify(legends));
                total && formData.append("total", total);
                formData.append("project_id", projectId);
                formData.append("username", userName);
                formData.append("chart_type", "fca_chart");
                formData.append("export_type", export_type);
                if (trade_ids?.length) {
                    formData.append("trade_ids", JSON.stringify(trade_ids));
                }
                formData.append("years", totalYears);
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

    exportDataTableToWord = async (type, file_type) => {
        try {
            this.setState({ isExporting: true });
            const { chartArray, dashboardFilterParams } = this.props;
            const { getBuildingTypeFilter } = this.props.dashboardReducer;
            const userName = localStorage.getItem("user");
            const building_name = (dashboardFilterParams && dashboardFilterParams?.building_types) || {};
            const building_type_ids =
                (building_name &&
                    getBuildingTypeFilter?.building_types?.filter((item, i) => building_name.some(elm => elm === item.name)).map(item => item.id)) ||
                [];
            const defaultProjectId = chartArray?.value?.every(item => item?.project_id === chartArray?.value[0]?.project_id)
                ? chartArray?.value[0]?.project_id
                : "";
            const export_type = type?.split("_")[0] === "system" ? type?.split("_")[0] : type;
            const trade_ids = export_type === "system" && type?.split("_")[1] ? [type?.split("_")[1]] : [];
            const params = {
                export_type,
                chart_type: "fca_chart",
                user_name: userName,
                user_id: localStorage.getItem("userId"),
                consultrancy_ids: dashboardFilterParams.consultancy_ids || [],
                client_ids: dashboardFilterParams.client_ids || [],
                project_ids: dashboardFilterParams?.project_ids?.length
                    ? dashboardFilterParams?.project_ids
                    : defaultProjectId
                    ? [defaultProjectId]
                    : [],
                region_ids: dashboardFilterParams.region_ids || [],
                site_ids: dashboardFilterParams.site_ids || [],
                building_ids: dashboardFilterParams.building_ids || [],
                trade_ids,
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

    exportToExcel = async () => {
        this.setState({ isExporting: true });
        await this.props.exportToExcel("fcaChart");
        this.setState({ isExporting: false });
    };

    renderExportTypeModal = () => {
        const { showExportTypeModal } = this.state;
        const { individualFilters } = this.props;

        if (!showExportTypeModal) return null;
        return (
            <Portal
                body={
                    <SelectExportTypeModal
                        onCancel={() => this.showExportTypeModal(false)}
                        isBuildingAddition={false}
                        isWordExcel={true}
                        onOk={(sort_type, file_type) => {
                            this.showExportTypeModal(false);
                            this.exportDataTableToWord(individualFilters.chart_type, file_type);
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
        const { individualFilters, viewContent, dashboardFilterParams } = this.props;
        const { isFullscreen, isExporting } = this.state;
        let dropDownValues = [
            { label: "Category", value: "categories" },
            { label: "Funding Source", value: "funding_sources" },
            { label: "Criticality", value: "criticality" },
            { label: "Capital Type", value: "capital_type" },
            { label: "Term", value: "priorities" },
            { label: "Trade", value: "trades" },
            { label: "Project", value: "projects" },
            { label: "Region", value: "regions" },
            { label: "Site", value: "sites" },
            { label: "Building", value: "buildings" }
        ];

        const system_nodes = this.props.projectReducer.getTradeSettingsDropdownResponse?.trades;
        let isSingleProject =
            !dashboardFilterParams?.project_ids || (dashboardFilterParams?.project_ids && dashboardFilterParams?.project_ids?.length === 1);
        if (system_nodes?.length && isSingleProject) {
            const systemOptions = {
                label: "System",
                options: system_nodes.map(item => ({ label: item?.name + " System", value: `system_${item?.id}_${item?.name}` }))
            };
            dropDownValues.splice(6, 0, systemOptions);
        }

        const selectedDropValue = dropDownValues.reduce((acc, item) => {
            if (item.options) {
                const matchingOption = item.options.find(option => option.value === individualFilters.chart_type);
                if (matchingOption) {
                    acc = matchingOption;
                }
            } else if (item.value === individualFilters.chart_type) {
                acc = item;
            }
            return acc;
        }, null);

        return (
            ((viewContent && viewContent === "chart") || !viewContent) && (
                <div className={isFullscreen ? "sld-ara w-100" : "sld-ara"}>
                    {this.renderExportTypeModal()}
                    <ReactTooltip id="fcachart" className="rc-tooltip-custom-class" />
                    <div className={"hed-set"}>
                        <h2>{this.props.renderHeading("chart")}</h2>
                        <div className="btn-grp remove-when-downloading">
                            <div
                                className="categ-select-box wid-sel-bx-160 mr-2"
                                data-delay-show="500"
                                data-tip={`Select Chart Type `}
                                data-effect="solid"
                                data-for="fcachart"
                                data-place="left"
                                data-background-color="#007bff"
                            >
                                <ReactSelect
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    value={selectedDropValue}
                                    onChange={async value => {
                                        await this.props.handleMapChange(value?.value, "chart");
                                    }}
                                    options={dropDownValues}
                                />
                            </div>
                            <div
                                className="fl-srn"
                                onClick={() => this.handleFullView()}
                                data-delay-show="500"
                                data-tip={this.state.isFullscreen ? `Minimize Chart` : `Maximize Chart`}
                                data-effect="solid"
                                data-for="fcachart"
                                data-place="left"
                                data-background-color="#007bff"
                            >
                                <img src="/img/restore.svg" alt="" className="set-icon-width" />
                            </div>
                            <div>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        id="dropdown-basic"
                                        className="hgt-35 export-btn"
                                        data-delay-show="500"
                                        data-tip={`Export Options`}
                                        data-effect="solid"
                                        data-for="fcachart"
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
                        <div ref={this.chartContainerRef} className={isFullscreen ? "graph-ara" : "chart-dash"} id="chartItem">
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
                                                                              -{" "}
                                                                              {cv.y ? Number(((cv.y / this.state.currentTotal) * 100).toFixed(1)) : 0}
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
                                                        value={parseFloat((this.state.currentTotal ? this.state.currentTotal : 1) / 1000000).toFixed(
                                                            2
                                                        )}
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
            )
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
