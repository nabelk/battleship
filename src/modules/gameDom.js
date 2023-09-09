import 'flowbite';
import Ship from './ship';
import Player from './player';

export default function Dom() {
    const user = new Player(true);
    const AI = new Player(false);
    const ships = [
        new Ship('Destroyer', 2),
        new Ship('Submarine', 3),
        new Ship('Cruiser', 3),
        new Ship('Battleship', 4),
        new Ship('Carrier', 5),
    ];

    const aiTargetCoor = [];
    for (let row = 0; row < 10; row++) {
        for (let column = 0; column < 10; column++) {
            aiTargetCoor.push([row, column]);
        }
    }

    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // Menu html
    const menuSection = '.menu';
    const button = select(`${menuSection} > form > button > span`);
    const axisDiv = select(`${menuSection} div:last-child`);

    //  Render board function
    function renderBoard(player, className) {
        document.querySelector(`${className}`).textContent = '';
        const boardArr = player.board;

        for (let row = 0; row < boardArr.length; row++) {
            const createRow = document.createElement('div');

            boardArr[row].forEach((cell, column) => {
                const createColumn = document.createElement('div');
                if (className === '.user')
                    createColumn.textContent = cell.name.charAt(0);
                if (cell.isHit === false) {
                    createColumn.className = 'bg-red-400';
                } else if (cell.isHit === true) {
                    createColumn.className = 'bg-green-400';
                } else if (cell.isHit === undefined) {
                    createColumn.className = 'bg-gray-300';
                }
                // createColumn.setAttribute(
                //     'data-ship-name',
                //     cell.name.toLowerCase()
                // );
                createColumn.setAttribute('data-coor', `${row}, ${column}`);
                createColumn.classList.add(
                    'flex',
                    'justify-center',
                    'items-center'
                );
                createRow.appendChild(createColumn);
            });

            document.querySelector(className).appendChild(createRow);
        }
    }

    // User manipulation to add ships

    function findShipObj(shipName) {
        return ships.find((ship) => ship.name === shipName);
    }

    const shipInfo = () => ({
        findShip: findShipObj(button.getAttribute('data-ship')),
        findAxis: axisDiv.getAttribute('data-axis'),
        coor(target) {
            return target
                .getAttribute('data-coor')
                .split(',')
                .map((coorNum) => Number(coorNum));
        },
    });

    function addShipToCells(e) {
        const info = shipInfo();
        user.placeShip(info.findShip, info.coor(e.target), info.findAxis);
        renderBoard(user, '.user');
        select(
            `a[data-ship="${button.getAttribute('data-ship')}"]`
        ).parentElement.remove();
        if (select('.menu ul').hasChildNodes()) {
            const lastAnchor = select(`.menu a:last-child`);
            if (lastAnchor) {
                lastAnchor.click();
                userBoardEventListener();
            }
        }
    }

    function isUserCellValid(e) {
        const info = shipInfo();
        if (
            user.checkCellHasShipAndShipPlacementInBound(
                info.findShip,
                info.findAxis,
                info.coor(e.target)
            )
        ) {
            e.target.classList.add('hover:bg-green-500');
            e.target.addEventListener('click', addShipToCells);
        } else {
            e.target.classList.add(
                'hover:bg-red-500',
                'hover:cursor-not-allowed'
            );
            e.target.removeEventListener('click', addShipToCells);
        }
    }

    function userBoardEventListener() {
        const cells = selectAll('.user > div > div');
        cells.forEach((cell) => {
            cell.addEventListener('mouseenter', isUserCellValid);
            cell.addEventListener('mouseleave', () => {
                cell.classList.remove(
                    'hover:bg-green-500',
                    'hover:bg-red-500',
                    'hover:cursor-not-allowed'
                );
            });
        });
    }

    // User manipulation to attack AI board

    function attackAIboard(e) {
        AI.receiveAttack(
            e.target
                .getAttribute('data-coor')
                .split(',')
                .map((coorNum) => Number(coorNum))
        );
        renderBoard(AI, '.ai');
        return aiAttackOnUser();
    }

    function userOnAIBoardEventListener() {
        const aiCells = selectAll('.ai > div > div');
        aiCells.forEach((cell) => {
            if (
                !cell.classList.contains('bg-red-400') &&
                !cell.classList.contains('bg-green-400')
            ) {
                cell.addEventListener('mouseenter', (e) => {
                    e.target.classList.add(
                        'cursor-pointer',
                        'hover:bg-blue-300'
                    );
                });
                cell.addEventListener('click', attackAIboard);
            }
        });
    }

    function menuEventHandler() {
        selectAll(`${menuSection} a`).forEach((item) => {
            item.classList.add('cursor-pointer');
            item.addEventListener('click', () => {
                const dataShip = item.getAttribute('data-ship');
                button.textContent = dataShip;
                button.setAttribute('data-ship', dataShip);
            });
        });

        axisDiv.addEventListener('click', () => {
            if (axisDiv.getAttribute('data-axis') === 'horizontal') {
                axisDiv.textContent = 'Vertical';
                axisDiv.setAttribute('data-axis', 'vertical');
            } else {
                axisDiv.textContent = 'Horizontal';
                axisDiv.setAttribute('data-axis', 'horizontal');
            }
        });
        userBoardEventListener();
    }

    function placeShipAI() {
        for (let i = 0; i < ships.length; i++) {
            AI.aiPlaceShip(ships[i]);
        }
        renderBoard(AI, '.ai');
    }

    function aiAttackOnUser() {
        const randomNum = Math.floor(Math.random() * aiTargetCoor.length);
        const [row, column] = aiTargetCoor[randomNum];

        if (user.board[row][column].isHit === undefined) {
            user.receiveAttack([row, column]);
            aiTargetCoor.splice(randomNum, 1);
        }

        renderBoard(user, '.user');
        userOnAIBoardEventListener();
        return true;
    }

    return {
        user,
        AI,
        menuEventHandler,
        userBoardEventListener,
        userOnAIBoardEventListener,
        placeShipAI,
        renderBoard,
    };
}
