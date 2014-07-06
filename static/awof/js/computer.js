/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Computer
// Prototype: Object

(function () {
  "use strict";

  var nmsp = AWOF;

  // define array of computer controlled planes
  nmsp.computers = [];

  nmsp.Computer = function Computer(i) {
    // initialize plane object
    this.plane = new nmsp.Plane(i);

    // setup initial ai state
    this.stateFunc = nmsp.Computer.prototype.flyLevelState;
  };

  nmsp.Computer.prototype.constructor = nmsp.Computer;

  nmsp.Computer.prototype.step = function computerStep() {
    this.stateFunc();
  };

  nmsp.Computer.prototype.flyLevelState = function computerFlyLevelState() {
    var angle, angularVelocity, controls, position, speed, stallspeed, velocity;

    position = this.plane.fuselage.GetPosition();
    velocity = this.plane.fuselage.GetLinearVelocity();
    angularVelocity = this.plane.fuselage.GetAngularVelocity();
    speed = velocity.Length();
    angle = this.plane.fuselage.GetAngle();
    controls = this.plane.controls;
    stallspeed = this.plane.wing.stall_thresh;

    // stall recovery assuming we are level
    if (speed < stallspeed + 2) {
      // give full throttle
      controls.throttle = true;

      if (angle > -0.26) {
        controls.up = false;
        controls.down = angularVelocity > (angle + 0.26);
      } else if (angle < -0.52) {
        controls.up = angularVelocity < (-0.52 - angle);
        controls.down = false;
      } else {
        controls.down = false;
        controls.up = false;
      }
    } else { // level flight
      controls.throttle = speed < stallspeed * 2;

      if (angle < 0) {
        controls.up = angularVelocity < -angle;
        controls.down = false;
      } else if (angle > 0.26) {
        controls.up = false;
        controls.down = angularVelocity > (angle - 0.26);
      } else {
        controls.up = false;
        controls.down = false;
      }
    }
  };
}());
