/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Power
// Prototype: Object

(function () {
  "use strict";

  var nmsp = AWOF;

  nmsp.Power = function Power(i) {
    this.plane = i.plane;
    this.lof = i.lof;  // location of force
    this.tan = i.tan;  // direction of the thrust
    this.tan.Normalize();
    this.c = i.c;      // scalar with the velocity of the propwash
    this.damage = 0;

    /* particle effects */
    this.wind1 = i.wind1;
    this.wind2 = i.wind2;
    this.smoke1 = i.smoke1;
    this.smoke2 = i.smoke2;
    this.flame = i.flame;

    this.windEmitter = new nmsp.Emitter({
      frequency: 20,
      varience: 1,
      enabled: false,
      generator: nmsp.getParticleGenerator(nmsp.windParticleGenerator, this.getWindInitializer())
    });

    this.smokeEmitter = new nmsp.Emitter({
      frequency: 20,
      varience: 1,
      enabled: false,
      generator: nmsp.getParticleGenerator(nmsp.smokeParticleGenerator, this.getSmokeInitializer())
    });

    this.flameEmitter = new nmsp.Emitter({
      frequency: 8,
      varience: 0.5,
      enabled: false,
      generator: nmsp.getParticleGenerator(nmsp.flameParticleGenerator, this.getFlameInitializer())
    });
  };

  nmsp.Power.prototype.constructor = nmsp.Power;

  nmsp.Power.prototype.getWindInitializer = function powerGetWindInitializer() {
    var power = this;

    return function powerGetWindInitializerHelper() {
      var body, localPoint, position, velocity;

      // returns the initial position and velocity of a wind particle off of the propeller
      body = power.plane.fuselage;
      localPoint = nmsp.b2Math.AddVV(nmsp.b2Math.MulFV(Math.random(), nmsp.b2Math.SubtractVV(power.wind2, power.wind1)), power.wind1);
      position = body.GetWorldPoint(localPoint);
      velocity = nmsp.b2Math.AddVV(body.GetWorldVector(nmsp.b2Math.MulFV(-power.c * 0.4, power.tan)), body.GetLinearVelocityFromLocalPoint(localPoint));

      return {
        position: position,
        velocity: velocity
      };
    };
  };

  nmsp.Power.prototype.getSmokeInitializer = function powerGetSmokeInitializer() {
    var power = this;

    return function pwerGetSmokeInitializerHelper() {
      var body, localPoint, position;

      // returns the initial position and velocity of a wind particle off of the propeller
      body = power.plane.fuselage;
      localPoint = nmsp.b2Math.AddVV(nmsp.b2Math.MulFV(Math.random(), nmsp.b2Math.SubtractVV(power.smoke2, power.smoke1)), power.smoke1);
      position = body.GetWorldPoint(localPoint);

      return {
        position: position
      };
    };
  };

  nmsp.Power.prototype.getFlameInitializer = function powerGetFlameInitializer() {
    var power = this;

    return function powerGetFlameInitializerHelper() {
      var body, localPoint, position;

      body = power.plane.fuselage;
      localPoint = power.flame;
      position = body.GetWorldPoint(localPoint);

      return {
        position: position
      };
    };
  };

  nmsp.Power.prototype.doDamage = function doDamage(damage) {
    this.damage += damage;

    if (this.damage >= 1) {
      this.windEmitter.frequency = 0;
      this.smokeEmitter.enabled = true;

      if (this.damage >= 1.1) {
        this.flameEmitter.enabled = true;
      }
    }
  };
}());
