function getMeshName(inputName) {
    for (var meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
        if (meshes[meshIndex].name == inputName) {
            return meshes[meshIndex];
        }
    }
    return meshes[0];
}

function getMeshIndex(index) {
	try{
		return meshes[index];
	}
	catch{
		return null;
	}
}


function calculateSurfaceNormals(mesh){
	let numFaces = mesh.Faces.length;
	for (let f = 0; f < numFaces; f++){
		let thisFace = mesh.Faces[f];
		let vertA = mesh.Vertices[thisFace.A];
		let vertB = mesh.Vertices[thisFace.B];
		let vertC = mesh.Vertices[thisFace.C];		
		
		let U = vertB.subtract(vertA);
		let V = vertC.subtract(vertA);
		
		thisFace.NX = (U.y * V.z) - (U.z * V.y);
		thisFace.NY = (U.z * V.x) - (U.x * V.z);
		thisFace.NZ = (U.x * V.y) - (U.y * V.x);	
	}
}

function newEmptyMesh() {
    // DOES NOT PUSH THE MESH, YOU MUST DO IT MANUALLY OR INSERT IT AT A SPECIFIC SPOT
    var thisMesh;
    thisMesh = new SoftEngine.Mesh("", 0, 0, black, black, 0);
    thisMesh.Position = new BABYLON.Vector3(0, 0, 0);
    thisMesh.Rotation = new BABYLON.Vector3(0, 0, 0);
    return thisMesh;
}



function newBox(name, xWidth, yWidth, zWidth, faceColor, wireColor = black) {
    var thisBox;
    thisBox = new SoftEngine.Mesh(name, 8, 12, faceColor, wireColor);

    var xHalfWidth = xWidth / 2;
	var yHalfWidth = yWidth / 2;
	var zHalfWidth = zWidth / 2;
    thisBox.Vertices[0] = new BABYLON.Vector3(-xHalfWidth, yHalfWidth, zHalfWidth);
    thisBox.Vertices[1] = new BABYLON.Vector3(xHalfWidth, yHalfWidth, zHalfWidth);
    thisBox.Vertices[2] = new BABYLON.Vector3(-xHalfWidth, -yHalfWidth, zHalfWidth);
    thisBox.Vertices[3] = new BABYLON.Vector3(xHalfWidth, -yHalfWidth, zHalfWidth);
    thisBox.Vertices[4] = new BABYLON.Vector3(-xHalfWidth, yHalfWidth, -zHalfWidth);
    thisBox.Vertices[5] = new BABYLON.Vector3(xHalfWidth, yHalfWidth, -zHalfWidth);
    thisBox.Vertices[6] = new BABYLON.Vector3(xHalfWidth, -yHalfWidth, -zHalfWidth);
    thisBox.Vertices[7] = new BABYLON.Vector3(-xHalfWidth, -yHalfWidth, -zHalfWidth);

    thisBox.Faces[0] = {
        A: 0,
        B: 1,
        C: 2,

        NX: 0,
        NY: 0,
        NZ: 1
    };
    thisBox.Faces[1] = {
        A: 1,
        B: 2,
        C: 3,

        NX: 0,
        NY: 0,
        NZ: 1
    };
    thisBox.Faces[2] = {
        A: 1,
        B: 3,
        C: 6,

        NX: 1,
        NY: 0,
        NZ: 0
    };
    thisBox.Faces[3] = {
        A: 1,
        B: 5,
        C: 6,

        NX: 1,
        NY: 0,
        NZ: 0
    };
    thisBox.Faces[4] = {
        A: 0,
        B: 1,
        C: 4,

        NX: 0,
        NY: 1,
        NZ: 0
    };
    thisBox.Faces[5] = {
        A: 1,
        B: 4,
        C: 5,

        NX: 0,
        NY: 1,
        NZ: 0
    };
    thisBox.Faces[6] = {
        A: 2,
        B: 3,
        C: 7,

        NX: 0,
        NY: -1,
        NZ: 0
    };
    thisBox.Faces[7] = {
        A: 3,
        B: 6,
        C: 7,

        NX: 0,
        NY: -1,
        NZ: 0
    };
    thisBox.Faces[8] = {
        A: 0,
        B: 2,
        C: 7,

        NX: -1,
        NY: 0,
        NZ: 0
    };
    thisBox.Faces[9] = {
        A: 0,
        B: 4,
        C: 7,

        NX: -1,
        NY: 0,
        NZ: 0
    };
    thisBox.Faces[10] = {
        A: 4,
        B: 5,
        C: 6,

        NX: 0,
        NY: 0,
        NZ: -1
    };
    thisBox.Faces[11] = {
        A: 4,
        B: 6,
        C: 7,

        NX: 0,
        NY: 0,
        NZ: -1
    };

    thisBox.Position = new BABYLON.Vector3(0, 0, 0);
    thisBox.Rotation = new BABYLON.Vector3(0, 0, 0);

    meshes.push(thisBox);
    return thisBox;
}


