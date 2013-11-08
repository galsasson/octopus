

TexturedSphere = function()
{
	THREE.Object3D.call(this);

}
TexturedSphere.prototype = Object.create(THREE.Object3D.prototype);

TexturedSphere.prototype.build = function()
{
	var r = 20;
	var sphere = new THREE.SphereGeometry(
	r,			// radius
	32, 			// width segments
	32,           // height segments
	0, Math.PI*2,
	0, Math.PI);

	var texEl = new CircleTexture(2);
	texEl.build();
	texEl.position.y += r - 1.2;

	var mesh = new THREE.Mesh(sphere, resMgr.materials.white);//new THREE.MeshNormalMaterial());
	this.add(mesh);

	// add box on every vertex2
	// var box = new THREE.CubeGeometry( 1, 1, 1, 2, 2, 2);
	// for (var i=0; i<sphere.vertices.length; i++)
	// {
	// 	var b = new THREE.Mesh(box);
	// 	b.position.set(sphere.vertices[i].x, sphere.vertices[i].y, sphere.vertices[i].z);
	// 	this.add(b);		
	// }
	// return;

	// // add box on every face
	// var cents = this.getFaceCenters(mesh);
	// console.log("number of faces = " + cents.length);
	// var box = new THREE.CubeGeometry( 1, 1, 1, 2, 2, 2);
	// for (var i=0; i<cents.length; i++)
	// {
	// 	var b = new THREE.Mesh(box);
	// 	b.position.set(cents[i].x, cents[i].y, cents[i].z);
	// 	this.add(b);

	// }

	// return;
	// add texture elements

	for (var y=0; y<100; y++)
	{
		var poser = new THREE.Object3D();
		poser.add(texEl.clone());
		poser.rotation.z = Math.random() * Math.PI;//z*rotZ;
		poser.rotation.y = Math.random() * Math.PI*2;//y*rotY;
		this.add(poser);
	}
}

TexturedSphere.prototype.getFaceCenters = function(mesh)
{
	if (!(mesh instanceof THREE.Mesh)) {
		console.log("only THREE.Mesh is supported!");
		return null;
	}

	var geometry = mesh.geometry;
	var centers = [];

	for (var i=0; i<geometry.faces.length; i++)
	{
		var face = geometry.faces[i];
		var v1 = geometry.vertices[face.a];
		var v2 = geometry.vertices[face.b];
		var v3 = geometry.vertices[face.c];
		centers[i] = new THREE.Vector3((v1.x + v2.x + v3.x) / 3,
			(v1.y + v2.y + v3.y) / 3, (v1.z + v2.z + v3.z) / 3);
	}

	return centers;
}

CircleTexture = function(radius)
{
	THREE.Object3D.call(this);

	this.radius = radius;
}
CircleTexture.prototype = Object.create(THREE.Object3D.prototype);

CircleTexture.prototype.build = function()
{
	var sphere = new THREE.SphereGeometry(
	this.radius,			// radius
	12, 			// width segments
	10,           // height segments
	0, Math.PI*2,
	0, Math.PI);

	var box = new THREE.CubeGeometry( 2*this.radius, this.radius, 2*this.radius, 2, 2, 2);

	// step 1 (subtract)
	var mesh1 = new THREE.Mesh(sphere);
	var mesh2 = new THREE.Mesh(sphere);
	mesh2.position.set(0, 1.6*this.radius, 0);

	var bsp1 = new ThreeBSP(mesh1);
	var resultBsp = bsp1.subtract(new ThreeBSP(mesh2));

	// step 2 (union)
	var mesh3 = new THREE.Mesh(sphere);
	mesh3.position.set(0, 0.6*this.radius, 0);
	mesh3.scale.set(0.2, 0.2, 0.2);
	resultBsp = resultBsp.union(new ThreeBSP(mesh3));

	// step 3 (subtract)
	var mesh4 = new THREE.Mesh(box);
	mesh4.position.set(0, -this.radius/2, 0);
	resultBsp = resultBsp.subtract(new ThreeBSP(mesh4));

	var resultMesh = resultBsp.toMesh(resMgr.materials.gray);
	this.add(resultMesh);
}