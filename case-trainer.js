class CaseTrainer {
  constructor ({
    premove,
    allFaces,
    quarterTurns,
    parallelFaces,
    maxQuarterTurns
  } = {}) {
    this.allFaces = allFaces || ['F', 'B', 'R', 'L', 'U', 'D'];
    this.quarterTurns = quarterTurns || this.allFaces;

    this.premove = premove || ''
    this.parallelFaces = parallelFaces || [
      ['U', 'D'],
      ['F', 'B'],
      ['R', 'L'],
    ]

    this.maxQuarterTurns = maxQuarterTurns || 0
  }

  _isParallel (face1, face2) {
    return Boolean(
      this.parallelFaces.find(
        ([f1, f2]) => (
          (face1 == f1 && face2 == f2) 
            || (face1 == f2 && face2 == f1)
        )
      )
    )
  }

  _getTurn(face, onlyHalfTurns) {
    if (onlyHalfTurns || !this.quarterTurns.includes(face)) {
      return `${face}2`
    }

    const turn = ['', `'`, '2'][Math.floor(Math.random() * 3)]

    return `${face}${turn}`
  }

  _isQuarterTurn(move) {
    return !move.endsWith('2')
  }
  
  scramble(length = 25) {
    const scramble = []

    if (typeof this.premove == "string") {
      scramble.push(...this.premove.split(' '))
    } else if (Array.isArray(this.premove)) {
      scramble.push(
        ...(this.premove[
          Math.floor(Math.random() * this.premove.length)
        ].split(' '))
      )
    }

    const faces = scramble.map(x => x.replace(/[^UDFBRL]/g, ''))
    let qtCounter = this.maxQuarterTurns || length
    for (let i = scramble.length; i < length; i++) {
      const [f1, f2] = faces.slice(-2)

      const excludeFaces = faces.length < 2 ? [f1] : (this._isParallel(f1, f2) ? [f1, f2] : [f2])
      const possibleFaces = this.allFaces.filter(x => !excludeFaces.includes(x))

      const nextFace = possibleFaces[Math.floor(Math.random() * possibleFaces.length)]
      faces.push(nextFace)

      const nextTurn = this._getTurn(nextFace, qtCounter == 0)
      if (qtCounter > 0 && this._isQuarterTurn(nextTurn)) {
        qtCounter = qtCounter - 1;
      }
      scramble.push(nextTurn)
    }

    return scramble.join(' ')
  }
}

module.exports = CaseTrainer
