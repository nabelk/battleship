import Gameboard from './gameboard';
import Ship from './ship';

export default class Player {
    constructor(name) {
        this.name = name;
        this.playerBoard = new Gameboard();
        this.board = this.playerBoard.board;
        this.isShipSunk = this.playerBoard.isShipSunk.bind(this.playerBoard);
        this.placeShip = this.playerBoard.placeShip.bind(this.playerBoard); // place ship for user
        this.receiveAttack = this.playerBoard.receiveAttack.bind(
            this.playerBoard
        );
        this.checkCellHasShipAndShipPlacementInBound =
            this.playerBoard.checkCellHasShipAndShipPlacementInBound.bind(
                this.playerBoard
            );
        this.listOfShips = [
            new Ship('Destroyer', 2),
            new Ship('Submarine', 3),
            new Ship('Cruiser', 3),
            new Ship('Battleship', 4),
            new Ship('Carrier', 5),
        ];
    }

    checkAllShipSunk() {
        return this.playerBoard.checkAllShipSunk();
    }

    aiPlaceShip(shipObj) {
        const coor = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
        ];
        const orientation =
            Math.floor(Math.random() * 2) === 0 ? 'horizontal' : 'vertical';

        // Check whether ship placement is valid or not
        if (
            !this.playerBoard.checkCellHasShipAndShipPlacementInBound(
                shipObj,
                orientation,
                coor
            )
        )
            return this.aiPlaceShip(shipObj); // Recursive call

        return this.placeShip(shipObj, coor, orientation);
    }
}
