class InGamePosition {
  constructor(setting, level) {
    this.setting = setting;
    this.level = level;
    this.object = null;
    this.spaceship = null;
    this.bullets = [];
    this.lastBulletTime = null;
    this.ufos = [];
    this.bombs = [];
    this.laserUsed = false; // Track if laser has been used
    this.laserActive = false; // Track if laser is currently active
    this.laserEndTime = null; // Track when the laser should end
  }

  entry(play) {
    this.spaceship_image = new Image(); // spaceship image
    this.ufo_image = new Image(); // ufo image
    this.upSec = this.setting.updateSeconds;
    this.direction = 1;
    this.horizontalMoving = 1;
    this.verticalMoving = 0;
    this.ufosAreSinking = false;
    this.ufoPresentSinkingValue = 0;

    let presentLevel = this.level;
    // 1. UFO speed
    this.ufoSpeed = this.setting.ufoSpeed + presentLevel * 7; //Level1: 35 + (1*7) = 42, Level2: 42 + (2*7) = 49, ...
    // 2. Bomb falling speed
    this.bombSpeed = this.setting.bombSpeed + presentLevel * 10; //Level1: 75 + (1*10) = 85, Level2: 75 + (2*10) = 95, ...
    // 3. Bomb dropping frequency
    this.bombFrequency = this.setting.bombFrequency + presentLevel * 0.05; //Level1: 0.05 + (1*0.05) = 0.1, Level2: 0.05 + (2*0.05) = 0.15 ...

    this.spaceshipSpeed = this.setting.spaceshipSpeed;

    this.object = new Objects();
    this.spaceship = this.object.spaceship(
      play.width / 2,
      play.playBoundaries.bottom,
      this.spaceship_image
    );

    const rows = this.setting.ufoRows;
    const columns = this.setting.ufoColumns;
    const ufosInitial = [];

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        this.object = new Objects();
        let x = play.width / 2 - (columns - 1) * 25 + column * 50;
        let y = play.playBoundaries.top + 30 + row * 30;
        ufosInitial.push(
          this.object.ufo(x, y, row, column, this.ufo_image, this.level)
        );
      }
    }
    this.ufos = ufosInitial;
  }

  draw(play) {
    ctx.clearRect(0, 0, play.width, play.height);

    ctx.drawImage(
      this.spaceship_image,
      this.spaceship.x - this.spaceship.width / 2,
      this.spaceship.y - this.spaceship.height / 2
    );

    // Draw Bullets
    ctx.fillStyle = "#ff0000";
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      ctx.fillRect(bullet.x - 1, bullet.y - 6, 2, 6);
    }

    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      ctx.drawImage(
        this.ufo_image,
        ufo.x - ufo.width / 2,
        ufo.y - ufo.height / 2
      );
    }
    // Draw Bombs
    ctx.fillStyle = "#FE2EF7"; // Set fill style for bombs
    for (let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      ctx.fillRect(bomb.x - 2, bomb.y, 4, 6);
    }
    // Draw Laser
    if (this.laserActive) {
      ctx.fillStyle = "#00FF00"; // Green color for the laser
      ctx.fillRect(this.spaceship.x - 2, 0, 4, play.height); // Draw a vertical line from top to bottom
    }

    // Draw Sound & Mute info
    ctx.font = "16px Inria Serif";

    ctx.fillStyle = "#424242";
    ctx.textAlign = "left";
    ctx.fillText(
      "Press S to switch sound effects ON/OFF.  Sound:",
      play.playBoundaries.left,
      play.playBoundaries.bottom + 70
    );

    let soundStatus = play.sounds.muted ? "OFF" : "ON";
    ctx.fillStyle = play.sounds.muted ? "#FF0000" : "#0B6121";
    ctx.fillText(
      soundStatus,
      play.playBoundaries.left + 375,
      play.playBoundaries.bottom + 70
    );

    ctx.fillStyle = "#424242";
    ctx.textAlign = "right";
    ctx.fillText(
      "Press P to Pause.",
      play.playBoundaries.right,
      play.playBoundaries.bottom + 70
    );

    // Draw Score & Level
    ctx.textAlign = "center";
    ctx.fillStyle = "#BDBDBD";

    ctx.font = "bold 24px Inria Serif";
    ctx.fillText(
      "Score",
      play.playBoundaries.right,
      play.playBoundaries.top - 75
    );
    ctx.font = "bold 30px Inria Serif";
    ctx.fillText(
      play.score,
      play.playBoundaries.right,
      play.playBoundaries.top - 25
    );

    ctx.font = "bold 24px Inria Serif";
    ctx.fillText(
      "Level",
      play.playBoundaries.left,
      play.playBoundaries.top - 75
    );
    ctx.fillText(
      play.level,
      play.playBoundaries.left,
      play.playBoundaries.top - 25
    );

    // Draw Laser info
    ctx.fillStyle = "#424242";
    ctx.textAlign = "left";
    ctx.font = "16px Inria Serif";
    ctx.fillText(
      "Press G to use laser (once per level).",
      play.playBoundaries.left,
      play.playBoundaries.bottom + 90
    );

    let laserStatus = this.laserUsed ? "Used" : "Available";
    ctx.fillStyle = this.laserUsed ? "#FF0000" : "#0B6121";
    ctx.fillText(
      laserStatus,
      play.playBoundaries.left + 375,
      play.playBoundaries.bottom + 90
    );
  }

  update(play) {
    const spaceship = this.spaceship;
    const spaceshipSpeed = this.spaceshipSpeed;
    const upSec = this.setting.updateSeconds;
    const bullets = this.bullets;
    // UFOS bombing
    // Frontline UFOs - which are at the bottom of each column
    const frontLineUFOs = [];

    // Keyboard events
    if (play.pressedKeys["ArrowLeft"]) {
      spaceship.x -= spaceshipSpeed * upSec;
    }
    if (play.pressedKeys["ArrowRight"]) {
      spaceship.x += spaceshipSpeed * upSec;
    }
    if (play.pressedKeys["Space"]) {
      this.shoot();
    }

    // Keep spaceship in playing area
    if (spaceship.x < play.playBoundaries.left) {
      spaceship.x = play.playBoundaries.left;
    }
    if (spaceship.x > play.playBoundaries.right) {
      spaceship.x = play.playBoundaries.right;
    }

    // Handle laser activation
    if (this.laserActive && new Date().getTime() >= this.laserEndTime) {
      this.laserActive = false; // Deactivate laser after duration
    }

    // Check laser collisions
    if (this.laserActive) {
      const laserX = this.spaceship.x;
      for (let i = this.ufos.length - 1; i >= 0; i--) {
        let ufo = this.ufos[i];
        if (
          ufo.x - ufo.width / 2 <= laserX &&
          ufo.x + ufo.width / 2 >= laserX
        ) {
          this.ufos.splice(i, 1); // Remove UFO
          play.score += this.setting.pointsPerUFO;
          play.sounds.playSound("ufoDeath");
        }
      }
    }

    //  Moving bullets
    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i];
      bullet.y -= upSec * this.setting.bulletSpeed;
      // If our bullet flies out from the canvas, it will be cleared
      if (bullet.y < 0) {
        bullets.splice(i--, 1);
      }
    }

    let reachedSide = false;

    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      let newX =
        ufo.x + this.ufoSpeed * upSec * this.direction * this.horizontalMoving;
      let newY = ufo.y + this.ufoSpeed * upSec * this.verticalMoving;
      if (newX > play.playBoundaries.right || newX < play.playBoundaries.left) {
        this.direction *= -1;
        reachedSide = true;
        this.horizontalMoving = 0;
        this.verticalMoving = 1;
        this.ufosAreSinking = true;
      }
      if (!reachedSide) {
        ufo.x = newX;
        ufo.y = newY;
      }
    }

    if (this.ufosAreSinking) {
      this.ufoPresentSinkingValue += this.ufoSpeed * upSec;
      if (this.ufoPresentSinkingValue >= this.setting.ufoSinkingValue) {
        this.ufosAreSinking = false;
        this.verticalMoving = 0;
        this.horizontalMoving = 1;
        this.ufoPresentSinkingValue = 0;
      }
    }

    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      if (
        !frontLineUFOs[ufo.column] ||
        frontLineUFOs[ufo.column].row < ufo.row
      ) {
        frontLineUFOs[ufo.column] = ufo;
      }
    }

    for (let i = 0; i < this.setting.ufoColumns; i++) {
      let ufo = frontLineUFOs[i];
      if (!ufo) {
        continue;
      }
      let chance = this.bombFrequency * upSec;
      this.object = new Objects();
      if (chance > Math.random()) {
        this.bombs.push(this.object.bomb(ufo.x, ufo.y + ufo.height / 2));
        // console.log("UFO (column:" + ufo.column + ", row:" + ufo.row + ") is bombing!");
      }
    }

    // Moving bombs
    for (let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      bomb.y += upSec * this.bombSpeed;
      if (bomb.y > play.height) {
        this.bombs.splice(i, 1);
        i--; // Decrement i to adjust for the removed element
      }
    }

    // Check collision
    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      let collision = false;

      for (let j = 0; j < this.bullets.length; j++) {
        let bullet = this.bullets[j];
        // collision check
        if (
          bullet.x >= ufo.x - ufo.width / 2 &&
          bullet.x <= ufo.x + ufo.width / 2 &&
          bullet.y >= ufo.y - ufo.height / 2 &&
          bullet.y <= ufo.y + ufo.height / 2
        ) {
          // if there is collision we delete the bullet and set collision true
          bullets.splice(j, 1);
          j--; // Decrease j to adjust for the removed bullet
          collision = true;
        }
      }
      // if there is collision we delete the UFO
      if (collision) {
        this.ufos.splice(i, 1);
        i--; // Decrease i to adjust for the removed UFO
        play.sounds.playSound("ufoDeath");
        play.score += this.setting.pointsPerUFO;
      }
    }

    for (let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      if (
        bomb.x + 2 >= spaceship.x - spaceship.width / 2 &&
        bomb.x - 2 <= spaceship.x + spaceship.width / 2 &&
        bomb.y + 6 >= spaceship.y - spaceship.height / 2 &&
        bomb.y <= spaceship.y + spaceship.height / 2
      ) {
        // Bomb hit the spaceship

        // if there is collision we delete the bomb
        this.bombs.splice(i, 1);
        i--; // Prevent skipping the current element
        play.sounds.playSound("explosion");
        // play.goToPosition(new OpeningPosition());
        play.shields--; //one hit
      }
    }

    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      if (
        ufo.x + ufo.width / 2 >= spaceship.x - spaceship.width / 2 &&
        ufo.x - ufo.width / 2 <= spaceship.x + spaceship.width / 2 &&
        ufo.y + ufo.height / 2 >= spaceship.y - spaceship.height / 2 &&
        ufo.y - ufo.height / 2 <= spaceship.y + spaceship.height / 2
      ) {
        // Collision detected between UFO and spaceship
        play.sounds.playSound("explosion");
        // play.goToPosition(new OpeningPosition());
        // return; // Exit the function to prevent further updates
        play.shields = -1; //instant death
      }
    }

    // Spaceship death check
    if (play.shields < 0) {
      // play.goToPosition(new OpeningPosition());
      play.goToPosition(new GameOverPosition());
    }

    // Level completed
    if (this.ufos.length == 0) {
      play.level += 1;
      play.goToPosition(new TransferPosition(play.level));
    }
  }

  shoot() {
    // Allows to shoot when there was no bullet shot or when the time between the last shot and now is more than the bullet frequency
    if (
      this.lastBulletTime === null ||
      new Date().getTime() - this.lastBulletTime >
        this.setting.bulletMaxFrequency
    ) {
      this.object = new Objects();
      this.bullets.push(
        this.object.bullet(
          this.spaceship.x,
          this.spaceship.y - this.spaceship.height / 2,
          this.setting.bulletSpeed
        )
      );
      this.lastBulletTime = new Date().getTime();
      play.sounds.playSound("shot");
    }
  }

  keyDown(play, keyboardCode) {
    if (keyboardCode === "KeyS") {
      play.sounds.muteSwitch();
    } else if (keyboardCode === "KeyP") {
      play.pushPosition(new PausePosition());
    } else if (keyboardCode === "KeyG" && !this.laserUsed) {
      this.useLaser();
    }
  }

  useLaser() {
    if (this.laserUsed) return;

    this.laserActive = true;
    this.laserUsed = true;
    this.laserEndTime = new Date().getTime() + 500; // Laser lasts for 500ms (0.5 seconds)
    play.sounds.playSound("laser");
  }
}
