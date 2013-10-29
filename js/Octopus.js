
//***************************************************************************//
// Octopus (inherits form Object3D)                                          //
//***************************************************************************//

Octopus = function(genome)
{
	THREE.Object3D.call(this);

	this.genome = genome;
	this.head = null;
	this.tents = [];
	this.tentPosers = [];
	this.feeling = "normal";
	//this.feeling = "scared";
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

Octopus.prototype.setFeeling = function(feeling, delay)
{
	for (var i=0; i<this.tents.length; i++)
	{
		this.tents[i].setFeeling(feeling, delay);
	}	
}

Octopus.prototype.shutEyes = function(delay)
{
	for (var i=0; i<this.head.eyes.length; i++)
	{
		this.head.eyes[i].shut(delay);
	}
}

Octopus.prototype.openEyes = function(delay)
{
	for (var i=0; i<this.head.eyes.length; i++)
	{
		this.head.eyes[i].open(delay);
	}
}

Octopus.prototype.animate = function(deltaTimeMS)
{
	this.head.animate(deltaTimeMS);

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
	this.eyes = [];
	this.eyePosers = [];
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

	var eyeNum = 0;
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

		// add eyes to the third sphere
		if (i>0 && i<6)
		{
			// add eyes
			for (var e=0; e<2; e++)
			{
				// create the eye
				this.eyes[eyeNum] = new OctopusEye(this.genome);
				this.eyes[eyeNum].build();
				this.eyes[eyeNum].position.x = this.genome.headBaseRadius;
				this.eyes[eyeNum].topLid.rotation.z = this.genome.topLidAngle;
				this.eyes[eyeNum].bottomLid.rotation.z = this.genome.bottomLidAngle;

				// place the eye
				this.eyePosers[eyeNum] = new THREE.Object3D();
				this.eyePosers[eyeNum].add(this.eyes[eyeNum]);
				this.eyePosers[eyeNum].rotation.y = -Math.PI/2+0.4 - e*0.8;

				// add the eye to the head
				this.circleMeshes[i].add(this.eyePosers[eyeNum]);
				eyeNum++;
			}

		}

		lastObj.add(this.circleMeshes[i]);
		lastObj = this.circleMeshes[i];
	}
}

OctopusHead.prototype.animate = function(deltaTimeMS)
{
	for (var i=0; i<this.eyes.length; i++)
	{
		this.eyes[i].animate(deltaTimeMS);
	}
}

//***************************************************************************//
// OctopusEye (inherits from Object3D)                                       //
//                                                                           //
// Eye lays on the x axis facing +                                           //
//***************************************************************************//
OctopusEye = function(genome)
{
	THREE.Object3D.call(this);

	this.genome = genome;
	this.ball = new THREE.Object3D();
	this.topLid = new THREE.Object3D();
	this.bottomLid = new THREE.Object3D();

	this.sourceZRotation = this.genome.topLidAngle;
	this.targetZRotation = this.genome.topLidAngle;
	this.startTime = 0;
	this.endTime = 0;

	this.time = 0;
}
OctopusEye.prototype = Object.create(THREE.Object3D.prototype);

OctopusEye.prototype.build = function()
{
	var sphere = new THREE.SphereGeometry(
		this.genome.eyeRadius,
		this.genome.eyeDetails,
		this.genome.eyeDetails);

	var halfSphere = new THREE.SphereGeometry(
		this.genome.eyeLidRadius,
		this.genome.eyeDetails,
		this.genome.eyeDetails,
		0, Math.PI*2,
		0, Math.PI/2);

	// half sphere cup
	var circleGeo = new THREE.CircleGeometry(
		this.genome.eyeLidRadius,
		this.genome.eyeDetails,
		0, Math.PI*2);

	var ballMesh = new THREE.Mesh(sphere, resMgr.materials.gray);
	this.ball.add(ballMesh);
	
	var topLidMesh = new THREE.Mesh(halfSphere, resMgr.materials.black);
	var topLidCupMesh = new THREE.Mesh(circleGeo, resMgr.materials.black);
	topLidCupMesh.rotation.x = Math.PI/2;
	topLidMesh.add(topLidCupMesh);
	this.topLid.add(topLidMesh);



	var bottomLidMesh = new THREE.Mesh(halfSphere, resMgr.materials.black);
	bottomLidMesh.rotation.z = Math.PI;
	var bottomLidCupMesh = new THREE.Mesh(circleGeo, resMgr.materials.black);
	bottomLidCupMesh.rotation.x = Math.PI/2;
	bottomLidMesh.add(bottomLidCupMesh);
	this.bottomLid.add(bottomLidMesh);

	this.ball.add(this.topLid);
	this.ball.add(this.bottomLid);
	this.add(this.ball);
}

