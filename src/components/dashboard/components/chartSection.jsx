import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import LoadingOverlay from "react-loading-overlay";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";



import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock';
import highcharts3d from 'highcharts/highcharts-3d';
import highchartsMore from 'highcharts/highcharts-more';
// import HighChartExport from 'highcharts/modules/exporting';
import HighChartExportModule from 'highcharts/modules/export-data';
import LabelModule from 'highcharts/modules/series-label'
import GridLight from 'highcharts/themes/dark-blue';
import Loader from "../../common/components/Loader";
import ColorCodeData from "../../common/components/ColoCodeData"
import dashboardAction from "../actions"
// import Marker from "./marker";


highchartsMore(Highcharts);
highcharts3d(Highcharts);
// GridLight(Highcharts);
LabelModule(Highcharts)


Highcharts.setOptions({
    lang: {
        thousandsSep: ',',
        // decimalPoint: '.',
    },
    // style: {
    //     cursor: 'move'
    // }

})

class ChartSection extends Component {

    state = {
        chartArray: [],
        dataSource: {},
        fullScreen: null,
        legendArray: [],
        currentTotal: 0,
        current: null,
        currentHorizontal: null,
        fullScreenMap: false
    }




    componentDidUpdate = async (prevProps, prevState) => {
        const { getDashboardValue, getDashboardChartValue, getFciChartValue, getHorizontalChartValue, getMapValue } = this.props
        let tempArray = []
        if (prevProps.getDashboardValue != this.props.getDashboardValue) {
            if (getDashboardValue) {
                Object.keys(getDashboardValue).map(dashboard => {
                    if (dashboard !== "success" && dashboard !== "years" && dashboard !== "side_panel") {
                        tempArray.push({ name: dashboard, value: getDashboardValue[dashboard] })
                    }
                })
                this.setState({
                    chartArray: tempArray
                }, () => this.handleLegendArray()
                )
                this.handleManageCount(tempArray, "all")
            }
        }
        if (prevProps.getDashboardChartValue != getDashboardChartValue) {
            let tempArray = this.state.chartArray
            if (getDashboardChartValue) {
                Object.keys(getDashboardChartValue).map(dashboard => {
                    if (dashboard !== "success" && dashboard !== "years" && dashboard !== "side_panel") {
                        tempArray[0] = { name: dashboard, value: getDashboardChartValue[dashboard] }
                    }
                })
                this.setState({
                    chartArray: tempArray
                })
            }
        }
        if (prevProps.getFciChartValue != this.props.getFciChartValue) {
            let tempArray = this.state.chartArray
            if (getFciChartValue) {
                Object.keys(getFciChartValue).map(dashboard => {
                    if (dashboard !== "success" && dashboard !== "years" && dashboard !== "side_panel") {
                        tempArray[1] = { name: dashboard, value: getFciChartValue[dashboard] }
                    }

                })
                this.setState({
                    chartArray: tempArray
                })
                this.handleManageCount(tempArray, "fci")
            }
        }
        if (prevProps.getHorizontalChartValue != this.props.getHorizontalChartValue) {
            let tempArray = this.state.chartArray
            if (getHorizontalChartValue) {
                Object.keys(getHorizontalChartValue).map(dashboard => {
                    if (dashboard !== "success" && dashboard !== "years" && dashboard !== "side_panel") {
                        tempArray[3] = { name: dashboard, value: getHorizontalChartValue[dashboard] }
                    }

                })
                this.setState({
                    chartArray: tempArray
                })
                this.handleManageCount(tempArray, "horizontal")
            }
        }
        if (prevProps.getMapValue != this.props.getMapValue) {
            let tempArray = this.state.chartArray
            if (getMapValue) {
                Object.keys(getMapValue).map(dashboard => {
                    if (dashboard !== "success" && dashboard !== "years" && dashboard !== "side_panel") {
                        tempArray[2] = { name: dashboard, value: getMapValue[dashboard] }
                    }
                })
                this.setState({
                    chartArray: tempArray
                })
            }
        }
        if (prevProps.showColorModal != this.props.showColorModal) {
            if (!this.props.showColorModal) {
                this.setState({
                    current: ""
                })
            }
        }
        if (prevProps.showHorizontalData != this.props.showHorizontalData) {
            if (!this.props.showHorizontalData) {
                this.setState({
                    currentHorizontal: ""
                })
            }
        }

    }

    handleFullViewMap = (name, content) => {  
        if (this.state.fullScreen == name) {
            this.setState({
                fullScreen: ""
            })
        }
        else {
            this.setState({
                fullScreen:name
            })
        }
       
    }  

