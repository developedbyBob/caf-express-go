document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    formData.append('pdfFile', fileField.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        document.getElementById('result').innerText = `Custo total de entrega: R$${result.total}`;

       // Exibir os pesos no console do navegador
       const weights = result.weights;
       console.log('Lista de pesos:', weights);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('result').innerText = 'An error occurred while processing the PDF.';
    }
});

// Verificar se o servidor está acessível
(async function checkServerStatus() {
    try {
        const response = await fetch('/status'); // Supondo que você tenha uma rota `/status` no servidor
        if (response.ok) {
            console.log('O servidor está acessível.');
        } else {
            console.log('O servidor respondeu, mas ocorreu um problema:', response.status);
        }
    } catch (error) {
        console.error('Não foi possível acessar o servidor:', error);
    }
})();
