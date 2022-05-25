import * as Ramda from 'ramda';

import { PopHead, PopTail, Tail, TensorValues } from './utility';

export class Tensor<Dimension extends readonly number[]> {
  // prevent duck typing
  private readonly tensorDimensions: Dimension | null = null;

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

  contract<D extends readonly [Tail<Dimension>, ...number[]]>(
    rhs: Tensor<D>
  ): Tensor<[...PopTail<Dimension>, ...PopHead<D>]> {
    if (Tensor.isConstant(this)) {
      return new Tensor(Tensor.processConstant(rhs.values, this.values, (l, r) => l * r)) as any;
    }

    if (Tensor.isConstant(rhs)) {
      return new Tensor(Tensor.processConstant(this.values, rhs.values, (l, r) => l * r)) as any;
    }

    return new Tensor(Tensor.sum(Ramda
      .zip(Tensor.pullTailToHead(this.values), rhs.values)
      .map(([l, r]) => Tensor.crossProduct(l, r))
    )) as any;
  }

  protected static isTensor<T extends readonly number[]>(tensor: any): tensor is Tensor<T> {
    return tensor.tensorDimensions === null;
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

  protected static is3D(tensor: Tensor<readonly number[]>): tensor is Tensor<readonly [number, number, number]> {
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

  private static sum = <D extends readonly number[]>(tensors: TensorValues<D>[]): TensorValues<D> =>
    tensors.reduce((previous, current) => Tensor.processValues(previous, current, (l, r) => l + r));

  private static crossProduct = <DL extends readonly number[], DR extends readonly number[]>(
    lhs: TensorValues<DL>,
    rhs: TensorValues<DR>
  ): TensorValues<readonly [...DL, ...DR]> => {
    if (typeof lhs === 'number') {
      return Tensor.processConstant(rhs, lhs, (l, r) => l * r) as any;
    }

    return lhs.map((l: any) => Tensor.crossProduct(l, rhs));
  };

  private static pullTailToHead = <D extends readonly number[], Tail extends number>(
    values: TensorValues<readonly [...D, Tail]>
  ): TensorValues<readonly [Tail, ...D]> => {
    if (typeof values === 'number' || typeof values[0] === 'number') {
      return values as any;
    }

    return (values as any[]).map((value: any) => Tensor.pullTailToHead(value))
      .reduce((previous, current) => previous.map((prev, index) => typeof prev === 'number'
        ? [prev, current[index]]
        : [...prev, current[index]]
      )) as any;
  };
}
