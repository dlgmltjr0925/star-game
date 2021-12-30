import { useEffect, useRef, useState } from 'react';
import { CANVAS_WIDTH, PLAY_TIME, STATUS_BAR_HEIGHT } from './constants';

export interface StatusBarProps {
  startedAt: Date;
  score?: number;
  onClickRefresh?: () => void;
}

export default function StatusBar({
  startedAt,
  score = 0,
  onClickRefresh,
}: StatusBarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const endTime = new Date(startedAt);
    endTime.setSeconds(endTime.getSeconds() + PLAY_TIME);
    setTime(PLAY_TIME);

    let interval: NodeJS.Timer = setInterval(() => {
      const now = new Date();
      const time = Math.floor((endTime.valueOf() - now.valueOf()) / 1000);

      setTime(time);

      if (time <= 0 && interval) {
        clearInterval(interval);
      }
    }, 250);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startedAt]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

    const refreshImage = new Image();
    refreshImage.src = './assets/images/refresh.png';
    refreshImage.onload = () => {
      ctx.drawImage(refreshImage, 810, 10, 30, 30);
    };

    const homeImage = new Image();
    homeImage.src = './assets/images/home.png';
    homeImage.onload = () => {
      ctx.drawImage(homeImage, 860, 10, 30, 30);
    };

    function handleClick({ layerX, layerY }: any) {
      if (layerX > 800 && layerX < 850) {
        if (onClickRefresh) onClickRefresh();
      } else if (layerY > 850) {
      }
    }

    canvasRef.current.addEventListener('click', handleClick);

    return () => {
      canvasRef.current?.removeEventListener('click', handleClick);
    };
  }, [onClickRefresh]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

    function draw() {
      ctx.clearRect(0, 0, CANVAS_WIDTH - 100, STATUS_BAR_HEIGHT);

      ctx.font = '30px Passion One';
      ctx.fillStyle = 'black';
      ctx.fillText('Time', 10, 35);

      ctx.fillText(`${time}`, 100, 35);

      ctx.fillStyle = '#aaa';
      ctx.fillRect(150, 20, 300, 10);

      ctx.fillStyle = time < 10 ? '#c66' : '#ccc';
      ctx.fillRect(150, 20, (time / PLAY_TIME) * 300, 10);

      ctx.fillStyle = 'black';
      ctx.fillText('score', 550, 35);

      ctx.fillText(`${score}`, 630, 35);
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
