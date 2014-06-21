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
var content = document.getElementById('content');
var renderer = new THREE.WebGLRenderer({ antialias: true });
var scene = new THREE.Scene();

content.appendChild( renderer.domElement );
renderer.setSize(320, 240);
renderer.setClearColorHex( 0xeeeeee, 1.0 );

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

  
}

// GO GO GO GO
animate();


