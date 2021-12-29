import './StarGame.css';
import Header from './Header';
import PlayGround from './PlayGround';

export default function StarGame() {
  return (
    <div className='star-game-container'>
      <Header />
      <PlayGround />
    </div>
  );
}
