class PausePosition {
  constructor() {}

  draw(play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font = "40px Inria Serif";
    ctx.fillStyle = '#ffffff';
    ctx.fillText("Game controls reminder", play.width / 2, play.height/2 - 120);
    ctx.fillStyle = '#D7DF01';
    ctx.font="30px Inria Serif";
    ctx.fillText("On Mobile: Use on-screen buttons", play.width / 2, play.height/2 - 80);
    ctx.font="36px Inria Serif";
    ctx.fillText("Left Arrow : Move Left", play.width / 2, play.height/2 - 30);
    ctx.fillText("Right Arrow : Move Right", play.width / 2, play.height/2 + 10);
    ctx.fillText("Space : Fire", play.width / 2, play.height/2 + 50);
  }
  keyDown(play, keyboardCode) {
    // keyDown method code goes here
    if (keyboardCode === "KeyP") {
      play.popPosition();
    } else if (keyboardCode === "Escape") {
      play.pushPosition(new OpeningPosition());
    }
  }
}
