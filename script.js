
//---------------------------- Declarations -------------------------------
const infoBox = document.querySelector('p.info')
const submitButton = document.querySelector('button.submit-button')
const form = document.querySelector('form.user-setup')
const displaySection = document.querySelector('section.quiz-display')
const slider = document.querySelector('div.slider')
const prevTag = document.querySelector('a.previous')
const nextTag = document.querySelector('a.next')

//trivia database consts
const requestTokenURL = "https://opentdb.com/api_token.php?command=request";
let token = ''
let params = {}
let difficulties = {
  1: 'easy',
  2: 'medium',
  3: 'hard',
  4: null
}
let quiz = []

//slider
let currentSlide = 0
let totalSlide = 0

//----------------------------- Functions ---------------------------------
//function to request session id from trivia database
const getSession = function() {
  fetch(requestTokenURL)
    .then(response => response.json())
    .then(data => {
      token = data.token
      infoBox.innerHTML = infoBox.innerHTML + `token = ${token}`
    });
};


//Sets user parameters
const setParams = function () {
  params = {
    rounds: document.getElementById('rounds').value,
    questions: document.getElementById('questions').value,
    difficulty: difficulties[document.getElementById('difficulty').value],
  }
  
  let cats = []
  document.querySelectorAll('div.mc-categories li input').forEach(item => {
    if (item.checked == true ) {
      cats.push([item.value, item.id])
    }
  })

  params['categories'] = cats
  console.log(params)
  getQuiz(params)
}


//Gets the quiz rounds
const getQuiz = function (params) {

  for (let i = 0; i < params.rounds; i++) {
    let category = params.categories[Math.floor(Math.random() * params.categories.length)][0]
    let difficulty = ''
    let round = i + 1
    
    if (params.difficulty !== null) {
      difficulty = `&difficulty=${params.difficulty}`
    } else {
      difficulty = ''
    }

    let query = `https://opentdb.com/api.php?amount=${params.questions}&category=${category}${difficulty}`
    console.log(query)
    fetch(query)
      .then(response => response.json())
      .then(data => {
        quiz.push(data.results)
      })
  }

  console.log(quiz)

  //switches display
  form.classList.add('hidden')
  displaySection.classList.remove('hidden')

  createQuiz(quiz)
}

const createQuiz = function (quiz) {
  //for each round
  console.log('create quiz run')
  
  for (let i = 0; i < quiz.length; i++) {
    
    console.log('looping')

    slider.innerHTML = slider.innerHTML + `
      <div class='card'>
        <h1>Round ${i + 1}</h1>
        <h2>${quiz[i][0].category}</h2>
      </div>
    `
    totalSlide += 1

    quiz[i].forEach((question, n) => {
      slider.innerHTML = slider.innerHTML + `
      <div class='card'>
        <h2>Question ${n + 1}</h2>
        <h2>${quiz[i][n].question}</h2>
      </div>
    `
    totalSlide += 1
    })
  }
}

// slider controls
const next = function () {
  currentSlide = currentSlide + 1
  if (currentSlide >= totalSlide) {
    currentSlide = 0
  }
  moveSlider()
}

const previous = function () {
  currentSlide = currentSlide - 1
  if (currentSlide < 0) {
    currentSlide = totalSlide - 1
  }
  moveSlider()
}

const moveSlider = function () {
  slider.style.transform = `translate(${currentSlide * -100}vw, 0)`
}

//-------------------------------- Calls -----------------------------------
//this is in an if statement to prepare for when i save the session token locally
if (token === '') {
  getSession()
}


//---------------------------- Event Listeners -------------------------------

nextTag.addEventListener("click", function () {
  next()
})

prevTag.addEventListener("click", function () {
  previous()
})


