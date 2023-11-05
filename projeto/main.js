let endGame = false
let gameStarted = false

const settings = Object.freeze({
  wordsCount: 60
})

async function acquireWords() {
  let request = await fetch("input/lorem.txt")
  let text = await request.text()
  return text.trim().split(/\s+/img)
}

function getRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)].trim()
}

function getRandomParagraph(words) {
  const randomWordsArray = []
  let counter = settings.wordsCount
  while (counter--)
    randomWordsArray.push(getRandomWord(words).trim())
  return randomWordsArray
}

function createDomWord(word) {
  const letters = word.split("")
  const div = document.createElement("div")
  letters.forEach(letter => {
    const span = document.createElement("span")
    span.innerText = letter
    div.append(span)
  })
  return div
}

function createSpace() {
  const span = document.createElement("span")
  const spanSpace = document.createElement("span")
  spanSpace.innerHTML = "&nbsp;"
  span.append(spanSpace)
  return span
}

function createDomParagraph(paragraph) {
  const p = document.createElement("p")
  paragraph.map((word, x, y) => {
    p.append(createDomWord(word))
    if (x + 1 != y.length)
      p.append(createSpace())
  })
  return p
}

function checkLetter(letter, domLetter) {
  window.dispatchEvent(new CustomEvent("letter"))
  if (letter.trim() == domLetter.innerText.trim()) {
    domLetter.classList.add("correct")
    window.dispatchEvent(new CustomEvent("correctletter"))
    return
  }
  domLetter.classList.add("wrong")
  window.dispatchEvent(new CustomEvent("wrongletter"))
}

function checkWord(word, domWord) {
  window.dispatchEvent(new CustomEvent("word"))
  if (word.trim() == domWord.innerText.trim()) {
    domWord.classList.add("correct")
    window.dispatchEvent(new CustomEvent("correctword"))
    return
  }
  domWord.classList.add("wrong")
  window.dispatchEvent(new CustomEvent("wrongword"))
}

function gameRules(paragraph) {
  let currentWord = paragraph.querySelector(":first-child")
  let currentLetter = currentWord.querySelector(":first-child")
  let typedWord = ""
  currentWord.classList.add("current")
  currentLetter.classList.add("current")

  window.addEventListener("keydown", ev => {
    ev.preventDefault()
    ev.stopPropagation()
    ev.stopImmediatePropagation()
    
    if (endGame)
      return

    if (!gameStarted) {
      gameStarted = true
      window.dispatchEvent(new CustomEvent("gamestarted"))
    }

    if (ev.key == "Backspace") {
      const back = currentLetter.previousElementSibling

      if (!back)
        return
        
      currentLetter.classList.remove("current")
      back.classList.add("current")
      back.classList.remove("wrong")
      back.classList.remove("correct")
      currentLetter = back
    }

    // ignore all special keys
    if (ev.key.length >= 2)
      return

    typedWord += ev.key
    checkLetter(ev.key, currentLetter)
    currentLetter.classList.remove("current")
    currentLetter = currentLetter.nextElementSibling

    if (!currentLetter) {
      checkWord(typedWord, currentWord)
      typedWord = ""
      currentWord.classList.remove("current")
      currentWord = currentWord.nextElementSibling

      if (!currentWord) {
        endGame = true
        window.dispatchEvent(new CustomEvent("endgame"))
        return
      }

      currentWord.classList.add("current")
      currentLetter = currentWord.querySelector(":first-child")
    }

    currentLetter.classList.add("current")
  })
}

void async function () {
  const words = await acquireWords()
  const randomParagraph = getRandomParagraph(words)
  const domParagraph = createDomParagraph(randomParagraph)
  const domTextPlace = document.querySelector("main div.text")
  if (!domTextPlace)
    throw new Error("[DOM HTML MISSING]: Element `main div.text` not found in index.html")
  domTextPlace.append(domParagraph)
  gameRules(domParagraph)
}();
