var drawPieChart = require("./charts/pieChart");
var drawColumnChart = require("./charts/columnChart");
var draw3dColumnChart = require("./charts/3d/columnChart");
var keyboard = require("./keyboard");
var isMobile = require("./mobile");

const PokeView = Backbone.View.extend({
    el: $('#pokegraphs'),
    MAX_POKE: 649,

    events: {
        'click .fa-pie-chart': 'setPieChart',
        'click .fa-bar-chart': 'setColumnChart',
        'click .fa-bar-chart.3d': 'set3dColumnChart',
        'click .fa-random': 'toggleRandom',
        'click .fa-heart': 'toggleFacebook',
        'click .fa-question': 'toggleInfo',
        'focus #pokeInput' : 'focusPokeInput',
        'blur #pokeInput' : 'blurPokeInput'
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

    toggleRandom: function(e) {
        this.pokeModel.toggleRandom();
        $(e.currentTarget).toggleClass('active');
    },

    initialize: function(opts) {
        this.pokeModel = opts.pokeModel;
        this.pokeRenderer = draw3dColumnChart;

        this.canvas = document.getElementById('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext('2d');

        this.calculateZoom();
        this.calculateCenter();
        this.calculateChartHeight();

        if (isMobile()) {
            this.handleTouchEvents();
            $('#extraInfo').html('Swipe left/right');
        } else {
            $(document).keydown(_.bind(this.onKeyDown, this));
        }
    },

    handleTouchEvents: function() {
        var that = this;
        var panning = false;
        var hammertime = new Hammer(this.canvas);

        hammertime.on('panstart', function() {
            that.hideExtraInfo();
        });

        hammertime.on('panleft', function() {
            if (! panning) {
                panning = true;
                that.animatedIncrement();
            }
        });

        hammertime.on('panright', function() {
            if (! panning) {
                panning = true;
                that.pokeModel.decrement();
            }
        });

        hammertime.on('panend', function() {
            panning = false;
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

    updatePokeData: function(opts) {
        this.pixels = opts.pixels;
        this.colors = opts.colors;
        this.lightest = opts.lightest;

        this.updatePokeName();
    },

    updatePokeName: function() {
        const name = this.pokeModel.getCurrentPoke();
        this.$el.find('#pokeInput').val(name);
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
        this.hideExtraInfo();

        e = e || window.event;

        switch(e.keyCode) {
            case(keyboard.UP):
                this.pokeModel.increment();
                break;
            case(keyboard.DOWN):
            case(keyboard.LEFT):
                this.pokeModel.decrement();
                break;
            case(keyboard.RIGHT):
                this.animatedIncrement();
                break;
        }
    },

    hideExtraInfo: function() {
        $('#extraInfo').hide('fast');
        $('.fa-question').removeClass('active');
    },

    animatedIncrement: function() {
        var $el = $('#canvas');
        $('#charts').empty();
        $el.addClass('fadeOutRight');
        $el.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', () => {
            $('#canvas').removeClass('fadeOutRight');
            this.clearCanvas();
            this.pokeModel.increment();
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
    }
});

export default PokeView;