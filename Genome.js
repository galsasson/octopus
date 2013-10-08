
function Genome()
{
	// head stuff
	this.headBaseRadius = 10;
	this.headJointsScaleFactor = new THREE.Vector3(0.9, 0.9, 0.9);
	this.headScale = new THREE.Vector3(1, 0.8, 1);

	// tentacles stuff
	this.tentBaseRadius = 3;
	this.numTents = 6;
	this.numJoints = 20;
	this.jointScaleVector = new THREE.Vector3(0.92, 0.92, 0.92);
	this.numSpikesPerJoint = 12;
	this.spikesArcStart = 0;
	this.spikesArcEnd = Math.PI*2;
	this.tentColorInc = 1;
	this.tentColorBW = false;
	this.spikeScale = new THREE.Vector3(0.15, 1.5, 0.3);

	// eye
	this.eyeRadius = 2;
	this.eyeLidRadius = 3;
	this.eyeDetails = 10;
	this.topLidAngle = Math.PI/5;
	this.bottomLidAngle =  -Math.PI/5


	this.sphereDetail = 15;
	this.cylinderDetail = 15;

}
