import {getInput, printSolutions} from './util/io.ts'

type Directory = {
  name: string
  size: number
}

const calculateDirSize = (input: string[], currentDirs: Directory[], finalDirs: Directory[], isKeepable: (dir: Directory) => boolean): Directory[] => {
  if (input.length === 0) return [...finalDirs, ...currentDirs.filter(isKeepable)]

  const [head, tail] = [input[0], input.slice(1)]

  if (head.startsWith('$ ls') || head.startsWith('dir')) return calculateDirSize(tail, currentDirs, finalDirs, isKeepable)

  if (head.startsWith('$ cd')) {
    const newDir: Directory = {
      name: head.slice(4).trim(),
      size: 0
    }

    const newDirs = (newDir.name === '..' || newDir.name === '/')
      ? newDir.name === '..'
        ? currentDirs.slice(1)                           // Go up a dir
        : currentDirs.filter((dir) => dir.name === '/')  // Go to root
      : [newDir, ...currentDirs]                         // Add dir

    // Check if dir is worth keeping
    if(newDir.name === '..') {
      const removedDir = currentDirs[0]
      if (isKeepable(removedDir)) {
        return calculateDirSize(tail, newDirs, [removedDir, ...finalDirs], isKeepable)
      }
    }

    return calculateDirSize(tail, newDirs, finalDirs, isKeepable)
  } 

  // Line must start with number
  const fileSize = head.split(' ')[0]

  const newDirs = currentDirs.map((dir) => ({name: dir.name, size: dir.size + Number.parseInt(fileSize)}))

  return calculateDirSize(tail, newDirs, finalDirs, isKeepable)
}

const input = await getInput(7, false)

const solve1 = (input: string[]) => {
  return calculateDirSize(input, [{name: '/', size: 0}], [], (dir) => dir.size <= 100000)
    .reduce((acc, curr) => acc + curr.size, 0)
}

const solve2 = (input: string[]) => {
  const dirSizes = calculateDirSize(input, [{name: '/', size: 0}], [], (_) => true)
  const fsSize = 70000000
  const neededSpace = 30000000
  const freeSpace = fsSize - dirSizes.filter((dir) => dir.name === '/').reduce((acc, curr) => acc + curr.size, 0)

  return dirSizes
    .sort((a, b) => a.size - b.size)
    .find((dir) => freeSpace + dir.size > neededSpace)
}

printSolutions(solve1, solve2, input)

