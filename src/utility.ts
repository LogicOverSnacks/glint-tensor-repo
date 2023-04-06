export type PopHead<A extends readonly any[]> = A extends readonly [infer X, ...infer XS] ? XS : A;
export type PopTail<A extends readonly any[]> = A extends readonly [...infer XS, infer X] ? XS : A;
export type Tail<A extends readonly any[]> = A extends readonly [...infer XS, infer X] ? X : A[0];

type GrowTuple<A extends readonly any[], N extends number> =
  A['length'] extends N ? A
  : A[N] extends undefined ? GrowTuple<readonly [...A, ...A], N>
  : GrowTuple<PopHead<A>, N>;

type SizedTuple<T, N extends number> =
  N extends 0 ? readonly []
  : number extends N ? T[]
  : GrowTuple<readonly [T], N>;

export type TensorValues<Dimensions extends readonly number[]> = Dimensions extends readonly [infer X, ...infer XS]
  ? X extends number
    ? XS extends number[] ? SizedTuple<TensorValues<XS>, X> : never
    : never
  : Dimensions extends [] ? number : any;
