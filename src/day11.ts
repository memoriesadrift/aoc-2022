import {_} from './util/lodash.ts'
import {getInput, printSolutions} from './util/io.ts'
import {lcm} from './util/maths.ts'

type Monkey = {
  id: number
  inventory: bigint[]
  worryFn: (worry: bigint) => bigint
  testFn: (worry: bigint) => number
  divisor: bigint
  inspections: number
}

const parseOperationLine = (line: string, capWorry: boolean) => {
  const [op1, op, op2] = line
    .slice(line.indexOf('old'))
    .split(' ')

  return (worry: bigint) => {
    const [a, b] = [op1, op2].map(
      (operand) => operand !== 'old' 
        ? BigInt(operand) 
        : worry
    )

    const result = op === '+'
      ? a + b
      : a * b

    return capWorry 
      ? result / 3n
      : result
  }
}

const parseTestLine = (line: string): [bigint, (worry: bigint) => boolean] => {
  const [_, num] = line
    .slice(line.indexOf('by'))
    .split(' ')

  const divisor = BigInt(num)

  return [divisor, (worry: bigint) => worry % divisor === 0n]
}

const buildTestFn = (test: (worry: bigint) => boolean, trueNum: number, falseNum: number) => {
  return (worry: bigint) => test(worry) 
    ? trueNum
    : falseNum
}

const parseMonkeyInput = (input: string[], capWorry: boolean) => {
  const rawMonkeyList: string[][] = _.chunk(input, 6)

  return rawMonkeyList
  .map(([idLine, itemsLine, operationLine, testLine, trueLine, falseLine]): Monkey => {
    const id = Number.parseInt(idLine[idLine.length - 2])
    const inventory = itemsLine
      .slice(itemsLine.indexOf(': ') + 2)
      .split(',')
      .map((it) => BigInt(it))
    const worryFn = parseOperationLine(operationLine, capWorry)
    const [divisor, checkFn] = parseTestLine(testLine)
    const testFn = buildTestFn(
      checkFn,
      Number.parseInt(trueLine[trueLine.length - 1]),
      Number.parseInt(falseLine[falseLine.length - 1])
    )
    const inspections = 0

    return {id, inventory, worryFn, testFn, inspections, divisor}
  })
}

const solve = (monkeys: Monkey[], count: number, partTwo: boolean) => {
  const rounds = Array(count).fill(0).map((_, idx) => idx + 1)
  const lcmOfDivisors = monkeys.map((m) => m.divisor).reduce((acc, curr) => lcm(acc, curr))

  return rounds.reduce((acc, _currentRound) => {
    return acc.reduce((currentMonkeyList: Monkey[], oldMonkey: Monkey) => {
      // Get the up to date monkey, sadly the monkey in the reduce is old :(
      const thisMonkey = currentMonkeyList.find((it) => it.id === oldMonkey.id) as Monkey

      const itemDestinations = thisMonkey.inventory.map((itemWorry) => {
        const newWorry = partTwo
          ? thisMonkey.worryFn(itemWorry) % lcmOfDivisors
          : thisMonkey.worryFn(itemWorry)
        return {
          newWorry,
          destination: thisMonkey.testFn(newWorry),
        }
      })

      const newMonkeyList = currentMonkeyList.map((otherMonkey) => {
        const itemsToAdd = itemDestinations
          .filter((item) => item.destination === otherMonkey.id)
          .map((it) => it.newWorry)

        return {
          id: otherMonkey.id,
          worryFn: otherMonkey.worryFn,
          testFn: otherMonkey.testFn,
          divisor: otherMonkey.divisor,
          inventory: otherMonkey.id !== thisMonkey.id 
            ? [...otherMonkey.inventory, ...itemsToAdd]
            : [],
          inspections: otherMonkey.id !== thisMonkey.id
            ? otherMonkey.inspections
            : otherMonkey.inspections + itemDestinations.length
        }
      })
      return newMonkeyList
    }, acc)
  }, monkeys)
  .sort((a, b) => b.inspections - a.inspections)
  .slice(0, 2)
  .reduce((acc, curr) => acc * curr.inspections, 1)
}

const solve1 = (input: string[]) => solve(parseMonkeyInput(input, true), 20, false)

const solve2 = (input: string[]) => solve(parseMonkeyInput(input, false), 10000, true)

const input = await getInput(11, false)
printSolutions(solve1, solve2, input)

