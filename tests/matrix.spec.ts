import 'jasmine';

import { Matrix } from '../src/matrix';

describe('Matrix', () => {
  it('can multiply by identity', () => {
    const identity = new Matrix<2, 2>([[1, 0], [0, 1]]);
    const a = new Matrix<2, 2>([[1, 2], [3, 4]]);

    expect(a.multiply(identity).values).toEqual(a.values);
    expect(identity.multiply(a).values).toEqual(a.values);
  });
});
