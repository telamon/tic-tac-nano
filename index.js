// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * 20bit CRDT Tic-Tac-Toe
 *  _____
 * |0|1|3|\
 * |4|2|5| |
 * |6|7|8| |
 *  \_\_\_\.
 *
 */

// Due to symmetry first move only has 2bits
//           0  1  2  3  4  5  6  7  8
const BPM = [2, 3, 3, 3, 3, 2, 2, 1] // bits-per-move

/*Result:
Packed game 799002 = 11000011000100011010
| o | x | o |
| o | x | x |
|   | o | x |
*/


/*
 * Takes two versions of the same game
 * and returns the one with the most moves.
 * Throws error when trying to merge two
 * unrelated game-sessions.
 */
function merge (a, b) {
  let backup = b
  // swap if necessary so that A <= B
  if (a > b) {
    b = a
    a = backup
    backup = b
  }
  // Align B to A
  while (a < b) b >>= 1
  if (a !== b) throw new Error('UnrelatedGameError')
  return backup
}

// Unpacks a Number into a 3 by 3 board with crosses
// and noughts.
function unpackBoard (x, maxMove = 8) {
  const board = []
  let markerFound = false
  let o = 0 // output bit offset
  let move = 0 // move number
  let n = 0 // move value buffer
  for (let j = 20; j >= 0; j--) {
    const bit = (x >> j) & 1
    // Skip bits until we find the tail-bit marker
    if (!markerFound) {
      if (bit) markerFound = true
      continue
    }

    n |= bit << (BPM[move] - ++o)
    if (BPM[move] > o) continue // buffering
    if (!move) {
      if (n & 0b10) board[4] = 'x'
      else board[n] = 'x'
    } else {
      // Find empty board index while skipping over occupied slots.
      let p = 0
      while (board[p] || n--) p++
      board[p] = move % 2 ? 'o' : 'x'
    }
    n = o = 0
    if (move === maxMove) return board
    move++
  }
  return board
}

function nMoves (game) {
  let i = 0
  while (game && game !== 1) game >>>= BPM[i++]
  if (i > 9) throw new Error('InvalidNumberOfEntries')
  return i
}

function packMove (game, idx) {
  game = game || 1
  const i = nMoves(game)
  return (game << BPM[i]) | idx
}

// Print board
function printBoard (board) {
  const rows = []
  for (let i = 0; i < 3; i++) {
    rows.push([
      '|', board[i * 3] || ' ',
      '|', board[i * 3 + 1] || ' ',
      '|', board[i * 3 + 2] || ' ', '|'
    ].join(''))
  }
  console.log(rows.join('\n'))
}
function printFullGame (game) {
  const n = nMoves(game)
  for (let i = 0; i < n; i++) {
    const board = unpackBoard(game, i)
    console.log(`Move #${i + 1}`)
    printBoard(board)
    console.log('')
  }
}

module.exports = {
  BPM,
  merge,
  unpackBoard,
  packMove,
  nMoves,
  printFullGame
}
