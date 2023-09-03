import Dom from './modules/gameDom';

const dom = Dom();

dom.renderBoard(dom.user, '.user');
dom.renderBoard(dom.AI, '.ai');
dom.placeShipAI();
dom.menuEventHandler();
dom.userBoardEventListener();
