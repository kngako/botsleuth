/**
 * This router handles things related to the web browser experience...
 */
module.exports = function (options) {
    var path = require('path');

    var tokenizer = options.tokenizer;
    var botData = options.botData;
    var express = options.express;
    var email = options.email;

    var router = express.Router();

    var routes = {
        "/": true,
        "/about/": true,
        "/results/": true
    };

    router.route('/')
        .get(function(request, response, next) {
            response.render("home", {
                // user: req.user
            });
        });

    router.route('/about')
        .get(function(request, response, next) {
            response.render("about", {
                // user: req.user
            });
        });

    router.route('/search')
        .get(function(request, response, next) {
            response.render("search", {
                // user: req.user
            });
        })
        .post(function(request, response, next) {
            console.log("Body: ", request.body);
            var possibleBot = tokenizer.findBot(request.body.query, botData)
            response.render("search", {
                result: possibleBot,
                query: request.body.query
            });
        });
        // TODO: Implement the post...

    // TODO: Implement a suggestions route that returns a json of bots with matching names so that we can create a dropdown thingy...
    router.route('/missing')
        .get(function(request, response, next) {
            response.render("missing", {
                // user: req.user
            });
        });
    
    // Last thing that should be done is serve static files... public first
    router.use(express.static('static'));
    
    router.use(function (request, response, next) {
        response.status(404).redirect("/missing");
    });

    return router;
};