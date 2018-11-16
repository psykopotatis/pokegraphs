import Highcharts from 'highcharts';


export default function drawColumnChart(colors) {
    Highcharts.chart('charts', {
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
        }],
        tooltip: {
            formatter: function () {
                return 'Color <b>' + this.point.name + '</b> is ' + this.y;
            }
        }
    });
}
