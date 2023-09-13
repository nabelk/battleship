import 'flowbite';
import Player from './player';

export default function Dom() {
    const user = new Player(true);
    const AI = new Player(false);

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
        return user.listOfShips.find((ship) => ship.name === shipName);
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
        const [row, column] = e.target
            .getAttribute('data-coor')
            .split(',')
            .map((coorNum) => Number(coorNum));
        AI.receiveAttack([row, column]);
        const attackCell = AI.board[row][column];
        if (attackCell.name !== '') {
            if (AI.isShipSunk(attackCell))
                console.log(`AI's ${attackCell.name} has been SUNK`);
        }
        if (AI.checkAllShipSunk()) console.log('USER WON');
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
    }

    function placeShipAI() {
        for (let i = 0; i < AI.listOfShips.length; i++) {
            AI.aiPlaceShip(AI.listOfShips[i]);
        }
        renderBoard(AI, '.ai');
    }

    function aiAttackOnUser() {
        const randomNum = Math.floor(Math.random() * aiTargetCoor.length);
        const [row, column] = aiTargetCoor[randomNum];
        const attackCell = user.board[row][column];

        if (attackCell.isHit === undefined) {
            user.receiveAttack([row, column]);
            aiTargetCoor.splice(randomNum, 1);
        }

        if (attackCell.name !== '') {
            if (user.isShipSunk(attackCell))
                console.log(`User's ${attackCell.name} has been SUNK`);
        }

        if (user.checkAllShipSunk()) console.log('AI WON');

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
