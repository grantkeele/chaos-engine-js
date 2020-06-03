function AABBCollider(x, y, z, mass = 0, restitution = 0) {
    this.Dimensions = new BABYLON.Vector3(x, y, z);
    this.Mass = mass;
    this.Restitution = restitution;
}

function BoxCollider(x, y, z, mass = 0, restitution = 0) {
    this.Dimensions = new BABYLON.Vector3(x, y, z);
    this.Mass = mass;
    this.Restitution = restitution;
}

function SphereCollider(radius, mass = 0, restitution = 0) {
    this.Radius = radius;
    this.Mass = mass;
    this.Restitution = restitution;
}


function CollisionData(meshA, meshB, pointA, pointB = null) {
    if (pointB === null){
        pointB = pointA;
    }
    this.MeshA = meshA;
    this.MeshB = meshB;
    this.PointA = pointA;
    this.PointB = pointB;
}




function applyVelocity(mesh, velVector, deltaTime){
    let dP = velVector.scale(deltaTime);
    mesh.Position = mesh.Position.add(dP);
}

function applyAcceleration(mesh, accelVector, deltaTime) {
    // Accelerates a mesh by adding (acceleration x deltaTime) to its velocity
    let dV = accelVector.scale(deltaTime);
    mesh.Velocity = mesh.Velocity.add(dV);
}

function applyForce(mesh, forceVector, deltaTime) {
    // Calculates the acceleration vector by dividing force by mass
    accel = forceVector.scale(1 / mesh.Collider.Mass);

    let dV = accel.scale(deltaTime);
    mesh.Velocity = mesh.Velocity.add(dV);
}

function addForce(mesh, forceVector){
    mesh.NetForce = mesh.NetForce.add(forceVector);
}




function averageVector(vectorList){
    // Calculates the average vector of two or more input vectors

    let vectorSum = new BABYLON.Vector3(0, 0, 0);
    for (let i = 0; i < vectorList.length; i++){
        vectorSum = vectorSum.add(vectorList[i]);
    }

    let avg = vectorSum.scale(1 / vectorList.length);
    return avg;
}

function projectVector(vectA, vectB){
    // Projection of A onto B:
    // (A dot B) / (|B| * |B|) in direction of B
    
    let dotProduct = BABYLON.Vector3.Dot(vectA, vectB);
    let bLengthSquared = Math.pow(vectB.length(), 2);

    let projection = vectB.scale(dotProduct / bLengthSquared);

    return projection;
}

function reflectVector(inputVect, normalVect){
    // Reflection of input vector against a surface normal

    normalVect.normalize();

    let dot = BABYLON.Vector3.Dot(normalVect, inputVect);
    let direction = normalVect.scale(2 * dot);

    let reflection = direction.subtract(inputVect);

    return reflection;
}




function sphereToSphereCollide(sphereAPos, sphereARad, sphereBPos, sphereBRad){
    // Test collision between a sphere and an axially-aligned bounding box (a non-rotated box)

    let directionA = sphereBPos.subtract(sphereAPos);
    let directionB = sphereAPos.subtract(sphereBPos);
    
    let distSquared = directionA.x*directionA.x + directionA.y*directionA.y + directionA.z*directionA.z;

    if (distSquared <= Math.pow(sphereARad + sphereBRad, 2)) {
        let dist = Math.sqrt(distSquared);

        if (dist == 0){
            return [sphereAPos, sphereBPos];
        }

        // Calculate the closest point on the edge of each sphere
        let pointA = sphereAPos.add(directionA.scale(sphereARad / dist));
        let pointB = sphereBPos.add(directionB.scale(sphereBRad / dist));

        // If either of the center points are inside of the other sphere, return that center point
        if (dist <= sphereARad){
            pointB = sphereBPos;
        }
        if (dist <= sphereBRad){
            pointA = sphereAPos;
        }

        return [pointA, pointB];
    }
    else {
        return null;
    }
}

