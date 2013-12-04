/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

var ActivityView = Backbone.View.extend({
  el: "#app",
  events:{
    "click .session": "filter_by_session",
    "click .value": "filter_by_value",
    "click .doc": "filter_by_doc",
    "click .action": "filter_by_action",
    "click .reset_filters": "reset_filters"
  },

  initialize: function(){
    this.row_template = _.template($("#row_template").html());

    sharejs.open("newspad_activity", "json", function(error, doc){
      this.data = doc; 
      this.log = crossfilter(this.data.at("log").get());
      this.log_by_time = this.log.dimension(function(d){return d.time});
      this.log_by_session = this.log.dimension(function(d){return d.session});
      this.log_by_action = this.log.dimension(function(d){return d.action});
      this.log_by_value = this.log.dimension(function(d){return d.value});
      this.log_by_doc = this.log.dimension(function(d){return d.doc});
      this.current_filter = this.log_by_time;
      this.data.on("change", this.update_logs.bind(this));
      this.render();
    }.bind(this));
  },

  filter_by_session: function(e){
    this.log_by_session.filter($(e.target).html());
    this.render();
  },

  filter_by_value: function(e){
    this.log_by_value.filter($(e.target).html());
    this.render();
  },
  
  filter_by_doc: function(e){
    this.log_by_doc.filter($(e.target).html());
    this.render();
  },

  filter_by_action: function(e){
    this.log_by_action.filter($(e.target).html());
    this.render();
  },

  reset_filters: function(){
    this.log_by_time.filterAll();
    this.log_by_session.filterAll(); 
    this.log_by_value.filterAll();
    this.log_by_doc.filterAll();
        
    this.render();
  },

  render: function(){
    this.render_table();
    $(".spinner").hide();
  },

  render_table: function(){
    table = $("#report_rows tbody");
    new_table = "";
    _.each(this.current_filter.top(25), function(row){
      new_table += this.row_template(row); 
    }.bind(this));
    table.html(new_table);
  },

  update_logs: function(ops){
    _.each(ops, function(op){
      if(!(typeof op.li == "undefined")){
       this.log.add([op.li]);
      }
    }.bind(this));
    this.render();
  },
});

activity_view = new ActivityView();
