import { GAME_STATE, CONSTANTS } from './state.js';
import { SUITS } from './deck.js';

const WIDTH = 1280;
const HEIGHT = 720;
const CARD_WIDTH = 124;
const CARD_HEIGHT = 164;
const CARD_GAP = 14;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });

const PALETTE = {
  night: '#07111b',
  tableTop: '#123f45',
  tableBottom: '#0b292f',
  gold: '#e9bf72',
  goldLight: '#ffe2a0',
  cream: '#f5ecd8',
  muted: '#b5c9c2',
  panel: '#091922',
  teal: '#7de0c1',
  red: '#ff9b88',
};

const SUIT_COLORS = {
  Flame: { top: '#f07a52', bottom: '#a63d45', border: '#ffbd76', glyph: '✦' },
  Tide: { top: '#52b9d1', bottom: '#276b93', border: '#9ceaff', glyph: '≈' },
  Leaf: { top: '#79bd77', bottom: '#347953', border: '#c4ef91', glyph: '❧' },
  Stone: { top: '#b6b8bd', bottom: '#656b79', border: '#f1d9b3', glyph: '⬟' },
};

function roundedPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundRect(x, y, width, height, radius, color) {
  roundedPath(x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
}

function strokeRoundRect(x, y, width, height, radius, color, lineWidth = 1) {
  roundedPath(x, y, width, height, radius);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawBackdrop() {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#102638');
  sky.addColorStop(1, PALETTE.night);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let index = 0; index < 74; index += 1) {
    const x = ((index * 197 + 43) % 1270) + 5;
    const y = ((index * 113 + 27) % 710) + 5;
    const radius = index % 9 === 0 ? 1.7 : 0.8;
    ctx.fillStyle = index % 4 === 0 ? 'rgba(233,191,114,0.65)' : 'rgba(204,230,226,0.45)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const wood = ctx.createLinearGradient(0, 25, 0, 695);
  wood.addColorStop(0, PALETTE.tableTop);
  wood.addColorStop(1, PALETTE.tableBottom);
  fillRoundRect(28, 24, 1224, 672, 34, wood);
  strokeRoundRect(28, 24, 1224, 672, 34, 'rgba(233,191,114,0.68)', 2);
  strokeRoundRect(40, 36, 1200, 648, 28, 'rgba(208,232,210,0.12)', 1);

  ctx.fillStyle = 'rgba(0,0,0,0.09)';
  ctx.beginPath();
  ctx.ellipse(WIDTH / 2, 362, 525, 230, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(233,191,114,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(WIDTH / 2, 362, 525, 230, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function label(value, x, y, size, color, align = 'left', weight = 'normal', family = 'Georgia, serif') {
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(value, x, y);
}

function drawLifeBar(x, y, value, name, accent) {
  label(name.toUpperCase(), x, y - 13, 13, PALETTE.muted, 'left', 'bold', 'Arial, sans-serif');
  label(`${Math.max(0, value)} / ${CONSTANTS.START_LIFE}`, x + 292, y - 13, 14, PALETTE.cream, 'right', 'bold', 'Arial, sans-serif');
  fillRoundRect(x, y, 292, 14, 7, 'rgba(0,0,0,0.36)');
  const fill = ctx.createLinearGradient(x, y, x + 292, y);
  fill.addColorStop(0, accent);
  fill.addColorStop(1, PALETTE.goldLight);
  fillRoundRect(x, y, 292 * Math.max(0, Math.min(1, value / CONSTANTS.START_LIFE)), 14, 7, fill);
  strokeRoundRect(x, y, 292, 14, 7, 'rgba(245,236,216,0.3)', 1);
}

function drawSuitMark(suit, x, y, size, color) {
  const index = SUITS.indexOf(suit);
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, size * 0.08);
  if (index === 0) {
    ctx.beginPath();
    ctx.moveTo(0, size * 0.58);
    ctx.lineTo(-size * 0.34, size * 0.04);
    ctx.lineTo(-size * 0.11, size * 0.16);
    ctx.lineTo(0, -size * 0.5);
    ctx.lineTo(size * 0.12, size * 0.14);
    ctx.lineTo(size * 0.34, size * 0.02);
    ctx.closePath();
    ctx.fill();
  } else if (index === 1) {
    ctx.beginPath();
    ctx.moveTo(-size * 0.42, -size * 0.18);
    ctx.quadraticCurveTo(-size * 0.12, -size * 0.46, size * 0.1, -size * 0.16);
    ctx.quadraticCurveTo(size * 0.32, size * 0.14, size * 0.46, -size * 0.16);
    ctx.moveTo(-size * 0.42, size * 0.2);
    ctx.quadraticCurveTo(-size * 0.12, -size * 0.08, size * 0.1, size * 0.22);
    ctx.quadraticCurveTo(size * 0.32, size * 0.52, size * 0.46, size * 0.22);
    ctx.stroke();
  } else if (index === 2) {
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.25, size * 0.48, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#18352b';
    ctx.lineWidth = Math.max(1, size * 0.04);
    ctx.beginPath();
    ctx.moveTo(-size * 0.25, size * 0.3);
    ctx.lineTo(size * 0.24, -size * 0.28);
    ctx.stroke();
  } else {
    ctx.beginPath();
    for (let point = 0; point < 6; point += 1) {
      const angle = Math.PI / 3 * point - Math.PI / 2;
      const px = Math.cos(angle) * size * 0.4;
      const py = Math.sin(angle) * size * 0.4;
      if (point === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawCard(card, x, y, width = CARD_WIDTH, height = CARD_HEIGHT, selected = false) {
  if (!card) return;
  const colors = SUIT_COLORS[card.suit] ?? SUIT_COLORS.Stone;
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, colors.top);
  gradient.addColorStop(1, colors.bottom);
  ctx.save();
  ctx.shadowColor = selected ? 'rgba(255,218,132,0.52)' : 'rgba(0,0,0,0.38)';
  ctx.shadowBlur = selected ? 18 : 9;
  ctx.shadowOffsetY = selected ? 9 : 5;
  fillRoundRect(x, y, width, height, 12, gradient);
  ctx.restore();

  strokeRoundRect(x, y, width, height, 12, selected ? PALETTE.goldLight : colors.border, selected ? 4 : 2);
  strokeRoundRect(x + 6, y + 6, width - 12, height - 12, 8, 'rgba(255,255,255,0.22)', 1);
  const scale = width / CARD_WIDTH;
  label(String(card.value), x + width / 2, y + height * 0.34, 46 * scale, '#fff8e9', 'center', 'bold');
  drawSuitMark(card.suit, x + width / 2, y + height * 0.61, 27 * scale, '#fff1cd');
  label(card.suit.toUpperCase(), x + width / 2, y + height * 0.82, 12 * scale, '#fff1dc', 'center', 'bold', 'Arial, sans-serif');
  if (card.value === 6) {
    fillRoundRect(x + width * 0.19, y + 10 * scale, width * 0.62, 20 * scale, 10 * scale, 'rgba(34,24,22,0.38)');
    label('NOVA', x + width / 2, y + 20 * scale, 10 * scale, '#fff2bf', 'center', 'bold', 'Arial, sans-serif');
  }
}

function drawHand(hand, y, isPlayer) {
  const width = hand.length * CARD_WIDTH + Math.max(0, hand.length - 1) * CARD_GAP;
  const startX = (WIDTH - width) / 2;
  for (let index = 0; index < hand.length; index += 1) {
    const selected = isPlayer && GAME_STATE.selectedCardIndex === index;
    const lift = selected ? 14 : 0;
    drawCard(hand[index], startX + index * (CARD_WIDTH + CARD_GAP), y - lift, CARD_WIDTH, CARD_HEIGHT, selected);
  }
}

function drawHeader() {
  label('STARFALL DUEL', WIDTH / 2, 42, 14, PALETTE.goldLight, 'center', 'bold', 'Arial, sans-serif');
  label(`ROUND ${String(GAME_STATE.round + 1).padStart(2, '0')}`, WIDTH / 2, 66, 12, PALETTE.muted, 'center', 'bold', 'Arial, sans-serif');
  drawLifeBar(74, 85, GAME_STATE.aiLife, 'Oracle', '#67d3c5');
  drawLifeBar(914, 85, GAME_STATE.playerLife, 'You', '#f2bf71');
  label('THE ORACLE  •  OPEN HAND', WIDTH / 2, 124, 12, PALETTE.muted, 'center', 'bold', 'Arial, sans-serif');
}

function drawBattle() {
  label('YOUR HAND  •  CHOOSE A SIGIL', WIDTH / 2, 484, 12, PALETTE.goldLight, 'center', 'bold', 'Arial, sans-serif');
  drawHand(GAME_STATE.aiHand, 140, false);
  drawHand(GAME_STATE.playerHand, 506, true);

  fillRoundRect(430, 316, 420, 145, 22, 'rgba(3,17,23,0.42)');
  strokeRoundRect(430, 316, 420, 145, 22, 'rgba(233,191,114,0.18)', 1);
  const playerCard = GAME_STATE.trick.playerCard;
  const aiCard = GAME_STATE.trick.aiCard;
  if (playerCard) drawCard(playerCard, 466, 322, 102, 132, false);
  if (playerCard && aiCard) label('VS', WIDTH / 2, 384, 16, PALETTE.goldLight, 'center', 'bold', 'Arial, sans-serif');
  if (aiCard) drawCard(aiCard, 712, 322, 102, 132, false);
  if (!playerCard && !aiCard) {
    label(GAME_STATE.phase === 'waiting' ? 'THE NEXT TRICK AWAITS' : 'THE ORACLE IS CHOOSING…', WIDTH / 2, 373, 19, PALETTE.cream, 'center', 'bold');
    label('Higher value wins  •  Matching suit doubles damage  •  Six adds +2', WIDTH / 2, 403, 12, PALETTE.muted, 'center', 'normal', 'Arial, sans-serif');
  } else if (playerCard && !aiCard) {
    label('YOUR SIGIL', 618, 367, 11, PALETTE.muted, 'center', 'bold', 'Arial, sans-serif');
  }
}

function drawTitle() {
  drawBackdrop();
  ctx.save();
  ctx.shadowColor = 'rgba(125,224,193,0.4)';
  ctx.shadowBlur = 24;
  label('STARFALL', WIDTH / 2, 168, 72, PALETTE.cream, 'center', 'bold');
  ctx.restore();
  label('DUEL', WIDTH / 2, 226, 24, PALETTE.goldLight, 'center', 'bold', 'Arial, sans-serif');
  label('A celestial card battle of value, timing, and matching sigils', WIDTH / 2, 270, 18, PALETTE.muted, 'center');

  drawCard({ value: 6, suit: 'Flame' }, 405, 326, 142, 190, false);
  drawCard({ value: 4, suit: 'Tide' }, 733, 326, 142, 190, false);
  label('NOVA', WIDTH / 2, 391, 14, PALETTE.goldLight, 'center', 'bold', 'Arial, sans-serif');
  label('VS', WIDTH / 2, 424, 28, PALETTE.cream, 'center', 'bold');

  fillRoundRect(440, 552, 400, 58, 29, PALETTE.gold);
  label('CLICK OR PRESS ENTER TO BEGIN', WIDTH / 2, 581, 16, '#19251f', 'center', 'bold', 'Arial, sans-serif');
  label('Click a sigil twice to play  •  1–5 then Enter also works  •  R restarts', WIDTH / 2, 644, 13, PALETTE.muted, 'center', 'normal', 'Arial, sans-serif');
}

function drawEnd(isWin) {
  drawBackdrop();
  const accent = isWin ? PALETTE.teal : PALETTE.red;
  ctx.save();
  ctx.shadowColor = isWin ? 'rgba(125,224,193,0.5)' : 'rgba(255,155,136,0.45)';
  ctx.shadowBlur = 30;
  label(isWin ? 'VICTORY' : 'DEFEAT', WIDTH / 2, 230, 72, accent, 'center', 'bold');
  ctx.restore();
  label(isWin ? 'The stars answer to you.' : 'The Oracle claims this night.', WIDTH / 2, 294, 22, PALETTE.cream, 'center');
  fillRoundRect(400, 346, 480, 124, 20, 'rgba(4,18,24,0.58)');
  strokeRoundRect(400, 346, 480, 124, 20, 'rgba(233,191,114,0.32)', 1);
  label('FINAL VITALITY', WIDTH / 2, 379, 13, PALETTE.muted, 'center', 'bold', 'Arial, sans-serif');
  label(`YOU  ${Math.max(0, GAME_STATE.playerLife)}     •     ORACLE  ${Math.max(0, GAME_STATE.aiLife)}`, WIDTH / 2, 426, 24, PALETTE.cream, 'center', 'bold');
  fillRoundRect(490, 526, 300, 58, 29, PALETTE.gold);
  label('PLAY AGAIN  •  ENTER', WIDTH / 2, 555, 16, '#19251f', 'center', 'bold', 'Arial, sans-serif');
  label('Or press R to begin a new duel', WIDTH / 2, 620, 14, PALETTE.muted, 'center', 'normal', 'Arial, sans-serif');
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerHeight * ratio);
  const scale = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
  const x = (window.innerWidth - WIDTH * scale) / 2;
  const y = (window.innerHeight - HEIGHT * scale) / 2;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = PALETTE.night;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(scale * ratio, 0, 0, scale * ratio, x * ratio, y * ratio);
}

export function render() {
  resizeCanvas();
  if (GAME_STATE.screen === 'title') {
    drawTitle();
    return;
  }
  if (GAME_STATE.screen === 'win' || GAME_STATE.screen === 'loss') {
    drawEnd(GAME_STATE.screen === 'win');
    return;
  }
  drawBackdrop();
  drawHeader();
  drawBattle();
}

window.addEventListener('resize', render);
