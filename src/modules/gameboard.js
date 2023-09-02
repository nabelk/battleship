export default class Gameboard {
    constructor() {
        this.board = Array.from({ length: 10 }, () =>
            new Array(10).fill({ text: '', hasShip: false, isHit: false })
        );
        this.ships = [];
    }

    isShipPlacementInBound(startIndex, shipLength) {
        const endIndex = startIndex + shipLength - 1;
        return endIndex < this.board.length;
    }

    isCellHasShip(orientation, shipLength, coor) {
        const [row, column] = coor;
        switch (orientation) {
            case 'horizontal':
                for (let i = column; i < column + shipLength; i++) {
                    if (this.board[row][i].hasShip) {
                        return true;
                    }
                }
                break;
            default:
                for (let i = row; i < row + shipLength; i++) {
                    if (this.board[i][column].hasShip) {
                        return true;
                    }
                }
                break;
        }
        return false;
    }

    checkCellHasShipAndShipPlacementInBound(shipObj, orientation, coor) {
        const [row, column] = coor;
        const { shipLength } = shipObj;

        if (orientation === 'horizontal') {
            if (!this.isShipPlacementInBound(column, shipLength)) {
                return false;
            }
            if (this.isCellHasShip(orientation, shipLength, coor)) {
                return false;
            }
        } else {
            if (!this.isShipPlacementInBound(row, shipLength)) {
                return false;
            }

            if (this.isCellHasShip(orientation, shipLength, coor)) {
                return false;
            }
        }

        return true;
    }

    placeShip(shipObj, coorArr, orientation) {
        this.ships.push(shipObj);
        const [row, column] = coorArr;
        const info = {
            text: shipObj.name,
            hasShip: true,
            isHit: false,
        };
        switch (orientation) {
            case 'horizontal':
                for (let i = column; i < column + shipObj.shipLength; i++) {
                    this.board[row][i] = info;
                }
                break;
            default:
                for (let i = row; i < row + shipObj.shipLength; i++) {
                    this.board[i][column] = info;
                }
        }
    }

    // Enemy attack
    receiveAttack(enemycoorArr, opponentShipName) {
        const findShipObj = this.ships.find(
            (ship) => ship.name === opponentShipName
        );
        const [row, column] = enemycoorArr;
        const { board } = this;
        if (board[row][column].text !== '') {
            board[row][column] += ' + Hit';
            findShipObj.hit();
            return true;
        }
        board[row][column] += 'MISS';
        return false;
    }

    checkAllShipSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
}
