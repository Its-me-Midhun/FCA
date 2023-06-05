import React, { Component } from "react";
import NumberFormat from "react-number-format";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import LabelModule from "highcharts/modules/series-label";
import ReactTooltip from "react-tooltip";
import GridLight from "highcharts/themes/grid-light";
import Loader from "../../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import customEvent from "highcharts-custom-events";
import { thousandsSeparators } from "../../../../config/utils";

highchartsMore(Highcharts);
highcharts3d(Highcharts);
GridLight(Highcharts);
LabelModule(Highcharts);
customEvent(Highcharts);
Highcharts.setOptions({
    lang: {
        thousandsSep: ","
    }
});

class ChartDasboard extends Component {
    constructor(props) {
        super(props);
        this.chartContainerRef = React.createRef();
        this.observer = null;
    }
    state = {
        chartArray: ["End_Of_Life_By_Year", "Assets_Capital_Spending_Plan", "Asset_Age_By_Condition", "SFCI"],
        chartOptions: {
            End_Of_Life_By_Year: {},
            Assets_Capital_Spending_Plan: {},
            Asset_Age_By_Condition: {},
            SFCI: {}
        },
        totalValue: {},
        legendValues: {},
        legendArrayFunding: [],
        viewData: null
    };

    componentDidMount = () => {
        this.refreshCharts();
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
        const { graphData } = this.props;

        if (prevProps.graphData !== graphData) {
            this.refreshCharts();
        }
        if (prevProps.chartPopup !== this.props.chartPopup) {
            this.refreshCharts();
        }
    };

