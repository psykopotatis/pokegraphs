var indexTemplate = require("text!./templates/index.html");
var PokeModel = require("./pokeModel");

const PokeView = Backbone.View.extend({
    el: $('#pokegraphs'),

    events: {
        'click .btn': 'click'
    },

    initialize: function() {
        var canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.context = canvas.getContext('2d');

        this.calculateZoom();
        this.calculateCenter();
        this.calculateChartHeight();

        const randomPokeId = Math.round(Math.random() * 649);
        this.pokeModel = new PokeModel({ id: randomPokeId + '.json' });
        const name = this.pokeModel.getName(randomPokeId);
        this.$el.find('#info').html(randomPokeId + '.' + name);


        this.pokeModel.fetch({
            success: (model) => {
                console.log('fetched pokeId:' + randomPokeId, model.toJSON());

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
        console.log('zoom=', this.zoom);
    },

    calculateCenter: function() {
        this.x = (window.innerWidth - (this.zoom * 96)) / 2;
        this.y = (window.innerHeight - (this.zoom * 96)) / 2;
    },

    calculateChartHeight: function() {
        $('#charts').css('height', window.innerHeight);
    },

    render: function() {
        this.renderBackground();
        this.drawCharts();
        // this.renderColorBlocks();
        this.renderPokemon();
    },

    renderBackground() {
        this.$el.css('background-color', this.lightest);
    },

    renderTemplate() {
        var compiledTemplate = _.template(indexTemplate);
        this.$el.html(compiledTemplate);
    },


    drawCharts: function() {
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

    click: function() {
        console.log('click');
    }
});

export default PokeView;