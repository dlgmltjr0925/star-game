import { useEffect, useMemo, useRef } from 'react';
import {
  PLAY_GROUND_HEIGHT,
  CANVAS_WIDTH,
  ITEM_HEIGHT,
  ITEM_WIDTH,
  STAR_HEIGHT,
  STAR_MARGIN,
  STAR_WIDTH,
  PLAY_TIME,
} from './constants';

export interface Data {
  value: number;
  isSelected: boolean;
  isRemoved: boolean;
  removedBy: null | string;
}

export interface PlayGroundProps {
  startedAt: Date;
  onCorrect?: (score: number) => void;
  onClickRefresh?: () => void;
}

export default function PlayGround({
  startedAt,
  onCorrect,
  onClickRefresh,
}: PlayGroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const data = useMemo<Data[][]>(() => {
    return Array.from({ length: 9 }, () =>
      Array.from({ length: 18 }, () => ({
        value: Math.floor(Math.random() * 8.9) + 1,
        isSelected: false,
        isRemoved: false,
        removedBy: null,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

    let isDragging = false;
    let isTimeOver = false;
    /**
     * start x
     * start y
     * end x
     * end y
     */
    let dragPosition = [-1, -1, -1, -1];
    let selectedIndexes = [0, 0, 0, 0];
    let score = 0;
    const endTime = new Date(startedAt);
    endTime.setSeconds(endTime.getSeconds() + PLAY_TIME);

    const timeOverTimeout = setTimeout(() => {
      isTimeOver = true;
      draw();
    }, PLAY_TIME * 1000);

    const imageStar = new Image();
    imageStar.src = './assets/images/star.png';
    imageStar.addEventListener('load', draw);

    const imageRefresh = new Image();
    imageRefresh.src = './assets/images/refresh.png';

    function draw() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, PLAY_GROUND_HEIGHT);
      ctx.fillStyle = 'black';
      ctx.font = '22px Passion One';
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          const star = data[i][j];
          if (star.isRemoved) continue;
          let sx = j * ITEM_WIDTH + STAR_MARGIN;
          let sy = i * ITEM_HEIGHT + STAR_MARGIN;
          ctx.drawImage(imageStar, sx, sy, STAR_WIDTH, STAR_HEIGHT);
          sx += 15;
          sy += 28;
          ctx.fillStyle = star.isSelected ? 'blue' : 'black';
          ctx.fillText(`${data[i][j].value}`, sx, sy);
        }
      }

      if (isDragging && !isTimeOver) {
        const [sx, sy, width, height] = dragPosition;
        ctx.fillStyle = '#fffa';
        ctx.fillRect(sx, sy, width, height);
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(sx, sy, width, height);
      }

      if (isTimeOver) {
        ctx.fillStyle = '#fffe';
        ctx.fillRect(300, 100, 300, 250);
        ctx.fillStyle = 'black';
        ctx.font = '40px Passion One';
        ctx.fillText('Score', 410, 170);
        ctx.fillText(`${score}`, 450 - `${score}`.length * 10, 220);
        ctx.drawImage(imageRefresh, 430, 250, 40, 40);
      }
    }

    function setDataSelected(isSelected: boolean) {
      const [lx, ly, rx, ry] = selectedIndexes;

      for (let i = ly; i <= ry; i++) {
        for (let j = lx; j <= rx; j++) {
          data[i][j].isSelected = isSelected;
        }
      }
    }

    function handleMouseDown({ layerX, layerY }: any) {
      if (isTimeOver) return;
      isDragging = true;
      dragPosition = [layerX, layerY, 0, 0];
    }

    function handleMouseUp() {
      isDragging = false;
      dragPosition = [-1, -1, -1, -1];

      let sum = 0;
      let count = 0;

      const [lx, ly, rx, ry] = selectedIndexes;

      for (let i = ly; i <= ry; i++) {
        for (let j = lx; j <= rx; j++) {
          if (!data[i][j].isRemoved) {
            sum += data[i][j].value;
            count++;
          }
        }
      }

      if (sum === 10 && !isTimeOver) {
        for (let i = ly; i <= ry; i++) {
          for (let j = lx; j <= rx; j++) {
            data[i][j].isRemoved = true;
            data[i][j].removedBy = 'PLAYER_1';
          }
        }

        score += count;

        if (onCorrect) onCorrect(score);
      }

      setDataSelected(false);

      draw();
    }

    function handleMouseMove({ layerX, layerY }: any) {
      if (!isDragging) return;
      dragPosition[2] = layerX - dragPosition[0];
      dragPosition[3] = layerY - dragPosition[1];

      setDataSelected(false);

      selectedIndexes[0] = Math.floor(
        Math.min(dragPosition[0], Math.max(layerX, 0)) / ITEM_WIDTH
      );
      selectedIndexes[1] = Math.floor(
        Math.min(dragPosition[1], Math.max(layerY, 0)) / ITEM_HEIGHT
      );

      selectedIndexes[2] = Math.floor(
        Math.max(dragPosition[0], layerX) / ITEM_WIDTH
      );
      selectedIndexes[3] = Math.floor(
        Math.max(dragPosition[1], layerY) / ITEM_HEIGHT
      );

      setDataSelected(true);

      draw();
    }

    function handleClick({ layerX, layerY }: any) {
      if (
        isTimeOver &&
        layerX > 425 &&
        layerX < 475 &&
        layerY > 245 &&
        layerY < 295 &&
        onClickRefresh
      ) {
        onClickRefresh();
      }
    }

    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('click', handleClick);
    window.addEventListener('mouseup', handleMouseUp);

    return function () {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
        canvasRef.current.removeEventListener('click', handleClick);
      }
      window.removeEventListener('mouseup', handleMouseUp);

      if (timeOverTimeout) {
        clearTimeout(timeOverTimeout);
      }
    };
  }, [data, onClickRefresh, onCorrect, startedAt]);

  return (
    <canvas
      ref={canvasRef}
      className='playground'
      width={CANVAS_WIDTH}
      height={PLAY_GROUND_HEIGHT}
    />
  );
}
