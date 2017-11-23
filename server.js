module.exports = function (config, db) {
    var tokenizer = require('./botsleuth-tokenizer.js');
    var botData = require('./data/bot-list.json');
    var path = require('path');
    var express = require('express');        // call express
    var app = express();                 // define our app using express

    var bodyParser = require('body-parser');
    
    var port = process.env.PORT || config.get("server.port");        // set our port

    var routerOptions = {
        app: app,
        express: express,
        config: config,
        tokenizer: tokenizer,
        botData: botData
    }

    app.set("view engine", "pug");
    app.set("views", path.resolve("views"));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Middleware part...
    var apiRouter = require('./server/api/router.js')(routerOptions);              // get an instance of the express Router
    var webRouter = require('./server/web/router.js')(routerOptions);
    
    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', apiRouter);
    app.use('/', webRouter);
    
    
    // This is where we are gonna serve the public website...
    // TODO: Activate the server static files...
    
    // START THE SERVER
    // =============================================================================
    app.listen(port);
    
    console.log('Magic happens on port ' + port);

    return app;
};