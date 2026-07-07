// Mini RPG with production-ready UI flow, accessibility, and deployment-safe asset paths.
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting = null;
let monsterHealth = 0;
let currentMonsterMaxHealth = 1;
let comboCount = 0;
let difficulty = 'normal';
let visualEffectsEnabled = true;
let masterVolume = 0.5;
let inventory = ['stick'];

const SAVE_KEY = 'mini-rpg-save-v2';
const SETTINGS_KEY = 'mini-rpg-settings-v2';

const difficultyModes = {
  easy: { label: 'Easy', monsterHp: 0.85, monsterAttack: 0.85, reward: 0.9 },
  normal: { label: 'Normal', monsterHp: 1, monsterAttack: 1, reward: 1 },
  hard: { label: 'Hard', monsterHp: 1.2, monsterAttack: 1.2, reward: 1.2 }
};

const weapons = [
  { name: 'stick', power: 5, price: 0 },
  { name: 'dagger', power: 30, price: 30 },
  { name: 'claw hammer', power: 50, price: 30 },
  { name: 'sword', power: 100, price: 30 }
];

const monsters = [
  { name: 'slime', level: 2, health: 15, sprite: 'assets/sprites/slime.svg' },
  { name: 'fanged beast', level: 8, health: 60, sprite: 'assets/sprites/beast.svg' },
  { name: 'dragon', level: 20, health: 300, sprite: 'assets/sprites/dragon.svg' }
];

