/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

var NotesView = Backbone.View.extend({
  template: _.template($("#notes_view_template").html()),
  events:{
    "click .request": "request_improvements"
  },

  initialize: function(options){
    this.options = options || {};
    this.note_view_container_template = _.template($("#note_view_container_template").html());
    this.note_entry_template = _.template($("#note_entry_template").html())
    this.section = this.options.section;
    this.notes = [];
    this.visible = false;
    this.$el.html(this.template({section_id: this.section.section_id}));
    this.update();
  },

  find_note_by_id: function(id){
    return _.find(this.notes, function(note_view){
      return note_view.note.id == id;
    });
  },

  show: function(){
    this.visible = true;
    this.$el.show()
  },

  hide: function(){
    this.visible = false;
    this.$el.hide();
  },

  update: function(){
    all_notes = read_view.note_controller_view.all_notes_for(this.section.section_id);

    _.each(all_notes, function(note){
      note_el = this.$el.find("#" + note.id)

      // if this note is closed, hide it
      if(note.state=="closed" && note_el.length > 0){
        this.find_note_by_id(note.id).hide();
      }
      
      // if the note does not exist, create it
      if(note.id != undefined && note_el.length == 0){
        el = $(this.note_view_container_template({id:note.id}));
        this.$el.find(".notes").append(el);
        this.notes.push(new NoteView({note:note, notes_view:this, el: el}));
        if(note.state=="closed"){
          this.notes[this.notes.length-1].hide();
        }
      }
    }.bind(this));
  },

  request_improvements: function(e){
     el = $(e.target);
     note_id = Math.uuidFast();
     read_view.note_controller_view.note_id = note_id;
     //todo: dry this up
     url = window.location.protocol + "//" + window.location.host + window.location.pathname + "#note/" + note_id;
     // pass on section information via the buttons
     $("#tweet_note").attr("data-section", el.attr("data-section"));
     $("#leave_note").attr("data-section", el.attr("data-section"));
     $("#tweet_note").attr("data-note", note_id);
     $("#leave_note").attr("data-note", note_id);
     $("#note_entry").val(this.note_entry_template({url:""}));
     //$("#request_improvement .url").val(url);
     $("#request_improvement .volunteers").html(read_view.help_offers_view.model.snapshot);

     // LOG ACTIVITY
     activity_log.new_log_entry("view_improved", this.section.section_id);
  }, 
});

var NoteView = Backbone.View.extend({
  template: _.template($("#note_view_template").html()),
  events:{
    "click .close" : "close_note_event"
  },

  initialize: function(options){
    this.options = options || {};
    this.notes_view = this.options.notes_view;
    this.note = this.options.note;
    this.note.url = read_view.note_controller_view.note_url(this.note.id);
    this.$el.html(this.template(this.note));
   },

   close_note_event: function(e){
    el = $(e.target);
    note_id = this.note.id;
    section = this.notes_view.section;
    read_view.note_controller_view.close_note(section, note_id);
    // LOG ACTIVITY
    activity_log.new_log_entry("close_note", 
      JSON.stringify({note: note_id, section:section.section_id}));
   },

   hide: function(){
     this.$el.hide();
   }
});

var SectionView = Backbone.View.extend({
  template: _.template($("#section_template").html()),
  events:{
  },

  view_init_vals: function(section_id, type){
    return {section: this, 
            doc_name:section_id+"_" + type, 
            el:"#" + section_id + "_" + type, 
            readonly: this.readonly};
  },

  initialize: function(options){
    this.options = options || {};
    this.section_id = this.options.section_id;
    this.readonly = this.options.readonly;

    $("#article_contents").append(this.template({id:this.section_id}));

    this.content = new ContentView(this.view_init_vals(this.section_id, "content"));
    this.title = new TitleView(this.view_init_vals(this.section_id, "title"));
    this.media = new MediaView(this.view_init_vals(this.section_id, "image_doc"));
    this.render();
  },

  render: function(){
  },

  toggle_edit:function(){
    this.content.toggle_edit();
    this.title.toggle_edit();
    this.media.toggle_edit();
  }

});

