import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repository = fileURLToPath(new URL('.', import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const relativeOutput = relative(repository, output);
const outputIsInRepository = relativeOutput === '' || (
  relativeOutput !== '..' &&
  !relativeOutput.startsWith('..' + sep) &&
  !isAbsolute(relativeOutput)
);
const gameDirectory = join(repository, 'game');
const screenshotsDirectory = join(repository, 'screenshots');

if (outputIsInRepository) {
  throw new Error('MAKEFUN_OUTPUT_DIR must point outside the repository.');
}
if (!existsSync(join(gameDirectory, 'index.html')) || !statSync(gameDirectory).isDirectory()) {
  throw new Error('The repository must contain game/index.html inside game/.');
}
if (!existsSync(screenshotsDirectory) || !statSync(screenshotsDirectory).isDirectory()) {
  throw new Error('The repository must contain a screenshots/ directory.');
}

mkdirSync(output, { recursive: true });
cpSync(gameDirectory, join(output, 'game'), { recursive: true });
cpSync(screenshotsDirectory, join(output, 'screenshots'), { recursive: true });

const dossier = buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(output, 'dossier.json'), dossier);
