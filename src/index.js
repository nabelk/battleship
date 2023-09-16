import Dom from './modules/gameDom';

const dom = Dom();

dom.renderBoard(dom.user, '.user');
dom.renderBoard(dom.AI, '.ai');
dom.placeShipAI();
dom.menuEventHandler();
dom.userBoardEventListener();
dom.renderBoard(dom.AI, '.ai');
dom.userOnAIBoardEventListener();

const playerform = document.querySelector('#playerForm');
playerform.addEventListener('submit', (e) => {
    e.preventDefault();
    dom.user.name =
        e.target.name.value.charAt(0).toUpperCase() +
        e.target.name.value.slice(1).toLowerCase();
    playerform.closest('#player-name-modal').remove();
    document.querySelector('.modal-backdrop').remove();
});
