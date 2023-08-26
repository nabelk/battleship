export default class Ship {
    constructor(name, shipLength, checkSunk = false, numOfHit = 0) {
        this.name = name;
        this.shipLength = shipLength;
        this.checkSunk = checkSunk;
        this.numOfHit = numOfHit;
    }

    hit() {
        this.numOfHit += 1;
        return this.numOfHit;
    }

    isSunk() {
        if (this.numOfHit === this.shipLength) this.checkSunk = true;
        return this.checkSunk;
    }
}
