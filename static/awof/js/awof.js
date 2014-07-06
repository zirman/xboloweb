/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, bitwise: true, indent: 2 */

(function () {
  "use strict";

  // draws debug information
  AWOF.debug = false;

  // used for fading elements
  function fade(i) {
    setTimeout(function () {
      i.start += (i.end - i.start) / (i.seconds * i.frameRate);
      i.seconds -= 1 / i.frameRate;

      if (i.seconds > 0) {
        i.elem.style.opacity = i.start;
        fade(i);
      }
      else {
        i.elem.style.opacity = i.end;

        /*if (i.end === 0) {
          i.elem.style.display = "none";
        }*/
      }
    }, 1000 / i.frameRate);
  }

  AWOF.init = function () {
    if (!Modernizr.canvas) {
      // no canvas, no way
      return;
    }

    // get ref to frequently used box2d objects
    this.b2Vec2 = Box2D.Common.Math.b2Vec2;
    this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
    this.b2Body = Box2D.Dynamics.b2Body;
    this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    this.b2World = Box2D.Dynamics.b2World;
    this.b2MassData = Box2D.Collision.Shapes.b2MassData;
    this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    this.b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    this.b2ContactListener = Box2D.Dynamics.b2ContactListener;
    this.b2Math = Box2D.Common.Math.b2Math;

    // setup canvas
    this.camera.init(document.getElementById("awof"));

    // setup event handlers for main menu
    this.registerMenuEventListeners();
  };

  AWOF.newGame = function newGame() {
    // initialize level
    this.level.init();

    // setup debug draw
    if (this.debug) {
      this.debugDraw = new this.b2DebugDraw();
      this.debugDraw.SetSprite(this.camera.ctx);
      this.debugDraw.SetDrawScale(this.camera.scale);
      this.debugDraw.SetFillAlpha(0.5);
      this.debugDraw.SetLineThickness(1.0);
      this.debugDraw.SetFlags(this.b2DebugDraw.e_shapeBit |
        this.b2DebugDraw.e_jointBit | this.b2DebugDraw.e_centerOfMassBit |
        this.b2DebugDraw.e_controllerBit | this.b2DebugDraw.e_pairBit);
      this.world.SetDebugDraw(this.debugDraw);
    }

    // application start
    this.stateFunc = this.playState;
    this.frameRateCounter = new this.FrameRateCounter();

    // application loop
    this.frameRate = 60;
    setInterval((function run() { this.stateFunc(); }.bind(this)),
      1000 / this.frameRate);

    // hides the menu screen
    fade({
      elem: document.getElementById("menu"),
      start: 1,
      end: 0,
      seconds: 1,
      frameRate: 15
    });

    // unregister events from menu
    this.deregisterMenuEventListeners();
  };

  AWOF.registerMenuEventListeners = function () {
    AWOF.newGame();
    //document.getElementById("newGame").onclick = AWOF.newGame.bind(this);
  };

  AWOF.deregisterMenuEventListeners = function () {
    document.getElementById("newGame").onclick = null;
  };

  AWOF.playState = function playState() {
    this.update();
    this.render();
    this.frameRateCounter.countFrames();
  };

  AWOF.update = (function () {
    var stepHelper, stepDeleteHelper;

    stepHelper = function stepHelper(value) {
      value.step();
    };

    stepDeleteHelper = function stepDeleteHelper(value, index, array) {
      if (value.step()) {
        delete array[index];
      }
    };

    return function update() {
      // clear forces
      this.world.ClearForces();

      // updates player controls
      this.player.step();

      // updates computer controls
      this.computers.forEach(stepHelper);
      //keys = Object.keys(this.computers);

      // updates plane forces
      this.planes.forEach(stepHelper);

      // remove old bullets
      this.bullets.forEach(stepDeleteHelper);

      // update particle positions
      this.particles.forEach(stepDeleteHelper);

      // update emitters
      this.emitters.forEach(stepDeleteHelper);

      // runs physics
      this.world.Step(1 / this.frameRate, 10, 10);
    };
  }());

  AWOF.render = function render() {
    var g1, g2, i, lingrad, r;

    // has the camera follow a plane
    this.camera.chase(this.player.plane);

    // draw the background gradient
    this.camera.setupBackground();

    // setup gradient points relative in screen coordinates when the camera is
    // at the origin
    g1 = new this.b2Vec2(0, this.camera.canvas.height / 2 - this.camera.scale);
    g2 = new this.b2Vec2(0, this.camera.canvas.height / 2 + this.camera.canvas.height);

    g1 = this.b2Math.SubtractVV(g1, this.b2Math.MulFV(this.camera.scale, this.camera.position));
    g2 = this.b2Math.SubtractVV(g2, this.b2Math.MulFV(this.camera.scale, this.camera.position));

    // translate gradient according to where camera is actually at

    g1 = this.b2Math.SubtractVV(g1, new this.b2Vec2(this.camera.canvas.width / 2,
      this.camera.canvas.height / 2));
    g2 = this.b2Math.SubtractVV(g2, new this.b2Vec2(this.camera.canvas.width / 2,
      this.camera.canvas.height / 2));

    r = Box2D.Common.Math.b2Mat22.FromAngle(this.camera.angle);
    g1 = this.b2Math.MulTMV(r, g1);
    g2 = this.b2Math.MulTMV(r, g2);

    g1 = this.b2Math.AddVV(g1, new this.b2Vec2(this.camera.canvas.width / 2,
      this.camera.canvas.height / 2));
    g2 = this.b2Math.AddVV(g2, new this.b2Vec2(this.camera.canvas.width / 2,
      this.camera.canvas.height / 2));

    lingrad = this.camera.ctx.createLinearGradient(g1.x, g1.y, g2.x, g2.y);

    lingrad.addColorStop(0, '#aae063');
    lingrad.addColorStop((3 * this.camera.scale) / this.camera.canvas.height, '#66CC00');
    lingrad.addColorStop((3 * this.camera.scale) / this.camera.canvas.height, '#b6e7fa');
    lingrad.addColorStop(1, '#00ABEB');

    //
    // assign gradients to fill and stroke styles
    //
    this.camera.ctx.fillStyle = lingrad;
    this.camera.ctx.fillRect(0, 0, this.camera.canvas.width, this.camera.canvas.height);

    this.camera.restore();

    //
    // setup matrix for drawing sprites
    //
    this.camera.setupWorld();

    // draw terrain
    this.level.draw(this.camera);

    // draw planes
    this.planes.forEach((function (value) {
      value.draw(this.camera);
    }.bind(this)));

    // draw particle effects
    this.particles.forEach((function (value) {
      value.draw(this.camera);
    }.bind(this)));

    this.bullets.forEach((function (value) {
      value.draw(this.camera);
    }.bind(this)));

    this.camera.restore();

    // debug draw
    if (this.debug) {
      this.camera.setupDebug();
      this.world.DrawDebugData();
      this.camera.restore();
    }
  };
}());
