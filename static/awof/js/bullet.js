/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Bullet
// Prototype: Object

(function () {
  "use strict";

  var nmsp = AWOF;

  // define array of bullets
  nmsp.bullets = [];

  nmsp.Bullet = function Bullet(i) {
    var bodyDef, fixDef;

    this.timer = 1.3;

    bodyDef = new nmsp.b2BodyDef();
    bodyDef.type = nmsp.b2Body.b2_dynamicBody;
    bodyDef.bullet = true;
    bodyDef.fixedRotation = true;
    bodyDef.position = i.plane.fuselage.GetWorldPoint(i.lom);
    bodyDef.linearVelocity =
      nmsp.b2Math.AddVV(i.plane.fuselage.GetLinearVelocityFromLocalPoint(i.lom),
                         nmsp.b2Math.MulFV(i.vel, i.plane.fuselage.GetWorldVector(i.tan)));
    bodyDef.userData = null;
    this.body = nmsp.world.CreateBody(bodyDef);

    fixDef = new nmsp.b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new nmsp.b2CircleShape(0.1);
    fixDef.userData = null;
    this.body.CreateFixture(fixDef);
  };

  nmsp.Bullet.prototype.constructor = nmsp.Bullet;

  nmsp.Bullet.prototype.step = function bulletStep() {
    this.timer -= 1 / nmsp.frameRate;

    if (this.timer <= 0) {
      nmsp.world.DestroyBody(this.body);
      return true;
    }

    return false;
  };

  nmsp.Bullet.prototype.draw = function bulletDraw(camera) {
    var position = this.body.GetPosition();
    camera.ctx.beginPath();
    camera.ctx.arc(position.x, position.y, 0.2, 0, 2 * Math.PI, false);
    camera.ctx.fillStyle = "rgb(255, 250, 0)"
    camera.ctx.fill();
    camera.ctx.closePath();
  };
}());
