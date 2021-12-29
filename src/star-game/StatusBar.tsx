import { useEffect, useRef } from 'react';
import { CANVAS_WIDTH, STATUS_BAR_HEIGHT } from './constants';

export interface StatusBarProps {
  time?: number;
  score?: number;
}

export default function StatusBar({ time = 120, score = 0 }: StatusBarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

    const refreshImage = new Image();
    refreshImage.src = './assets/images/refresh.png';
    refreshImage.onload = draw;

    const homeImage = new Image();
    homeImage.src = './assets/images/home.png';
    refreshImage.onload = draw;

    function draw() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, STATUS_BAR_HEIGHT);

      ctx.font = '30px Passion One';
      ctx.fillStyle = 'black';
      ctx.fillText('Time', 10, 35);

      ctx.fillText(`${time}`, 100, 35);

      ctx.fillStyle = '#aaa';
      ctx.fillRect(150, 20, 300, 10);

      ctx.fillStyle = '#ccc';
      ctx.fillRect(150, 20, (time / 120) * 300, 10);

      ctx.fillStyle = 'black';
      ctx.fillText('score', 550, 35);

      ctx.fillText(`${score}`, 630, 35);

      ctx.drawImage(refreshImage, 810, 10, 30, 30);
      ctx.drawImage(homeImage, 860, 10, 30, 30);
    }

    draw();
  }, [time, score]);

  return (
    <canvas
      ref={canvasRef}
      className='status-bar'
      width={CANVAS_WIDTH}
      height={STATUS_BAR_HEIGHT}
    />
  );
}
