import 'flowbite';
import Player from './player';

export default function Dom() {
    const user = new Player('');
    const AI = new Player('AI');

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

    // Update game div

    function updateGameProgress(content) {
        select('.update').textContent = content;
    }

    // Winner modal

    function displayWinnerModal(winner) {
        select(`button[data-modal-target="staticModal"]`).click();
        select('.winner-modal').textContent = `${winner.toUpperCase()} WON!`;
    }

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
            } else {
                select(menuSection).remove();
                select('.ai').classList.remove('hidden');
                select('.ai').style.display = 'grid';
                updateGameProgress(`${user.name}'s Turn!`);
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
        const attackCell = AI.board[row][column];
        if (AI.receiveAttack([row, column])) {
            updateGameProgress(`It's a hit on AI ship!`);
            if (attackCell.name !== '') {
                if (AI.isShipSunk(attackCell))
                    setTimeout(() => {
                        updateGameProgress(
                            `AI's ${attackCell.name} has been SUNK`
                        );
                    }, 500);
            }
        } else {
            updateGameProgress(`It's a MISS!`);
        }
        renderBoard(AI, '.ai');

        if (AI.checkAllShipSunk()) return displayWinnerModal(user.name);
        setTimeout(() => {
            updateGameProgress(`It's AI turn!`);
        }, 1500);

        setTimeout(() => aiAttackOnUser(), 2000);
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
            setTimeout(() => {
                if (user.receiveAttack([row, column])) {
                    updateGameProgress(`It's a hit on ${user.name} ship!`);
                    if (attackCell.name !== '') {
                        if (user.isShipSunk(attackCell)) {
                            setTimeout(() => {
                                updateGameProgress(
                                    `${user.name}'s ${attackCell.name} has been SUNK`
                                );
                            }, 800);
                        }
                    }
                } else {
                    updateGameProgress(`It's a MISS!`);
                }
                renderBoard(user, '.user');
                aiTargetCoor.splice(randomNum, 1);
                if (user.checkAllShipSunk()) return displayWinnerModal(AI.name);
            }, 200);
        }

        setTimeout(() => {
            userOnAIBoardEventListener();
            updateGameProgress(`${user.name}'s Turn!`);
        }, 1800);

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
