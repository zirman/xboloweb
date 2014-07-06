/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Plane
// Prototype: Object

(function () {
  "use strict";

  var bodyDef, fixDef, massData, nmsp, revoluteJointDef;

  nmsp = AWOF;

  // define array containing all plane objects
  nmsp.planes = [];

  nmsp.Plane = function Plane(i) {
    var json = planeParameters[i.plane];

    this.damage = 0;

    // initialize member variables
    this.wing = new nmsp.Wing({
      plane: this,
      lof: new nmsp.b2Vec2(json.wing.lof.x, json.wing.lof.y),
      tan: new nmsp.b2Vec2(json.wing.tan.x, json.wing.tan.y),
      c: json.wing.c,
      s: json.wing.s,
      stall_thresh: json.wing.stall_thresh
    });

    this.elevator = new nmsp.Wing({
      plane: this,
      lof: new nmsp.b2Vec2(json.elevator.lof.x, json.elevator.lof.y),
      tan: new nmsp.b2Vec2(json.elevator.tan.x, json.elevator.tan.y),
      c: json.elevator.c,
      s: json.elevator.s,
      stall_thresh: json.elevator.stall_thresh
    });

    this.turret = new nmsp.Turret({
      plane: this,
      lom: new nmsp.b2Vec2(json.turret.lom.x, json.turret.lom.y),
      tan: new nmsp.b2Vec2(json.turret.tan.x, json.turret.tan.y),
      vel: json.turret.vel,
      rof: json.turret.rof
    });

    this.controls = new nmsp.Controls({
      plane: this
    });

    // used in initialization
    bodyDef = new nmsp.b2BodyDef();

    // airplane body
    bodyDef.type = nmsp.b2Body.b2_dynamicBody;
    bodyDef.position.x = i.position.x;
    bodyDef.position.y = i.position.y;
    bodyDef.linearDamping = json.linearDamping;
    bodyDef.angularDamping = json.angularDamping;
    bodyDef.userData = null;
    this.fuselage = nmsp.world.CreateBody(bodyDef);

    fixDef = new nmsp.b2FixtureDef();

    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    fixDef.shape = new nmsp.b2PolygonShape();

    // fuselage fixture
    fixDef.shape.SetAsArray(json.fuselage.fixture);
    fixDef.userData = this;
    this.fuselage.CreateFixture(fixDef);

    // wing fixture
    fixDef.shape.SetAsArray(json.wing.fixture);
    fixDef.userData = this.wing;
    this.fuselage.CreateFixture(fixDef);

    // tail fixture
    fixDef.shape.SetAsArray(json.elevator.fixture);
    fixDef.userData = this.elevator;
    this.fuselage.CreateFixture(fixDef);

    // power object
    this.power = new nmsp.Power({
      plane: this,
      lof: new nmsp.b2Vec2(json.prop.lof.x, json.prop.lof.y),
      wind1: new nmsp.b2Vec2(json.prop.wind1.x, json.prop.wind1.y),
      wind2: new nmsp.b2Vec2(json.prop.wind2.x, json.prop.wind2.y),
      smoke1: new nmsp.b2Vec2(json.prop.smoke1.x, json.prop.smoke1.y),
      smoke2: new nmsp.b2Vec2(json.prop.smoke2.x, json.prop.smoke2.y),
      flame: new nmsp.b2Vec2(json.prop.flame.x, json.prop.flame.y),
      tan: new nmsp.b2Vec2(json.prop.tan.x, json.prop.tan.y),
      c: json.prop.c
    });

    // propeller fixture
    fixDef.shape.SetAsArray(json.prop.fixture);
    fixDef.userData = this.power;
    this.fuselage.CreateFixture(fixDef);

    // customize center of gravity and scale mass
    massData = new nmsp.b2MassData();
    this.fuselage.GetMassData(massData);
    massData.center = new nmsp.b2Vec2(0, 0);
    massData.I *= json.mass / massData.mass;
    massData.mass = json.mass;
    this.fuselage.SetMassData(massData);

    // wheel
    bodyDef.position.x = i.position.x + json.wheel.axle.x;
    bodyDef.position.y = i.position.y + json.wheel.axle.y;
    bodyDef.userData = this;
    this.wheel = nmsp.world.CreateBody(bodyDef);

    fixDef.shape = new nmsp.b2CircleShape(json.wheel.radius);
    fixDef.userData = this.wheel;
    this.wheel.CreateFixture(fixDef);

    // apply negligable mass to wheel
    this.wheel.GetMassData(massData);
    massData.I *= 0.1 / massData.mass;
    massData.mass = 0.1;
    this.wheel.SetMassData(massData);

    // create strut joint
    revoluteJointDef = new nmsp.b2RevoluteJointDef();
    revoluteJointDef.bodyA = this.fuselage;
    revoluteJointDef.bodyB = this.wheel;
    revoluteJointDef.localAnchorA = new nmsp.b2Vec2(json.wheel.axle.x,
      json.wheel.axle.y);
    revoluteJointDef.localAnchorB = new nmsp.b2Vec2(0, 0);
    this.strutJoint = nmsp.world.CreateJoint(revoluteJointDef);

    // get sprite information
    this.fuselageSprite = json.fuselageSprite;
    this.fuselageCenter = json.fuselageCenter;
    this.wheelSprite = json.wheelSprite;
    this.wheelCenter = json.wheelCenter;
    this.spriteScale = json.spriteScale;

    nmsp.planes.push(this);
  };

  nmsp.Plane.prototype.constructor = nmsp.Plane;

  nmsp.Plane.prototype.step = function planeStep() {
    var cot_win, force, tan, tan_win, win, win_2;

    // mirror planes around the player's plane
    //var playerPosition = player.plane.fuselage.GetPosition();
/*
    var playerPosition = new nmsp.b2Vec2(canvas.width/20, canvas.height/20);
    var position = this.fuselage.GetPosition();
    if (position.x - playerPosition.x > 64) {
      position.x -= 128;
      this.fuselage.SetPosition(position);

      position = this.wheel.GetPosition();
      position.x -= 128;
      this.wheel.SetPosition(position);
    } else if (playerPosition.x - position.x > 64) {
      position.x += 128;
      this.fuselage.SetPosition(position);

      position = this.wheel.GetPosition();
      position.x += 128;
      this.wheel.SetPosition(position);
    }
*/
    // throttle control
    if (this.controls.throttle) {
      // get flow of wind over prop in world coordinates
      win = this.fuselage.GetLinearVelocityFromLocalPoint(this.power.lof).GetNegative();
      // get prop tang in world coordinates
      tan = this.fuselage.GetWorldVector(this.power.tan);
      // get wind flow in tangent direction
      tan_win = nmsp.b2Math.MulFV(nmsp.b2Math.Dot(tan, win), tan);
      // subtract wind flow from tangent force to get remaining force
      force = nmsp.b2Math.AddVV(nmsp.b2Math.MulFV(this.power.c / (this.power.damage + 1), tan), tan_win);

      this.fuselage.ApplyForce(force, this.fuselage.GetWorldPoint(this.power.lof));

      // enable emitter
      this.power.windEmitter.enabled = true;
    } else {
      // disable emitter
      this.power.windEmitter.enabled = false;
    }

    // elevator controls
    if (this.controls.up) {
      this.elevator.tan = new nmsp.b2Vec2(0.3, 1);
      this.elevator.tan.Normalize();
    } else if (this.controls.down) {
      this.elevator.tan = new nmsp.b2Vec2(-0.3, 1);
      this.elevator.tan.Normalize();
    } else {
      this.elevator.tan = new nmsp.b2Vec2(0.0, 1);
      this.elevator.tan.Normalize();
    }

    // apply elevator force
    win = this.fuselage.GetLinearVelocityFromLocalPoint(this.elevator.lof).GetNegative();

    if (this.controls.throttle) {
      // get flow of wind over prop in world coordinates
      win_2 = this.fuselage.GetLinearVelocityFromLocalPoint(this.power.lof).GetNegative();
      // get prop tang in world coordinates
      tan = this.fuselage.GetWorldVector(this.power.tan);
      // get wind flow in tangent direction
      tan_win = nmsp.b2Math.MulFV(nmsp.b2Math.Dot(tan, win_2), tan);
      // subtract wind flow from tangent force to get remaining force
      force = nmsp.b2Math.AddVV(nmsp.b2Math.MulFV(this.power.c / (this.power.damage + 1), tan), tan_win);

      win = nmsp.b2Math.SubtractVV(win, force);
    }

    tan = this.fuselage.GetWorldVector(this.elevator.tan);
    tan_win = nmsp.b2Math.MulFV(nmsp.b2Math.Dot(tan, win), tan);
    cot_win = nmsp.b2Math.SubtractVV(win, tan_win);

    if (cot_win.Length() > this.elevator.stall_thresh) {  // stall threshold
      tan_win = nmsp.b2Math.MulFV(this.elevator.c / (this.elevator.damage + 1), tan_win);
    } else {
      tan_win = nmsp.b2Math.MulFV(this.elevator.s / (this.elevator.damage + 1), tan_win);
    }

    if (cot_win.Length() > 0.1) {
      this.fuselage.ApplyForce(tan_win, this.fuselage.GetWorldPoint(this.elevator.lof));
    }

    // apply wing force
    win = this.fuselage.GetLinearVelocityFromLocalPoint(this.wing.lof).GetNegative();
    tan = this.fuselage.GetWorldVector(this.wing.tan);
    tan_win = nmsp.b2Math.MulFV(nmsp.b2Math.Dot(tan, win), tan);
    cot_win = nmsp.b2Math.SubtractVV(win, tan_win);

    if (cot_win.Length() > this.wing.stall_thresh) {  // stall threshold
      tan_win = nmsp.b2Math.MulFV(this.wing.c / (this.wing.damage + 1), tan_win);
    } else {
      tan_win = nmsp.b2Math.MulFV(this.wing.s / (this.wing.damage + 1), tan_win);
    }

    if (cot_win.Length() > 0.1) {
      this.fuselage.ApplyForce(tan_win, this.fuselage.GetWorldPoint(this.wing.lof));
    }

    this.turret.step();
  };

  nmsp.Plane.prototype.draw = function draw (camera) {
    var img, position;//, inv;

    //inv = 1 / 10;

    // draw fuselage
    img = nmsp.images[this.fuselageSprite];

    if (img) {
      camera.ctx.save();

      position = this.fuselage.GetPosition();

      camera.ctx.translate(position.x, position.y);
      camera.ctx.rotate(this.fuselage.GetAngle());
      // a double flip and scale to get the sprites drawn right side up
      // with the y going up and using world coordinates
      camera.ctx.scale(this.spriteScale, -this.spriteScale);//inv, -inv);

      // origin of image be center of mass
      camera.ctx.drawImage(img, -this.fuselageCenter.x, -this.fuselageCenter.y);

      camera.ctx.restore();
    }

    // draw wheel
    img = nmsp.images[this.wheelSprite];

    if (img) {
      camera.ctx.save();

      position = this.wheel.GetPosition();

      camera.ctx.translate(position.x, position.y);
      camera.ctx.rotate(this.wheel.GetAngle());
      // a double flip and scale to get the sprites drawn right side up
      // with the y going up and using world coordinates
      camera.ctx.scale(this.spriteScale, -this.spriteScale);//inv, -inv);

      // origin of image be center of mass
      camera.ctx.drawImage(img, -this.wheelCenter.x, -this.wheelCenter.y);

      camera.ctx.restore();
    }
  };
}());
