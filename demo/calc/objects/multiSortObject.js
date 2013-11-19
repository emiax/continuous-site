'use strict';
/*global CALC, THREE*/

/*
  geometries is an array 6 differently sorted geometries.
  0 : ascending x
  1 : ascending y
  2 : ascending z
  3 : descending x
  4 : descending y
  5 : descending z
*/

(CALC.MultiSortObject = function (geometries, material) {
    var g, n,  mesh;
    
    if (!geometries && !material) {
        return;
    }

    THREE.Object3D.call(this);
    
    this.meshes = [];
    
    if (geometries && material) {
        n = geometries.length;
        for (g = 0; g < n; g++) {
            mesh = new THREE.Mesh(geometries[g], material);
            mesh.doubleSided = true;
            this.meshes.push(mesh);
        }
        
        this.material = material;
        this.currentIndex = 0;
        this.currentChild = this.meshes[0];
        this.add(this.meshes[0]);
    }
}).extends(THREE.Object3D, {
    getBoundingBox: function (i) {
        var geo = this.meshes[0].geometry;
        if (!geo.boundingBox) {
            geo.computeBoundingBox();
        }
        return geo.boundingBox;
    },

    replaceMesh: function (i) {
        if (this.currentIndex !== i) {
            this.remove(this.currentChild);
            this.currentIndex = i;
            this.currentChild = this.meshes[i];
            this.add(this.currentChild);
        }
    },

    replaceMaterial: function(material) {
        var m, n;
        for (g = 0, n = this.meshes.length; g < n; g++) {
            this.meshes[g].material = material;
        }
    },
    
    prepareFrame: function (renderer) {
        var camera = renderer.camera, camPos, inv, d;

        this.updateMatrix();
        this.updateMatrixWorld();

        camera.updateMatrix();
        camera.updateMatrixWorld();

        camPos = camera.matrixWorld.getPosition().clone();

        inv = new THREE.Matrix4();
        inv.getInverse(this.matrixWorld);

        d = inv.multiplyVector3(camPos);

        this.replaceMesh(
            (Math.abs(d.x) > Math.abs(d.y)
                ? (Math.abs(d.x) > Math.abs(d.z)
                   ? (d.x > 0 ? 0 : 3)
                   : (d.z > 0 ? 2 : 5)
                  )
                : (Math.abs(d.y) > Math.abs(d.z)
                   ? (d.y > 0 ? 1 : 4)
                   : (d.z > 0 ? 2 : 5)
                  )
            )
        );
    }

});
