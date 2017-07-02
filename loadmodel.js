// Copyright 2017 Sean Brennan
//
// License: Apache 2.0
// https://www.apache.org/licenses/LICENSE-2.0

var frontpage = frontpage = frontpage || {};
frontpage.loader = new THREE.OBJMTLLoader();

frontpage.LoadModel = function(model, material, x, y, z, scale_in) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.scale = scale_in;

  this.group = new THREE.Object3D();
  this.group.matrixAutoUpdate = true;
  this.group.position.x = x;
  this.group.position.y = y;
  this.group.position.z = z;
  var group = this.group;
  var scale = this.scale;

  frontpage.loader.load( "mdl/" + model + ".obj", "mdl/" + material + ".mtl",
      function(object) {
        object.castShadow = true;
        object.receiveShadow = true;
        // Object.positon = relative to group.
        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;
        object.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.receiveShadow = true; node.castShadow = true; } } );
        group.add(object);
     }
  );
  return this;
}
