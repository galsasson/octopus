var renderer = null;
var scene = null;

var controls = null;
var camera = null;

var octopus = null;

var clock = null;

var animating = true;

var resMgr = new ResourceManager();

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
    dirLight.position.set(0, 0, 1);
    scene.add( ambLight );
    scene.add( dirLight );

    // load resources
    resMgr.initMaterials();

    populateScene();

    // Add a mouse up handler to toggle the animation
    addInputHandler();
    window.addEventListener( 'resize', onWindowResize, false );

    clock = new THREE.Clock();

    // Run our render loop
	run();
}

//***************************************************************************//
// Populate the scene object with our objects                                //
//***************************************************************************//
function populateScene()
{
    var genome = new Genome();

    octopus = new Octopus(genome);
    octopus.build();
    octopus.rotation.y = Math.PI/20;
    scene.add(octopus);

    planeGeo = new THREE.PlaneGeometry(5000, 5000, 2, 2);
    planeMesh = new THREE.Mesh(planeGeo, resMgr.materials.basic);
    planeMesh.rotation.x = -Math.PI/2;
    planeMesh.position.y = -100;
    scene.add(planeMesh);

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
}

function onKeyDown(evt)
{
    var keyCode = getKeyCode(evt);
    if (keyCode == 32) {
        animating = !animating;        
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
    var sRange = sEnd - sStart;
    var tMax = tEnd - tStart;
    return v / sRange * tMax;
}
