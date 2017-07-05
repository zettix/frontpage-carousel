// people.js
// Copyright 2017 Sean Brennan
//
// License: Apache 2.0
// https://www.apache.org/licenses/LICENSE-2.0

// mood: {
//   target: [ x, z];
//   timeout: timestamp
//   hopheight: y
//   hopvel: v
//

var people = {};
people.lookatme = new THREE.Vector3(0, 1.5, 0);

people.peeps = [];
people.diameter = 30.0;
people.gravity = .055;
people.initVelo = 0.30;
people.velocity = 0.1;

people.NewMood = function() {
        var theta = Math.random() * 6.28;
        var radius = Math.random() * this.diameter;
        var x = -Math.cos(theta) * radius;
        var z = -Math.sin(theta) * radius;
        var result = {};
        result.target = [x,z];
        result.timeout = 40;
        result.hopheight = Math.random() * 1.28;
        result.hopvel = Math.random() - 0.5;
        result.headvel = 0;
        result.headheight = 0;
        return result;
};
  
people.Killall = function() {
  this.peeps = [];
};

people.Populate = function(numPeople) {
      for (var i = 0 ; i < numPeople; i++) {
        var theta = Math.random() * 6.28;
        var radius = Math.random() * this.diameter * 0.1 + this.diameter * 0.9;
        var x = -Math.cos(theta) * radius;
        var y = -2.0;  // see MovePeepsAround for actual root y (hardcoded)
        var z = -Math.sin(theta) * radius;
        var body = new frontpage.LoadModel("circleperson2body", "circleperson2body", 0, 0, 0, 1.0); // function w/ group.
        var head = new frontpage.LoadModel("circleperson2head", "circleperson2head", 0, 0, 0, 1.0); // function w/ group.

        body.group.applyMatrix(new THREE.Matrix4().makeTranslation(x,y,z));
        head.group.applyMatrix(new THREE.Matrix4().makeTranslation(x,y,z));
        var person = new THREE.Object3D();
        person.add(body.group);
        person.add(head.group);
        head.group.lookAt(globals.zerovec);
        body.group.lookAt(globals.zerovec);
        this.peeps.push([person, this.NewMood()]);
      }
      return this.peeps;
};


people.MovePeopleAround = function() {
  for (var i = 0; i < this.peeps.length; i++) {
    var they = this.peeps[i];
    var pson = they[0];
    var mood = they[1];
    var closex = pson.position.x - mood.target[0];
    closex *= closex;
    if (closex > this.velocity) {
      if (mood.target[0] > pson.position.x) {
        pson.position.x += this.velocity;
      } else {
        pson.position.x -= this.velocity;
      }
    }
    var closez = pson.position.z - mood.target[1];
    closez *= closez;
    if (closez > this.velocity) {
      if (mood.target[1] > pson.position.z) {
        pson.position.z += this.velocity;
      } else {
        pson.position.z -= this.velocity;
      }
    }
    if (closez + closex < this.velocity * 2) {
        var theta = Math.random() * 6.28;
        var radius = Math.random() * this.diameter * 0.01 + this.diameter * 0.99;
        mood.target[0] = -Math.cos(theta) * radius;
        mood.target[1] = -Math.sin(theta) * radius;
    }
    mood.timeout -= 1;
    if (mood.timeout <= 0) {
      //mood.headvel = this.initVelo * 2;
      mood.hopvel = this.initVelo;
      mood.timeout = 40;
      mood.hopheight = 0.0;
    } else {
      mood.hopheight += mood.hopvel;
      //mood.headheight += mood.headvel * 2.0;
      mood.hopvel -= this.gravity;
      //mood.headvel -= this.gravity * 2.0;
    }
    if (mood.hopheight <= 0.0) {
      mood.hopvel = this.initVelo;
      mood.timeout = 40;
      mood.hopheight = 0.0;
    }
    pson.position.y = -2.0 + mood.hopheight;  // root y.
    pson.children[1].position.y = -2.4 + mood.hopheight* .6;
  }
};
