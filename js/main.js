// js/main.js

// ELIMINAR: import { allAvailableQuestions } from './questions.js';
import { shuffleArray, showMessageBox, hideMessageBox } from './helpers.js';
import {
    updatePrizeLadder,
    generatePrizeLadder,
    loadQuestion,
    markAnswer,
    askPlayerName
} from './ui.js';

// Lifelines
import { apply5050, applyCall, applyAudience } from './lifelines.js';

const QUESTIONS_PER_GAME = 12;
const MAX_GAMES = 5;
const difficultyMap = {
    1: 'easy',
    2: 'medium',
    3: 'hard',
    4: 'very-hard',
    5: 'expert'
};

let playerName = "Jugador";
let hasPlayerNameBeenSet = false;
let questions = []; // Esto ahora se poblará dinámicamente
let currentQuestionIndex = 0;
let score = 0;
let gamesPlayedCount = 0;
let playedIndices = new Set();
let gameStarted = false;
let used5050 = false;
let usedCall = false;
let usedAudience = false;

const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const nextButton = document.getElementById('nextQuestionButton');
const restartButton = document.getElementById('restartGameButton');
const startButton = document.getElementById('startGameButton');
const prizeLadderElement = document.getElementById('prizeLadder');
const gameLogoImage = document.getElementById('gameLogoImage');
const lifeline5050Button = document.getElementById('lifeline5050'); // Añadido
const lifelineCallButton = document.getElementById('lifelineCall');   // Añadido
const lifelineAudienceButton = document.getElementById('lifelineAudience'); // Añadido

// Event Listeners para las Líneas de Vida
lifeline5050Button.onclick = () => {
    if (!gameStarted || used5050) return;
    apply5050(optionsGrid.querySelectorAll('.option-button'), questions[currentQuestionIndex].correct);
    used5050 = true;
    lifeline5050Button.disabled = true;
};

lifelineCallButton.onclick = () => {
    if (!gameStarted || usedCall) return;
    applyCall(questions[currentQuestionIndex]);
    usedCall = true;
    lifelineCallButton.disabled = true;
};

lifelineAudienceButton.onclick = () => {
    if (!gameStarted || usedAudience) return;
    applyAudience(questions[currentQuestionIndex]);
    usedAudience = true;
    lifelineAudienceButton.disabled = true;
};

// Botones de Control
startButton.onclick = startGame;
nextButton.onclick = nextQuestion;
restartButton.onclick = resetAll;

function startGame() {
    askPlayerName((name) => {
        playerName = name;
        hasPlayerNameBeenSet = true;
        updateLogo();
        // Obtener preguntas aquí, antes de comenzar la ronda
        fetchQuestionsAndStartRound();
    });
}

async function fetchQuestionsAndStartRound() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionsUrl = urlParams.get('preguntas');

    if (questionsUrl) {
        try {
            showMessageBox("Cargando preguntas...", "Por favor espera mientras cargamos las preguntas desde la URL proporcionada.", []);
            const response = await fetch(questionsUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            questions = await response.json();
            hideMessageBox(); // Ocultar mensaje de carga
            startRound();
        } catch (error) {
            console.error("Error cargando preguntas desde la URL:", error);
            showMessageBox("Error", "No se pudieron cargar las preguntas desde la URL. Asegúrate de que la URL sea correcta y el archivo JSON esté bien formado.", [
                { text: "Reintentar", className: "confirm", onClick: startGame },
                { text: "Cancelar", className: "cancel", onClick: () => { /* Manejar cancelación, quizás volver al estado inicial */ } }
            ]);
        }
    } else {
        // Mecanismo de respaldo si no se proporciona una URL. Podrías usar un conjunto predeterminado o un mensaje de error.
        showMessageBox("Error", "No se ha proporcionado una URL para las preguntas. Por favor, usa el formato: ?preguntas=URL_DEL_GIST.JSON", [
            { text: "Entendido", className: "confirm", onClick: () => { /* Quizás volver al estado inicial o mostrar preguntas por defecto */ } }
        ]);
        // Como medida temporal para el desarrollo, puedes reintroducir allAvailableQuestions aquí
        // questions = allAvailableQuestions;
        // startRound(); // Descomenta esto si quieres usar questions.js local como respaldo
    }
}


function startRound() {
    gameStarted = true;
    currentQuestionIndex = 0;
    score = 0;
    used5050 = false;
    usedCall = false;
    usedAudience = false;
    gamesPlayedCount++;

    // Restablecer el estado de los botones de línea de vida
    lifeline5050Button.disabled = false;
    lifelineCallButton.disabled = false;
    lifelineAudienceButton.disabled = false;

    shuffleArray(questions);
    generatePrizeLadder(prizeLadderElement);
    updatePrizeLadder(score, QUESTIONS_PER_GAME, prizeLadderElement);
    loadCurrentQuestion();

    startButton.style.display = 'none';
    restartButton.style.display = 'block';
    nextButton.style.display = 'none';
    gameLogoImage.style.display = "none";
}

function loadCurrentQuestion() {
    const question = questions[currentQuestionIndex];
    loadQuestion(question, currentQuestionIndex, optionsGrid, questionText, (selectedOption) => {
        handleAnswer(question, selectedOption);
    });
    updatePrizeLadder(score, QUESTIONS_PER_GAME, prizeLadderElement);
}

function handleAnswer(q, selectedOption) {
    const optionButtons = optionsGrid.querySelectorAll('.option-button');
    markAnswer(optionButtons, q.correct, selectedOption);

    if (selectedOption === q.correct) {
        score++;
        showMessageBox("¡Correcto!", "¡Muy bien! Has acertado la pregunta.", [
            { text: "Siguiente", className: "confirm", onClick: nextQuestion }
        ]);
    } else {
        showMessageBox("¡Incorrecto!", `La correcta era: ${q.correct}) ${q.options[q.correct]}`, [
            { text: "Terminar", className: "cancel", onClick: () => endGame(false) }
        ]);
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < QUESTIONS_PER_GAME) {
        loadCurrentQuestion();
    } else {
        endGame(true);
    }
}

function endGame(won) {
    const message = won
        ? `¡Felicidades, ${playerName}! Has ganado el juego con ${score} puntos.`
        : `¡Fin del juego! Tu puntuación fue: ${score}.`;

    showMessageBox(won ? "¡Ganaste!" : "Game Over", message, [
        { text: "Reiniciar", className: "confirm", onClick: startRound }
    ]);
}

function resetAll() {
    playedIndices.clear();
    gamesPlayedCount = 0;
    hasPlayerNameBeenSet = false;
    gameLogoImage.style.display = "block";
    startGame();
}

function updateLogo() {
    gameLogoImage.src = `https://placehold.co/300x100/000000/00FF00?text=${encodeURIComponent(playerName)}`;
    gameLogoImage.alt = `Nombre del jugador: ${playerName}`;
}

// Configuración inicial
document.addEventListener('DOMContentLoaded', () => {
    generatePrizeLadder(prizeLadderElement); // Generar una vez al cargar
    if (!hasPlayerNameBeenSet) {
        startGame();
    }
});