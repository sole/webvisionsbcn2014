var audioContext = new AudioContext();
var oscillator = audioContext.createOscillator();
oscillator.connect(audioContext.destination);
oscillator.start();
oscillator.frequency.value = 220;
oscillator.frequency.linearRampToValueAtTime(440, audioContext.currentTime + 2);
//oscillator.type = 'sine'
/*setTimeout(function() {
  oscillator.frequency.linearRampToValueAtTime(Math.random() * 100 + 100, audioContext.currentTime + 0.25);
}, 300);
*/
