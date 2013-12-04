/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

var ActivityLog = Backbone.View.extend({
  el: "#app",
  events:{
    /*"click #improve": "log_improve",
    "click #offer_help": "log_offer_help",
    "click #edit_article": "log_edit_article"*/
  },

  initialize: function(){
    //configure javascript cookie library
    $.cookie.defaults.path = '/';
    this.load_cookie();
    sharejs.open("newspad_activity", "json", function(error, doc){
      this.data = doc; 

      // initialize site-wide activity log
      // should only ever be needed once
      // per deploy
      if(this.data.version == 0){
        this.data.set({log:[], sessions:{}});
      }

      this.log_load();

    }.bind(this));
  },

  load_cookie: function(){
    this.session = $.cookie('newspad_session'); 
    if( this.session === undefined){
      this.session = Math.uuid();
      $.cookie('newspad_session', this.session) 
    }
  },

  log_improve: function(){
    this.new_log_entry("view_improve")
  },

  log_offer_help: function(){
    this.new_log_entry("offer_help")
  },

  log_edit_article: function(){
    this.new_log_entry("edit_article")
  },

  log_load: function(){
    this.new_log_entry("load", window.location.pathname);
  },

  new_log_entry: function(action, value, doc){
    // time, doc, session, action
    if(_.isUndefined(value)){
      value = null;
    }

    // automatically include the doc name
    // if there is a current doc
    if(_.isUndefined(doc)){
      doc = null;
      if(!(typeof read_view == "undefined")){
        doc = read_view.article_id;
      }
    }

    time = new Date().getTime();
    this.data.at("log").push({time: time, doc: doc, session: this.session,
                    action: action, value: value});

    // incremend the sessions data
    session_counter = this.data.at("sessions").get();
    if(session_counter[this.session] === undefined){
      if(_.size(session_counter) == 0){
        session_counter = {};
      }
      session_counter[this.session] = {actions: 1, last: time};
    }else{
      session_counter[this.session].actions += 1;
      session_counter[this.session].last = time;
    }
    
    this.data.at("sessions").set(session_counter);
  }
});

activity_log = new ActivityLog();
