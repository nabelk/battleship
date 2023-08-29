import Player from '../modules/player';
import Ship from '../modules/ship';

const user = new Player(true);
const AI = new Player(false);
const destroyer = new Ship('destroyer', 2);
user.placeShip(destroyer, [2, 2], 'horizontal');
AI.ai(destroyer, 'vertical');

test('Check attack that user receives', () => {
    expect(user.receiveAttack([2, 2], 'destroyer')).toEqual(true);
    expect(user.receiveAttack([5, 6], 'destroyer')).toEqual(false);
});

test('Check if all ship have sunk from player module', () => {
    expect(user.checkAllShipSunk()).toEqual(false);
});