function newFace(name, axis, sign, faceColor, wireColor = black){
    var thisFace;
    thisFace = new SoftEngine.Mesh(name, 4, 2, faceColor, wireColor, 0);
    
    let offset = 0.5 * sign;
  
    if(axis == 'x'){
    thisFace.Vertices[0] = new BABYLON.Vector3(offset, offset, offset);
    thisFace.Vertices[1] = new BABYLON.Vector3(offset, -offset, offset);
    thisFace.Vertices[2] = new BABYLON.Vector3(offset, -offset, -offset);
    thisFace.Vertices[3] = new BABYLON.Vector3(offset, offset, -offset);

    thisFace.Faces[0] = {
        A: 0,
        B: 1,
        C: 2,

        NX: sign,
        NY: 0,
        NZ: 0
    };
    thisFace.Faces[1] = {
        A: 0,
        B: 3,
        C: 2,

        NX: sign,
        NY: 0,
        NZ: 0
    };
    }
  
    else if(axis == 'y'){
    thisFace.Vertices[0] = new BABYLON.Vector3(-offset, offset, offset);
    thisFace.Vertices[1] = new BABYLON.Vector3(offset, offset, offset);
    thisFace.Vertices[2] = new BABYLON.Vector3(offset, offset, -offset);
    thisFace.Vertices[3] = new BABYLON.Vector3(-offset, offset, -offset);

    thisFace.Faces[0] = {
        A: 0,
        B: 1,
        C: 2,

        NX: 0,
        NY: sign,
        NZ: 0
    };
    thisFace.Faces[1] = {
        A: 0,
        B: 3,
        C: 2,

        NX: 0,
        NY: sign,
        NZ: 0
    };
    }
  
    else if(axis == 'z'){
    thisFace.Vertices[0] = new BABYLON.Vector3(-offset, -offset, offset);
    thisFace.Vertices[1] = new BABYLON.Vector3(offset, -offset, offset);
    thisFace.Vertices[2] = new BABYLON.Vector3(offset, offset, offset);
    thisFace.Vertices[3] = new BABYLON.Vector3(-offset, offset, offset);

    thisFace.Faces[0] = {
        A: 0,
        B: 1,
        C: 2,

        NX: 0,
        NY: 0,
        NZ: sign
    };
    thisFace.Faces[1] = {
        A: 0,
        B: 3,
        C: 2,

        NX: 0,
        NY: 0,
        NZ: sign
    };
    }
  
    meshes.push(thisFace);
    return thisFace;
}


