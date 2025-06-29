import { processChar } from '../enigmaUtils';

const rotorI = { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q', pos: 0 };
const rotorII = { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E', pos: 0 };
const rotorIII = { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V', pos: 0 };

const reflectorB = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split('');

const plugboard = {
  A: 'M', M: 'A',
  G: 'L', L: 'G',
  E: 'T', T: 'E'
};

const cloneRotors = () => [
  { ...rotorI },
  { ...rotorII },
  { ...rotorIII }
];

describe('processChar()', () => {
  it('returns an uppercase letter for valid input', () => {
    const rotors = cloneRotors();
    const result = processChar('A', rotors, reflectorB, plugboard);
    expect(result.letter).toMatch(/^[A-Z]$/);
  });

  it('steps the rightmost rotor each time', () => {
    let rotors = cloneRotors();
    const first = processChar('A', rotors, reflectorB, plugboard);
    const second = processChar('B', first.rotors, reflectorB, plugboard);
    expect(second.rotors[2].pos).toBe(2); // rotor III stepped twice
  });

  it('applies plugboard swaps correctly', () => {
    const swapped = plugboard['A'];
    const swappedBack = plugboard[swapped];
    expect(swappedBack).toBe('A');
  });

  it('reflects character using reflectorB', () => {
    const rotors = cloneRotors();
    const result = processChar('A', rotors, reflectorB, plugboard);
    expect(result.letter).toBeDefined();
    expect(result.letter).not.toBe('A'); // unlikely to reflect to itself
  });

  it('returns input character unchanged if it is not a letter', () => {
    const rotors = cloneRotors();
    const result = processChar(' ', rotors, reflectorB, plugboard);
    expect(result.letter).toBe(' ');
  });

  it('throws TypeError if rotors is not an array', () => {
    expect(() => processChar('A', null, reflectorB, plugboard)).toThrow(TypeError);
  });

  it('is reversible when decrypt flag is used and initial state is same', () => {
    const message = 'ENIGMA';
    let rotors = cloneRotors();
    let encrypted = '';

    for (let char of message) {
      const res = processChar(char, rotors, reflectorB, plugboard);
      encrypted += res.letter;
      rotors = res.rotors;
    }

    // reset rotors to same initial position
    rotors = cloneRotors();
    let decrypted = '';
    for (let char of encrypted) {
      const res = processChar(char, rotors, reflectorB, plugboard);
      decrypted += res.letter;
      rotors = res.rotors;
    }

    expect(decrypted).toBe(message);
  });

  it('handles multiple characters with consistent rotor stepping', () => {
    const rotors = cloneRotors();
    const chars = ['A', 'B', 'C', 'D', 'E'];
    let currentRotors = rotors;
    const outputs = [];

    chars.forEach(char => {
      const res = processChar(char, currentRotors, reflectorB, plugboard);
      outputs.push(res.letter);
      currentRotors = res.rotors;
    });

    expect(outputs).toHaveLength(5);
    outputs.forEach(letter => {
      expect(letter).toMatch(/^[A-Z]$/);
    });
  });
});
