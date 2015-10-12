var indexTemplate = require("text!./templates/index.html");
var PokeModel = require("./pokeModel");

const PokeView = Backbone.View.extend({
    el: $('#backbone'),

    events: {
        'click .btn': 'click'
    },

    initialize: function() {
        var canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.context = canvas.getContext('2d');

        var that = this;

        this.pokeModel = new PokeModel({ id: '85.json' });
        this.pokeModel.fetch({
            success: function(model) {
                console.log('success');

                that.pixels = model.get('pixels');

                that.render();
            },
            error: function(model, response, options) {
                console.log('error', response);

            }
        });
    },

    render: function() {
        var compiledTemplate = _.template(indexTemplate);
        this.$el.html(compiledTemplate);

        // this.drawColorBlocks();
        this.drawPokemon();
    },

    drawColorBlocks: function() {
        var that = this;

        _.each(this.colors, function(color) {
            that.$el.append('<div class="color-block" style="background-color:' + color + '" />');
        });

        this.setColorBlockHeights();
    },

    setColorBlockHeights: function() {
        this.$el.css('height', window.innerHeight + 'px');
        const blockHeight = (window.innerHeight / this.colors.length) / window.innerHeight * 100;
        this.$el.find('.color-block').css('height', blockHeight + '%');
    },

    drawPokemon: function() {
        for (let x=0; x < 96; x++) {
            for (let y=0; y < 96; y++) {
                const color = this.pixels[x][y];
                if (color !== 0) {
                    this.drawPixel(x*10, y*10, color);
                }
            }
        }
    },

    drawPixel: function(x, y, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, 10, 10);
    },

    click: function() {
        console.log('click');
    }
});

export default PokeView;