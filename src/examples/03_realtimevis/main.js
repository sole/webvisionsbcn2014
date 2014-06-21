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
var content = document.getElementById('content');
var renderer = new THREE.WebGLRenderer({ antialias: true });
var scene = new THREE.Scene();
var geometry = new THREE.BoxGeometry(5, 5, 5);
var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
var cube = new THREE.Mesh(geometry, material);

content.appendChild( renderer.domElement );
renderer.setSize(sceneWidth, sceneHeight);
renderer.setClearColorHex( 0xeeeeee, 1.0 );

var camera = new THREE.PerspectiveCamera( 45, sceneWidth / sceneHeight, 1, 10000 );
camera.position.set( 0, 0, range );
camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

scene.add(cube);

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

  var v = analyserData[0] / 255.0;

  cube.scale.set(v, v, v);

  renderer.render(scene, camera);

  
}

// GO GO GO GO
animate();


