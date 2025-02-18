class TransferPosition {
  constructor(level) {
    this.level = level;
    this.fontSize = 140;
    this.fontColor = 255;
  }

  draw(play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font = this.fontSize + "px Inria Serif";
    ctx.textAlign = "center";
    ctx.fillStyle =
      "rgba(55, " + this.fontColor + ", " + this.fontColor + ", 1)";
    ctx.fillText(
      "Get ready for level " + this.level,
      play.width / 2,
      play.height / 2
    );
  }

  update(play) {
    this.fontSize -= 1;
    this.fontColor -= 1.5;
    if (this.fontSize < 1) {
      //  if the condition is met it will go to the InGamePosition
      play.goToPosition(new InGamePosition(play.setting, this.level));
    }
  }
}
