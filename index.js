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

// Demo game session:

let game = 1 // Start bit.
game = (game << 2) | 2 // Place X in middle
game = (game << 3) | 0 // Place O in corner
game = (game << 3) | 6 // Place X opposite corner
game = (game << 3) | 1 // Place O top right corner
game = (game << 3) | 0 // X blocks on edge
game = (game << 2) | 3 // O blocks vertical middle
game = (game << 2) | 1 // Place X on right edge
game = (game << 1) | 0 // O blocks

// Game Over: draw!

console.log('Packed game', game, '=', game.toString(2))

// Unpack board
const board = unpackBoard(game)

// Print board
for (let i = 0; i < 3; i++) {
  console.log(
    '|', board[i * 3] || ' ',
    '|', board[i * 3 + 1] || ' ',
    '|', board[i * 3 + 2] || ' ', '|')
}

/*
 * Takes two versions of the same game
 * and returns the one with the most moves.
 * Throws error when trying to merge two
 * unrelated game-sessions.
 */
function merge (a, b) {
  let backup = backup
  // swap if necessary so that A <= B
  if (a > b) {
    b = a
    a = backup
    backup = b
  }
  // Align B to A
  while (a < b) b >>= 1
  if (a !== b) throw new Error('UnrelatedGameSessions')
  return backup
}

// Unpacks a Number into a 3 by 3 board with crosses
// and noughts.
function unpackBoard (x) {
  // Due to symmetry first move only has 2bits
  //           0  1  2  3  4  5  6  7  8
  const bpm = [2, 3, 3, 3, 3, 2, 2, 1] // bits-per-move
  const board = []
  let markerFound = false
  let o = 0 // output bit offset
  let move = 0 // move number
  let n = 0 // move value buffer
  for (let j = 20; j >= 0; j--) {
    const bit = (x >> j) & 1
    // Skip bits until we find the tail-bit marker
    if (!markerFound && bit) { markerFound = true; continue }
    if (!markerFound) continue

    n |= bit << (bpm[move] - ++o)
    if (bpm[move] > o) continue // buffering
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
    move++
  }
  return board
}
