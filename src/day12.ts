import {getInput, printSolutions} from './util/io.ts'

type Node = {
  position: Position
  elevation: number
  distance: number
  isEnd: boolean
  isStart: boolean
  prev?: Position
}

type Position = {
  x: number
  y: number
}

// FIXME: All the array functions lead to a HIDEOUS runtime.
const dijkstra = (map: Node[], climb: boolean) => {
  return map.reduce(({unvisited, map}, _) => {
    const currentNode: Node | undefined = unvisited.find((node) => node.isStart) === undefined 
      ? unvisited.sort((a, b) => a.distance - b.distance).at(0)   // visited start already, find min dist node
      : unvisited.find((node) => node.isStart)                    // start at the start

    // list of unvisited nodes must be empty
    if (currentNode === undefined) return {unvisited, map}
    if (currentNode.isEnd) return {unvisited, map}

    const neighbours = findNeighbours(currentNode, unvisited)

    const adjustedNeighbours = neighbours.map((neighbour) => {
      const alt = (climb ? neighbour.elevation <= currentNode.elevation + 1 : (neighbour.elevation === currentNode.elevation - 1 || neighbour.elevation >= currentNode.elevation))
        ? currentNode.distance + 1
        : Infinity

      if (alt < neighbour.distance) {
        return {
          ...neighbour,
          distance: alt,
          prev: currentNode.position
        }
      }
      return neighbour
    })

    const newMap = map
      .map((node) => {
        const updatedNode = adjustedNeighbours.find((other) => other.position.x === node.position.x && other.position.y === node.position.y)

        if (updatedNode !== undefined) return updatedNode

        return node
      })

    const newUnvisited = newMap
      .filter((node) => unvisited.find((other) => other.position.x === node.position.x && other.position.y === node.position.y) !== undefined)
      .filter((node) => !(node.position.x === currentNode.position.x && node.position.y === currentNode.position.y))

    return {
      unvisited: newUnvisited,
      map: newMap
    }
  }, {unvisited: map, map: map})

}

const buildMap = (input: string[]) => {
  return input
    .flatMap((line, y) => line
         .split('')
         .map((node, x): Node => ({
           position: {x, y},
           distance: node === 'S' ? 0 : Infinity,
           prev: undefined,
           isEnd: node === 'E' ? true : false,
           isStart: node === 'S' ? true : false,
           elevation: node === 'E' 
             ? 26 
             : node === 'S'
               ? 1
               : node.charCodeAt(0) - 96
         })))

}

const findNeighbours = (node: Node, unvisitedNodes: Node[]) => {
  const myPosition = node.position

  return unvisitedNodes.filter((other) => {
    const neighbour = other.position
    return (
      (neighbour.x === myPosition.x && neighbour.y === myPosition.y + 1) || // down
      (neighbour.x === myPosition.x && neighbour.y === myPosition.y - 1) || // up
      (neighbour.x === myPosition.x - 1 && neighbour.y === myPosition.y) || // left
      (neighbour.x === myPosition.x + 1 && neighbour.y === myPosition.y)    // right
    )
  })

}

const solve1 = (input: Node[]) => 0 // dijkstra(input, true).map.filter((it) => it.isEnd)

const solve2 = (input: Node[]) => {
  const modifiedMap = input.map((it) => {
    if (it.isStart) return {...it, isStart: false, distance: Infinity}
    return it
  }).map((it) => {
    if (it.isEnd) return {...it, isEnd: false, isStart: true, distance: 0}
    return it
  })

  return dijkstra(modifiedMap, false).map.filter((node) => node.elevation === 1).sort((a, b) => a.distance - b.distance).at(0)
}

const input = await getInput(12, false)
const nodes = buildMap(input)

printSolutions(solve1, solve2, nodes)