function sphereToAABBCollide(spherePos, sphereRad, boxCenter, boxDimensions){
    // Test collision between a sphere and an axis-aligned bounding box (a non-rotated box)
	let halfDimensions = boxDimensions.scale(0.5);
	
	let closestX = clampVal(spherePos.x, boxCenter.x - halfDimensions.x, boxCenter.x + halfDimensions.x);
    let closestY = clampVal(spherePos.y, boxCenter.y - halfDimensions.y, boxCenter.y + halfDimensions.y);
	let closestZ = clampVal(spherePos.z, boxCenter.z - halfDimensions.z, boxCenter.z + halfDimensions.z);

    let xDist = closestX - spherePos.x;
    let yDist = closestY - spherePos.y;
	let zDist = closestZ - spherePos.z;
    let distSquared = xDist * xDist + yDist * yDist + zDist * zDist;

    if (distSquared <= sphereRad * sphereRad) {     
        let closestPoint = new BABYLON.Vector3(closestX, closestY, closestZ);

        let direction = closestPoint.subtract(spherePos);
        let dist = Math.sqrt(distSquared);

        let pointA = new BABYLON.Vector3(0, 0, 0);
        if (dist == 0){
            pointA = spherePos;
        }
        else {
            pointA = spherePos.add(direction.scale(sphereRad / dist));
        }

        return [pointA, closestPoint];
    }
    else {
        return null;
    }
}

function sphereToBoxCollide(spherePos, sphereRad, boxCenter, boxDimensions, boxRotation){
    // Test collision between a sphere and a box of any orientation by rotating both so that the box is axially aligned
    let boxRot = BABYLON.Matrix.RotationYawPitchRoll(boxRotation.y, boxRotation.x, boxRotation.z);

    let boxRotInverse = BABYLON.Matrix.Copy(boxRot);
    boxRotInverse.invert();
    
    let spherePosLocal = spherePos.subtract(boxCenter);

    let spherePosAligned = BABYLON.Vector3.TransformCoordinates(spherePosLocal, boxRotInverse);

    let halfDimensions = boxDimensions.scale(0.5);

	// Since sphere's position is now in local space (relative to the box center) the box dimensions are also in local space
	let closestX = clampVal(spherePosAligned.x, -halfDimensions.x, halfDimensions.x);
    let closestY = clampVal(spherePosAligned.y, -halfDimensions.y, halfDimensions.y);
	let closestZ = clampVal(spherePosAligned.z, -halfDimensions.z, halfDimensions.z);

    let xDist = closestX - spherePosAligned.x;
    let yDist = closestY - spherePosAligned.y;
	let zDist = closestZ - spherePosAligned.z;
    let distSquared = xDist * xDist + yDist * yDist + zDist * zDist;

    if (distSquared <= sphereRad * sphereRad) {
        let closestPointLocal = new BABYLON.Vector3(closestX, closestY, closestZ);
        closestPointLocal = BABYLON.Vector3.TransformCoordinates(closestPointLocal, boxRot);

        let closestPointWorld = boxCenter.add(closestPointLocal)

        let direction = closestPointWorld.subtract(spherePos);
        let dist = Math.sqrt(distSquared);

        let pointA = new BABYLON.Vector3(0, 0, 0);
        if (dist == 0){
            pointA = spherePos;
        }
        else {
            pointA = spherePos.add(direction.scale(sphereRad / dist));
        }

        return [pointA, closestPointWorld];
    }
    else {
        return null;
    }
}

