/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

/*
 * GET home page.
 */

sharejs = require('share').server;
json = require('share').types.json;
_und = require("underscore");
//config = require("../config.js");

var sharejs_options = {
     db: {type: 'redis',
          prefix: 'ShareJS:',
          hostname: '',
          port: '',
          auth: ''}
      
}

exports.view = function (req, res) {
    res.render('report', { title: 'NewsPad Activity Report'});
};

exports.all = function(req, res){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  model = sharejs.createModel(sharejs_options);
  model.getSnapshot("newspad_activity", function(err, doc){
    res.write(JSON.stringify(doc.snapshot));
    res.end();
  });
};
