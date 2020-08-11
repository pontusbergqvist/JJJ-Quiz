import Questions from './questions.js';

const Quiz = (_ => {
  
  // Cache DOM
  
  const $quizHead = document.querySelector(".quiz__head");
  const $answerContainer = document.querySelector(".body__answer-container");
  const $answer = document.getElementsByClassName("body__answer");
  const $footer = document.querySelector(".quiz__footer");
  const $footerChildren = document.getElementsByClassName("footer--button");
  const $headList = document.querySelector(".quiz__head").children
  const $body = document.querySelector(".quiz");
  const $error = $footer
  let $progressBar; 

  // Render HTML

  // Render Quiz screen
  const resetContent = _ => {
    $quizHead.innerHTML = "";
    $answerContainer.innerHTML = "";
    $footer.innerHTML = "";
    $body.innerHTML = "";
  }

  const render = _ => {
    console.log($error)
    let headMarkup = "";
    let bodyMarkup = "";
    let footerMarkup = "";
    headMarkup += `
    <h1 class="head__question-heading">${Questions[currentIndex].question}</h1>
    <p class="head__question-of">${currentIndex + 1} of ${Questions.length}</p>
    <div class="head__question-progress">
    <div class="question__inner"></div>
    </div>
    <p class="body--action">Pick an option below</p>`
    for (let i = 0; i < answerList.length; i++) {
      bodyMarkup += `
      <li class="body__answer">${Questions[currentIndex].answers[i]}</li></label>
      `
    }
    footerMarkup += `
    <button class="footer--button footer__restart">Restart</button>
    <button class="footer--button footer__next">Next</button>
    <p class="footer__error">You forgot to choose your answer!</p>`
    
    $quizHead.innerHTML = headMarkup;
    $answerContainer.innerHTML = bodyMarkup;
    $footer.innerHTML = footerMarkup;
    renderProgressBar();
  }

  // Render End screen with result
  const finalRender = _ => {
    resetContent();
    let markup = "";
    markup += `
    <div class="endscreen__container">
    <h1 class="endscreen__title">End of quiz! </h1>
    <h2 class="endscreen__scoretitle">Your score was:</h2>
    <p class="endscreen__score">${scoreCount} out of ${Questions.length}</p>
    <div class="endscreen__footer">
      <button class="endscreen__button endscreen__play">Play Again</button>
    </div>`
    $body.innerHTML = markup;
  }

  // Quiz variables
  
  let currentIndex = 0;
  let scoreCount = 0;
  let currentGuess = 0;
  let barWidth = 0;
  const lastQuestion = Questions[Questions.length - 1];
  const answerList = Questions[currentIndex].answers;

  // Quiz logic
  
  const init = _ => {
    resetContent();
    resetStats();
    render();
    listeners();
  }

  const initEndscreen = _ => {
    finalRender();
    endScreenListeners();
  }

  const resetStats = _ => {
    scoreCount = 0;
    currentIndex = 0;
    currentGuess = 0;
    barWidth = 0;
  }
  
  const checkAnswer = answer => {
    if (Questions[currentIndex].correctAnswer === currentGuess) {
      scoreCount++
    }
  };

  const nextTrigger = _ => {
    if (currentIndex === lastQuestion.index && answerExists()) {
    checkAnswer(currentGuess);
    initEndscreen();
    console.log($body.firstElementChild.children[4].firstElementChild)
    } else if (answerExists()){
    checkAnswer(currentGuess)
    currentIndex++;
    render();
    listeners();
    } else {
      $footer.lastChild.classList.add("show")
    }
  };

  const restartTrigger = _ => {
    init();
  };

  const progressWidth = _ => barWidth += 100 / Questions.length

  const renderProgressBar = _ => {
    for (let i = 0; i < $headList.length; i++) {
      if ($headList[i].classList.contains("head__question-progress")) {
        $progressBar = $headList[i].children[0];
        $progressBar.style.width = `${progressWidth()}%`;
      }
    }
  }

  const answerExists = _ => {
    for (let i = 0; i < $answer.length; i++) {
      if ($answer[i].classList.contains("selected")) {
        return true;
      }
    }
  }
  // Listeners

  const listeners = _ => {
    setButtonListeners()
    setAnswerListeners();
  }
    
  const setButtonListeners = _ => {
    for (let i = 0; i < $footerChildren.length; i++) {
      $footerChildren[i].addEventListener("click", event => {
        if ($footerChildren[i].innerHTML === "Next") {
          nextTrigger();
          currentGuess = 0;
        } else if ($footerChildren[i].innerHTML === "Restart") {
          restartTrigger();
        }
      })
    }
  }

  const setAnswerListeners = _ => {
    for (let i = 0; i < $answer.length; i++) {
      $answer[i].addEventListener("click", event => {
        for (let i = 0; i < $answer.length; i++) {
          if ($answer[i].classList.contains("selected")) {
            $answer[i].classList.remove("selected");
          }
        };
        currentGuess = Questions[currentIndex].answers.indexOf(event.target.innerHTML);
        event.target.classList.add("selected");
      })
    }
  }

  const endScreenListeners = _ => {
    $body.addEventListener("click", event => {
      if (event.target.classList.contains("endscreen__play")) {
        init()
      } 
    })
  }

  // Expose variables:
  
  return {
    init
  }
})();

export default Quiz;