const locations = [
  {
    name: 'town square',
    buttonText: ['Go to store', 'Go to cave', 'Fight dragon'],
    buttonFunctions: [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".'
  },
  {
    name: 'store',
    buttonText: ['Buy 10 health (10 gold)', 'Buy weapon (30 gold)', 'Go to town square'],
    buttonFunctions: [buyHealth, buyWeapon, goTown],
    text: 'You enter the store and inspect the items before buying.'
  },
  {
    name: 'cave',
    buttonText: ['Fight slime', 'Fight fanged beast', 'Go to town square'],
    buttonFunctions: [fightSlime, fightBeast, goTown],
    text: 'You enter the cave. Shadows move near the walls.'
  },
  {
    name: 'fight',
    buttonText: ['Attack', 'Dodge', 'Run'],
    buttonFunctions: [attack, dodge, goTown],
    text: 'You are fighting a monster.'
  },
  {
    name: 'kill monster',
    buttonText: ['Go to town square', 'Go to cave', 'Check inventory'],
    buttonFunctions: [goTown, goCave, () => togglePanel(inventoryPanel, inventoryBtn)],
    text: 'The monster screams as it dies. You gain experience points and find gold.'
  },
  {
    name: 'lose',
    buttonText: ['Replay?', 'Replay?', 'Replay?'],
    buttonFunctions: [restart, restart, restart],
    text: 'You die. ☠'
  },
  {
    name: 'win',
    buttonText: ['Replay?', 'Replay?', 'Replay?'],
    buttonFunctions: [restart, restart, restart],
    text: 'You defeat the dragon! YOU WIN THE GAME! 🎉'
  },
  {
    name: 'easter egg',
    buttonText: ['2', '8', 'Go to town square'],
    buttonFunctions: [pickTwo, pickEight, goTown],
    text: 'You find a secret game. Pick a number above.'
  }
];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const text = document.querySelector('#text');
const xpText = document.querySelector('#xpText');
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText');
const comboText = document.querySelector('#comboText');
const weaponText = document.querySelector('#weaponText');
const difficultyText = document.querySelector('#difficultyText');
const inventoryList = document.querySelector('#inventoryList');
const game = document.querySelector('#game');

const monsterStats = document.querySelector('#monsterStats');
const monsterName = document.querySelector('#monsterName');
const monsterHealthText = document.querySelector('#monsterHealth');
const playerHealthBar = document.querySelector('#playerHealthBar');
const monsterHealthBar = document.querySelector('#monsterHealthBar');

const saveBtn = document.querySelector('#saveBtn');
const loadBtn = document.querySelector('#loadBtn');
const resetBtn = document.querySelector('#resetBtn');
const inventoryBtn = document.querySelector('#inventoryBtn');
const settingsBtn = document.querySelector('#settingsBtn');
const toggleMusicBtn = document.querySelector('#toggleMusic');
const toggleSfxBtn = document.querySelector('#toggleSfx');

const inventoryPanel = document.querySelector('#inventoryPanel');
const settingsPanel = document.querySelector('#settingsPanel');
const shopInfo = document.querySelector('#shopInfo');
const healthItemInfo = document.querySelector('#healthItemInfo');
const weaponItemInfo = document.querySelector('#weaponItemInfo');
const helpText = document.querySelector('#helpText');

const difficultySelect = document.querySelector('#difficultySelect');
const startDifficulty = document.querySelector('#startDifficulty');
const volumeRange = document.querySelector('#volumeRange');
const effectsToggle = document.querySelector('#effectsToggle');

const loadingScreen = document.querySelector('#loadingScreen');
const loadingText = document.querySelector('#loadingText');
const startScreen = document.querySelector('#startScreen');
const startButton = document.querySelector('#startButton');

const playerSpriteImg = document.querySelector('#playerSprite');
const monsterSpriteImg = document.querySelector('#monsterSprite');
const floatingContainer = document.querySelector('#floating-container');
const combatFx = document.querySelector('#combatFx');
const srStatus = document.querySelector('#sr-status');

const audioFiles = {
  background: 'https://soundimage.org/wp-content/uploads/2017/10/8-Bit-Perplexion.mp3',
  attack: 'https://opengameart.org/sites/default/files/Attack_2.mp3',
  hit: 'https://opengameart.org/sites/default/files/Hit_1.mp3',
  victory: 'https://opengameart.org/sites/default/files/Victory_1.mp3',
  defeat: 'https://opengameart.org/sites/default/files/Defeat_1.mp3',
  coin: 'https://opengameart.org/sites/default/files/Coin_2.mp3',
  dodge: 'https://opengameart.org/sites/default/files/Dodge_1.mp3'
};

const audio = { background: null, sfx: {} };
let audioSettings = { music: false, sfx: true };

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
saveBtn.onclick = saveGame;
loadBtn.onclick = loadGame;
resetBtn.onclick = resetGame;
toggleMusicBtn.onclick = toggleMusic;
toggleSfxBtn.onclick = toggleSfx;
inventoryBtn.onclick = () => togglePanel(inventoryPanel, inventoryBtn);
settingsBtn.onclick = () => togglePanel(settingsPanel, settingsBtn);
startButton.onclick = startGame;

difficultySelect.addEventListener('change', () => applyDifficulty(difficultySelect.value));
startDifficulty.addEventListener('change', () => applyDifficulty(startDifficulty.value));
volumeRange.addEventListener('input', () => {
  masterVolume = Number(volumeRange.value) || 0.5;
  applyVolume();
  persistSettings();
});
effectsToggle.addEventListener('change', () => {
  visualEffectsEnabled = !!effectsToggle.checked;
  persistSettings();
});

window.addEventListener('keydown', (event) => {
  if (startScreen && !startScreen.classList.contains('hidden') && event.key === 'Enter') {
    startButton.click();
    return;
  }

  if (event.key === '1') button1.click();
  if (event.key === '2') button2.click();
  if (event.key === '3') button3.click();
  if (event.key.toLowerCase() === 'i') inventoryBtn.click();
  if (event.key.toLowerCase() === 's') settingsBtn.click();
  if (event.key === 'Escape') {
    closePanel(inventoryPanel, inventoryBtn);
    closePanel(settingsPanel, settingsBtn);
  }
});

function announce(message) {
  if (srStatus) srStatus.innerText = message;
}

function showMessage(message) {
  text.innerText = message;
  announce(message);
}

function update(location) {
  monsterStats.style.display = 'none';
  monsterStats.setAttribute('aria-hidden', 'true');
  shopInfo.hidden = location.name !== 'store';

  button1.innerText = location.buttonText[0];
  button2.innerText = location.buttonText[1];
  button3.innerText = location.buttonText[2];
  button1.onclick = location.buttonFunctions[0];
  button2.onclick = location.buttonFunctions[1];
  button3.onclick = location.buttonFunctions[2];

  text.innerText = location.text;
  runSceneTransition();
  updateShopInfo();
  announce(location.name);
}

function runSceneTransition() {
  game.classList.remove('fading');
  requestAnimationFrame(() => game.classList.add('fading'));
}

function applyDifficulty(newDifficulty) {
  difficulty = difficultyModes[newDifficulty] ? newDifficulty : 'normal';
  const label = difficultyModes[difficulty].label;
  difficultyText.innerText = label;
  difficultySelect.value = difficulty;
  startDifficulty.value = difficulty;
  persistSettings();
  showMessage(`Difficulty set to ${label}.`);
}

function updateStats() {
  xpText.innerText = xp;
  healthText.innerText = health;
  goldText.innerText = gold;
  comboText.innerText = comboCount;
  weaponText.innerText = weapons[currentWeapon].name;

  const playerPercent = Math.max(0, Math.min(100, (health / Math.max(health, 100)) * 100));
  playerHealthBar.style.width = `${playerPercent}%`;

  const monsterPercent = Math.max(0, Math.min(100, (monsterHealth / currentMonsterMaxHealth) * 100));
  monsterHealthBar.style.width = `${monsterPercent}%`;

  updateInventoryPanel();
}

function updateInventoryPanel() {
  inventoryList.innerHTML = '';
  inventory.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerText = `${index + 1}. ${item}`;
    inventoryList.appendChild(li);
  });
}

