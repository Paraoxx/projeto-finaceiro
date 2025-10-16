// Importa o seletor.js
import { expensesTbody } from './modules/1_selectors.js';

// resto dos imports
import { initAddModal } from './modules/3_modalAdd.js';
import { initTable } from './modules/4_table.js';
import { initGastosModal } from './modules/5_modalGastos.js';
import { initGanhosModal } from './modules/6_modalGanhos.js';

//import de funçaõ de para calcular em linhas
import { updateRecordsCount, recalculateAndDisplayTotals } from './modules/2_utils.js';
document.addEventListener('DOMContentLoaded', () => {
    
    if (expensesTbody) {
        
        initAddModal();
        initTable();
        initGastosModal();
        initGanhosModal();
        updateRecordsCount(); 
        recalculateAndDisplayTotals();
    }
});
