let currentQuestionId = 1;
let score = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();

    document.getElementById("submit-answer").addEventListener("click", function() {
        checkAnswer();
    });
});

function loadQuestion() {
    fetch(`/api/question/${currentQuestionId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.question) {
                displayScore();
                return;
            }

            const questionContainer = document.getElementById('question');
            const optionsContainer = document.getElementById('options');
            
            questionContainer.textContent = data.question.question;
            optionsContainer.innerHTML = ''; 

            data.options.forEach(option => {
                const optionLabel = document.createElement('label');
                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.name = 'option';
                optionInput.value = option.id;
                
                optionLabel.appendChild(optionInput);
                optionLabel.appendChild(document.createTextNode(option.option));
                
                optionsContainer.appendChild(optionLabel);
                optionsContainer.appendChild(document.createElement('br'));
            });
        });
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked').value;
    
    fetch(`/api/check-answer/${currentQuestionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selectedOption })
    })
    .then(response => response.json())
    .then(data => {
        if (data.isCorrect) {
            score++;
            alert("Correct!");
        } else {
            alert("Wrong answer.");
        }
        currentQuestionId++;
        loadQuestion();
    });
}

function displayScore() {
    const mainContainer = document.getElementById('main');
    mainContainer.innerHTML = `Your score is: ${score}`;
}
