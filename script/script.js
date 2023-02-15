const play = document.getElementById("play");
const start = document.getElementById("start");
const levelButtons = document.querySelectorAll(".levelButton");
const stopButton =  document.getElementById("stop")
const again = document.getElementById("again");
const home = document.getElementById("home");

const startPage = document.getElementById("startPage");
const selectionPage = document.getElementById("selectionPage");
const instructionPage = document.getElementById("instructionPage");
const gamePage = document.getElementById("gamePage");
const popUp = document.getElementById("popUp");
const finalPage = document.getElementById("finalPage");

const clickSound = document.getElementById("click")
const clap = document.getElementById("clap")
const completed = document.getElementById("correct")
const wrong = document.getElementById("wrong")
const lose = document.getElementById("lose")

const scoreCount = document.getElementById("score-count")
const questionCount = document.getElementById("question-count")
const colorAnswer = document.getElementById("colorAnswer")
const gameContainer =  document.getElementById("gameContainer")
const mark = document.getElementById("mark")
const checkAnswer = document.getElementById("checkAnswer")
const showAnswer = document.getElementById("showAnswer")
const correctAnswer = document.getElementById("correctAnswer")
const medal = document.getElementById("medal")
const words1 = document.getElementById("words1")
const words2 = document.getElementById("words2")
const scoreText = document.getElementById("scoreText")

let colors = [{name:"Blue", color:"blue"},
              {name:"Red", color:"red"},
              {name:"Green", color:"green"},
              {name:"Yellow", color:"yellow"},
              {name:"Pink", color:"pink"},
              {name:"Purple", color:"purple"}]

let tempoSetting = {};

//object that stores values pf minimum and maximum angle for a value
var rotationValue = [{minDgree:0, maxDegree:30, name: "red"}]

let levelIndex;

const levels = [
    {numberOfColors:2, size:180, speed: 0.5},
    {numberOfColors:4, size:90, speed: 0.5},
    {numberOfColors:6, size:60, speed: 0.5}
]

//size of each piece
var data = []

var pieColor = []

let myChart;

let playerStop;

let rotationInterval

//100 rotations for animation and last rotation for result
let speed = 2
//start spinning
stopButton.addEventListener("click", () => {
    stopButton.disabled = true;
    playerStop = true;
})

let current;
let addscore = 1
let total = 5;
let score;

let tempoArray = [];

let answer = {}

//here is finalV2
const group1 = document.querySelector(".group1");

play.addEventListener("click", () => {
    playClickSound()
    setTimeout(() => {
        startPage.classList.add("hide")
        selectionPage.classList.remove("hide")
    }, 200);
})

levelButtons.forEach(function(level){
    level.addEventListener('click', () => {
        playClickSound()
        setTimeout(() => {
            levelIndex = level.getAttribute("data-level") - 1
            selectionPage.classList.add("hide")
            instructionPage.classList.remove("hide")
        }, 200);
    })    
})

start.addEventListener("click", () => {
    playClickSound()
    setTimeout(() => {
        instructionPage.classList.add("hide")
        gamePage.classList.remove("hide")
        ready()
        Question()
    }, 200);
})

again.addEventListener("click", () => {
  playClickSound()
  //controls amd buttons visibility
  let delay = setTimeout(() => {
    startPage.classList.remove("hide");
    finalPage.classList.add("hide")
  }, 200);
});

home.addEventListener("click", () => {
  playClickSound()
  let delay = setTimeout(() => {
    location.assign('https://gimme.sg/activations/minigames/main.html');
  }, 200);
})


function ready(){
    //code here to get UI ready 
    //like number of point to zero and others
    current = 0;
    questionCount.textContent = current + "/" + total

    score = 0;
    scoreCount.textContent = score
}

function resetArray(){
    tempoArray = []

    for(let i = 0; i < colors.length; i++){
        tempoArray.push(colors[i])
    }
}

