import Ship from '../modules/ship';

const destroyer = new Ship('Destroyer', 2);

test('Update number of hit', () => {
    for (let i = 0; i < destroyer.shipLength; i++) {
        destroyer.hit();
    }
    expect(destroyer.numOfHit).toEqual(2);
});

test('Check if the ship has sunk', () => {
    expect(destroyer.isSunk()).toEqual(true);
});

test('Check if the ship is hasn not sunk', () => {
    const destroyer2 = new Ship('Destroyer', 2);
    expect(destroyer2.isSunk()).toEqual(false);
});
