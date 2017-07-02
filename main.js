// Copyright 2017 Sean Brennan
//
// License: Apache 2.0
// https://www.apache.org/licenses/LICENSE-2.0

// main.js.
// 
// Terminals orbit a central point, many of them.
// Terminals depict top web trafficed sites ranked by Alexia.
// https://en.wikipedia.org/wiki/List_of_most_popular_websites
//   porn sites removed to keep family friendly.  8==D

var container, scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();
var cubes;
var worldWidth = 256, worldDepth = 256;
var worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

init();
animate();

// I have a couple of these... my frontpages don't exploit namespaces yet.
var zerovec = new THREE.Vector3(0, 0, 0);

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(60,
        window.innerWidth / window.innerHeight, 
        1, 20000);
    scene = new THREE.Scene();
  
    // CAMERA!
   var poi;  // point of interest, for lookat.
   var overhead = 2;
   if (overhead == 0) {
    camera.position.x =  68;
    camera.position.y =  14.0
    camera.position.z =  68;
    poi = new THREE.Vector3(0, -32, 0);
   } else if (overhead == 1) {
    var whitelight = new THREE.PointLight(0xffffff, 1, 200, 0.3);
    //var greenlight = new THREE.PointLight(0xffffff, 1, 100);
    whitelight.position.set(0, 100, 0);
    scene.add(whitelight);
    camera.position.x =  16;
    camera.position.y =  198.0
    camera.position.z =  16;
    poi = new THREE.Vector3(0, -32, 0);
   } else if (overhead == 2) {
    camera.position.x =  -max_diameter * 3 + 3;
    camera.position.y =  0;
    camera.position.z =  0;
    poi = new THREE.Vector3(0, 0, -100);
   }
   camera.lookAt(poi);

   // LIGHTS!
   if (false) { // development, look and feel lights.
     var redlight = new THREE.PointLight(0xff0000, 1, 200, 0.3);
     redlight.position.set(-max_diameter * 3 -3, 20, -5);
     scene.add(redlight);
     var bluelight = new THREE.PointLight(0x0000ff, 1, 200, 0.3);
     bluelight.position.set(-max_diameter * 3 + 3, 20, -9);
     scene.add(bluelight);
     var greenlight = new THREE.PointLight(0x00ff00, 1, 200, 0.3);
     greenlight.position.set(-max_diameter * 3, 20, -2);
     scene.add(greenlight);
   }
   var spot1 = new THREE.SpotLight(0xffffff);
   spot1.position.set(-200, 100, -10);
   spot1.target.position.set(zerovec);
   spot1.castShadow = true;
   spot1.shadow.mapSize.width = 1024;
   spot1.shadow.mapSize.height = 1024;
   spot1.shadow.camera.near = 50;
   spot1.shadow.camera.far = 4000;
   spot1.shadow.camera.fov = 30;
   scene.add(spot1);

  // SET!
  var hexes = MakeHexGrid(3, 3);  // floor
  cubes = MakeCubeGrid(worldWidth/ 8, 10, worldDepth/ 8, 0x00ffff);  //terminals
  add_array_to_scene(scene, cubes);
  add_array_to_scene(scene, hexes);

  // PEOPLE!
  var people = MakeCirclePerson(100, 100);
  add_array_to_scene(scene, people);
 
  // RENERER!
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.innerHTML = "";
  
  container.appendChild(renderer.domElement);
  // no stats
  // stats = new Stats();
  // stats.domElemt.style.positon = 'absolute';
  // stats.domElemet.style.top = '0px';
  // container.appendChild(stats.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function add_array_to_scene(s, arr) {
  for (var idx = 0; idx < arr.length; idx++) {
    s.add(arr[idx][0]);
  }
}

function animate()  {
  requestAnimationFrame(animate);  // loop right here.
  render();
  // STATS.UPDATE();
  // other animation routines.
  var elapsed = clock.getElapsedTime();
  MoveCubesAround(cubes, elapsed);
}

function render() {
  renderer.render(scene, camera);
}

