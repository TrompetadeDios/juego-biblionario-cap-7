document.addEventListener('DOMContentLoaded', () => {

    const screens = {
        start: document.getElementById('start-screen'),
        rules: document.getElementById('rules-screen'),
        game: document.getElementById('game-screen'),
        win: document.getElementById('win-screen')
    };

    const gameSounds = {
        correct: new Audio('sounds/correct.mp3'),
        wrong: new Audio('sounds/wrong.mp3'),
        suspense: new Audio('sounds/suspense.mp3'),
        win: new Audio('sounds/win.mp3'),
        start: new Audio('sounds/start_game.mp3')
    };

    const allGameSoundFiles = Object.values(gameSounds);
    let audioUnlocked = false;


    const trackList = [
        'musica/pista-tecnologica-1.mp3',
    ];
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.4;
    }


    const buttons = {
        start: document.getElementById('start-btn'),
        showRules: document.getElementById('rules-btn'),
        backToStart: document.getElementById('back-to-start-btn'),
        startFromRules: document.getElementById('start-from-rules-btn'),
        reveal: document.getElementById('reveal-btn'),
        next: document.getElementById('next-btn'),
        hint: document.getElementById('wildcard-50-50'),
        audience: document.getElementById('wildcard-audience'),
        phone: document.getElementById('wildcard-call'),

        toggleRounds: document.getElementById('toggle-rounds-btn'),

        restartFail: document.getElementById('restart-fail-btn'),
        backToStartFail: document.getElementById('back-to-start-fail-btn'),
        restartWin: document.getElementById('restart-win-btn'),
        backToStartWin: document.getElementById('back-to-start-win-btn'),
    };

    const gameElements = {
        playerNameInput: document.getElementById('player-name'),
        question: document.getElementById('question'),
        answers: document.getElementById('answer-options'),
        roundsList: document.getElementById('rounds-list'),
        roundsContainer: document.getElementById('rounds-container'),
        audiencePoll: document.getElementById('audience-poll'),
        phoneTimer: document.getElementById('phone-timer'),
        timerDisplay: document.getElementById('timer-display'),
        finalScoreDisplay: document.getElementById('final-score-display'),
        winTitle: document.getElementById('win-title'),
        fireworksContainer: document.getElementById('fireworks-container'),
        rotatingCircle: document.getElementById('rotating-circle'),
        startScreenContent: document.querySelector('#start-screen .screen-content')
    };


    let phoneTimerInterval = null;
    let isPhoneUsed = false;
    let isAudienceUsed = false;
    let isHintUsed = false;
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let playerName = '';

    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 1: Banco completo de 60 preguntas
    // =========================================================
    const allAvailableQuestions = [
            // Pregunta 1 del capitulo 7
        {
            question: "¿Cuál es el significado del nombre de Benaía, según el texto?",
            answers: ["Yahweh es el guerrero", "Yahweh es el constructor", "El siervo leal", "El valiente de Israel"],
            correctAnswer: 1 // B. Yahweh es el constructor
        },
        // Pregunta 2
        {
            question: "¿Cuál fue el cargo inicial de Benaía durante el reinado del rey David?",
            answers: ["General del Ejército de Judá", "Jefe de los Cereteos y Peleteos", "Príncipe de la casa de Aarón", "Ministro de Adoración"],
            correctAnswer: 1 // B. Jefe de los Cereteos y Peleteos
        },
        // Pregunta 3
        {
            question: "Una de las proezas de Benaía que demostró valentía y lealtad en \"tiempos de frialdad\" fue:",
            answers: ["Matar a dos leones de Moab en una batalla campal.", "Matar al gigante egipcio y arrebatarle su lanza con un palo.", "Descender y matar a un león en medio de un foso mientras estaba nevando.", "Influenciar a 3,700 hombres para seguir a David."],
            correctAnswer: 2 // C. Descender y matar a un león en medio de un foso mientras estaba nevando.
        },
        // Pregunta 4
        {
            question: "¿Cuál es la lección que deja Benaía al enfrentar al gigante egipcio, a pesar de solo tener un palo?",
            answers: ["Esperar la orden del líder antes de actuar.", "Llorar y reclamar por no tener los recursos adecuados (la lanza).", "Los retos que Dios pone no son para que otro los venza por ti.", "Debe buscar a su padre Joiada para que pelee por él."],
            correctAnswer: 2 // C. Los retos que Dios pone no son para que otro los venza por ti.
        },
        // Pregunta 5
        {
            question: "¿Qué posición crucial le otorgó el Rey Salomón a Benaía, sucediendo a Joab?",
            answers: ["Jefe de los Treinta Valientes", "Jefe de la Tercera División del ejército", "Jefe del ejército", "Sacerdote del Templo"],
            correctAnswer: 2 // C. Jefe del ejército
        },
        // Pregunta 6
        {
            question: "Bajo el reinado de Salomón, Benaía pasó de ser guardaespaldas a \"exterminador\". ¿A cuáles de los siguientes enemigos del palacio ejecutó?",
            answers: ["Adonías, Joab y Simei", "Joab, Absalón y Adonías", "Natán, Abiatar y Simei", "Abner, Amasa y Joab"],
            correctAnswer: 0 // A. Adonías, Joab y Simei
        },
        // Pregunta 7
        {
            question: "Cuando Joab se refugió en el altar, la actitud de Benaía al ejecutar la orden del rey Salomón, a pesar de haber sido compañeros, demuestra que:",
            answers: ["La amistad es más importante que el deber y la lealtad.", "A veces lo correcto va a doler, pero debe prevalecer.", "Los líderes deben cuestionar las órdenes que consideran injustas.", "El refugio en el altar siempre salva la vida del desleal."],
            correctAnswer: 1 // B. A veces lo correcto va a doler, pero debe prevalecer.
        },
        // Pregunta 8
        {
            question: "La enseñanza clave del texto sobre Benaía superando los tres reinos (Saúl, David, Salomón) es:",
            answers: ["Los procesos son para pasarlos, no para quedarnos atrapados en ellos.", "Un líder debe tener siempre la misma mentalidad sin cambiar.", "Solo los que fueron desleales a Saúl pudieron servir a David.", "El cambio significa irse de la iglesia o del liderazgo."],
            correctAnswer: 0 // A. Los procesos son para pasarlos, no para quedarnos atrapados en ellos.
        },
        // Líder 1: Joab (El guerrero, basado en la estructura del libro)
        {
            question: "De acuerdo al contexto general del libro, ¿cuál de estos aspectos es el más representativo del 'Rostro de Joab' en el liderazgo?",
            answers: ["La lealtad absoluta e incuestionable al rey.", "La obediencia ciega a la autoridad delegada.", "La mezcla de pasión, habilidad militar y falta de conciencia en la autoridad.", "La paciencia para esperar el tiempo de Dios para la promoción."],
            correctAnswer: 2
        },
        // Líder 2: Absalón (El carismático, basado en la estructura del libro)
        {
            question: "Según el análisis del 'Rostro de Absalón', ¿cuál fue la herramienta principal que usó para robar el corazón del pueblo y minar la autoridad de su padre, el rey David?",
            answers: ["Su capacidad para la consejería estratégica.", "Su gran influencia entre los sacerdotes.", "Su carisma superficial y su manejo de la imagen pública.", "Su habilidad para unificar el ejército."],
            correctAnswer: 2
        },
        // Líder 3: Simei (Capítulo 3 - El resentido, basado en tu primer prompt)
        {
            question: "Según el Cap 3, ¿cuál de los siguientes sentimientos alberga el 'espíritu de Simei' que le impide amar y respetar al líder que Dios puso sobre él?",
            answers: ["Falta de experiencia y desconocimiento de la historia de David.", "Envidia, amargura y un lazo emocional con líderes pasados.", "Pereza y falta de disposición para el servicio ministerial.", "Deseo de ocupar el trono de David y obtener el poder para sí mismo."],
            correctAnswer: 1
        },
        // Líder 4: Adonías (Capítulo 4 - El ambicioso, basado en tu tercer prompt)
        {
            question: "¿Qué acción específica tomó Adonías por sí mismo para autoproclamarse Rey, demostrando su ambición desordenada, que caracteriza su rostro de líder?",
            answers: ["Se enalteció, diciendo: 'Yo reinaré'.", "Se alió con Sadoc para consolidar su poder.", "Compró carros y gente de a caballo para su escolta.", "Huyó inmediatamente de David al saber la noticia."],
            correctAnswer: 0
        },
        // Líder 5: Abiatar (Capítulo 5 - El sacerdote caído, de tu archivo de Cap 5)
        {
            question: "La caída del 'Rostro de Abiatar' se da al final de su ministerio. ¿Qué objeto clave llevó consigo cuando huyó con David, que luego le fue quitado por su deslealtad en la rebelión de Adonías?",
            answers: ["El Pan de la Proposición", "El Arca del Pacto", "El Efod (con el Urim y Tumim)", "La Espada de Goliat"],
            correctAnswer: 2
        },
        // Líder 6: Sadoc (Capítulo 6 - El leal, de tu archivo de Cap 6)
        {
            question: "¿Cuál fue la decisión crucial que tomó el 'Rostro de Sadoc' durante la rebelión de Adonías, que demostró su lealtad a David y a la voluntad de Dios?",
            answers: ["Se unió a Joab para espiar a Adonías.", "Se mantuvo leal al Rey David, negándose a unirse a Adonías.", "Convenció a Abiatar de volver con David antes de que fuera tarde.", "Huyó de Jerusalén para evitar tomar partido por alguien."],
            correctAnswer: 1
        },
        // Líder 7: Benaía (Capítulo 7 - El constructor, de tu archivo de Cap 7)
        {
            question: "¿Cuál es la enseñanza clave que se desprende del 'Rostro de Benaía' al haber superado los tres reinos (Saúl, David, Salomón) y haber servido con fidelidad en cada temporada?",
            answers: ["Un líder debe tener siempre la misma mentalidad sin cambiar.", "Los procesos son para pasarlos, no para quedarnos atrapados en ellos.", "Solo los desleales a Saúl pudieron servir a David.", "El cambio significa irse de la iglesia o del liderazgo."],
            correctAnswer: 0
        }
    ];

    // ⭐ NUEVA VARIABLE: Contendrá el set de 15 preguntas para la partida actual
    let currentRoundQuestions = [];


    const roundPoints = [
        100, 200, 300, 500, 1000,
        2000, 4000, 8000, 16000, 32000,
        64000, 125000, 250000, 500000, 1000000
    ];


    function unlockAudio() {
        if (audioUnlocked) return;

        allGameSoundFiles.forEach(sound => {
            sound.volume = 0;
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.volume = 1.0;
                audioUnlocked = true;
                console.log("Audio desbloqueado por interacción del usuario.");
            }).catch(e => {
                // Posible error si el navegador aún bloquea.
            });
        });
    }
    function typeWriterEffect(element, text) {
        if (!element) return;
        element.textContent = text;
        element.classList.remove('typewriter-anim');
        void element.offsetWidth;
        element.classList.add('typewriter-anim');
    }

    function showScreen(screenId) {
        for (let key in screens) {
            if (screens[key]) {
                screens[key].classList.remove('active');
            }
        }
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
        }

        if (gameElements.fireworksContainer) gameElements.fireworksContainer.classList.add('hidden');
        if (gameElements.rotatingCircle) gameElements.rotatingCircle.classList.add('hidden');
    }

    function playSound(soundKey, loop = false) {

        if (!audioUnlocked && soundKey !== 'win') return;

        stopAllSounds();
        const sound = gameSounds[soundKey];
        if (sound) {
            sound.loop = loop;
            sound.play().catch(error => console.error("Error al reproducir el audio:", error));
        }
    }

    function stopAllSounds() {
        for (const key in gameSounds) {
            if (gameSounds[key]) {
                gameSounds[key].pause();
                gameSounds[key].currentTime = 0;
            }
        }
    }

    function playRandomTrack() {
        if (!backgroundMusic || trackList.length === 0) return;
        const randomIndex = Math.floor(Math.random() * trackList.length);
        const selectedTrack = trackList[randomIndex];
        backgroundMusic.src = selectedTrack;
        backgroundMusic.play().catch(error => {
            console.warn("Música de fondo no se reprodujo automáticamente.");
        });
    }

    function stopBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.removeEventListener('ended', playRandomTrack);
        }
    }

    function startBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.removeEventListener('ended', playRandomTrack);
            backgroundMusic.addEventListener('ended', playRandomTrack);
            playRandomTrack();
        }
    }

   // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 2: Ahora toma las primeras 15 preguntas en orden
    // =========================================================
    function resetGameState() {
        currentQuestionIndex = 0;
        isPhoneUsed = false;
        isAudienceUsed = false;
        isHintUsed = false;
        selectedAnswer = null;

        // AHORA SIMPLEMENTE TOMAMOS LAS PRIMERAS 15 PREGUNTAS EN ORDEN DEL ARRAY COMPLETO
        currentRoundQuestions = allAvailableQuestions.slice(0, 15);
        
        // El resto de tu función...
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            // ... (resto de la función)
        }
        // ...
        stopBackgroundMusic();
        stopAllSounds();
    }

    function showFinalScreen() {
        resetGameState();
        stopBackgroundMusic();

        showScreen('win');

        playSound('win');

        const winText = "¡FELICIDADES!";
        const finalPrize = roundPoints[14].toLocaleString();

        if (gameElements.winTitle) {
            typeWriterEffect(gameElements.winTitle, winText);
        }
        if (gameElements.fireworksContainer) {
            gameElements.fireworksContainer.classList.remove('hidden');
        }
        if (gameElements.rotatingCircle) {
            gameElements.rotatingCircle.classList.remove('hidden');
        }

        setTimeout(() => {
            if (gameElements.finalScoreDisplay) {
                gameElements.finalScoreDisplay.textContent = `¡Has ganado el gran premio de ${finalPrize} Pts, ${playerName}!`;
                gameElements.finalScoreDisplay.classList.add('visible');
            }
        }, 1500);

        setTimeout(() => {
            if(buttons.restartWin) buttons.restartWin.style.display = 'inline-block';
            if(buttons.backToStartWin) buttons.backToStartWin.style.display = 'inline-block';
        }, 2500);


        if (buttons.restartWin) buttons.restartWin.style.display = 'none';
        if (buttons.backToStartWin) buttons.backToStartWin.style.display = 'none';


        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    function startGame() {
        const inputName = gameElements.playerNameInput ? gameElements.playerNameInput.value.trim() : 'Jugador Anónimo';

        if (inputName.length === 0) {
            alert("Por favor, introduce tu nombre para empezar.");
            gameElements.playerNameInput.focus();
            return;
        }

        playerName = inputName;
        resetGameState();
        playSound('start');

        if (gameElements.startScreenContent) {
            gameElements.startScreenContent.classList.add('fade-out');

            setTimeout(() => {
                showScreen('game');
                loadQuestion();
                gameElements.startScreenContent.classList.remove('fade-out');
            }, 500);
        } else {
            showScreen('game');
            loadQuestion();
        }
    }

    function toggleRounds() {
        if (!gameElements.roundsContainer || !buttons.toggleRounds) return;

        gameElements.roundsContainer.classList.toggle('minimized');

        const isMinimized = gameElements.roundsContainer.classList.contains('minimized');
        buttons.toggleRounds.textContent = isMinimized ? 'Mostrar Rondas ➡️' : 'Ocultar Rondas ⬅️';
    }

    function generateRoundsList() {
        if (!gameElements.roundsList) return;

        gameElements.roundsList.innerHTML = '';
        roundPoints.slice().reverse().forEach((points, index) => {
            const roundNumber = 15 - index;
            const li = document.createElement('li');
            li.dataset.round = roundNumber - 1;
            li.innerHTML = `<span>Ronda ${roundNumber}</span><span>${points.toLocaleString()} Pts</span>`;
            gameElements.roundsList.appendChild(li);
        });
    }

    function updateRoundsHighlight() {
        if (!gameElements.roundsList) return;

        const rounds = gameElements.roundsList.querySelectorAll('li');
        rounds.forEach(li => li.classList.remove('current-round'));

        const currentRoundLi = gameElements.roundsList.querySelector(`li[data-round="${currentQuestionIndex}"]`);
        if (currentRoundLi) {
            currentRoundLi.classList.add('current-round');
            currentRoundLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function loadQuestion() {
        selectedAnswer = null;
        gameElements.answers.innerHTML = '';
        buttons.reveal.style.display = 'inline-block';
        buttons.next.style.display = 'none';

        if (gameElements.audiencePoll) gameElements.audiencePoll.classList.add('hidden');
        if (gameElements.phoneTimer) {
            gameElements.phoneTimer.classList.add('hidden');
            gameElements.timerDisplay.classList.remove('timer-urgent');
        }

        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }

        if (buttons.restartFail) buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';

        if (buttons.hint) {
            buttons.hint.style.display = 'inline-block';
            buttons.hint.disabled = isHintUsed;
            if(isHintUsed) buttons.hint.classList.add('used'); else buttons.hint.classList.remove('used');
        }
        if (buttons.audience) {
            buttons.audience.style.display = 'inline-block';
            buttons.audience.disabled = isAudienceUsed;
            if(isAudienceUsed) buttons.audience.classList.add('used'); else buttons.audience.classList.remove('used');
        }
        if (buttons.phone) {
            buttons.phone.style.display = 'inline-block';
            buttons.phone.disabled = isPhoneUsed;
            if(isPhoneUsed) buttons.phone.classList.add('used'); else buttons.phone.classList.remove('used');
        }

        playSound('suspense', true);


        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        gameElements.question.textContent = currentQuestion.question;

        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = String.fromCharCode(65 + index) + ": " + answer;
            button.classList.add('answer-btn');
            button.dataset.index = index;
            button.style.visibility = 'visible';
            button.addEventListener('click', selectAnswer);
            gameElements.answers.appendChild(button);
        });

        updateRoundsHighlight();
    }

    function selectAnswer(event) {
        const previouslySelected = document.querySelector('.answer-btn.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        const selectedButton = event.target;
        selectedAnswer = parseInt(selectedButton.dataset.index);
        selectedButton.classList.add('selected');
    }

// =========================================================
// =========================================================
/**
 * Envía el progreso del juego a FormSubmit en momentos clave.
 * @param {string} player - Nombre del jugador.
 * @param {number} roundIndex - Índice de la ronda actual (0 a 14).
 * @param {number} points - Puntos ganados en esa ronda o totales.
 * @param {string} status - 'VICTORIA' o 'PERDIDA'.
 */
function sendGameProgress(player, roundIndex, points, status) {
    if (roundIndex < 0) return;

    const finalPrize = points.toLocaleString();
    const roundNumber = roundIndex + 1;
    let safeScoreText = "0 Pts";
    
    // ... (Lógica de puntuación segura, no necesita cambio)
    if (roundIndex > 0) {
        const safetyIndex = (roundIndex >= 10) ? 9 : (roundIndex >= 5) ? 4 : -1;
        if (status === 'PERDIDA') {
             safeScoreText = (safetyIndex >= 0) ? roundPoints[safetyIndex].toLocaleString() + " Pts" : "0 Pts";
        } else {
             safeScoreText = finalPrize + " Pts";
        }
    }


    const formUrl = 'https://formsubmit.co/elias230012@gmail.com'; 

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = formUrl;
    form.style.display = 'none';

    const currentUrlBase = window.location.href.split('#')[0];
    const nextUrl = (status === 'VICTORIA') 
        ? currentUrlBase + '#win'
        : currentUrlBase; // Redirige de vuelta a la página principal del juego.
    
    // 2. Definir los campos
    const fields = {
        '_subject': `Juego Bíblico: ${status}`,
        'Nombre': player,
        'Ronda_Finalizada': `${roundNumber} / ${currentRoundQuestions.length}`,
        'Puntuación_Alcanzada': `${finalPrize} Pts`,
        'Puntuación_Segura_Ganada': safeScoreText,
        'Estado_Partida': status,
        '_captcha': 'false',
        // ⭐ CAMBIO CLAVE: Incluimos _next en todos los casos
        '_next': nextUrl 
    };
    
    // 3. Crear los inputs y añadirlos al formulario
    for (const name in fields) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = fields[name];
        form.appendChild(input);
    }

    // 4. Enviar
    document.body.appendChild(form);
    form.submit();

    console.log(`Resultado enviado a FormSubmit: ${status} en Ronda ${roundNumber}. Redireccionando a: ${nextUrl}`);
}

    function nextQuestion() {
        // currentQuestionIndex es el índice de la pregunta que acaba de responder (0-14)
        if (currentQuestionIndex === currentRoundQuestions.length - 1) {
            
            // El jugador acaba de responder la última pregunta (índice 14, ronda 15)
            // ⭐ ENVÍO CLAVE: Solo enviamos si gana la última pregunta
            sendGameProgress(playerName, 14, roundPoints[14], 'VICTORIA');

            showScreen('win');
            stopAllSounds();
            stopBackgroundMusic();

        } else {
            // Ya NO se envía el formulario en los checkpoints (Rondas 5 y 10).
            
            currentQuestionIndex++;
            loadQuestion();
        }
    }

    function revealAnswer() {
        if (selectedAnswer === null) {
            alert("Por favor, selecciona una respuesta.");
            return;
        }

        // Uso de currentRoundQuestions
        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const answerButtons = document.querySelectorAll('.answer-btn');
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }
        if (gameElements.phoneTimer) {
            gameElements.phoneTimer.classList.add('hidden');
            gameElements.timerDisplay.classList.remove('timer-urgent');
        }

        if (buttons.hint) buttons.hint.disabled = true;
        if (buttons.audience) buttons.audience.disabled = true;
        if (buttons.phone) buttons.phone.disabled = true;

        stopAllSounds();

        let isCorrect = (selectedAnswer === correctIndex);

        if (isCorrect) {
            playSound('correct');
        } else {
            playSound('wrong');
        }

        answerButtons.forEach(button => {
            button.disabled = true;
            const buttonIndex = parseInt(button.dataset.index);
            if (buttonIndex === correctIndex) {
                button.classList.add('correct');
            } else if (buttonIndex === selectedAnswer) {
                button.classList.add('wrong');
            }
        });

        buttons.reveal.style.display = 'none';

        if (isCorrect) {
            // Uso de currentRoundQuestions.length
            if (currentQuestionIndex === currentRoundQuestions.length - 1) {
                buttons.next.textContent = "Ver Resultado Final";
            }
            buttons.next.style.display = 'inline-block';
        } else {
            // El jugador perdió. Calculamos la puntuación segura.
            const roundLostIndex = currentQuestionIndex;
            const winAmountIndex = (roundLostIndex >= 10) ? 9 : (roundLostIndex >= 5) ? 4 : -1;
            const finalScore = winAmountIndex >= 0 ? roundPoints[winAmountIndex] : 0;
            
            // ⭐ ENVÍO CLAVE: Enviar datos al perder.
            sendGameProgress(playerName, roundLostIndex, finalScore, 'PERDIDA');


            gameElements.question.textContent = "¡Respuesta Incorrecta! El juego ha terminado.";
            gameElements.answers.innerHTML = `<p style="font-size: 1.6em; color: #ff536aff;">Perdiste esta vez, pero la biblia dice en Filipenses 4:9 En cuanto a lo que habéis aprendido, recibido y oído de mí, y visto en mí, eso haced; y el Dios de la paz estará con vosotros... tu puntuacion es.: ${finalScore.toLocaleString()} Pts</p>`;
            buttons.next.style.display = 'none';

            if (buttons.restartFail) {
                buttons.restartFail.style.display = 'inline-block';
                buttons.restartFail.textContent = "Volver a Intentarlo";
                buttons.restartFail.classList.add('restart-btn-fail');
            }
            if (buttons.backToStartFail) {
                buttons.backToStartFail.style.display = 'inline-block';
                buttons.backToStartFail.textContent = "Ir a Inicio";
                buttons.backToStartFail.classList.add('back-to-start-fail-btn');
            }
        }
    }


    function useHint() {
        if (isHintUsed) return;
        isHintUsed = true;
        buttons.hint.disabled = true;
        if (buttons.hint) buttons.hint.classList.add('used');

        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const answerButtons = document.querySelectorAll('.answer-btn');

        const incorrectIndices = [];
        answerButtons.forEach((btn, index) => {
            if (index !== correctIndex && btn.style.visibility !== 'hidden') {
                incorrectIndices.push(index);
            }
        });

        while (incorrectIndices.length > 1) {
            const randomIndex = Math.floor(Math.random() * incorrectIndices.length);
            const indexToRemove = incorrectIndices.splice(randomIndex, 1)[0];
            answerButtons[indexToRemove].style.visibility = 'hidden';
            answerButtons[indexToRemove].disabled = true;
        }
    }

    function useAudience() {
        if (isAudienceUsed) return;
        isAudienceUsed = true;
        buttons.audience.disabled = true;
        if (buttons.audience) buttons.audience.classList.add('used');

        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const percentages = [0, 0, 0, 0];
        let remaining = 100;

        const correctPercentage = Math.floor(Math.random() * 40) + 50;
        percentages[correctIndex] = correctPercentage;
        remaining -= correctPercentage;

        const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);

        for (let i = 0; i < incorrectIndices.length; i++) {
            const index = incorrectIndices[i];

            if (i === incorrectIndices.length - 1) {
                percentages[index] = remaining;
            } else {
                const maxAllocation = Math.min(remaining, Math.floor(remaining / (incorrectIndices.length - i)) * 2 || 1);
                let randomPart = Math.floor(Math.random() * maxAllocation);
                if (randomPart === 0 && remaining > 0) randomPart = 1;

                percentages[index] = randomPart;
                remaining -= randomPart;
            }
        }

        if (!gameElements.audiencePoll) return;
        gameElements.audiencePoll.classList.remove('hidden');

        document.querySelectorAll('.poll-bar').forEach((bar, index) => {
            const pollPercentage = bar.querySelector('.poll-percentage');
            if (pollPercentage) {
                pollPercentage.style.height = percentages[index] + '%';
                pollPercentage.textContent = percentages[index] + '%';
            }
        });
    }

    function usePhone() {
        if (isPhoneUsed) return;
        isPhoneUsed = true;
        buttons.phone.disabled = true;
        if (buttons.phone) buttons.phone.classList.add('used');

        if (!gameElements.phoneTimer || !gameElements.timerDisplay) return;

        gameElements.phoneTimer.classList.remove('hidden');
        let timeLeft = 60;
        gameElements.timerDisplay.textContent = timeLeft;

        if (phoneTimerInterval !== null) clearInterval(phoneTimerInterval);

        phoneTimerInterval = setInterval(() => {
            timeLeft--;
            gameElements.timerDisplay.textContent = timeLeft;
            if (timeLeft <= 10) {
                gameElements.timerDisplay.classList.add('timer-urgent');
            } else {
                gameElements.timerDisplay.classList.remove('timer-urgent');
            }

            if (timeLeft <= 0) {
                clearInterval(phoneTimerInterval);
                phoneTimerInterval = null;
                gameElements.phoneTimer.classList.add('hidden');
                gameElements.timerDisplay.classList.remove('timer-urgent');
                alert("Tiempo de llamada agotado.");
            }
        }, 1000);

        setTimeout(() => {
            const currentQuestion = currentRoundQuestions[currentQuestionIndex];
            const correctText = String.fromCharCode(65 + currentQuestion.correctAnswer);
            alert(`Tu amigo dice: 'Estoy 90% seguro de que la respuesta correcta es la ${correctText}.'`);
        }, 10000);
    }
    
    if (buttons.start) buttons.start.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });
    if (buttons.startFromRules) buttons.startFromRules.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });

    if (buttons.toggleRounds) buttons.toggleRounds.addEventListener('click', toggleRounds);

    if (buttons.showRules) buttons.showRules.addEventListener('click', () => {
        showScreen('rules');
        startBackgroundMusic();
    });

    if (buttons.backToStart) buttons.backToStart.addEventListener('click', () => { showScreen('start'); startBackgroundMusic(); });

    if (buttons.reveal) buttons.reveal.addEventListener('click', revealAnswer);
    if (buttons.next) buttons.next.addEventListener('click', nextQuestion);
    if (buttons.hint) buttons.hint.addEventListener('click', useHint);
    if (buttons.audience) buttons.audience.addEventListener('click', useAudience);
    if (buttons.phone) buttons.phone.addEventListener('click', usePhone);
    if (buttons.restartFail) buttons.restartFail.addEventListener('click', () => {
        startGame();
        buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';
    });
    if (buttons.backToStartFail) buttons.backToStartFail.addEventListener('click', () => {
        resetGameState();
        showScreen('start');
        startBackgroundMusic();

        if (buttons.restartFail) buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';
    });
    if (buttons.restartWin) buttons.restartWin.addEventListener('click', () => {
        startGame();
    });

    if (buttons.backToStartWin) buttons.backToStartWin.addEventListener('click', () => {
        resetGameState();
        showScreen('start');
        startBackgroundMusic();
    });
    generateRoundsList();

    const hash = window.location.hash;

    if (hash === '#win') {
        audioUnlocked = true;
        playerName = 'Campeón';
        setTimeout(() => {
            showFinalScreen();
        }, 100);

    } else {
        showScreen('start');
        startBackgroundMusic();
    }
});