import { useEffect, useMemo, useRef, useState } from 'react';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 450;
const ITEM_WIDTH = 50;
const ITEM_HEIGHT = 50;
const STAR_WIDTH = 40;
const STAR_HEIGHT = 40;
const STAR_MARGIN = 5;

interface Data {
  value: number;
  isSelected: boolean;
  isRemoved: boolean;
  removedBy: null | string;
}

export default function PlayGround() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [requestId, setRequestId] = useState<number>(0);

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
  }, [requestId]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

    let isDragging = false;
    /**
     * start x
     * start y
     * end x
     * end y
     */
    let dragPosition = [-1, -1, -1, -1];
    let selectedIndexes = [0, 0, 0, 0];

    const imageStar = new Image();
    imageStar.src = './assets/images/star.png';
    imageStar.addEventListener('load', draw);

    function draw() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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

      if (isDragging) {
        ctx.fillStyle = '#fffa';
        ctx.fillRect(
          dragPosition[0],
          dragPosition[1],
          dragPosition[2],
          dragPosition[3]
        );
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(
          dragPosition[0],
          dragPosition[1],
          dragPosition[2],
          dragPosition[3]
        );
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

      if (sum === 10) {
        for (let i = ly; i <= ry; i++) {
          for (let j = lx; j <= rx; j++) {
            data[i][j].isRemoved = true;
            data[i][j].removedBy = 'PLAYER_1';
          }
        }
      }

      setDataSelected(false);

      draw();
    }

    function handleMouseMove({ layerX, layerY }: any) {
      if (!isDragging) return;
      dragPosition[2] = layerX - dragPosition[0];
      dragPosition[3] = layerY - dragPosition[1];

      setDataSelected(false);

      selectedIndexes[0] = Math.max(
        Math.floor(Math.min(dragPosition[0], layerX) / ITEM_WIDTH),
        0
      );
      selectedIndexes[1] = Math.max(
        Math.floor(Math.min(dragPosition[1], layerY) / ITEM_HEIGHT),
        0
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

    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return function () {
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className='canvas'
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    />
  );
}
