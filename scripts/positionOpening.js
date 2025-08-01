class OpeningPosition {
  constructor() {}

  draw(play) {
    // Draw the opening screen
    ctx.clearRect(0, 0, play.width, play.height); // Clear the canvas

    // Draw the title
    ctx.font = "80px Inria Serif";
    ctx.textAlign = "center";
    const gradient = ctx.createLinearGradient(
      play.width / 2 - 180,
      play.height / 2,
      play.width / 2 + 180,
      play.height / 2
    );
    gradient.addColorStop("0", "#5CDB95");
    gradient.addColorStop("0.5", "#379683");
    gradient.addColorStop("1.0", "#5CDB95");
    ctx.fillStyle = gradient;
    ctx.fillText("Residence Massacre", play.width / 2, play.height / 2 - 70);

    // Draw start game instruction
    ctx.font = "40px Serif";
    ctx.fillStyle = '#D7DF01';
    ctx.fillText("Press 'Space' or tap 'FIRE' to start.", play.width / 2, play.height / 2);

    // Draw game controls instruction
    ctx.fillStyle = '#2e2f00';
    ctx.fillText("Game Controls", play.width / 2, play.height / 2 + 180);
    ctx.font = "30px Serif";
    ctx.fillText("Use on-screen buttons to move and fire on mobile", play.width / 2, play.height / 2 + 220);
    ctx.fillText("Left Arrow : Move Left", play.width / 2, play.height / 2 + 260);
    ctx.fillText("Right Arrow : Move Right", play.width / 2, play.height / 2 + 300);
    ctx.fillText("Space : Fire", play.width / 2, play.height / 2 + 340);
  }

  keyDown(play, keyboardCode) {
    // Start the game when the space bar is pressed
    if (keyboardCode == "Space") {
      play.level = 1;
      play.score = 0;
      play.shields = 1;
      play.goToPosition(new TransferPosition(play.level));
    }
  }
}
