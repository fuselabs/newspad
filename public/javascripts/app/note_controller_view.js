/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

// I'm using the Backbone View object
// to manage the notes controller
// since all note creation
// happens through the creation dialog
var NoteControllerView = Backbone.View.extend({
  el: "#request_improvement",
  events: {
    "click #tweet_note": "tweet_note",
    "click #leave_note": "leave_note"
  },
  //model passed in
  initialize: function(){
    this.notes = this.options.notes;
    this.display_note_count();
    // placeholder for passing over the
    // uuid generated elsewhere in the UI
    this.note_id = null; 

    // currently handles additions
    this.notes.on("child op", function(path, op){
      section = read_view.get_section_by_id(path[0]);
      section.notes_view.update();//this.all_notes_for(section.section_id));
      this.display_note_count();
    }.bind(this));

  },

  get_section_from_note_id: function(note_id){
    return _.find(read_view.sections, function(section){
      return _.find(this.notes.get()[section.section_id], function(note){
        return note_id == note.id;
      }.bind(this));
    }.bind(this));
  },

  get_note_from_id: function(note_id){
    return_note = null;
    _.each(read_view.sections, function(section){
      _.each(this.notes.get()[section.section_id], function(note){
        if(note_id == note.id){
          return_note = note;
        }
      }.bind(this));
    }.bind(this));
    return return_note;
  },

  new_note: function(from, message, section, state){
    // possible states: tweet, clicked, left, closed
    note = {
      id: this.note_id, // defined in Math.uuid.js
      date: new Date().toString(),
      from: from,
      message: message,
      section: section.section_id,
      state: state
    };
    /*note_doc = this.notes.at(section.section_id);
    // TODO: Fix this by correctly creating the 
    // note hash in the first place
    if(note_doc.get() === undefined){
      note_hash = this.notes.get();
      note_hash[section.section_id] = [];
      this.notes.set(note_hash);
    }*/
    this.notes.at(section.section_id).push(note);
  },

  close_note: function(section, note_id){
    section_notes = this.notes.at(section.section_id);
    var i =0;
    _.each(section_notes.get(), function(note){
      if(note.id == note_id){
        note_doc = section_notes.at(i).get();
        note_doc.state = "closed";
        section_notes.at(i).set(note_doc);
        console.log("hat");
      }
      i += 1
    }.bind(this));
    section.notes_view.update();
    this.display_note_count();
  },

  display_note_count: function(){
    open_notes = _.filter(this.all_notes(), function(note){
      if(note.state === undefined){
        return false
      }
      return note.state !="closed";
    });
    note_count = _.size(open_notes);
    label = $("#improve .label")
     
    //only display note count if there are one or more open notes
    if(note_count > 0){
      label.html(_.size(open_notes));
      label.show();
    }else{
      label.hide();
    }
  },

  all_notes: function(){
    return _.flatten( _.map(this.notes.get(), function(y){
      return y; //_.pluck(y, "id");
    }.bind(this)) );
  },

  all_notes_with: function(state){
    return _.where(this.all_notes(), {state:state});
  },

  all_notes_for: function(section_id){
    return this.notes.at(section_id).get();
  },

  leave_note: function(e){
    el = $(e.target);
    section_id = el.attr("data-section");
    section = read_view.get_section_by_id(section_id);
    name = $("#request_improvement .name").val();
    note_text = $("#note_entry").val();
    note_id  = $(e.target).attr("data-note");
    this.new_note(name, note_text, section, "left");
    section.notes_view.update();
    this.display_note_count();
    $("#request_improvement .close").trigger("click");
    //LOG ACTIVITY
    activity_log.new_log_entry("leave_note", 
        JSON.stringify({note:note_id, section: section_id, note_text:note_text, name:name}));
  },

  note_url: function(note_id){
    return window.location.protocol + "//" + window.location.host + window.location.pathname + "#note/" + note_id
  },

  tweet_note: function(e){
    baseurl  = "https://twitter.com/intent/tweet?text="
    note_id  = $(e.target).attr("data-note");
    section_id = el.attr("data-section");
    full_url = baseurl + $.trim($("#note_entry").val());
    full_url += " " + encodeURIComponent(this.note_url(note_id));
    window.open(full_url,"_blank", "height=250, width=500")
    //LOG ACTIVITY
    activity_log.new_log_entry("tweet_note", 
        JSON.stringify({note:note_id, section: section_id,
                        url: full_url}));
    this.leave_note(e);
  }
});