function AABBToAABBCollide(boxAPos, boxADimensions, boxBPos, boxBDimensions){
    // Test the min xyz of box A against the max xyz of box B, and vice versa

    let boxAMin = new BABYLON.Vector3(boxAPos.x - (boxADimensions.x / 2), boxAPos.y - (boxADimensions.y / 2), boxAPos.z - (boxADimensions.z / 2));
    let boxAMax = new BABYLON.Vector3(boxAPos.x + (boxADimensions.x / 2), boxAPos.y + (boxADimensions.y / 2), boxAPos.z + (boxADimensions.z / 2));
    let boxBMin = new BABYLON.Vector3(boxBPos.x - (boxBDimensions.x / 2), boxBPos.y - (boxBDimensions.y / 2), boxBPos.z - (boxBDimensions.z / 2));
    let boxBMax = new BABYLON.Vector3(boxBPos.x + (boxBDimensions.x / 2), boxBPos.y + (boxBDimensions.y / 2), boxBPos.z + (boxBDimensions.z / 2));

    if (boxAMin.x < boxBMax.x &&
    boxAMax.x > boxBMin.x &&
    boxAMin.y < boxBMax.y &&
    boxAMax.y > boxBMin.y &&
    boxAMin.z < boxBMax.z &&
    boxAMax.z > boxBMin.z)
    {
        // Clamp the center of each box inside  the bounds of the other to determine a collision point
        clampedA = new BABYLON.Vector3(
            clampVal(boxAPos.x, boxBMin.x, boxBMax.x),
            clampVal(boxAPos.y, boxBMin.y, boxBMax.y),
            clampVal(boxAPos.z, boxBMin.z, boxBMax.z)
        );
        clampedB = new BABYLON.Vector3(
            clampVal(boxBPos.x, boxAMin.x, boxAMax.x),
            clampVal(boxBPos.y, boxAMin.y, boxAMax.y),
            clampVal(boxBPos.z, boxAMin.z, boxAMax.z)
        );

        return [clampedA, clampedB];
    }
    
    else{
        return null;
    }
}





function GetMeshCollisionsName(name){
    meshObject = getMeshName(name);

    return GetMeshCollisions(meshObject);
}

function GetMeshCollisionsIndex(index){
    meshObject = meshes[index];

    return GetMeshCollisions(meshObject);
}


function GetMeshCollisions(thisMesh){
    let collisionList = [];

    // Return no collisions if this mesh has no collider
    if (thisMesh.Collider == null) { return collisionList; }

    // Test for each combination of sphere, AABB box, and oriented box collisions
    for (let otherI = 0; otherI < meshes.length; otherI++){
        
        let otherMesh = meshes[otherI];

        if (otherMesh == thisMesh || otherMesh.Collider == null) { continue; }
        
        else {
            // Sphere to sphere
            if (thisMesh.Collider instanceof SphereCollider && otherMesh.Collider instanceof SphereCollider){
                let points = sphereToSphereCollide(thisMesh.Position, thisMesh.Collider.Radius, otherMesh.Position, otherMesh.Collider.Radius);

                if (points !== null){
                    collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                }
            }

            // Sphere to AABB
            else if (thisMesh.Collider instanceof SphereCollider && otherMesh.Collider instanceof AABBCollider){
                let points = sphereToAABBCollide(thisMesh.Position, thisMesh.Collider.Radius, otherMesh.Position, otherMesh.Collider.Dimensions);

                if (points !== null){
                    collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                }
            }

            // Sphere to oriented box
            else if (thisMesh.Collider instanceof SphereCollider && otherMesh.Collider instanceof BoxCollider){
                let points = sphereToBoxCollide(thisMesh.Position, thisMesh.Collider.Radius, otherMesh.Position, otherMesh.Collider.Dimensions, otherMesh.Rotation);

                if (points !== null){
                    collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));                
                }
            }

            
            // AABB to Sphere
            else if (thisMesh.Collider instanceof AABBCollider && otherMesh.Collider instanceof SphereCollider){
                let points = sphereToAABBCollide(otherMesh.Position, otherMesh.Collider.Radius, thisMesh.Position, thisMesh.Collider.Dimensions);

                if (points !== null){
                    collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));                
                }
            }

            // AABB to AABB
            // Sphere to AABB
            else if (thisMesh.Collider instanceof AABBCollider && otherMesh.Collider instanceof AABBCollider){
                let points = AABBToAABBCollide(thisMesh.Position, thisMesh.Collider.Dimensions, otherMesh.Position, otherMesh.Collider.Dimensions);

                if (points !== null){
                    collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                }
            }


            // Oriented box to sphere
            else if (thisMesh.Collider instanceof BoxCollider && otherMesh.Collider instanceof SphereCollider){
                let points = sphereToBoxCollide(otherMesh.Position, otherMesh.Collider.Radius, thisMesh.Position, thisMesh.Collider.Dimensions, thisMesh.Rotation);

                if (points !== null){
                    collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                }
            }
        }
    }

    return collisionList;
}


