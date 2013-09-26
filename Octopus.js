
//***************************************************************************//
// Octopus (inherits form Object3D)                                            //
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
		this.tents[i].position.y-=this.genome.headRadius-2;

		// this will control the tent position on the head surface
		this.tentPosers[i] = new THREE.Object3D();

		this.tentPosers[i].add(this.tents[i]);
		this.tentPosers[i].rotation.z = -Math.PI/4;

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
// OctopusHead (inherits from Object3D)                                        //
//***************************************************************************//
OctopusHead = function(genome)
{
	THREE.Object3D.call(this);

	this.genome = genome;
}
OctopusHead.prototype = Object.create(THREE.Object3D.prototype);

OctopusHead.prototype.build = function()
{
	var sphere = new THREE.SphereGeometry(this.genome.headRadius, this.genome.sphereDetail, 
		this.genome.sphereDetail);
	var mat = new THREE.MeshLambertMaterial( { color: 0x888888, ambient: 0xaaaaaa } );
	// var mat = new THREE.MeshNormalMaterial();

	this.add(new THREE.Mesh(sphere, mat));
}


//***************************************************************************//
// OctopusTentacle (inherits from Object3D)                                    //
//***************************************************************************//
OctopusTentacle = function(index, genome)
{
	THREE.Object3D.call(this);

	this.genome = genome;
	this.joints = [];

	this.rotationCounter = 0;
}
OctopusTentacle.prototype = Object.create(THREE.Object3D.prototype);

OctopusTentacle.prototype.build = function()
{
	var sphere = new THREE.SphereGeometry(5, this.genome.sphereDetail, 
		this.genome.sphereDetail);
	var cylinder = new THREE.CylinderGeometry(5, 5, 5, this.genome.cylinderDetail, 
		2, false);
	cylinder.computeBoundingBox();
	var mat = new THREE.MeshLambertMaterial( { color: 0x888888, ambient: 0x222222 } );
	//var mat = new THREE.MeshNormalMaterial();

	// loop here and create joints
	var prevObj = this;
	for (var i=0; i<this.genome.numJoints; i++)
	{
		var joint = new THREE.Object3D();

		// add a cylinder as the joint arm 
		var cylinderMesh = new THREE.Mesh(cylinder, mat);
		cylinderMesh.position.y += cylinder.boundingBox.max.y;
		joint.add(cylinderMesh);

		// add a sphere for the joint top
		var sphereMesh = new THREE.Mesh(sphere, mat);
		sphereMesh.position.y += cylinder.boundingBox.max.y*2;
		joint.add(sphereMesh);

		if (i!=0) {
			joint.position.y = cylinder.boundingBox.max.y*2;
			// scale down and rotate the joint
			joint.scale = new THREE.Vector3(0.92, 0.92, 0.92);
			joint.rotation.z += -Math.PI/20;
		}

		// add the new joint to the previous one
		prevObj.add(joint);
		// add a joint reference for the future
		this.joints[i] = joint;

		// remember last joint so we'll know what to attach to
		prevObj = joint;
	}
}

OctopusTentacle.prototype.animate = function(deltaTimeMS)
{
	var maxRotation = Math.PI/5;
	var maxOffset = Math.PI/225;

	this.rotationCounter += deltaTimeMS/800;

	for (var i=1; i<this.joints.length; i++)
	{
		var rot = Math.sin(this.rotationCounter+(i*(Math.PI/20)))*(Math.PI/10);
		this.joints[i].rotation.z = rot;
	}
}
