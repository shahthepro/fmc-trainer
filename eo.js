const { program } = require('commander')

program.option('-c, --case <string>')
program.option('-s, --show-hint <boolean>')
program.parse()
const options = program.opts()

const { inverse, genScramble, genAltScramble } = require("./nissy");

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function getNextInput(q) {
  return new Promise(r => {
    readline.question(q, (ans) => {
      if (ans === "q") {
        process.exit(0)
      }
      r(ans)
    })
  })
}

const cases_6e =  [{
  name: "204 Opp",
  generator: inverse("B U F L F"),
  total_eos: 8
}, {
  name: "024 Adj",
  generator: inverse("B R B U B"),
  total_eos: 12
}, {
  name: "024 Opp",
  generator: inverse("B R B U B"),
  total_eos: 16
}, {
  name: "303 #1",
  generator: inverse("B R U R F"),
  total_eos: 8
}, {
  name: "303 #2",
  generator: inverse("B' R U R F"),
  total_eos: 8
}, {
  name: "033 (Bad)",
  generator: inverse("B' R U L B"),
  total_eos: 3
}, {
  name: "033 (Good)",
  generator: inverse("B D L' R B"),
  total_eos: 9
}, {
  name: "231 Adj #1",
  generator: inverse("L F' R2 D B"),
  total_eos: 2
}, {
  name: "231 Opp #1",
  generator: inverse("R F' D2 U B"),
  total_eos: 6
}, {
  name: "231 Adj #2",
  generator: inverse("R F' L2 D' B"),
  total_eos: 10
}, {
  name: "231 Adj #3",
  generator: inverse("U F L D2 B"),
  total_eos: 8
}, {
  name: "231 Opp #2",
  generator: inverse("U F D L2 B"),
  total_eos: 14
}, {
  name: "213 Adj #1",
  generator: inverse("B' L D2 R F"),
  total_eos: 16
}, {
  name: "213 Adj #2",
  generator: inverse("F B D L2 B"),
  total_eos: 25
}, {
  name: "213 Opp #1",
  generator: inverse("B' U R' L F"),
  total_eos: 1
}, {
  name: "213 Opp #2",
  generator: inverse("B' U' R' L F"),
  total_eos: 1
}, {
  name: "222 Opp Diag Adj",
  generator: inverse("L B L2 R' F"),
  total_eos: 8
}, {
  name: "222 Adj Adj Adj #1",
  generator: inverse("D' B D2 L F"),
  total_eos: 8
}, {
  name: "222 Adj Adj Adj #2",
  generator: inverse("R B R2 U' F"),
  total_eos: 6
}, {
  name: "222 Adj Adj Adj #3",
  generator: inverse("U F' D2 R B"),
  total_eos: 2
}, {
  name: "222 Adj Adj Opp #1",
  generator: inverse("U' F L2 U B"),
  total_eos: 2
}, {
  name: "222 Adj Adj Opp #2",
  generator: inverse("L' B' L2 R' F"),
  total_eos: 1
}, {
  name: "222 Adj Adj Opp #3",
  generator: inverse("B' R B' L2 F"),
  total_eos: 9
}, {
  name: "222 Adj Diag Adj #1",
  generator: inverse("L B' L2 U F"),
  total_eos: 2
}, {
  name: "222 Adj Diag Adj #2",
  generator: inverse("L B L2 U F"),
  total_eos: 16
}, {
  name: "222 Opp Adj Opp #2",
  generator: inverse("U B L R2 F"),
  total_eos: 2
}, {
  name: "123 Adj NoSym #1",
  generator: inverse("B' D2 R L F"),
  total_eos: 5
}, {
  name: "123 Adj NoSym #2",
  generator: inverse("R' B' D2 L F"),
  total_eos: 12
}, {
  name: "123 Adj NoSym #3",
  generator: inverse("R B' D L' F"),
  total_eos: 12
}, {
  name: "123 Diag NoSym #1",
  generator: inverse("B D U L2 F"),
  total_eos: 20
}, {
  name: "123 Diag NoSym #2",
  generator: inverse("B' D R' U F"),
  total_eos: 16
}, {
  name: "123 Arrow Adj #1",
  generator: inverse("B R2 D' L F"),
  total_eos: 4
}, {
  name: "123 Arrow Adj #2",
  generator: inverse("F U2 R D F"),
  total_eos: 12
}, {
  name: "123 Arrow Adj #3",
  generator: inverse("F' U' D L F"),
  total_eos: 15
}, {
  name: "123 Plus Adj #1",
  generator: inverse("F' U B L F"),
  total_eos: 12
}, {
  name: "123 Plus Adj #2",
  generator: inverse("F' U2 R D F"),
  total_eos: 10
}, {
  name: "123 Plus Adj #3",
  generator: inverse("F' U2 D R' F"),
  total_eos: 10
}, {
  name: "123 Plus Diag",
  generator: inverse("F' U D R' F"),
  total_eos: 10
}, {
  name: "123 Arrow Diag",
  generator: inverse("D F B' R B"),
  total_eos: 13
}]

const cases = {
  "6E": cases_6e
}


async function main() {
  let counter = 0

  const allEOCases = cases[options.case?.toUpperCase()] || cases["6E"]

  while (true) {
    counter++

    const eoCase = allEOCases[
      Math.floor(Math.random() * allEOCases.length)
    ]

    const scramble = await genAltScramble(`${genScramble({ 
      len: 10,
      quarterTurns: ['U', 'D']
    })} ${eoCase.generator}`)

    await getNextInput(`${counter}. ${scramble}${options.showHint ? ` (EO Algs: ${eoCase.total_eos})` : '' }\n`)

    await getNextInput(`Generator: ${eoCase.generator}; Solutions: ${eoCase.total_eos} [${eoCase.name}]\n`)
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    process.exit(0)
  })