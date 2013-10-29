
function Genome()
{
	// head stuff
	this.headBaseRadius = 10;
	this.headJointsScaleFactor = new THREE.Vector3(0.9, 0.9, 0.9);
	this.headScale = new THREE.Vector3(1, 0.8, 1);

	// tentacles stuff
	this.tentBaseRadius = 3.6;
	this.numTents = 8;
	this.numJoints = 20;
	this.jointScaleVector = new THREE.Vector3(0.92, 0.92, 0.92);
	this.numSpikesPerJoint = 5;
	this.spikesArcStart = 0;
	this.spikesArcEnd = Math.PI*2;
	this.tentColorInc = 1;
	this.tentColorBW = false;
	this.spikeScale = new THREE.Vector3(0.15, 1.5, 0.3);

	// tentacle movement
	this.tentFactor1 = 50.0;
	this.tentFactor2 = 10.0;
	this.tentFactor3 = 10.0;
	this.tentFactor4 = 10.0;

	// eye
	this.eyeRadius = 2.5;
	this.eyeLidRadius = 3;
	this.eyeDetails = 10;
	this.topLidAngle = Math.PI/5;
	this.bottomLidAngle =  -Math.PI/5;


	this.sphereDetail = 25;
	this.cylinderDetail = 25;

}
