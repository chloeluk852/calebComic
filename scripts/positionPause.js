class PausePosition {
  constructor() {}

  draw(play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font = "40px Inria Serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(
      "YOUR FIGHTING MEANS NOTHING -Larry",
      play.width / 2,
      play.height / 2 - 300
    );

    ctx.fillStyle = "#5CDB95";
    ctx.font = "36px Inria Serif";
    ctx.fillText(
      "P: resume total annhilation of larry",
      play.width / 2,
      play.height / 2 - 250
    );
    ctx.fillText("ESC: Quit Game", play.width / 2, play.height / 2 - 210);

    ctx.font = "40px Inria Serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      "Game controls reminder",
      play.width / 2,
      play.height / 2 - 120
    );
    ctx.fillStyle = "#5CDB95";
    ctx.font = "36px Inria Serif";
    ctx.fillText(
      "Left Arrow : Move Left",
      play.width / 2,
      play.height / 2 - 70
    );
    ctx.fillText(
      "Right Arrow : Move Right",
      play.width / 2,
      play.height / 2 - 30
    );
    ctx.fillText("Space : Fire", play.width / 2, play.height / 2 + 10);
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
