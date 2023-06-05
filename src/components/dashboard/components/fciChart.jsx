import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import * as htmlToImage from "html-to-image";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import walletIcon from "../../../assets/img/dashboard/Group 954.svg";
import ReactTooltip from "react-tooltip";
import * as Service from "../../common/services";
import { getExportErrorMessage, thousandsSeparators } from "../../../config/utils";
import dashboardAction from "../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SelectExportTypeModal from "../../common/components/SelectExportTypeWordModal";
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

class FciChart extends Component {
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
        isFullscreen: this.props.isFullScreen === "fci_charts" ? true : false,
        current: null,
        isSelectedOne: false,
        currentSite: null,
        fciCategory: "regions",
        isExporting: false,
        showExportTypeModal: false
    };
    componentDidMount = async () => {
        if (this.props.popUpData.showColorModal) {
            this.setState(
                {
                    current: this.props.popUpData.current,
                    currentSite: this.props.popUpData.currentSite,
                    isSelectedOne: this.props.popUpData.isSelectedOne
                },
                () => console.log("item-->format", this.state.isSelectedOne)
            );
        }
        await this.renderChartData();
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
    componentWillUnmount() {
        this.observer.disconnect();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.fciArray != this.props.fciArray) {
            await this.renderChartData();
            await Highcharts.charts.map(chart => {
                let count = this.state.isFullscreen ? 8 : 5;
                if (chart && chart.userOptions.chart.name == "fci_charts") {
                    chart.xAxis[0].setExtremes(0, this.state.legendArray.length > count ? count : null);
                }
            });
        }
        if (prevProps.showColorModal != this.props.showColorModal) {
            if (!this.props.showColorModal) {
                this.setState({
                    current: "",
                    isSelectedOne: true,
                    currentSite: null
                });
            }
        }
        if (prevState.isSelectedOne != this.state.isSelectedOne) {
            await this.renderChartData();
        }
    };

    renderChartData = () => {
        let dataSource = {};
        let chartValues = [];
        let graphData = this.props.fciArray;
        let labelValues = [];
        graphData && graphData.value && graphData.value && graphData.value.length && graphData.value.map(gd => labelValues.push(gd.name));
        graphData &&
            graphData.value &&
            graphData.value.length &&
            graphData.value.map(gd =>
                chartValues.push({
                    name: gd.name,
                    y: gd.amount,
                    color: gd.color,
                    building_type: gd.building_type,
                    building_type_id: gd.building_type_id,
                    comments: gd.comments,
                    CRV: gd.crv,
                    DM: gd.dm,
                    site: gd.site,
                    project_id: gd.project_id,
                    entity_id: gd.entity_id,
                    hospital_name: gd.hospital_name,
                    project_name: gd.project_name,
                    DM_ID: gd.deffered_maintanance_id
                })
            );

        let maxCount = this.state.isFullscreen ? (chartValues.length > 8 ? 8 : null) : chartValues.length > 5 ? 5 : null;
        let isScroll = this.state.isFullscreen ? (chartValues.length > 8 ? true : false) : chartValues.length > 5 ? true : false;
        dataSource = {
            chart: {
                name: "fci_charts",
                type: "bar",
                style: {
                    fontFamily: "Poppins, sans-serif"
                },
                marginLeft: 90,
                animation: {
                    duration: 1000,
                    easing: "easeOutBounce"
                },
                backgroundColor: "#FFFFFF"
            },

            title: {
                text: ""
            },
            subtitle: {
                text: ""
            },
            xAxis: {
                id: "x-axis-1",
                categories: labelValues,
                title: {
                    text: null
                },
                scrollbar: {
                    enabled: this.state.isFullscreen ? (chartValues.length > 8 ? true : false) : chartValues.length > 5 ? true : false
                },
                labels: {
                    enabled: true,

                    style: {
                        cursor: "pointer"
                    },
                    formatter: item => {
                        const color = this.state.current === item.value && this.state.currentSite == item.pos ? "#007bff" : "black";
                        const fontWeight = this.state.current === item.value && this.state.currentSite == item.pos ? "bold" : "normal";
                        return `<span style="color: ${color}; font-weight: ${fontWeight}" onClick={}>${item.value}</span>`;
                    }
                },
                min: 0,
                max: this.state.isFullscreen ? (chartValues.length > 8 ? 8 : null) : chartValues.length > 5 ? 5 : null
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
                    var s = this.point.building_type
                        ? "<b>" + this.key + " ( " + this.point.building_type + " ) " + "</b>"
                        : "<b>" + this.key + "</b>";
                    if (this.point != null && this.point.hospital_name)
                        s += `<br/><span>Parent Building :  ${this.point != null ? this.point.hospital_name : ""} </span>`;
                    if (this.point.site != null && this.point.site)
                        s += `<br/><span>Site:  ${this.point.site != null ? this.point.site : ""} </span>`;
                    s += `<br/><span >` + "  FCI : " + this.y + `<span>`;
                    if (this.point.comments != null && this.point.comments)
                        s += `<br/><span>Description :  ${this.point.comments != null ? this.point.comments : ""} </span>`;
                    s += `<br/><span>  DM : ${this.point.DM != null ? "$ " + (this.point.DM / 1000000).toFixed(2) + "M" : ""} </span>`;
                    s += `<br/><span> CRV : ${this.point.CRV != null ? "$ " + (this.point.CRV / 1000000).toFixed(2) + "M" : ""} </span>`;
                    s += `<br/><span style="color:{series.color}">\u25CF</span> Click To View Details</span>`;
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
                    allowPointSelect: true,
                    dataLabels: {
                        enabled: true,
                        //  color: '#e00000',
                        color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray"
                    },

                    states: {
                        select: {
                            color: null,
                            borderWidth: !this.state.isSelectedOne ? 2 : null,
                            borderColor: !this.state.isSelectedOne ? "black" : null
                        }
                    }
                }

                // overflow: "justify"
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [
                {
                    cursor: "pointer",
                    point: {
                        events: {
                            click: async event => {
                                let eventData = event.point;
                                let dataValues = {
                                    entity_id: event.point.entity_id,
                                    project_name: event.point.project_name,
                                    project_id: event.point.project_id,
                                    category: event.point.category,
                                    index: event.point.index,
                                    name: event.point.name,
                                    hospital_name: event.point.hospital_name,
                                    building_type: event.point.building_type,
                                    DM_ID: event.point?.DM_ID
                                };
                                let data = {
                                    building_type_id: event.point.building_type_id
                                };
                                if (this.props.individualFilters.fci_type == "buildings") {
                                    data = { ...data, building_id: eventData.entity_id };
                                } else if (this.props.individualFilters.fci_type == "sites") {
                                    data = { ...data, site_id: eventData.entity_id };
                                } else if (this.props.individualFilters.fci_type == "regions") {
                                    data = { ...data, region_id: eventData.entity_id };
                                } else if (this.props.individualFilters.fci_type == "projects") {
                                    data = { ...data, project_id: eventData.entity_id };
                                }

                                this.setState({
                                    current: dataValues.category,
                                    currentSite: dataValues.index,
                                    isSelectedOne: false
                                });
                                await this.props.handleViewLegent(dataValues, data, dataValues.category, dataValues.index, false);
                            }
                        }
                    },
                    data: chartValues
                }
            ]
        };

        this.setState({
            dataSource,
            legendArray: labelValues
        });
    };

    handleFullView = () => {
        this.setState(
            {
                isFullscreen: !this.state.isFullscreen
            },
            async () => {
                await this.props.handleViewDetails("fci_charts");
                Highcharts.charts.map(chart => {
                    chart && chart.reflow();
                });

                if (!this.state.isFullscreen) {
                    localStorage.setItem("fullScreenItem", null);
                    Highcharts.charts.map(chart => {
                        if (chart && chart.userOptions.chart.name == "fci_charts")
                            chart.xAxis[0].setExtremes(0, this.state.legendArray.length > 5 ? 5 : null);
                    });
                } else {
                    localStorage.setItem("fullScreenItem", "fci_charts");
                    Highcharts.charts.map(chart => {
                        if (chart && chart.userOptions.chart.name == "fci_charts")
                            chart.xAxis[0].setExtremes(0, this.state.legendArray.length > 8 ? 8 : null);
                    });
                }
            }
        );
    };

    convertToImage = (imgType, noOfYears) => {
        this.setState({ isExporting: true });
        let self = this;
        let name = this.props.renderHeading("fci_charts");
        if (imgType === "jpeg") {
            htmlToImage.toJpeg(document.getElementById("chartItem-fci"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.jpeg`;
                link.href = dataUrl;
                link.click();
                link.remove();
                self.setState({ isExporting: false });
            });
        } else if (imgType === "png") {
            htmlToImage.toPng(document.getElementById("chartItem-fci"), { quality: 0.95 }).then(function (dataUrl) {
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
            htmlToImage.toSvgDataURL(document.getElementById("chartItem-fci"), { filter: filter }, { quality: 0.95 }).then(function (dataUrl) {
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
                const { fciArray, individualFilters, dashboardFilterParams } = this.props;
                const projectId = fciArray?.value?.every(item => item?.project_id === fciArray?.value[0]?.project_id)
                    ? fciArray?.value[0]?.project_id
                    : "";

                const userName = localStorage.getItem("user");
                const resp = await Service.getActiveChartProperties({ project_id: projectId });
                const { legend, x_axis, y_axis, data_labels } = resp?.data?.properties;
                let totalYears = this.props.getTotalYears();
                let svg = this.chartRef.getSVG({
                    chart: { height: 500, width: 832 },
                    legend: {
                        enabled: false
                    },
                    credits: { enabled: false },
                    xAxis: [
                        {
                            categories: this.chartRef?.xAxis[0]?.categories,

                            id: "x-axis-1",

                            title: {
                                text: null
                            },

                            labels: {
                                enabled: true,

                                style: {
                                    cursor: "pointer",
                                    fontSize: x_axis?.font_size ? `${x_axis?.font_size}px` : "",
                                    color: x_axis?.color ? `#${x_axis?.color}` : ""
                                }
                                // formatter: item => {
                                //     const color = this.state.current === item.value && this.state.currentSite == item.pos ? "#007bff" : "black";
                                //     const fontWeight = this.state.current === item.value && this.state.currentSite == item.pos ? "bold" : "normal";
                                //     return `<span style="color: ${color}; font-weight: ${fontWeight}" onClick={}>${item.value}</span>`;
                                // }
                            }
                            // min: 0,
                            // max: this.state.isFullscreen ? (chartValues.length > 8 ? 8 : null) : chartValues.length > 5 ? 5 : null
                        }
                    ],
                    yAxis: [
                        {
                            allowDecimals: true,
                            min: 0,

                            max: undefined,
                            title: {
                                text: "",
                                skew3d: true,
                                align: "high"
                            },
                            labels: {
                                style: {
                                    fontSize: y_axis?.font_size ? `${y_axis?.font_size}px` : "",
                                    color: y_axis?.color ? `#${y_axis?.color}` : ""
                                },
                                overflow: "justify",
                                useHTML: true
                            }

                            // stackLabels: {
                            //     enabled: true,
                            //     style: {
                            //         fontWeight: "bold",
                            //         fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : "",
                            //         color: data_labels?.color ? `#${data_labels?.color}` : ""
                            //     },
                            //     formatter: function () {
                            //         return "$" + (this.total / 1000000).toFixed(2) + "M";
                            //     }
                            // }
                        }
                    ],
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                fontWeight: "bold",
                                fontSize: data_labels?.font_size ? `${data_labels?.font_size}px` : "",
                                color: data_labels?.color ? `#${data_labels?.color}` : ""
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    }
                });
                const blob = new Blob([svg], { type: "image/svg+xml" });
                let heading = [`FCI Benchmarking`];

                const projectName = projectId ? fciArray?.value[0]?.project_name : "";
                projectName && heading.splice(0, 0, projectName);
                const filter = {
                    project_ids: dashboardFilterParams?.project_ids?.length ? dashboardFilterParams?.project_ids : projectId ? [projectId] : [],
                    region_ids: dashboardFilterParams.region_ids || [],
                    site_ids: dashboardFilterParams.site_ids || [],
                    building_ids: dashboardFilterParams.building_ids || []
                };
                let formData = new FormData();
                formData.append("image", blob);
                formData.append("heading", JSON.stringify(heading));
                formData.append("project_id", projectId);
                formData.append("username", userName);
                formData.append("chart_type", "fci_chart");
                formData.append("export_type", individualFilters.fci_type);
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

    exportDataTableToWord = async (fci_type, sort_type, file_type) => {
        try {
            this.setState({ isExporting: true });
            const { fciSortName, fciSortValue } = this.props;
            const { fciArray, dashboardFilterParams } = this.props;
            const { getBuildingTypeFilter } = this.props.dashboardReducer;
            const userName = localStorage.getItem("user");
            const building_name = (dashboardFilterParams && dashboardFilterParams?.building_types) || {};
            const building_type_ids =
                (building_name &&
                    getBuildingTypeFilter?.building_types?.filter((item, i) => building_name.some(elm => elm === item.name)).map(item => item.id)) ||
                [];
            const defaultProjectId = fciArray?.value?.every(item => item?.project_id === fciArray?.value[0]?.project_id)
                ? fciArray?.value[0]?.project_id
                : "";
            let is_sort;
            if (sort_type === "value") {
                is_sort = fciSortValue === true ? "asc" : "desc";
            } else {
                is_sort = fciSortName === true ? "asc" : "desc";
            }
            const params = {
                fci_type: fci_type,
                chart_type: "fci_chart",
                fci_sort_by: sort_type,
                fci_sort_order: is_sort,
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
        await this.props.exportToExcel("fciChart");
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
                            this.exportDataTableToWord(individualFilters.fci_type, individualFilters?.fci_sort_by, file_type);
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
        const { individualFilters, fciSortName, fciSortValue } = this.props;

        const { isFullscreen, isExporting } = this.state;

        let dropDownValues = [
            { label: "Building", value: "buildings" },
            { label: "Site", value: "sites" },
            { label: "Region", value: "regions" },
            { label: "Project", value: "projects" }
        ];
        // console.log(this.chartRef);
        return (
            <div className={isFullscreen ? "sld-ara w-100" : "sld-ara"} id="chartItem-fci">
                <ReactTooltip id="filter-nam" className="rc-tooltip-custom-class" />
                {this.renderExportTypeModal()}
                <div className={"hed-set"}>
                    <div class="tab-btn-dsh">
                        <button class="btn-cmn btn-txt active">FCI Benchmarking</button>
                        <button class="btn-cmn btn-icn">
                            <img
                                src={walletIcon}
                                alt="wltt-icn"
                                onClick={() => this.props.toggleSecondChartView()}
                                data-place="left"
                                data-effect="solid"
                                data-background-color="#007bff"
                                data-tip="Click To View Budget Priority Recommendations"
                                data-for="filter-nam"
                            />
                        </button>
                    </div>
                    <div className="btn-grp remove-when-downloading">
                        <button
                            type="button"
                            className={
                                individualFilters.fci_sort_by == "name" ? "btn btn-outline-secondary ml-1 act-btn" : "btn btn-outline-secondary ml-1 "
                            }
                            onClick={() => {
                                this.props.filterFcaChart("name", !fciSortName);
                            }}
                            data-delay-show="500"
                            data-tip={`Sort Chart By Name `}
                            data-effect="solid"
                            data-for="filter-nam"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            {" "}
                            Name
                            {fciSortName === false ? (
                                <i className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}></i>
                            ) : fciSortName === true ? (
                                <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                            ) : null}
                        </button>
                        <button
                            type="button"
                            className={
                                individualFilters.fci_sort_by == "value"
                                    ? "btn btn-outline-secondary mr-1 ml-1 act-btn"
                                    : "btn btn-outline-secondary mr-1 ml-1 "
                            }
                            onClick={() => {
                                this.props.filterFcaChart("value", !fciSortValue);
                            }}
                            data-delay-show="500"
                            data-tip={`Sort Chart By Value `}
                            data-effect="solid"
                            data-for="filter-nam"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            Value
                            {fciSortValue === false ? (
                                <i className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}></i>
                            ) : fciSortValue === true ? (
                                <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                            ) : null}
                        </button>
                        <div
                            className="categ-select-box wid-sel-bx-110"
                            data-delay-show="500"
                            data-tip={`Select Chart Type`}
                            data-effect="solid"
                            data-for="filter-nam"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            <ReactSelect
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={dropDownValues.find(item => item.value === individualFilters.fci_type)}
                                onChange={async value => {
                                    this.setState({ fciCategory: value?.value });
                                    await this.props.handleMapChange(value?.value, "fci_charts", "fci_type");
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
                            data-for="filter-nam"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            <img src="/img/restore.svg" alt="" className="set-icon-width" />
                        </div>
                        <div className="avoid">
                            <Dropdown>
                                <Dropdown.Toggle
                                    id="dropdown-basic"
                                    className="ml-2 hgt-35 export-btn"
                                    data-delay-show="500"
                                    data-tip={`Export Options`}
                                    data-effect="solid"
                                    data-for="filter-nam"
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
                                    <Dropdown.Item onClick={() => this.convertToImage("png", this.state.fciCategory)}>Export to PNG</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.convertToImage("jpeg", this.state.fciCategory)}>Export to JPEG</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.exportChartFromServer("word")}>Export to Word</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.exportChartFromServer("pdf")}>Export to PDF</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.exportChartFromServer("ppt")}>Export to PPT</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.showExportTypeModal(true)}>Export Table Data</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                {this.state.dataSource &&
                this.state.dataSource.series &&
                this.state.dataSource.series[0] &&
                this.state.dataSource.series[0].data &&
                this.state.dataSource.series[0].data.length ? (
                    <div ref={this.chartContainerRef} className={isFullscreen ? "graph-ara fci-chrt" : "chart-dash"}>
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
    const { dashboardReducer } = state;
    return {
        dashboardReducer
    };
};
let { getBuildingTypeFilter } = dashboardAction;
export default withRouter(
    connect(mapStateToProps, {
        getBuildingTypeFilter
    })(FciChart)
);
