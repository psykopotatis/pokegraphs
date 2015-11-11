var indexTemplate = require("text!./templates/index.html");
var PokeModel = require("./pokeModel");

const PokeView = Backbone.View.extend({
    el: $('#pokegraphs'),

    events: {
        'click .fa-pie-chart': 'drawPieChart',
        'click .fa-bar-chart': 'drawBarChart'
    },

    initialize: function() {
        $(document).keydown(_.bind(this.onKeyDown, this));

        this.canvas = document.getElementById('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext('2d');

        this.calculateZoom();
        this.calculateCenter();
        this.calculateChartHeight();

        this.pokeId = Math.round(Math.random() * 649);

        this.fetchPoke();
    },

    fetchPoke: function() {
        this.pokeModel = new PokeModel({ id: this.pokeId + '.json' });
        const name = this.pokeModel.getName(this.pokeId);
        this.$el.find('#info .name').html(this.pokeId + '.' + name);

        this.pokeModel.fetch({
            success: (model) => {
                this.pixels = model.get('pixels');
                this.colors = model.get('colors');
                this.lightest = model.get('lightest');

                this.render();
            },
            error: (model, response) => {
                console.log('error', model, response);
            }
        });
    },

    calculateZoom: function() {
        const smallestSide = Math.min(window.innerWidth, window.innerHeight);
        this.zoom = Math.floor(smallestSide / 96);
    },

    calculateCenter: function() {
        this.x = (window.innerWidth - (this.zoom * 96)) / 2;
        this.y = (window.innerHeight - (this.zoom * 96)) / 2;
    },

    calculateChartHeight: function() {
        $('#charts').css('height', window.innerHeight);
    },

    render: function() {
        this.clearCanvas();
        this.renderBackground();
        this.drawPieChart();
        // this.renderColorBlocks();
        this.renderPokemon();
    },

    clearCanvas: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    renderBackground() {
        this.$el.css('background-color', this.lightest);
    },

    renderTemplate() {
        var compiledTemplate = _.template(indexTemplate);
        this.$el.html(compiledTemplate);
    },

    drawPieChart: function() {
        var data = [];
        var plotColors = [];

        for (var i=0; i<this.colors.length; i++) {
            plotColors.push(this.colors[i].color);

            if (i === 0) {
                data.push({
                    name: this.colors[i].color,
                    y: this.colors[i].y,
                    sliced: true,
                    selected: true
                });
            } else {
                data.push([
                    this.colors[i].color,
                    this.colors[i].y]
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
            title: {
                text: ''
            },
            exporting: { enabled: false },
            series: [{
                type: 'pie',
                data: data
            }]
        });
    },

    drawBarChart: function() {
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
                data: this.colors
            }]

        });
    },

    renderColorBlocks: function() {
        _.each(this.colors, (color) => {
            this.$el.find('#blocks').append('<div class="color-block" style="background-color:' + color + '" />');
        });

        this.setColorBlockHeights();
    },

    setColorBlockHeights: function() {
        this.$el.find('#blocks').css('height', window.innerHeight + 'px');
        const blockHeight = (window.innerHeight / this.colors.length) / window.innerHeight * 100;
        this.$el.find('.color-block').css('height', blockHeight + '%');
    },

    renderPokemon: function() {
        for (let x=0; x < 96; x++) {
            for (let y=0; y < 96; y++) {
                const color = this.pixels[x][y];
                if (color !== 0) {
                    this.drawPixel(this.x + (x * this.zoom), this.y + (y * this.zoom), color);
                }
            }
        }
    },

    drawPixel: function(x, y, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, this.zoom, this.zoom);
    },

    onKeyDown: function(e) {
        e = e || window.event;

        switch (e.keyCode) {
            case 38:  // up arrow
                this.pokeId++;
                break;
            case 40:  // down arrow
                this.pokeId--;
                break;
            case 37:  // left arrow
                this.pokeId--;
                break;
            case 39:  // right arrow
                this.pokeId++;
                break;
            default:
                return;
        }

        this.fetchPoke();
    }
});

export default PokeView;