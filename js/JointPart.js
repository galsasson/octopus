// JointPart.js

var Genome = function()
{
	this.sphereDetail = 32;
	this.cylinderDetail = 32;
	this.tubeRadDetail = 16;
	this.tubeTubularDetail = 32;

	this.innerSpace = 0.5;
	this.jointRadius = 8;
	this.rodRadius = 2;
	this.rodLength = 32;
	this.tubeDiameter = 2;

}

//***************************************************************************//
// JointPart (inherits form Object3D)                                          //
//***************************************************************************//

JointPart = function()
{
	THREE.Object3D.call(this);

	this.genome = new Genome();

	// this.b
}
JointPart.prototype = Object.create(THREE.Object3D.prototype);

JointPart.prototype.build = function()
{
	var sphere = new THREE.SphereGeometry(
		this.genome.jointRadius,			// radius
		this.genome.sphereDetail, 			// width segments
		this.genome.sphereDetail,           // height segments
		0, Math.PI*2,
		0, Math.PI);

	var cylinder = new THREE.CylinderGeometry(
		this.genome.rodRadius,				// top radius
		this.genome.rodRadius,				// bottom radius
		this.genome.rodLength-this.genome.innerSpace, 				// height
		this.genome.cylinderDetail, 		// radius segments
		2, 									// height segments
		false);								// open ended

	var ballMesh = new THREE.Mesh(sphere, resMgr.materials.white);
	this.add(ballMesh);

	var rodMesh = new THREE.Mesh(cylinder, resMgr.materials.white);
	rodMesh.position.y += this.genome.rodLength/2;
	this.add(rodMesh);


	// create other end
	var torus = new THREE.TorusGeometry(
		this.genome.jointRadius + this.genome.tubeDiameter + this.genome.innerSpace,	// radius
		this.genome.tubeDiameter,	// tube diameter
		this.genome.tubeRadDetail,	// radial segments
		this.genome.tubeTubularDetail,	// tubular segments
		Math.PI*1.5);					// arc

	var tubeMesh = new THREE.Mesh(torus, resMgr.materials.white);
	tubeMesh.position.y += this.genome.rodLength + this.genome.jointRadius;
	tubeMesh.rotateZ(Math.PI*0.75);
	this.add(tubeMesh);

	var torus2 = new THREE.TorusGeometry(
	this.genome.jointRadius,	// radius
	this.genome.tubeDiameter,	// tube diameter
	this.genome.tubeRadDetail,	// radial segments
	this.genome.tubeTubularDetail,	// tubular segments
	Math.PI*2);					// arc

	var rightRing = new THREE.Mesh(torus2, resMgr.materials.white);
	rightRing.position.set(tubeMesh.position.x, tubeMesh.position.y, tubeMesh.position.z);
	rightRing.position.x += this.genome.jointRadius - this.genome.tubeDiameter/2;
	rightRing.rotateY(Math.PI/2);
	this.add(rightRing);

	// var leftRing = new THREE.Mesh(torus2, resMgr.materials.white);
	// leftRing.position = tubeMesh.position;
	// leftRing.position.x -= this.genome.jointRadius;
	// this.add(leftRing);



}


JointPart.prototype.animate = function(deltaTimeMS)
{
	console.log("animate not implemented");
}
