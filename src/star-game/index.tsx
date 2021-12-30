import './StarGame.css';
import StatusBar from './StatusBar';
import PlayGround from './PlayGround';
import { useCallback, useState } from 'react';

export default function StarGame() {
  const [startedAt, setStartedAt] = useState<Date>(new Date());
  const [score, setScore] = useState<number>(0);

  const handleClickRefresh = useCallback(() => {
    setStartedAt(new Date());
    setScore(0);
  }, []);

  const handleCorrect = useCallback((score: number) => {
    setScore(score);
  }, []);

  return (
    <div className='star-game-container'>
      <StatusBar
        startedAt={startedAt}
        score={score}
        onClickRefresh={handleClickRefresh}
      />
      <PlayGround
        startedAt={startedAt}
        onCorrect={handleCorrect}
        onClickRefresh={handleClickRefresh}
      />
    </div>
  );
}
