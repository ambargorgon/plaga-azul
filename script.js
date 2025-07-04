document.addEventListener('DOMContentLoaded', () => {
    // Respuestas correctas
    const respuestas = [8, 4, 0]; 

    const inputButtons = document.querySelectorAll('.input-button');
    const inputFields = document.querySelectorAll('.input-type');
    const inputContainers = document.querySelectorAll('.input-container');
    const feedbackMessages = document.querySelectorAll('.feedback');

    const finalModal = document.getElementById('finalModal');
    const closeModal = document.getElementById('closeModal');

    inputButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const userInput = inputFields[index].value.trim();
            const feedback = feedbackMessages[index];

            if (compararResultados(userInput, respuestas[index])) {
                feedback.textContent = '✔️ Respuesta correcta';
                feedback.classList.remove('incorrect');
                feedback.classList.add('correct');

                // Mostrar siguiente input si existe
                if (index + 1 < inputContainers.length) {
                    inputContainers[index + 1].classList.remove('hidden');
                } else {
                    // Mostrar modal cuando termine todo
                    mostrarModal();
                }
            } else {
                feedback.textContent = '❌ Respuesta incorrecta. Intenta de nuevo.';
                feedback.classList.remove('correct');
                feedback.classList.add('incorrect');
            }
        });
    });

    // Cerrar modal al hacer clic en la X
    closeModal.addEventListener('click', () => {
        finalModal.classList.add('hidden');
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === finalModal) {
            finalModal.classList.add('hidden');
        }
    });
});

// Comparar resultados con tolerancia
function compararResultados(input, correcto) {
    const numeroInput = parseFloat(input);
    return Math.abs(numeroInput - correcto) < 0.0001;
}

// Mostrar modal
function mostrarModal() {
    document.getElementById('finalModal').classList.remove('hidden');
}
