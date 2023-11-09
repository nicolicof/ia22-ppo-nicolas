const cssFile = document.createElement("link")
cssFile.rel = "stylesheet"
cssFile.href = "plugins/style.css"
document.head.appendChild(cssFile)
endGame = true

function createEl(tag, _class, _parent) {
  const el = document.createElement(tag)
  el.className = _class
  document.querySelector(_parent).appendChild(el);
  return el
}

// Criação das barras
const barDiv = createEl('div', 'divBar', 'main'),
  barLife = createEl('div', 'barLife bar', '.divBar'),
  barDeath = createEl('div', 'barDeath bar', '.divBar')

// Criação do cronometro
const timer = createEl('div', 'timer', 'main')
timer.innerText = "--:--"

let timeIsRunning = false, timeIsEnd = 0, intervalId

function startTime() {
  let tempo = 99

  function updateTime() {
    if (tempo > 0) {
      tempo--
      showTime()
    } else showRestartScreen()
  }

  function showTime() { timer.innerText = `00:${tempo.toString().padStart(2, '0')}` }

  function init() {
    if (!timeIsRunning) {
      timeIsRunning = true
      showTime()
      intervalId = setInterval(updateTime, 1000)
    }
  } init()
} window.addEventListener('gamestarted', startTime)

// criação dos elementos da tela inicial
const start = createEl('div', 'start', 'body')
const startBtn = createEl('button', 'stBtn', '.start')
const rules = createEl('p', 'rules', '.start')
rules.innerHTML = "<span id='title'>REGRAS</span><br>tempo acabou --------> PERDEU<br>100 letras erradas --> PERDEU<br>200 letras corretas -> GANHOU"

startBtn.addEventListener('click', () => { // remove a tela inicial
  start.style.display = 'none'
  endGame = false
})

let life = 0, death = 0 // contadores de erros e acertos
window.addEventListener("correctletter", () => {
  life++
  barLife.style.boxShadow = `inset 0 -${(life)}px 0 green`
  death--
  if (life >= 200) { const winScreen = creatoScreen('win', 'VOCÊ GANHOU') }
}); window.addEventListener("wrongletter", () => {
  death++
  barDeath.style.boxShadow = `inset 0 -${(death)}px 0 red`
  if (death >= 100) { const endScreen = creatoScreen('end', 'VOCÊ PERDEU') }
})

// TODO: adicionar sistema de dificuldade, cores melhores, adicionar mais estética
// songs: ambient, error, correct, win and end.

function creatoScreen(class_, text) {
  const el = createEl('div', class_, 'body')
  const txt = createEl('h2', 'titleScreen', `.${class_}`)
  const button = createEl('button', null, `.${class_}`).addEventListener('click', () => window.location.reload(true))
  endGame = true
  txt.innerText = text
  el.display = 'grid'
  return el
}
