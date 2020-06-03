// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas;
var device;
var cam;
var meshes = [];
var lights = [];


var showWires = false;
var showFaces = true;
var drawNormals = false;
var wireOffset = 0.000075;

var rotSpeed = 0.1 * Math.PI*2;  // In rotations per second, " * " converts from rad to rot


// r,g,b,a are from 0 to 255
const clear = new BABYLON.Color4(0, 0, 0, 0);
const white = new BABYLON.Color4(255, 255, 255, 255);
const black = new BABYLON.Color4(0, 0, 0, 255);
const red = new BABYLON.Color4(255, 0, 0, 255);
const orange = new BABYLON.Color4(255, 150, 0, 255);
const yellow = new BABYLON.Color4(255, 235, 40, 255);
const green = new BABYLON.Color4(0, 255, 0, 255);
const blue = new BABYLON.Color4(0, 0, 255, 255);
const indigo = new BABYLON.Color4(140, 30, 255, 255);
const pink = new BABYLON.Color4(242, 34, 255, 255);
const magenta = new BABYLON.Color4(255, 41, 117, 255);
const sunny = new BABYLON.Color4(255, 252, 211, 255);
const lightGray = new BABYLON.Color4(210, 210, 210, 255);
const darkGray = new BABYLON.Color4(100, 100, 100, 255);

const skyBlue = new BABYLON.Color4(133, 216, 237, 255)
const sunsetPurple = new BABYLON.Color4(112, 34, 241, 255);
const hellishRed = new BABYLON.Color4(208, 11, 11, 255);
const twilightBlue = new BABYLON.Color4(12, 34, 99, 255);
const rainyGray = new BABYLON.Color4(93, 98, 120, 255);

const stoneGray = new BABYLON.Color4(150, 150, 150, 255);
const topsoilBrown = new BABYLON.Color4(109, 82, 43, 255);
const brightGrassGreen = new BABYLON.Color4(87, 185, 39, 255);
const waterBlue = new BABYLON.Color4(22, 85, 222, 255);
const sandBeige = new BABYLON.Color4(240, 225, 150, 255);
const woodBrown = new BABYLON.Color4(74, 50, 17, 255);
const leafGreen = new BABYLON.Color4(61, 140, 21, 255);
const cactusGreen = new BABYLON.Color4(124, 168, 0, 255);
const lavared = new BABYLON.Color4(255, 82, 35, 255);
const redrockRed = new BABYLON.Color4(227, 113, 39, 255);
const cobblestoneGrey = new BABYLON.Color4(98, 94, 90, 255);
const snowWhite = new BABYLON.Color4(250, 250, 250, 255);
const poisonPurple = new BABYLON.Color4(159, 16, 246, 255);
const cloudGrey = new BABYLON.Color4(211, 220, 236, 255);



var skyBoxColor = lightGray;

var ambientLevel = 0.2;
var directional = "directional";
var point = "point";
var spot = "spot";

var delta; // Time, in SECONDS, since last frame.
var lastCalledTime;
var timer = 0;
var fps;
var fpsTimer = 0;

const minDelta = 1 / 200;
const maxDelta = 1 / 40;

var cycles = 0;
var frameCount = 0;
var smoothFps;
var renderInProgress = false;


document.addEventListener("DOMContentLoaded", init, false);


function init() {
    
    canvas = document.getElementById("frontBuffer");
    cam = new SoftEngine.Camera();
    device = new SoftEngine.Device(canvas);

    var placeholderScene = new SoftEngine.Mesh("Scene Placeholder", 0, 0, black, null, 0);
    meshes.push(placeholderScene);

    cam.Position = new BABYLON.Vector3(0, 0, 0);
    cam.Rotation = new BABYLON.Vector3(0, 0, 0);
    cam.Target = new BABYLON.Vector3(0, 0, -1);


    setup();
    
    fillHierarchy();
    
    var updateLoop = setInterval(renderLoop, 1);
}

