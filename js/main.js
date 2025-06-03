// js/main.js

// ELIMINAR: import { allAvailableQuestions } from './questions.js'; // Esta línea ya no es necesaria si las preguntas se cargan desde URL
import { shuffleArray, showMessageBox, hideMessageBox } from './helpers.js';
import {
    updatePrizeLadder,
    generatePrizeLadder,
    loadQuestion,
    markAnswer,
    askPlayerName // Asegúrate de que askPlayerName esté importado
} from './ui.js';

// Lifelines
import { apply5050, applyCall, applyAudience } from './lifelines.js';

const QUESTIONS_PER_GAME = 12;
const MAX_GAMES = 5; // Límite de partidas que se pueden jugar
const difficultyMap = {
    1: 'easy',
    2: 'medium',
    3: 'hard',
    4: 'very-hard',
    5: 'expert'
};

// Variables de estado del juego
let playerName = "Jugador"; // Nombre del jugador, por defecto "Jugador"
let hasPlayerNameBeenSet = false; // Bandera para saber si el nombre ya fue introducido
let allQuestions = []; // Almacenará todas las preguntas cargadas dinámicamente
let currentQuestions = []; // Preguntas seleccionadas para la partida actual
let currentQuestionIndex = 0;
let score = 0;
let gamesPlayedCount = 0; // Contador de partidas jugadas
let playedIndices = new Set(); // Para llevar un registro de las preguntas ya usadas
let gameStarted = false; // Bandera para saber si el juego está en curso

// Variables de ayudas
let used5050 = false;
let usedCall = false;
let usedAudience = false;

// Referencias a elementos del DOM
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const nextButton = document.getElementById('nextQuestionButton');
const restartButton = document.getElementById('restartGameButton');
const startButton = document.getElementById('startGameButton');
const prizeLadderElement = document.getElementById('prizeLadder');
const gameLogoImage = document.getElementById('gameLogoImage'); // Referencia a la imagen del logo

// Lifelines buttons
const lifeline5050Button = document.getElementById('lifeline5050');
const lifelineCallButton = document.getElementById('lifelineCall');
const lifelineAudienceButton = document.getElementById('lifelineAudience');

// --- Funciones de Lógica del Juego ---

/**
 * Inicia el proceso del juego, incluyendo la solicitud del nombre del jugador.
 */
function startGame() {
    // Si el nombre del jugador no ha sido establecido, pedimos el nombre primero
    if (!hasPlayerNameBeenSet) {
        askPlayerName((name) => {
            playerName = name; // Almacena el nombre del jugador
            hasPlayerNameBeenSet = true; // Marca que el nombre ya se estableció
            updateLogo(); // Actualiza el logo con el nombre
            // Una vez que tenemos el nombre, procedemos con el inicio de la ronda
            fetchQuestionsAndStartRound();
        });
    } else {
        // Si el nombre ya está establecido (ej. después de un reinicio suave),
        // simplemente inicia la ronda de preguntas.
        fetchQuestionsAndStartRound();
    }
}

/**
 * Carga las preguntas desde la URL del Gist (o las predeterminadas si no se proporciona URL).
 * Luego inicia la ronda de juego.
 */
