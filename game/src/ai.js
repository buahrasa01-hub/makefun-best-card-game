import { GAME_STATE } from './state.js';
import { SUITS, createDeck, dealInitialHands, shuffle } from './deck.js';

/** Spend the lowest card that can take the trick; otherwise conserve the strongest card. */
export function aiChooseCard() {
  if (GAME_STATE.phase !== 'ai_turn' || !GAME_STATE.trick.playerCard) return null;

  const playerCard = GAME_STATE.trick.playerCard;
  const candidates = GAME_STATE.aiHand.slice().sort((a, b) =>
    a.value - b.value || SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit));
  const chosen = candidates.find(card => card.value > playerCard.value) ?? candidates[0];
  if (!chosen) return null;

  const index = GAME_STATE.aiHand.findIndex(card => card.id === chosen.id);
  if (index < 0) return null;
  GAME_STATE.aiHand.splice(index, 1);
  return chosen;
}

export function aiPlayCard() {
  if (GAME_STATE.phase !== 'ai_turn') return;
  const card = aiChooseCard();
  if (!card) return;
  GAME_STATE.trick.aiCard = card;
  GAME_STATE.phase = 'resolve_trick';
}

export function aiResetHand() {
  const { aiHand, remainingDeck } = dealInitialHands(shuffle(createDeck(), 43));
  GAME_STATE.aiHand = aiHand;
  GAME_STATE.deck = remainingDeck;
  return aiHand;
}
