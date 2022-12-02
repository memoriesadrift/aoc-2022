import {getInput, printSolutions} from './util/io.ts'

const input = (await getInput(2, false)).filter((line) => line !== '')

const codeToPoints = (code: string): 1 | 2 | 3 => code === 'A' || code == 'X' 
          ? 1 
          : code === 'B' || code == 'Y'
            ? 2 
            : 3

const winningMove = (first: 1 | 2 | 3) => {
  return first === 1 ? 2 : first === 2 ? 3 : 1
}

const losingMove = (first: 1 | 2 | 3) => {
  return first === 1 ? 3 : first === 2 ? 1 : 2
}

const calculateScore = ({first, second}: {first: 1 | 2 | 3, second: number}) => {
  if (first === second) return 3 + second
  if (winningMove(first) === second) return 6 + second
  return 0 + second
}


const calculateScoreGivenOutcome = ({first, outcome}: {first: 1 | 2 | 3, outcome: number}) => {
  // 1 = lose 2 = draw 3 = win
  if (outcome === 1) return 0 + losingMove(first)
  if (outcome === 2) return 3 + first

  return 6 + winningMove(first)
}

const solve1 = (input: string[]) => {
  return input.map((line) => {
    const [first, second] = line.split(' ')
    const played = {
      first: codeToPoints(first),
      second: codeToPoints(second)
    }

    return calculateScore(played)
  })
  .reduce((acc: number, curr) => acc + curr, 0)
}

const solve2 = (input: string[]) => {
  return input.map((line) => {
    const [first, second] = line.split(' ')
    const played = {
      first: codeToPoints(first),
      outcome: codeToPoints(second)
    }

    return calculateScoreGivenOutcome(played)
  })
  .reduce((acc: number, curr) => acc + curr, 0)

}

printSolutions(solve1, solve2, input)

