[`pure | 📦`](https://github.com/telamon/create-pure)
[`code style | standard`](https://standardjs.com/)
# tic-tac-nano

> 20bit CRDT Tic-Tac-Toe

This is a [Conflict-free Replicated Data Type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) that is capable of storing
the _full history_ of a Tic-tac-toe game session occupying only 20bits of binary space.

Example: Number `799002` contains 8 moves and ends in a draw that looks like this
when unpacked:
```
|o|x|o|
|o|x|x|
| |o|x|
```

I want to use it as an functional dummy for P2P simulations,
if you find any other use-cases please share!
(Essentially it is a tiny finite append-only feed that in a test environment should adhere to similar constraints as the [real deal](https://github.com/mafintosh/hypercore))

## Use

```bash
$ npm install tic-tac-nano
```

```js
const {
  /**
    * Unpacks the feed bits into an array
    *
    * unpackBoard(feed) // => ['x','o',undefined, ...]
    */
  unpackBoard,
  /**
    * Packs a new move by index into argument feed.
    * packMove(feed, index) // => new version
    */
  packMove,
  /**
    * Return longest feed of the two or throws an error
    * if there is no overlap between the two histories.
    *
    * merge(a, b) // => a <=> b || UnrelatedGameError
    */
  merge,
  /**
    * Just as it sounds
    *
    * printFullGame(Number)
    */
  printFullGame,
  nMoves,
  printBoard
} = require('tic-tac-nano')

// Alice puts an `x` in the center and sends the feed to bob
let alice = packMove(0, 2) // => 2

// Bob places an `o` in top-left corner and sends the feed
// back to alice
let bob = packMove(alice, 0) // => 48

// They continue to send the feed back and forth
// until the game ends in a draw.
alice = packMove(bob, 6) // => 390
bob = packMove(alice, 1) // => 3121
alice = packMove(bob, 0) // => ...
bob = packMove(alice, 3) // => ...
alice = packMove(bob, 1) // => ...
bob = packMove(alice, 0) // => 79902
```

**Now we can print the entire history**

```
> printFullGame(79902)

Move #1
| | | |
| |x| |
| | | |

Move #2
|o| | |
| |x| |
| | | |

Move #3
|o| | |
| |x| |
| | |x|

Move #4
|o| |o|
| |x| |
| | |x|

Move #5
|o|x|o|
| |x| |
| | |x|

Move #6
|o|x|o|
| |x| |
| |o|x|

Move #7
|o|x|o|
| |x|x|
| |o|x|

Move #8
|o|x|o|
|o|x|x|
| |o|x|
```

## Move Indices

First move only has 3 choices:

```
| 0 | 1 |   |    0: Corner
|---+---+---|    1: Edge
|   | 2 |   |    2: Center
|---+---+---|
|   |   |   |
```

Subsequent moves use index numbers from left-to-right, up-to-down,
skipping over any occupied slots.

Ex1.

```
| 0 | x | 1 |
|---+---+---|
| 2 | 3 | 4 |
|---+---+---|
| o | 5 | 6 |
```

Ex2.

```
| 0 | x | 1 |
|---+---+---|
| 2 | x | 3 |
|---+---+---|
| o | 4 | 5 |
```

## Donations

```ad
 _____                      _   _           _
|  __ \   Help Wanted!     | | | |         | |
| |  | | ___  ___ ___ _ __ | |_| |     __ _| |__  ___   ___  ___
| |  | |/ _ \/ __/ _ \ '_ \| __| |    / _` | '_ \/ __| / __|/ _ \
| |__| |  __/ (_|  __/ | | | |_| |___| (_| | |_) \__ \_\__ \  __/
|_____/ \___|\___\___|_| |_|\__|______\__,_|_.__/|___(_)___/\___|

If you're reading this it means that the docs are missing or in a bad state.

Writing and maintaining friendly and useful documentation takes
effort and time. In order to do faster releases
I will from now on provide documentation relational to project activity.

  __How_to_Help____________________________________.
 |                                                 |
 |  - Open an issue if you have ANY questions! :)  |
 |  - Star this repo if you found it interesting   |
 |  - Fork off & help document <3                  |
 |.________________________/________________________|

I publish all of my work as Libre software and will continue to do so,
drop me a penny at Patreon to help fund experiments like these.

Patreon: https://www.patreon.com/decentlabs
Discord: https://discord.gg/K5XjmZx
Telegram: https://t.me/decentlabs_se
```


## Changelog

### 1.0.0
- added methods packMove, nMoves, printFullGame
- added tests
- populated README.md
### 0.1.0
- first release

## Contributing

By making a pull request, you agree to release your modifications under
the license stated in the next section.

Only changesets by human contributors will be accepted.

## License

[AGPL-3.0-or-later](./LICENSE)

2020 &#x1f12f; Tony Ivanov
