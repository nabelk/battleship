export default class Gameboard {
    constructor() {
        this.board = Array.from({ length: 8 }, () => new Array(8).fill(''));
        this.ships = [];
    }

    placeShip(shipObj, coorArr, orientation) {
        const [row, column] = coorArr;
        this.ships.push(shipObj);
        for (let i = column; i <= column + shipObj.shipLength; i++) {
            this.board[row][i] = shipObj.name.chartAt(0);
        }
    }

    // Enemy attack
    receiveAttack(enemycoorArr, opponentObj) {
        const [row, column] = enemycoorArr;
        const { board } = this;
        if (board[row][column] !== '') {
            board[row][column] += ' + Hit';
            opponentObj.hit();
            return true;
        }
        board[row][column] += 'MISS';
        return false;
    }

    checkAllShipSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
}
