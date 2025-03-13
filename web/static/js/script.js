document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('pdfFile');
    const fileNameDisplay = document.getElementById('fileName');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultDiv = document.getElementById('result');
    const weightsList = document.getElementById('weightsList');
    const weightsDetail = document.getElementById('weightsDetail');

    // Atualizar o nome do arquivo selecionado
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
        }
    });

    // Manipular o envio do formulário
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Verificar se um arquivo foi selecionado
        if (!fileInput.files || !fileInput.files[0]) {
            alert('Por favor, selecione um arquivo PDF');
            return;
        }

        // Verificar se o arquivo é PDF
        const file = fileInput.files[0];
        if (!file.type.includes('pdf')) {
            alert('Por favor, selecione apenas arquivos PDF');
            return;
        }

        // Mostrar indicador de carregamento
        loadingIndicator.classList.remove('hidden');
        resultDiv.textContent = '';
        weightsList.classList.add('hidden');

        const formData = new FormData();
        formData.append('pdfFile', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            // Esconder indicador de carregamento
            loadingIndicator.classList.add('hidden');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao processar o arquivo');
            }

            const result = await response.json();
            
            // Exibir o resultado principal
            resultDiv.textContent = `Custo total de entrega: R$ ${result.total.toFixed(2)}`;
            
            // Exibir detalhes dos pesos
            if (result.weights && result.weights.length > 0) {
                weightsDetail.innerHTML = '';
                
                result.weights.forEach((weight, index) => {
                    const li = document.createElement('li');
                    li.textContent = `${weight} kg` + 
                                     (weight > 0.3 ? ' (R$ 3,00)' : ' (R$ 2,00)');
                    weightsDetail.appendChild(li);
                });
                
                weightsList.classList.remove('hidden');
            }

        } catch (error) {
            console.error('Erro:', error);
            resultDiv.textContent = `Erro: ${error.message || 'Falha ao processar o PDF'}`;
        }
    });
});