import {getInput, printSolutions} from './util/io.ts'
import {transposeArray} from './util/index.ts'

const determineForAllDirections = <T>(it: number, row: number, col: number, rows: number[][], cols: number[][], fun: (it: number, line: number[]) => T) => {
  // top
  const top = row === 0 ? [] : cols[col].slice(0, row).reverse()
  const topResult = fun(it, top)
  // bottom
  const bottom = row === cols.length - 1 ? [] : cols[col].slice(row + 1)
  const bottomResult = fun(it, bottom)
  // left
  const left = col === 0 ? [] : rows[row].slice(0, col).reverse()
  const leftResult = fun(it, left)
  // right
  const right = col === cols.length - 1 ? [] : rows[row].slice(col + 1)
  const rightResult = fun(it, right)

  return [topResult, bottomResult, leftResult, rightResult]
}

const checkVisibility = (it: number, line: number[]) => Math.max(...line) < it

const checkScore = (it: number, line: number[]): number => {
  if (line.length === 0) return 0

  const [head, tail] = [line[0], line.slice(1)]

  if (head >= it) {
    return 1
  }

  return 1 + checkScore(it, tail)
}

const input = await getInput(8, false)

const solve1 = (input: string[]) => {
  const rows = input.map((line) => line.split('').map((it) => Number.parseInt(it)))
  const cols = transposeArray(rows)

  return rows.reduce((acc, currRow, rowIdx) => {
    const isVisible = currRow.reduce((acc, it, colIdx) => {
      const visible = determineForAllDirections(it, rowIdx, colIdx, rows, cols, checkVisibility)
        .includes(true)

      return acc + (visible ? 1 : 0)
    }, 0)

    return acc + isVisible
  }, 0)
}

const solve2 = (input: string[]) => {
  const rows = input.map((line) => line.split('').map((it) => Number.parseInt(it)))
  const cols = transposeArray(rows)

  return rows.reduce((max, currRow, rowIdx) => {
    const scenicScore = currRow.reduce((localMax, it, colIdx) => {
      const currentScore = determineForAllDirections(it, rowIdx, colIdx, rows, cols, checkScore)
        .reduce((acc, curr) => acc * curr, 1)

      return currentScore > localMax ? currentScore : localMax
    }, 0)

    return scenicScore > max ? scenicScore : max
  }, 0)

}

printSolutions(solve1, solve2, input)

