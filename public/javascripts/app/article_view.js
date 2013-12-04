/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

var ArticleView = Backbone.View.extend({

  el: "#app",

  events: {
    "click .flip_image": "flip_image",
    "click .new_section": "new_section",
    "keyup #embed_width": "embed_html",
    "keyup #embed_height": "embed_html",
    "shown #export": "embed_html",
    "click .history": "show_versions"
  },

  embed_html: function(){
    embed_data = this.embed_template({width:$("#embed_width").val(), height:$("#embed_height").val(), id:this.article_id});
    $("#export_html").val(embed_data);
  } ,

  show_versions: function(e){
    var that = this;
    elem = $(e.target);
    if(elem[0].tagName=="I"){
      elem = elem.parent();
    } 

    $.getJSON("/field/" + elem.attr("data-name") + "/bloopers", function(data){
      $("#version_cards").html("");
      _.each(data, function(version){
        $("#version_cards").append(that.version_card_template(version));
      });
    });
  },

  export_html: function(){
    export_data = $("<div>");
    export_data.append($("<pre>").html($("#content").val()));
    _.each(this.data.sections, function(section_id){
      export_data.append($("<h2>").html($("#" + section_id+"_title").val()));
      export_data.append($("<div>").html($("#" + section_id+"_image_doc").val()));
      export_data.append($("<pre class='content'>").html($("#" + section_id+"_content").val()));
    });
    $("#export_html").val(export_data.html());
  },

  new_section: function(){
    sections = this.data_doc.at('sections');
    section_id = this.article_id + "_section_" + sections.getLength();
    sections.push(section_id);
  },

  display_section: function(section_id){
    if(_.size($("#" + section_id + "_title"))==0){
      $("#article_contents").append(this.section_template({id:section_id}));
      this.setup_section_textarea(section_id+"_title")
      this.setup_section_textarea(section_id+"_content")
      this.setup_section_textarea(section_id+"_image_doc", 'change', section_id+"_image");
      title = $("#" + section_id + "_title");
      title.trigger("keyup");
      content = $("#" + section_id + "_content");

    }
  },

  initialize: function () {
    this.data = null;
    this.data_doc = null;
    this.loading = true;
    this.article_id = $("#article_id").val();
    this.sharejs_id = this.article_id + "_data";
    this.section_template = _.template($("#section_template").html());
    this.version_card_template = _.template($("#version_card_template").html());
    this.embed_template = _.template($("#embed_template").html().replace("[/script]", "</script>"));
    this.setup_model();
    /*this.setup_textarea("title", 'change', "#navbar_title");
    this.setup_textarea("content");
    this.setup_textarea("image_one", 'change', "#image_one_target");*/
    this.setup_section_textarea(this.article_id + "_contributors");
  },

  setup_model: function () {
    var that = this;
    sharejs.open(this.sharejs_id, "json", function (error, doc) {
      // initialize value
      that.data_doc = doc;
      if (that.data_doc.version == 0) {
        that.data_doc.set({ id: that.article_id,
          contributors: [],
          offers: [],
          sections: [that.article_id+ "_section_0"]
        });
      }
      that.data = doc.get();

      // DATA MIGRATION
      /*if(that.data.contributors === undefined){
        that.data.contributors = [];
        that.data.offers = [];
      }*/

      /*sharejs.open(that.article_id + "_section_0_title", "text", function(error, doc){
        $("title").html(doc.snapshot);
        $("#navbar_title").html(doc.snapshot);
        doc.on("change", function(){
          $("title").html(doc.snapshot);
          $("#navbar_title").html(doc.snapshot);
        });
      });*/


      that.update_view(that.data);

      doc.on("change", function () {
        that.data = doc.get();
        that.update_view();
      });
    });
  },

  update_view: function () {
    var that = this;
    //$("#data_debug").html(JSON.stringify(this.data));
    _.each(this.data.sections, function(section_id){
      that.display_section(section_id);
    });

    // go straight to the proper anchor if needed
    /*if(that.loading == true){
      //$.scrollTo($(Backbone.history.location.hash));
      that.loading = false;
    }*/
  },



  setup_textarea: function(id, ev, target){
    sharejs_id = $("#" + id + "_doc").val()
    sharejs.open(sharejs_id, "text", function(error, doc){
      var elem = document.getElementById(id);
      doc.attach_textarea(elem, function(){$(elem).expandingTextarea()});
      doc.on('change', function(){
        $(elem).trigger('keyup');
      });
      //initialise target value
      if(!(typeof(target)==='undefined')){
        $(target).html(doc.snapshot);
      }
      //update target value
      if(!(typeof(ev)==='undefined')){
        doc.on(ev, function(){
          $(target).html(doc.snapshot);
        });
      }
    });
  },

  setup_section_textarea: function(id, ev, target){
    sharejs.open(id, "text", function(error, doc){
      var elem = document.getElementById(id);
      doc.attach_textarea(elem, function(){$(elem).expandingTextarea()});
      doc.on('change', function(){
        $(elem).trigger('keyup');
      });

      if(id.search("_section_0_title")>-1){
        $("title").html(doc.snapshot);
        $("#navbar_title").html(doc.snapshot);
        doc.on("change", function(){
          $("title").html(doc.snapshot);
          $("#navbar_title").html(doc.snapshot);
        });
      }

      if(!(typeof(target)==='undefined')){
        $("#" + target).html(doc.snapshot);
      }

      if(!(typeof(ev)==='undefined')){
        doc.on(ev, function(){
          $("#" + target).html(doc.snapshot);
        });
      }
    });

  },

  flip_image: function(e){
    var headerimage = $(e.target).parent(".headerimages");
    headerimage.find(".embed_target").toggleClass("hidden");
    headerimage.find(".embed_edit").toggleClass("hidden");
  }
});

article_view = new ArticleView();
