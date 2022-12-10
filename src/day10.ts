import {_} from './util/lodash.ts'
import {getInput, printSolutions} from './util/io.ts'

type Processor = {
  state: ProcessorState
  capturedStates: ProcessorState[]
  screenBuffer: string[]
}

type ProcessorState = {
  x: number
  cycle: number
}


const solve1 = (input: string[]) => {
  return input.reduce((acc: Processor, line): Processor => {
    const [_, number] = line.split(' ')

    return {
      state: {
        x: number !== undefined
          ? acc.state.x + Number.parseInt(number)
          : acc.state.x,
        cycle: acc.state.cycle + (number ? 2 : 1)
      },
      capturedStates: (
        (acc.state.cycle - 20) % 40 === 0 || 
        ((acc.state.cycle - 19) % 40 === 0 && number) ||
        acc.state.cycle === 20 || 
        (acc.state.cycle === 19 && number)
      ) ? [...acc.capturedStates, {x: acc.state.x, cycle: acc.state.cycle + ((acc.state.cycle - 20) % 40 === 0 ? 0 : 1)}] : acc.capturedStates,
      screenBuffer: acc.screenBuffer
    }
  }, {
    state: {
      x: 1,
      cycle: 1
    },
    capturedStates: [],
    screenBuffer: []
  }).capturedStates.reduce((sum, curr) => sum + curr.x * curr.cycle, 0)
}

const solve2 = (input: string[]) => {
  const screenBuffer = input.reduce((acc: Processor, line): Processor => {
    const [_, number] = line.split(' ')

    const newCycle = acc.state.cycle > 40 
      ? acc.state.cycle - 40 
      : acc.state.cycle
    const crtPosition = newCycle - 1

    const spriteRange = [acc.state.x - 1, acc.state.x, acc.state.x + 1]

    const pixelsToDraw = [
      spriteRange.some((it) => it === crtPosition) ? '#' : '.',
      number !== undefined 
        ? spriteRange.some((it) => it === (crtPosition + 1 > 39 ? 0 : crtPosition + 1))
          ? '#' 
          : '.'
        : ''
    ].filter((e) => e !== '')

    return {
      state: {
        x: number !== undefined
          ? acc.state.x + Number.parseInt(number)
          : acc.state.x,
        cycle: newCycle + (number !== undefined ? 2 : 1)
      },
      screenBuffer: [...acc.screenBuffer, ...pixelsToDraw],
      capturedStates: acc.capturedStates
    }
  }, {
    state: {
      x: 1,
      cycle: 1
    },
    capturedStates: [],
    screenBuffer: []
  }).screenBuffer

  return _.chunk(screenBuffer, 40)
   .map((lineArray) => lineArray.join(''))
}

const input = await getInput(10, false)
printSolutions(solve1, solve2, input)

