document.addEventListener("DOMContentLoaded", () => {
  // Para distinguir qué página está cargada:
  // Si tenemos inputs múltiples (3 inputs), o el input final único.
  const inputButtons = document.querySelectorAll(".input-button");
  const inputFields = document.querySelectorAll(".input-type");
  const inputContainers = document.querySelectorAll(".input-container");
  const feedbackMessages = document.querySelectorAll(".feedback");

  const timerDisplay = document.getElementById("timerDisplay");
  const globalError = document.getElementById("globalError");

  // Para modal final del input único:
  const modalFinal = document.getElementById("modalFinalChinchu");
  const cerrarModalBtn = document.getElementById("cerrarModalChinchu");

  // Respuestas para los inputs múltiples (3 inputs)
  const respuestasNumericas = [8, 4, 0];
  // Respuesta para el input final (texto)
  const respuestaTextoFinal = "chinchunihuinchu";

  // Variables de bloqueo y conteo intentos
  let bloqueoGlobal = false;
  const tiempoEspera = 60; // segundos
  let tiempoRestante = tiempoEspera;
  let timerInterval;

  // Para contar intentos por input
  let intentosPorInput = Array(inputFields.length).fill(0);

  // Solo si están presentes los inputs múltiples:
  if (inputFields.length > 1) {
    // Inicializar: esconder todos los inputs excepto el primero
    inputContainers.forEach((container, i) => {
      if (i !== 0) container.classList.add("hidden");
    });

    inputButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        if (bloqueoGlobal) return;

        const userInput = inputFields[index].value.trim();

        const feedback = feedbackMessages[index];

        // Validamos solo los primeros 3 inputs numéricos
        if (index < respuestasNumericas.length) {
          if (compararResultadosNumericos(userInput, respuestasNumericas[index])) {
            feedback.textContent = "✔️ Respuesta correcta";
            feedback.classList.remove("incorrect");
            feedback.classList.add("correct");

            // Mostrar siguiente input si hay
            if (index + 1 < inputContainers.length) {
              inputContainers[index + 1].classList.remove("hidden");
            } else {
              // Ya completó los 3 inputs, mostramos modal o mensaje
              // Aquí podrías llamar a mostrarModal o algo similar
              alert("¡Completaste los tres inputs correctamente! Usa el número para el siguiente paso.");
            }
          } else {
            // Incorrecto: manejar intentos y bloqueo
            intentosPorInput[index]++;
            if (intentosPorInput[index] === 1) {
              feedback.textContent = "❌ Incorrecto. Espera 60 segundos para intentar de nuevo.";
              feedback.classList.remove("correct");
              feedback.classList.add("incorrect");
              bloquearTodosLosInputs();
              iniciarContador();
            } else {
              feedback.textContent = "❌ Incorrecto. Se acabaron los intentos.";
              feedback.classList.remove("correct");
              feedback.classList.add("incorrect");
              button.disabled = true;
              inputFields[index].disabled = true;
            }
          }
        }
      });
    });
  }

  // Si solo está el input final (texto)
  if (inputFields.length === 1 && inputFields[0].type === "text") {
    const buttonFinal = inputButtons[0];
    const inputFinal = inputFields[0];
    const feedbackFinal = feedbackMessages[0];

    buttonFinal.addEventListener("click", () => {
      if (bloqueoGlobal) return;

      const userInput = inputFinal.value.trim().toLowerCase().replace(/\s+/g, "");

      if (userInput === respuestaTextoFinal) {
        feedbackFinal.textContent = "✔️ ¡Respuesta correcta!";
        feedbackFinal.classList.remove("incorrect");
        feedbackFinal.classList.add("correct");
        mostrarModal(true);
      } else {
        intentosPorInput[0]++;
        if (intentosPorInput[0] === 1) {
          feedbackFinal.textContent = "❌ Incorrecto. Espera 60 segundos para intentar de nuevo.";
          feedbackFinal.classList.remove("correct");
          feedbackFinal.classList.add("incorrect");
          bloquearTodosLosInputs();
          iniciarContador();
        } else {
          feedbackFinal.textContent = "❌ Incorrecto. Se acabaron los intentos.";
          feedbackFinal.classList.remove("correct");
          feedbackFinal.classList.add("incorrect");
          buttonFinal.disabled = true;
          inputFinal.disabled = true;
          mostrarModal(false);
        }
      }
    });

    // Cierre modal
    if (cerrarModalBtn) {
      cerrarModalBtn.addEventListener("click", () => {
        modalFinal.classList.add("hidden");
      });
    }
    window.addEventListener("click", (event) => {
      if (event.target === modalFinal) {
        modalFinal.classList.add("hidden");
      }
    });
  }

  // Funciones bloqueo y desbloqueo (aplican para ambos casos)
  function bloquearTodosLosInputs() {
    bloqueoGlobal = true;
    inputButtons.forEach((button) => (button.disabled = true));
    inputFields.forEach((input) => (input.disabled = true));
  }

  function desbloquearTodosLosInputs() {
    bloqueoGlobal = false;
    inputButtons.forEach((button, index) => {
      if (intentosPorInput[index] < 2) {
        button.disabled = false;
        inputFields[index].disabled = false;
      }
    });
  }

  // Temporizador común
  function iniciarContador() {
    clearInterval(timerInterval);
    tiempoRestante = tiempoEspera;
    if (timerDisplay && globalError) {
      timerDisplay.textContent = `Debes esperar ${tiempoRestante} segundos...`;
      globalError.textContent = `⏳ Has sido bloqueado. Debes esperar ${tiempoRestante} segundos.`;
    }

    timerInterval = setInterval(() => {
      tiempoRestante--;
      if (timerDisplay && globalError) {
        timerDisplay.textContent = `Debes esperar ${tiempoRestante} segundos...`;
        globalError.textContent = `⏳ Has sido bloqueado. Debes esperar ${tiempoRestante} segundos.`;
      }
      if (tiempoRestante <= 0) {
        clearInterval(timerInterval);
        if (timerDisplay && globalError) {
          timerDisplay.textContent = "";
          globalError.textContent = "";
        }
        desbloquearTodosLosInputs();

        feedbackMessages.forEach((feedback, index) => {
          if (intentosPorInput[index] < 2) {
            feedback.textContent = "🔄 Intenta nuevamente.";
          }
        });
      }
    }, 1000);
  }

  // Función para comparar números con tolerancia
  function compararResultadosNumericos(input, correcto) {
    const numeroInput = parseFloat(input);
    if (isNaN(numeroInput)) return false;
    return Math.abs(numeroInput - correcto) < 0.0001;
  }

  // Función para mostrar modal (solo en el input final)
  function mostrarModal(esCorrecto = true) {
    if (!modalFinal) return;

    const confetti = document.getElementById("contenedorConfetti");
    const error = document.getElementById("contenedorError");

    modalFinal.classList.remove("hidden");

    if (esCorrecto) {
      if(confetti) confetti.classList.remove("hidden");
      if(error) error.classList.add("hidden");
      lanzarConfeti();
    } else {
      if(confetti) confetti.classList.add("hidden");
      if(error) error.classList.remove("hidden");
    }
  }

  // Función para lanzar confeti (idéntica a tu implementación)
  function lanzarConfeti() {
    const canvas = document.getElementById("canvasConfetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 300;

    let particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 50,
      color: "hsl(" + Math.floor(Math.random() * 360) + ", 100%, 50%)",
      tilt: Math.floor(Math.random() * 10) - 10,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.r, p.r);
      });
      update();
    }

    function update() {
      particles.forEach((p, i) => {
        p.y += Math.cos(p.d) + 1 + p.r / 2;
        p.x += Math.sin(p.d);

        if (p.y > canvas.height) {
          particles[i] = {
            ...p,
            x: Math.random() * canvas.width,
            y: -10,
          };
        }
      });
    }

    setInterval(draw, 30);
  }
});
