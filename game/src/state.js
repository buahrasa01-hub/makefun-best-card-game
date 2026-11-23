import { createDeck, dealInitialHands, shuffle } from './deck.js';

export const GAME_STATE = {
  screen: 'title',
  phase: 'waiting',
  playerHand: [],
  aiHand: [],
  deck: [],
  discard: [],
  selectedCardIndex: null,
  trick: { playerCard: null, aiCard: null },
  playerLife: 20,
  aiLife: 20,
  round: 0,
  screenshotMode: false,
  screenshotTarget: null,
};

export const CONSTANTS = { START_LIFE: 20, HAND_SIZE: 5 };

export function resetGame() {
  GAME_STATE.screen = 'title';
  GAME_STATE.phase = 'waiting';
  GAME_STATE.playerLife = CONSTANTS.START_LIFE;
  GAME_STATE.aiLife = CONSTANTS.START_LIFE;
  GAME_STATE.round = 0;
  GAME_STATE.selectedCardIndex = null;
  GAME_STATE.trick = { playerCard: null, aiCard: null };
  GAME_STATE.discard = [];
  const { playerHand, aiHand, remainingDeck } = dealInitialHands(shuffle(createDeck(), 42));
  GAME_STATE.playerHand = playerHand;
  GAME_STATE.aiHand = aiHand;
  GAME_STATE.deck = remainingDeck;
}

export function setScreenshotMode(target) {
  GAME_STATE.screenshotMode = true;
  GAME_STATE.screenshotTarget = target;
  GAME_STATE.phase = 'waiting';
  GAME_STATE.selectedCardIndex = null;

  if (target === 'title') {
    resetGame();
    GAME_STATE.screen = 'title';
    GAME_STATE.screenshotMode = true;
    GAME_STATE.screenshotTarget = target;
    return;
  }

  // Fixed seed and visible hands make the screenshot scenes repeatable.
  const { playerHand, aiHand, remainingDeck } = dealInitialHands(shuffle(createDeck(), 42));
  GAME_STATE.playerHand = playerHand;
  GAME_STATE.aiHand = aiHand;
  GAME_STATE.deck = remainingDeck;
  GAME_STATE.discard = [];
  GAME_STATE.round = 3;
  GAME_STATE.trick = { playerCard: null, aiCard: null };

  if (target === 'play') {
    GAME_STATE.screen = 'play';
    GAME_STATE.playerLife = 16;
    GAME_STATE.aiLife = 12;
  } else if (target === 'win') {
    GAME_STATE.screen = 'win';
    GAME_STATE.playerLife = 14;
    GAME_STATE.aiLife = 0;
  } else if (target === 'loss') {
    GAME_STATE.screen = 'loss';
    GAME_STATE.playerLife = 0;
    GAME_STATE.aiLife = 11;
  } else {
    GAME_STATE.screen = 'title';
    GAME_STATE.playerLife = CONSTANTS.START_LIFE;
    GAME_STATE.aiLife = CONSTANTS.START_LIFE;
  }
}

export function clearScreenshotMode() {
  GAME_STATE.screenshotMode = false;
  GAME_STATE.screenshotTarget = null;
}
