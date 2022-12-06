import { ld } from 'https://x.nest.land/deno-lodash@1.0.0/mod.ts'
import {getInput, printSolutions} from './util/io.ts'

const findMarker = (message: string, lengthOfMarker: number) => {
  return message
    .split('')
    .reduce((acc, curr) => {
      if (
        acc.length === lengthOfMarker && 
        ld.uniq(acc).length === acc.length
      ) return acc

      if (acc.length === lengthOfMarker) {
        return [...acc.slice(1), curr]
      }

      return [...acc, curr]
    }, [] as string[])
    .join('')
}

const input = (await getInput(6, false))[0]

const solve1 = (input: string) => {
  return input.indexOf(
    findMarker(input, 4)
  ) + 4
}

const solve2 = (input: string) => {
  return input.indexOf(
    findMarker(input, 14)
  ) + 14
}

printSolutions(solve1, solve2, input)