function updateShopInfo() {
  healthItemInfo.innerText = 'Potion: +10 health for 10 gold.';
  const nextWeapon = weapons[currentWeapon + 1];
  weaponItemInfo.innerText = nextWeapon
    ? `Next weapon: ${nextWeapon.name} (+${nextWeapon.power} power) for ${nextWeapon.price} gold.`
    : 'You already own the strongest weapon.';
}

function togglePanel(panel, button) {
  const willOpen = panel.hidden;
  closePanel(inventoryPanel, inventoryBtn);
  closePanel(settingsPanel, settingsBtn);
  if (!willOpen) return;
  panel.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  panel.focus();
}

function closePanel(panel, button) {
  panel.hidden = true;
  button.setAttribute('aria-expanded', 'false');
}

function goTown() {
  setPlayerSprite('idle');
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    updateStats();
    playSfx('coin');
    showMessage('You bought 10 health.');
  } else {
    showMessage('You do not have enough gold to buy health.');
  }
}

function buyWeapon() {
  if (currentWeapon >= weapons.length - 1) {
    showMessage('You already have the most powerful weapon!');
    return;
  }

  const nextWeapon = weapons[currentWeapon + 1];
  if (gold < nextWeapon.price) {
    showMessage(`You need ${nextWeapon.price} gold to buy ${nextWeapon.name}.`);
    return;
  }

  gold -= nextWeapon.price;
  currentWeapon += 1;
  inventory.push(nextWeapon.name);
  updateStats();
  updateShopInfo();
  playSfx('coin');
  showMessage(`You bought ${nextWeapon.name}.`);
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function getScaledMonster(monster) {
  const mode = difficultyModes[difficulty];
  return {
    ...monster,
    scaledLevel: Math.max(1, Math.floor(monster.level * mode.monsterAttack)),
    scaledHealth: Math.max(1, Math.floor(monster.health * mode.monsterHp)),
    rewardMultiplier: mode.reward
  };
}

function goFight() {
  const scaledMonster = getScaledMonster(monsters[fighting]);
  monsterHealth = scaledMonster.scaledHealth;
  currentMonsterMaxHealth = scaledMonster.scaledHealth;

  monsterStats.style.display = 'block';
  monsterStats.setAttribute('aria-hidden', 'false');
  monsterName.innerText = scaledMonster.name;
  monsterHealthText.innerText = monsterHealth;
  monsterSpriteImg.src = scaledMonster.sprite;
  monsterSpriteImg.alt = `${scaledMonster.name} sprite`;
  updateStats();
  update(locations[3]);
  text.innerText = `You are fighting a ${scaledMonster.name} (${difficultyModes[difficulty].label}).`;
}

function attack() {
  const target = getScaledMonster(monsters[fighting]);
  let battleText = `The ${target.name} attacks. You strike with your ${weapons[currentWeapon].name}.`;

  const incomingDamage = getMonsterAttackValue(target.scaledLevel);
  health -= incomingDamage;
  setPlayerSprite('hurt');
  playSfx('hit');

  if (isMonsterHit()) {
    comboCount += 1;
    const comboBonus = Math.max(0, comboCount - 1) * 2;
    const damage = weapons[currentWeapon].power + Math.floor(Math.random() * Math.max(1, xp)) + 1 + comboBonus;
    monsterHealth -= damage;
    battleText += comboBonus > 0 ? ` Combo +${comboBonus} bonus damage!` : '';
    setPlayerSprite('attack');
    animateAttack(damage);
    playSfx('attack');
  } else {
    comboCount = 0;
    battleText += ' You miss.';
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    const broken = inventory.pop();
    currentWeapon = Math.max(0, currentWeapon - 1);
    battleText += ` Your ${broken} breaks.`;
  }

  text.innerText = battleText;
  monsterHealthText.innerText = Math.max(0, monsterHealth);
  updateStats();

  if (health <= 0) {
    lose();
    return;
  }

  if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
    return;
  }

  setTimeout(() => setPlayerSprite('idle'), 220);
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - Math.floor(Math.random() * Math.max(1, xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  comboCount = 0;
  setPlayerSprite('idle');
  showMessage(`You dodge the attack from the ${monsters[fighting].name}.`);
  playSfx('dodge');
  animateDodge();
  updateStats();
}

function defeatMonster() {
  const mode = difficultyModes[difficulty];
  const rewardGold = Math.floor(monsters[fighting].level * 6.7 * mode.reward);
  const rewardXp = Math.floor(monsters[fighting].level * mode.reward);
  gold += rewardGold;
  xp += rewardXp;
  comboCount = 0;
  updateStats();
  playSfx('victory');
  animateVictory();
  update(locations[4]);
  text.innerText = `You win! +${rewardXp} XP and +${rewardGold} gold.`;
}

function lose() {
  comboCount = 0;
  playSfx('defeat');
  animateDefeat();
  setPlayerSprite('hurt');
  update(locations[5]);
}

function winGame() {
  comboCount = 0;
  playSfx('victory');
  animateVictory();
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  comboCount = 0;
  currentWeapon = 0;
  inventory = ['stick'];
  updateStats();
  setPlayerSprite('idle');
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() { pick(2); }
function pickEight() { pick(8); }

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) numbers.push(Math.floor(Math.random() * 11));
  text.innerText = `You picked ${guess}. Here are the random numbers:\n${numbers.join('\n')}\n`;
  if (numbers.includes(guess)) {
    gold += 20;
    playSfx('coin');
    text.innerText += 'Right! You win 20 gold!';
  } else {
    health -= 10;
    text.innerText += 'Wrong! You lose 10 health!';
    if (health <= 0) {
      lose();
      return;
    }
  }
  updateStats();
}

// Visual combat feedback helpers.
function animateAttack(damage) {
  if (!visualEffectsEnabled) {
    showFloatingText(`-${damage}`, document.querySelector('.sprite.monster'));
    return;
  }

  const playerEl = document.querySelector('.sprite.player');
  const monsterEl = document.querySelector('.sprite.monster');
  if (playerEl) {
    playerEl.classList.add('swing');
    playerEl.addEventListener('animationend', () => playerEl.classList.remove('swing'), { once: true });
  }
  if (monsterEl) {
    monsterEl.classList.add('shake');
    monsterEl.addEventListener('animationend', () => monsterEl.classList.remove('shake'), { once: true });
  }

  spawnSlash(monsterEl);
  spawnHitParticles(monsterEl, 6);
  showFloatingText(`-${damage}`, monsterEl);
}

function animateDodge() {
  if (!visualEffectsEnabled) return;
  const playerEl = document.querySelector('.sprite.player');
  if (playerEl) {
    playerEl.classList.add('flash');
    playerEl.addEventListener('animationend', () => playerEl.classList.remove('flash'), { once: true });
  }
}

function animateVictory() {
  if (!visualEffectsEnabled) return;
  const monsterEl = document.querySelector('.sprite.monster');
  if (monsterEl) {
    monsterEl.classList.add('flash');
    monsterEl.addEventListener('animationend', () => monsterEl.classList.remove('flash'), { once: true });
  }
  showFloatingText('WIN!', document.querySelector('.sprite.player'));
}

function animateDefeat() {
  if (!visualEffectsEnabled) return;
  const playerEl = document.querySelector('.sprite.player');
  if (playerEl) {
    playerEl.classList.add('shake');
    playerEl.addEventListener('animationend', () => playerEl.classList.remove('shake'), { once: true });
  }
  showFloatingText('DEFEAT', document.querySelector('.sprite.monster'));
}

function showFloatingText(textContent, anchorEl) {
  if (!floatingContainer || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const parentRect = game.getBoundingClientRect();
  const element = document.createElement('div');
  element.className = 'floating';
  element.innerText = textContent;
  element.style.left = `${rect.left - parentRect.left + rect.width / 2}px`;
  element.style.top = `${rect.top - parentRect.top + 10}px`;
  floatingContainer.appendChild(element);
  setTimeout(() => {
    if (element.parentNode) floatingContainer.removeChild(element);
  }, 900);
}

function spawnSlash(anchorEl) {
  if (!combatFx || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const base = game.getBoundingClientRect();
  const slash = document.createElement('div');
  slash.className = 'fx-slash';
  slash.style.left = `${rect.left - base.left + rect.width / 2 - 26}px`;
  slash.style.top = `${rect.top - base.top + rect.height / 2 - 4}px`;
  combatFx.appendChild(slash);
  setTimeout(() => slash.remove(), 250);
}

function spawnHitParticles(anchorEl, count) {
  if (!combatFx || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const base = game.getBoundingClientRect();
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'fx-hit';
    particle.style.left = `${rect.left - base.left + rect.width / 2}px`;
    particle.style.top = `${rect.top - base.top + rect.height / 2}px`;
    particle.style.setProperty('--dx', `${Math.floor(Math.random() * 46) - 23}px`);
    particle.style.setProperty('--dy', `${Math.floor(Math.random() * 46) - 23}px`);
    combatFx.appendChild(particle);
    setTimeout(() => particle.remove(), 450);
  }
}

function setPlayerSprite(state) {
  const map = {
    idle: 'assets/sprites/player-idle.svg',
    attack: 'assets/sprites/player-attack.svg',
    hurt: 'assets/sprites/player-hurt.svg'
  };
  playerSpriteImg.src = map[state] || map.idle;
}

function saveGame() {
  const state = {
    xp,
    health,
    gold,
    currentWeapon,
    inventory,
    difficulty,
    audioSettings,
    visualEffectsEnabled,
    masterVolume
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    showMessage('Game saved.');
  } catch {
    showMessage('Save failed: localStorage is unavailable.');
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      showMessage('No saved game found.');
      return;
    }

    const state = JSON.parse(raw);
    xp = Number(state.xp) || 0;
    health = Number(state.health) || 100;
    gold = Number(state.gold) || 50;
    currentWeapon = Number(state.currentWeapon) || 0;
    inventory = Array.isArray(state.inventory) && state.inventory.length ? state.inventory : ['stick'];
    audioSettings = Object.assign(audioSettings, state.audioSettings || {});
    visualEffectsEnabled = state.visualEffectsEnabled !== false;
    masterVolume = Number(state.masterVolume) || 0.5;
    applyDifficulty(state.difficulty || difficulty);
    effectsToggle.checked = visualEffectsEnabled;
    volumeRange.value = String(masterVolume);
    updateAudioButtons();
    applyVolume();
    updateStats();
    showMessage('Game loaded.');
    goTown();
  } catch {
    showMessage('Load failed: corrupted save data.');
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  restart();
  showMessage('Save cleared and game reset.');
}

function persistSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ difficulty, masterVolume, visualEffectsEnabled, audioSettings }));
  } catch {
    announce('Settings could not be persisted.');
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    difficulty = saved.difficulty || difficulty;
    masterVolume = Number(saved.masterVolume) || masterVolume;
    visualEffectsEnabled = saved.visualEffectsEnabled !== false;
    audioSettings = Object.assign(audioSettings, saved.audioSettings || {});
  } catch {
    announce('Settings read failed, using defaults.');
  }
}

