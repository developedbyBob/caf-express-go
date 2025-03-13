// public/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const uploadForm = document.getElementById('uploadForm');
    const pdfFileInput = document.getElementById('pdfFile');
    const dropArea = document.getElementById('dropArea');
    const fileNameElement = document.getElementById('fileName');
    const resultsCard = document.getElementById('resultsCard');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const itemCountElement = document.getElementById('itemCount');
    const totalCostElement = document.getElementById('totalCost');
    const detailsTable = document.getElementById('detailsTable').querySelector('tbody');

    // Formatar valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Formatar valores de peso
    const formatWeight = (weight) => {
        return weight.toFixed(2).replace('.', ',') + ' kg';
    };

    // Lidar com a exibição do nome do arquivo
    pdfFileInput.addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || '';
        
        if (fileName) {
            fileNameElement.textContent = fileName;
            fileNameElement.classList.add('has-file');
        } else {
            fileNameElement.textContent = '';
            fileNameElement.classList.remove('has-file');
        }
    });

    // Arrastar e soltar arquivos
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('drag-over');
    }

    function unhighlight() {
        dropArea.classList.remove('drag-over');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0 && files[0].type === 'application/pdf') {
            pdfFileInput.files = files;
            
            // Disparar o evento change manualmente
            const event = new Event('change');
            pdfFileInput.dispatchEvent(event);
        } else {
            alert('Por favor, selecione apenas arquivos PDF.');
        }
    }

    // Clicar no dropArea para selecionar arquivo
    dropArea.addEventListener('click', function() {
        pdfFileInput.click();
    });

    // Manipular envio do formulário
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Verificar se um arquivo foi selecionado
        if (!pdfFileInput.files[0]) {
            alert('Por favor, selecione um arquivo PDF.');
            return;
        }

        // Mostrar overlay de carregamento
        loadingOverlay.style.display = 'flex';
        
        const formData = new FormData();
        formData.append('pdfFile', pdfFileInput.files[0]);

        try {
            // Adicionar timeout mais longo para o fetch (30 segundos)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Erro do servidor: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Erro ao processar o PDF');
            }

            // Atualizar elementos de resultado
            itemCountElement.textContent = result.itemCount || 0;
            totalCostElement.textContent = formatCurrency(result.total || 0);
            
            // Limpar a tabela anterior
            detailsTable.innerHTML = '';
            
            // Preencher a tabela de detalhes
            if (result.items && result.items.length > 0) {
                result.items.forEach((item, index) => {
                    const row = document.createElement('tr');
                    
                    const itemCell = document.createElement('td');
                    itemCell.textContent = `Item ${index + 1}`;
                    
                    const weightCell = document.createElement('td');
                    weightCell.textContent = formatWeight(item.weight);
                    
                    const costCell = document.createElement('td');
                    costCell.textContent = formatCurrency(item.cost);
                    
                    row.appendChild(itemCell);
                    row.appendChild(weightCell);
                    row.appendChild(costCell);
                    
                    detailsTable.appendChild(row);
                });
            } else {
                // Nenhum item encontrado
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.colSpan = 3;
                cell.textContent = 'Nenhum item encontrado no PDF';
                cell.style.textAlign = 'center';
                row.appendChild(cell);
                detailsTable.appendChild(row);
            }
            
            // Mostrar os resultados
            resultsCard.style.display = 'block';
            
            // Rolar para os resultados
            resultsCard.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Erro ao processar o PDF:', error);
            alert('Ocorreu um erro ao processar o arquivo: ' + error.message);
        } finally {
            // Esconder overlay de carregamento
            loadingOverlay.style.display = 'none';
        }
    });
});