OctopusEye.prototype.shut = function(delay)
{
	this.startTime = this.time;
	this.endTime = this.time + delay;
	this.sourceZRotation = this.topLid.rotation.z;
	this.targetZRotation = this.genome.bottomLidAngle;
}

OctopusEye.prototype.open = function(delay)
{
	this.startTime = this.time;
	this.endTime = this.time + delay;
	this.sourceZRotation = this.topLid.rotation.z;
	this.targetZRotation = this.genome.topLidAngle;
}

OctopusEye.prototype.animate = function(deltaTimeMS)
{
	this.time += deltaTimeMS/1000;

	this.topLid.rotation.z = map(this.time,
		this.startTime, this.endTime,
		this.sourceZRotation, this.targetZRotation);
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
	this.feeling = "normal";
	this.startTime = 0;
	this.endTime = 0;
	this.sourceRotationZ = 0;
	this.targetRotationZ = 0;

	// set initial rotation counter
	this.rotationCounter = 0;
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
		var colorMat = resMgr.materials.colors[Math.floor(map((i*this.genome.tentColorInc)%this.genome.numJoints, 0, this.genome.numJoints, 0, 12))];
		var joint = new THREE.Object3D();

		// add a cylinder as the joint arm 
		var cylinderMesh = new THREE.Mesh(cylinder, 
			resMgr.materials.gray );
		cylinderMesh.position.y += cylinder.boundingBox.max.y;
		joint.add(cylinderMesh);

		// add a sphere for the joint top
		var sphereMesh = new THREE.Mesh(sphere, colorMat);
		sphereMesh.position.y += cylinder.boundingBox.max.y*2;
		joint.add(sphereMesh);

		if (i > 0) {
			joint.position.y = cylinder.boundingBox.max.y*2;
			// scale down and rotate the joint
			joint.scale = this.genome.jointScaleVector;
			joint.rotation.z = this.getJointRotation(this.rotationCounter, i);
		}

		if (i >= 0) {
			this.makeSpikes(joint, spikeSphere, resMgr.materials.gray);
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
	var spikesNum = this.genome.numSpikesPerJoint;
	var arcStart = this.genome.spikesArcStart;
	var arcEnd = this.genome.spikesArcEnd;

	joint.spikes = [];
	for (var h=0; h<spikesNum; h++)
	{
		var spikeMesh = new THREE.Mesh(geo, material);
		joint.spikes[h] = new THREE.Object3D();
		joint.add(joint.spikes[h]);
		spikeMesh.scale = this.genome.spikeScale;
		spikeMesh.position.y = this.genome.tentBaseRadius+2;
		joint.spikes[h].add(spikeMesh);
		joint.spikes[h].position.y -= 2;
		joint.spikes[h].rotation.z = Math.PI/6;
		var randVariation = Math.random()*Math.PI/8;
		joint.spikes[h].rotation.y = 
			arcStart + ((arcEnd-arcStart)/spikesNum)*h + randVariation;
	}
}

OctopusTentacle.prototype.animate = function(deltaTimeMS)
{
	var maxRotation = Math.PI/5;
	var maxOffset = Math.PI/225;

	this.rotationCounter += deltaTimeMS/1000;

	for (var i=0; i<this.joints.length; i++)
	{
		var joint = this.joints[i];

		if (i>0) {
			var rot = this.getJointRotation(this.rotationCounter, i);
			joint.rotation.z = rot;
		}

		// do spike z rotation
		var spikeRotZ = map(this.rotationCounter, 
			this.startTime, this.endTime, 
			this.sourceRotationZ, this.targetRotationZ);

		// animate hair on joint
		for (var h=0; h<joint.spikes.length; h++) {
			joint.spikes[h].children[0].rotation.z = spikeRotZ;
		}
	}
}

OctopusTentacle.prototype.setFeeling = function(feeling, delay)
{
	this.feeling = feeling;

	this.startTime = this.rotationCounter;
	this.endTime = this.startTime + delay;

	if (feeling == "normal") {
		this.sourceRotationZ = this.joints[1].spikes[0].children[0].rotation.z;
		this.targetRotationZ = 0;
	} else if (feeling == "scared") {
		this.sourceRotationZ = this.joints[1].spikes[0].children[0].rotation.z;
		this.targetRotationZ = Math.PI/3;
	}
}

OctopusTentacle.prototype.getJointRotation = function(time, jIndex)
{
	return Math.sin(time+(jIndex*(Math.PI/50)))*(Math.PI/10) + Math.sin(jIndex/10)*-Math.PI/10;
}

OctopusTentacle.prototype.getHairRotation = function(time, index)
{
	rot = new THREE.Vector3();
	rot.x = Math.sin(time)*Math.PI;
	return rot;
}
