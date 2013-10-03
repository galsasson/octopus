
//***************************************************************************//
// Octopus (inherits form Object3D)                                          //
//***************************************************************************//

Octopus = function(genome)
{
	THREE.Object3D.call(this);

	this.genome = genome;
	this.tents = [];
	this.tentPosers = [];
}
Octopus.prototype = Object.create(THREE.Object3D.prototype);

Octopus.prototype.build = function()
{
	// add Octopus head
	this.head = new OctopusHead(this.genome);
	this.head.build();
	this.add(this.head);

	// add tentacles
	var radPerTent = (Math.PI*2)/this.genome.numTents;
	for (var i=0; i<this.genome.numTents; i++)
	{
		this.tents[i] = new OctopusTentacle(i, this.genome);
		this.tents[i].build();

		// rotate tent by 180 degrees, so it will point down
		this.tents[i].rotation.z += Math.PI;
		// move tent to the bottom of the head's surface (a little less, so it be a little inside)
		this.tents[i].position.y-=this.genome.headBaseRadius-2;

		// this will control the tent position on the head surface
		this.tentPosers[i] = new THREE.Object3D();

		this.tentPosers[i].add(this.tents[i]);

		// determines the angle from the bottom center
		this.tentPosers[i].rotation.z = -Math.PI/3;

		this.tentPosers[i].rotation.y = i*radPerTent;

		this.add(this.tentPosers[i]);
	}
}

Octopus.prototype.animate = function(deltaTimeMS)
{
	for (var i=0; i<this.tents.length; i++)
	{
		this.tents[i].animate(deltaTimeMS);
	}
}
//***************************************************************************//
// OctopusHead (inherits from Object3D)                                      //
//***************************************************************************//
OctopusHead = function(genome)
{
	THREE.Object3D.call(this);

	this.genome = genome;
}
OctopusHead.prototype = Object.create(THREE.Object3D.prototype);

OctopusHead.prototype.build = function()
{
	var sphere = new THREE.SphereGeometry(
	this.genome.headBaseRadius,			// radius
	this.genome.sphereDetail, 			// width segments
	this.genome.sphereDetail,           // height segments
	0, Math.PI*2,
	0, Math.PI);

	var headGeo = new THREE.Geometry();
	var headLength = 10;
	this.circleMeshes = [];
	var lastObj = this;
	var moveY = this.genome.headBaseRadius/2;
	for (var i=0; i<headLength; i++)
	{
		this.circleMeshes[i] = new THREE.Mesh(sphere, resMgr.materials.black);
		if (i>0) {
			this.circleMeshes[i].scale = this.genome.headJointsScaleFactor;
			this.circleMeshes[i].position.y += moveY;
			moveY *= this.genome.headJointsScaleFactor.y;
			this.circleMeshes[i].rotation.x = -Math.PI/15;
		}

		lastObj.add(this.circleMeshes[i]);
		lastObj = this.circleMeshes[i];


	}
}


//***************************************************************************//
// OctopusTentacle (inherits from Object3D)                                  //
//                                                                           //
// Tantacle lays on the x axis facing +                                      //
//***************************************************************************//
OctopusTentacle = function(index, genome)
{
	THREE.Object3D.call(this);

	this.genome = genome;
	this.joints = [];

	// set initial rotation counter
	this.rotationCounter = 3;
}
OctopusTentacle.prototype = Object.create(THREE.Object3D.prototype);

OctopusTentacle.prototype.build = function()
{
	var sphere = new THREE.SphereGeometry(
		this.genome.tentBaseRadius, 			// radius
		this.genome.sphereDetail, 				// width segments
		this.genome.sphereDetail);				// height segments

	var cylinder = new THREE.CylinderGeometry(
		this.genome.tentBaseRadius,				// top radius 
		this.genome.tentBaseRadius,				// bottom radius
		this.genome.tentBaseRadius, 			// height
		this.genome.cylinderDetail, 			// radius segments
		2, 										// height segments
		false);									// open ended
	cylinder.computeBoundingBox();

	var spikeSphere = new THREE.SphereGeometry(
			this.genome.tentBaseRadius, 			// radius
			this.genome.sphereDetail, 				// width segments
			this.genome.sphereDetail);				// height segments

	// loop here and create the joints
	var prevObj = this;
	for (var i=0; i<this.genome.numJoints; i++)
	{
		var mat = resMgr.materials.colors[Math.floor(map((i*this.genome.tentColorInc)%this.genome.numJoints, 0, this.genome.numJoints, 0, 12))];
		var joint = new THREE.Object3D();

		// add a cylinder as the joint arm 
		var cylinderMesh = new THREE.Mesh(cylinder, 
			resMgr.materials.gray );
		cylinderMesh.position.y += cylinder.boundingBox.max.y;
		joint.add(cylinderMesh);

		// add a sphere for the joint top
		var sphereMesh = new THREE.Mesh(sphere, mat);
		sphereMesh.position.y += cylinder.boundingBox.max.y*2;
		joint.add(sphereMesh);

		if (i > 0) {
			joint.position.y = cylinder.boundingBox.max.y*2;
			// scale down and rotate the joint
			joint.scale = new THREE.Vector3(0.92, 0.92, 0.92);
			joint.rotation.z = this.getJointRotation(this.rotationCounter, i);
		}

		if (i > 0) {
			this.makeSpikes(joint, spikeSphere, mat);
		}

		// add the new joint to the previous one
		prevObj.add(joint);
		// add a joint reference for the future
		this.joints[i] = joint;

		// remember last joint so we'll know what to attach to
		prevObj = joint;
	}
}

OctopusTentacle.prototype.makeSpikes = function(joint, geo, material)
{
	// build hairs on the tentacle
	var hairs = [];
	var spikesNum = this.genome.numSpikesPerJoint;
	var arcStart = this.genome.spikesArcStart;
	var arcEnd = this.genome.spikesArcEnd;
	for (var h=0; h<spikesNum; h++)
	{
		var hairMesh = new THREE.Mesh(geo, material);//resMgr.materials.gray);//colors[map(h, 0, spikesNum, 0, 12)]);
		hairs[h] = new THREE.Object3D();
		joint.add(hairs[h]);
		hairMesh.scale.x *= 0.2;
		hairMesh.scale.z *= 0.2;
		hairMesh.position.y = this.genome.tentBaseRadius/2;
		hairs[h].add(hairMesh);
		hairs[h].rotation.z = Math.PI/2;
		hairs[h].rotation.y = arcStart + ((arcEnd-arcStart)/spikesNum)*h;		
	}
}

OctopusTentacle.prototype.animate = function(deltaTimeMS)
{
	var maxRotation = Math.PI/5;
	var maxOffset = Math.PI/225;

	this.rotationCounter += deltaTimeMS/800;

	for (var i=1; i<this.joints.length; i++)
	{
		var rot = this.getJointRotation(this.rotationCounter, i);
		this.joints[i].rotation.z = rot;
	}
}

OctopusTentacle.prototype.getJointRotation = function(time, jIndex)
{
	return Math.sin(time/2+(jIndex*(Math.PI/50)))*(Math.PI/10);
}
