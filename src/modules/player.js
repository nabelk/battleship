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

    getRandomCoor() {
        const [x, y] = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
        ];
        return [x, y];
    }

    // place ship for Ai
    aiPlaceShip(shipObj, orientation) {
        const getCoor = this.getRandomCoor();
        const axis = orientation === 'vertical' ? getCoor[0] : getCoor[1];
        if (
            !this.playerBoard.isShipPlacementOutOfBound(
                axis,
                shipObj.shipLength
            )
        )
            return this.aiPlaceShip(shipObj, orientation);
        return this.placeShip(shipObj, getCoor, orientation);
    }
}
