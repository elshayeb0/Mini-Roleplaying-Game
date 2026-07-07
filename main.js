// Mini RPG game logic with remote audio assets, pixel UI tweaks and accessibility
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const SAVE_KEY = 'mini-rpg-save-v1';
const AUDIO_SETTINGS_KEY = 'mini-rpg-audio-settings-v1';

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const saveBtn = document.querySelector('#saveBtn');
const loadBtn = document.querySelector('#loadBtn');
const resetBtn = document.querySelector('#resetBtn');
const toggleMusicBtn = document.querySelector('#toggleMusic');
const toggleSfxBtn = document.querySelector('#toggleSfx');
const srStatus = document.querySelector('#sr-status');

const weapons = [ { name: 'stick', power: 5 }, { name: 'dagger', power: 30 }, { name: 'claw hammer', power: 50 }, { name: 'sword', power: 100 } ];
const monsters = [ { name: "slime", level: 2, health: 15 }, { name: "fanged beast", level: 8, health: 60 }, { name: "dragon", level: 20, health: 300 } ];
const locations = [
  { name: "town square", "button text": ["Go to store", "Go to cave", "Fight dragon"], "button functions": [goStore, goCave, fightDragon], text: "You are in the town square. You see a sign that says \"Store\"." },
  { name: "store", "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"], "button functions": [buyHealth, buyWeapon, goTown], text: "You enter the store." },
  { name: "cave", "button text": ["Fight slime", "Fight fanged beast", "Go to town square"], "button functions": [fightSlime, fightBeast, goTown], text: "You enter the cave. You see some monsters." },
  { name: "fight", "button text": ["Attack", "Dodge", "Run"], "button functions": [attack, dodge, goTown], text: "You are fighting a monster." },
  { name: "kill monster", "button text": ["Go to town square", "Go to town square", "Go to town square"], "button functions": [goTown, goTown, goTown], text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.' },
  { name: "lose", "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], "button functions": [restart, restart, restart], text: "You die. \u2620" },
  { name: "win", "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], "button functions": [restart, restart, restart], text: "You defeat the dragon! YOU WIN THE GAME! \u1F389" },
  { name: "easter egg", "button text": ["2", "8", "Go to town square?"], "button functions": [pickTwo, pickEight, goTown], text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!" }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// toolbar buttons
saveBtn.onclick = saveGame;
loadBtn.onclick = loadGame;
resetBtn.onclick = resetGame;
toggleMusicBtn.onclick = toggleMusic;
toggleSfxBtn.onclick = toggleSfx;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
  announce(location.name);
}

function updateStats() { xpText.innerText = xp; healthText.innerText = health; goldText.innerText = gold; }
function showMessage(msg) { text.innerText = msg; announce(msg); }
function announce(msg) { if (srStatus) { srStatus.innerText = msg; } }

function goTown() { update(locations[0]); }
function goStore() { update(locations[1]); }
function goCave() { update(locations[2]); }

function buyHealth() { if (gold >= 10) { gold -= 10; health += 10; updateStats(); playSfx('coin'); showMessage('You bought 10 health.'); } else { showMessage("You do not have enough gold to buy health."); } }

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30; currentWeapon++; updateStats(); let newWeapon = weapons[currentWeapon].name; inventory.push(newWeapon); playSfx('coin'); showMessage("You now have a " + newWeapon + ". In your inventory you have: " + inventory);
    } else { showMessage("You do not have enough gold to buy a weapon."); }
  } else { showMessage("You already have the most powerful weapon!"); button2.innerText = "Sell weapon for 15 gold"; button2.onclick = sellWeapon; }
}

function sellWeapon() { if (inventory.length > 1) { gold += 15; updateStats(); let sold = inventory.shift(); currentWeapon = Math.max(0, currentWeapon - 1); playSfx('coin'); showMessage("You sold a " + sold + ". In your inventory you have: " + inventory); } else { showMessage("Don't sell your only weapon!"); } }

function fightSlime() { fighting = 0; goFight(); }
function fightBeast() { fighting = 1; goFight(); }
function fightDragon() { fighting = 2; goFight(); }

function goFight() { update(locations[3]); monsterHealth = monsters[fighting].health; monsterStats.style.display = "block"; monsterName.innerText = monsters[fighting].name; monsterHealthText.innerText = monsterHealth; }

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  playSfx('hit');
  if (isMonsterHit()) { monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1; playSfx('attack'); }
  else { text.innerText += " You miss."; }
  updateStats(); monsterHealthText.innerText = monsterHealth;
  if (health <= 0) { lose(); }
  else if (monsterHealth <= 0) { if (fighting === 2) { winGame(); } else { defeatMonster(); } }
  if (Math.random() <= .1 && inventory.length !== 1) { text.innerText += " Your " + inventory.pop() + " breaks."; currentWeapon--; }
}

function getMonsterAttackValue(level) { const hit = (level * 5) - (Math.floor(Math.random() * xp)); console.log(hit); return hit > 0 ? hit : 0; }
function isMonsterHit() { return Math.random() > .2 || health < 20; }
function dodge() { showMessage("You dodge the attack from the " + monsters[fighting].name); playSfx('dodge'); }

function defeatMonster() { gold += Math.floor(monsters[fighting].level * 6.7); xp += monsters[fighting].level; updateStats(); playSfx('victory'); update(locations[4]); }
function lose() { playSfx('defeat'); update(locations[5]); }
function winGame() { playSfx('victory'); update(locations[6]); }

