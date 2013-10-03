
function Genome()
{
	// head stuff
	this.headRadius = 30;

	// tentacles stuff
	this.tentBaseRadius = 5;
	this.numTents = 8;
	this.numJoints = 25;
	this.numSpikesPerJoint = 12;
	this.spikesArcStart = 0;
	this.spikesArcEnd = Math.PI*2;
	this.tentColorInc = 1;

	this.sphereDetail = 20;
	this.cylinderDetail = 20;
}
