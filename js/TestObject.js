TestObject = function()
{
	THREE.Object3D.call(this);
}

TestObject.prototype = Object.create(THREE.Object3D.prototype);

TestObject.prototype.init = function(index)
{
	this.time = -2*Math.PI+index*0.001;

	var sph = new THREE.SphereGeometry(5, 5, 5);
	var mesh = new THREE.Mesh(sph, resMgr.materials.white);
	this.add(mesh);
}

// x = sin(t*cos(t)), 
// y = cos(t*sin(t)), 
// (t: -2pi, 2pi)
//
// url: http://www.wolframalpha.com/input/?i=ParametricPlot[{Sin[t+Cos[t]]%2C+Cos[t+Sin[t]]}%2C+{t%2C+-2pi%2C+2pi}]
TestObject.prototype.update = function()
{
	this.time += 0.02;
	// if (this.time > 2*Math.PI) {
	// 	this.time = -2*Math.PI;
	// }
	var t = this.time;
	this.position.x = Math.sin(t*Math.cos(t))*window.innerWidth;
	this.position.y = Math.cos(t*Math.sin(t))*window.innerHeight;
	this.position.z = Math.cos(t*Math.tan(t))*200;
}
