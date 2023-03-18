import * as R from 'ramda';

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (...subjects: any[]) => {
    // eslint-disable-next-line no-console
    console.log(...R.clone(subjects));
  },

  debug: (...subjects: unknown[]) => {
    console.debug(...R.clone(subjects));
  },
};
