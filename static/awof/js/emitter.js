/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Emitter
// Prototype: Object
// Emitters run generator periodicly based on frequency and varience

(function () {
  "use strict";

  var nmsp = AWOF;

  // define array of emitters
  nmsp.emitters = [];

  nmsp.Emitter =
    function Emitter(i) {
      this.frequency = i.frequency;  // avg times per second
      this.varience = i.varience;  // 0 to 1.  0 being timely and 1 is random
      this.enabled = i.enabled;

      // generator function
      this.generator = i.generator;

      // setup timer
      this.timer = 0;
      this.resetTimer();

      // add this list of emitters
      nmsp.emitters.push(this);
    };

  nmsp.Emitter.prototype.constructor = nmsp.Emitter;

  nmsp.Emitter.prototype.step =
    function emitterStep() {
      if (this.enabled) {
        this.timer -= 1 / nmsp.frameRate;

        while (this.timer <= 0) {
          this.generator();
          this.resetTimer();
        }
      }
    };

  nmsp.Emitter.prototype.resetTimer =
    function emitterResetTimer() {
      this.timer +=
        (1 + (Math.random() * this.varience) - (this.varience / 2)) /
        this.frequency;
    };

  // helpers for emitters
  nmsp.getPointPositionGenerator =
    function getPointPositionGenerator(body, point) {
      return function getPointPositionGeneratorHelper() {
        return body.GetWorldPoint(point);
      };
    };

  nmsp.getLinePosVecGenerator =
    function getLinePosVecGenerator(body, p1, p2) {
      return function getLinePosVecGeneratorHelper() {
        return {
          position: body.GetWorldPoint(nmsp.b2Math.AddVV(nmsp.b2Math.MulFV(Math.random(), nmsp.b2Math.SubtractVV(p2, p1)), p1)),
          velocity: new nmsp.b2Vec2(0, 0)
        };
      };
    };

  nmsp.getParticleGenerator =
    function getParticleGenerator(particleGenerator, particleInitializer) {
      // closure with reference to point and particle
      // point and particle can still be modified
      return function getParticleGeneratorHelper() {
        particleGenerator(particleInitializer());
      };
    };
}());
