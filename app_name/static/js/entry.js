var PokeModel = require("./pokeModel");
var PokeView = require('./pokeView');

$(document).ready(function() {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '':        'defaultRoute',
            '*poke':   'pokeRoute'
        }
    });

    var appRouter = new AppRouter;
    var pokeModel = new PokeModel();
    var view = new PokeView({
        pokeModel: pokeModel
    });

    pokeModel.on('change:pokeId', function() {
        var currentPoke = this.getCurrentPoke();
        appRouter.navigate(currentPoke, {trigger: true});
    });

    $("#pokeInput").autocomplete({
        minLength: 2,
        source: pokeModel.getNames(),
        select: (event, ui) => {
            appRouter.navigate(ui.item.value, {trigger: true});
            $('#pokeInput').blur();
            return false;
        }
    });

    appRouter.on('route:defaultRoute', function() {
        var randomPoke = pokeModel.getRandomPoke();
        appRouter.navigate(randomPoke, {trigger: true});
    });

    appRouter.on('route:pokeRoute', function(pokemon) {
        pokeModel.setPokemon(pokemon);

        pokeModel.fetch({
            success: (model) => {
                view.updatePokeData({
                    pixels: model.get('pixels'),
                    colors: model.get('colors'),
                    lightest: model.get('lightest')
                });

                view.render();
            },
            error: (model, response) => {
                console.log('error', model, response);
            }
        });

    });

    Backbone.history.start();
});
