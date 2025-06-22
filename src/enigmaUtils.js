// enigmaUtils.js - Functional Enigma Logic
const A = 65;

const mod = (num, max) => ((num % max) + max) % max;

const toLetter = i => String.fromCharCode(A + i);
const toIndex = c => c.charCodeAt(0) - A;

const invertWiring = wiring => {
  const result = Array(26);
  wiring.split('').forEach((char, i) => {
    result[toIndex(char)] = toLetter(i);
  });
  return result.join('');
};

const plugSwap = (plugboard, char) => plugboard[char] || char;

const rotate = pos => mod(pos + 1, 26);

const processChar = (char, rotors, reflector, plugboard, decrypt = false) => {
  if (!Array.isArray(rotors)) throw new TypeError('Expected rotors to be an array');

  if (!/^[A-Z]$/.test(char)) return { letter: char, rotors };

  const [r1, r2, r3] = rotors;

  const newR3Pos = rotate(r3.pos);
  const newR2Pos = r3.notch === toLetter(newR3Pos) ? rotate(r2.pos) : r2.pos;
  const newR1Pos = r2.notch === toLetter(newR2Pos) ? rotate(r1.pos) : r1.pos;

  const updatedRotors = [
    { ...r1, pos: newR1Pos },
    { ...r2, pos: newR2Pos },
    { ...r3, pos: newR3Pos }
  ];

  const encode = (char, wiring, pos) => {
    const i = mod(toIndex(char) + pos, 26);
    return toLetter(mod(toIndex(wiring[i]) - pos, 26));
  };

  const decode = (char, wiring, pos) => {
    const inverse = invertWiring(wiring);
    const i = mod(toIndex(char) + pos, 26);
    return toLetter(mod(toIndex(inverse[i]) - pos, 26));
  };

  let letter = plugSwap(plugboard, char);

  const encodeChain = decrypt ? updatedRotors : [...updatedRotors].reverse();
  const decodeChain = decrypt ? [...updatedRotors].reverse() : updatedRotors;

  encodeChain.forEach(r => {
    letter = encode(letter, r.wiring, r.pos);
  });

  letter = reflector[toIndex(letter)];

  decodeChain.forEach(r => {
    letter = decode(letter, r.wiring, r.pos);
  });

  letter = plugSwap(plugboard, letter);

  return { letter, rotors: updatedRotors };
};

const encryptMessage = (message, rotors, reflector, plugboard, decrypt = false) => {
  if (!Array.isArray(rotors)) throw new TypeError('rotors must be an array');
  return message
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .reduce((acc, char) => {
      const { letter, rotors: nextRotors } = processChar(
        char,
        acc.rotors,
        reflector,
        plugboard,
        decrypt
      );
      return {
        result: acc.result + letter,
        rotors: nextRotors
      };
    }, { result: '', rotors }).result;
};

export { encryptMessage, processChar };
