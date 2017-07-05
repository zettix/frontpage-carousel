// terminals.js
// Copyright 2017 Sean Brennan
//
// License: Apache 2.0
// https://www.apache.org/licenses/LICENSE-2.0

function tr(x) {
  return x * 3.0;
}

// Make ring of terminals
var max_diameter = 20.0;
var step_diameter = 2.0;
var theta_step;
var lookatme = new THREE.Vector3(0, 0, 0);

var terminalTextures = [
        "Bing_logo_-2016-.svg.png",
        "2015_MSN_logo.svg.png",
        "231px-Baidu.svg.png",
        "Ok_new_logo.png",
        "Tumblr_Logo.svg.png",
        "Wikipedia-logo-v2.svg.png",
        "VK.com-logo.svg.png",
        "Sohu_logo.png",
        "Sinalogo1.png",
        "Apple_logo_black.svg.png",
        "Netflix_2015_logo.svg.png",
        "Tencent_QQ.png",
        "Twitch_logo_-wordmark_only-.svg.png",
        "Tmall-logo_2.png",
        "Instagram_logo.svg.png",
        "LinkedIn_Logo_2013.svg.png",
        "Microsoft_logo_-2012-.svg.png",
        "JD_logo.png",
        "WordPress_blue_logo.svg.png",
        "Google_2015_logo.svg.png",
        "150px-Imgur_logo.svg.png",
        "Blogger_icon_2017.svg.png",
        "300px-EBay_logo.svg.png",
        "1000px-Yahoo!_logo.svg.png",
        "Twitter_bird_logo_2012.svg.png",
        "Taobao_Logo.svg.png",
        "Stack_Overflow_logo.svg.png",
        "Facebook_New_Logo_-2015-.svg.png",
        "Reddit_logo_and_wordmark.svg.png",
        "YouTube-logo-full_color.png",
        "Amazon_logo_plain.svg.png",
        "Sina_Weibo.svg.png",
        "Yandex_logo_en.svg.png",
    ]


function SetCubePosition(diam, theta, cube) {
  var ix, iy, iz;
  iy = 0;
  ix = Math.cos(theta) * diam;
  iz = Math.sin(theta) * diam;
  cube.position.x =  tr(ix);
  cube.position.y =  tr(iy);
  cube.position.z =  tr(iz);
  cube.lookAt(lookatme);
}


function MakeCubeGrid(dimx, dimy, dimz, colorin) {
  var cubes = [];
  var diam, theta,ix, iy, iz;
  THREE.ImageUtils.crossOrigin = '';

  var numtextures = terminalTextures.length;
  iy = 0;
  diam = max_diameter;
  theta_step =  6.28 / numtextures;
  var start_theta = Math.random();
  var textcounter = 0;
  for (theta = start_theta; theta < 6.28 + start_theta; theta += theta_step) {
      //no perturbs. var theta2 = theta + (Math.random() - 0.5) * 0.06234;
      var theta2 = theta;
      ix = Math.cos(theta2) * diam;
      iz = Math.sin(theta2) * diam;
      var webscrn = new frontpage.LoadModel("webscreen", "M_" + terminalTextures[textcounter], 0, 0, 0, 6); // function w/ group.
      textcounter += 1;
      if (textcounter >= numtextures) {
        textcounter = 0;
      }
      
      var webscrn_clone = webscrn.group;

      var boxdim = tr(1) * 1.6;
      var box = new THREE.BoxGeometry(boxdim * 1.618, boxdim , boxdim * 0.1);
      var mat = new THREE.MeshLambertMaterial({color: colorin, transparent: true, opacity: .5}) //
      // no: mat.wireframe = true;
      var mesh = new THREE.Mesh(box, mat);
      webscrn_clone.add(mesh);
      //sig: PointLight( color, intensity=1 , distance=0 forever, decay = 1 )
      var whitelight = new THREE.PointLight(0xffffff, 10, 12);
      whitelight.position.set(0, 7, 4);
      webscrn_clone.add(whitelight);

      webscrn_clone.applyMatrix(new THREE.Matrix4().makeTranslation(tr(ix), tr(iy),tr(iz)));
      SetCubePosition(diam, theta2, webscrn_clone);
      cubes.push([webscrn_clone, diam, theta2]);
  }
  return cubes;
}

function MakeHexGrid(dimx, dimy) {
  dimx = 7;
  dimy = 6;
  var yoff = -4;
  var xoff = 110;
  var zoff = 110;
  var cubes = [];
  var separation = 35;  // mag = 2, can vary floor tiles here.
  var model = "hexpad";
        for (var y = 0; y < dimy ; y += 1) {
          for (var x = 0; x < dimx ; x += 1) {
            var doggie = new frontpage.LoadModel(model, model, 0, 0, 0, 2);
            var object = doggie.group;
            var halfie = 0;
                 
            if (x % 2 == 1) {
              halfie = separation / 2;
            }
            object.position.set(x * separation * 0.866 - xoff, yoff, y * separation - zoff + halfie);
            object.rotateY(3.1415 * 0.5);
            //no: object.mat.wireframe = true;
            cubes.push([object]);
          }
        }
  return cubes;
}

function MoveCubesAround(cubes, elap) {
  for (var i = 0; i < cubes.length; i++) {
    var theta = cubes[i][2];
    var diam = cubes[i][1];
    var cube = cubes[i][0];
    var theta_step =  0.06 * elap;
    theta -= theta_step;
    if (theta < 0.0) {
      theta += 6.283;
    }
    SetCubePosition(diam, theta, cube);
    //not needed: cubes[i].geometry.verticesNeedUpdate;
  }
}