var ContentView = Backbone.View.extend({
  template: _.template($("#content_template").html()),
  events: {
  },
  
  initialize: function(options){
    if(_.isUndefined(this.options)){
      this.options = options || {};
    }
    this.doc_name = this.options.doc_name;
    this.section = this.options.section;
    //set to the opposite,
    //so we can toggle into the state we want
    this.readonly = this.options.readonly; 
    sharejs.open(this.doc_name, "text", function(error, doc){
      this.model = doc;
      this.render();
      this.update();
      if(!this.readonly){
        this.show_edit();
      }
      this.model.on("change", this.update.bind(this));
    }.bind(this));

  },

  render: function(){
    this.$el.html(this.template({name:this.doc_name}));
  },

  update: function(){
    this.$el.find(".section_content").html(this.model.snapshot);
    this.$el.find("textarea").trigger("change");
  },

  toggle_edit: function(){

    if(this.readonly){
      this.show_edit();
    }else{
      this.hide_edit();
    }
  },

  show_edit: function(){
    textarea = this.$el.find("textarea");
    edit_view = this.$el.find(".edit_view");
    content = this.$el.find(".section_content");

    this.$el.find(".expandingText").show();
    this.model.attach_textarea(textarea.get(0));

    content.hide();
    edit_view.show();
    this.readonly = false;

    textarea.expandingTextarea();
  },

  hide_edit: function(){
    textarea = this.$el.find("textarea");
    edit_view = this.$el.find(".edit_view");
    content = this.$el.find(".section_content");

    this.$el.find(".expandingText").hide();
    textarea.get(0).detach_share();
    edit_view.hide();
    content.show();
    textarea.val("");
    this.readonly = true;
  }


});

var MediaView = ContentView.extend({
  template: _.template($("#media_template").html()),

  events:{
    "click .view_media": "view_media",
    "click .edit_media": "edit_media"
  },

  initialize: function(options){
    this.options = options || {};
    MediaView.__super__.initialize.apply(this);
    this.media_filler_template = _.template($("#media_filler_template").html());
  },

  toggle_edit: function(){
     MediaView.__super__.toggle_edit.apply(this);
     this.view_media();
   },

  render: function(){
    MediaView.__super__.render.apply(this);
    this.section.notes_view = new NotesView({el:this.$el.find(".note_area"), section:this.section});
  },

  view_media: function(e){
    if(!(e === undefined)){
       e.stopImmediatePropagation();
    }

    this.$el.find(".view_media").addClass("active");
    this.$el.find(".edit_media").removeClass("active");

    textarea = this.$el.find("textarea").hide();
    expander = this.$el.find(".expandingText").hide();
    content = this.$el.find(".section_content").show();

  },

  update: function(){
    MediaView.__super__.update.apply(this);
    content = this.$el.find(".section_content");
    if(content.html().replace(/^\s+|\s+$/g, '').length == 0){
      content.html(this.media_filler_template());
    }
    this.$el.find("textarea").trigger("change");
  },

  edit_media: function(e){
    e.stopImmediatePropagation();

    this.$el.find(".view_media").removeClass("active");
    this.$el.find(".edit_media").addClass("active");

    textarea = this.$el.find("textarea").show();
    expander = this.$el.find(".expandingText").show();
    content = this.$el.find(".section_content").hide();
  }

});

var TitleView = ContentView.extend({
  template: _.template($("#title_template").html()),
  render: function(){
    this.$el.html(this.template());

    //TODO: is there a less hack-ey way to do this? I hope so
    if(this.doc_name.search("_section_0_title") > -1){
      $("title").html(this.model.snapshot);
      $("#navbar_title").html(this.model.snapshot);
    }
  },
  update: function(){
    this.$el.find(".section_content").html(this.model.snapshot);

    //TODO: is there a less hack-ey way to do this? I hope so
    if(this.doc_name.search("_section_0_title") > -1){
      $("#navbar_title").html(this.model.snapshot);
    }
    this.$el.find("textarea").trigger("change");
  }
});

