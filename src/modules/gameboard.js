export default class Gameboard {
    constructor() {
        this.board = Array.from({ length: 10 }, () => new Array(10).fill(''));
        this.ships = [];
    }

    isShipPlacementOutOfBound(startIndex, shipLength) {
        const endIndex = startIndex + shipLength - 1;
        return endIndex < this.board.length;
    }

    placeShip(shipObj, coorArr, orientation) {
        this.ships.push(shipObj);
        const [row, column] = coorArr;
        switch (orientation) {
            case 'horizontal':
                for (let i = column; i < column + shipObj.shipLength; i++) {
                    this.board[row][i] = shipObj.name.charAt(0);
                }
                break;
            default:
                for (let i = row; i < row + shipObj.shipLength; i++) {
                    this.board[i][column] = shipObj.name.charAt(0);
                }
        }
    }

    // Enemy attack
    receiveAttack(enemycoorArr, opponentShip) {
        const [row, column] = enemycoorArr;
        const { board } = this;
        if (board[row][column] !== '') {
            board[row][column] += ' + Hit';
            opponentShip.hit();
            return true;
        }
        board[row][column] += 'MISS';
        return false;
    }

    checkAllShipSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
}
