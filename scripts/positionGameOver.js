class GameOverPosition {
  constructor() {}
  draw() {
    // Clear screen
    ctx.clearRect(0, 0, play.width, play.height);

    // Draw game over text
    ctx.font = "40px Inria Serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("HAHA YOU'RE A LOSER.", play.width / 2, play.height / 2 - 120);

    //Draw level and score
    ctx.font = "36px Inria Serif";
    ctx.fillStyle = "#EDF5E1";
    ctx.fillText(
      "You've reached level " +
        play.level +
        ". Number of points " +
        play.score +
        ".",
      play.width / 2,
      play.height / 2 - 40
    );

    //Draw instruction
    ctx.font = "36px Inria Serif";
    ctx.fillStyle = "#EDF5E1";
    ctx.fillText(
      "Press 'Space' to continue.",
      play.width / 2,
      play.height / 2 + 40
    );
  }
  keyDown(play, keyboardCode) {
    if (keyboardCode === "Space") {
      play.goToPosition(new OpeningPosition());
    }
  }
}
