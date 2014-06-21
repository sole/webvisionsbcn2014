navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

// Audio setup
var audioContext = new AudioContext();
var source;
var analyser = audioContext.createAnalyser();
var analyserData;
analyser.connect(audioContext.destination);
analyser.fftSize = 2048;
analyserData = new Uint8Array(analyser.frequencyBinCount);



// 3D setup
var sceneWidth = 320;
var sceneHeight = 240;
var range = 30;

var content = document.getElementById('content');
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
var scene = new THREE.Scene();

scene.add(new THREE.AmbientLight(0x111111));

var light = new THREE.DirectionalLight(0xdfebff, 1.75);
//light.position.set(0, 100, 0);
light.position.set(0, 400, 0);
light.position.multiplyScalar(1.3);

light.castShadow = true;
//light.shadowCameraVisible = true;
light.shadowMapWidth = 1024;
light.shadowMapHeight = 1024;
var d = 200;
light.shadowCameraLeft = -d;
light.shadowCameraRight = d;
light.shadowCameraTop = d;
light.shadowCameraBottom = -d;

light.shadowCameraFar = 1000;
light.shadowDarkness = 0.5;
scene.add(light);

var planeGeometry = new THREE.PlaneGeometry(500, 500);
var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
//var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
//plane.position.y = -5;
plane.receiveShadow = true;
scene.add(plane);

var u = 20;
var geometry = new THREE.BoxGeometry(u, u, u);
var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
var numBars = 20;
var row = [];
var visualScale = 20;

// TODO white on red background, +shadows
content.appendChild( renderer.domElement );
renderer.setSize(sceneWidth, sceneHeight);
renderer.setClearColor( 0xffffff, 1.0 );

var camera = new THREE.PerspectiveCamera( 45, sceneWidth / sceneHeight, 1, 100000 );
var cameraTarget = new THREE.Vector3( 0, 0, 0 );
//camera.position.set( 0, 10, range );
camera.position.set( 0, 10, 10 );
var r = 300;
camera.position.set( 0, r, r );
camera.lookAt( cameraTarget );

var left = -u * numBars;
var x = left;
for(var i = 0; i < numBars; i++) {
  var bar = new THREE.Mesh(geometry, material);
  bar.position.set(x, u * 2, 0);
  bar.castShadow = true;
  //bar.receiveShadow = true;
  scene.add(bar);
  row.push(bar);
  x += u * 2;
}

// Starting the audio stream
navigator.getUserMedia(
  { audio: true },
	function yay(stream) {
    source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
	},
	function nope(err) {
    console.err("oh noes", err);
	}
);

// rendering loop
function animate(timestamp) {
  requestAnimationFrame(animate);
  
  analyser.getByteTimeDomainData(analyserData); // 0..255

  updateVisualisation(analyserData);

  var t = timestamp !== null ? timestamp * 0.001 : 0;
//  camera.position.set(0, range * Math.sin(t), range * Math.cos(t));
//  camera.lookAt(cameraTarget);

  //light.position.set(0, range* 0.5 + range *0.25* Math.sin(t), 0);
  renderer.render(scene, camera);
  
}

function updateVisualisation(data) {
  var dataLength = data.length;
  var dataIndex = 0;
  var skipLength = Math.round(dataLength / numBars);

  for(var j = 0; j < numBars; j++) {  
    var v = data[dataIndex] / 255.0;
    dataIndex += skipLength;
    row[j].scale.set(1, 1, v * visualScale);
  }
}

// GO GO GO GO
animate();