// Returns a list of CollisionData objects, containing two intersecting meshes and two collision points
function GetAllCollisions(){
    let collisionList = [];

    for (let thisI = 0; thisI < meshes.length; thisI++){
        let thisMesh = meshes[thisI];
        let thisColor = thisMesh.FaceColor;

        // Skip to next mesh if this one has no collider
        if (thisMesh.Collider == null) { continue; }


        // Test for each combination of sphere, AABB box, and oriented box collisions
        for (let otherI = thisI + 1; otherI < meshes.length; otherI++){
            let otherMesh = meshes[otherI];
            let otherColor = otherMesh.FaceColor;

            // Skip to next mesh if this one has no collider
            if (otherMesh.Collider == null) { continue; }

            else {
                // Sphere to sphere
                if (thisMesh.Collider instanceof SphereCollider && otherMesh.Collider instanceof SphereCollider){
                    let points = sphereToSphereCollide(thisMesh.Position, thisMesh.Collider.Radius, otherMesh.Position, otherMesh.Collider.Radius);
                    
                    if (points !== null){
                        collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                    }
                }

                // Sphere to AABB
                else if (thisMesh.Collider instanceof SphereCollider && otherMesh.Collider instanceof AABBCollider){
                    let points = sphereToAABBCollide(thisMesh.Position, thisMesh.Collider.Radius, otherMesh.Position, otherMesh.Collider.Dimensions);
                    
                    if (points !== null){
                        collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                    }
                }

                // Sphere to oriented box
                else if (thisMesh.Collider instanceof SphereCollider && otherMesh.Collider instanceof BoxCollider){
                    let points = sphereToBoxCollide(thisMesh.Position, thisMesh.Collider.Radius, otherMesh.Position, otherMesh.Collider.Dimensions, otherMesh.Rotation);
                    
                    if (points !== null){
                        collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                    }
                }

                
                // AABB to Sphere
                else if (thisMesh.Collider instanceof AABBCollider && otherMesh.Collider instanceof SphereCollider){
                    let points = sphereToAABBCollide(otherMesh.Position, otherMesh.Collider.Radius, thisMesh.Position, thisMesh.Collider.Dimensions);
                    
                    if (points !== null){
                        collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                    }
                }

                // AABB to AABB
                // Sphere to AABB
                else if (thisMesh.Collider instanceof AABBCollider && otherMesh.Collider instanceof AABBCollider){
                    let points = AABBToAABBCollide(thisMesh.Position, thisMesh.Collider.Dimensions, otherMesh.Position, otherMesh.Collider.Dimensions);
                    
                    if (points !== null){
                        collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                    }
                }


                // Oriented box to sphere
                else if (thisMesh.Collider instanceof BoxCollider && otherMesh.Collider instanceof SphereCollider){
                    let points = sphereToBoxCollide(otherMesh.Position, otherMesh.Collider.Radius, thisMesh.Position, thisMesh.Collider.Dimensions, thisMesh.Rotation);
                    
                    if (points !== null){
                        collisionList.push(new CollisionData(thisMesh, otherMesh, points[0], points[1]));
                    }
                }
            }
        }
        
    }

    return collisionList;
}
