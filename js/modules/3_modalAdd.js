import { editIconSVG, deleteIconSVG } from './0_constants.js';
import * as sel from './1_selectors.js'; // Importa todos os seletores como 'sel'
import { updateRecordsCount, recalculateAndDisplayTotals } from './2_utils.js';

const closeModal = () => {
    sel.addExpenseForm.reset(); 
    sel.modalOverlay.classList.remove('show');
};

const handleAddSubmit = (event) => {
    event.preventDefault(); 
    const type = document.getElementById('g-tipo').value;
    const name = document.getElementById('g-nome').value;
    const category = document.getElementById('g-cat').value;
    const value = parseFloat(document.getElementById('g-val').value.replace(',', '.')); // Aceita vírgula
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
    sel.expensesTbody.appendChild(newRow);
    
    recalculateAndDisplayTotals();
    updateRecordsCount();
    closeModal(); 
};

// funçaõ chamada pelo main
export function initAddModal() {
    sel.openModalBtn.addEventListener('click', () => sel.modalOverlay.classList.add('show'));
    sel.closeModalBtn.addEventListener('click', closeModal);
    sel.modalOverlay.addEventListener('click', (event) => {
        if (event.target === sel.modalOverlay) closeModal();
    });
    sel.addExpenseForm.addEventListener('submit', handleAddSubmit);
}
