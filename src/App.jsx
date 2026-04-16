import { useState, useCallback, useEffect } from 'react';
import CubeCanvas from './components/CubeCanvas';
import { createSolvedCube, applyMove, scrambleCube, MOVES } from './lib/cubeUtils';

const SOLVED_STATE = createSolvedCube();

function App() {
  const [cubeState, setCubeState] = useState(SOLVED_STATE);
  const [scramble, setScramble] = useState('');
  const [solution, setSolution] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [solveTime, setSolveTime] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState(null);
  const [timerElapsed, setTimerElapsed] = useState(0);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerElapsed(Date.now() - timerStart);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerStart]);

  const handleFaceClick = useCallback((move) => {
    if (isAnimating) return;
    setCubeState(prev => applyMove(prev, move));
  }, [isAnimating]);

  const handleScramble = () => {
    const { cube, scramble: scr } = scrambleCube(20);
    setCubeState(cube);
    setScramble(scr);
    setSolution([]);
    setCurrentMoveIndex(-1);
    setSolveTime(null);
  };

  const handleReset = () => {
    setCubeState(SOLVED_STATE);
    setScramble('');
    setSolution([]);
    setCurrentMoveIndex(-1);
    setSolveTime(null);
    setTimerRunning(false);
    setTimerStart(null);
    setTimerElapsed(0);
  };

  const handleSolve = async () => {
    setIsAnimating(true);
    setSolveTime(Date.now());
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const mockSolution = scramble ? scramble.split(' ').reverse() : ['U', 'R', 'F', 'R\'', 'U\'', 'R', 'U', 'F\''];
    setSolution(mockSolution);
    setCurrentMoveIndex(0);
    
    setIsAnimating(false);
  };

  const handleStep = (direction) => {
    if (direction === 'next' && currentMoveIndex < solution.length - 1) {
      setCubeState(prev => applyMove(prev, solution[currentMoveIndex + 1]));
      setCurrentMoveIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentMoveIndex > 0) {
      setCubeState(prev => applyMove(prev, solution[currentMoveIndex]));
      setCurrentMoveIndex(prev => prev - 1);
    }
  };

  const handleTimerStart = () => {
    setTimerStart(Date.now());
    setTimerRunning(true);
  };

  const handleTimerStop = () => {
    setTimerRunning(false);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Rubik's Cube Solver</h1>
        <div className="timer-display">
          {formatTime(timerElapsed)}
        </div>
      </header>

      <main className="main">
        <div className="cube-section">
          <CubeCanvas 
            cubeState={cubeState} 
            onMove={handleFaceClick}
            isAnimating={isAnimating}
            currentMoveIndex={currentMoveIndex}
            solution={solution}
          />
        </div>

        <div className="controls-section">
          <div className="button-group">
            <button onClick={handleScramble} disabled={isAnimating} className="btn btn-scramble">
              Scramble
            </button>
            <button onClick={handleReset} className="btn btn-reset">
              Reset
            </button>
            <button onClick={handleSolve} disabled={isAnimating} className="btn btn-solve">
              Solve
            </button>
          </div>

          {scramble && (
            <div className="scramble-display">
              <span className="label">Scramble:</span>
              <span className="value">{scramble}</span>
            </div>
          )}

          {solution.length > 0 && (
            <div className="solution-section">
              <div className="solution-controls">
                <button 
                  onClick={() => handleStep('prev')} 
                  disabled={currentMoveIndex <= 0}
                  className="btn btn-step"
                >
                  ◀ Prev
                </button>
                <span className="move-counter">
                  {currentMoveIndex >= 0 ? currentMoveIndex + 1 : 0} / {solution.length}
                </span>
                <button 
                  onClick={() => handleStep('next')} 
                  disabled={currentMoveIndex >= solution.length - 1}
                  className="btn btn-step"
                >
                  Next ▶
                </button>
              </div>
              <div className="solution-moves">
                {solution.map((move, i) => (
                  <span 
                    key={i} 
                    className={`move ${i === currentMoveIndex ? 'active' : ''}`}
                  >
                    {move}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="manual-controls">
            <span className="label">Manual Moves:</span>
            <div className="moves-grid">
              {MOVES.map(move => (
                <button 
                  key={move} 
                  onClick={() => handleFaceClick(move)}
                  disabled={isAnimating}
                  className="btn btn-move"
                >
                  {move}
                </button>
              ))}
            </div>
          </div>

          <div className="timer-controls">
            <span className="label">Timer:</span>
            <div className="timer-buttons">
              <button 
                onClick={timerRunning ? handleTimerStop : handleTimerStart}
                className={`btn ${timerRunning ? 'btn-stop' : 'btn-start'}`}
              >
                {timerRunning ? 'Stop' : 'Start'}
              </button>
              <button onClick={() => { setTimerElapsed(0); setTimerStart(null); }} className="btn btn-reset">
                Clear
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;