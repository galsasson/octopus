var renderer = null;
var scene = null;
var camera = null;
var animating = false;

var octopus = null;

var clock = null;

//***************************************************************************//
// initialize the renderer, scene, camera, and lights                        //
//***************************************************************************//
function onLoad()
{
    // Grab our container div
    var container = document.getElementById("container");

    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0);
    container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Put in a camera
    camera = new THREE.PerspectiveCamera( 45,
        container.offsetWidth / container.offsetHeight, 1, 4000 );
    camera.position.set( 0, -20, 180);

    // Create a directional light to show off the object
    var light = new THREE.DirectionalLight( 0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add( light );

    populateScene();

    // Add a mouse up handler to toggle the animation
    addMouseHandler();

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

    // octopus.rotation.x = -Math.PI/2;

    scene.add(octopus);
}

//***************************************************************************//
// render loop                                                               //
//***************************************************************************//
function run()
{
    var deltaMS = clock.getDelta()*1000;

    // Render the scene
    renderer.render( scene, camera );
    // Spin the cube for next frame
    if (animating)
    {
        var time = new Date().getTime();

        octopus.animate(deltaMS);
    }

    // Ask for another frame
    requestAnimationFrame(run);
}

//***************************************************************************//
// User interaction                                                          //
//***************************************************************************//
function addMouseHandler()
{
    var dom = renderer.domElement;
    dom.addEventListener( 'mouseup', onMouseUp, false);
}

function onMouseUp(event)
{
    event.preventDefault();
    animating = !animating;
}
