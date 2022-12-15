import {_} from './util/lodash.ts'
import {getInput, printSolutions} from './util/io.ts'
import type {Coord} from './util/types.ts'

type Tile = "sand" | "rock"

const buildMap = (coords: Coord[]): Map<string, Tile> => {
  const map = new Map<string, Tile>()
  coords.forEach((coord) => map.set(JSON.stringify(coord), 'rock'))

  return map
}

const simulateSandDrop = (map: Map<string, Tile>, part2?: boolean) => {
  const source = {x: 500, y: 0}

  const maxY = [...map.keys()].map((it: string): Coord => JSON.parse(it)).sort((a, b) => b.y - a.y)[0].y

  while (true) {
    if (part2) {
      const result = simulateSandMove(map, source, maxY + 2, part2 !== undefined)

      map.set(JSON.stringify(result.result), 'sand')
      if (result.halt) break
    } else {
      const result = simulateSandMove(map, source, maxY, part2 !== undefined)

      if (result.halt) break
      map.set(JSON.stringify(result.result), 'sand')
    }
  }

  return map
}

const simulateSandMove = (map: Map<string, Tile>, pos: Coord, maxY: number, part2: boolean): {halt: boolean, result: Coord} => {
  const next = {x: pos.x, y: pos.y + 1}
  const left = {x: pos.x - 1, y: pos.y + 1}
  const right = {x: pos.x + 1, y: pos.y + 1}
  const tile = map.get(JSON.stringify(next))

  if (part2 && next.y === maxY) return {halt: false, result: pos}
  switch (tile) {
    case 'rock':
    case 'sand':
      // check left and right
      if (map.get(JSON.stringify(left)) === undefined) return simulateSandMove(map, left, maxY, part2)
      if (map.get(JSON.stringify(right)) === undefined) return simulateSandMove(map, right, maxY, part2)
      if (part2 && pos.x === 500 && pos.y == 0) return {halt: true, result: pos}
      return {halt: false, result: pos}
    case undefined:
    default:
      if (part2 && next.y === maxY) return {halt: false, result: pos}
      if (next.y > maxY) return {halt: true, result: next}
      return simulateSandMove(map, next, maxY, part2)
  }
}

const coords = (input: string[]) => _.uniqWith(input
  .map((line) => line.split(' -> '))
  .map((coordList) => coordList.map((coords) => {
    const [x, y] = coords.split(',')

    return {x: Number.parseInt(x), y: Number.parseInt(y)}
  }))
  .flatMap((coordList) => {
    return coordList.map((coord, idx, arr) => {
      const next = arr.at(idx + 1) 
      if (next !== undefined) {
        const distance = {x: next.x - coord.x, y: next.y - coord.y}

        const coordsToAdd = [coord]
        let i = 1
        while (distance.x !== 0 || distance.y !== 0) {
          if (distance.x > 0) {
            coordsToAdd.push({x: coord.x + i, y: coord.y})
            distance.x -= 1
          }
          if (distance.x < 0) {
            coordsToAdd.push({x: coord.x - i, y: coord.y})
            distance.x += 1
          }
          if (distance.y > 0) {
            coordsToAdd.push({x: coord.x, y: coord.y + i})
            distance.y -= 1
          }
          if (distance.y < 0) {
            coordsToAdd.push({x: coord.x, y: coord.y - i})
            distance.y += 1
          }
          i += 1
        }

        return coordsToAdd
      }

      return [coord]
    })
  })
  .flat(), (a: Coord, b: Coord) => a.x === b.x && a.y === b.y)


const solve1 = (input: string[]) => {
  const map = buildMap(coords(input))

  return [...simulateSandDrop(map).values()].reduce((acc, curr) => curr === 'sand' ? acc + 1 : acc, 0)
}

const solve2 = (input: string[]) => {
  const map = buildMap(coords(input))

  return [...simulateSandDrop(map, true).values()].reduce((acc, curr) => curr === 'sand' ? acc + 1 : acc, 0)
}

const input = await getInput(14, false)
printSolutions(solve1, solve2, input)

