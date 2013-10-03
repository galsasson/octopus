
ResourceManager = function()
{
	this.materials = [];
}

ResourceManager.prototype.initMaterials = function()
{
	// white
	this.materials[0] = new THREE.MeshLambertMaterial( { color: 0x888888, ambient: 0x444444 } );
	// black
	this.materials[1] = new THREE.MeshLambertMaterial( { color: 0x222222, ambient: 0x111111 } );
	// colors
	for (var i=2; i<14; i++)
	{
		var c = new THREE.Color();
		c.setHSL(Math.PI*2/Math.PI*2/12*i, 1, 1);
		this.materials[i] = new THREE.MeshLambertMaterial( { color: c, ambient: 0x888888 } );
	}
}

ResourceManager.prototype.constructor = ResourceManager;