function applyVolume() {
  if (audio.background) {
    audio.background.volume = masterVolume;
  }
  Object.values(audio.sfx).forEach((track) => {
    track.volume = masterVolume;
  });
}

function updateAudioButtons() {
  toggleMusicBtn.setAttribute('aria-pressed', String(!!audioSettings.music));
  toggleMusicBtn.innerText = `Music: ${audioSettings.music ? 'On' : 'Off'}`;
  toggleSfxBtn.setAttribute('aria-pressed', String(!!audioSettings.sfx));
  toggleSfxBtn.innerText = `SFX: ${audioSettings.sfx ? 'On' : 'Off'}`;
}

function playSfx(name) {
  if (!audioSettings.sfx) return;
  const sound = audio.sfx[name];
  if (!sound) return;
  try {
    const instance = sound.cloneNode();
    instance.volume = masterVolume;
    instance.play().catch(() => announce('Some sound effects are unavailable.'));
  } catch {
    announce('Sound effect playback failed.');
  }
}

function startMusic() {
  if (audio.background && audioSettings.music) {
    audio.background.play().catch(() => announce('Background music is unavailable.'));
  }
}

function stopMusic() {
  if (audio.background) {
    audio.background.pause();
    audio.background.currentTime = 0;
  }
}

function toggleMusic() {
  audioSettings.music = !audioSettings.music;
  if (audioSettings.music) startMusic();
  else stopMusic();
  updateAudioButtons();
  persistSettings();
}

