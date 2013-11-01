
function Genome()
{
	// G E O M E T R Y

	// head stuff
	this.headBaseRadius = 10;
	this.headJointsScaleFactor = new THREE.Vector3(0.9, 0.9, 0.9);

	// tentacles stuff
	this.tentBaseRadius = 3.6;
	this.numTents = 8;
	this.numJoints = 20;
	this.jointScaleVector = new THREE.Vector3(0.92, 0.92, 0.92);
	this.numSpikesPerJoint = 0;
	this.spikesArcStart = 0;
	this.spikesArcEnd = Math.PI*2;
	this.tentColorInc = 1;
	this.tentColorBW = false;
	this.spikeScale = new THREE.Vector3(0.15, 1.5, 0.3);

	// eye
	this.eyeRadius = 2.5;
	this.eyeLidRadius = 3;
	this.topLidAngle = Math.PI/5;
	this.bottomLidAngle =  -Math.PI/5;

	// geometry details
	this.sphereDetail = 25;
	this.cylinderDetail = 25;
	this.eyeDetails = 10;

	// A N I M A T I O N

	// tentacle movement
	this.tentFactor1 = 50.0;
	this.tentFactor2 = 10.0;
	this.tentFactor3 = 10.0;
	this.tentFactor4 = 10.0;


	this.randomize = function()
	{
		this.readBaseRadius = 5 + 30*Math.random();
		this.headJointsScaleFactor.set(0.5 + 0.5*Math.random(), 0.5 + 0.5*Math.random(), 0.5 + 0.5*Math.random());
	}
}

