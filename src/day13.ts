import {_} from './util/lodash.ts'
import {getInput, printSolutions} from './util/io.ts'

// Note: the elements aren't sorted exactly as shown in the puzzle, because many are equivalent.
const compareFn = (a: any, b: any): number => {
  let idx = 0
  while (a.length - idx > 0 && b.length - idx > 0) {

    if (typeof a[idx] === 'number' && typeof b[idx] === 'number') {
      const isEqual = a[idx] - b[idx] === 0
      if(!isEqual) return a[idx] - b[idx]
    }

    if (Array.isArray(a[idx]) && Array.isArray(b[idx])) {
      const result = compareFn(a[idx], b[idx])
      if (result !== 0) return result
    }

    if (Array.isArray(a[idx]) && typeof b[idx] === 'number') {
      const result = compareFn(a[idx], [b[idx]])
      if (result !== 0) return result
    }

    if (typeof a[idx] === 'number' && Array.isArray(b[idx])) {
      const result = compareFn([a[idx]], b[idx])
      if (result !== 0) return result
    }

    idx = idx + 1
  }

  if (a.length - idx <= 0 && b.length > 0) return -1
  if (b.length - idx <= 0 && a.length > 0) return 1

  return 0
}

const solve1 = (input: string[]) => {
  return _.chunk(input, 2)
  .map((pair) => compareFn(
    JSON.parse(pair[0]),
    JSON.parse(pair[1]),
  ))
  .reduce((acc, curr, idx) => curr < 0 ? acc + idx + 1 : acc, 0)
}

const solve2 = (input: string[]) => {
  const sorted = [...input, '[[2]]', '[[6]]']
  .sort((a, b) => compareFn(JSON.parse(a), JSON.parse(b)))

  const [a, b] = [sorted.findIndex((it) => it === '[[2]]') + 1, sorted.findIndex((it) => it === '[[6]]') + 1]
  return a * b 
}

const input = await getInput(13, false)

printSolutions(solve1, solve2, input)

