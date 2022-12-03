import { ld } from 'https://x.nest.land/deno-lodash@1.0.0/mod.ts';
import {getInput, printSolutions} from './util/io.ts'
import {sum} from './util/index.ts'

const charCodeFromChar = (c: string | undefined): number => {
  if (c === undefined) return 0

  const charCode = c.charCodeAt(0)

  return charCode > 96
    ? charCode - 96 // lower case letter
    : charCode - 38 // upper case letter
}

const input = (await getInput(3, false)).filter((l) => l.length > 0)

const solve1 = (input: string[]) => {
  return input.map((line) => {
    const length = line.length

    const [left, right] = [line.slice(0, length / 2).split(''), line.slice(length / 2, length).split('')]

    return charCodeFromChar(
      left.filter((char) => right.find((other) => char === other) !== undefined).at(0)
    )
  }).reduce(sum, 0)
}

const solve2 = (input: string[]) => {
  return ld.chunk(input, 3)
  .map(
    ([first, second, third]: [string, string, string]) => {
      const commonInFirstTwo = ld.uniq(
        first
          .split('')
          .filter((firstChar) => second.split('').find((secondChar) => secondChar === firstChar) !== undefined)
      )

      return charCodeFromChar(
        commonInFirstTwo.filter((char) => third.split('').find((other) => char === other) !== undefined).at(0)
      )
  }).reduce(sum, 0)
}

printSolutions(solve1, solve2, input)

