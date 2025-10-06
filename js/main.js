document.addEventListener('DOMContentLoaded', () => {-
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('addExpenseModal');
    const addExpenseForm = document.getElementById('addExpenseForm');
    const expensesTbody = document.getElementById('expenses-tbody');
                                                     
    //modal
    if (openModalBtn && closeModalBtn && modalOverlay && addExpenseForm && expensesTbody) {
        function closeModal() {
            addExpenseForm.reset(); 
            modalOverlay.classList.remove('show');
        }
        openModalBtn.addEventListener('click', () => {
            modalOverlay.classList.add('show');
        });
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        addExpenseForm.addEventListener('submit', (event) => {
            event.preventDefault(); // gambiarra
            const name = document.getElementById('g-nome').value;
            const category = document.getElementById('g-cat').value;
            const value = document.getElementById('g-val').value;
            const date = document.getElementById('g-data').value;
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
            expensesTbody.appendChild(newRow);
            
            closeModal(); 
        });
        expensesTbody.addEventListener('click', (event) => {
            const target = event.target;
            const row = target.closest('tr');

            //excluir
            if (target.classList.contains('delete-btn')) {
                if (confirm('Tem certeza de que deseja excluir este gasto?')) {
                    row.remove();
                }
            }

            //editar
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
