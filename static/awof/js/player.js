/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Player Singleton Object

(function () {
  "use strict";

  var nmsp = AWOF;

  nmsp.player = {
    init: function (i) {
      this.plane = new nmsp.Plane(i);

      this.step = function initHelper() {
      };

      this.plane.controls.registerEventListeners();
    }
  };
}());
