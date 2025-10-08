document.addEventListener('DOMContentLoaded', () => {

    const editIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    const deleteIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
    const saveIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`;

    const expensesTbody = document.getElementById('expenses-tbody');
    const recordsCountEl = document.getElementById('records-count');
    const totalEntradaEl = document.getElementById('total-entrada');
    const totalSaidaEl = document.getElementById('total-saida');
    
    // modal adicionar gasto
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('addExpenseModal');
    const addExpenseForm = document.getElementById('addExpenseForm');

    // modal de analise de gastos
    const analysisCard = document.getElementById('analysis-card');
    const analysisModal = document.getElementById('analysisModal');
    const closeAnalysisModalBtn = document.getElementById('closeAnalysisModalBtn');
    const analysisList = document.getElementById('analysis-list');
    const sortDescBtn = document.getElementById('sort-desc-btn');
    const sortAscBtn = document.getElementById('sort-asc-btn');
    
    // modal de análise de ganhos
    const analysisGanhosCard = document.getElementById('analysis-ganhos-card');
    const analysisGanhosModal = document.getElementById('analysisGanhosModal');
    const closeAnalysisGanhosModalBtn = document.getElementById('closeAnalysisGanhosModalBtn');
    const analysisGanhosList = document.getElementById('analysis-ganhos-list');
    const sortGanhosDescBtn = document.getElementById('sort-ganhos-desc-btn');
    const sortGanhosAscBtn = document.getElementById('sort-ganhos-asc-btn');

    if (expensesTbody) { 
        
        const formatCurrency = (number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
        
        const updateRecordsCount = () => {
            const rowCount = expensesTbody.getElementsByTagName('tr').length;
            if (recordsCountEl) recordsCountEl.textContent = `${rowCount} Registros`;
        };

        const recalculateAndDisplayTotals = () => {
            let totalEntrada = 0, totalSaida = 0;
            expensesTbody.querySelectorAll('tr').forEach(row => {
                const type = row.dataset.type;
                const value = parseFloat(row.dataset.value);
                if (!isNaN(value)) {
                    if (type === 'ganho') totalEntrada += value;
                    else if (type === 'gasto') totalSaida += value;
                }
            });
            totalEntradaEl.innerHTML = `${formatCurrency(totalEntrada)} <span class="label">Entrada</span>`;
            totalSaidaEl.innerHTML = `${formatCurrency(totalSaida)} <span class="label">Saída</span>`;
        };
        
        const closeModal = () => {
            addExpenseForm.reset(); 
            modalOverlay.classList.remove('show');
        };
        openModalBtn.addEventListener('click', () => modalOverlay.classList.add('show'));
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) closeModal();
        });

        addExpenseForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const type = document.getElementById('g-tipo').value;
            const name = document.getElementById('g-nome').value;
            const category = document.getElementById('g-cat').value;
            const value = parseFloat(document.getElementById('g-val').value);
            const dateInput = document.getElementById('g-data').value;
            
            if (isNaN(value)) { alert('Por favor, insira um valor numérico válido.'); return; }

            const [year, month, day] = dateInput.split('-');
            const date = `${day}/${month}`;
            const isIncome = type === 'ganho';
            const valueDisplay = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value);

            const newRow = document.createElement('tr');
            newRow.dataset.type = type;
            newRow.dataset.value = value;
            newRow.innerHTML = `
                <td class="col-name">${name}</td><td class="col-category">${category}</td>
                <td class="col-value ${isIncome ? 'income' : ''}">${isIncome ? '+ ' : ''}${valueDisplay}</td>
                <td class="col-date">${date}</td><td class="actions">
                <button class="edit-btn">${editIconSVG}</button><button class="delete-btn">${deleteIconSVG}</button></td>`;
            expensesTbody.appendChild(newRow);
            
            recalculateAndDisplayTotals();
            updateRecordsCount();
            closeModal(); 
        });

        // botoes editar e excluir
        expensesTbody.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button');
            if (!targetButton) return; 
            const row = targetButton.closest('tr');
            
            if (targetButton.classList.contains('delete-btn')) {
                if (confirm('Tem certeza?')) {
                    row.remove();
                    recalculateAndDisplayTotals();
                    updateRecordsCount();
                }
            } else if (targetButton.classList.contains('edit-btn')) {
                 targetButton.innerHTML = saveIconSVG; 
                targetButton.classList.remove('edit-btn');
                targetButton.classList.add('save-btn');

                const nameCell = row.querySelector('.col-name');
                const categoryCell = row.querySelector('.col-category');
                const valueCell = row.querySelector('.col-value');
                const dateCell = row.querySelector('.col-date');
                
                const currentValue = row.dataset.value;

                const [day, month] = dateCell.textContent.split('/');
                const year = new Date().getFullYear();
                const dateForInput = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                
                nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
                categoryCell.innerHTML = `<input type="text" value="${categoryCell.textContent}">`;
                valueCell.innerHTML = `<input type="number" step="0.01" value="${currentValue}">`;
                dateCell.innerHTML = `<input type="date" value="${dateForInput}">`;

            } else if (targetButton.classList.contains('save-btn')) {
                const nameInput = row.querySelector('.col-name input').value;
                const categoryInput = row.querySelector('.col-category input').value;
                const valueInput = parseFloat(row.querySelector('.col-value input').value);
                const dateInput = row.querySelector('.col-date input').value;

                if (isNaN(valueInput)) { alert('Por favor, insira um valor numérico válido.'); return; }

                targetButton.innerHTML = editIconSVG; 
                targetButton.classList.remove('save-btn');
                targetButton.classList.add('edit-btn');
                
                row.dataset.value = valueInput;

                const [year, month, day] = dateInput.split('-');
                const newDate = `${day}/${month}`;
                const isIncome = row.dataset.type === 'ganho';
                const valueDisplay = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(valueInput);

                row.querySelector('.col-name').textContent = nameInput;
                row.querySelector('.col-category').textContent = categoryInput;
                row.querySelector('.col-value').textContent = `${isIncome ? '+ ' : ''}${valueDisplay}`;
                row.querySelector('.col-date').textContent = newDate;

                recalculateAndDisplayTotals();
            }
        });

        // gambiarra da logica do modal de analise gastos 
        if (analysisCard) {
            const openAnalysisModal = () => {
                const gastos = getGastosFromTable();
                renderGastosList(gastos);
                analysisModal.classList.add('show');
            };
            const closeAnalysisModal = () => analysisModal.classList.remove('show');

            analysisCard.addEventListener('click', openAnalysisModal);
            closeAnalysisModalBtn.addEventListener('click', closeAnalysisModal);
            analysisModal.addEventListener('click', (event) => {
                if(event.target === analysisModal) closeAnalysisModal();
            });

            const getGastosFromTable = () => {
                const gastos = [];
                expensesTbody.querySelectorAll('tr[data-type="gasto"]').forEach(row => {
                    gastos.push({
                        name: row.querySelector('.col-name').textContent,
                        value: parseFloat(row.dataset.value)
                    });
                });
                return gastos;
            };

            const renderGastosList = (gastos) => {
                analysisList.innerHTML = '';
                if (gastos.length === 0) {
                    analysisList.innerHTML = '<li>Nenhum gasto encontrado.</li>';
                    return;
                }
                gastos.forEach(gasto => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<span class="item-name">${gasto.name}</span><span class="item-value">${formatCurrency(gasto.value)}</span>`;
                    analysisList.appendChild(listItem);
                });
            };

            sortDescBtn.addEventListener('click', () => {
                const gastos = getGastosFromTable();
                gastos.sort((a, b) => b.value - a.value);
                renderGastosList(gastos);
            });

            sortAscBtn.addEventListener('click', () => {
                const gastos = getGastosFromTable();
                gastos.sort((a, b) => a.value - b.value);
                renderGastosList(gastos);
            });
        }

        // gambiarra da logica do modal de analise ganhos
        if (analysisGanhosCard) {
            const openAnalysisGanhosModal = () => {
                const ganhos = getGanhosFromTable();
                renderGanhosList(ganhos);
                analysisGanhosModal.classList.add('show');
            };
            const closeAnalysisGanhosModal = () => analysisGanhosModal.classList.remove('show');

            analysisGanhosCard.addEventListener('click', openAnalysisGanhosModal);
            closeAnalysisGanhosModalBtn.addEventListener('click', closeAnalysisGanhosModal);
            analysisGanhosModal.addEventListener('click', (event) => {
                if(event.target === analysisGanhosModal) closeAnalysisGanhosModal();
            });

            const getGanhosFromTable = () => {
                const ganhos = [];
                expensesTbody.querySelectorAll('tr[data-type="ganho"]').forEach(row => {
                    ganhos.push({
                        name: row.querySelector('.col-name').textContent,
                        value: parseFloat(row.dataset.value)
                    });
                });
                return ganhos;
            };

            const renderGanhosList = (ganhos) => {
                analysisGanhosList.innerHTML = '';
                if (ganhos.length === 0) {
                    analysisGanhosList.innerHTML = '<li>Nenhum ganho encontrado.</li>';
                    return;
                }
                ganhos.forEach(ganho => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<span class="item-name">${ganho.name}</span><span class="item-value">${formatCurrency(ganho.value)}</span>`;
                    analysisGanhosList.appendChild(listItem);
                });
            };

            sortGanhosDescBtn.addEventListener('click', () => {
                const ganhos = getGanhosFromTable();
                ganhos.sort((a, b) => b.value - a.value);
                renderGanhosList(ganhos);
            });

            sortGanhosAscBtn.addEventListener('click', () => {
                const ganhos = getGanhosFromTable();
                ganhos.sort((a, b) => a.value - b.value);
                renderGanhosList(ganhos);
            });
        }
        
        updateRecordsCount(); 
        recalculateAndDisplayTotals();
    }
});
