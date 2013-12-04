/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

// TODO subclass ActivityView and LogoView form some shared reporting 
// data access class
LogoView = Backbone.View.extend({
  el: "#logo",
  events:{

  },

  initialize: function(){

    // initialize canvas object
    this.canvas = this.el.getContext("2d");
    this.width  = this.$el.innerWidth();
    this.height = this.$el.innerHeight();

    this.linterval = 25;
    this.lwidth = 250;
    this.lheight = 250;
    this.lbcolor = "#333";
    this.lfcolor = "#555";
    this.lleft = this.width / 2.0 - this.lwidth / 2.0;
    this.ltop = this.height / 2.0 - this.lheight / 2.0;
    this.max_dots = 20;
    this.colors = ["#ff6", "#f66", "#66f", "#6ff", "#F6F",
              "#09F", "#9f0", "#F90", "#f09", "#90f"]

    this.logotype = $("#logotype");
    this.logotype.css("bottom", "50px");
    this.logotype.css("left", "445px");

    // TODO: create a list of 20 or so dots, and every time a new event happens
    // pop the last one off the queue, put a new one in its place,
    // and re-render the view
    this.dots = [];

    sharejs.open("newspad_activity", "json", function(error, doc){
      doc.on("change", this.update_dots.bind(this));
    }.bind(this));
    sharejs.open("chicken_chicken_chicken_section_0_content", "text", function(error, doc){
      doc.on("change", this.update_dots.bind(this));
    }.bind(this));
    this.render();
  },

  clear: function(){
    this.canvas.fillStyle = "#fff";
    this.canvas.fillRect(0,0, this.width, this.height);
  },

  update_dots:function(){
    // draw a dot at each interseciton
    var dotwidth = 4;

    this.dots.push(this.generate_new_dot());
    if(_.size(this.dots) > this.max_dots){
      this.dots.shift(); 
    }

    this.render();
  },

  generate_new_dot: function(){
    var iterations = this.lwidth / this.linterval;
    var gridx = (Math.random()*10).toFixed();
    var gridy = (Math.random()*10).toFixed();
    while(gridx >= iterations || gridy == 0){
      gridx = (Math.random()*10).toFixed();
      gridy = (Math.random()*10).toFixed();
    }
    coords = this.getGridLocation(gridx,gridy);
    coords.color = this.colors[(Math.random()*10).toFixed()];
    return coords;
  },

  render: function(){
    this.clear();

    // render the background box
    this.canvas.fillStyle = "#333";
    this.canvas.fillRect(this.lleft,this.ltop, 
                         this.lwidth, this.lheight);

    // render the lines
    var iterations = this.lwidth / this.linterval;
    this.canvas.strokeStyle = this.lfcolor;
    this.canvas.lineWidth=0.5;
    for(i=0; i < iterations; i++){
      this.canvas.beginPath();
      this.canvas.moveTo( this.lleft + (i * this.linterval) , this.ltop);
      this.canvas.lineTo( this.lleft + (i * this.linterval) + this.linterval, this.ltop + this.lheight);
      this.canvas.stroke();
      this.canvas.closePath();
    }
    for(i = 1; i<= iterations; i++){
      this.canvas.beginPath();
      this.canvas.moveTo( this.lleft,  this.ltop + (i * this.linterval));
      this.canvas.lineTo( this.lleft + this.lwidth, this.ltop + (i * this.linterval) - this.linterval);
      this.canvas.stroke();
      this.canvas.closePath();
    }

    // draw a dot at each interseciton
    var dotwidth = 4;

    _.each(this.dots, function(dot){
      this.canvas.fillStyle=dot.color;
      this.canvas.beginPath();
      this.canvas.arc(dot.x - dotwidth / 2, dot.y - dotwidth / 2,
                      dotwidth, 0, Math.PI*2, true); 
      this.canvas.closePath();
      this.canvas.fill();
      /*this.canvas.fillRect(dot.x - dotwidth / 2, dot.y - dotwidth / 2,
                                     dotwidth, dotwidth);*/
    }.bind(this));
  },

  getGridLocation: function(gridx, gridy){
    this.vslope = 1 /  (this.lheight / this.linterval);
    this.hslope = 1 /  (this.lwidth / this.linterval);

    var x = this.lleft + (gridx * this.linterval) + (gridy * this.linterval * this.hslope);
    var y = this.ltop  + (gridy * this.linterval) - (gridx * this.linterval * this.vslope);
    return {x:x, y:y}
  }
});

logo_view = new LogoView();
