import * as R from 'ramda';

export function popRandomElement<T>(array: T[]): T | null {
  if (R.isEmpty(array)) return null;

  const randomIndex = Math.floor(Math.random() * array.length);
  const [element] = array.splice(randomIndex, 1);

  return element;
}
