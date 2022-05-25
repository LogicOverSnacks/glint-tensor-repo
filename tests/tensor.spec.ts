import 'jasmine';

import { Tensor } from '../src/tensor';

describe('Tensor', () => {
  it('can contract', () => {
    const a = new Tensor<[2, 3]>([[1, 2, 3], [4, 5, 6]]);
    const b = new Tensor<[3, 2]>([[7, 8], [9, 10], [11, 12]]);

    const result = a.contract(b);

    expect(result.values).toEqual([
      [1*7 + 2*9 + 3*11, 1*8 + 2*10 + 3*12],
      [4*7 + 5*9 + 6*11, 4*8 + 5*10 + 6*12]
    ]);
  });
});
