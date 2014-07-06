/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// create our namespace
var AWOF = {};

(function () {
  "use strict";

  var nmsp, assets, scripts;

  nmsp = AWOF;

  assets = [
    // art assets
    "img!img/grass.png",
    "img!img/sopwith-pup.png",
    "img!img/sopwith-pup-wheel.png",

    // level assets in json format
    "data/levels.js",
    "data/planes.js"
  ];

  scripts = [
    // libraries
    "js/libs/jquery-1.7.2.min.js",
    "js/libs/box2dweb-2.1.a.3.js",

    // script files
    "js/awof.js",
    "js/bullet.js",
    "js/camera.js",
    "js/computer.js",
    "js/controls.js",
    "js/debug.js",
    "js/emitter.js",
    "js/level.js",
    "js/particle.js",
    "js/plane.js",
    "js/player.js",
    "js/power.js",
    "js/turret.js",
    "js/wing.js"
  ];

  // contains all our images keyed by name
  nmsp.images = {};

  yepnope.addPrefix("img", function (resource) {
    resource.noexec = true;

    resource.instead = function (input, callback) {
      var image = new Image();
      var src = input.substr(input.lastIndexOf("!") + 1);
      var name = input.slice(input.lastIndexOf("/") + 1,
        input.lastIndexOf("."));
      image.onload = function () {
        nmsp.images[name] = image;
        callback();
      };

      image.onerror = function () {  // don't really need this but whatever
        callback();
      };

      image.src = src;
    };

    return resource;
  });

  // load art assets
  Modernizr.load({
    load: assets
  });

  // load scripts
  Modernizr.load({
    load: scripts,
    complete: function () {
      AWOF.init();
    }
  });
}());