function restart() { xp = 0; health = 100; gold = 50; currentWeapon = 0; inventory = ["stick"]; updateStats(); goTown(); }
function easterEgg() { update(locations[7]); }
function pickTwo() { pick(2); }
function pickEight() { pick(8); }

function pick(guess) { const numbers = []; while (numbers.length < 10) { numbers.push(Math.floor(Math.random() * 11)); } text.innerText = "You picked " + guess + ". Here are the random numbers:\n"; for (let i = 0; i < 10; i++) { text.innerText += numbers[i] + "\n"; } if (numbers.includes(guess)) { text.innerText += "Right! You win 20 gold!"; gold += 20; updateStats(); playSfx('coin'); } else { text.innerText += "Wrong! You lose 10 health!"; health -= 10; updateStats(); if (health <= 0) { lose(); } } }

// --- Remote Audio support (public CC0/CC-BY assets) ---
// Background music: Eric Matyas (Soundimage) - CC-BY (attribution required)
// SFX: samples from OpenGameArt (public domain / CC0) - check sources if needed
const audioFiles = {
  background: 'http://soundimage.org/wp-content/uploads/2017/10/8-Bit-Perplexion.mp3',
  attack: 'https://opengameart.org/sites/default/files/Attack_2.mp3',
  hit: 'https://opengameart.org/sites/default/files/Hit_1.mp3',
  victory: 'https://opengameart.org/sites/default/files/Victory_1.mp3',
  defeat: 'https://opengameart.org/sites/default/files/Defeat_1.mp3',
  coin: 'https://opengameart.org/sites/default/files/Coin_2.mp3',
  dodge: 'https://opengameart.org/sites/default/files/Dodge_1.mp3'
};

const audio = { background: null, sfx: {} };
let audioSettings = { music: false, sfx: true };

function initAudio() {
  try { const saved = localStorage.getItem(AUDIO_SETTINGS_KEY); if (saved) audioSettings = Object.assign(audioSettings, JSON.parse(saved)); } catch (e) { }

  try {
    audio.background = new Audio(audioFiles.background);
    audio.background.loop = true; audio.background.volume = 0.5;
    audio.background.addEventListener('error', () => { audio.background = null; });
  } catch (e) { audio.background = null; }

  Object.keys(audioFiles).forEach(key => {
    if (key === 'background') return;
    const src = audioFiles[key];
    try { const a = new Audio(src); a.addEventListener('error', () => { /* ignore missing */ }); audio.sfx[key] = a; } catch (e) { /* ignore */ }
  });

  updateAudioButtons(); if (audioSettings.music) startMusic();
}

function playSfx(name) { if (!audioSettings.sfx) return; const snd = audio.sfx[name]; if (!snd) return; try { const instance = snd.cloneNode(); instance.play().catch(()=>{}); } catch (e) { }
}
function startMusic() { if (audio.background && audioSettings.music) { audio.background.play().catch(()=>{}); } }
function stopMusic() { if (audio.background) { audio.background.pause(); audio.background.currentTime = 0; } }
function toggleMusic() { audioSettings.music = !audioSettings.music; if (audioSettings.music) startMusic(); else stopMusic(); persistAudioSettings(); updateAudioButtons(); }
function toggleSfx() { audioSettings.sfx = !audioSettings.sfx; persistAudioSettings(); updateAudioButtons(); }
function persistAudioSettings() { try { localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(audioSettings)); } catch (e) {} }
function updateAudioButtons() { toggleMusicBtn.setAttribute('aria-pressed', String(!!audioSettings.music)); toggleMusicBtn.innerText = `Music: ${audioSettings.music ? 'On' : 'Off'}`; toggleSfxBtn.setAttribute('aria-pressed', String(!!audioSettings.sfx)); toggleSfxBtn.innerText = `SFX: ${audioSettings.sfx ? 'On' : 'Off'}`; }

// --- Save / Load ---
function saveGame() { const state = { xp, health, gold, currentWeapon, inventory }; try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); showMessage('Game saved.'); } catch (e) { console.error('Save failed', e); showMessage('Save failed: localStorage not available'); } }
function loadGame() { try { const raw = localStorage.getItem(SAVE_KEY); if (!raw) { showMessage('No saved game found.'); return; } const state = JSON.parse(raw); xp = Number(state.xp) || 0; health = Number(state.health) || 100; gold = Number(state.gold) || 0; currentWeapon = Number(state.currentWeapon) || 0; inventory = Array.isArray(state.inventory) ? state.inventory : ["stick"]; updateStats(); showMessage('Game loaded.'); goTown(); } catch (e) { console.error('Load failed', e); showMessage('Load failed: corrupted save data'); } }
function resetGame() { localStorage.removeItem(SAVE_KEY); restart(); showMessage('Save cleared and game reset.'); }

// Init
initAudio(); if (localStorage.getItem(SAVE_KEY)) { loadGame(); } else { updateStats(); goTown(); }
window.addEventListener('beforeunload', () => { try { saveGame(); } catch (e) {} });
window.addEventListener('keydown', (e) => { if (e.key === 'Enter') { button1.click(); } });
window.__miniRpg = { saveGame, loadGame, resetGame, toggleMusic, toggleSfx };
