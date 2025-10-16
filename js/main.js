// Import do seletor
import { expensesTbody } from './modules/1_selectors.js';

// Importde para iniciar
import { initAddModal } from './modules/3_modalAdd.js';
import { initTable } from './modules/4_table.js';
import { initGastosModal } from './modules/5_modalGastos.js';
import { initGanhosModal } from './modules/6_modalGanhos.js';

import { updateRecordsCount, recalculateAndDisplayTotals } from './modules/2_utils.js';

// O "ouvinte" principal que inicia a aplicação
document.addEventListener('DOMContentLoaded', () => {
    
    if (expensesTbody) {
        
        //eventual ligação dos events no back
        initAddModal();
        initTable();
        initGastosModal();
        initGanhosModal();
        
        // count para o começo da pagina
        updateRecordsCount(); 
        recalculateAndDisplayTotals();
    }
});
