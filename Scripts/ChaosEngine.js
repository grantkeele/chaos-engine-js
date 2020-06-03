// Created by Grant Keele

var camInitPos = new BABYLON.Vector3(0, 2, 0);
var camInitRot = new BABYLON.Vector3(0, 0, 0);

var cameraSpeed = 8;
var camRotSpeed = 0.004;
var cameraFOV = 110 * Math.PI / 180;


var sceneLight = new SoftEngine.Light("Scene Light", directional, white, 0.2);
sceneLight.Direction = new BABYLON.Vector3(0.2, -1, -0.4);
sceneLight.Direction.normalize();
lights.push(sceneLight);

var pointLight = new SoftEngine.Light("Point Light", point, white, 8);
pointLight.Position = new BABYLON.Vector3(0, 10, 0);
lights.push(pointLight);


var renderDistance = 6;

var drawFog = false;
var fogIntensity = 1.1;


var maskColor = new BABYLON.Color4(0, 0, 0, 255);

var collisionData = 0;

var camVel = new BABYLON.Vector3(0, 0, 0);
var terminalVelocity = 150;


var gravityAccel = new BABYLON.Vector3(0, -9.8, 0);




function setup() {
    setupCamera(cam, camInitPos, camInitRot);

    sceneLight.Color = skyBoxColor;
    pointLight.Color = skyBoxColor;
     
    var lightIndicator = newIcosahedron('lightIndicator', 0.5, black);
    lightIndicator.Position = pointLight.Position;



    var ball = newSphere("ball", 1, 4, red);
    ball.Position = new BABYLON.Vector3(2, 0, -15);
    ball.Collider = new SphereCollider(1, 10, 0.5);

    ball.Velocity = new BABYLON.Vector3(0, 0, 0);


    var brick = newBox("brick", 1.5, 1, 3, woodBrown);
    brick.Position = new BABYLON.Vector3(-2, 0, -15);
    brick.Collider = new AABBCollider(1.5, 1, 4, 20, 0.05);

    brick.Velocity = new BABYLON.Vector3(0, 0, 0); 


    var back = newPlane("back", 60, 60, 20, 20, white);
    back.Position = new BABYLON.Vector3(0, -5, 0);
    //back.Rotation = new BABYLON.Vector3(Math.PI / 3, 0, 0); // x = 0.3
    back.Collider = new AABBCollider(60, 0.1, 60, 0);

    

	

    

    //document.getElementById("testStat").innerHTML = "";
	
}

function loop() {
	
    firstPersonMovement();
    if (rDown === true) {
        setupCamera(cam, camInitPos, camInitRot);
		camVel = new BABYLON.Vector3(0, 0, 0);
    }
    let currPos = new BABYLON.Vector3(cam.Position.x, cam.Position.y, cam.Position.z);
    moveCameraVector(cam, camVel.scale(delta));
	
	
  

    // Apply force of gravity to all moveable meshes
    for (let m = 0; m < meshes.length; m++){
        let thisMesh = meshes[m];

        if (thisMesh.Collider !== null && thisMesh.Collider.Mass !== 0){

            thisMesh.NetForce = BABYLON.Vector3.Copy(gravityAccel).scale(thisMesh.Collider.Mass);
        }
    }

    
    // Apply forces to all colliding meshes

    let collisions = GetAllCollisions();

    for (let c = 0; c < collisions.length; c++){
        let thisCollision = collisions[c];

        let meshA = thisCollision.MeshA;
        let meshB = thisCollision.MeshB;

        let collA = meshA.Collider;
        let collB = meshB.Collider;

        let restitution = Math.max(collA.Restitution, collB.Restitution);

        
        if (collA.Mass === 0){
            let collPoint = thisCollision.PointB;//averageVector([thisCollision.PointA, thisCollision.PointB]);

            let normal = meshB.Position.subtract(collPoint);
            normal.normalize();

            let negativeVel = meshB.Velocity.negate();
            let speed = negativeVel.length();

            let newVel = reflectVector(negativeVel, normal);

            let projection = projectVector(newVel, normal);
            newVel = newVel.subtract(projection.scale(1 - restitution));
            
            meshB.Position = meshB.Position.add(normal.scale(speed * delta * 1.7));
            meshB.Velocity = newVel;      
        }
        if (collB.Mass === 0){
            let collPoint = thisCollision.PointA;
            
            let normal = meshA.Position.subtract(collPoint);
            normal.normalize();

            let negativeVel = meshA.Velocity.negate();
            let speed = negativeVel.length();

            let newVel = reflectVector(negativeVel, normal);

            let projection = projectVector(newVel, normal);
            newVel = newVel.subtract(projection.scale(1 - restitution));

            meshA.Position = meshA.Position.add(normal.scale(speed * delta * 1.7));
            meshA.Velocity = newVel;

            //console.log(newVel);
        }

    }


    // Update velocity of all moveable meshes, and update their position as well
    for (let m = 0; m < meshes.length; m++){
        let thisMesh = meshes[m];
        
        if (thisMesh.Collider !== null && thisMesh.Collider.Mass !== 0){

            applyForce(thisMesh, thisMesh.NetForce, delta);
            applyVelocity(thisMesh, thisMesh.Velocity, delta);

            if (thisMesh.Position.y < -100){
                thisMesh.Position = new BABYLON.Vector3(0, 0, 0);
                thisMesh.Velocity = BABYLON.Vector3.Zero();
            }
        }
    }

    //console.log(sphere1.NetForce);

	//fillHierarchy();
}



function ClearMeshes() {
    meshes.length = 1;
}






// Utility Functions

function Create2DArray(x, y, fill = 0) {
    var arr = new Array(x);

    for (var a = 0; a < x; a++) {
        arr[a] = [];

        for (var b = 0; b < y; b++) {
            arr[a][b] = fill;
        }
    }

    return arr;
}

function Create3DArray(x, y, z, fill = 0) {
    var arr = new Array(x);

    for (var a = 0; a < x; a++) {
        arr[a] = [];

        for (var b = 0; b < y; b++) {
            arr[a][b] = [];

            for (var c = 0; c < z; c++) {
                arr[a][b][c] = fill;
            }
        }
    }

    return arr;
}

function Create4DArray(x, y, z, slots, fill = 0) {
    var arr = new Array(x);

    for (var a = 0; a < x; a++) {
        arr[a] = [];

        for (var b = 0; b < y; b++) {
            arr[a][b] = [];

            for (var c = 0; c < z; c++) {
                arr[a][b][c] = [];

                for (var d = 0; d < slots; d++) {
                    arr[a][b][c][d] = fill;
                }
            }
        }
    }

    return arr;
}

function clampVal(val, low, high) {
    let ans = Math.min(high, Math.max(low, val));
    return ans;
}

function RandomChance(percent){
    if(Math.random() < percent){
      return true;
    }
    else{
      return false;
    }
}

function RandomSign() {
    if (Math.random() > 0.5) {
        return 1;
    }
    else {
        return -1;
    }
}

function RandomBool() {
    if (Math.random() > 0.5) {
        return true;
    }
    else {
        return false;
    }
}