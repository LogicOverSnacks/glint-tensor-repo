import { Tensor } from './tensor';
import { TensorValues } from './utility';

export class Matrix<Columns extends number, Rows extends number> extends Tensor<[Columns, Rows]> {
  constructor(tensor: Tensor<[Columns, Rows]> | TensorValues<[Columns, Rows]>) {
    super(Tensor.isTensor(tensor) ? tensor.values : tensor);
  }

  multiply = <RColumns extends number>(rhs: Tensor<[Rows, RColumns]>): Matrix<Columns, RColumns> => new Matrix(super.contract(rhs));
}
