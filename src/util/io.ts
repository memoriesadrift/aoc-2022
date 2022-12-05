/*
 * 
 * Input
 *
 */
const getInputFromFile = async (day: number, test = false) => await Deno.readTextFile(`res/day${day}.in${test ? '.test' : ''}`)

export const getInput = async (day: number, test = false) => (await getInputFromFile(day, test)).split('\n').filter((line) => line.length > 0)

export const getInputKeepEmptyLines = async (day: number, test = false) => (await getInputFromFile(day, test)).split('\n')

export const getInputSplitBy = async (day: number, split: string, test = false) => (await getInputFromFile(day, test)).split(split)

export const getInputAsIntList = async (day: number, test = false) => (await getInput(day, test)).map((e) => Number.parseInt(e))

export const getInputAsCommaSeparatedIntList = async (day: number, test = false) => (await getInputFromFile(day, test)).split(',').map((e) => Number.parseInt(e))


/*
 * 
 * Output
 *
 */

// deno-lint-ignore ban-types no-explicit-any
export const printSolutions = (solve1: Function, solve2: Function, input: any) => {
  console.log(
    "Task 1: ", solve1(input)
  )
  console.log(
    "Task 2: ", solve2(input)
  )
}
