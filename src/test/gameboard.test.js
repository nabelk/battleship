import Ship from '../modules/ship';
import Gameboard from '../modules/gameboard';

const userBoard = new Gameboard();
const [destroyer, submarine] = [
    new Ship('destroyer', 2),
    new Ship('submarine', 3),
];
userBoard.placeShip(destroyer, [2, 2], 'horizontal');
userBoard.placeShip(submarine, [3, 3], 'vertical');

test('Check coordiantes out of bounds', () => {
    expect(userBoard.isShipPlacementOutOfBound(7, 3)).toEqual(true);
    expect(userBoard.isShipPlacementOutOfBound(10, 2)).toEqual(false);
});

test('Check attack if it is in the ship cell or not', () => {
    expect(userBoard.receiveAttack([2, 2], destroyer)).toEqual(true);
    expect(userBoard.receiveAttack([0, 1], submarine)).toEqual(false);
});

test('Check if all the ships have sunk', () => {
    expect(userBoard.checkAllShipSunk()).toEqual(false);

    // Change hit of ships to ship length for the test
    destroyer.numOfHit = destroyer.shipLength;
    submarine.numOfHit = submarine.shipLength;
    expect(userBoard.checkAllShipSunk()).toEqual(true);
});
