const { program } = require('commander')

program
  .option('-t, --trainer <string>')
  .option('-s, --show-solutions <bool>')
  .option('-q, --max-qt <number>')

program.parse()

const options = program.opts()

const { getDROptimalLength, getAllDRSolutions } = require("./nissy")
const CaseTrainer = require("./case-trainer")
const CaseTrainerV2 = require("./case-trainer-v2")

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

// const allTrainers = {
//   eo: new CaseTrainer(),
//   dr: new CaseTrainer({
//     // DR on F/B
//     quarterTurns: ['U', 'D', 'R', 'L']
//   }),

//   corners: new CaseTrainer({
//     // DR corners
//     quarterTurns: ['U', 'D'],
//     maxQuarterTurns: parseInt(options.maxQt) || 4
//   }),

//   dr_basic: new CaseTrainer({
//     premove: [
//       "R", // 4c4e
//       // "R F2 U2 R", // 4c4e
//       "R F2 R", // 4c2e
//       "R U R", // 3c2e
//     ],
//     quarterTurns: ['U', 'D']
//   }),

//   dr_mid: new CaseTrainer({
//     premove: [
//       "R", // 4c4e
//       // "R F2 U2 R", // 4c4e
//       "R F2 R", // 4c2e
//       "R U R", // 3c2e
//       "R F2 L", // 4c6e
//       "R U D2 L", // 3c6e
//     ],
//     quarterTurns: ['U', 'D']
//   }),

//   trigger_4c4e: new CaseTrainer({
//     premove: "R",
//     quarterTurns: ['U', 'D']
//   }),
// }

const trainersV2 = {
  "dr": new CaseTrainerV2({
    quarterTurns: ['U', 'D'],
    generators: [
      "R", // 4c4e
      "R F2 R", // 4c2e
      "R U R", // 3c2e
      // "R F2 L", // 4c6e
      // "R U D2 L", // 3c6e
    ]
  }),
  "4c4e": new CaseTrainerV2({
    quarterTurns: ['U', 'D'],
    preserveGeneratorState: true,
    generators: [
      "B2 L",
      "F2 D2 R",
      "B2 U L",
      "L2 D R",
      "F2 D R",
      "R2 U R",
      "R2 F2 R",
      "R2 U2 R",
      "F2 B2 L",
      "L2 U' D R",
      "B2 U2 D2 R",
      "B2 U' D2 R",
      "F2 U2 D' L",
      "R2 F2 U2 R",
      "F2 U D R",
      "L2 B2 D R",
      "B2 R2 U L",
      "R2 F2 U R",
      "F2 L2 D R",
      "L2 F2 U L",
      "B2 L2 D L",
      "R2 B2 D L",
      "F2 R2 U R",
      "R2 U2 B2 L",
      "F2 R2 D2 R",
      "R2 D' F2 R",
      "F2 U' F2 R",
      "L2 D' F2 L",
      "B2 U' F2 L",
      "L2 U' B2 R",
      "B2 D' F2 L",
      "L2 U B2 R",
      "B2 D B2 R",
      "R2 L2 D' R",
      "F2 U2 F2 R",
      "R' D2 F2 R",
      "R' U2 F2 R",
    ],
  }),
  "corners": new CaseTrainerV2({
    quarterTurns: [],
    preserveGeneratorState: true,
    generators: [
      "R2",
      // "F2 R2",
      "R2 U R2",
      // "F2 R2 F2",
      // "F2 U2 R2",
      "F2 U' F2 R2",
      "R2 U' R2 U R2",
      "R2 U R2 U R2",
      "R2 U2 F2 U' R2",
      "R2 U F2 U2 R2",
      "F2 U' F2 U F2 R2",
      "F2 R2 U R2 U F2",
      "R2 U F2 U' F2 U F2",
      "F2 U F2 U2 R2 U F2",
      "F2 U' F2 U F2 U2 R2",
      "R2 U2 F2 U' F2 U F2",
      "R2 U' R2 U R2 U' R2",
      "F2 U R2 U2 F2 U F2",
      "R2 U F2 U2 R2 U' F2",
      "F2 U R2 U2 F2 U' R2",
      "F2 U2 R2 U' R2 U2 F2",
      "F2 U F2 U' F2 R2 U' F2",
      "F2 R2 U' F2 U R2 U' R2",
      "F2 U R2 U2 F2 U F2 U' R2",
      "R2 U' R2 U R2 U' R2 U R2",
      "F2 U R2 U R2 U2 F2 U' R2",
      "R2 U R2 U2 F2 U' F2 U F2",
      "R2 U' F2 U R2 U' F2 U R2",
      "F2 U R2 U' F2 U R2 U' R2",
      "F2 U F2 U2 R2 U' R2 U2 F2",
      "R2 U R2 U' F2 U R2 U' F2",
      "F2 U2 R2 U R2 U2 F2 U' F2",
      "F2 U' F2 U F2 U' F2 U' R2",
      "R2 U F2 U F2 U' F2 U F2",
      "F2 R2 U' R2 U F2 U' R2 U F2",
      "F2 R2 U F2 U' F2 U R2 U' R2",
      "F2 U F2 U' F2 U F2 R2 U R2",
      "F2 R2 U R2 U' R2 U F2 U' R2",
      "F2 U2 R2 U F2 U2 R2 U R2 U2 F2",
      "F2 U F2 U2 R2 U F2 U2 R2 U' R2",
      "F2 U F2 U R2 U2 F2 U' R2 U F2",
      "R2 U' F2 U' R2 U R2 U' R2 U' F2",
      "F2 U F2 U2 R2 U R2 U2 F2 U' F2",
    ]
  })
}

async function main() {
  let counter = 0
  const trainer = trainersV2[options.trainer] || trainersV2["dr"]

  let won = 0

  while (true) {
    counter++
    const scramble = await trainer.scramble()

    const solution = (await getNextInput(`${counter}. ${scramble}\n`)).toUpperCase().trim()
    
    if (trainer.preserveGeneratorState) {
      const optimalSoln = trainer.getLastGenUsed()

      if (solution && solution == optimalSoln || solution.split(' ').length <= optimalSoln.split(' ').length) {
        won++
        console.log(`✅ ${won}/${counter} (${optimalSoln})\n`)
      } else {
        console.log(`❌ Optimal is ${trainer.getLastGenUsed()}\n`)
      }
    } else {
      const maxLen = await getDROptimalLength(scramble)
      const solutions = await getAllDRSolutions(scramble, maxLen)

      if (solution.split(' ').length  <= maxLen) {
        won++
        console.log(`✅ ${won}/${counter}\n`)
      } else {
        console.log(`❌ Optimal is ${maxLen} moves \n`)
      }

      console.log("Solutions:")
      console.log(solutions.split("\n").filter(x => x.trim().length > 0).map((x, i) => `\t${i+1}. ${x}`).join("\n"))
      console.log("")
    }

  }
}

main()
