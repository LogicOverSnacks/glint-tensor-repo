import { Tensor } from './tensor';

export class Matrix<Columns extends number, Rows extends number> extends Tensor<[Columns, Rows]> {}