async function fetchQuestionsAndStartRound() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionsUrl = urlParams.get('preguntas'); // Obtiene la URL de las preguntas del parámetro

    if (questionsUrl) {
        try {
            const response = await fetch(questionsUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allQuestions = await response.json();
            if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
                throw new Error("El archivo JSON de preguntas no es un array válido o está vacío.");
            }
            console.log("Preguntas cargadas desde URL:", allQuestions.length);
            startRound();
        } catch (error) {
            console.error("Error al cargar las preguntas desde la URL:", error);
            showMessageBox(
                "Error de Carga",
                `No se pudieron cargar las preguntas desde la URL proporcionada. Mensaje: ${error.message}. Por favor, verifica el formato JSON y la URL.`,
                [{ text: "Entendido", className: "confirm", onClick: () => { /* no-op */ } }]
            );
            // Opcional: Podrías cargar un set de preguntas predeterminadas aquí si existe un fallback local
            // import { allAvailableQuestions } from './questions.js';
            // allQuestions = allAvailableQuestions;
            // startRound();
        }
    } else {
        // Si no hay URL, usa las preguntas locales (si las tienes) o muestra un mensaje.
        // Asegúrate de importar allAvailableQuestions de './questions.js' si vas a usar esto.
        // import { allAvailableQuestions } from './questions.js';
        // allQuestions = allAvailableQuestions;
        // console.warn("No se proporcionó URL de preguntas. Usando preguntas predeterminadas (si existen).");
        // startRound();

        showMessageBox(
            "Sin Preguntas",
            "No se ha proporcionado una URL para las preguntas. Por favor, añade '?preguntas=TU_URL_DEL_GIST_RAW_JSON' a la URL.",
            [{ text: "Ok", className: "confirm", onClick: () => { /* no-op */ } }]
        );
    }
}


/**
 * Inicia una nueva ronda de juego (selección y preparación de preguntas).
 */
function startRound() {
    if (gamesPlayedCount >= MAX_GAMES) {
        showMessageBox("Límite de Partidas", "Has jugado el número máximo de partidas. ¡Gracias por jugar!", [{ text: "Ok", className: "confirm", onClick: () => { /* no-op */ } }]);
        return;
    }

    if (allQuestions.length === 0) {
        showMessageBox("Error", "No hay preguntas disponibles para iniciar el juego. Asegúrate de que las preguntas se cargaron correctamente.", [{ text: "Ok", className: "confirm" }]);
        return;
    }

    // Reiniciar estado para la nueva ronda
    currentQuestionIndex = 0;
    score = 0;
    used5050 = false;
    usedCall = false;
    usedAudience = false;
    gameStarted = true;
    gamesPlayedCount++; // Incrementar contador de partidas jugadas

    // Habilitar ayudas al inicio de cada ronda
    lifeline5050Button.disabled = false;
    lifelineCallButton.disabled = false;
    lifelineAudienceButton.disabled = false;
    lifeline5050Button.classList.remove('used');
    lifelineCallButton.classList.remove('used');
    lifelineAudienceButton.classList.remove('used');

    // Seleccionar preguntas para la nueva ronda
    selectRandomQuestions();
    shuffleArray(currentQuestions); // Mezclar las preguntas seleccionadas
    playedIndices.clear(); // Limpiar preguntas jugadas si es una nueva ronda completa

    // Actualizar interfaz
    nextButton.style.display = 'none';
    restartButton.style.display = 'none';
    startButton.style.display = 'none'; // Ocultar botón de inicio si ya se empezó
    generatePrizeLadder(prizeLadderElement); // Regenerar la escalera (por si acaso)
    updatePrizeLadder(score, QUESTIONS_PER_GAME, prizeLadderElement); // Iluminar el primer nivel

    loadCurrentQuestion();
}

/**
 * Selecciona un conjunto aleatorio de preguntas de diferentes dificultades.
 */
function selectRandomQuestions() {
    currentQuestions = [];
    const questionsByDifficulty = {};

    // Agrupar preguntas por dificultad
    allQuestions.forEach(q => {
        if (!questionsByDifficulty[q.difficulty]) {
            questionsByDifficulty[q.difficulty] = [];
        }
        questionsByDifficulty[q.difficulty].push(q);
    });

    // Definir cuántas preguntas de cada dificultad queremos
    const difficultyCounts = {
        'easy': 3,
        'medium': 3,
        'hard': 3,
        'very-hard': 2,
        'expert': 1
    };

    for (const difficulty in difficultyCounts) {
        const count = difficultyCounts[difficulty];
        const available = questionsByDifficulty[difficulty] || [];

        if (available.length < count) {
            console.warn(`No hay suficientes preguntas de dificultad '${difficulty}'. Disponibles: ${available.length}, Requeridas: ${count}.`);
            // Tomar todas las disponibles si no hay suficientes
            currentQuestions.push(...available);
        } else {
            // Seleccionar aleatoriamente 'count' preguntas de esta dificultad
            const shuffled = [...available];
            shuffleArray(shuffled);
            currentQuestions.push(...shuffled.slice(0, count));
        }
    }
    shuffleArray(currentQuestions); // Mezclar todas las preguntas seleccionadas
}


