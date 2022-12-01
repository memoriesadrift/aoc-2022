import {getInputSplitBy, printSolutions} from './util/io.ts'

const input = (await getInputSplitBy(1, '\n\n', false))
                  .filter((s) => s !== '')
                  .map((elfCarry) => elfCarry.split('\n').map((a) => Number.parseInt(a)))
                  .map((carryArray) => carryArray.reduce((acc, curr) => acc + curr, 0))

const solve1 = (input: number[]) => {
  return input.reduce((max, curr) => max > curr ? max : curr, 0)
}

const solve2 = (input: number[]) => {
  return input.sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((acc, curr) => acc + curr, 0)
}

printSolutions(solve1, solve2, input)
