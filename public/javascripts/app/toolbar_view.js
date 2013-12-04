/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

var ToolbarView = Backbone.View.extend({
  el: "#edit_toolbar",
  events:{
    "click #edit_article":"edit_article",
    "click #offer_help":"offer_help",
    "click #improve": "toggle_notes"
  },

  initialize: function(){
  },

  offer_help: function(){
    this.$el.find("#offer_help").parent().toggleClass("active");

    if(read_view.help_offers_view.readonly){
      activity_log.new_log_entry("edit_help_offers", read_view.article_id);
    }else{
      activity_log.new_log_entry("readonly_help_offers", read_view.article_id);
    }

    read_view.help_offers_view.toggle_edit();
    read_view.help_offers_view.flash();
  },

  edit_article: function(){
    this.$el.find("#edit_article").parent().toggleClass("active");
    read_view.toggle_edit();
  },

  toggle_notes: function(){
    this.$el.find("#improve").parent().toggleClass("active");
    read_view.toggle_notes();
  }
});

toolbar_view = new ToolbarView();
