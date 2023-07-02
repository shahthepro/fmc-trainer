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

function genScramble({
  len,
  allFaces,
  quarterTurns,
  parallelFaces,
  maxQuarterTurns,
}) {
  allFaces = allFaces || ['F', 'B', 'R', 'L', 'U', 'D'];
  quarterTurns = quarterTurns || allFaces;
  parallelFaces = parallelFaces || [
    ['U', 'D'],
    ['F', 'B'],
    ['R', 'L'],
  ]
  maxQuarterTurns = maxQuarterTurns || 0
  len = len || 25

  function _isParallel(face1, face2) {
    return Boolean(
      parallelFaces.find(
        ([f1, f2]) => (
          (face1 == f1 && face2 == f2) 
            || (face1 == f2 && face2 == f1)
        )
      )
    )
  }

  function _getTurn(face, onlyHalfTurns) {
    if (onlyHalfTurns || !quarterTurns.includes(face)) {
      return `${face}2`
    }

    const turn = ['', `'`, '2'][Math.floor(Math.random() * 3)]

    return `${face}${turn}`
  }

  function _isQuarterTurn(move) {
    return !move.endsWith('2')
  }

  const scramble = []
  const faces = []
  let qtCounter = maxQuarterTurns || len

  for (let i = scramble.length; i < len; i++) {
    const [f1, f2] = faces.slice(-2)

    const excludeFaces = faces.length < 2 ? [f1] : (_isParallel(f1, f2) ? [f1, f2] : [f2])
    const possibleFaces = allFaces.filter(x => !excludeFaces.includes(x))

    const nextFace = possibleFaces[Math.floor(Math.random() * possibleFaces.length)]
    faces.push(nextFace)

    const nextTurn = _getTurn(nextFace, qtCounter == 0)
    if (qtCounter > 0 && _isQuarterTurn(nextTurn)) {
      qtCounter = qtCounter - 1;
    }
    scramble.push(nextTurn)
  }

  return scramble.join(' ')
}

module.exports = {
  runNissy,
  getDROptimalLength,
  getAllDRSolutions,

  solve,
  inverse,
  genScramble,
  genAltScramble,
}