function newCube(name, width, faceColor, wireColor = black) {
    var thisCube;
    thisCube = new SoftEngine.Mesh(name, 8, 12, faceColor, wireColor);

    var halfWidth = width / 2;
    thisCube.Vertices[0] = new BABYLON.Vector3(-halfWidth, halfWidth, halfWidth);
    thisCube.Vertices[1] = new BABYLON.Vector3(halfWidth, halfWidth, halfWidth);
    thisCube.Vertices[2] = new BABYLON.Vector3(-halfWidth, -halfWidth, halfWidth);
    thisCube.Vertices[3] = new BABYLON.Vector3(halfWidth, -halfWidth, halfWidth);
    thisCube.Vertices[4] = new BABYLON.Vector3(-halfWidth, halfWidth, -halfWidth);
    thisCube.Vertices[5] = new BABYLON.Vector3(halfWidth, halfWidth, -halfWidth);
    thisCube.Vertices[6] = new BABYLON.Vector3(halfWidth, -halfWidth, -halfWidth);
    thisCube.Vertices[7] = new BABYLON.Vector3(-halfWidth, -halfWidth, -halfWidth);

    thisCube.Faces[0] = {
        A: 0,
        B: 1,
        C: 2,

        NX: 0,
        NY: 0,
        NZ: 1
    };
    thisCube.Faces[1] = {
        A: 1,
        B: 2,
        C: 3,

        NX: 0,
        NY: 0,
        NZ: 1
    };
    thisCube.Faces[2] = {
        A: 1,
        B: 3,
        C: 6,

        NX: 1,
        NY: 0,
        NZ: 0
    };
    thisCube.Faces[3] = {
        A: 1,
        B: 5,
        C: 6,

        NX: 1,
        NY: 0,
        NZ: 0
    };
    thisCube.Faces[4] = {
        A: 0,
        B: 1,
        C: 4,

        NX: 0,
        NY: 1,
        NZ: 0
    };
    thisCube.Faces[5] = {
        A: 1,
        B: 4,
        C: 5,

        NX: 0,
        NY: 1,
        NZ: 0
    };
    thisCube.Faces[6] = {
        A: 2,
        B: 3,
        C: 7,

        NX: 0,
        NY: -1,
        NZ: 0
    };
    thisCube.Faces[7] = {
        A: 3,
        B: 6,
        C: 7,

        NX: 0,
        NY: -1,
        NZ: 0
    };
    thisCube.Faces[8] = {
        A: 0,
        B: 2,
        C: 7,

        NX: -1,
        NY: 0,
        NZ: 0
    };
    thisCube.Faces[9] = {
        A: 0,
        B: 4,
        C: 7,

        NX: -1,
        NY: 0,
        NZ: 0
    };
    thisCube.Faces[10] = {
        A: 4,
        B: 5,
        C: 6,

        NX: 0,
        NY: 0,
        NZ: -1
    };
    thisCube.Faces[11] = {
        A: 4,
        B: 6,
        C: 7,

        NX: 0,
        NY: 0,
        NZ: -1
    };

    thisCube.Position = new BABYLON.Vector3(0, 0, 0);
    thisCube.Rotation = new BABYLON.Vector3(0, 0, 0);

    meshes.push(thisCube);
    return thisCube;
}


