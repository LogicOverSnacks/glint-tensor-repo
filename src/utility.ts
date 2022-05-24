type Pop<A extends readonly any[]> = A extends readonly [infer X, ...infer XS] ? XS : never;

type GrowTuple<A extends readonly any[], N extends number> =
  A['length'] extends N ? A
  : A[N] extends undefined ? GrowTuple<readonly [...A, ...A], N>
  : GrowTuple<Pop<A>, N>;

type SizedTuple<T, N extends number> =
  N extends 0 ? readonly []
  : GrowTuple<readonly [T], N>;

export type TensorValues<Dimensions extends readonly number[]> = Dimensions extends readonly [infer X, ...infer XS]
  ? X extends number
    ? XS extends number[] ? SizedTuple<TensorValues<XS>, X> : never
    : never
  : Dimensions extends [] ? number : any;
