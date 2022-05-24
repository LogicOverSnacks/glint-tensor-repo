import * as Ramda from 'ramda';

import { Tensor } from './tensor';

export class Matrix<Columns extends number, Rows extends number> extends Tensor<[Columns, Rows]> {
  add(rhs: number | Tensor<[Columns, Rows]>): Matrix<Columns, Rows> {
    if (typeof rhs === 'number') {
      return new Matrix<Columns, Rows>(super.add(rhs).values);
    }

    return new Matrix<Columns, Rows>(Ramda
      .zip(this.values, rhs.values)
      .map(([lCols, rCols]) => Ramda.zip(lCols, rCols).map(([l, r]) => l + r))
    );
  }

  hadamard(rhs: Tensor<[Columns, Rows]>): Matrix<Columns, Rows> {
    return new Matrix<Columns, Rows>(super.hadamard(rhs).values);
  }
}
