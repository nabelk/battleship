import Gameboard from './gameboard';

export default class Player {
    constructor(turnValue) {
        this.turn = turnValue;
        this.playerBoard = new Gameboard();
        this.board = this.playerBoard.board;
        this.placeShip = this.playerBoard.placeShip.bind(this.playerBoard); // place ship for user
        this.receiveAttack = this.playerBoard.receiveAttack.bind(
            this.playerBoard
        );
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
                shipObj.shipLength,
                orientation,
                coor
            )
        )
            return this.aiPlaceShip(shipObj); // Recursive call

        return this.placeShip(shipObj, coor, orientation);
    }
}
