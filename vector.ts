import { Tensor } from './tensor';

export class Vector<Rows extends number> extends Tensor<[Rows]> {
  values: number[] = super.values;

  add(rhs: Tensor<[Rows]>): Vector<Rows> {
    const newValues: number[] = [];
    for (let i = 0; i < rhs.values.length; i++) {
      newValues[i] = this.values[i] + rhs.values[i];
    }

    return new Vector<Rows>(newValues);
  }
}
