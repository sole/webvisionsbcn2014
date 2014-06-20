var audioContext = new AudioContext();
var oscillator = audioContext.createOscillator();
oscillator.connect(audioContext.destination);
oscillator.start();
oscillator.frequency.value = 220;
oscillator.frequency.linearRampToValueAtTime(440, audioContext.currentTime + 2);
