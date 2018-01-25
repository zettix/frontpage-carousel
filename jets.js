// jets.js Copyright 2018 Sean Brennan
//
// License: Apache 2.0 https://www.apache.org/licenses/LICENSE-2.0
// 
// Jets fly overhead leaving trails.
// mood: {
//   target: [ x, z];
//   timeout: timestamp
// Gonna use Newtonian Gravity to direct the jets around the arena.
// lighting still sucks.
// F = M A   force = mass times acceleration.
// F = G M1 M2 / R^2  force = gravity constant times mass one times mass two
//                            divided by their distance squared.
// guess what.  No really, guess what.  distance normall uses sqare root.
//  but we square it so we don't have to square root. just dx^2 + dy^2


var jets = {};
jets.sunpos = new THREE.Vector3(15, 15.5, 15);

jets.foos = [];
jets.last_trail = [];
jets.diameter = 300.0;
jets.gavitational_constant = 0.98;  // units something something.
jets.sun_mass = 0.98;
jets.jet_mass = 1.80;
jets.lifeparam = 600;

jets.GenDeltas = function(numEntries) {
  var theta = Math.random() * 6.28;
  var radius = Math.random() * this.diameter  + this.diameter;
  var x = Math.cos(theta);
  var z = Math.sin(theta);
  var tx = -x * radius;
  var ty = 25.0 + Math.random() * 3.0;
  var tz = -z * radius;
  // run simulation.
  var result = [];
  //var count = numEntries + 3; // for calculating dx,dy,dz, and d''(xyz)
  var count = 0;
  var interp = Math.random();
  var xd = z * interp + (interp - 1.0) * z + x;
  var zd = -x * interp + (1.0 - interp) * x + z;
  xd *= 0.2;
  zd *= 0.2;
  var initvelo = xd * xd + zd * zd;
  while (count >= 0) {
   //count--;
   count++;
   tx += xd;
   tz += zd;
   var x2 = (tx - this.sunpos.x);
   x2 *= x2;
   var z2 = (tz - this.sunpos.z);
   z2 *= z2;
   var r2 = x2 + z2 + 10.0;  // easy no-divide by zero.
   ty = r2 * 0.0012 + 23.0;
   var force = jets.gavitational_constant * jets.sun_mass / r2;
   var accx = force * (tx - this.sunpos.x);  // vector to sun/origin.
   var accz = force * (tz - this.sunpos.z);  // vector to sun/origin.
   xd -= accx;
   zd -= accz;  // A = G M2 / R2
   var entry = {};
   entry.x = tx;
   entry.y = ty;
   entry.z = tz;
   var velo = xd * xd + zd * zd;
   if (velo < initvelo) {  // this should only happen at the end of an arc.
     break;
   }
   result.push(entry);
  }
  return result;
}
  
jets.NewMood = function() {
  var result = {};
  result.timeout = this.lifeparam + this.lifeparam * Math.random() * 0.5;
  result.deltas = this.GenDeltas(result.timeout);
  result.dindex = 0.0;
  return result;
};
  
jets.Killall = function() {
  this.foos = [];
};

jets.Populate = function(numJets) {
  this.Killall();
  for (var i = 0 ; i < numJets; i++) {
    var body = new frontpage.LoadModel("MMX24", "MMX24", 0, 0, 0, 1.0);
    var m = this.NewMood();
    //body.group.applyMatrix(new THREE.Matrix4().makeTranslation(m.x,m.y,m.z));
    var model = new THREE.Object3D();
    model.add(body.group);
    model.position.x = m.deltas[0].x;
    model.position.y = m.deltas[0].y;
    model.position.z = m.deltas[0].z;
    this.foos.push([model, m]);
    this.last_trail.push(0);
  }
  return this.foos;
};

jets.FlyJetsAround = function(scene, elapsed) {
  for (var i = 0; i < this.foos.length; i++) {
    var wing = this.foos[i];
    var model = wing[0];
    var mood = wing[1];
    if (mood.timeout < 0.0) {
      wing[1] = this.NewMood();
      mood = wing[1];
      var p = mood.deltas[0];
      model.position.x = p.x;
      model.position.y = p.y;
      model.position.z = p.z;
    }
    var intdin = Math.floor(mood.dindex);
    if (intdin < (mood.deltas.length - 3)) {
      if ((intdin % 11) == 1) {
        if (model.position.y < 170.0) {
          var gogo = this.last_trail[i];
          if (gogo != intdin) {
            trails.Add(model.position, lookie, scene);
            this.last_trail[i] = intdin;
          }
        }
      }
     var pp = mood.deltas[intdin];
     model.position.x = pp.x;
     model.position.y = pp.y;
     model.position.z = pp.z;
     // model.position.y 
     mood.timeout -= 1 * elapsed;
     var ppp = mood.deltas[intdin + 1];
     var xx = ppp.x;
     var yy = ppp.y;
     var zz = ppp.z;
     var lookie = new THREE.Vector3(xx, yy, zz);
     model.lookAt(lookie);
    } else {
     mood.timeout = -1.0;
    }
    mood.dindex += 1.0 * elapsed;
  }
};
