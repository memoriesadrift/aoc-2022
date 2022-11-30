const getInputFromFile = async (day: number, test = false) => await Deno.readTextFile(`res/day${day}.in${test ? '.test' : ''}`)

export const getInput = async (day: number, test = false) => (await getInputFromFile(day, test)).split('\n')

export const getInputAsIntList = async (day: number, test = false) => (await getInput(day, test)).map((e) => Number.parseInt(e))

export const getInputAsCommaSeparatedIntList = async (day: number, test = false) => (await getInputFromFile(day, test)).split(',').map((e) => Number.parseInt(e))

