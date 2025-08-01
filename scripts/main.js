// Canvas drawing
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas automatic resizing
// In main.js

function resize() {
  // Original aspect ratio of the game canvas
  const gameRatio = canvas.width / canvas.height;
  const windowRatio = window.innerWidth / window.innerHeight;

  let newWidth, newHeight;

  // Check if the window is skinnier than the game (portrait mode)
  if (windowRatio < gameRatio) {
    // Fit to window width
    newWidth = window.innerWidth;
    newHeight = newWidth / gameRatio;
  } else {
    // Or if the window is wider than the game (landscape mode)
    // Fit to window height
    newHeight = window.innerHeight;
    newWidth = newHeight * gameRatio;
  }

  canvas.style.width = newWidth + 'px';
  canvas.style.height = newHeight + 'px';
}
window.addEventListener("load", resize);
window.addEventListener('resize', resize); // Add this line

// Game Basics
class GameBasics {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;

    // active playing field
    this.playBoundaries = {
      top: 150,
      bottom: 650,
      left: 100,
      right: 800,
    };

    // initial values
    this.level = 1;
    this.score = 0;
    this.shields = 1;

    // game settings
    this.setting = {
      //FPS: 60 frame per 1 second, this means 1 new frame in every 0.01666667 seconds
      updateSeconds: 1 / 60,
      spaceshipSpeed: 200, //spaceship's speed
      bulletSpeed: 250,
      bulletMaxFrequency: 1000, //how fast our spaceship can shoot one after another
      ufoRows: 4,
      ufoColumns: 8,
      ufoSpeed: 35,
      ufoSinkingValue: 30, // distance of sinking
      bombSpeed: 75,
      bombFrequency: 0.05,
      pointsPerUFO: 50,
    };

    // Store positions and states of the game
    this.positionContainer = [];

    // pressed keys storing
    this.pressedKeys = {};
  }

  //  Return to current game position and status. Always returns the top element of positionContainer.
  presentPosition() {
    return this.positionContainer.length > 0
      ? this.positionContainer[this.positionContainer.length - 1]
      : null;
  }

  // Move to the desired position
  goToPosition(position) {
    // If we're already in a position, don't need to go to new position
    if (this.presentPosition()) {
      this.positionContainer.length = 0;
    }
    // If we finds an 'entry' in a given position, we call it.
    if (position.entry) {
      position.entry(play); // play is the game object
    }
    // Set the current game position in the positionContainer
    this.positionContainer.push(position);
  }
  // Push our new position
  pushPosition(position) {
    this.positionContainer.push(position);
  }
  // Pop the position
  popPosition() {
    this.positionContainer.pop();
  }

  // GameBasics start - Starting the loop
  start() {
    //Specify the interval in milliseconds
    setInterval(function () {
      gameLoop(play);
    }, this.setting.updateSeconds * 1000); //0,01666667 sec * 1000 = 16,67 ms
    //Go into the Opening position
    this.goToPosition(new OpeningPosition());
  }

  // Notifies the game when a key is pressed
  keyDown(keyboardCode) {
    // store the pressed key in 'pressedKeys'
    this.pressedKeys[keyboardCode] = true;
    //  it calls the present position's keyDown function
    if (this.presentPosition() && this.presentPosition().keyDown) {
      this.presentPosition().keyDown(this, keyboardCode);
    }
  }
  //  Notifies the game when a key is released
  keyUp(keyboardCode) {
    // delete the released key from 'pressedKeys'
    delete this.pressedKeys[keyboardCode];
  }
}

// Game Loop
function gameLoop(play) {
  let presentPosition = play.presentPosition();

  if (presentPosition) {
    // update
    if (presentPosition.update) {
      presentPosition.update(play);
    }
    // draw
    if (presentPosition.draw) {
      presentPosition.draw(play);
    }
  }
}

// Create a GameBasics object
const play = new GameBasics(canvas);
play.sounds = new Sounds();
play.sounds.init();
play.start();

// Keyboard events listening
window.addEventListener("keydown", function (e) {
  const keyboardCode = e.code; // Get the event code
  if (
    keyboardCode == "Space" ||
    keyboardCode == "ArrowLeft" ||
    keyboardCode == "ArrowRight"
  ) {
    e.preventDefault(); // Prevent the default behavior of the space and arrow keys
  }
  play.keyDown(keyboardCode);
});

window.addEventListener("keyup", function (e) {
  const keyboardCode = e.code; // Get the event code
  play.keyUp(keyboardCode);
});

// for phone friendly:
// Touch control elements
const leftButton = document.createElement('div');
const rightButton = document.createElement('div');
const fireButton = document.createElement('div');

// Style and position the buttons
leftButton.style.cssText = 'position: absolute; bottom: 30px; left: 30px; width: 80px; height: 80px; background-color: rgba(215, 223, 1, 0.5); border-radius: 50%;';
rightButton.style.cssText = 'position: absolute; bottom: 30px; left: 130px; width: 80px; height: 80px; background-color: rgba(215, 223,1, 0.5); border-radius: 50%;';
fireButton.style.cssText = 'position: absolute; bottom: 30px; right: 30px; width: 80px; height: 80px; background-color: rgba(215, 223, 1, 0.5); border-radius: 50%;';

// Add a visible label to the buttons
leftButton.innerHTML = '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; color: white;">&larr;</span>';
rightButton.innerHTML = '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; color: white;">&rarr;</span>';
fireButton.innerHTML = '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; color: white;">FIRE</span>';


document.body.appendChild(leftButton);
document.body.appendChild(rightButton);
document.body.appendChild(fireButton);


// Touch event handlers
function handleTouchStart(e) {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    // Check if touch is within the bounds of the left button
    const leftButtonRect = leftButton.getBoundingClientRect();
    if (touchX >= leftButtonRect.left && touchX <= leftButtonRect.right &&
        touchY >= leftButtonRect.top && touchY <= leftButtonRect.bottom) {
        play.keyDown('ArrowLeft');
    }

    // Check if touch is within the bounds of the right button
    const rightButtonRect = rightButton.getBoundingClientRect();
    if (touchX >= rightButtonRect.left && touchX <= rightButtonRect.right &&
        touchY >= rightButtonRect.top && touchY <= rightButtonRect.bottom) {
        play.keyDown('ArrowRight');
    }

    // Check if touch is within the bounds of the fire button
    const fireButtonRect = fireButton.getBoundingClientRect();
    if (touchX >= fireButtonRect.left && touchX <= fireButtonRect.right &&
        touchY >= fireButtonRect.top && touchY <= fireButtonRect.bottom) {
        play.keyDown('Space');
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    play.keyUp('ArrowLeft');
    play.keyUp('ArrowRight');
    play.keyUp('Space');
}

// Add touch event listeners to the canvas
canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

// Add touch event listeners to the buttons as well
leftButton.addEventListener("touchstart", (e) => { e.preventDefault(); play.keyDown('ArrowLeft'); }, { passive: false });
leftButton.addEventListener("touchend", (e) => { e.preventDefault(); play.keyUp('ArrowLeft'); }, { passive: false });

rightButton.addEventListener("touchstart", (e) => { e.preventDefault(); play.keyDown('ArrowRight'); }, { passive: false });
rightButton.addEventListener("touchend", (e) => { e.preventDefault(); play.keyUp('ArrowRight'); }, { passive: false });

fireButton.addEventListener("touchstart", (e) => { e.preventDefault(); play.keyDown('Space'); }, { passive: false });
fireButton.addEventListener("touchend", (e) => { e.preventDefault(); play.keyUp('Space'); }, { passive: false });
