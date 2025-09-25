const AUDIO = {
  correct: new Audio("assets/sounds/correct.mp3"),
  wrong: new Audio("assets/sounds/wrong.mp3"),
  coin: new Audio("assets/sounds/coin.mp3")
};
let state = { coins:0, playtime:0, stats:{history:[]} };
function addCoins(n){ state.coins+=n; document.getElementById("coins").textContent=state.coins; }
function startMainGame(){ document.getElementById("map-screen").classList.add("hidden"); document.getElementById("game-layout").classList.remove("hidden"); }
function startMemoryGame(){ document.getElementById("memory-game").classList.remove("hidden"); }
