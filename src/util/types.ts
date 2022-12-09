export type List<T> = {
  item: T | null
  next: List<T> | null
}

export type Pair<T, U> = {
  first: T
  second: U
}