    handleManageCount = (content, current) => {

        let count = 0


        if (content) {
            Object.values(content).map(test => {
                if (current == "all" && (test.name == "fci_charts" || test.name == "horizontal_chart")) {
                    count = this.renderChartData(test) && this.renderChartData(test).labelValues && this.renderChartData(test).labelValues.length
                    if (this.state.fullScreen) {
                        Highcharts.charts.map(chart => chart && (chart.userOptions.chart.name == "fci_charts")
                            && chart.xAxis[0].setExtremes(0, count > 8 ? 8 : null))

                    }
                    else {
                        Highcharts.charts.map(chart => chart && (chart.userOptions.chart.name == test.name)
                            && chart.xAxis[0].setExtremes(0, count > 5 ? 5 : null))

                    }
                }
                else if (current == "fci" && (test.name == "fci_charts")) {
                    count = this.renderChartData(test) && this.renderChartData(test).labelValues && this.renderChartData(test).labelValues.length
                    if (this.state.fullScreen) {
                        Highcharts.charts.map(chart => chart && (chart.userOptions.chart.name == "fci_charts")
                            && chart.xAxis[0].setExtremes(0, count > 8 ? 8 : null))

                    }
                    else {
                        Highcharts.charts.map(chart => chart && (chart.userOptions.chart.name == test.name)
                            && chart.xAxis[0].setExtremes(0, count > 5 ? 5 : null))

                    }
                }
                else if (current == "horizontal" && (test.name == "horizontal_chart")) {
                    count = this.renderChartData(test) && this.renderChartData(test).labelValues && this.renderChartData(test).labelValues.length
                    if (this.state.fullScreen) {
                        Highcharts.charts.map(chart => chart && (chart.userOptions.chart.name == "fci_charts")
                            && chart.xAxis[0].setExtremes(0, count > 8 ? 8 : null))

                    }
                    else {
                        Highcharts.charts.map(chart => chart && (chart.userOptions.chart.name == test.name)
                            && chart.xAxis[0].setExtremes(0, count > 5 ? 5 : null))

                    }
                }
            })
        }

    };

    handleLegendArray = (content, name) => {
        let holder = {};
        let holderName = {};
        let chartValues = [];
        let data = []
        let legendArray = [];
        let graphData = name == "horizontal_chart" ? this.state.chartArray[3] : this.state.chartArray[0]
        let labelValues = graphData && graphData.value && graphData.value.length ? graphData.value.map(gd => (gd.data)) : []
        let mergedArray = [].concat.apply([], labelValues);
        let yearValues = [...new Set(graphData.value && graphData.value.length ? graphData.value.map(gd => (gd.year)) : [])]

        graphData.value && graphData.value.length && graphData.value.map(gd => { return data.push({ name: gd.name }) })
        mergedArray && mergedArray.length && mergedArray.forEach(function (d) {
            if (holder.hasOwnProperty(d.name)) {
                holder[d.name] = [...holder[d.name], d.amount]
            }
            else {
                holder[d.name] = [d.amount];
            }
        });
        let totalArray = mergedArray
        let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0)
        let currentTotal = sumOfAllValues
        totalArray && totalArray.length && totalArray.forEach(function (d) {
            if (holderName.hasOwnProperty(d.name)) {
                holderName[d.name] = holderName[d.name] + d.amount;
            } else {
                holderName[d.name] = d.amount;
            }
        });

