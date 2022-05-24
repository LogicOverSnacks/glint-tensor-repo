import { Tensor } from './tensor';

export class Vector<Rows extends number> extends Tensor<[Rows]> {}
