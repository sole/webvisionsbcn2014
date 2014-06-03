var audioContext = new AudioContext();
console.log(audioContext.sampleRate);
var oscillator = audioContext.createOscillator();
console.log(oscillator);
oscillator.connect(audioContext.destination);
oscillator.frequency.value = 220;
console.log(oscillator.frequency.value);
oscillator.start();
