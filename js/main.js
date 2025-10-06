// DENTRO DE: js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // --- SELETORES DE ELEMENTOS ---
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('addExpenseModal');
    const addExpenseForm = document.getElementById('addExpenseForm');
    const expensesTbody = document.getElementById('expenses-tbody');

    // --- LÓGICA DO MODAL (ABRIR/FECHAR) ---
    // A função só existe se todos os elementos do dashboard existirem
    if (openModalBtn && closeModalBtn && modalOverlay && addExpenseForm && expensesTbody) {
        
        // Função para fechar o modal
        function closeModal() {
            addExpenseForm.reset(); // Limpa o formulário
            modalOverlay.classList.remove('show');
        }

        // Abrir modal
        openModalBtn.addEventListener('click', () => {
            modalOverlay.classList.add('show');
        });

        // Fechar modal no botão "Cancelar"
        closeModalBtn.addEventListener('click', closeModal);
        
        // Fechar modal clicando fora dele
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        // --- LÓGICA DE ADICIONAR GASTO ---
        addExpenseForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            // Pega os valores do formulário
            const name = document.getElementById('g-nome').value;
            const category = document.getElementById('g-cat').value;
            const value = document.getElementById('g-val').value;
            const date = document.getElementById('g-data').value;
            
            // Cria uma nova linha na tabela
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="col-name">${name}</td>
                <td class="col-category">${category}</td>
                <td class="col-value">${value}</td>
                <td class="col-date">${date}</td>
                <td class="actions">
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </td>
            `;

            // Adiciona a nova linha ao corpo da tabela
            expensesTbody.appendChild(newRow);
            
            closeModal(); // Fecha o modal após adicionar
        });

        // --- LÓGICA DE EDITAR E EXCLUIR (USANDO DELEGAÇÃO DE EVENTOS) ---
        expensesTbody.addEventListener('click', (event) => {
            const target = event.target;
            const row = target.closest('tr');

            // --- AÇÃO DE EXCLUIR ---
            if (target.classList.contains('delete-btn')) {
                if (confirm('Tem certeza de que deseja excluir este gasto?')) {
                    row.remove();
                }
            }

            // --- AÇÃO DE EDITAR/SALVAR ---
            else if (target.classList.contains('edit-btn')) {
                target.textContent = '💾';
                target.classList.remove('edit-btn');
                target.classList.add('save-btn');

                const nameCell = row.querySelector('.col-name');
                const categoryCell = row.querySelector('.col-category');
                const valueCell = row.querySelector('.col-value');
                const dateCell = row.querySelector('.col-date');

                nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
                categoryCell.innerHTML = `<input type="text" value="${categoryCell.textContent}">`;
                valueCell.innerHTML = `<input type="text" value="${valueCell.textContent.replace('+ ', '')}">`;
                dateCell.innerHTML = `<input type="date" value="${dateCell.textContent}">`;

            } else if (target.classList.contains('save-btn')) {
                target.textContent = '✏️';
                target.classList.remove('save-btn');
                target.classList.add('edit-btn');
                
                const nameInput = row.querySelector('.col-name input').value;
                const categoryInput = row.querySelector('.col-category input').value;
                const valueInput = row.querySelector('.col-value input').value;
                const dateInput = row.querySelector('.col-date input').value;

                row.querySelector('.col-name').textContent = nameInput;
                row.querySelector('.col-category').textContent = categoryInput;
                row.querySelector('.col-value').textContent = valueInput;
                row.querySelector('.col-date').textContent = dateInput;
            }
        });
    }
});