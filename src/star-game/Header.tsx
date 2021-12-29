import { useEffect, useRef } from 'react';
import { CANVAS_WIDTH, HEADER_HEIGHT } from './constants';

export default function Header() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

    function draw() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);

      ctx.font = '30px Passion One';
      ctx.fillStyle = 'black';
      ctx.fillText('Time', 0, 0, 100);
    }

    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='header'
      width={CANVAS_WIDTH}
      height={HEADER_HEIGHT}
    />
  );
}