var ContributorView = ContentView.extend({
  template: _.template($("#contributor_template").html()),
  flash: function(){
    //this.$el.fadeIn(100).fadeOut(100).fadeIn(100);
    if(this.readonly){
      $("#help_offers").tooltip("hide");
    }else{
      $("#help_offers").tooltip("show");
    }
  }
  /*update: function(){
    ContributorView.__super__.update.apply(this);
  }*/

});


// ReadView is the core view for NewsPad
var ReadView = Backbone.View.extend({

  el: "#app",

  events: {
    "click .show_versions":"show_versions",
    "click .show_media":"show_media",
    "click #fetch_media":"fetch_media",
    "click #insert_media":"insert_media",
    "click #answer": "answer_request",
    "click #new_section":"new_section",
    "keyup #embed_width": "embed_html",
    "keyup #embed_height": "embed_html",
    "shown #export": "embed_html",
    "click .media_filler": "click_to_edit"

  },

  initialize: function () {
    var that = this;
    this.data = null;
    this.data_doc = null;
    this.note_controller_view = null;
    this.readonly = true;
    this.notes_visible = false;
    this.sections = [];
    this.article_id = $("#article_id").val();
    this.sharejs_id = this.article_id + "_data";
    this.linked_note = null;

    this.version_card_template = _.template($("#version_card_template").html());
    this.section_template = _.template($("#section_template").html());
    this.embed_template = _.template($("#embed_template").html().replace("[/script]", "</script>"));
    this.improvement_note_template = _.template($("#improvement_note_template").html());


    this.setup_model();

    this.contributor_view = new ContributorView({doc_name:this.article_id + "_contributors", el:"#contributors", readonly:true});
    this.help_offers_view = new ContributorView({doc_name:this.article_id + "_help_offers", el: "#help_offers", readonly:true});
  },


  // MODEL RELATED METHODS
  get_section_by_id: function(section_id){
    val = null;
    _.each(this.sections, function(section){
      if(section.section_id == section_id){
        val = section;
      }
    });
    return val;
  },

  setup_model: function () {
    sharejs.open(this.sharejs_id, "json", function (error, doc) {
      // initialize value
      this.data_doc = doc;

      // INITIALISE MODEL IF IT DOESN'T EXIST
      if (this.data_doc.version == 0) {
        section_id = this.article_id + "_section_" + 0;
        this.data_doc.set({ id: this.article_id,
          sections: [section_id],
          notes: {}
        });
      }
      // DATA MIGRATION
      // INITIALISE NOTES IF THEY DON'T EXIST
      if(this.data_doc.get().notes === undefined || _.size(this.data_doc.get().notes) == 0){
        var notes = {};
        d = this.data_doc.get();
        _.each(d.sections, function(section_id){
          notes[section_id] = [];
        });

        d.notes = notes;
        this.data_doc.set(d);
      }
      // END DATA MIGRATION

      this.data = this.data_doc.get();
      this.note_controller_view = new NoteControllerView({notes: this.data_doc.at("notes")});

      this.update_view();

      this.data_doc.on("change", function () {
        this.data = this.data_doc.get();
        this.update_view();
      }.bind(this));
    }.bind(this));
  },

  // create new section
  // with this feature, 
  // the old editor is officially broken
  new_section: function(){
    sections = this.data_doc.at('sections');
    notes = this.data_doc.at('notes').get();
    section_id = this.article_id + "_section_" + sections.getLength().toString();
    sections.push(section_id);
    notes[section_id] = [];
    this.data_doc.at('notes').set(notes);
    activity_log.new_log_entry("add_section", section_id)
  },

  is_final_section: function(section){
    if(this.sections[this.data.sections.length-1].section_id == section.section_id){
      return true; 
    }
    return false;
  },

  // VIEW METHODS

  answer_request: function(){
    section = this.note_controller_view.get_section_from_note_id(this.linked_note.id);
    if(!section.notes_view.visible){
      toolbar_view.toggle_notes();
    }
    if(this.readonly){
      toolbar_view.edit_article();
    }
    note_el = $("#" + this.linked_note.id);
    note_el.addClass("highlighted");
    $.scrollTo(note_el.offset().top-300);
  },
  embed_html: function(){
     embed_data = this.embed_template({width:$("#embed_width").val(), height:$("#embed_height").val(), id:this.article_id});
     $("#export_html").val(embed_data);
  },

  toggle_notes: function(){
    if(!this.notes_visible){
      this.show_notes();
      this.notes_visible = true;
      activity_log.new_log_entry("show_notes", this.article_id)
    }else{
      this.hide_notes();
      this.notes_visible = false;
      activity_log.new_log_entry("hide_notes", this.article_id)
    }
  },

  show_notes: function(){
    _.each(this.sections, function(section){
      section.notes_view.show();
    });
  },

  hide_notes: function(){
    _.each(this.sections, function(section){
      section.notes_view.hide();
    });

  },

  click_to_edit: function(){
    if(this.readonly == true){
      toolbar_view.edit_article();
    }
  },

  toggle_edit: function(){
    this.$el.find(".expandingText")

    if(this.readonly == true){
      this.readonly = false;
      activity_log.new_log_entry("show_edit", this.article_id)
    }else{
      this.readonly = true;
      activity_log.new_log_entry("hide_edit", this.article_id)
    }

    _.each(this.sections, function(section){
      section.toggle_edit();
    }.bind(this));
    this.contributor_view.toggle_edit();
    $(".editor").toggle();
  },

  // iterates through all sections and tries to display section
  // (eg create elements, etc) for all sections
  update_view: function () {
    _.each(this.data.sections, function(section_id){
      this.display_section(section_id);
    }.bind(this));
  },

  // creates a new section object if it doesn't yet exist
  display_section: function(section_id, callback){
   if( _.size($("#" + section_id + "_title"))==0){
      this.sections.push(new SectionView({section_id: section_id, el: "#article_contents", 
                                          readonly: this.readonly}));
    }
  },

  insert_media: function(e){
    /*textarea = $("#" + this.media_doc + " textarea");
    textarea.text($("#embed .contents").html());
    textarea.trigger('keyup');*/
    conn = sharejs.open(this.media_doc, "text", function(error, doc){
      doc.del(0, doc.getText().length, function(error, appliedOp){
        doc.insert(0, $("#embed .contents").html());
        activity_log.new_log_entry("insert_media", this.media_doc);
      }.bind(this));
    }.bind(this));

  },

  fetch_media: function(e){
    $("#embed_spinner").show();
    $("#embed .contents").html($('<a>',{
        text: '',
        href: $("#embed input").val()
    }));

    $.embedly.defaults.key = "";
    $("#embed .contents a").embedly({query:{maxwidth:"500"},
       progress: function(){$("#embed_spinner").hide()}
    });
  },

  show_media: function(e){
    elem = $(e.target)
    // Fetch the current state of the 
    // TODO this is more of a hack than I prefer, but it works
    this.media_doc = elem.attr("data-name");
    section_content = $("#" + this.media_doc + " .section_content");
    $("#embed .contents").html(section_content.html());
  },

  show_versions: function(e){
    elem = $(e.target);
    if(elem[0].tagName=="I"){
      elem = elem.parent();
    }

    $.getJSON("/field/" + elem.attr("data-name") + "/bloopers", function(data){
      $("#version_cards").html("");
      _.each(data, function(version){
        $("#version_cards").append(this.version_card_template(version));
      }.bind(this));
    }.bind(this));
  },

  show_improvement_dialogue: function(note_id){
    $('#improvethis').modal('toggle');
    this.display_improvement_dialogue(note_id);
  },
  
  display_improvement_dialogue: function(note_id){
    var id = note_id;
    console.log("trying again");
    if(this.note_controller_view != undefined || this.note_controller_view != null){
      $(".spinner").hide()
      note = this.note_controller_view.get_note_from_id(note_id);
      if(note != undefined){
        this.linked_note = note;
        $("#improvethis .modal-body").html(this.improvement_note_template(note));
      }else{
        $("#improvethis .modal-body").html("request not found. Click <em>ignore</em> to continue.")
      }

      activity_log.new_log_entry("request_followed", note_id)
    }else{
      window.setTimeout(function(){this.display_improvement_dialogue(id)}.bind(this), 750);
    }
  }

});

read_view = new ReadView();
