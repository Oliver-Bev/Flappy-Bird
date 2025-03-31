'use client';

import { useEffect, useState } from 'react';
import './globals.css';

interface Pipe {
  id: number;
  x: number;
  height: number;
}

export default function Home() {
  const [birdY, setBirdY] = useState(200);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);

  const gravity = 4;
  const jump = 50;
  const pipeGap = 150;
  const pipeWidth = 70;
  const gameWidth = 400;
  const gameHeight = 700;

  useEffect(() => {
    const handleJump = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning && !isGameOver) setIsRunning(true);
        setBirdY(prev => Math.max(prev - jump, 0));
      }
    };

    const handleTouch = () => {
      if (!isRunning && !isGameOver) setIsRunning(true);
      setBirdY(prev => Math.max(prev - jump, 0));
    };

    window.addEventListener('keydown', handleJump);
    window.addEventListener('touchstart', handleTouch);

    return () => {
      window.removeEventListener('keydown', handleJump);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const interval = setInterval(() => {
      setBirdY(prev => Math.min(prev + gravity, gameHeight - 30));
    }, 30);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const interval = setInterval(() => {
      const height = Math.floor(Math.random() * 200) + 50;
      setPipes(prev => [
        ...prev,
        { id: Date.now(), x: gameWidth, height },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const interval = setInterval(() => {
      setPipes(prev =>
        prev
          .map(pipe => {
            const newX = pipe.x - 4;
            if (newX + pipeWidth === 50) {
              setScore(prevScore => prevScore + 0.5);
            }
            return { ...pipe, x: newX };
          })
          .filter(pipe => pipe.x + pipeWidth > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const interval = setInterval(() => {
      setHealth(prev => {
        const next = prev - 2;
        if (next <= 0) {
          setIsGameOver(true);
          setIsRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    pipes.forEach(pipe => {
      const withinPipe = pipe.x < 80 && pipe.x + pipeWidth > 50;
      const hitTop = birdY < pipe.height;
      const hitBottom = birdY > pipe.height + pipeGap;
      if (withinPipe && (hitTop || hitBottom)) {
        setIsGameOver(true);
        setIsRunning(false);
      }
    });
  }, [birdY, pipes, isRunning, isGameOver]);

  const handleRestart = () => {
    setBirdY(200);
    setPipes([]);
    setScore(0);
    setHealth(100);
    setIsGameOver(false);
    setIsRunning(false);
  };

  return (
    <div className="game-container">
      <div className="score">{score}</div>
      <div className="bird" style={{ top: birdY }} />

      {pipes.map(pipe => (
        <div key={pipe.id}>
          <div className="pipe" style={{ left: pipe.x, top: 0 }}>
            <div className="pipe-cap pipe-cap-top" />
            <div className="pipe-body" style={{ height: pipe.height }} />
          </div>

          <div className="pipe" style={{ left: pipe.x, top: pipe.height + pipeGap }}>
            <div className="pipe-body" style={{ height: gameHeight - pipe.height - pipeGap }} />
            <div className="pipe-cap pipe-cap-bottom" />
          </div>
        </div>
      ))}

      {!isRunning && !isGameOver && (
        <div className="start-text">Kliknij lub naciśnij spację, aby zacząć</div>
      )}

      {isGameOver && (
        <div className="game-over">
          <div className="game-over-text">Game Over</div>
          <div className="final-score">Wynik: {score}</div>
          <button onClick={handleRestart}>Zagraj ponownie</button>
        </div>
      )}

      <div className="health-bar">
        <div className="health-fill" style={{ width: `${health}%` }}></div>
        <div className="health-text">{health}%</div>
      </div>
    </div>
  );
}