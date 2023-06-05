import React, { Component } from "react";
import ReactApexChart from 'react-apexcharts'

class PieChart extends Component {

    render() {
        const { graphData } = this.props
        let labelValues = graphData && graphData.length ? graphData.map(gd => (gd.data)) : []
        let mergedArray = [].concat.apply([], labelValues);
        let uniqueKeys = Object.keys(mergedArray).map(key => (mergedArray[key].name));
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
        const series = chartValue && chartValue.length ? Object.keys(chartValue).map(key => (chartValue[key].value)) : []
        const options = {
            chart: {
                height: 100,
                width: 550,
                type: 'pie',
            },
            labels: [...new Set(uniqueKeys)],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'left',
                    }
                }
            }],
            
            legend: {
                position: 'bottom',
                horizontalAlign: 'left',
                fontSize: '20px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '600',
                labels: {
                    fontSize: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600',
                },
                markers: {
                    radius: '2px',
                    width: '20px',
                    height: '24px',
                }
                // show:false
            },
            
        }
        return (
            <>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="pie"
                    width={550} />
            </>
        )
    }
}
export default PieChart;