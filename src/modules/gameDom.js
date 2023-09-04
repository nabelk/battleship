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
                createColumn.textContent = cell.name.charAt(0);
                if (cell.isHit === false) {
                    createColumn.className = 'bg-red-400';
                } else if (cell.isHit === true) {
                    createColumn.className = 'bg-green-400';
                }
                createColumn.setAttribute(
                    'data-ship-name',
                    cell.name.toLowerCase()
                );
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

    // User manipulation

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
        select(
            `a[data-ship="${button.getAttribute('data-ship')}"]`
        ).parentElement.remove();
        if (select('.menu ul').hasChildNodes()) {
            select(`.menu a:last-child`).click();
        }
        renderBoard(user, '.user');
        userBoardEventListener();
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
        const cells = document.querySelectorAll('.user > div > div');
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

    return {
        user,
        AI,
        menuEventHandler,
        userBoardEventListener,
        placeShipAI,
        renderBoard,
    };
}
