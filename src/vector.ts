import * as Ramda from 'ramda';

import { Tensor } from './tensor';

export class Vector<Rows extends number> extends Tensor<[Rows]> {
  add(rhs: number | Tensor<[Rows]>): Vector<Rows> {
    if (typeof rhs === 'number') {
      return super.add(rhs);
    }

    return new Vector<Rows>(Ramda
      .zip(this.values, rhs.values)
      .map(([l, r]) => l + r)
    );
  }
}
