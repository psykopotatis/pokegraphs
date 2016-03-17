export default function drawPieChart(colors) {
    var data = [];
    var plotColors = [];

    for (var i=0; i<colors.length; i++) {
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

    $('#charts').highcharts({
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
        }]
    });
}
