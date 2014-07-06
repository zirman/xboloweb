/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Turret
// Prototype: Object

(function () {
  "use strict";

  var nmsp = AWOF;

  nmsp.Turret = function Turret(i) {
    this.plane = i.plane;
    this.lom = i.lom;  // location of muzzle
    this.tan = i.tan;  // tangent unit vector
    this.vel = i.vel;  // initial velocity of projectile
    this.rof = i.rof;  // rate of fire in rounds per second
    this.damage = 0;
  };

  nmsp.Turret.prototype.constructor = nmsp.Turret;

  nmsp.Turret.prototype.step = function turretStep() {
    if (this.plane.controls.fire) {
      if (this.rof === 0) {
        nmsp.bullets.push(new nmsp.Bullet(this));
        this.rof = 10;
      }
    }

    if (this.rof > 0) {
      this.rof -= 1;
    }
  };
}());
