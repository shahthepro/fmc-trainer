const { exec } = require('child_process')

async function runNissy(command, scramble, { 
  maxLen
} = {}) {
  const cmd = ['nissy solve', command]

  if (maxLen) {
    cmd.push(`-M ${maxLen}`)
  }

  cmd.push(`"${scramble}"`)

  return new Promise((resolve, reject) => {
    exec(cmd.join(' '), (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        reject()
      }
      
      if (stderr) {
        console.error(stderr)
        reject()
      }
      
      resolve(stdout)
    })
  })
}

async function getDROptimalLength(scramble) {
  const soln = await runNissy("dr", scramble)
  const [, len] = /\(([0-9]+)\)/.exec(soln)
  return len
}

async function getAllDRSolutions(scramble, maxLen) {
  maxLen = maxLen || (await getDROptimalLength(scramble))
  const solutions = await runNissy("dr", scramble, { maxLen })

  return solutions
}

async function solve(scramble) {
  const solution = await runNissy("light", scramble)
  return solution.split(" (")[0]
}

function inverse(scramble) {
  const inverseScramble = scramble
    .split(" ")
    .map(m => {
      if (m.endsWith("'")) {
        return m.replace("'", "")
      } else if (m.endsWith("2")) {
        return m
      } else {
        return `${m}'`
      }
    })

  return inverseScramble.reverse().join(" ")
}

async function genAltScramble(scramble) {
  const solution = await solve(scramble)

  return inverse(solution)
}

module.exports = {
  runNissy,
  getDROptimalLength,
  getAllDRSolutions,

  solve,
  inverse,
  genAltScramble
}
