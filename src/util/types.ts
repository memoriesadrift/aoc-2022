export type List<T> = {
  item: T | null,
  next: List<T> | null
}

