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
    if (Tensor.isConstant(this)) {
      return new Tensor<readonly []>(this.values + rhs) as unknown as Tensor<Dimensions>;
    }

    return new Tensor(Tensor.addValues(this.values, rhs));
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

  private static addValues = <D extends readonly number[]>(values: TensorValues<D>, rhs: number): TensorValues<D> =>
    typeof values === 'number'
      ? (values + rhs) as number as TensorValues<D>
      : values.map(value => Tensor.addValues(value, rhs)) as TensorValues<D>;
}
