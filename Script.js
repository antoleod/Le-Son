/**********************
 * CONFIG & DATA
 **********************/
const STORAGE_KEY = "sons-jeu-v1";
const SOUND_BANK = ["ou","gn","in","eu","eur","on"];

// Banco de palabras (+ imagen opcional). Puedes cambiar rutas libremente.
const WORDS = [
  // word, display (con hueco), answer, sound, img(optional)
  ["lapin", "un lap__n", "in", "in", "assets/images/lapin.png"],
  ["mouton", "un mout__n", "on", "on", "assets/images/mouton.png"],
  ["cochon", "un coch__", "on", "on", "assets/images/cochon.png"],
  ["fleur", "une fle__r", "eur", "eur", "assets/images/fleur.png"],
  ["champignon", "un champi__on", "gn", "gn", "assets/images/champignon.png"],
  ["ordinateur", "un ordinat__r", "eur", "eur", "assets/images/ordinateur.png"],
  ["sapin", "un sap__", "in", "in", "assets/images/sapin.png"],
  ["moulin", "le moul__n", "in", "in", "assets/images/moulin.png"],
  ["tracteur", "un tract__r", "eur", "eur", "assets/images/tracteur.png"],
  ["coeur", "un cœ__", "ur", "eur", "assets/images/coeur.png"], // 'ur' grafema, sonido 'eur'
  // extra para completar 50
  ["montagne", "une monta__e", "gn", "gn", "assets/images/montagne.png"],
  ["bouche", "une bo__he", "u", "ou", "assets/images/bouche.png"], // simplificado
  ["poulet", "un po__let", "u", "ou", "assets/images/poulet.png"],
  ["lion", "un li__", "on", "on", "assets/images/lion.png"],
  ["coing", "un co__", "ing", "in", "assets/images/coing.png"],
  ["champion", "un champi__", "on", "on", "assets/images/champion.png"],
  ["bouton", "un bo__on", "ut", "ou", "assets/images/bouton.png"],
  ["moutarde", "de la mo__tarde", "u", "ou", "assets/images/moutarde.png"],
  ["pingouin", "un pingou__", "in", "in", "assets/images/pingouin.png"],
  ["ourson", "un ours__", "on", "on", "assets/images/ourson.png"],
];

// Avatares: algunos gratis y otros en tienda (animales + unicornio).
const AVATARS = [
  { id:"girl",   name:"Fille",    src:"assets/avatars/girl.png",   price:0,  unlocked:true },
  { id:"boy",    name:"Garçon",   src:"assets/avatars/boy.png",    price:0,  unlocked:true },
  { id:"cat",    name:"Chat",     src:"assets/avatars/cat.png",    price:40, unlocked:false },
  { id:"dog",    name:"Chien",    src:"assets/avatars/dog.png",    price:40, unlocked:false },
  { id:"bunny",  name:"Lapin",    src:"assets/avatars/bunny.png",  price:60, unlocked:false },
  { id:"fox",    name:"Renard",   src:"assets/avatars/fox.png",    price:60, unlocked:false },
  { id:"panda",  name:"Panda",    src:"assets/avatars/panda.png",  price:80, unlocked:false },
  { id:"unicorn",name:"Licorne",  src:"assets/avatars/unicorn.png",price:120,unlocked:false }
];

// Generador de 10 niveles × 5 ejercicios a partir del banco de palabras
function generateLevels(){
  const shuffled = [...WORDS];
  // shuffle simple
  for(let i=shuffled.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1)); [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
  }
  // si faltan, reusa
  while(shuffled.length<50){ shuffled.push(...WORDS) }
  const picked = shuffled.slice(0,50);

  const levels = [];
  let idx = 0;
  for(let l=0;l<10;l++){
    const exs=[];
    for(let x=0;x<5;x++){
      const [word, question, answer, sound, img] = picked[idx++];
      const distractors = makeDistractors(answer, sound);
      exs.push({
        type:"fill",
        word, question, answer, sound, img,
        options: shuffle([answer, ...distractors]).slice(0,3)
      });
    }
    levels.push({exercises:exs});
  }
  return levels;
}

function makeDistractors(answer, sound){
  // crea 3 alternativas plausibles
  const pool = new Set(SOUND_BANK);
  pool.delete(sound);
  const arr = Array.from(pool).slice(0,3);
  // casos ortográficos particulares
  if(answer==="ur"){arr[0]="on"}
  if(answer==="u"){arr[1]="in"}
  if(answer==="ing"){arr[2]="on"}
  return arr;
}

function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a }

/**********************
 * STATE
 **********************/
const state = loadState() || {
  currentLevel:0,
  currentExercise:0,
  coins:0,
  avatarId:"girl",
  avatars:AVATARS,
  errorHistory:[], // {word, sound, correct, chosen, time}
  levels: generateLevels(),
  mode:"game" // 'game' | 'test'
};

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return null;
  try{ 
    const s = JSON.parse(raw);
    // merge con posibles nuevos
