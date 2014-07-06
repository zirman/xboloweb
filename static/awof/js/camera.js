/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, bitwise: true, indent: 2 */

(function () {
  "use strict";

  var nmsp = AWOF;

  // configures canvas matrix for different drawing operations
  nmsp.camera = {
    init: function (canvas) {
      // get canvas element and context
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");

      // this clears the canvas and sets it to the width and height to match css
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;

      // the drawing scale pixels/meter aproximatly
      this.scale = 8;

      // other camera parameters
      this.position = new nmsp.b2Vec2(0, 0);
      this.angle = 0;

      //
      this.velocity = new nmsp.b2Vec2(0, 0);
    },
    // used to draw the background gradient
    setupBackground: function () {
      this.ctx.save();
      // mirror on y axis and move origin to lower left
      this.ctx.translate(0, this.canvas.height);
      this.ctx.scale(1, -1);
    },
    // used to draw in world coordinates
    setupWorld: function () {
      this.ctx.save();
      // some matrix magic that is confusing so don't ask, I warned you

      // this block was simplified
      /*this.ctx.translate(0, this.canvas.height);
      this.ctx.scale(this.camera.scale, -this.camera.scale);  // a double flip to get the sprites drawn right side up and y positive in the up direction
      this.ctx.translate((this.canvas.width / (this.camera.scale * 2)) - this.camera.position.x,
        (this.canvas.height / (this.camera.scale * 2)) - this.camera.position.y);
      this.ctx.translate(this.camera.position.x, this.camera.position.y)*/

      // a double flip to get the sprites drawn right side up and y positive
      // in the up direction 
      this.ctx.scale(this.scale, -this.scale);
      this.ctx.translate(this.canvas.width / (this.scale * 2),
        (this.canvas.height / (this.scale * 2)) +
        (this.canvas.height / -this.scale));
      this.ctx.rotate(-this.angle);
      this.ctx.translate(-this.position.x, -this.position.y)
    },
    // used in debug draw mode
    setupDebug: function () {
      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(1, -1);
      this.ctx.rotate(-this.angle);
      this.ctx.translate(-this.position.x * this.scale,
        -this.position.y * this.scale);
    },
    restore: function () {
      this.ctx.restore();
    },
    chase: function (plane) {
      var p1, p2, position, target, velocity, dampK, lineK;
      var targetVelocity;
      var dVelocity;

      dampK = 0.5;
      lineK = 2;

      position = plane.fuselage.GetPosition();
      velocity = plane.fuselage.GetLinearVelocity();

      // create a line seg p1, p2 that we want the camera to center on
      p1 = position;
      p2 = nmsp.b2Math.AddVV(nmsp.b2Math.MulFV(lineK, velocity), position);

      // the target location for the camera
      target = nmsp.b2Math.MulFV(0.5, nmsp.b2Math.AddVV(p1, p2));

      // damping the transition
      targetVelocity = nmsp.b2Math.SubtractVV(target, this.position);

      dVelocity = nmsp.b2Math.SubtractVV(targetVelocity, this.velocity);

      this.velocity = nmsp.b2Math.MulFV(dampK, dVelocity);

      this.position = nmsp.b2Math.AddVV(this.position,
        nmsp.b2Math.MulFV(1 / nmsp.frameRate, this.velocity));

      this.position = target;


      this.scale = 20 / ((0.1*Math.sqrt((velocity.x * velocity.x) + (velocity.y * velocity.y))) + 1);
    }
  };
}());
