import { GAME_STATE, resetGame, setScreenshotMode, clearScreenshotMode } from './state.js';
import { drawFromDeck, shuffle } from './deck.js';
import { initInput } from './input.js';
import { render } from './render.js';

function drawRoundCard() {
  if (GAME_STATE.deck.length === 0 && GAME_STATE.discard.length > 0) {
    GAME_STATE.deck = shuffle(GAME_STATE.discard, 41 + GAME_STATE.round);
    GAME_STATE.discard = [];
  }
  return drawFromDeck(GAME_STATE.deck).card;
}

function drawForBothPlayers() {
  const playerCard = drawRoundCard();
  const aiCard = drawRoundCard();
  if (playerCard) GAME_STATE.playerHand.push(playerCard);
  if (aiCard) GAME_STATE.aiHand.push(aiCard);
}

function resolveTrick() {
  const playerCard = GAME_STATE.trick.playerCard;
  const aiCard = GAME_STATE.trick.aiCard;
  if (!playerCard || !aiCard) return;

  let winner = 'tie';
  if (playerCard.value > aiCard.value) winner = 'player';
  else if (aiCard.value > playerCard.value) winner = 'ai';

  if (winner !== 'tie') {
    const winningCard = winner === 'player' ? playerCard : aiCard;
    const losingCard = winner === 'player' ? aiCard : playerCard;
    let damage = winningCard.value - losingCard.value;
    if (winningCard.suit === losingCard.suit) damage *= 2;
    if (winningCard.value === 6) damage += 2;
    if (winner === 'player') GAME_STATE.aiLife = Math.max(0, GAME_STATE.aiLife - damage);
    else GAME_STATE.playerLife = Math.max(0, GAME_STATE.playerLife - damage);
  }

  GAME_STATE.discard.push(playerCard, aiCard);
  GAME_STATE.trick = { playerCard: null, aiCard: null };
  GAME_STATE.round += 1;
  drawForBothPlayers();

  if (GAME_STATE.playerLife <= 0) GAME_STATE.screen = 'loss';
  else if (GAME_STATE.aiLife <= 0) GAME_STATE.screen = 'win';
  GAME_STATE.phase = 'waiting';
}

function frame() {
  if (!GAME_STATE.screenshotMode && GAME_STATE.phase === 'resolve_trick') resolveTrick();
  render();
  if (!GAME_STATE.screenshotMode) requestAnimationFrame(frame);
}

function start() {
  initInput(document.getElementById('game'));
  resetGame();
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (shot) setScreenshotMode(shot);
  else clearScreenshotMode();
  render();
  if (!GAME_STATE.screenshotMode) requestAnimationFrame(frame);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
