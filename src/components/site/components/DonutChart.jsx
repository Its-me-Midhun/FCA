import React, { Component } from "react";
import ReactApexChart from 'react-apexcharts'



class DonutChart extends Component {

    series = [44, 55, 41]





    render() {
        const { graphData } = this.props
        let labelValues = graphData && graphData.length ? graphData.map(gd => (gd.data)) : []
        let mergedArray = [].concat.apply([], labelValues);
        let uniqueKeys = Object.keys(mergedArray).map(key => (mergedArray[key].name));
        let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0)

        var holder = {};

        mergedArray.forEach(function (d) {
            if (holder.hasOwnProperty(d.name)) {
                holder[d.name] = holder[d.name] + d.amount;
            } else {
                holder[d.name] = d.amount;
            }
        });

        var obj2 = [];

        for (var prop in holder) {
            obj2.push({ name: prop, value: holder[prop] });
        }

        const series = obj2 && obj2.length ? Object.keys(obj2).map(key => (obj2[key].value)) : []
        const options = {
            chart: {
                type: 'donut',
            },
            labels: [...new Set(uniqueKeys)],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false
                    }
                }
            }],
            plotOptions: {
                pie: {
                    donut: {
                        size: '50%'
                    },
                    legend: {
                        show: false
                    }
                }
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'left',
                fontSize: '16px',
                fontWeight: '600',
                markers: {
                    radius: '2px',
                    width: '20px',
                    height: '24px',
                    // customHTML: function () {
                    //     return '<div class="row"> <div class="col-md-6"><div class="result-list"><ul><li><i class="result-01"></i> <div class="otr"></div></li></ul></div></div>'
                    // }
                }
                // show:false
            },
        }
        return (
            <>
                <ReactApexChart
                    options={options}
                    series={series}
                    width="800px"
                    height="450px"
                    type="donut" />
            </>
        )
    }
}
export default DonutChart;