    refreshCharts = async () => {
        let { chartOptions } = this.state;
        this.state.chartArray.forEach(item => {
            chartOptions[item] = this.renderChart(item);
        });
        this.setState({ chartOptions });
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

    renderYtext = type => {
        switch (type) {
            case "End_Of_Life_By_Year": {
                return "Asset Count";
            }
            case "Assets_Capital_Spending_Plan": {
                return "Cost";
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

    renderChart = type => {
        const { graphData, chartPopup, chartView } = this.props;
        let graphTypeData = {};
        let self = this;
        if (graphData && Object.keys(graphData)?.length) {
            switch (type) {
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
            let dataSource = {};
            if (chartView[type] === "column") {
                let chartValue = this.renderChartDetails(graphTypeData, type);
                dataSource = {
                    exporting: { enabled: false },
                    credits: { enabled: false },
                    chart: {
                        type: chartView[type],
                        zoomType: "xy",
                        options3d: {
                            enabled: false,
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
                        categories: this.renderCategories(type),
                        labels: {
                            skew3d: false,
                            style: {
                                fontSize: "12px",
                                cursor: "pointer"
                            },
                            autoRotation: undefined,
                            events: {
                                click: function () {
                                    const rangeIndex = this.pos;
                                    let clickedCategory = this.axis.categories[rangeIndex] || "";
                                    let selectedSeries = this.chart.options?.series || [];
                                    self.props.showChartPopup({
                                        heading: self.renderHeading(type),
                                        category: clickedCategory,
                                        series: selectedSeries,
                                        rangeIndex,
                                        name: null,
                                        entityId: null,
                                        data: "",
                                        type,
                                        isCategory: true
                                    });
                                }
                            },
                            formatter: item => {
                                const isSelectedCategory =
                                    chartPopup.data.isCategory && chartPopup.data.type === type && chartPopup.data.category === item.value;
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
                            text: this.renderYtext(type),
                            skew3d: true
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: "bold",
                                format: type === "Assets_Capital_Spending_Plan" ? "$ {point.y:.1f}" : "",
                                color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray"
                            },
                            formatter: function () {
                                return type === "Assets_Capital_Spending_Plan" ? "$" + (this.total / 1000000).toFixed(2) + "M" : this.total;
                            }
                        }
                    },

                    tooltip: {
                        headerFormat: "<b>{point.key}</b><br>",
                        pointFormat:
                            type === "Assets_Capital_Spending_Plan"
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
                                            heading: this.renderHeading(type),
                                            category: event.point.category,
                                            name: event.point.conditionName,
                                            entityId: event.point.conditionId,
                                            data: event.point.y,
                                            type
                                        });
                                    }
                                }
                            },
                            allowPointSelect: true,
                            cursor: "pointer",
                            states: {
                                select: {
                                    color: null,
                                    borderWidth: !chartPopup.data.isCategory && chartPopup.data.type === type ? 2 : null,
                                    borderColor: !chartPopup.data.isCategory && chartPopup.data.type === type ? "black" : null
                                }
                            }
                        }
                    },
                    series: chartValue.series,
                    legend: {
                        enabled: false,
                        width: "100%",
                        className: "custom-chart-legend"
                    }
                };
                let rtrnValue = {
                    dataSource,
                    totalSum: chartValue.totalSum,
                    summaryData: chartValue.series
                };
                return rtrnValue;
            } else if (chartView[type] === "pie") {
                let chartValue = this.renderChartDetails(graphTypeData, type);
                dataSource = {
                    exporting: { enabled: false },
                    credits: { enabled: false },
                    chart: {
                        type: "pie",
                        backgroundColor: "#FFFFFF",
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
                            }
                        },
                        series: {
                            point: {
                                events: {
                                    click: event => {
                                        this.props.showChartPopup({
                                            heading: this.renderHeading(type),
                                            category: "",
                                            name: event.point.name,
                                            data: event.point.y,
                                            type,
                                            chartView: chartView[type]
                                        });
                                    }
                                }
                            },
                            allowPointSelect: true,
                            cursor: "pointer",
                            states: {
                                select: {
                                    color: null,
                                    borderWidth: chartPopup.data.type === type ? 2 : null,
                                    borderColor: chartPopup.data.type === type ? "black" : null
                                }
                            }
                        }
                    },

                    series: [
                        {
                            name: "CSP",
                            slicedOffset: 20,
                            colorByPoint: true,
                            data: chartValue.series
                        }
                    ],

                    legend: {
                        enabled: false,
                        width: "100%",
                        className: "custom-chart-legend"
                    }
                };
                let rtrnValue = {
                    dataSource,
                    totalSum: chartValue.totalSum,
                    summaryData: chartValue.series
                };

                return rtrnValue;
            } else if (chartView[type] === "bar") {
                let chartValue = this.renderChartDetails(graphTypeData, type);
                dataSource = {
                    exporting: { enabled: false },
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
                        categories: this.renderCategories(type, graphTypeData),
                        title: {
                            text: null
                        },
                        scrollbar: {
                            enabled: this.renderCategories(type, graphTypeData)?.length > 5 ? true : false
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
                        max: this.renderCategories(type, graphTypeData)?.length > 5 ? 5 : null
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
                                            heading: this.renderHeading(type),
                                            category: event.point.category,
                                            name: event.point.name,
                                            entityId: event.point.subSystemId,
                                            data: event.point.y,
                                            type
                                        });
                                    }
                                }
                            },
                            allowPointSelect: true,
                            cursor: "pointer",
                            states: {
                                select: {
                                    color: null,
                                    borderWidth: chartPopup.data.type === type ? 2 : null,
                                    borderColor: chartPopup.data.type === type ? "black" : null
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
                    series: chartValue.series
                };
                let rtrnValue = {
                    dataSource,
                    totalSum: chartValue.totalSum,
                    summaryData: []
                };
                return rtrnValue;
            }
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

    renderChartDetails = (graphTypeData, type) => {
        const { chartView } = this.props;
        let tempSeries = [];
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
                            valueSum,
                            color: item.condtion?.color
                        });
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
                            valueSum,
                            color: item.condtion?.color
                        });
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
                                valueSum,
                                color: item.condtion?.color
                            });
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
                                color: item.values?.colour,
                                y: parseInt(item.values?.value),
                                valueSum: parseInt(item.values?.value)
                            });
                        });
                }
                break;
            case "SFCI":
                let data = [];
                graphTypeData?.length &&
                    graphTypeData.forEach(item => {
                        data.push({
                            name: item.name,
                            y: parseFloat(item.y) || 0,
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

        let totalSum = tempSeries.reduce((total, obj) => obj?.valueSum + total, 0);
        return { series: tempSeries, totalSum };
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

    handleChartView = async (type, key) => {
        let { chartView } = this.props;
        chartView = {
            ...chartView,
            [key]: type
        };
        this.props.handleChartView(chartView);
        await this.setState({
            chartOptions: { ...this.state.chartOptions, [key]: {} }
        });
        let data = this.renderChart(key);
        this.setState({ chartOptions: { ...this.state.chartOptions, [key]: data } });
    };
    render() {
        const { chartArray, chartOptions } = this.state;
        const { chartView, sfciSortName, sfciSortValue, sfci_sort_by } = this.props;
        var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        return (
            <div className={"chart-graph-outr chart-area chart-coming-soon "} id={"dashboard"}>
                <div ref={this.chartContainerRef} className="chart-ground align-base pt-1">
                    {chartArray?.length
                        ? chartArray.map((ca, key) => {
                              return (
                                  <div className={`col-md-6 mb-2 ${key % 2 === 0 ? "pr-0" : ""}`} key={key}>
                                      <LoadingOverlay active={this.props.isLoading} spinner={<Loader />} fadeSpeed={10}>
                                          <div className="box-order h-auto custom-box-height">
                                              {chartOptions[ca]?.dataSource?.series?.length &&
                                              chartOptions[ca]?.dataSource?.series[0]?.data?.length ? (
                                                  <>
                                                      <div className="hed-chart-bnr chart-mod-head">
                                                          <h3 className="mb-0">{this.renderHeading(ca)}</h3>

                                                          <div className="right-section">
                                                              <div className={`min-tab-buttons ${ca === "SFCI" ? "bg-transparent" : ""}`}>
                                                                  {ca === "SFCI" && (
                                                                      <>
                                                                          <button
                                                                              type="button"
                                                                              className={
                                                                                  sfci_sort_by === "name"
                                                                                      ? "btn btn-outline-secondary ml-1 act-btn btn-chart-index"
                                                                                      : "btn btn-outline-secondary ml-1 btn-chart-index"
                                                                              }
                                                                              onClick={() => {
                                                                                  this.props.filterSfciChart("name", !sfciSortName);
                                                                              }}
                                                                          >
                                                                              Name
                                                                              {sfciSortName === false ? (
                                                                                  <i
                                                                                      className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}
                                                                                  ></i>
                                                                              ) : sfciSortName === true ? (
                                                                                  <i
                                                                                      className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}
                                                                                  ></i>
                                                                              ) : null}
                                                                          </button>
                                                                          <button
                                                                              type="button"
                                                                              className={
                                                                                  sfci_sort_by == "value"
                                                                                      ? "btn btn-outline-secondary act-btn btn-chart-index"
                                                                                      : "btn btn-outline-secondary btn-chart-index"
                                                                              }
                                                                              onClick={() => {
                                                                                  this.props.filterSfciChart("value", !sfciSortValue);
                                                                              }}
                                                                          >
                                                                              Value
                                                                              {sfciSortValue === false ? (
                                                                                  <i
                                                                                      className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}
                                                                                  ></i>
                                                                              ) : sfciSortValue === true ? (
                                                                                  <i
                                                                                      className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}
                                                                                  ></i>
                                                                              ) : null}
                                                                          </button>
                                                                      </>
                                                                  )}
                                                                  {ca === "Assets_Capital_Spending_Plan" && (
                                                                      <>
                                                                          <button
                                                                              className={`${chartView[ca] === "pie" ? "active" : null}`}
                                                                              onClick={() => this.handleChartView("pie", ca)}
                                                                          >
                                                                              <i className="fas fa-chart-pie"></i>
                                                                          </button>
                                                                          <button
                                                                              className={`${chartView[ca] === "column" ? "active" : null}`}
                                                                              onClick={() => this.handleChartView("column", ca)}
                                                                          >
                                                                              <i>
                                                                                  <img src="/img/detail-view.png" alt="" />
                                                                              </i>
                                                                          </button>
                                                                      </>
                                                                  )}
                                                                  <a
                                                                      className="nav-link calcicons min-mize"
                                                                      data-for="table-top-icons"
                                                                      data-tip="Maximize Chart"
                                                                      data-place="left"
                                                                      onClick={() => this.props.handleChartClick(ca)}
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
                                                          <HighchartsReact
                                                              highcharts={Highcharts}
                                                              options={chartOptions[ca].dataSource}
                                                              allowChartUpdate
                                                              containerProps={{
                                                                  style: {
                                                                      height: "290px",
                                                                      width: "100%"
                                                                  }
                                                              }}
                                                          />
                                                      </div>
                                                      <div className="chart-footer">
                                                          <div className="row ">
                                                              <div clas="col-md-12">
                                                                  <button className="btn btn-more" data-toggle="collapse" data-target={`#chart`}>
                                                                      {" "}
                                                                      <img src="/img/down-arrow.svg" alt="" />
                                                                  </button>
                                                              </div>
                                                          </div>
                                                          <div className="row collapse" id={`chart`}>
                                                              <div className="col-md-12">
                                                                  <div className="result-list">
                                                                      <ul className="align-items-start">
                                                                          {chartOptions[ca]?.summaryData?.length
                                                                              ? chartOptions[ca]?.summaryData?.map((cv, i) => {
                                                                                    return (
                                                                                        <li key={i}>
                                                                                            <div className="otr">
                                                                                                <strong>{cv.name}</strong>

                                                                                                <p>
                                                                                                    {" "}
                                                                                                    <NumberFormat
                                                                                                        value={
                                                                                                            ca === "Assets_Capital_Spending_Plan"
                                                                                                                ? parseFloat(
                                                                                                                      cv.valueSum / 1000000
                                                                                                                  ).toFixed(2)
                                                                                                                : cv.valueSum
                                                                                                        }
                                                                                                        thousandSeparator={true}
                                                                                                        displayType={"text"}
                                                                                                        suffix={
                                                                                                            ca === "Assets_Capital_Spending_Plan"
                                                                                                                ? "M"
                                                                                                                : ""
                                                                                                        }
                                                                                                        prefix={
                                                                                                            ca === "Assets_Capital_Spending_Plan"
                                                                                                                ? "$"
                                                                                                                : ""
                                                                                                        }
                                                                                                    />
                                                                                                    -
                                                                                                    {cv.valueSum
                                                                                                        ? Number(
                                                                                                              (
                                                                                                                  (cv.valueSum /
                                                                                                                      chartOptions[ca]?.totalSum) *
                                                                                                                  100
                                                                                                              ).toFixed(1)
                                                                                                          )
                                                                                                        : 0}{" "}
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
                                                          </div>
                                                      </div>
                                                  </>
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