function toggleSfx() {
  audioSettings.sfx = !audioSettings.sfx;
  updateAudioButtons();
  persistSettings();
}

function preloadTrack(audioElement, timeoutMs = 5000) {
  return new Promise((resolve) => {
    if (!audioElement) {
      resolve(false);
      return;
    }

    let finished = false;
    const done = (ok) => {
      if (finished) return;
      finished = true;
      resolve(ok);
    };

    const timer = setTimeout(() => done(false), timeoutMs);
    audioElement.addEventListener('canplaythrough', () => {
      clearTimeout(timer);
      done(true);
    }, { once: true });
    audioElement.addEventListener('error', () => {
      clearTimeout(timer);
      done(false);
    }, { once: true });
    audioElement.load();
  });
}

async function initAudio() {
  let loadedCount = 0;
  let failureCount = 0;

  try {
    audio.background = new Audio(audioFiles.background);
    audio.background.loop = true;
  } catch {
    audio.background = null;
  }

  Object.entries(audioFiles).forEach(([key, src]) => {
    if (key === 'background') return;
    try {
      audio.sfx[key] = new Audio(src);
    } catch {
      audio.sfx[key] = null;
    }
  });

  const tracks = [audio.background, ...Object.values(audio.sfx).filter(Boolean)];
  for (const track of tracks) {
    // Sequential loading keeps the status text meaningful for users on slower networks.
    const ok = await preloadTrack(track);
    if (ok) loadedCount += 1;
    else failureCount += 1;
    loadingText.innerText = `Loaded ${loadedCount}/${tracks.length} audio files`;
  }

  applyVolume();
  updateAudioButtons();

  if (failureCount > 0) {
    helpText.innerText = 'Some remote audio failed to load. Gameplay will continue without missing sounds.';
    announce('Some remote audio could not be loaded.');
  }

  if (audioSettings.music) startMusic();
}

function startGame() {
  startScreen.classList.add('hidden');
  game.classList.remove('hidden');
  updateStats();
  goTown();
  button1.focus();
}

async function init() {
  loadSettings();
  effectsToggle.checked = visualEffectsEnabled;
  volumeRange.value = String(masterVolume);
  applyDifficulty(difficulty);
  await initAudio();
  loadingScreen.classList.add('hidden');

  if (localStorage.getItem(SAVE_KEY)) {
    loadGame();
  } else {
    updateStats();
  }
}

init();