/**
 * Carga la pregunta actual en la interfaz de usuario.
 */
function loadCurrentQuestion() {
    if (currentQuestionIndex < currentQuestions.length) {
        const question = currentQuestions[currentQuestionIndex];
        // Reinicia el estado visual de los botones de opción (clases, disabled, etc.)
        optionsGrid.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            btn.style.display = 'block'; // Asegura que estén visibles
            btn.disabled = false; // Habilita los botones
        });

        loadQuestion(question, currentQuestionIndex, optionsGrid, questionText, handleAnswer);
        nextButton.style.display = 'none'; // Ocultar el botón "Siguiente" hasta que se responda
    } else {
        endGame(true); // Todas las preguntas respondidas, el jugador ganó
    }
}

/**
 * Maneja la respuesta seleccionada por el jugador.
 * @param {string} selectedOption - La opción seleccionada por el jugador (A, B, C, D).
 */
function handleAnswer(selectedOption) {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const optionButtons = optionsGrid.querySelectorAll('.option-button');

    markAnswer(optionButtons, currentQuestion.correct, selectedOption);

    if (selectedOption === currentQuestion.correct) {
        score++;
        updatePrizeLadder(score, QUESTIONS_PER_GAME, prizeLadderElement);
        // AÑADIDO: Incluir playerName en el mensaje de acierto
        showMessageBox("¡Correcto!", `¡Muy bien, ${playerName}! Has acertado la pregunta.`, [
            { text: "Siguiente", className: "confirm", onClick: nextQuestion }
        ]);
    } else {
        // AÑADIDO: Incluir playerName en el mensaje de error
        showMessageBox("¡Incorrecto!", `Lo siento, ${playerName}. La correcta era: ${currentQuestion.correct}) ${currentQuestion.options[currentQuestion.correct]}`, [
            { text: "Terminar", className: "cancel", onClick: () => endGame(false) }
        ]);
    }
}

/**
 * Avanza a la siguiente pregunta.
 */
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < QUESTIONS_PER_GAME) { // Asegura que no se exceda el número de preguntas por juego
        loadCurrentQuestion();
    } else {
        endGame(true); // Todas las preguntas del juego respondidas correctamente
    }
}

/**
 * Finaliza el juego y muestra el mensaje apropiado.
 * @param {boolean} won - Indica si el jugador ganó el juego.
 */
function endGame(won) {
    gameStarted = false; // El juego ya no está en curso

    // Aquí ya se usaba playerName, se mantiene
    const message = won
        ? `¡Felicidades, ${playerName}! Has ganado el juego con ${score} puntos.`
        : `¡Fin del juego! Tu puntuación final fue: ${score}.`;

    showMessageBox(won ? "¡Ganaste!" : "Game Over", message, [
        { text: "Reiniciar", className: "confirm", onClick: resetAll } // Llama a resetAll para un reinicio completo
    ]);

    // Opcional: Mostrar los botones de control después de endGame si es necesario
    // nextButton.style.display = 'none';
    // restartButton.style.display = 'block';
}

/**
 * Reinicia completamente el juego, incluyendo el nombre del jugador.
 */