function renderLoop() {

    if (renderInProgress === false) {
        cycles += 1;

        if (!lastCalledTime) {
            lastCalledTime = Date.now();
            fps = 0;
            return;
        }

        delta = clampVal((Date.now() - lastCalledTime) * 0.001, minDelta, maxDelta);

        //fps = 1 / delta;
        //document.getElementById("timerStat").innerHTML = "Time: " + timer.toFixed(3);


        // runs the project-specific loop code
        loop();
		
	
        // MAIN DRAWING CALL
        requestAnimationFrame(drawingLoop);


        lastCalledTime = Date.now();
        timer += delta;
        fpsTimer += delta;

        if (fpsTimer >= 1) {
            document.getElementById("fpsStat").innerHTML = "FPS: " + cycles;
            fpsTimer = 0;
            frameCount = 0;
            cycles = 1;
        }

        //Fill the hierarchy with all objects in the scene
        //fillHierarchy();
    }
}

function drawingLoop() {
    renderInProgress = true;
    device.clear();
    device.render(cam, meshes);
    device.present();
    renderInProgress = false;
}

function fillHierarchy(){
    var objectList = "<button onclick='updateMeshesFromHierarchy()'>Update Meshes</button><br>";
  
    objectList += "Meshes:";
    for (var i = 0; i < meshes.length; i++) {
		let thisMesh = meshes[i];
		
		// Mesh indices and name
        objectList += "<br><li><b>" + i + "</b>: " + thisMesh.name + "</li>";
			
		// Mesh position input spaces
		objectList += "<form id='meshCoords_" + i + "'>";
		objectList += " X: <input style='width:50px' type='text' x='' value=" + thisMesh.Position.x + ">";
		objectList += " Y: <input style='width:50px' type='text' x='' value=" + thisMesh.Position.y + ">";
		objectList += " Z: <input style='width:50px' type='text' x='' value=" + thisMesh.Position.z + "></form>";
    }
  
    objectList += "<br> Lights:";
  
    for (var i = 0; i < lights.length; i++) {
		let thisLight = lights[i];
		
		//Light indices and name
        objectList += "<li>" + i + ": " + thisLight.name + "</li>";
		
		// Light position input spaces
		objectList += "<form id='lightCoords_" + i + "'>";
		objectList += " X: <input style='width:50px' type='text' x='FirstName' value=" + thisLight.Position.x + ">";
		objectList += " Y: <input style='width:50px' type='text' x='LastName' value=" + thisLight.Position.y + ">";
		objectList += " Z: <input style='width:50px' type='text' x='LastName' value=" + thisLight.Position.z + "></form>";
    }
    document.getElementById("hierarchy").innerHTML = objectList;
	
	//document.getElementById("hierarchy").addEventListener('input', updateMeshesFromHierarchy());
}


function updateMeshesFromHierarchy(){
	// Meshes
	for (let i = 0; i < meshes.length; i++) {
		let thisMesh = meshes[i];
		let thisForm = document.getElementById("meshCoords_" + i);
		
		// Attempt to set mesh coordinates to what the hierarchy specifies.  If an invalid input is given, changes hierarchy value to mesh position.
		let formX = thisForm.elements[0].value;
		if (isNaN(formX)){ formX = thisMesh.Position.x; }
		else{ thisMesh.Position.x = parseFloat(formX); }

		let formY = thisForm.elements[1].value;
		if (isNaN(formY)){ formY = thisMesh.Position.y; }
		else{ thisMesh.Position.y = parseFloat(formY); }
		
		let formZ = thisForm.elements[2].value;
		if (isNaN(formZ)){ formZ = thisMesh.Position.z; }
		else{ thisMesh.Position.z = parseFloat(formZ); }
		
	}
	
	// Lights
	for (let i = 0; i < lights.length; i++) {
		let thisLight = lights[i];
		let thisForm = document.getElementById("lightCoords_" + i);
		
		// Attempt to set mesh coordinates to what the hierarchy specifies.  If an invalid input is given, changes hierarchy value to mesh position.
		let formX = thisForm.elements[0].value;
		if (isNaN(formX)){ formX = thisLight.Position.x; }
		else{ thisLight.Position.x = formX; }

		let formY = thisForm.elements[1].value;
		if (isNaN(formY)){ formY = thisLight.Position.y; }
		else{ thisLight.Position.y = formY; }
		
		let formZ = thisForm.elements[2].value;
		if (isNaN(formZ)){ formZ = thisLight.Position.z; }
		else{ thisLight.Position.z = formZ; }
		
	}
	fillHierarchy();
}

function invertColor(inputColor){
	let newR = 255 - inputColor.r;
	let newG = 255 - inputColor.g;
	let newB = 255 - inputColor.b;
	
	return new BABYLON.Color4(newR, newG, newB, 255);
}