import * as R from 'ramda';

export function deepClone<T>(obj: T): T {
  return R.clone(obj);
}