function newIcosahedron(name, radius, faceColor, pushMesh = true, wireColor = black) {
    var thisIcos;
    thisIcos = new SoftEngine.Mesh(name, 12, 20, faceColor, wireColor);

	let a = (1 + Math.sqrt(5)) / 2;
	let b = radius / Math.sqrt(1 + (a*a));
	
    thisIcos.Vertices[0] = new BABYLON.Vector3(a, 1, 0).scale(b);
    thisIcos.Vertices[1] = new BABYLON.Vector3(-a, 1, 0).scale(b);
    thisIcos.Vertices[2] = new BABYLON.Vector3(a, -1, 0).scale(b);
    thisIcos.Vertices[3] = new BABYLON.Vector3(-a, -1, 0).scale(b);
    thisIcos.Vertices[3] = new BABYLON.Vector3(-a, -1, 0).scale(b);
    thisIcos.Vertices[4] = new BABYLON.Vector3(1, 0, a).scale(b);
    thisIcos.Vertices[5] = new BABYLON.Vector3(1, 0, -a).scale(b);
    thisIcos.Vertices[6] = new BABYLON.Vector3(-1, 0, a).scale(b);
    thisIcos.Vertices[7] = new BABYLON.Vector3(-1, 0, -a).scale(b);
	thisIcos.Vertices[8] = new BABYLON.Vector3(0, a, 1).scale(b);
    thisIcos.Vertices[9] = new BABYLON.Vector3(0, -a, 1).scale(b);
    thisIcos.Vertices[10] = new BABYLON.Vector3(0, a, -1).scale(b);
	thisIcos.Vertices[11] = new BABYLON.Vector3(0, -a, -1).scale(b);

    thisIcos.Faces[0] = {
        A: 0,
        B: 8,
        C: 4,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[1] = {
        A: 0,
        B: 5,
        C: 10,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[2] = {
        A: 2,
        B: 4,
        C: 9,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[3] = {
        A: 2,
        B: 11,
        C: 5,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[4] = {
        A: 1,
        B: 6,
        C: 8,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[5] = {
        A: 1,
        B: 10,
        C: 7,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[6] = {
        A: 3,
        B: 9,
        C: 6,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[7] = {
        A: 3,
        B: 7,
        C: 11,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[8] = {
        A: 0,
        B: 10,
        C: 8,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[9] = {
        A: 1,
        B: 8,
        C: 10,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[10] = {
        A: 2,
        B: 9,
        C: 11,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[11] = {
        A: 9,
        B: 3,
        C: 11,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[12] = {
        A: 4,
        B: 2,
        C: 0,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[13] = {
        A: 5,
        B: 0,
        C: 2,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[14] = {
        A: 6,
        B: 1,
        C: 3,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[15] = {
        A: 7,
        B: 3,
        C: 1,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[16] = {
        A: 8,
        B: 6,
        C: 4,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[17] = {
        A: 9,
        B: 4,
        C: 6,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[18] = {
        A: 10,
        B: 5,
        C: 7,

        NX: 0,
        NY: 1,
        NZ: 0
    };
	thisIcos.Faces[19] = {
        A: 11,
        B: 7,
        C: 5,

        NX: 0,
        NY: 1,
        NZ: 0
    };

	calculateSurfaceNormals(thisIcos);
	
    thisIcos.Position = new BABYLON.Vector3(0, 0, 0);
    thisIcos.Rotation = new BABYLON.Vector3(0, 0, 0);
	
	if (pushMesh){
		meshes.push(thisIcos);
	}
    
    return thisIcos;
}

function newSphere(name, radius, tesselations, faceColor, wireColor = black){
	let thisSphere = newIcosahedron(name, radius, faceColor, false);
	
	for (let t = 1; t <= tesselations; t++){
		let numFaces = thisSphere.Faces.length;
		
		for (let f = 0; f < numFaces; f++){
			let v0 = thisSphere.Vertices[thisSphere.Faces[f].A];
			let v1 = thisSphere.Vertices[thisSphere.Faces[f].B];
			let v2 = thisSphere.Vertices[thisSphere.Faces[f].C];
			
			let v3 = v0.add(v1);
			v3.normalize();
			v3 = v3.scale(radius);
			
			let v4 = v1.add(v2);
			v4.normalize();
			v4 = v4.scale(radius);
			
			let v5 = v2.add(v0);
			v5.normalize();
			v5 = v5.scale(radius);
			
			
			let vertIndex = thisSphere.Vertices.length;
			thisSphere.Vertices.push(v0);
			thisSphere.Vertices.push(v1);
			thisSphere.Vertices.push(v2);
			thisSphere.Vertices.push(v3);
			thisSphere.Vertices.push(v4);
			thisSphere.Vertices.push(v5);
			
			thisSphere.Faces.push({
				A: vertIndex + 0,
				B: vertIndex + 3,
				C: vertIndex + 5,
	
				NX: 0,
				NY: 1,
				NZ: 0
			});
			thisSphere.Faces.push({
				A: vertIndex + 3,
				B: vertIndex + 1,
				C: vertIndex + 4,
	
				NX: 0,
				NY: 1,
				NZ: 0
			});
			thisSphere.Faces.push({
				A: vertIndex + 4,
				B: vertIndex + 2,
				C: vertIndex + 5,
	
				NX: 0,
				NY: 1,
				NZ: 0
			});
			thisSphere.Faces.push({
				A: vertIndex + 3,
				B: vertIndex + 4,
				C: vertIndex + 5,
	
				NX: 0,
				NY: 1,
				NZ: 0
			});
		}
		
		// Remove original faces from the mesh after tesselation
		newFaces = thisSphere.Faces.slice(numFaces);
		thisSphere.Faces.length = 0;
		thisSphere.Faces = newFaces;
	}
	
	
	calculateSurfaceNormals(thisSphere);
	
    thisSphere.Position = new BABYLON.Vector3(0, 0, 0);
    thisSphere.Rotation = new BABYLON.Vector3(0, 0, 0);

    meshes.push(thisSphere);
    return thisSphere;
}


function newQuad(name, xWidth, zWidth, faceColor, wireColor = black) {
    var thisQuad;
    thisQuad = new SoftEngine.Mesh(name, 4, 2, faceColor, wireColor);
    meshes.push(thisQuad);

    var xHalfWidth = xWidth / 2;
    var zHalfWidth = zWidth / 2;
    thisQuad.Vertices[0] = new BABYLON.Vector3(-xHalfWidth, 0, zHalfWidth);
    thisQuad.Vertices[1] = new BABYLON.Vector3(xHalfWidth, 0, zHalfWidth);
    thisQuad.Vertices[2] = new BABYLON.Vector3(xHalfWidth, 0, -zHalfWidth);
    thisQuad.Vertices[3] = new BABYLON.Vector3(-xHalfWidth, 0, -zHalfWidth);

    thisQuad.Faces[0] = {
        A: 0,
        B: 1,
        C: 2,

        NX: 0,
        NY: 1,
        NZ: 0
    };
    thisQuad.Faces[1] = {
        A: 0,
        B: 3,
        C: 2,

        NX: 0,
        NY: 1,
        NZ: 0
    };

    return thisQuad;
}


function newPlane(name, xWidth, zWidth, xDetail, zDetail, faceColor, wireColor = black) {
    var xVerts = xDetail + 1;
    var zVerts = zDetail + 1;
    var thisPlane;
    thisPlane = new SoftEngine.Mesh(name, (xVerts) * (zVerts), xDetail * zDetail * 2, faceColor, wireColor);

    // GENERATE VERTICES
    for (var iZ = 0; iZ < zVerts; iZ++) {
        for (var iX = 0; iX < xVerts; iX++) {
            var tempX = (iX / xDetail) * xWidth - ((xWidth) / 2);
            var tempY = 0;
            var tempZ = (iZ / zDetail) * zWidth - ((zWidth) / 2);

            var currIndex = (iZ * xVerts) + iX;
            thisPlane.Vertices[currIndex] = new BABYLON.Vector3(tempX, tempY, tempZ);
        }
    }

    // GENERATE FACES FROM VERTICES
    var iFaces = 0;
    for (var iZ = 0; iZ < zDetail; iZ++) {
        for (var iX = 0; iX < xDetail; iX++) {

            var currIndex = (iZ * xVerts) + iX;


            // Upper triangles
            var tempV = thisPlane.Vertices[currIndex + 1].subtract(thisPlane.Vertices[currIndex]);
            var tempU = thisPlane.Vertices[currIndex + xVerts + 1].subtract(thisPlane.Vertices[currIndex]);

            var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
            var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
            var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

            thisPlane.Faces[iFaces] = {
                A: currIndex,
                B: currIndex + 1,
                C: currIndex + 1 + xVerts,

                NX: thisNX,
                NY: thisNY,
                NZ: thisNZ
            };
            iFaces++;


            //Lower triangles
            var tempU = thisPlane.Vertices[currIndex + xVerts].subtract(thisPlane.Vertices[currIndex]);
            var tempV = thisPlane.Vertices[currIndex + xVerts + 1].subtract(thisPlane.Vertices[currIndex]);

            var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
            var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
            var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

            thisPlane.Faces[iFaces] = {
                A: currIndex,
                B: currIndex + xVerts,
                C: currIndex + xVerts + 1,

                NX: thisNX,
                NY: thisNY,
                NZ: thisNZ
            };
            iFaces++;
        }
    }

    thisPlane.Position = new BABYLON.Vector3(0, 0, 0);
    thisPlane.Rotation = new BABYLON.Vector3(0, 0, 0);

    meshes.push(thisPlane);

    return thisPlane;
}


function newTerrainGridRand(name, xWidth, zWidth, xDetail, zDetail, height, faceColor, wireColor = black) {
    var xVerts = xDetail + 1;
    var zVerts = zDetail + 1;
    var thisTerrainGrid;
    thisTerrainGrid = new SoftEngine.Mesh(name, (xVerts) * (zVerts), xDetail * zDetail * 2, faceColor, wireColor);

    // GENERATE VERTICES
    for (var iZ = 0; iZ < zVerts; iZ++) {
        for (var iX = 0; iX < xVerts; iX++) {
            var tempX = (iX / xDetail) * xWidth - ((xWidth) / 2);
            var tempY = height * (2 * (Math.random() - 0.5));
            var tempZ = (iZ / zDetail) * zWidth - ((zWidth) / 2);

            var currIndex = (iZ * xVerts) + iX;
            thisTerrainGrid.Vertices[currIndex] = new BABYLON.Vector3(tempX, tempY, tempZ);
        }
    }

    // GENERATE FACES FROM VERTICES
    var iFaces = 0;
    for (var iZ = 0; iZ < zDetail; iZ++) {
        for (var iX = 0; iX < xDetail; iX++) {

            var currIndex = (iZ * xVerts) + iX;


            // Upper triangles
            var tempV = thisTerrainGrid.Vertices[currIndex + 1].subtract(thisTerrainGrid.Vertices[currIndex]);
            var tempU = thisTerrainGrid.Vertices[currIndex + xVerts + 1].subtract(thisTerrainGrid.Vertices[currIndex]);

            var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
            var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
            var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

            thisTerrainGrid.Faces[iFaces] = {
                A: currIndex,
                B: currIndex + 1,
                C: currIndex + 1 + xVerts,

                NX: thisNX,
                NY: thisNY,
                NZ: thisNZ
            };
            iFaces++;


            //Lower triangles
            var tempU = thisTerrainGrid.Vertices[currIndex + xVerts].subtract(thisTerrainGrid.Vertices[currIndex]);
            var tempV = thisTerrainGrid.Vertices[currIndex + xVerts + 1].subtract(thisTerrainGrid.Vertices[currIndex]);

            var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
            var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
            var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

            thisTerrainGrid.Faces[iFaces] = {
                A: currIndex,
                B: currIndex + xVerts,
                C: currIndex + xVerts + 1,

                NX: thisNX,
                NY: thisNY,
                NZ: thisNZ
            };
            iFaces++;
        }
    }

    thisTerrainGrid.Position = new BABYLON.Vector3(0, 0, 0);
    thisTerrainGrid.Rotation = new BABYLON.Vector3(0, 0, 0);

    meshes.push(thisTerrainGrid);

    return thisTerrainGrid;
}


function newTerrainGridSmooth(name, xWidth, zWidth, xDetail, zDetail, height, interval, faceColor, wireColor = black) {
    if (interval <= 0 || interval % 2 != 0) {
        interval = 2;
    }
    var xVerts = xDetail + 1;
    var zVerts = zDetail + 1;
    var thisTerrainGrid;
    thisTerrainGrid = new SoftEngine.Mesh(name, (xVerts) * (zVerts), xDetail * zDetail * 2, faceColor, wireColor);

    // GENERATE SAMPLE VERTICES
    for (var iZ = 0; iZ < zVerts; iZ++) {
        for (var iX = 0; iX < xVerts; iX++) {
            // Set sample heights, if iX and iZ are both even or both odd
            if ((iZ % interval == 0 && iX % interval == 0) || (iZ % interval == (interval / 2) && iX % interval == (interval / 2))) {
                var tempX = (iX / xDetail) * xWidth - ((xWidth) / 2);
                var tempY = height * (2 * (Math.random() - 0.5));
                var tempZ = (iZ / zDetail) * zWidth - ((zWidth) / 2);

                var currIndex = (iZ * xVerts) + iX;
                thisTerrainGrid.Vertices[currIndex] = new BABYLON.Vector3(tempX, tempY, tempZ);
            }
        }
    }
    
    // GENERATE IN BETWEEN VERTICES
    for (var iZ = 0; iZ < zVerts; iZ++) {
        for (var iX = 0; iX < xVerts; iX++) {
            var currIndex = (iZ * xVerts) + iX;

            // Interpolate in between vertices, if one index is even and the other is odd
            if (!(iZ % interval == 0 && iX % interval == 0) && !(iZ % interval == (interval / 2) && iX % interval == (interval / 2))) {
                // Sample the surrounding vertices, if they exist
                var avgHeight = 0;
                var sampleCount = 0;

                // Left
                if (iX > 0) {
                    sampleCount++;
                    avgHeight += thisTerrainGrid.Vertices[currIndex - 1].y;
                }
                // Right
                if (iX < xVerts - 1) {
                    sampleCount++;
                    avgHeight += thisTerrainGrid.Vertices[currIndex + 1].y;
                }
                // Up
                if (iZ > 0) {
                    sampleCount++;
                    avgHeight += thisTerrainGrid.Vertices[currIndex - xVerts].y;
                }
                // Down
                if (iZ < zVerts - 1) {
                    sampleCount++;
                    avgHeight += thisTerrainGrid.Vertices[currIndex + xVerts].y;
                }

                // Average the sample heights out
                avgHeight = avgHeight / sampleCount;

                var tempX = (iX / xDetail) * xWidth - ((xWidth) / 2);
                var tempY = avgHeight;
                var tempZ = (iZ / zDetail) * zWidth - ((zWidth) / 2);

                thisTerrainGrid.Vertices[currIndex] = new BABYLON.Vector3(tempX, tempY, tempZ);
            }
        }
    }

    // GENERATE FACES FROM VERTICES
    var iFaces = 0;
    for (var iZ = 0; iZ < zDetail; iZ++) {
        for (var iX = 0; iX < xDetail; iX++) {

            var currIndex = (iZ * xVerts) + iX;
            var tempV;
            var tempU;

            // Each point is the top left of its own square, excluding the bottom and right rows
            // If both points are of the same parity (both odd / both even) then the square will be split by a line going down and right
            // If the points are opposite parity, then the square will be split by a line going down and left
            // This deals with the ridges effect by flipping the triangle vertices, and instead creates a smoother, more natural flow to the grid

            // SAME-PARITY VERTICES
            if ((iZ % 2 == 0 && iX % 2 == 0) || (iZ % 2 == 1 && iX % 2 == 1)) {
                // Upper triangles
                tempV = thisTerrainGrid.Vertices[currIndex + 1].subtract(thisTerrainGrid.Vertices[currIndex]);
                tempU = thisTerrainGrid.Vertices[currIndex + xVerts + 1].subtract(thisTerrainGrid.Vertices[currIndex]);

                var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
                var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
                var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

                thisTerrainGrid.Faces[iFaces] = {
                    A: currIndex,
                    B: currIndex + 1,
                    C: currIndex + 1 + xVerts,

                    NX: thisNX,
                    NY: thisNY,
                    NZ: thisNZ
                };
                iFaces++;


                //Lower triangles
                tempU = thisTerrainGrid.Vertices[currIndex + xVerts].subtract(thisTerrainGrid.Vertices[currIndex]);
                tempV = thisTerrainGrid.Vertices[currIndex + xVerts + 1].subtract(thisTerrainGrid.Vertices[currIndex]);

                var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
                var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
                var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

                thisTerrainGrid.Faces[iFaces] = {
                    A: currIndex,
                    B: currIndex + xVerts,
                    C: currIndex + xVerts + 1,

                    NX: thisNX,
                    NY: thisNY,
                    NZ: thisNZ
                };
                iFaces++;
            }

            // OPPOSITE-PARITY VERTICES
            else if ((iZ % 2 == 1 && iX % 2 == 0) || (iZ % 2 == 0 && iX % 2 == 1)){
                // Upper triangles
                tempV = thisTerrainGrid.Vertices[currIndex + 1].subtract(thisTerrainGrid.Vertices[currIndex]);
                tempU = thisTerrainGrid.Vertices[currIndex + xVerts].subtract(thisTerrainGrid.Vertices[currIndex]);

                var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
                var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
                var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

                thisTerrainGrid.Faces[iFaces] = {
                    A: currIndex,
                    B: currIndex + 1,
                    C: currIndex + xVerts,

                    NX: thisNX,
                    NY: thisNY,
                    NZ: thisNZ
                };
                iFaces++;


                //Lower triangles
                tempU = thisTerrainGrid.Vertices[currIndex + xVerts].subtract(thisTerrainGrid.Vertices[currIndex + 1]);
                tempV = thisTerrainGrid.Vertices[currIndex + xVerts + 1].subtract(thisTerrainGrid.Vertices[currIndex + 1]);

                var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
                var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
                var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

                thisTerrainGrid.Faces[iFaces] = {
                    A: currIndex + 1,
                    B: currIndex + xVerts,
                    C: currIndex + xVerts + 1,

                    NX: thisNX,
                    NY: thisNY,
                    NZ: thisNZ
                };
                iFaces++;
            }
        }
    }

    thisTerrainGrid.Position = new BABYLON.Vector3(0, 0, 0);
    thisTerrainGrid.Rotation = new BABYLON.Vector3(0, 0, 0);

    meshes.push(thisTerrainGrid);

    return thisTerrainGrid;
}


function newTerrainGridSin(name, xWidth, zWidth, xDetail, zDetail, height, numWaves, offset, faceColor, wireColor = black) {
    var xVerts = xDetail + 1;
    var zVerts = zDetail + 1;
    var thisTerrainGrid;
    thisTerrainGrid = new SoftEngine.Mesh(name, (xVerts) * (zVerts), xDetail * zDetail * 2, faceColor, wireColor);

    // GENERATE VERTICES
    for (var iZ = 0; iZ < zVerts; iZ++) {
        for (var iX = 0; iX < xVerts; iX++) {
            var tempX = (iX / xDetail) * xWidth - ((xWidth) / 2);
            var tempY = height * Math.sin((iX / xDetail) * numWaves * Math.PI * 2 + offset);
            var tempZ = (iZ / zDetail) * zWidth - ((zWidth) / 2);

            var currIndex = (iZ * xVerts) + iX;
            thisTerrainGrid.Vertices[currIndex] = new BABYLON.Vector3(tempX, tempY, tempZ);
        }
    }

    // GENERATE FACES FROM VERTICES
    var iFaces = 0;
    for (var iZ = 0; iZ < zDetail; iZ++) {
        for (var iX = 0; iX < xDetail; iX++) {

            var currIndex = (iZ * xVerts) + iX;


            // Upper triangles
            var tempV = thisTerrainGrid.Vertices[currIndex + 1].subtract(thisTerrainGrid.Vertices[currIndex]);
            var tempU = thisTerrainGrid.Vertices[currIndex + xVerts + 1].subtract(thisTerrainGrid.Vertices[currIndex]);

            var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
            var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
            var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

            thisTerrainGrid.Faces[iFaces] = {
                A: currIndex,
                B: currIndex + 1,
                C: currIndex + 1 + xVerts,

                NX: thisNX,
                NY: thisNY,
                NZ: thisNZ
            };
            iFaces++;


            //Lower triangles
            var tempU = thisTerrainGrid.Vertices[currIndex + xVerts].subtract(thisTerrainGrid.Vertices[currIndex]);
            var tempV = thisTerrainGrid.Vertices[currIndex + xVerts + 1].subtract(thisTerrainGrid.Vertices[currIndex]);

            var thisNX = (tempU.y * tempV.z) - (tempU.z * tempV.y);
            var thisNY = (tempU.z * tempV.x) - (tempU.x * tempV.z);
            var thisNZ = (tempU.x * tempV.y) - (tempU.y * tempV.x);

            thisTerrainGrid.Faces[iFaces] = {
                A: currIndex,
                B: currIndex + xVerts,
                C: currIndex + xVerts + 1,

                NX: thisNX,
                NY: thisNY,
                NZ: thisNZ
            };
            iFaces++;
        }
    }

    thisTerrainGrid.Position = new BABYLON.Vector3(0, 0, 0);
    thisTerrainGrid.Rotation = new BABYLON.Vector3(0, 0, 0);

    meshes.push(thisTerrainGrid);

    return thisTerrainGrid;
}