let questions = null;
let currentQuestionIndex = 0;
let answered = false;
let score = 0;
const questionText = document.getElementById("questionText");
const options = document.getElementById("options");
const questionIndex = document.getElementById("questionIndex");
const numberOfQuestions = document.getElementById("numberOfQuestions");
const progressBar = document.querySelector(".progress-bar");
const indexToLetterMap = ["A","B","C","D"];    

function fetchTrivia(link) {
    fetch(link)
        .then((response) => response.json())
        .then((data) => {
            if(data.results) {
            questions = data.results.map((result)=>{ 
                    return {
                        text: decodeURI(result.question),
                        options: [
                            {
                                text: result.correct_answer,
                                isCorrect: true
                            },
                            
                        ].concat(result.incorrect_answers.map((incorrectAnswer)=>{
                            return {
                                text: incorrectAnswer,
                                isCorrect: false
                            }
                        }))
                    }
            });

            progressBar.style.width = `${((currentQuestionIndex+1) / questions.length) * 100}%`;
            numberOfQuestions.textContent = questions.length;
            renderQuestion();
            }
        });
    }
function renderQuestion() {
    document.querySelector("#loading").style.display = "none";
    questionIndex.textContent = currentQuestionIndex+1;
    questionText.innerHTML = questions[currentQuestionIndex].text;

    options.innerHTML = questions[currentQuestionIndex].options
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .map((currentOption, index)=> {
        return `<button class="option ${currentOption.isCorrect ? "option-correct" : ""} " onClick="answer(${currentOption.isCorrect}, event)">
        <p>${indexToLetterMap[index]}</p><p>${currentOption.text}</p>
        </button>`
    })
    .join("");
}

function answer(isCorrect, event) {
    if(answered) {
        return;
    }
    answered = true;
    options.style.pointerEvents = "none";
    event.currentTarget.style.color = "white"; 
    document.querySelector(".option-correct").style.backgroundColor = "#BCEAD5"; 
    if (isCorrect) {
        score++;
    } else {
        event.currentTarget.style.backgroundColor = "#E97777"; 
    }
    window.setTimeout(()=> {
        answered = false;
        options.style.pointerEvents = "initial";
        if (currentQuestionIndex === questions.length-1) {
            document.querySelector("#score").style.display = "flex";
            document.querySelector("#scoreValue").textContent = `${score} / ${questions.length} points`;
            document.querySelector(".jumbotron").style.display = "none";
        } else {
            currentQuestionIndex++;
            renderQuestion();
            progressBar.style.width = `${((currentQuestionIndex+1) / questions.length) * 100}%`;
        }
    }, 1500);
}