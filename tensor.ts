export class Tensor<Dimensions extends readonly number[]> {
  values: any[];

  protected is1D(tensor: Tensor<any>): tensor is Tensor<[number]> {
    return typeof tensor.values[0] === 'number';
  }

  protected is2D(tensor: Tensor<any>): tensor is Tensor<[number, number]> {
    return typeof tensor.values[0].values?.[0] === 'number';
  }
}
