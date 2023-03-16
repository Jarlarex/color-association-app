import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';

const rainbowColors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function ColorButton({ color, onClick }) {
  return (
    <button
      className="color-btn"
      style={{ backgroundColor: color }}
      onClick={() => onClick(color)}
    ></button>
  );
}

function App() {
  const [gameState, setGameState] = useState('start');
  const [countdownValue, setCountdownValue] = useState(3);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  

  const audioContext = new AudioContext();
  let soundBuffer;

  const loadSound = useCallback(async (soundFileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/sounds/${soundFileName}`);
      const soundData = await response.arrayBuffer();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      soundBuffer = await audioContext.decodeAudioData(soundData);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }, []);

  function playSound() {
    if (!soundBuffer) return;

    const soundSource = audioContext.createBufferSource();
    soundSource.buffer = soundBuffer;
    soundSource.connect(audioContext.destination);
    soundSource.start();
  }

  useEffect(() => {
    // Load a random sound
    const randomSoundFileName = 'your-sound-file-name'; // Replace this with logic to pick a random sound file
    loadSound(randomSoundFileName);
  }, [loadSound]);

  const startCountdown = () => {
    setGameState('countdown');
    let countdownTimer = 3;
    setCountdownValue(countdownTimer);

    const countdownInterval = setInterval(() => {
      countdownTimer -= 1;
      setCountdownValue(countdownTimer);

      if (countdownTimer === 0) {
        clearInterval(countdownInterval);
        setGameState('colorSelection');
        playSound();
      }
    }, 1000);
  };

  const handleColorSelection = async (color) => {
    console.log("Selected color:", color);

    try {
      const response = await axios.post('http://localhost:5000/api/color-association', {
        color,
        sound: 'sound-file-name' // Replace with the actual sound file name or identifier
      });

      if (response.status === 201) {
        console.log('Color association saved');
      }
    } catch (error) {
      console.error('Error saving color association:', error);
    }

    // Save the user's selection and increment the games played counter
    setGamesPlayed(gamesPlayed + 1);
    setGameState('thanks');
  };

  const handleContinue = () => {
    setGameState('countdown');
    startCountdown();
  };

  return (
    <div className="App">
      {gameState === 'start' && (
        <div>
          <h1>Color Association Game</h1>
          <p>Help us collect information about people's associations with colors and sounds!</p>
          <button onClick={startCountdown}>Start</button>
        </div>
      )}

      {gameState === 'countdown' && (
        <div>
          <h1>{countdownValue}</h1>
        </div>
      )}

{gameState === 'colorSelection' && (
        <div>
          <h2>Select the color you associate with the sound:</h2>
          <div className="colors-container">
            {rainbowColors.map((color) => (
              <ColorButton key={color} color={color} onClick={handleColorSelection} />
            ))}
          </div>
          <button onClick={playSound}>Replay Sound</button>
          <button onClick={() => setGameState('thanks')}>Submit</button>
        </div>
      )}

      {gameState === 'thanks' && (
        <div>
          <h1>Thanks for your input!</h1>
          <p>
            You've played {gamesPlayed} {gamesPlayed === 1 ? 'game' : 'games'} so far.{' '}
            {gamesPlayed < 5 && 'Keep going to help us collect more data!'}
          </p>
          {gamesPlayed < 5 ? (
            <button onClick={handleContinue}>Continue</button>
          ) : (
            <button onClick={() => setGameState('start')}>Start Over</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

