/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

sharejs = require('share').server;
text = require('share').types.text;
_und = require("underscore");
//config = require("../config.js");

var sharejs_options = {
    db:{type: 'none'}
/*     db: {type: 'redis',
     prefix: 'ShareJS:',
     hostname: 'localhost',
     port: '',
     auth: ''}*/
      
}

exports.snapshot = function(req, res){

    model = sharejs.createModel(sharejs_options);

    ops = model.getVersion(req.params.id, function(error, version){
      if(req.params.version < version){ 
        v = req.params.version
      }else{
        v = version
      }
       
      model.getOps(req.params.id, 0, v, function(error, ops){
        var contents = "";
        _und.each(ops, function(op, index, list){
          contents = text.apply(contents, op.op);
        });

        res.json(contents)
      });
    });

      /*.render('read', 
               { title: req.params.id,
                 sessionID: res.sessionID,
                 article: req.params.id,
                 host: req.host});*/
}

exports.bloopers = function(req, res){
    var blooper_threshhold = 10;
    
    model = sharejs.createModel(sharejs_options);
    ops = model.getVersion(req.params.id, function(error, version){
      model.getOps(req.params.id, 0, version, function(error, ops){
        var bloopers = [];
        var contents = "";
        // for each operation, 
        _und.each(ops, function(op, index, list){
          if( (_und.size(op.op)!= 0 && !(op.op[0].i == undefined) && op.op[0].i.length > blooper_threshhold) ||
              (_und.size(op.op)!=0 && (op.op[0].d == undefined) && op.op[0].d.length > blooper_threshhold)){
            bloopers.push({v: op.v-1,
                          c: contents,
                        });
          }
          contents = text.apply(contents, op.op);
        });
        bloopers.push({v: version, c: contents});

        res.json(bloopers);
      
      });
    });
}
