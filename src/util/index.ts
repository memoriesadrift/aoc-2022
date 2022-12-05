import type {List} from './types.ts'

export const sum = (acc: number, curr: number) => acc + curr

export const reverseList = <T>(list: List<T>): List<T> => {
  if (list.next === null) return list

  const temp = reverseList(list.next)
  list.next.next = list
  list.next = null
  return temp
}

// TODO: Add a recursive solution
export const appendToList = <T>(list: List<T>, other: List<T>): List<T> => {
  let current = list
  while (current.next) {
    current = current.next
  }
  current.next = other
  return list
}
