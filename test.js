const test = require('tape')
const {
  unpackBoard,
  packMove,
  printFullGame
} = require('.')

test('manual play', t => {
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

  // console.log('Packed game', game, '=', game.toString(2))
  const board = unpackBoard(game)
  t.equal(board.join(','), 'o,x,o,o,x,x,,o,x')
  printFullGame(game)
  t.end()
})

test('packMove', t => {
  const m1 = packMove(null, 2)
  t.equal(m1, 6)
  const m2 = packMove(m1, 0)
  t.equal(m2, (m1 << 3 | 0))
  const m3 = packMove(m2, 6)
  t.equal(m3, (m2 << 3 | 6))
  const m4 = packMove(m3, 4)
  t.equal(m4, (m3 << 3 | 4))
  t.end()
})
