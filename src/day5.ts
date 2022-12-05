import {getInputKeepEmptyLines, printSolutions} from './util/io.ts'
import {reverseList, appendToList} from './util/index.ts'
import type {List} from './util/types.ts'

type Stack = {
  id: number
  contents: List<string>
  offset: number
}

type Item = {
  item: string,
  offset: number
}

type Command = {
  qty: number,
  from: number,
  to: number
}

const parseStack = (input: string[]) => {
  const stackInfo = input.at(input.length - 1) 
  if (stackInfo === undefined) throw Error('Parsing stacks failed 💀')

  const stacks: Stack[] = stackInfo
    .split('')
    .filter((it) => it !== ' ')
    .map((id, index): Stack => {
      return {
        id: Number.parseInt(id),
        contents: {item: null, next: null},
        offset: index * 4 + 1
      }
    })

  const rawStackData = input.reverse().slice(1)

  const stackData = rawStackData
    .flatMap((line) => {
      return line
        .split('')
        .map((it, idx): Item => {
          if (['', ' ', '[', ']'].find((e) => e === it)) return {
            item: '',
            offset: 0
          }

          return {
            item: it,
            offset: idx
          }
        })
        .filter((it) => it.item !== '')
    })

    return stacks
      .map((initialStack) => {
        return stackData.reduce((stack, item) => {
          if (item.offset !== stack.offset) return stack

            return {
              id: stack.id,
              offset: stack.offset,
              contents: {
                item: item.item,
                next: stack.contents
              }
            }
        }, initialStack)
      })
}

const parseCommands = (input: string[]): Command[] => {
  return input 
    .filter((line) => line.length > 0)
    .map((line) => 
         [...line.matchAll(/\d+/g)]
          .flatMap((arr) => arr.map((num) => Number.parseInt(num)))
        )
    .map(([qty, from, to]): Command => ({qty, from, to}))
}

const parseInput = (input: string[]): [Stack[], Command[]] => {
  const splitPoint = input.findIndex((line) => line.length === 0)
  if (splitPoint === undefined) throw Error('Parsing input failed 💀')

  const [stack, commands] = [
    parseStack(input.slice(0, splitPoint)),
    parseCommands(input.slice(splitPoint, input.length))
  ]

  return [stack, commands]
}

const input = await getInputKeepEmptyLines(5, false)

const solve1 = (input: string[]) => {
  const [initialStacks, commands] = parseInput(input)

  return commands
    .reduce((stacks, command) => {
      const fromStack = stacks.at(command.from - 1)
      const toStack = stacks.at(command.to - 1)
      const qtyMap = Array(command.qty).fill(0)

      if (fromStack === undefined || toStack === undefined) throw Error('Too bad!')

      const updatedStacks = qtyMap
        .reduce((fromToStacks, _) => {
          const oldFrom = fromToStacks.from
          const oldTo = fromToStacks.to

          const newFrom = {
            id: oldFrom.id,
            offset: oldFrom.offset,
            contents: oldFrom.contents.next,
          }

          const newTo = {
            id: oldTo.id,
            offset: oldTo.offset,
            contents: {item: oldFrom.contents.item, next: oldTo.contents},
          }

          return {from: newFrom, to: newTo}
        }, {from: fromStack, to: toStack})


      const newStacks = stacks
      newStacks[command.from - 1] = updatedStacks.from
      newStacks[command.to - 1] = updatedStacks.to

      return newStacks
    }, initialStacks)
    .map((stack) => stack.contents.item)
    .join('')
}

const solve2 = (input: string[]) => {
  const [initialStacks, commands] = parseInput(input)

  return commands
    .reduce((stacks, command) => {
      const fromStack = stacks.at(command.from - 1)
      const toStack = stacks.at(command.to - 1)
      const qtyMap = Array(command.qty).fill(0)

      if (fromStack === undefined || toStack === undefined) throw Error('Too bad!')

      const updatedStacks = qtyMap
        .reduce((fromAndRemoved, _) => {
          const oldFrom = fromAndRemoved.from

          const newFrom = {
            id: oldFrom.id,
            offset: oldFrom.offset,
            contents: oldFrom.contents.next,
          }

          const newRemoved = fromAndRemoved.removed.item !== null
            ? {item: oldFrom.contents.item, next: fromAndRemoved.removed}
            : {item: oldFrom.contents.item, next: null}

          return {from: newFrom, removed: newRemoved}
      }, {from: fromStack, removed: {item: null, next: null} as List<string>})


      // Reverse List
      const reversedRemoved = reverseList<string>(updatedStacks.removed)
      const contentsToAdd = appendToList(reversedRemoved, toStack.contents)

      const newTo = {
        id: toStack.id,
        offset: toStack.offset,
        contents: contentsToAdd
      }

      const newStacks = stacks
      newStacks[command.from - 1] = updatedStacks.from
      newStacks[command.to - 1] = newTo

      return newStacks
    }, initialStacks)
    .map((stack) => stack.contents.item)
    .join('')

}

printSolutions(solve1, solve2, input)

