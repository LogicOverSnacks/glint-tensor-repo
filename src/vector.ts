import * as Ramda from 'ramda';

import { Tensor } from './tensor';

export class Vector<Rows extends number> extends Tensor<[Rows]> {
  values: number[] = super.values;

  add(rhs: Tensor<[Rows]>): Vector<Rows> {
    return new Vector<Rows>(Ramda
      .zip(this.values, rhs.values)
      .map(([l, r]) => l + r)
    );
  }
}
