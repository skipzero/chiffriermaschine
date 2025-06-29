import React, { useState } from 'react';
import { processChar } from './enigmaUtils.js';
import './enigma.css';

const rotorLibrary = {
  I: { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  II: { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  III: { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  IV: { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  V: { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' }
};

const reflectorB = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split('');

const plugboard = {
  A: 'M', M: 'A',
  G: 'L', L: 'G',
  E: 'T', T: 'E'
};

const EnigmaApp = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [positions, setPositions] = useState([0, 0, 0]);
  const [selectedRotors, setSelectedRotors] = useState(['I', 'II', 'III']);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState('encrypt'); // purely for label/UI

  const updateRotorPosition = (index, value) => {
    const updated = [...positions];
    updated[index] = parseInt(value, 10) || 0;
    setPositions(updated);
  };

  const updateRotorSelection = (index, value) => {
    const updated = [...selectedRotors];
    updated[index] = value;
    setSelectedRotors(updated);
  };

  const handleRun = () => {
    const initialRotors = selectedRotors.map((key, i) => ({
      ...rotorLibrary[key],
      pos: positions[i]
    }));

    let currentRotors = initialRotors.map(r => ({ ...r }));

    setOutput('');
    setIsAnimating(true);

    const message = input.toUpperCase().replace(/[^A-Z]/g, '').split('');

    const animate = (i = 0) => {
      if (i >= message.length) {
        setIsAnimating(false);
        return;
      }

      const { letter, rotors: newRotors } = processChar(
        message[i],
        currentRotors,
        reflectorB,
        plugboard
      );

      currentRotors = newRotors;
      setOutput(prev => prev + letter);

      setTimeout(() => animate(i + 1), 100);
    };

    animate();
  };

  return (
    <div className='container'>
      <h2>Enigma Machine</h2>

      <textarea
        className='input'
        rows="4"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter message"
      />

      <div className='rotors' style={{ border: '1px solid #ccc' }}>
        <label>Rotor Selection and Positions:</label>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <select value={selectedRotors[i]} onChange={e => updateRotorSelection(i, e.target.value)}>
              {Object.keys(rotorLibrary).map(rotor => (
                <option key={rotor} value={rotor}>{rotor}</option>
              ))}
            </select>
            <input
              className='position'
              type="number"
              min="0"
              max="25"
              value={positions[i]}
              onChange={e => updateRotorPosition(e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className='mode-select'>
        <label>
          <input
            type="radio"
            name="mode"
            value="encrypt"
            checked={mode === 'encrypt'}
            onChange={e => setMode(e.target.value)}
          />
          Encrypt
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            name="mode"
            value="decrypt"
            checked={mode === 'decrypt'}
            onChange={e => setMode(e.target.value)}
          />
          Decrypt
        </label>
        <button onClick={handleRun} disabled={isAnimating}>
          {isAnimating ? 'Processing...' : (mode === 'decrypt' ? 'Decrypt' : 'Encrypt')}
        </button>  
        </div>

      <div className='output'>
        <strong>Output:</strong>
        <pre style={{ background: '#111', color: '#0f0', padding: '1rem' }}>{output}</pre>
      </div>
    </div>
  );
};

export default EnigmaApp;
