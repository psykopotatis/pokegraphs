"use strict";

export default function drawColumnChart(colors) {
    $('#charts').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0)'},
        title: {
            text: ''
        },
        xAxis: {
            type: 'category',
            minPadding: 0,
            maxPadding: 0
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        credits: {
              enabled: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },
        exporting: { enabled: false },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: colors
        }]

    });
}
