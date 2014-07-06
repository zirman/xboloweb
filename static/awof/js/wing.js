/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Wing
// Prototype: Object

(function () {
  "use strict";

  var nmsp = AWOF;

  nmsp.Wing = function Wing(i) {
    this.plane = i.plane;

    // location relative to fusalage where the wing is fixed and forces are applied
    this.lof = i.lof;

    // tangent to the wings surface (unit vector)
    this.tan = i.tan;
    this.tan.Normalize();

    // simplified lift coefficient (generally proportional with the area of the surface
    this.c = i.c;

    // lift coefficient used when below stall threshold (about half of normal lift coeff)
    this.s = i.s;

    // velocity when stall coefficient is used
    this.stall_thresh = i.stall_thresh;

    // damage level
    this.damage = 0;
  };

  nmsp.Wing.prototype.constructor = nmsp.Wing;

  nmsp.Wing.prototype.getForce = function wingGetForce() {
    return new nmsp.b2Vec2(0, 0);
  };
}());
