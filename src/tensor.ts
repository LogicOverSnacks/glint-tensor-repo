import * as Ramda from 'ramda';

type ReduceDimension<T extends readonly any[]> = T extends readonly [infer X, ...infer XS] ? XS : number[];

type TensorValues<Dimensions extends readonly number[]> = Dimensions extends readonly []
  ? number
  : TensorValues<ReduceDimension<Dimensions>>[];

export class Tensor<Dimensions extends readonly number[]> {
  // prevent duck typing
  private readonly θtensorDimensions?: Dimensions;

  values: TensorValues<Dimensions>;

  constructor(values: TensorValues<Dimensions>) {
    this.values = values;
  }

  add(rhs: number): Tensor<Dimensions> {
    return new Tensor(Tensor.addConstant(this.values, rhs));
  }

  hadamard(rhs: Tensor<Dimensions>): Tensor<Dimensions> {
    return new Tensor(Tensor.multiplyValues(this.values, rhs.values));
  }

  protected static isConstant(tensor: Tensor<readonly number[]>): tensor is Tensor<readonly []> {
    return typeof tensor.values === 'number';
  }

  protected static is1D(tensor: Tensor<readonly number[]>): tensor is Tensor<readonly [number]> {
    return typeof tensor.values[0] === 'number';
  }

  protected static is2D(tensor: Tensor<readonly number[]>): tensor is Tensor<readonly [number, number]> {
    return typeof tensor.values[0]?.[0] === 'number';
  }

  protected static is3D(tensor: Tensor<readonly number[]>): tensor is Tensor<readonly [number, number]> {
    return typeof tensor.values[0]?.[0]?.[0] === 'number';
  }

  private static addConstant = <D extends readonly number[]>(values: TensorValues<D>, rhs: number): TensorValues<D> =>
    typeof values === 'number'
      ? (values + rhs) as number as TensorValues<D>
      : values.map(value => Tensor.addConstant(value, rhs)) as TensorValues<D>;

  private static multiplyValues = <D extends readonly number[]>(lhs: TensorValues<D>, rhs: TensorValues<D>): TensorValues<D> =>
    typeof lhs === 'number' && typeof rhs === 'number'
      ? (lhs * rhs) as number as TensorValues<D>
      : Ramda
        .zip(lhs, rhs)
        .map(([l, r]) => Tensor.multiplyValues(l, r)) as TensorValues<D>;
}
