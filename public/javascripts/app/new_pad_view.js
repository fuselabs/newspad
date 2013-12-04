/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

var NewPadView = Backbone.View.extend({
  el: "#new",
  events:{
    "click #create_pad":"create_pad",
    "keyup #topic": "update_headlines",
    "click #headlines .btn": "update_headline_text"
  },

  initialize: function(){
    this.headlines = [];
    this.headline_button = _.template($("#headline_button").html());
    _.each($(".headline"), function(headline){
      this.headlines.push(_.template(headline.innerHTML));
    }.bind(this));
  },

  pad_name: function(){
    var values = $("#topic").val().replace(/\s+/," ").split(" ");
    var stripped_values = [];
    _.each(values, function(value){
      stripped_values.push(value.replace(/\W/g,""));
    });
    return stripped_values.join("_");
  },


  // check to see if a shareJS object exists
  // with this name
  // TODO: refactor articles into more of a model system now
  // that you're using it across multiple views
  // NOTE: Integrated into create_pad
  /*pad_is_unclaimed: function(){
    sharejs.open(this.pad_name + "_data", "json", function(error, doc){
      if(doc.version == 0){
        return true;
      }else{
        return false;
      }
    });
  },*/

  // set pad title
  // TODO: you really really really really
  // ought to make this whole thing a model
  // this hack should only be used temporarily
  set_new_pad_name: function(title, callback){
    sharejs.open(this.pad_name() + "_section_0_title", "text", function(error, doc){
      doc.del(0, doc.getText().length); // data migration to erase previous title
      doc.insert(0, title, function(error, appliedOp){
        callback(); 
      }.bind(this));
    });
  },

  update_headline_text: function(e){
    v = $(e.target).html();
    $("#headline_text").val(v);
  },

  create_pad: function(){
    // first check to see if the pad exists
    // and if it doesn't, set the new pad name and create the pad
    $(".spinner").show();
    sharejs.open(this.pad_name() + "_data", "json", function(error, doc){
      if(doc.version == 0){
        this.set_new_pad_name($("#headline_text").val(), function(){
          window.location = window.location.protocol + "//" + window.location.host + "/" + 
                          this.pad_name() + "/read";
        }.bind(this));
      }else{
        alert("pad with the name '" + this.pad_name() + "' already exists. Try changing the event name ever so slightly.");
      } 
    }.bind(this));
  },

  update_headlines: function(e){
    topic = $("#topic").val();
    $("#suggestions").show();
    // initialize headlines if they don't exist
    if(_.size($("#headlines").children()) < this.headlines.length){
      _.each(this.headlines, function(headline_template){
        $("#headlines").append(this.headline_button({headline: headline_template({topic:topic})}));
      }.bind(this));
    }else{
      for(i = 0; i< this.headlines.length; i++){
        $("#headlines").find(".btn")[i].innerHTML = 
          this.headlines[i]({topic:topic});
      }
    }
  }
});

new_pad_view = new NewPadView();
