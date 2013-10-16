/**
 * @author kovacsv / http://kovacsv.hu/
 */
 
THREE.STLExporter = function () {
	this.stlContent = '';
	this.triNum = 0;
	this.stlBinContent = null;
	this.currentBinHead = 0;
};

THREE.STLExporter.prototype = {
	constructor: THREE.STLExporter,
	
	exportScene : function (scene) {
		var meshes = [];

		//this.triangleCount = 0;
		this.currentBinHead = 0;
		var cnt = 0;
		
		var current;
		scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				meshes.push (current);
				if (current.geometry.faces !== undefined) {
				 	cnt += current.geometry.faces.length;
				}
			}
		});
		

		this.triNum = cnt;
		this.stlBinContent = new ArrayBuffer(this.triNum*50+84);
		return this.exportMeshes (meshes);
	},
	
	exportMesh : function (mesh) {
		return this.exportMeshes ([mesh]);
	},
	
	exportMeshes : function (meshes) {
		this.addLineToContent ('solid exported');
		this.setBinHeader('solid exported');
		
		var i, j, mesh, geometry, face, matrix, position;
		var normal, vertex1, vertex2, vertex3;
		for (i = 0; i < meshes.length; i++) {
			mesh = meshes[i];
			
			geometry = mesh.geometry;
			matrix = mesh.matrixWorld;
			position = mesh.position;
			
			for (j = 0; j < geometry.faces.length; j++) {
				face = geometry.faces[j];
				normal = face.normal;
				vertex1 = this.getTransformedPosition (geometry.vertices[face.a], matrix, position);
				vertex2 = this.getTransformedPosition (geometry.vertices[face.b], matrix, position);
				vertex3 = this.getTransformedPosition (geometry.vertices[face.c], matrix, position);
				this.addTriangleToContent (normal, vertex1, vertex2, vertex3);
				this.addTriangleToBinContent(normal, vertex1, vertex2, vertex3);
			}
		};
		
		this.addLineToContent ('endsolid exported');
		return this.stlContent;
	},
	
	clearContent : function ()
	{
		this.stlContent = '';
	},
	
	addLineToContent : function (line) {
		this.stlContent += line + '\n';
	},
	
	addTriangleToContent : function (normal, vertex1, vertex2, vertex3) {
		this.addLineToContent ('\tfacet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z);
		this.addLineToContent ('\t\touter loop');
		this.addLineToContent ('\t\t\tvertex ' + vertex1.x + ' ' + vertex1.y + ' ' + vertex1.z);
		this.addLineToContent ('\t\t\tvertex ' + vertex2.x + ' ' + vertex2.y + ' ' + vertex2.z);
		this.addLineToContent ('\t\t\tvertex ' + vertex3.x + ' ' + vertex3.y + ' ' + vertex3.z);
		this.addLineToContent ('\t\tendloop');
		this.addLineToContent ('\tendfacet');
	},

	addTriangleToBinContent: function(normal, vertex1, vertex2, vertex3) {
//		console.log(this.currentBinHead);
//		console.log(this.stlBinContent.byteLength);

		var faceData = new Uint8Array(50);

		var bNormal = new Float32Array(faceData, 0, 3);
		bNormal[0] = normal.x;
		bNormal[1] = normal.y;
		bNormal[2] = normal.z;

		var bV = new Float32Array(faceData, 12, 3);
		bV[0] = vertex1.x;
		bV[1] = vertex1.y;
		bV[2] = vertex1.z;

		bV = new Float32Array(faceData, 24, 3);
		bV[0] = vertex2.x;
		bV[1] = vertex2.y;
		bV[2] = vertex2.z;

		bV = new Float32Array(faceData, 36, 3);
		bV[0] = vertex3.x;
		bV[1] = vertex3.y;
		bV[2] = vertex3.z;

		memcpy(this.stlBinContent, this.currentBinHead, faceData, 0, 50);
		this.currentBinHead += 50;
	},

	
	getTransformedPosition : function (vertex, matrix, position) {
		var result = vertex.clone ();
		if (matrix !== undefined) {
			result.applyMatrix4 (matrix);
		}
//		if (position !== undefined) {
//			result.add (position);
//		}
		return result;
	},

	// my additions
	setBinHeader : function() {
		var header = new Uint8Array(this.stlBinContent, 0, 80);
		var size = new Uint32Array(this.stlBinContent, 80, 1);
		header[0] = 'g';
		header[1] = 'a';
		header[2] = 'l';
		header[3] = 0;
		size[0] = this.triNum;
		this.currentBinHead = 84;
	},

	sendToServer : function() {
		console.log(this.stlBinContent);
		$.post("save.php", { data: this.stlContent });

	}

};

function memcpy(dst, dstOffset, src, srcOffset, length) {
  var dstU8 = new Uint8Array(dst, dstOffset, length);
  var srcU8 = new Uint8Array(src, srcOffset, length);
  dstU8.set(srcU8);
};
