class Sounds {
  constructor() {
    this.muted = false;
  }

  init() {
    this.soundsSource = [
      "sounds/shot.mp3",
      "sounds/explosion.mp3",
      "sounds/ufoDeath.mp3",
      "sounds/laser.mp3", // Added laser sound
    ];
    this.allSounds = [];
    for (let i = 0; i < this.soundsSource.length; i++) {
      const audio = new Audio();
      audio.src = this.soundsSource[i];
      audio.setAttribute("preload", "auto");
      this.allSounds.push(audio);
    }
  }

  playSound(soundName) {
    if (this.muted) {
      return;
    }

    let soundNumber;

    switch (soundName) {
      case "shot":
        soundNumber = 0;
        break;
      case "explosion":
        soundNumber = 1;
        break;
      case "ufoDeath":
        soundNumber = 2;
        break;
      case "laser": // Added case for laser sound
        soundNumber = 3;
        break;
      default:
        console.warn(`Unknown sound name: ${soundName}`);
        return;
    }

    this.allSounds[soundNumber].currentTime = 0;
    this.allSounds[soundNumber].play();
  }

  muteSwitch() {
    this.muted = !this.muted;
  }
}
