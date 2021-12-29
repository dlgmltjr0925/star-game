import './StarGame.css';
import StatusBar from './StatusBar';
import PlayGround from './PlayGround';
import { useCallback, useEffect, useState } from 'react';

export default function StarGame() {
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(120);

  const handleCorrect = useCallback(
    (count: number) => {
      console.log('here', count);
      setScore(score + count);
    },
    [score, setScore]
  );

  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        setTime(time - 1);
      }
    }, 1000);
  }, [time]);

  return (
    <div className='star-game-container'>
      <StatusBar time={time} score={score} />
      <PlayGround onCorrect={handleCorrect} />
    </div>
  );
}
