// deck.js: Builds and shuffles the game deck
// The deck consists of 24 cards: 4 suits (Flame, Tide, Leaf, Stone) × values 1-6
// Cards are represented as objects { suit, value, id }
// Suit colors and shapes are defined in CSS for visual distinction

export const SUITS = ['Flame', 'Tide', 'Leaf', 'Stone'];
export const VALUES = [1, 2, 3, 4, 5, 6];

/**
 * Creates a full deck array
 * @returns {Array<{suit: string, value: number, id: string}>}
 */
export function createDeck() {
  const deck = [];
  let id = 0;
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, id: `${suit}-${value}-${id++}` });
    }
  }
  return deck;
}

/**
 * Fisher-Yates shuffle for deterministic randomness based on seed
 * @param {Array} array - The array to shuffle
 * @param {number} seed - Optional seed for reproducibility
 * @returns {Array} The shuffled array
 */
export function shuffle(array, seed = Date.now()) {
  const result = array.slice();
  let currentIndex = result.length;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  while (currentIndex > 0) {
    const randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    const temp = result[currentIndex];
    result[currentIndex] = result[randomIndex];
    result[randomIndex] = temp;
  }
  return result;
}

/**
 * Draws the top card from the deck
 * @param {Array} deck - The deck array
 * @returns {Object|null} The drawn card or null if deck empty
 */
export function drawCard(deck) {
  return deck.shift() || null;
}

/**
 * Deals initial hands of 5 cards to each player
 * @param {Array} deck - The shuffled deck
 * @returns {{playerHand: Array, aiHand: Array, remainingDeck: Array}}
 */
export function dealInitialHands(deck) {
  const playerHand = [];
  const aiHand = [];
  for (let i = 0; i < 5; i++) {
    playerHand.push(drawCard(deck));
    aiHand.push(drawCard(deck));
  }
  return { playerHand, aiHand, remainingDeck: deck };
}

/**
 * Draws a card from the remaining deck for the player
 * @param {Array} remainingDeck - The remaining deck
 * @returns {{card: Object, newDeck: Array}}
 */
export function drawFromDeck(remainingDeck) {
  if (remainingDeck.length === 0) {
    return { card: null, newDeck: remainingDeck };
  }
  const card = drawCard(remainingDeck);
  return { card, newDeck: remainingDeck };
}
