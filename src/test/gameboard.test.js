import Ship from '../modules/ship';
import Gameboard from '../modules/gameboard';

const userBoard = new Gameboard();
const ships = [new Ship('destroyer', 2), new Ship('submarine', 3)];
userBoard.placeShip(ships[0], [2, 2], 'horizontal');
userBoard.placeShip(ships[1], [3, 3], 'vertical');

test('Check coordinates out of bounds', () => {
    expect(userBoard.isShipPlacementInBound(7, 3)).toEqual(true);
    expect(userBoard.isShipPlacementInBound(10, 2)).toEqual(false);
});

test('Check attack if it is in the ship cell or not', () => {
    expect(userBoard.receiveAttack([2, 2])).toEqual(true);
    expect(userBoard.receiveAttack([0, 1])).toEqual(false);
});

test('Check if all the ships have sunk', () => {
    expect(userBoard.checkAllShipSunk()).toEqual(false);

    // Change hit of ships to ship length for the test
    ships[0].numOfHit = ships[0].shipLength;
    ships[1].numOfHit = ships[1].shipLength;
    expect(userBoard.checkAllShipSunk()).toEqual(true);
});
