"use strict";

export default function drawColumnChart(colors) {
    $('#charts').highcharts({
        chart: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            type: 'column',
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 10,
                depth: 50,
                viewDistance: 30
            }
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        xAxis: {
            type: 'category'
        },
        legend: {
            enabled: false
        },
        exporting: { enabled: false },
        title: {
            text: ''
        },
        plotOptions: {
            column: {
                depth: 30
            }
        },
        credits: {
              enabled: false
        },
        series: [{
            data: colors
        }],
        tooltip: {
            formatter: function () {
                return this.point.name + ' <b>' + Math.round(this.y * 10) / 10 + '%</b>';
            }
        }
    });
}
