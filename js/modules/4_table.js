import { editIconSVG, saveIconSVG } from './0_constants.js';
import { expensesTbody } from './1_selectors.js';
import { updateRecordsCount, recalculateAndDisplayTotals } from './2_utils.js';

const handleTableClick = (event) => {
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
};

export function initTable() {
    expensesTbody.addEventListener('click', handleTableClick);
}
