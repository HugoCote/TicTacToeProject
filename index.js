const grid = document.querySelector(".grid")
const tiles = grid.querySelectorAll(".board-tile")
const messageBoard = document.querySelector(".game-result")
const refreshButton = document.querySelector(".button-refresh")

class Player {
    mark
    constructor(mark) {
        this.mark = mark
    }
    toString() {
        return `Player(${this.mark})`;
    }

}

let board = (() => {
    let players = {
        0: new Player("x"),
        1: new Player("o"),
    }

    function* iterTiles() {
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                yield [i, j]
    }

    function* iterFor(rowOrCol, i) {
        for (let j = 0; j < 3; j++) yield rowOrCol === 'row' ? [i, j] : [j, i]
    }

    function* iterForDiag(mainOrNot) {
        for (let j = 0; j < 3; j++) yield mainOrNot ? [j, j] : [j, 2 - j]
    }

    let tiles = {}
    let turn = 0;
    let winner = null;
    let clear = () => {
        tiles = {}
        for (const [i, j] of iterTiles()) tiles[[i, j]] = null
        turn = 0;
        winner = null;
    }
    let isDone = () => winner !== null || turn >= 9;
    let nextTurn = () => turn++;
    let getCurrentPlayer = () => players[whoseTurn()];
    let getWinner = () => players[winner];
    let whoseTurn = () => turn % 2;
    let isFreeTile = (i, j) => tiles[[i, j]] === null;
    let checkBoardState = () => {
        let row0 = new Set(Array.from(iterFor('row', 0)).map(([i, j]) => tiles[[i, j]]))
        let row1 = new Set(Array.from(iterFor('row', 1)).map(([i, j]) => tiles[[i, j]]))
        let row2 = new Set(Array.from(iterFor('row', 2)).map(([i, j]) => tiles[[i, j]]))
        let col0 = new Set(Array.from(iterFor('col', 0)).map(([i, j]) => tiles[[i, j]]))
        let col1 = new Set(Array.from(iterFor('col', 1)).map(([i, j]) => tiles[[i, j]]))
        let col2 = new Set(Array.from(iterFor('col', 2)).map(([i, j]) => tiles[[i, j]]))
        let dia0 = new Set(Array.from(iterForDiag(0)).map(([i, j]) => tiles[[i, j]]))
        let dia1 = new Set(Array.from(iterForDiag(1)).map(([i, j]) => tiles[[i, j]]))
        let allStraigts = [row0, row1, row2, col0, col1, col2, dia0, dia1];
        if (allStraigts.map((set) => set.size === 1 && set.has(0)).some(x => x)) return 0;
        if (allStraigts.map((set) => set.size === 1 && set.has(1)).some(x => x)) return 1;
        return null;
    }
    let tryPlayThis = (x, y) => {
        if (isDone()) return false;
        if (!isFreeTile(x, y)) return false;
        console.log(`Player ${whoseTurn()} : ${players[whoseTurn()]} played ${[x,y]}`)
        tiles[[x, y]] = whoseTurn()
        let boardState = checkBoardState();
        console.log("The board state is -> " + boardState)
        if (boardState != null) winner = whoseTurn();
        else nextTurn()
        return true;
    }
    clear()
    return { tryPlayThis, isDone, getWinner, getCurrentPlayer, clear }
})();

function refreshGame() {
    console.log("Clear the board.")
    board.clear()
    messageBoard.textContent = ""
    tiles.forEach(tile => { tile.textContent = "" })
}

tiles.forEach(tile => {
    tile.onclick = () => {
        let player = board.getCurrentPlayer()
        let x = +tile.attributes.x.nodeValue;
        let y = +tile.attributes.y.nodeValue;
        console.log(`Clicked (${x}-${y})`)
        if (!board.tryPlayThis(x, y)) return; // the move is rejected
        tile.textContent = player.mark
        if (!board.isDone()) return;
        let winner = board.getWinner()
        console.log("winner is " + winner)
        if (winner)
            messageBoard.textContent = `"${winner.mark.toUpperCase()}" wins!`
        else
            messageBoard.textContent = `Stalemate!`

    }
})

refreshButton.onclick = () => refreshGame()
refreshButton.click()