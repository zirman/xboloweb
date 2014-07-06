/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Controls
// Prototype: Object

(function () {
  "use strict";

  var nmsp = AWOF;

  nmsp.Controls = function Controls(i) {
    this.plane = i.plane;
    this.up = false;
    this.down = false;
    this.throttle = false;
  };

  nmsp.Controls.prototype.registerEventListeners = function () {
    var throttle, pullUp, pushDown, fire;

    throttle = document.getElementById("throttle");
    pullUp = document.getElementById("pullUp");
    pushDown = document.getElementById("pushDown");
    fire = document.getElementById("fire");

    // register touch event listeners
    throttle.addEventListener("touchstart", (function (e) {
      e.preventDefault();
      this.throttle = true;
    }.bind(this)), false);

    throttle.addEventListener("touchend", (function (e) {
      e.preventDefault();
      this.throttle = false;
    }.bind(this)), false);

    pullUp.addEventListener("touchstart", (function (e) {
      e.preventDefault();
      this.up = true;
    }.bind(this)), false);

    pullUp.addEventListener("touchend", (function (e) {
      e.preventDefault();
      this.up = false;
    }.bind(this)), false);

    pushDown.addEventListener("touchstart", (function (e) {
      e.preventDefault();
      this.down = true;
    }.bind(this)), false);

    pushDown.addEventListener("touchend", (function (e) {
      e.preventDefault();
      this.down = false;
    }.bind(this)), false);

    fire.addEventListener("touchstart", (function (e) {
      e.preventDefault();
      this.fire = true;
    }.bind(this)), false);

    fire.addEventListener("touchend", (function (e) {
      e.preventDefault();
      this.fire = false;
    }.bind(this)), false);

    // prevent default behavior for events we don't care about
    document.addEventListener("touchstart", (function (e) {
      e.preventDefault();
    }.bind(this)), false);

    document.addEventListener("touchend", (function (e) {
      e.preventDefault();
    }.bind(this)), false);

    document.onkeydown = (function (e) {
      switch (e.keyCode) {
      case 87:
        //event.preventDefault();
        this.throttle = true;
        break;

      case 40:
        //event.preventDefault();
        this.up = true;
        break;

      case 38:
        //event.preventDefault();
        this.down = true;
        break;

      case 32:
        //event.preventDefault();
        this.fire = true;
        break;

      default:
        break;
      }
    }.bind(this));

    document.onkeyup = (function (e) {
      switch (e.keyCode) {
      case 87:
        //event.preventDefault();
        this.throttle = false;
        break;

      case 40:
        //event.preventDefault();
        this.up = false;
        break;

      case 38:
        //event.preventDefault();
        this.down = false;
        break;

      case 32:
        //event.preventDefault();
        this.fire = false;
        break;

      default:
        break;
      }
    }.bind(this));
  };
}());