function resetAll() {
    playedIndices.clear(); // Limpia el registro de preguntas jugadas
    gamesPlayedCount = 0; // Reinicia el contador de partidas jugadas
    hasPlayerNameBeenSet = false; // Resetear la bandera para que pida el nombre de nuevo
    gameStarted = false; // Reiniciar el estado del juego
    score = 0; // Reiniciar puntuación
    currentQuestionIndex = 0; // Reiniciar índice de pregunta
    used5050 = false; // Resetear ayudas
    usedCall = false;
    usedAudience = false;

    // Mostrar el botón de empezar juego y ocultar otros
    startButton.style.display = 'block';
    nextButton.style.display = 'none';
    restartButton.style.display = 'none';

    // Reiniciar el logo a su estado inicial si no se quiere el nombre persistente
    gameLogoImage.src = `https://placehold.co/300x100/000000/00FF00?text=%C2%BFT%C3%BA%3F`;
    gameLogoImage.alt = "Imagen de billetes de dinero con el texto ¿Tú?";
    gameLogoImage.style.display = "block"; // Asegurar que el logo es visible

    generatePrizeLadder(prizeLadderElement); // Regenerar la escalera a su estado inicial
    updatePrizeLadder(score, QUESTIONS_PER_GAME, prizeLadderElement); // Actualizar escalera a 0

    // Limpiar texto de pregunta y opciones
    questionText.textContent = 'Presiona "Empezar Juego" para comenzar.';
    optionsGrid.innerHTML = '';

    // Llamar a startGame para iniciar el proceso de nuevo (pedirá el nombre)
    startGame();
}

/**
 * Actualiza la imagen del logo con el nombre del jugador.
 */
function updateLogo() {
    if (gameLogoImage) {
        // Usamos placehold.co para generar una imagen con el nombre del jugador.
        // encodeURIComponent asegura que los caracteres especiales en el nombre se manejen correctamente en la URL.
        gameLogoImage.src = `https://placehold.co/300x100/000000/00FF00?text=${encodeURIComponent(playerName)}`;
        gameLogoImage.alt = `Nombre del jugador: ${playerName}`;
        gameLogoImage.style.display = "block"; // Asegura que la imagen sea visible
    } else {
        console.error("Elemento gameLogoImage no encontrado en el DOM.");
    }
}

// --- Listeners de Eventos ---

// Cuando todo el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    generatePrizeLadder(prizeLadderElement); // Genera la escalera de premios al cargar la página

    // Si el jugador no ha configurado su nombre (primera vez que carga la página)
    if (!hasPlayerNameBeenSet) {
        startGame(); // Inicia el proceso de pedir el nombre
    }

    // Listener para el botón "Empezar Juego"
    if (startButton) {
        startButton.addEventListener('click', () => {
            if (!gameStarted) { // Solo si el juego no ha empezado (o si es un reinicio completo)
                startGame(); // Esto pedirá el nombre si no ha sido establecido y luego iniciará la ronda
            }
        });
    }

    // Listeners para los botones de las ayudas
    lifeline5050Button.addEventListener('click', () => {
        if (!used5050 && gameStarted && currentQuestions.length > 0) {
            apply5050(optionsGrid.querySelectorAll('.option-button'), currentQuestions[currentQuestionIndex].correct);
            used5050 = true;
            lifeline5050Button.disabled = true;
            lifeline5050Button.classList.add('used');
        }
    });

    lifelineCallButton.addEventListener('click', () => {
        if (!usedCall && gameStarted && currentQuestions.length > 0) {
            applyCall(currentQuestions[currentQuestionIndex]);
            usedCall = true;
            lifelineCallButton.disabled = true;
            lifelineCallButton.classList.add('used');
        }
    });

    lifelineAudienceButton.addEventListener('click', () => {
        if (!usedAudience && gameStarted && currentQuestions.length > 0) {
            applyAudience(currentQuestions[currentQuestionIndex]);
            usedAudience = true;
            lifelineAudienceButton.disabled = true;
            lifelineAudienceButton.classList.add('used');
        }
    });

    // Listener para el botón "Reiniciar Juego" (solo visible al final de la partida)
    if (restartButton) {
        restartButton.addEventListener('click', resetAll);
    }
});