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
var range = 20;
var u = 1;
var content = document.getElementById('content');
var renderer = new THREE.WebGLRenderer({ antialias: true });
var scene = new THREE.Scene();
var geometry = new THREE.BoxGeometry(u, u, u);
var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, wireframeLinewidth: 3 });
var numBars = 20;
var row = [];
var visualScale = 20;

// TODO white on red background, +shadows
content.appendChild( renderer.domElement );
renderer.setSize(sceneWidth, sceneHeight);
renderer.setClearColor( 0xff0000, 1.0 );

var camera = new THREE.PerspectiveCamera( 45, sceneWidth / sceneHeight, 1, 10000 );
var cameraTarget = new THREE.Vector3( 0, 0, 0 );
camera.position.set( 0, range / 2, range );
camera.lookAt( cameraTarget );

var left = -u * numBars;
var x = left;
for(var i = 0; i < numBars; i++) {
  var bar = new THREE.Mesh(geometry, material);
  bar.position.set(x, 0, 0);
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
function animate() {
  requestAnimationFrame(animate);
  
  analyser.getByteTimeDomainData(analyserData); // 0..255

  updateVisualisation(analyserData);

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


