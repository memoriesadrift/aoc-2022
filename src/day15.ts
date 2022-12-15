// First day where I had no clue what to do...
// Solution I based mine on: https://www.reddit.com/r/adventofcode/comments/zmcn64/comment/j0axxpo

import {_} from './util/lodash.ts'
import {getInput, printSolutions} from './util/io.ts'
import type {Coord} from './util/types.ts'

type DataPoint = {
  sensor: Coord
  beacon: Coord
}

const parseInput = (input: string[]) => {
  return input.map((line): DataPoint => {
    const firstSlice = line
      .slice(
        line.indexOf('x='),
        line.indexOf(':'))
      .split(',')
      .map((it) => Number.parseInt(it.trim().slice(2)))

    const secondSlice = line
      .slice(line.indexOf('is at') + 'is at'.length)
      .split(',')
      .map((it) => Number.parseInt(it.trim().slice(2)))

    return {
      sensor: {
        x: firstSlice[0],
        y: firstSlice[1],
      },
      beacon: {
        x: secondSlice[0],
        y: secondSlice[1],
      }
    }
  })
}

const solve1 = (input: string[]) => {
  const row = 2000000

  const resultSet = new Set()

  // .map() has failed me... or have I failed .map()..?
  parseInput(input).forEach(({sensor, beacon}) => {
    const dist = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
    const restDist = dist - Math.abs(row - sensor.y)
    
    if (restDist < 0) {
      return
    }

    if (!(sensor.x === beacon.x && row === beacon.y)) {
      resultSet.add(sensor.x)
    }

    for(let i = 1; i < restDist + 1; i += 1) {
      if (!(sensor.x - i === beacon.x && row === beacon.y)) {
        resultSet.add(sensor.x - i)
      }

      if (!(sensor.x + i === beacon.x && row === beacon.y)) {
        resultSet.add(sensor.x + i) 
      }
    }
  })

  return resultSet.size
}

const solve2 = (input: string[]) => {
  for (let row = 0; row <= 4000000; row += 1) {
    const ranges: {start: number, end: number}[] = []
    parseInput(input).forEach(({sensor, beacon}) => {
      const dist = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
      const restDist = dist - Math.abs(row - sensor.y)

      if (restDist < 0) return
      ranges.push({start: sensor.x - restDist, end: sensor.x + restDist})
    })

    ranges.sort((a, b) => a.start - b.start)
    const merged = []
    for (let i = 0; i < ranges.length - 1; i += 1) {
      const curr = ranges[i]
      const next = ranges[i+1]

      if ((next.start <= curr.end && curr.end <= next.end) || next.start === curr.end + 1) {
        ranges[i + 1] = {start: curr.start, end: next.end}
      } else if (curr.start <= next.start && curr.end >= next.end) {
        ranges[i + 1] = curr
      } else {
        merged.push(curr)
      }
    }
    merged.push(ranges[ranges.length - 1])
    if (merged.length > 1) {
      return (merged[0].end + 1) * 4000000 + row
    }
  }
}

const input = await getInput(15, false)
printSolutions(solve1, solve2, input)

