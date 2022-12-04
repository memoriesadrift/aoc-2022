import {getInput, printSolutions} from './util/io.ts'

type Range = {
  start: number
  end: number
}

const parsePairs = (rawInput: string[]): Range[][] => {
  return rawInput
    .map((line) => line
         .split(',')
         .map((rawPair): Range => {
           const [start, end] = rawPair.split('-').map((e) => Number.parseInt(e))
           return {start, end}
         })
      )
}

const anyRangeContainsOther = (first: Range, second: Range): boolean => {
  return (first.start <= second.start && first.end >= second.end)  // first contains second
    ? true
    : (second.start <= first.start && second.end >= first.end)  // second contains first
      ? true
      : false
}

const anyRangeOverlapsWithOther = (first: Range, second: Range): boolean => {
  return (first.start <= second.start && first.end >= second.start)  // first overlaps with second
    ? true
    : (second.start <= first.start && second.end >= first.start)  // second contains first
      ? true
      : false
}

const input = await getInput(4, false)

const solve1 = (input: string[]) => {
  return parsePairs(input)
      .filter(([first, second]) => anyRangeContainsOther(first, second))
      .reduce((acc, curr) => curr ? acc + 1 : acc, 0)
}

const solve2 = (input: string[]) => {
  return parsePairs(input)
      .filter(([first, second]) => anyRangeOverlapsWithOther(first, second))
      .reduce((acc, curr) => curr ? acc + 1 : acc, 0)
}

printSolutions(solve1, solve2, input)

