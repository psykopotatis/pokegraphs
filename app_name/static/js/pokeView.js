var PokeModel = require("./pokeModel");
var drawPieChart = require("./charts/pieChart");
var drawColumnChart = require("./charts/columnChart");
var draw3dColumnChart = require("./charts/3d/columnChart");

const PokeView = Backbone.View.extend({
    el: $('#pokegraphs'),
    MAX_POKE: 649,

    events: {
        'click #canvas': 'click',
        'click .fa-pie-chart': 'setPieChart',
        'click .fa-bar-chart': 'setColumnChart',
        'click .fa-bar-chart.3d': 'set3dColumnChart',
        'click .fa-random': 'setRandom',
        'click .fa-heart': 'toggleFacebook',
        'click .fa-question': 'toggleInfo',
        'focus #pokeInput' : 'focusPokeInput',
        'blur #pokeInput' : 'blurPokeInput'
    },

    click: function() {
        this.increment();
        this.fetchPoke();
    },

    setPieChart: function(e) {
        this.setActive(e);
        this.pokeRenderer = drawPieChart;
        this.renderChart();
    },

    setColumnChart: function(e) {
        this.setActive(e);
        this.pokeRenderer = drawColumnChart;
        this.renderChart();
    },

    set3dColumnChart: function(e) {
        this.setActive(e);
        this.pokeRenderer = draw3dColumnChart;
        this.renderChart();
    },

    toggleFacebook: function(e) {
        $(e.currentTarget).toggleClass('active');
        $('#facebook').slideToggle('fast');
    },

    toggleInfo: function(e) {
        $(e.currentTarget).toggleClass('active');
        $('#extraInfo').slideToggle('fast');
    },

    focusPokeInput: function() {
        $(document).unbind();
    },

    blurPokeInput: function() {
        $(document).keydown(_.bind(this.onKeyDown, this));
    },

    setActive: function(e) {
        $('.chart').removeClass('active');
        $(e.currentTarget).addClass('active');
    },

    setRandom: function(e) {
        if (this.random) {
            this.increment = this.plusplus;
            this.decrement = this.minusminus;
        } else {
            this.increment = this.randomPoke;
            this.decrement = this.randomPoke;
        }

        $(e.currentTarget).toggleClass('active');
        this.random = !this.random;
    },

    initialize: function() {
        $(document).keydown(_.bind(this.onKeyDown, this));

        this.pokeRenderer = draw3dColumnChart;
        this.increment = this.plusplus;
        this.decrement = this.minusminus;
        this.random = false;

        this.canvas = document.getElementById('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext('2d');

        this.calculateZoom();
        this.calculateCenter();
        this.calculateChartHeight();

        this.randomPoke();
        this.createPokeModel();
        this.fetchPoke();

        this.initAutocomplete();
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

    createPokeModel: function() {
        this.pokeModel = new PokeModel();
    },

    updatePokeModel: function() {
        this.pokeModel.set('id',this.pokeId + '.json' );
    },

    updatePokeName: function() {
        const name = this.pokeModel.getName(this.pokeId);
        this.$el.find('#pokeInput').val(name);
    },

    initAutocomplete: function() {
        $("#pokeInput").autocomplete({
            minLength: 2,
            source: this.pokeModel.getNames(),
            select: (event, ui) => {
                this.pokeId = _.indexOf(this.pokeModel.getNames(), ui.item.value);
                this.fetchPoke();

                $('#pokeInput').blur();
                return false;
            }
        });
    },

    fetchPoke: function() {
        this.updatePokeModel();
        this.updatePokeName();

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

    render: function() {
        this.clearCanvas();
        this.renderBackground();
        this.renderChart();
        this.renderPokemon();
    },

    clearCanvas: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    renderBackground() {
        this.$el.css('background', 'linear-gradient('+ this.lightest + ', #fff)');
    },

    renderChart: function() {
        this.pokeRenderer(this.colors);
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

    plusplus: function() {
        this.pokeId++;
        if (this.pokeId > this.MAX_POKE) {
            this.pokeId = 1;
        }
    },

    minusminus: function() {
        this.pokeId--;
        if (this.pokeId == 0) {
            this.pokeId = this.MAX_POKE;
        }

    },

    randomPoke: function() {
        this.pokeId = Math.round(Math.random() * this.MAX_POKE);
    },

    onKeyDown: function(e) {
        $('#extraInfo').hide('fast');
        $('.fa-question').removeClass('active');

        e = e || window.event;

        if (e.keyCode == 38) {
            // up
            this.increment();
            this.fetchPoke();
        } else if (e.keyCode == 40) {
            // down
            this.decrement();
            this.fetchPoke();
        } else if (e.keyCode == 37) {
            // left
            this.decrement();
            this.fetchPoke();
        } else if (e.keyCode == 39) {
            // right
            var $el = $('#canvas');
            $('#charts').empty();
            $el.addClass('fadeOutRight');
            $el.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', () => {
                $('#canvas').removeClass('fadeOutRight');
                this.clearCanvas();
                this.increment();
                this.fetchPoke();
            });
        }
    }
});

export default PokeView;