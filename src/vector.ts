import * as Ramda from 'ramda';

import { Tensor } from './tensor';

export class Vector<Rows extends number> extends Tensor<[Rows]> {
  dotProduct = (rhs: Tensor<[Rows]>): number => Ramda.sum(Ramda
    .zip(this.values, rhs.values)
    .map(([l, r]) => l * r)
  );
}
