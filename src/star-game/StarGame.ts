export default class StarGame {
  static imageStar = (new Image().src = './assets/images/star.png');

  ctx: CanvasRenderingContext2D;
  startedAt: Date;

  constructor(ctx: CanvasRenderingContext2D, startedAt: Date) {
    this.ctx = ctx;
    this.startedAt = startedAt;
  }
}
