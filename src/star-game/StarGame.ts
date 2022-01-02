export default class StarGame {
  /**
   * 120s
   */
  static PLAY_TIME = 120;

  private imageStar = new Image();
  private imageRestart = new Image();

  private ctx: CanvasRenderingContext2D;
  private startedAt: Date = new Date();

  private isTimeOver = true;
  private timeOverTimeout: NodeJS.Timeout | null = null;
  onTimeOver?: () => void;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    this.imageStar.src = './assets/images/star.png';
    this.imageRestart.src = './assets/images/refresh.png';
  }

  start(startedAt: Date = new Date()) {
    this.startedAt = startedAt;
    this.isTimeOver = false;

    if (this.timeOverTimeout) {
      clearTimeout(this.timeOverTimeout);
      this.timeOverTimeout = null;
    }

    this.timeOverTimeout = setTimeout(() => {
      this.isTimeOver = true;
      if (this.onTimeOver) this.onTimeOver();
    }, StarGame.PLAY_TIME * 1000);
  }
}
