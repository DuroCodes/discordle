/* eslint-disable no-return-assign */
import { client } from '..';

export interface LetterMap {
  [key: string]: 'green' | 'yellow' | 'gray' | 'darkGray';
}

export const guessWord = (guess: string, correctWord: string) => {
  const data: string[] = Array.from({ length: 5 }).map((_, i) => {
    const guessChar = guess[i]!;
    const correctChar = correctWord[i]!;

    const isCorrect = guessChar === correctChar;
    const isPresent = !isCorrect && correctWord?.includes(guessChar);

    if (isCorrect) return client.emoji.green[guessChar];
    if (isPresent) return client.emoji.yellow[guessChar];
    return client.emoji.gray[guessChar];
  });

  return data;
};

export const mapWord = (guess: string, correctWord: string) => {
  const map: LetterMap = {};

  Array.from({ length: 5 }).forEach((_, i) => {
    const guessChar = guess[i]!;
    const correctChar = correctWord[i]!;

    const isCorrect = guessChar === correctChar;
    const isPresent = !isCorrect && correctWord?.includes(guessChar);

    if (isCorrect) return map[guessChar] = 'green';
    if (isPresent) return map[guessChar] = 'yellow';
    return map[guessChar] = 'gray';
  });

  return map;
};

export const letterMap = (newLetters: LetterMap, oldLetters: LetterMap) => {
  const priorities = {
    green: 3,
    yellow: 2,
    gray: 1,
    darkGray: 0,
  };

  const map: LetterMap = {};

  'abcdefghijklmnopqrstuvwxyz'.split('').forEach((v) => {
    const oldLetter = oldLetters[v];
    const newLetter = newLetters[v];

    if (oldLetter && newLetter) {
      const oldPrior = priorities[oldLetter];
      const newPrior = priorities[newLetter];

      if (oldPrior > newPrior) return map[v] = oldLetter;
      return map[v] = newLetter;
    }

    if (oldLetter) return map[v] = oldLetter;
    if (newLetter) return map[v] = newLetter;

    return v;
  });

  return map;
};
