// trails.js Copyright 2018 Sean Brennan
//
// License: Apache 2.0 https://www.apache.org/licenses/LICENSE-2.0
// 
// Trails trail behind the jets.
// mood: {
//   target: [ x, z];
//   timeout: timestamp

var trails = {};

trails.foos = {};
trails.avail = [];
trails.lifeparam = 400.0;
trails.serial = 0.0;
trails.max = 1000;

trails.NewMood = function() {
  var result = {};
  result.timeout = this.lifeparam;
  result.counter = 0.0;
  return result;
};
  
trails.Killall = function() {
  this.foos = {};
  this.avail = [];
};

trails.Add = function(pos, dir, scene) {
 var thing = {};
 var mod = {};
 var theta = 0.0001 * this.serial;
 var red = Math.cos(theta);
 var green = Math.cos(theta + 2.09);
 var blue = Math.cos(theta + 4.19);
 red *= red;
 green *= green;
 blue *= blue;
 var col = new THREE.Color(red, green, blue);
 if (this.avail.length > 0) { 
   mod = this.avail.pop();
 } else {
   if (this.foos.length > this.max) {
    return;
   }
   //var geometry = new THREE.BoxGeometry(1, 1, 1);
   //var geometry = new THREE.OctahedronGeometry();
   //var geometry = new THREE.PlaneGeometry();
   var geometry = new THREE.IcosahedronGeometry();
   // var material = new THREE.MeshNormalMaterial();
   // var material = new THREE.MeshLambertMaterial({color:0x00ffff});
   var material = new THREE.MeshLambertMaterial({color: 0x888888, transparent: true, opacity: .4}) 
   //var material = new THREE.MeshBasicMaterial({color: 0x444444, wireframe:true} );
   //var cube = new THREE.Mesh(geometry, material);
   var mod = new THREE.Mesh(geometry, material);
   //mod = new THREE.Object3D();
 mod.position.x = pos.x;
 mod.position.y = pos.y;
 mod.position.z = pos.z;
   mod.name = "S" + this.serial;
   //mod.add(cube);
   scene.add(mod);
 }
  this.serial += 1.0;
 // mod.children[0].material.setValues({color: col});
 mod.material.setValues({color: col});
 mod.position.x = pos.x;
 mod.position.y = pos.y;
 mod.position.z = pos.z;
 // mod.lookAt(dir);
 thing.model = mod;
 thing.mood = this.NewMood();
 trails.foos[mod.name] = thing;
};

trails.AnimateTrails = function(scene, elapsed) {
  var killers = [];
  for (var k in this.foos) {
    var model = this.foos[k].model;
    var mood = this.foos[k].mood;
    var sinny = ((this.lifeparam - mood.timeout) / this.lifeparam) * 3.1415;

    model.rotation.x += 0.007 * elapsed; 
    model.rotation.y += 0.007 * elapsed; 
    model.rotation.z += 0.007 * elapsed; 
    model.scale.x = (Math.sin(sinny * 1.0) + .0) * 9.0;
    model.scale.y = (Math.sin(sinny * 1.0) + .0) * 9.0;
    model.scale.z = (Math.sin(sinny * 1.0) + .0) * 9.0;
    mood.timeout -= 1.0 * elapsed;
    if (mood.timeout < 0.0) {
      killers.push(k);
    }
  }
  for (var i = 0; i < killers.length; i += 1) {
    var mod = this.foos[killers[i]].model;
    mod.position.x = 100.0;
    mod.position.y = -1000.0;
    mod.position.z = 100.0;
    this.avail.push(mod);
    delete this.foos[killers[i]];
  }
};
