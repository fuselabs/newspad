/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , read = require('./routes/read')
  , signup = require('./routes/signup')
  , logo = require('./routes/logo')
  , seattle = require('./routes/seattle')
  , report = require('./routes/report')
  , embed = require('./routes/embed')
  , data = require('./routes/data')
  , http = require('http')
  , path = require('path')
  , redis = require('redis')
  , connect = require('./node_modules/express/node_modules/connect')
  , sharejs = require('share').server;
//  , config = require('./config.js');

var app = express();
//db.auth("") //TODO: SET UP AUTHENTICATION AFTER SUCCESSFUL CONNECT

var sharejs_options = {
  db:{type: 'none'}
   /* db: {type: 'redis',
	 prefix: 'ShareJS:',
	 hostname: 'localhost',
	 port: '',
	 auth: ''}*/

}

sharejs.attach(app, sharejs_options);

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    // TODO: ADD A SECRET TO THE SESSIOn
    app.use(express.session({ secret: 'the cat is awesome' }));
    /*app.use(function (req, res, next) {
        db.zadd('online', Date.now(), req.sessionID, next);
    });*/

    //items beneath here may not be loaded
    app.use(app.router);
    app.use("/js/b/", express.static(path.join(__dirname, './node_modules/share/node_modules/browserchannel/dist')));
    app.use("/js/s/", express.static(path.join(__dirname, './node_modules/share/webclient')));
    app.use("/", express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', signup.view);
app.get('/logo', logo.view);
app.get('/create', routes.index);
app.get('/seattle', seattle.view);
app.get('/embed', embed.view);
app.get('/report', report.view);
app.get('/report/all', report.all);
app.get('/:id/read', read.view);
app.get('/field/:id/snapshot/:version', data.snapshot);
app.get('/field/:id/bloopers', data.bloopers);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
