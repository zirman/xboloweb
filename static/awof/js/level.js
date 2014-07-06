/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

// Level Singleton Object

(function () {
  "use strict";

  var nmsp = AWOF;

  nmsp.level = {
    init: function (lvl) {
      var bodyDef, contactListener, fixDef, groundBody, i, vectorArray;

      // define box2d world
      nmsp.world = new nmsp.b2World(new nmsp.b2Vec2(0, -9.81), true);

      // add contactListener for damage modeling
      contactListener = new nmsp.b2ContactListener();

      contactListener.PostSolve = (function () {
        var postSolveHelper = function postSolveHelper(userData, impulse) {
          if (userData) {
            if (userData.doDamage) {
              userData.doDamage(impulse);
            } else {
              userData.damage += impulse;
            }
          }
        };

        return function postSolve(contact, impulse) {
          var fixtureAUserData, fixtureBUserData, imp;

          imp = impulse.normalImpulses[0] + impulse.normalImpulses[1];

          // only cause damage if impulse is greater than threshold
          if (imp > 2.0) {
            fixtureAUserData = contact.GetFixtureA().GetUserData();
            fixtureBUserData = contact.GetFixtureB().GetUserData();

            postSolveHelper(fixtureAUserData, imp);
            postSolveHelper(fixtureBUserData, imp);
          }
        };
      }());

      nmsp.world.SetContactListener(contactListener);

      // variables used in initialization (can be resued)
      bodyDef = new nmsp.b2BodyDef();

      fixDef = new nmsp.b2FixtureDef();

      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;

      bodyDef.type = nmsp.b2Body.b2_staticBody;
      bodyDef.bullet = false;
      bodyDef.fixedRotation = true;
      bodyDef.position = new nmsp.b2Vec2(0, 0);
      bodyDef.linearDamping = 0;
      bodyDef.angularDamping = 0;
      bodyDef.userData = null;

      groundBody = nmsp.world.CreateBody(bodyDef);

      fixDef.shape = new nmsp.b2PolygonShape();
      fixDef.userData = null;

      vectorArray = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: AwofLevels[0].heights[1] },
        { x: 0, y: AwofLevels[0].heights[0] }
      ];

      fixDef.shape.SetAsArray(vectorArray);
      groundBody.CreateFixture(fixDef);

      for (i = 1; i < AwofLevels[0].heights.length; i += 1) {
        vectorArray[0].x += 10;
        vectorArray[1].x += 10;
        vectorArray[2].x += 10;
        vectorArray[3].x += 10;
        vectorArray[3].y = vectorArray[2].y;
        vectorArray[2].y = AwofLevels[0].heights[i];

        fixDef.shape.SetAsArray(vectorArray);
        groundBody.CreateFixture(fixDef);
      }

      // initialize player
      nmsp.player.init(AwofLevels[0].player);

      // initialize computers
      AwofLevels[0].computers.forEach(function (value) {
        nmsp.computers.push(new nmsp.Computer(value));
      });
    },
    run: function levelRun () {
    },
    draw: function levelDraw (camera) {
      var vectorArray;

      vectorArray = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: AwofLevels[0].heights[1] },
        { x: 0, y: AwofLevels[0].heights[0] }
      ];

      camera.ctx.beginPath();
      camera.ctx.moveTo(vectorArray[0].x, vectorArray[0].y);
      camera.ctx.lineTo(vectorArray[1].x, vectorArray[1].y);
      camera.ctx.lineTo(vectorArray[2].x, vectorArray[2].y);
      camera.ctx.lineTo(vectorArray[3].x, vectorArray[3].y);
      camera.ctx.closePath();
      camera.ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      camera.ctx.fill();

      //fixDef.shape.SetAsArray(vectorArray);
      //groundBody.CreateFixture(fixDef);

      for (i = 1; i < AwofLevels[0].heights.length; i += 1) {
        vectorArray[0].x += 10;
        vectorArray[1].x += 10;
        vectorArray[2].x += 10;
        vectorArray[3].x += 10;
        vectorArray[3].y = vectorArray[2].y;
        vectorArray[2].y = AwofLevels[0].heights[i];

        camera.ctx.beginPath();
        camera.ctx.moveTo(vectorArray[0].x, vectorArray[0].y);
        camera.ctx.lineTo(vectorArray[1].x, vectorArray[1].y);
        camera.ctx.lineTo(vectorArray[2].x, vectorArray[2].y);
        camera.ctx.lineTo(vectorArray[3].x, vectorArray[3].y);
        camera.ctx.closePath();
        camera.ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
        camera.ctx.fill();

        //fixDef.shape.SetAsArray(vectorArray);
        //groundBody.CreateFixture(fixDef);
      }
    }
  };
}());
