import {_} from './util/lodash.ts'
import {getInput, printSolutions} from './util/io.ts'
import type {Pair} from './util/types.ts'

type Position = Pair<number, number>

type Direction = 'L' | 'R' | 'U' | 'D'

type Instruction = {
  direction: Direction
  amount: number
}

const isMoreThanOneFieldAway = (point: Position, other: Position) => Math.abs(point.first - other.first) > 1 || Math.abs(point.second - other.second) > 1

/*
 * Part 1
 */
const movePointByOne = (point: Position, direction: Direction) => {
  switch(direction) {
    case 'U':
      return {first: point.first, second: point.second + 1}
    case 'D':
      return {first: point.first, second: point.second - 1}
    case 'L':
      return {first: point.first - 1, second: point.second}
    case 'R':
      return {first: point.first + 1, second: point.second}
  }
}

const moveByInstruction = (instruction: Instruction, visited: Position[], headPosition: Position, tailPosition: Position) => {
  if (instruction.amount < 1) return {...{visited, headPosition, tailPosition}}

  const newHeadPosition = movePointByOne(headPosition, instruction.direction)
  const newTailPosition = isMoreThanOneFieldAway(newHeadPosition, tailPosition) ? headPosition : tailPosition
  const newInstruction = {direction: instruction.direction, amount: instruction.amount - 1}

  return moveByInstruction(newInstruction, [newTailPosition, ...visited], newHeadPosition, newTailPosition)
}

const findTravelledSquares = (instructions: Instruction[], visited: Position[], headPosition: Position, tailPosition: Position): Position[] => {
  const result = instructions.reduce((acc, instruction) => {
    return moveByInstruction(instruction, acc.visited, acc.headPosition, acc.tailPosition)
  }, {
    visited: visited,
    headPosition: headPosition,
    tailPosition: tailPosition
  })
  return _.uniqWith(result.visited, (a: Position, b: Position) => a.first === b.first && a.second === b.second)
}

/*
 * Part 2
 */

const moveByInstruction2 = (instruction: Instruction, visited: Position[], headPosition: Position, tailPositions: Position[]) => {
  if (instruction.amount < 1) return {...{visited, headPosition, tailPositions}}

  const newHeadPosition = movePointByOne(headPosition, instruction.direction)

  const newTailPositions = tailPositions.reduce((newPositions, myPos, idx) => {
    const myHead = idx > 0 
      ? newPositions[idx - 1]
      : newHeadPosition

    const movement = {
      first: myHead.first > myPos.first
        ? 1
        : myHead.first < myPos.first
          ? -1
          : 0,
      second: myHead.second > myPos.second
        ? 1
        : myHead.second < myPos.second
          ? -1
          : 0,
    }

    const myNewPos = idx > 0 
      ? {first: myPos.first + movement.first, second: myPos.second + movement.second}
      : headPosition

    return [
      ...newPositions.slice(0, idx),
      isMoreThanOneFieldAway(myHead, myPos) 
        ? myNewPos 
        : myPos,
      ...newPositions.slice(idx+1)
    ]
  }, [...tailPositions])

  const newInstruction = {direction: instruction.direction, amount: instruction.amount - 1}

  return moveByInstruction2(newInstruction, [...newTailPositions.slice(newTailPositions.length-1), ...visited], newHeadPosition, newTailPositions)
}

const findTravelledSquares2 = (instructions: Instruction[], visited: Position[], headPosition: Position, tailPositions: Position[]): Position[] => {
  const result = instructions.reduce((acc, instruction) => {
    return moveByInstruction2(instruction, acc.visited, acc.headPosition, acc.tailPositions)
  }, {
    visited: visited,
    headPosition: headPosition,
    tailPositions: tailPositions
  })

  return _.uniqWith(result.visited, (a: Position, b: Position) => a.first === b.first && a.second === b.second)
}


const input = await getInput(9, false)

const solve1 = (input: string[]) => {
  const instructions = input.map((line): Instruction => ({
    direction: line.at(0) as Direction,
    amount: Number.parseInt(line.slice(1))
  }))

  return findTravelledSquares(instructions, [{first: 0, second: 0}], {first: 0, second: 0}, {first: 0, second: 0}).length
}

const solve2 = (input: string[]) => {
  const instructions = input.map((line): Instruction => ({
    direction: line.at(0) as Direction,
    amount: Number.parseInt(line.slice(1))
  }))

  return findTravelledSquares2(instructions, [{first: 0, second: 0}], {first: 0, second: 0}, Array(9).fill({first: 0, second: 0}))
    .length
}

printSolutions(solve1, solve2, input)

