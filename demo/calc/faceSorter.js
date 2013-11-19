CALC.FaceSorter = (function(spec) {


    this.vertices = spec.vertices;
    this.faces = spec.faces;
    
    this.object3D = spec.host;
    
    var mesh = this.object3D.mesh;
    var geometry = mesh.geometry;

    var v = geometry.vertices, f = geometry.faces, scope = this;
    
    this.oldDirection = null;

    this.centroids = [];
    
    f.forEach(function(v, k) {
        var a = v.a, b = v.b, c = v.c;
        var x = scope.vertices[a].x; //+ scope.vertices[b].x + scope.vertices[c].x;
        var y = scope.vertices[a].y; //+ scope.vertices[b].y + scope.vertices[c].y;
        var z = scope.vertices[a].z; //+ scope.vertices[b].z + scope.vertices[c].z;
        
        scope.centroids.push({
            face: k,
            centroid: [x, y, z]
        });
    });
    
}).extend({
    
    cmpFaces: function(axis) {

        var dot = function(a, b) {
            var r = a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; 
            return r;
        };

        return function(a, b) {
            var diff = dot(a.centroid, axis) - dot(b.centroid, axis);
            return diff === 0 ? 0 :
                diff > 0 ? 1 :
                -1;
        }
    },
    
    
    
    update: function(camera) {
        var camPos, inv, d, order, scope = this;

        this.object3D.mesh.updateMatrix();
        this.object3D.mesh.updateMatrixWorld();

        camera.updateMatrix();
        camera.updateMatrixWorld();

        camPos = camera.matrixWorld.getPosition().clone();

        inv = new THREE.Matrix4();
        inv.getInverse(this.object3D.mesh.matrixWorld);
        
        d = inv.multiplyVector3(camPos);

        var diff = new THREE.Vector3();

        if (this.oldDirection && this.oldGlobal === GLOBAL && d.x === this.oldDirection.x && d.y === this.oldDirection.y && d.z === this.oldDirection.z) {
//            console.log("caching");
        } else {

            this.oldGLobal = GLOBAL;
            
            var cmpFunction = scope.cmpFaces([d.x, d.y, d.z]);

            this.centroids = this.centroids.sort(cmpFunction);

            this.object3D.mesh.geometry.faces = [];

            var geometry = new THREE.Geometry();

            /*this.vertices.forEach(function (v) {
                geometry.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
            });*/
            
            geometry.vertices = this.object3D.mesh.geometry.vertices;

            this.centroids.forEach(function (c, j) {
                var face = scope.faces[c.face];
                if (j > GLOBAL) return;
                geometry.faces.push(new THREE.Face3(face[0], face[1], face[2]));
            });

            
            this.object3D.remove(this.object3D.mesh);
            this.object3D.mesh = new THREE.Mesh(geometry, this.object3D.mesh.material);
            this.object3D.add(this.object3D.mesh);
            
            this.object3D.mesh.doubleSided = true;

            this.oldDirection = d;
        };
        
    }
    
});
