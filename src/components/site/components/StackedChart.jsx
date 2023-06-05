import React, { Component } from "react";
import ReactApexChart from 'react-apexcharts'



class StackedChart extends Component {


    render() {
        const { graphData } = this.props
        let labelValues = graphData && graphData.length ? graphData.map(gd => (gd.data)) : []
        let yearValues = graphData && graphData.length ? graphData.map(gd => (gd.year)) : []
        let mergedArray = [].concat.apply([], labelValues);
        var holder = {};
        mergedArray.forEach(function (d) {
            if (holder.hasOwnProperty(d.name)) {
                holder[d.name] = [...holder[d.name],d.amount]
            }
            else {
                holder[d.name] = [d.amount];
            }
        });
        var obj2 = [];
        for (var prop in holder) {
            obj2.push({ name: prop, data: holder[prop] });
        }

        // mergedArray.forEach(function (d) {
        //     if (holder.hasOwnProperty(d.name)) {
        //         holder[d.name] = [...holder[d.name], { value: d.amount }]
        //     }
        //     else {
        //         holder[d.name] = [{ value: d.amount }];
        //     }
        // });

        // for (var prop in holder) {
        //     chartValue.push({ seriesname: prop, data: holder[prop] });
        // }
        const series = obj2
        const options = {
            chart: {
                type: 'bar',
                height: 450,
                width: 950,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },

            xaxis: {
                type: 'year',
                categories: yearValues
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
                },
                itemMargin: {
                    horizontal: 5,
                    vertical: 0
                },
                // show:false
            },

            fill: {
                opacity: 1
            }
        }
        return (
            <>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    width="950"
                    height={450} />
            </>
        )
    }
}
export default StackedChart;