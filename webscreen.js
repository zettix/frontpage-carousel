var frontpage = frontpage = frontpage || {};

frontpage.WebPage = function(model, x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.group = new THREE.Object3D();
  this.group.matrixAutoUpdate = true;
  this.group.position.x = x;
  this.group.position.y = y;
  this.group.position.z = z;

  var loader = new THREE.OBJMTLLoader();
  var group = this.group;
  loader.load( "mdl/" + model + ".obj", "mdl/" + model + ".mtl",
      function(object) {
        object.castShadow = true;
        object.receiveShadow = true;
        // Object.positon = relative to group.
        object.scale.x = 6.0;
        object.scale.y = 6.0;
        object.scale.z = 6.0;
        object.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.receiveShadow = true; node.castShadow = true; } } );
    group.add(object);
     }
   );

  return this;
}

