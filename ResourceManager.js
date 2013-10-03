
ResourceManager = function()
{
	this.materials = {};
}

ResourceManager.prototype.initMaterials = function()
{
	this.materials.white = new THREE.MeshLambertMaterial( { color: 0x888888, ambient: 0x444444 } );
	this.materials.gray = new THREE.MeshLambertMaterial( { color: 0x222222, ambient: 0x333333 } );
	this.materials.black = new THREE.MeshLambertMaterial( { color: 0x222222, ambient: 0x111111 } );
	this.materials.colors = [];
	for (var i=0; i<12; i++)
	{
		var c = new THREE.Color();
		c = c.setHSL(i/12, 0.5, 0.5);
		var ca = new THREE.Color();
		ca.setHSL(i/12, 0.5, 0.3);
		this.materials.colors[i] = new THREE.MeshLambertMaterial( { color: c, ambient: ca } );
	}

	this.materials.basic = new THREE.MeshBasicMaterial( {color:0xdddddd });
}

ResourceManager.prototype.constructor = ResourceManager;