document.addEventListener("DOMContentLoaded", () => {
  // Selecciones generales
  const inputButtons = document.querySelectorAll(".input-button");
  const inputFields = document.querySelectorAll(".input-type");
  const inputContainers = document.querySelectorAll(".input-container");
  const feedbackMessages = document.querySelectorAll(".feedback");

  const timerDisplay = document.getElementById("timerDisplay");
  const globalError = document.getElementById("globalError");

  // Modal final
  const modalFinal = document.getElementById("modalFinalChinchu");
  const cerrarModalBtn = document.getElementById("cerrarModalChinchu");

  // Respuestas
  const respuestasNumericas = [8, 4, 0];
  const respuestaTextoFinal = "chinchunihuinchu";

  // Estados
  let bloqueoGlobal = false;
  const tiempoEspera = 60;
  let tiempoRestante = tiempoEspera;
  let timerInterval;

  let intentosPorInput = Array(inputFields.length).fill(0);

  // --- CASO: Inputs múltiples (3 inputs numéricos) ---
  if (inputFields.length > 1) {
    // Al cargar solo mostrar botones (inputs ocultos)
    inputContainers.forEach(container => container.classList.add("hidden"));

    // Bloquear inputs y botones (excepto botones inicialmente desbloqueados)
    bloquearInputs();
    desbloquearBotones();

    // Eventos para botones (flores)
    // Solo el botón en índice 2 es correcto
    const cardButtons = document.querySelectorAll(".flores-card"); // suponiendo clase en botones

    if (cardButtons.length === 0) {
      console.warn("No se encontraron botones con clase '.flores-card'");
    }

    cardButtons.forEach((btn, idx) => {
      btn.disabled = false; // aseguramos desbloqueados al iniciar
      btn.addEventListener("click", () => {
        if (bloqueoGlobal) return;

        if (idx === 2) {
          // Botón correcto
          globalError.textContent = "";
          desbloquearInputs(0);
          inputContainers[0].classList.remove("hidden");
          bloquearBotonesExcepto(idx);
        } else {
          // Botón incorrecto
          bloquearTodosLosInputs();
          bloquearBotones();
          globalError.textContent = "❌ Esta no es la flor correcta. Intenta después del tiempo de espera.";
          iniciarContador(() => {
            desbloquearBotones();
            desbloquearInputs(0);
            globalError.textContent = "";
          });
        }
      });
    });

    // Eventos para inputs numéricos
    inputButtons.forEach((btn, idx) => {
      btn.disabled = true; // bloquear botones inputs al inicio

      btn.addEventListener("click", () => {
        if (bloqueoGlobal) return;

        const valor = inputFields[idx].value.trim();
        const feedback = feedbackMessages[idx];

        if (compararNumeros(valor, respuestasNumericas[idx])) {
          // Correcto
          feedback.textContent = "✔️ Respuesta correcta";
          feedback.classList.remove("incorrect");
          feedback.classList.add("correct");

          // Mostrar siguiente input y desbloquear su botón
          if (idx + 1 < inputContainers.length) {
            inputContainers[idx + 1].classList.remove("hidden");
            desbloquearInputs(idx + 1);
          } else {
            alert("¡Completaste los tres inputs correctamente! Usa el número para el siguiente paso.");
          }
          // Desactivar el botón e input actual para evitar reintentos
          btn.disabled = true;
          inputFields[idx].disabled = true;
        } else {
          // Incorrecto
          intentosPorInput[idx]++;
          if (intentosPorInput[idx] === 1) {
            feedback.textContent = "❌ Incorrecto. Espera 60 segundos para intentar de nuevo.";
            feedback.classList.remove("correct");
            feedback.classList.add("incorrect");
            bloquearTodosLosInputs();
            iniciarContador(() => {
              desbloquearInputs(idx);
              feedback.textContent = "🔄 Intenta nuevamente.";
            });
          } else {
            feedback.textContent = "❌ Incorrecto. Se acabaron los intentos.";
            feedback.classList.remove("correct");
            feedback.classList.add("incorrect");
            btn.disabled = true;
            inputFields[idx].disabled = true;
          }
        }
      });
    });
  }

  // --- CASO: Input final de texto (único input visible) ---
  if (inputFields.length === 1 && inputFields[0].type === "text") {
    const buttonFinal = inputButtons[0];
    const inputFinal = inputFields[0];
    const feedbackFinal = feedbackMessages[0];

    buttonFinal.disabled = false;
    inputFinal.disabled = false;

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
          iniciarContador(() => {
            desbloquearTodosLosInputs();
            feedbackFinal.textContent = "🔄 Intenta nuevamente.";
          });
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

  // FUNCIONES AUXILIARES

  function bloquearTodosLosInputs() {
    bloqueoGlobal = true;
    inputButtons.forEach(btn => (btn.disabled = true));
    inputFields.forEach(input => (input.disabled = true));
  }

  function desbloquearTodosLosInputs() {
    bloqueoGlobal = false;
    inputButtons.forEach((btn, i) => {
      if (intentosPorInput[i] < 2) {
        btn.disabled = false;
        inputFields[i].disabled = false;
      }
    });
  }

  function bloquearBotones() {
    const cardButtons = document.querySelectorAll(".flores-card");
    cardButtons.forEach(btn => btn.disabled = true);
  }

  function desbloquearBotones() {
    const cardButtons = document.querySelectorAll(".flores-card");
    cardButtons.forEach(btn => btn.disabled = false);
  }

  // Bloquear botones excepto el correcto (por ejemplo índice 2)
  function bloquearBotonesExcepto(indiceCorrecto) {
    const cardButtons = document.querySelectorAll(".flores-card");
    cardButtons.forEach((btn, idx) => {
      btn.disabled = idx !== indiceCorrecto;
    });
  }

  function bloquearInputs() {
    inputButtons.forEach(btn => (btn.disabled = true));
    inputFields.forEach(input => (input.disabled = true));
  }

  function desbloquearInputs(indice) {
    if (intentosPorInput[indice] < 2) {
      inputButtons[indice].disabled = false;
      inputFields[indice].disabled = false;
    }
  }

  // Temporizador con callback para acción al terminar
  function iniciarContador(callback) {
    clearInterval(timerInterval);
    tiempoRestante = tiempoEspera;

    if (timerDisplay && globalError) {
      timerDisplay.textContent = `Debes esperar ${tiempoRestante} segundos...`;
      globalError.textContent = `⏳ Has sido bloqueado. Debes esperar ${tiempoRestante} segundos.`;
    }

    bloqueoGlobal = true;

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
        bloqueoGlobal = false;
        if (typeof callback === "function") callback();
      }
    }, 1000);
  }

  // Comparar números con tolerancia
  function compararNumeros(input, correcto) {
    const n = parseFloat(input);
    if (isNaN(n)) return false;
    return Math.abs(n - correcto) < 0.0001;
  }

  // Mostrar modal final
  function mostrarModal(esCorrecto = true) {
    if (!modalFinal) return;

    const confetti = document.getElementById("contenedorConfetti");
    const error = document.getElementById("contenedorError");

    modalFinal.classList.remove("hidden");

    if (esCorrecto) {
      if (confetti) confetti.classList.remove("hidden");
      if (error) error.classList.add("hidden");
      lanzarConfeti();
    } else {
      if (confetti) confetti.classList.add("hidden");
      if (error) error.classList.remove("hidden");
    }
  }

  // Confetti
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