        for (var prop in holder) {
            legendArray.push({ name: prop, y: holderName[prop] });
        }
        this.setState({
            legendArray,
            currentTotal
        })


    }

    handleFullView = (name, content) => {
        let holder = {};
        let holderName = {};
        let chartValues = [];
        let data = []
        let legendArray = [];
        Highcharts.charts.map(chart => {
            chart && chart.reflow()
        })
        let count = 0
        if (name == "fci_charts") {
            count = this.renderChartData(content) && this.renderChartData(content).labelValues && this.renderChartData(content).labelValues.length

        }
        else if (name == "horizontal_chart") {
            count = this.renderChartData(content) && this.renderChartData(content).labelValues && this.renderChartData(content).labelValues.length

        }
        if (this.state.fullScreen == name) {
            this.setState({
                fullScreen: null
            }, async () => {
                await Highcharts.charts.map(chart => {
                    chart && chart.reflow()
                    if (chart && chart.userOptions.chart.name == name) {

                        chart.xAxis[0].setExtremes(0, count > 5 ? 5 : null)
                    }

                })
                await this.props.fullScreenHandle(this.state.fullScreen)

            })
        }
        else {
            this.setState({
                fullScreen: name,

            }, async () => {
                await Highcharts.charts.map(chart => {
                    chart && chart.reflow()
                    if (chart && chart.userOptions.chart.name == name) {

                        chart.xAxis[0].setExtremes(0, count > 8 ? 8 : null)
                    }
                })
                await this.props.fullScreenHandle(this.state.fullScreen)
            })
            let graphData = content
            let labelValues = graphData.value && graphData.value.length ? graphData.value.map(gd => (gd.data)) : []
            let mergedArray = [].concat.apply([], labelValues);
            let yearValues = [...new Set(graphData.value && graphData.value.length ? graphData.value.map(gd => (gd.year)) : [])]
            if (name != "fci_charts") {
                graphData.value && graphData.value.length && graphData.value.map(gd => { return data.push({ name: gd.name }) })
                mergedArray && mergedArray.length && mergedArray.forEach(function (d) {
                    if (holder.hasOwnProperty(d.name)) {
                        holder[d.name] = [...holder[d.name], d.amount]
                    }
                    else {
                        holder[d.name] = [d.amount];
                    }
                });
                let totalArray = mergedArray
                let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0)
                let currentTotal = sumOfAllValues
                totalArray && totalArray.length && totalArray.forEach(function (d) {
                    if (holderName.hasOwnProperty(d.name)) {
                        holderName[d.name] = holderName[d.name] + d.amount;
                    } else {
                        holderName[d.name] = d.amount;
                    }
                });

                for (var prop in holder) {
                    legendArray.push({ name: prop, y: holderName[prop] });
                }
                this.setState({
                    legendArray,
                    currentTotal
                })
            }

        }


    }

    renderChartData = (graphData) => {

        let dataSource = {}
        let rtrnValue = {}
        let holder = {};
        let holderName = {};
        let chartValues = [];
        let data = []
        let legendArray = this.state.legendArray;

        if (graphData.name == "chart") {

            let labelValues = graphData.value && graphData.value.length ? graphData.value.map(gd => (gd.data)) : []
            let mergedArray = [].concat.apply([], labelValues);
            let yearValues = [...new Set(graphData.value && graphData.value.length ? graphData.value.map(gd => (gd.year)) : [])]

            graphData.value && graphData.value.length && graphData.value.map(gd => { return data.push({ name: gd.name }) })
            mergedArray && mergedArray.length && mergedArray.forEach(function (d) {
                if (holder.hasOwnProperty(d.name)) {
                    holder[d.name] = [...holder[d.name], d.amount]
                }
                else {
                    holder[d.name] = [d.amount];
                }
            });
            let totalArray = mergedArray
            let sumOfAllValues = this.state.currentTotal
            let currentTotal = this.state.currentTotal
            totalArray && totalArray.length && totalArray.forEach(function (d) {
                if (holderName.hasOwnProperty(d.name)) {
                    holderName[d.name] = holderName[d.name] + d.amount;
                } else {
                    holderName[d.name] = d.amount;
                }
            });

            for (var prop in holder) {
                chartValues.push({ name: prop, data: holder[prop] });
            }
            dataSource = {
                chart: {
                    type: 'column',
                    zoomType: 'xy',
                    // panning: true,
                    // panKey: 'shift',
                    options3d: {
                        enabled: false,
                        alpha: 15,
                        beta: 15,
                        viewDistance: 25,
                        depth: 95
                    },
                    backgroundColor: '#FFFFFF',
                    style: {
                        fontFamily: 'Poppins, sans-serif'
                    },
                    // reflow: true,
                    // height: this.state.fullScreen && this.state.fullScreen == "chart" ? 450 : 300,
                    // width: this.state.fullScreen && this.state.fullScreen == "chart" ? 800 : 500,


                },
                title: {
                    text: ''
                },

                xAxis: {
                    categories: yearValues,
                    labels: {
                        skew3d: true,
                        // style: {
                        //     fontSize: '14px'
                        // },

                    }
                },
                colors: ["#0018A8", "#bada55", "#66FF00", "#800080", "#3E8EDE",
                    "#00bfff", "#7B68EE", "#7fe5f0", "#8a2be2", "#407294",
                    "#5ac18e", "#576675",
                    "#008080", "#ffd700", "#7CFC00", "#ffa500",
                    "#00ffff", "#40e0d0", "#0000ff",
                    "#b0e0e6", "#c6e2ff",
                    "#003366", "#7fffd4",
                    "#00ff00", "#4ca3dd", "#468499",
                    "#00ced1", "#6897bb"],



                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: '',
                        skew3d: true
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            // format: '$ {point.y:.1f}',
                            color: ( // theme
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color
                            ) || 'gray',

                        },
                        formatter: function () {
                            return "$" + (this.total / 1000000).toFixed(2) + "M";
                        },
                    }
                },
                legend: {
                    enabled: this.state.fullScreen ? true : false,
                    maxHeight: 62,
                },
                tooltip: {
                    headerFormat: '<b>{point.key}</b><br>',
                    pointFormat: `<span style="color:{series.color}">\u25CF</span> {series.name}: $ {point.y} `
                },
                labels: {
                    formatter: function () {
                        return Highcharts.numberFormat(this.value, 2, ',', ' ');
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        depth: 90,
                        showInLegend: true,
                    },
                    series: {
                        events: {
                            legendItemClick: (event) => {
                                var sumOfCurrentLegend = event.target.yData.reduce(function (a, b) {
                                    return a + b;
                                }, 0);

                                if (event.target.visible) {
                                    currentTotal = currentTotal - sumOfCurrentLegend
                                    legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name)

                                }
                                else {
                                    currentTotal = currentTotal + sumOfCurrentLegend
                                    legendArray.push({ name: event.target.options.name, y: sumOfCurrentLegend })
                                    let l = legendArray.length, flags = [], output = []
                                    for (let i = 0; i < l; i++) {
                                        if (flags[legendArray[i].name]) continue;
                                        flags[legendArray[i].name] = true;
                                        output.push({ name: legendArray[i].name, y: legendArray[i].y });
                                    }
                                    legendArray = output

                                }
                                this.setState({
                                    legendArray,
                                    currentTotal
                                })
                            }
                        }
                    }

                },
                series: chartValues
            }
            rtrnValue = {
                dataSource,
                legendArray,
                currentTotal

            }

            return rtrnValue

        }
        else if (graphData.name == "fci_charts") {
            let labelValues = []
            graphData.value && graphData.value.length && graphData.value.map(gd => labelValues.push(gd.name))
            graphData && graphData.value && graphData.value.length && graphData.value.map(gd => chartValues.push({
                name: gd.name, y: gd.amount, color: gd.color, building_type: gd.building_type,
                building_type_id: gd.building_type_id, comments: gd.comments,
                CRV: gd.crv,
                DM: gd.dm,
                site: gd.site,
                project_id: gd.project_id,
                entity_id: gd.entity_id,
                hospital_name: gd.hospital_name,  
                project_name: gd.project_name
            }))


            dataSource = {
                chart: {
                    name: "fci_charts",
                    type: 'bar',
                    style: {
                        fontFamily: 'Poppins, sans-serif',

                    },
                    marginLeft: 90,
                    animation: {
                        duration: 1000,
                        easing: 'easeOutBounce'
                    },
                    // reflow: true,
                    // height: this.state.fullScreen && this.state.fullScreen == "fci_charts" ? 450 : 300,
                    // width: this.state.fullScreen && this.state.fullScreen == "fci_charts" ? 800 : 500,

                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    id: 'x-axis-1',
                    categories: labelValues,
                    title: {
                        text: null
                    },
                    scrollbar: {
                        enabled: this.state.fullScreen ? (chartValues.length > 8 ? true : false) : (chartValues.length > 5 ? true : false)
                    },
                    labels: {
                        enabled: true,

                        style: {
                            cursor: 'pointer'
                        },
                        formatter: item => {
                            const color = this.state.current === item.value ? "#007bff" : "black";
                            const fontWeight =
                                this.state.current === item.value ? "bold" : "normal";
                            return `<span style="color: ${color}; font-weight: ${fontWeight}" onClick={}>${item.value
                                }</span>`;
                        },


                    },
                    min: 0,
                    max: this.state.fullScreen ? (chartValues.length > 8 ? 8 : null) : (chartValues.length > 5 ? 5 : null)
                },
                yAxis: {
                    min: 0,

                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify',
                        useHTML: true,  


                    },


                },
                tooltip: {
                    formatter: function () {
                        var s = this.point.building_type ? '<b>' + this.key + ' ( ' + this.point.building_type + ' ) ' + '</b>' : '<b>' + this.key + '</b>';
                        s += `<br/><span>Parent Building :  ${this.point != null ? this.point.hospital_name : ''} </span>`
                        s += `<br/><span>Site:  ${this.point.site != null ? this.point.site : ''} </span>`
                        s += `<br/><span >` + '  FCI : ' + this.y + `<span>`
                        s += `<br/><span>Description :  ${this.point.comments != null ? this.point.comments : ''} </span>`
                        s += `<br/><span>  DM : ${this.point.DM != null ? ("$ " + (this.point.DM / 1000000).toFixed(2) + "M") : ''} </span>`
                        s += `<br/><span> CRV : ${this.point.CRV != null ? ("$ " + (this.point.CRV / 1000000).toFixed(2) + "M") : ''} </span>`
                        return s;
                    },
                    // headerFormat: '<b>{point.key}</b><br>',
                    // pointFormat: `<span style="color:{point.color}">\u25CF</span> FCI : $ {point.y} `
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                        // animation: false

                    },
                    series: {
                        allowPointSelect: true,
                        states: {
                            select: {
                                color: null,
                                borderWidth: this.props.showColorModal ? 2 : null,
                                borderColor: this.props.showColorModal ? 'black' : null
                            }
                        },

                    },


                    // overflow: "justify"
                },
                legend: {
                    enabled: false,

                },
                credits: {
                    enabled: false
                },
                series: [
                    {
                        cursor: 'pointer',
                        events: {
                            click: async (event) => {
                                this.setState({ current: event.point.category });
                                await this.props.getAllLegents({ building_type_id: event.point.building_type_id })
                                await this.props.handleViewLegent(event)

                            }
                        },
                        data: chartValues
                    },


                ],
            }
            rtrnValue = {
                dataSource,
                labelValues
            }
            function customClickEvent(e) {
                alert('You clicked on ' + (this.value ? this.value : 'a stack label') + '!');
            }

            return rtrnValue


        }
        else if (graphData.name == "horizontal_chart") {
            let labelValues = []
            let testArray = []
            graphData.value && graphData.value.length && graphData.value.map(gd => {
                labelValues.push(gd.name)
                testArray.push(gd.data)
            })

            let testValues = []
            let mergedDataArray = []
            testArray && testArray.length && testArray.map(gd => gd.map(t => mergedDataArray.push(t)))
            let mergedArray = [].concat.apply([], mergedDataArray);
            let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0)
            let currentTotal = sumOfAllValues

            mergedArray.forEach(function (d) {
                if (holder.hasOwnProperty(d.name)) {
                    holder[d.name] = [...holder[d.name], d.amount]
                } else {
                    holder[d.name] = [d.amount];
                }
            });
            let totalArray = mergedArray

            totalArray && totalArray.length && totalArray.forEach(function (d) {
                if (holderName.hasOwnProperty(d.name)) {
                    holderName[d.name] = holderName[d.name] + d.amount;
                } else {
                    holderName[d.name] = d.amount;
                }
            });



            // var chartValue = [];
            // for (var prop in holder) {
            //     chartValue.push({
            //         name: prop, data: holder[prop],
            //     });
            // }

            let chart_keys = []
            let chartValue = []
            let siteKeys = []
            graphData.value.map(x => x.data.map(y => chart_keys.includes(y.name) ? '' :
                chart_keys.push(y.name)))
            graphData.value.map(x =>
                siteKeys.push(x.site))

            let final_array = []
            chart_keys.map(x => final_array[x] = [])
            chart_keys.map(k => graphData.value.map(x =>
                x.data.map(y => y.name).includes(k) ?
                    x.data.map(z => z.name == k ? final_array[k].push(z.amount) : '') :
                    final_array[k].push(0)))
            for (var prop in final_array) {
                chartValue.push({
                    name: prop, data: final_array[prop]
                });
            }


            dataSource = {
                chart: {
                    name: "horizontal_chart",
                    type: 'bar',
                    style: {
                        fontFamily: 'Poppins, sans-serif'
                    },
                    marginLeft: 90,
                    animation: {
                        duration: 1000
                    },

                    // height: this.state.fullScreen ? 450 : 300,
                    // width: this.state.fullScreen ? 800 : 500,


                },
                title: {
                    text: ''
                },
                colors: ["#0018A8", "#bada55", "#66FF00", "#800080", "#3E8EDE",
                    "#00bfff", "#7B68EE", "#7fe5f0", "#8a2be2", "#407294",
                    "#5ac18e", "#576675",
                    "#008080", "#ffd700", "#7CFC00", "#ffa500",
                    "#00ffff", "#40e0d0", "#0000ff",
                    "#b0e0e6", "#c6e2ff",
                    "#003366", "#7fffd4",
                    "#00ff00", "#4ca3dd", "#468499",
                    "#00ced1", "#6897bb"],
                xAxis: {
                    categories: labelValues,
                    scrollbar: {
                        enabled: this.state.fullScreen && this.state.fullScreen == "horizontal_chart" ? (labelValues && labelValues.length > 8 ? true : false) : (labelValues && labelValues.length > 5 ? true : false)
                    },
                    labels: {
                        enabled: true,

                        style: {
                            cursor: 'pointer'
                        },
                        formatter: item => {
                            const color = this.state.currentHorizontal === item.value ? "#007bff" : "black";
                            const fontWeight =
                                this.state.currentHorizontal === item.value ? "bold" : "normal";
                            return `<span style="color: ${color}; font-weight: ${fontWeight}" onClick={}>${item.value
                                }</span>`;
                        },


                    },


                    min: 0,
                    max: this.state.fullScreen && this.state.fullScreen == "horizontal_chart" ? (labelValues && labelValues.length > 8 ? 8 : null) : (labelValues && labelValues.length > 5 ? 5 : null)
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            // format: '$ {point.y:.1f}',
                            color: ( // theme
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color
                            ) || 'gray'
                        },
                        formatter: function () {
                            return "$" + (this.total / 1000000).toFixed(2) + "M";
                        },
                        // borderRadius: 2,
                        // backgroundColor: '#edf2f6',
                        // borderWidth: 1,
                        // borderColor: '#AAA',
                        // y: -5
                    },
                },
                legend: {
                    enabled: this.state.fullScreen ? true : false,
                    // maxHeight: 20,
                    // itemStyle: {
                    //     fontSize: '12px'
                    // }
                },
                tooltip: {
                    formatter: function () {
                        let currentData = graphData && graphData.value && graphData.value.length && graphData.value.find(gd => gd.name == this.point.category)
                        var s = currentData && currentData.building_type ? '<b>' + this.point.category + ' ( ' + currentData.building_type + ' ) ' + '</b>' : '<b>' + this.point.category + '</b>';
                        s += `<br/><span>Parent Building :  ${currentData != null ? currentData.hospital_name : ''} </span>`
                        s += `<br/><span>Site :  ${siteKeys ? siteKeys[this.point.index] : ''} </span>`
                        s += `<br/><span> ` + this.point.series.name + (" : $ " + (this.y / 1000000).toFixed(2) + "M")
                        s += `<br/><span>Description :  ${currentData && currentData.description != null ? currentData.description : ''} </span>`
                        // s += `<br/><span>  Building Type :  ${currentData && currentData.building_type != null ? currentData.building_type : ''} </span>`
                        return s;
                    },
                    // headerFormat: '<b>{point.key}</b><br>',
                    // pointFormat: `<span style="color:{point.color}">\u25CF</span> FCI : $ {point.y} `
                },
                // tooltip: {
                //     headerFormat: '<b>{point.key}</b><br>',
                //     pointFormat: `<span style="color:{series.color}">\u25CF</span> {series.name}: $ {point.y} `
                // },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        // animation: false
                        events: {
                            legendItemClick: (event) => {
                                var sumOfCurrentLegend = event.target.yData.reduce(function (a, b) {
                                    return a + b;
                                }, 0);

                                if (event.target.visible) {
                                    currentTotal = currentTotal - sumOfCurrentLegend
                                    legendArray = legendArray && legendArray.filter(l => l.name != event.target.options.name)

                                }
                                else {
                                    currentTotal = currentTotal + sumOfCurrentLegend
                                    legendArray.push({ name: event.target.options.name, y: sumOfCurrentLegend })
                                    let l = legendArray.length, flags = [], output = []
                                    for (let i = 0; i < l; i++) {
                                        if (flags[legendArray[i].name]) continue;
                                        flags[legendArray[i].name] = true;
                                        output.push({ name: legendArray[i].name, y: legendArray[i].y });
                                    }
                                    legendArray = output

                                }
                                this.setState({
                                    legendArray,
                                    currentTotal
                                })
                            },
                            click: (event) => {
                                this.setState({ currentHorizontal: event.point.category });
                                let currentData = graphData && graphData.value && graphData.value.length && graphData.value.find(gd => gd.name == event.point.category)
                                this.props.viewDetails(event.point, currentData)
                            },
                        },
                        allowPointSelect: true,
                        cursor: 'pointer',
                        states: {
                            select: {
                                color: null,
                                borderWidth: this.props.showHorizontalData ? 2 : null,
                                borderColor: this.props.showHorizontalData ? 'black' : null
                            }
                        },

                    }

                },

                series: chartValue

            }
            rtrnValue = {
                dataSource,
                legendArray,
                currentTotal,
                labelValues
            }
            return rtrnValue

        }
        else if (graphData.name == "map") {
            dataSource = graphData && graphData.value
            rtrnValue = dataSource
            return rtrnValue

        }
    }

    renderHeading = (type) => {
        const { dashboardFilterParams } = this.props
        let noOfYears = 10
        if (dashboardFilterParams.start_year) {
            noOfYears = 1 + dashboardFilterParams.end_year - dashboardFilterParams.start_year
        }
        switch (type) {
            case 'chart': return this.renderChartHeading()
            case 'fci_charts': return "FCI Chart"
            case 'map': return "Map"
            case 'horizontal_chart': return `FCA ${noOfYears} Year CSP`
        }
    }

    renderChartHeading = () => {
        const { dashboardFilterParams } = this.props
        let noOfYears = 10
        if (dashboardFilterParams.start_year) {
            noOfYears = 1 + dashboardFilterParams.end_year - dashboardFilterParams.start_year
        }

        const { chartParams } = this.props
        switch (chartParams.chart_type) {
            case 'trades': return `FCA ${noOfYears} Year CSP By Trade Chart`
            case 'categories': return `FCA ${noOfYears} Year CSP By Category Chart`
            case 'funding_sources': return `FCA ${noOfYears} Year CSP  By  Funding Source Chart`
            case 'projects': return `FCA ${noOfYears} Year CSP  By Project Chart`
            case 'priorities': return `FCA ${noOfYears} Year CSP  By Priority Chart`
            case 'sites': return `FCA ${noOfYears} Year CSP  By Sites Chart`
            case 'buildings': return `FCA ${noOfYears} Year CSP  By Buildings Chart`
            case 'regions': return `FCA ${noOfYears} Year CSP  By Regions Chart`
        }

    }

    renderClass = (name, fullscreen) => {
        switch (name) {
            case 'chart': return fullscreen ? "graph-ara" : "chart-dash"
            case 'fci_charts': return fullscreen ? "graph-ara fci-chrt" : "chart-dash"
            case 'map': return  fullscreen ? "graph-ara fci-chrt" : "test"
            case 'horizontal_chart': return fullscreen ? "graph-ara" : "chart-dash"
        }
    }

    renderDropDownValues = (type) => {

        switch (type) {
            case 'chart': return [{ name: "Categories", values: "categories" },
            { name: "Trades", values: "trades" }, { name: "Funding Sources", values: "funding_sources" },
            { name: "Priorities", values: "priorities" },
            { name: "Projects", values: "projects" },
            { name: "Regions", values: "regions" },
            { name: "Sites", values: "sites" },
            { name: "Buildings", values: "buildings" }]
            case 'horizontal-list': return [{ name: "Categories", values: "categories" },
            { name: "Trades", values: "trades" }, { name: "Funding Sources", values: "funding_sources" },
            { name: "Priorities", values: "priorities" }]
            case 'horizontal-map': return [
                { name: "Buildings", values: "building" },
                { name: "Sites", values: "site" },
                { name: "Regions", values: "region" },
                { name: "Projects", values: "project" }
            ]
            case 'fci_charts': return [
                { name: "Buildings", values: "buildings" },
                { name: "Sites", values: "sites" },
                { name: "Regions", values: "regions" },
                { name: "Projects", values: "projects" }
            ]
            case 'map': return [{ name: "Sites", values: "site" }, { name: "Buildings", values: "building" }]
        }
    }


    render() {
        const { dashboardFilterParams, fciSortName, fciSortValue, horizontalSortName, horizontalSortValue, chartParams, individualFilters } = this.props
        const { chartArray, dataSource, fullScreen } = this.state

        return (
            <React.Fragment>
                <div className="row ">
                    <div className={"col-md-12"}>
                        <div className="w-100 float-left ">
                            {chartArray && chartArray.length ? chartArray.map(ca => {
                                return (!fullScreen || (fullScreen && fullScreen == ca.name)) ? <div className={fullScreen == ca.name ? "sld-ara w-100" : "sld-ara"} >
                                    <div className={"hed-set"} >
                                        <h2>{this.renderHeading(ca.name)}</h2>
                                        <div className="btn-grp">
                                            {ca.name == "fci_charts" ? < > <button type="button" className={individualFilters.fci_sort_by == "name" ? "btn btn-outline-secondary ml-2 act-btn" : "btn btn-outline-secondary ml-2 "} onClick={() => {
                                                this.props.filterFcaChart("name", !fciSortName)
                                            }}>Name
                                        {fciSortName === false ?
                                                    <i className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}></i>
                                                    : fciSortName === true ?
                                                        <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                                                        : null
                                                }

                                            </button>
                                                <button type="button" className={individualFilters.fci_sort_by == "value" ? "btn btn-outline-secondary mr-2 act-btn" : "btn btn-outline-secondary mr-2 "}
                                                    onClick={() => {
                                                        this.props.filterFcaChart("value", !fciSortValue)
                                                    }}
                                                >Value{fciSortValue === false ?
                                                    <i className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}></i>
                                                    : fciSortValue === true ?
                                                        <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                                                        : null
                                                    }
                                                </button></> : null}
                                            {ca.name == "horizontal_chart" ? < > <button type="button" className={individualFilters.chart_sort_by == "name" ? "btn btn-outline-secondary ml-2 act-btn" : "btn btn-outline-secondary ml-2 "} onClick={() => {
                                                this.props.filterHorizontalChart("name", !horizontalSortName)
                                            }}>Name
                                        {horizontalSortName === false ?
                                                    <i className={"fas fa-long-arrow-alt-down table-param-rep text-danger"}></i>
                                                    : horizontalSortName === true ?
                                                        <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                                                        : null
                                                }
                                            </button>
                                                <button type="button" className={individualFilters.chart_sort_by == "value" ? "btn btn-outline-secondary mr-2 act-btn" : "btn btn-outline-secondary mr-2 "}
                                                    onClick={() => {
                                                        this.props.filterHorizontalChart("value", !horizontalSortValue)
                                                    }}
                                                >Value
                                              {horizontalSortValue === false ?
                                                        <i className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}></i>
                                                        : horizontalSortValue === true ?
                                                            <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                                                            : null
                                                    }
                                                </button></> : null}
                                            {ca.name == "fci_charts" ? <div className="custom-selecbox">
                                                <select className="custom-selecbox form-control"
                                                    value={individualFilters.fci_type}
                                                    onChange={async (e) => {
                                                        await this.props.handleMapChange(e, ca.name, "fci_type")
                                                    }}>

                                                    {this.renderDropDownValues(ca.name) && this.renderDropDownValues(ca.name).length &&
                                                        this.renderDropDownValues(ca.name).map(drop => {
                                                            return <option value={drop.values}>{drop.name}</option>
                                                        })}

                                                </select>
                                            </div> :
                                                (ca.name != "horizontal_chart" ?
                                                    <div className="custom-selecbox ">
                                                        <select className="custom-selecbox form-control"
                                                            value={ca.name == "map" ? individualFilters.map_type : individualFilters.chart_type}
                                                            onChange={async (e) => {
                                                                await this.props.handleMapChange(e, ca.name)
                                                                await this.handleLegendArray(ca, ca.name)
                                                            }}>

                                                            {this.renderDropDownValues(ca.name) && this.renderDropDownValues(ca.name).length &&
                                                                this.renderDropDownValues(ca.name).map(drop => {
                                                                    return <option value={drop.values}>{drop.name}</option>
                                                                })}

                                                        </select>
                                                    </div> : <>
                                                        <div className="custom-selecbox mr-2">
                                                            <select className="custom-selecbox form-control"
                                                                value={individualFilters.display}
                                                                onChange={async (e) => {
                                                                    await this.props.handleMapChange(e, ca.name, "display")
                                                                    await this.handleLegendArray(ca, ca.name)
                                                                }}>

                                                                {this.renderDropDownValues("horizontal-map") && this.renderDropDownValues("horizontal-map").length &&
                                                                    this.renderDropDownValues("horizontal-map").map(drop => {
                                                                        return <option value={drop.values}>{drop.name}</option>
                                                                    })}

                                                            </select>

                                                        </div>
                                                        <div className="custom-selecbox pl-2">
                                                            <select className="custom-selecbox form-control"
                                                                value={individualFilters.horizontal_chart_type}
                                                                onChange={async (e) => {
                                                                    await this.props.handleMapChange(e, ca.name, "horizontal_chart_type")
                                                                    await this.handleLegendArray(ca, ca.name)
                                                                }}>

                                                                {this.renderDropDownValues("horizontal-list") && this.renderDropDownValues("horizontal-list").length &&
                                                                    this.renderDropDownValues("horizontal-list").map(drop => {
                                                                        return <option value={drop.values}>{drop.name}</option>
                                                                    })}

                                                            </select>

                                                        </div>
                                                    </>
                                                )}
                                            {ca.name != "map" ? <div className="fl-srn" onClick={() => this.handleFullView(ca.name, ca)}><img src="/img/restore.svg" alt="" className="set-icon-width" /></div> :
                                                <div className="fl-srn" onClick={() => this.handleFullViewMap(ca.name, ca)}><img src="/img/restore.svg" alt="" className="set-icon-width" /></div>}
                                        </div>
                                    </div>
                                    {
                                        ca.name != "map" ? <>
                                            {this.renderChartData(ca) && this.renderChartData(ca).dataSource && this.renderChartData(ca).dataSource.series && this.renderChartData(ca).dataSource.series.length && (ca.name != "fci_charts"
                                                || (ca.name == "fci_charts" && this.renderChartData(ca).dataSource.series[0].data && this.renderChartData(ca).dataSource.series[0].data.length)) ?
                                                <div className={this.renderClass(ca.name, fullScreen)} >
                                                    <HighchartsReact
                                                        highcharts={Highcharts}
                                                        allowChartUpdate
                                                        options={this.renderChartData(ca).dataSource}
                                                        containerProps={fullScreen ?
                                                            {
                                                                style: {
                                                                    height: "400px", width: "800px"
                                                                }
                                                            }

                                                            : { style: { height: "300px", width: "550px" } }}
                                                    />
                                                    {fullScreen && fullScreen == ca.name && fullScreen != "fci_charts" ?
                                                        <><div className="chart-footer">
                                                            <div className="row">
                                                                <div className="col-md-9 pr-0">
                                                                    <div className="result-list">
                                                                        <ul>
                                                                            {this.state.legendArray && this.state.legendArray.length ? this.state.legendArray.map(cv => {
                                                                                return <li>
                                                                                    <div className="otr">
                                                                                        <strong>{cv.name}</strong>

                                                                                        <p>  <NumberFormat
                                                                                            value={parseFloat(
                                                                                                (cv.y / 1000000)
                                                                                            ).toFixed(2)}
                                                                                            thousandSeparator={true}
                                                                                            displayType={"text"}
                                                                                            suffix={"M"}
                                                                                            prefix={"$ "}
                                                                                        />- {cv.y ? (Number(((cv.y / this.state.currentTotal) * 100).toFixed(1))) : 0}%</p>
                                                                                    </div>
                                                                                </li>
                                                                            }) : null}
                                                                        </ul>
                                                                    </div>

                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="result-total">
                                                                        <strong>TOTAL =<NumberFormat
                                                                            value=
                                                                            {parseFloat(
                                                                                ((this.state.currentTotal ? this.state.currentTotal : 1) / 1000000)
                                                                            ).toFixed(2)}
                                                                            suffix={"M"}
                                                                            thousandSeparator={true}
                                                                            displayType={"text"}
                                                                            prefix={"$ "}
                                                                        /></strong>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div></> : null}
                                                </div> : <div className={(fullScreen && fullScreen == ca.name) ? "coming-soon no-data no-dat" : "coming-soon no-data"}>
                                                    <div className="coming-soon-img">
                                                        <img src="/img/no-data.svg" /></div>
                                                    <div className="coming-txt"><h3>NO DATA FOUND</h3>
                                                        <h4>There is no data to show you right now!!!</h4>
                                                    </div>

                                                </div>}</>
                                            // : this.renderChartData(ca) && this.renderChartData(ca).length ? <>
                                            //     <div className={this.renderClass(ca.name, fullScreen)}>
                                            //         <Marker markers={this.renderChartData(ca)} dashboardFilterParams={dashboardFilterParams} />
                                            //     </div> </> : <div className="coming-soon no-data">
                                            //         <div className="coming-soon-img">
                                            //             <img src="/img/no-data.svg" /></div>
                                            //         <div className="coming-txt"><h3>NO DATA FOUND</h3>
                                            //             <h4>There is no data to show you right now!!!</h4>
                                            //         </div>
                                            //     </div>
                                            :null
                                    }
                                </div>
                                    // </LoadingOverlay>
                                    : null
                            })
                                : null}
                        </div>
                    </div>
                </div >

            </React.Fragment >
        )
    }
}

const mapStateToProps = state => {
    const { commonReducer, dashboardReducer, buildingReducer } = state;
    return { commonReducer, dashboardReducer, buildingReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...dashboardAction
    })(ChartSection)
);
