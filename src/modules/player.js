import Gameboard from './gameboard';

export default class Player {
    constructor(turnValue) {
        this.turn = turnValue;
        this.board = Gameboard();
        this.placeShip = this.board.placeShip.bind(this.board); // place ship for user
        this.receiveAttack = this.board.receiveAttack.bind(this.board);
    }

    getRandomCoor() {
        const [x, y] = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
        ];
        return [x, y];
    }

    // place ship for Ai
    ai(shipObj, orientation) {
        const getCoor = this.getRandomCoor();
        if (
            !this.board.isShipPlacementOutOfBound(
                getCoor[0],
                shipObj.shipLength
            )
        )
            return this.ai(shipObj, orientation);
        return this.placeShip(shipObj, getCoor, orientation);
    }
}
