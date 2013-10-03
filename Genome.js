
function Genome()
{
	// head stuff
	this.headBaseRadius = 20;
	this.headJointsScaleFactor = new THREE.Vector3(0.9, 0.9, 0.9);
	this.headScale = new THREE.Vector3(1, 0.8, 1);
	// tentacles stuff
	this.tentBaseRadius = 4;
	this.numTents = 12;
	this.numJoints = 25;
	this.numSpikesPerJoint = 12;
	this.spikesArcStart = 0;
	this.spikesArcEnd = Math.PI*2;
	this.tentColorInc = 1;

	this.sphereDetail = 20;
	this.cylinderDetail = 20;
}
