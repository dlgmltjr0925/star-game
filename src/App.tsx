import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [requestId, setRequestId] = useState<number>(0);

  const data = useMemo(() => {
    return Array.from({ length: 9 }, () =>
      Array.from({ length: 18 }, () => Math.floor(Math.random() * 8.9) + 1)
    );
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className='canvas' width={1000} height={500} />
    </div>
  );
}

export default App;
