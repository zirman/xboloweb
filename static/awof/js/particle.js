/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Particle
// Prototype: Object

(function () {
  "use strict";

  var nmsp = AWOF;

  // define array of particles
  nmsp.particles = [];

  nmsp.Particle = function Particle(i) {
    this.position = i.position;
    this.radius = i.radius;
    this.color = i.color;
    this.step = i.step;
  };

  nmsp.Particle.prototype.constructor = nmsp.Particle;

  nmsp.Particle.prototype.draw = function draw(camera) {
    camera.ctx.beginPath();
    camera.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
    camera.ctx.fillStyle = this.color;
    camera.ctx.fill();
    camera.ctx.closePath();
  };

  // Wind Particle Helpers
  // takes startRadius velocity and duration
  nmsp.getWindParticleStep = function getWindParticleStep(i) {
    var timer = i.duration;

    return function getWindParticleStepHelper() {
      timer -= 1 / nmsp.frameRate;
      this.radius = (timer > 0.01) ? ((i.startRadius * timer) / i.duration) : 0;
      this.position = nmsp.b2Math.AddVV(this.position, nmsp.b2Math.MulFV(1 / nmsp.frameRate, i.velocity));
      return timer <= 0;
    };
  };

  nmsp.windParticleGenerator = function windParticleGenerator(i) {
    var startRadius = 0.25;

    nmsp.particles.push(
      new nmsp.Particle({
        position: i.position,
        radius: startRadius,
        color: "rgb(255, 255, 255)",
        step: nmsp.getWindParticleStep({
          startRadius: startRadius,
          duration: 0.5,
          velocity: i.velocity
        })
      })
    );
  };

  // Smoke Particle Helpers
  nmsp.getSmokeParticleStep = function getSmokeParticleStep(i) {
    var timer = i.duration;

    return function getSmokeParticleStepHelper() {
      timer -= 1 / nmsp.frameRate;
      this.radius += i.growth / nmsp.frameRate;
      this.color = "rgba(0, 0, 0, " + ((timer > 0.01) ? (timer / i.duration) : "0.0") + ")";
      this.position.y += i.rise_rate / nmsp.frameRate;
      return timer <= 0;
    };
  };

  nmsp.smokeParticleGenerator = function smokeParticleGenerator(i) {
    nmsp.particles.push(
      new nmsp.Particle({
        position: i.position,
        radius: 0.1,
        color: "rgb(0, 0, 0)",
        step: nmsp.getSmokeParticleStep({
          growth: 0.2,
          duration: 1.5,
          rise_rate: 2
        })
      })
    );
  };

  // Flame Particle Helpers
  nmsp.getFlameParticleStep = function getFlameParticleStep(i) {
    var timer = i.duration;

    return function getFlameParticleStepHelper() {
      timer -= 1 / nmsp.frameRate;
      this.radius = (timer > 0.01) ? ((i.startRadius * timer) / i.duration) : 0;
      this.position.y += i.rise_rate / nmsp.frameRate;
      return timer <= 0;
    };
  };

  nmsp.flameParticleGenerator = function flameParticleGenerator(i) {
    var startRadius = 0.3;  // starts at this radius and gets smaller

    nmsp.particles.push(
      new nmsp.Particle({
        position: i.position,
        radius: startRadius,
        color: "rgb(250, 250, 0)",
        step: nmsp.getFlameParticleStep({
          startRadius: startRadius,
          duration: 0.375,
          rise_rate: 2
        })
      })
    );
  };
}());
