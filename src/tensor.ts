import * as Ramda from 'ramda';

import { TensorValues } from './utility';

type WithoutLastDimension<D extends readonly number[]> = D extends readonly [...infer XS, infer X] ? XS : any;
type LastDimension<D extends readonly number[]> = D extends readonly [...infer XS, infer X] ? X : any;

export class Tensor<Dimension extends readonly number[]> {
  // prevent duck typing
  private readonly θtensorDimensions?: Dimension;

  values: TensorValues<Dimension>;

  constructor(values: TensorValues<Dimension>) {
    this.values = values;
  }

  add(rhs: number | Tensor<Dimension>): Tensor<Dimension> {
    if (typeof rhs === 'number') {
      return new Tensor(Tensor.processConstant(this.values, rhs, (l, r) => l + r));
    }

    return new Tensor(Tensor.processValues(this.values, rhs.values, (l, r) => l + r));
  }

  hadamard(rhs: number | Tensor<Dimension>): Tensor<Dimension> {
    if (typeof rhs === 'number') {
      return new Tensor(Tensor.processConstant(this.values, rhs, (l, r) => l * r));
    }

    return new Tensor(Tensor.processValues(this.values, rhs.values, (l, r) => l * r));
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

  private static processConstant = <D extends readonly number[]>(
    lhs: TensorValues<D>,
    rhs: number,
    operator: (l: number, r: number) => number
  ): TensorValues<D> =>
    typeof lhs === 'number'
      ? operator(lhs, rhs) as TensorValues<D>
      : lhs.map((value: any) => Tensor.processConstant(value, rhs, operator)) as TensorValues<D>;

  private static processValues = <D extends readonly number[]>(
    lhs: TensorValues<D>,
    rhs: TensorValues<D>,
    operator: (l: number, r: number) => number
  ): TensorValues<D> =>
    typeof lhs === 'number' && typeof rhs === 'number'
      ? operator(lhs, rhs) as TensorValues<D>
      : Ramda
        .zip(lhs, rhs)
        .map(([l, r]) => Tensor.processValues(l, r, operator)) as TensorValues<D>;
}
