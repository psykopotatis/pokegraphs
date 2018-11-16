import Highcharts from "highcharts";


export default function drawPieChart(colors) {
    const data = [];
    const plotColors = [];

    for (let i=0; i<colors.length; i++) {
        plotColors.push(colors[i].color);

        if (i === 0) {
            data.push({
                name: colors[i].color,
                y: colors[i].y,
                sliced: true,
                selected: true
            });
        } else {
            data.push([
                colors[i].color,
                colors[i].y]
            );
        }
    }

    Highcharts.setOptions({
        colors: plotColors
    });

    Highcharts.chart('charts', {
        chart: {
            type: 'pie',
            backgroundColor: 'rgba(255, 255, 255, 0)'
        },
        credits: {
              enabled: false
        },
        title: {
            text: ''
        },
        exporting: { enabled: false },
        series: [{
            type: 'pie',
            data: data
        }],
        tooltip: {
            formatter: function () {
                return this.point.name + ' <b>' + Math.round(this.y * 10) / 10 + '%</b>';
            }
        }
    });
}
