var renderer = null;
var scene = null;

var controls = null;
var camera = null;

var octopus = null;
var genome = null;

var clock = null;

var animating = true;

var resMgr = null;

var keyPressed = [];

var exporter = null;

//***************************************************************************//
// initialize the renderer, scene, camera, and lights                        //
//***************************************************************************//
function onLoad()
{
    // Grab our container div
    var container = document.getElementById("container");

    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0);
    container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Put in a camera
    camera = new THREE.PerspectiveCamera( 60, 
        window.innerWidth / window.innerHeight, 1, 4000 );
        
    camera.position.set( 0, 0, 180);
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener( 'change', render );

    // Create an ambient and a directional light to show off the object
    var ambLight = new THREE.AmbientLight( 0xaaaaaa ); // soft white light
    var dirLight = new THREE.DirectionalLight( 0xffffff, 1);
    dirLight.position.set(0, 1, 1);
    scene.add( ambLight );
    scene.add( dirLight );

    populateScene();

    // Add a mouse up handler to toggle the animation
    addInputHandler();
    window.addEventListener( 'resize', onWindowResize, false );

    // add gui
    addGui();

    clock = new THREE.Clock();

    // Run our render loop
	run();
}

//***************************************************************************//
// Populate the scene object with our objects                                //
//***************************************************************************//
function populateScene()
{
    genome = new Genome();
    resMgr = new ResourceManager(genome);

    // load resources
    resMgr.initMaterials();

    octopus = new Octopus(genome);
    octopus.build();
    octopus.rotation.y = Math.PI/20;
    scene.add(octopus);

    planeGeo = new THREE.PlaneGeometry(5000, 5000, 2, 2);
    planeMesh = new THREE.Mesh(planeGeo, resMgr.materials.basic);
    planeMesh.rotation.x = -Math.PI/2;
    planeMesh.position.y = -100;
//    scene.add(planeMesh);

}

function addGui()
{
    var gui = new dat.GUI();
    gui.add(genome, 'tentFactor1', 0, 100);
    gui.add(genome, 'tentFactor2', 0, 50);
    gui.add(genome, 'tentFactor3', 0, 50);
    gui.add(genome, 'tentFactor4', 0, 50);
}
//***************************************************************************//
// render loop                                                               //
//***************************************************************************//
function run()
{
    var deltaMS = clock.getDelta()*1000;

    render();

    if (animating)
    {
        octopus.animate(deltaMS);
    }

    // Ask for another frame
    requestAnimationFrame(run);
    controls.update();
}

// Render the scene
function render()
{
    renderer.render(scene, camera);    
}

//***************************************************************************//
// User interaction                                                          //
//***************************************************************************//
function addInputHandler()
{
    var dom = renderer.domElement;
    dom.addEventListener('mouseup', onMouseUp, false);
    dom.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
}

function onKeyDown(evt)
{
    var keyCode = getKeyCode(evt);

    //console.log(keyCode);

    if (keyCode == 32) {
        animating = !animating;        
    }
    else if (keyCode == 83) // 's'
    {
        if (!keyPressed[keyCode]) {
            keyPressed[keyCode] = true;
            octopus.setFeeling("scared", 0.1);
        }
    }
    else if (keyCode == 66) // 'b'
    {
        if (!keyPressed[keyCode]) {
            keyPressed[keyCode] = true;
            octopus.shutEyes(0.2);
        }
    }
    else if (keyCode == 69) // 'e'
    {
        if (!keyPressed[keyCode]) {
            keyPressed[keyCode] = true;
            // export to STL
            octopus.updateMatrixWorld(true);
            exporter = new THREE.STLExporter();
            exporter.exportScene(scene);
            exporter.sendToServer();
        }
    }
}

function onKeyUp(evt)
{
    var keyCode = getKeyCode(evt);

    keyPressed[keyCode] = false;

    if (keyCode == 83) {
        octopus.setFeeling("normal", 0.2);
        keyPressed[keyCode] = false;
    }
    else if (keyCode == 66) {
        octopus.openEyes(0.3);
        keyPressed[keyCode] = false;
    }
}

function onMouseDown(event)
{
    event.preventDefault();
}

function onMouseUp(event)
{
    event.preventDefault();
}

function onMouseMove(event)
{
    event.preventDefault();
    if (dragging) {
        var x = prevMouse.x - event.x;
        var y = prevMouse.y - event.y;
        camera.rotation.y -= x/1000;

        prevMouse.x = event.x;
        prevMouse.y = event.y;
    }
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function getKeyCode(evt)
{
    if (window.event != null) 
        return window.event.keyCode;
    else
        return evt.which;
}

function map(i, sStart, sEnd, tStart, tEnd)
{
    var v = i-sStart;
    if (v>=0) {
        if (i < sStart) {
            return tStart;
        } else if (i > sEnd) {
            return tEnd;
        }
    } else {
        if (i > sStart) {
            return tStart;
        } else if (i < sEnd){
            return tEnd;
        }
    }
    var sRange = sEnd - sStart;
    if (sRange == 0) {
        return tStart;
    }

    var tMax = tEnd - tStart;
    return tStart + v / sRange * tMax;
}