function Question(){
    //game that starts the game like showing question and stuff
    current +=1;
    questionCount.textContent = current + "/" + total;

    resetArray()

    //randomise the color on the chart
    pieColor = []
    let pieName = []
    for(let i = 0; i < levels[levelIndex].numberOfColors; i++){
        let randomColor = Math.floor(Math.random() * tempoArray.length)
        pieName.push(tempoArray[randomColor].name)
        
        pieColor.push(tempoArray[randomColor].color)

        tempoArray.splice(randomColor,1)
    }

    //Select one color to be the correct answer;
    let correctIndex = Math.floor(Math.random() * pieName.length)
    answer.answer = pieName[correctIndex]
    answer.color = pieColor[correctIndex]
    
    console.log(pieColor)
    colorAnswer.innerHTML = `<p>${answer.answer}</p>`

    //change the size of the color on the chart
    data = []
    for(let i = 0; i < levels[levelIndex].numberOfColors; i++){
        data.push(levels[levelIndex].size)
    }

    //set Value for different angle
    rotationValue = []
    for(let i = 0; i < levels[levelIndex].numberOfColors; i++){
        tempoSetting = {};
        tempoSetting.minDgree = data[0] * i
        tempoSetting.maxDegree = data[0] * (i + 1)
        if(i > 0){
            tempoSetting.minDgree ++;
        }
        tempoSetting.name = pieName[i]
        rotationValue.push(tempoSetting)
    }

    console.log(rotationValue)
    console.log(pieColor)

    canvas = document.createElement('canvas')
    canvas.classList.add("wheel")
    gameContainer.appendChild(canvas)

    //reset to let user tap on button
    stopButton.disabled = false
    playerStop = false

    //create chart
    myChart = new Chart(canvas, {
        //Plugin for displaying text on the pie chart
        //plugins: [ChartDataLabels],
        //Chart type Pie
        type:"pie",
        data:{
            //Display labels
            //labels:pieName,
            datasets:[
                {
                    backgroundColor: pieColor,
                    data:data,
                },
            ],
        },
        options:{
            //responsive chart
            responsive: true,
            animation: { duration: 0 },
            plugins: {
                //hide tooltop and legend
                tooltip:false,
                legend:{
                    display: false,
                },
                //display labels inside pie chart
                /*datalabels:{
                    color:"#ffffff",
                    formatter: (_,context) =>
                    context.chart.data.labels[context.
                    dataIndex],
                    font:{size:24},
                },*/
            },
        },
    });

    //rotate chart
    speed = levels[levelIndex].speed
    rotationInterval = window.setInterval(() =>{
        //set rotation for piechart
        /*
        Make the piechart rotate faster we set speed
        so that it rotates a few degree at a time instead of 1.
        */
       myChart.options.rotation = myChart.options.
       rotation - speed;
       //update chart with new rotationValues
       myChart.update();
       if(myChart.options.rotation <= -360){
        myChart.options.rotation = 0;
       }
       else if(playerStop){
        valueGenerator(myChart.options.rotation * -1);
        clearInterval(rotationInterval);
       }
    })
}

//get value based on the randomAngle
const valueGenerator = (angleValue) => {
    console.log("d")
    for(let current of rotationValue){
        console.log(angleValue)
        console.log(current.minDgree, current.maxDegree)
        //if angleValue is between min and max
        if(angleValue >=current.minDgree && angleValue <=current.maxDegree){
            console.log(current.name)
            setTimeout(()=>{
                checkColor(current.name)
            },500)
            break
        }
    }
}

function checkColor(colorSelected){
    popUp.classList.remove("hide")
    if(colorSelected == answer.answer){
        mark.src = "./img/correct.png"
        checkAnswer.textContent = "Correct!"
        showAnswer.classList.add("hide")
        score +=1
        scoreCount.textContent = score;
    }
    else{
        mark.src = "./img/wrong.png"
        checkAnswer.textContent = "Good try!"
        showAnswer.classList.add("hide")
    }
    
    setTimeout(function(){
        popUp.classList.add("hide");
        canvas.remove();
        if(current == total){
            gamePage.classList.add("hide")
            endGame()
        }
        else{
            Question()
        }
    }, 3000)
}

function playClickSound(){
    console.log(clickSound)
    clickSound.currentTime = 0
    clickSound.play()
}

function endGame(){
    finalPage.classList.remove("hide")

    let pass = total / 2

    //this is for second version
    let starScore = total / 5;
    //change the star image according the score;
    if(score < pass){
        lose.currentTime = 0
        lose.play()
        if(score == starScore + starScore)
                medal.src = "./img/youTried.png"
            else if(score < starScore + starScore && score >= starScore) // score < 2 && score >= 1
                medal.src = "./img/youTried1.png"
            else
                medal.src = "./img/youTried2.png"
    
        group1.classList.add("group1V2")
        scoreText.textContent = "Good try!"
        scoreText.classList.add("scoreTextV2")
        words1.classList.add("words1V2")
        words2.classList.add("words2V2")
        words1.innerHTML = "Your score"
    }
    else{
        clap.currentTime = 0
        clap.play()
        if(score == total) // score = 5
            medal.src = "./img/excellent.png"
        else if(score < total && score >= total - starScore) // score < 5 && score >= 4
            medal.src = "./img/wellDone.png"
        else if(score < total - starScore && score >= (total - starScore - starScore)) // score < 4 && score >= 3
            medal.src = "./img/wellDone1.png"
    
        group1.classList.add("group1V2")
        words1.classList.add("words1V2")
        words2.classList.add("words2V2")
    
        scoreText.classList.add("scoreTextV2")
    
        if(score == total){
            scoreText.textContent = "Superstar!"
        }
        else if(score > pass){
            scoreText.textContent = "Well done!"
        }
        else{
            scoreText.textContent = "Good try!"
        }
    
        setTimeout(function(){
            confetti.start()
            setTimeout(function(){
                confetti.stop()
            }, 2000)
        }, 500)
    }
    words1.innerHTML = "Your score"
    words2.textContent = score + "/" + total
}

/*prevent double tag zoom*/
document.addEventListener('dblclick', function(event) {
    event.preventDefault();
    }, { passive: false });