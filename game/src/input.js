import { GAME_STATE, resetGame, clearScreenshotMode } from './state.js';
import { aiPlayCard } from './ai.js';

const WIDTH = 1280;
const HEIGHT = 720;
const CARD_WIDTH = 124;
const CARD_HEIGHT = 164;
const CARD_GAP = 14;

function beginGame() {
  clearScreenshotMode();
  resetGame();
  GAME_STATE.screen = 'play';
  GAME_STATE.phase = 'waiting';
}

function playSelectedCard() {
  if (GAME_STATE.screen !== 'play' || GAME_STATE.phase !== 'waiting') return;
  const index = GAME_STATE.selectedCardIndex;
  const card = index === null ? null : GAME_STATE.playerHand[index];
  if (!card) return;

  GAME_STATE.trick.playerCard = card;
  GAME_STATE.playerHand.splice(index, 1);
  GAME_STATE.selectedCardIndex = null;
  GAME_STATE.phase = 'ai_turn';
  window.setTimeout(() => {
    if (GAME_STATE.phase === 'ai_turn') aiPlayCard();
  }, 420);
}

function finishScreen() {
  if (GAME_STATE.screen === 'title') beginGame();
  else if (GAME_STATE.screen === 'win' || GAME_STATE.screen === 'loss') beginGame();
}

export function initInput(canvas) {
  document.addEventListener('keydown', event => {
    if (GAME_STATE.screenshotMode) return;
    if (event.key === 'r' || event.key === 'R') {
      beginGame();
      event.preventDefault();
      return;
    }
    if (GAME_STATE.screen !== 'play') {
      if (event.key === 'Enter' || event.key === ' ') {
        finishScreen();
        event.preventDefault();
      }
      return;
    }
    if (event.key >= '1' && event.key <= '5' && GAME_STATE.phase === 'waiting') {
      const index = Number(event.key) - 1;
      if (index < GAME_STATE.playerHand.length) GAME_STATE.selectedCardIndex = index;
      event.preventDefault();
    } else if ((event.key === 'Enter' || event.key === ' ') && GAME_STATE.selectedCardIndex !== null) {
      playSelectedCard();
      event.preventDefault();
    }
  });

  canvas.addEventListener('click', event => {
    if (GAME_STATE.screenshotMode) return;
    if (GAME_STATE.screen !== 'play') {
      finishScreen();
      return;
    }
    if (GAME_STATE.phase !== 'waiting') return;

    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / WIDTH, rect.height / HEIGHT);
    const offsetX = (rect.width - WIDTH * scale) / 2;
    const offsetY = (rect.height - HEIGHT * scale) / 2;
    const x = (event.clientX - rect.left - offsetX) / scale;
    const y = (event.clientY - rect.top - offsetY) / scale;
    const count = GAME_STATE.playerHand.length;
    const handWidth = count * CARD_WIDTH + Math.max(0, count - 1) * CARD_GAP;
    const startX = (WIDTH - handWidth) / 2;
    if (y < 493 || y > 493 + CARD_HEIGHT) return;

    for (let index = 0; index < count; index += 1) {
      const cardX = startX + index * (CARD_WIDTH + CARD_GAP);
      if (x >= cardX && x <= cardX + CARD_WIDTH) {
        if (GAME_STATE.selectedCardIndex === index) playSelectedCard();
        else GAME_STATE.selectedCardIndex = index;
        return;
      }
    }
    GAME_STATE.selectedCardIndex = null;
  });
}
