// ===================================================================================
// ARQUIVO DE LÓGICA DO CONSTRUTOR DE FUNÇÕES COGNITIVAS
// Versão: FINAL E CORRIGIDA
// Autor: Gemini, com base nas regras fornecidas pelo utilizador.
// Descrição: Este script controla toda a interatividade, a lógica de arrastar e soltar,
// e a validação hierárquica e precisa das pilhas de funções cognitivas de Jung.
// ===================================================================================

// -----------------------------------------------------------------------------------
// 1. SELEÇÃO DOS ELEMENTOS DO DOM
// -----------------------------------------------------------------------------------
// Seleciona todos os elementos da página com os quais o script irá interagir.
const cards = document.querySelectorAll('.function-card');
const slots = document.querySelectorAll('.slot');
const functionsBank = document.querySelector('.functions-bank .cards-wrapper');
const messageBox = document.getElementById('message-box');
const mbtiTypeElement = document.getElementById('mbti-type');
const exampleArea = document.getElementById('example-area');
const resetButton = document.getElementById('reset-button');
let themeToggleButton;
// Verifica se o botão de tema existe antes de o selecionar para evitar erros.
if (document.getElementById('theme-toggle-button')) {
    themeToggleButton = document.getElementById('theme-toggle-button');
}

// -----------------------------------------------------------------------------------
// 2. DADOS E OBJETOS DE APOIO
// -----------------------------------------------------------------------------------
// Base de dados com todos os 16 tipos de personalidade, as suas pilhas de funções e exemplos.
const mbtiData = {
    'ENFP': { stack: ['Ne', 'Fi', 'Te', 'Si'], examples: [{ name: 'Willy Wonka', url: 'https://www.personality-database.com/profile/14/willy-wonka-charlie-and-the-chocolate-factory-2005-mbti-personality-type' }, { name: 'Homem-Aranha', url: 'https://www.personality-database.com/profile/2103/peter-parker-spider-man-marvel-cinematic-universe-mbti-personality-type' }] },
    'ENTP': { stack: ['Ne', 'Ti', 'Fe', 'Si'], examples: [{ name: 'Coringa', url: 'https://www.personality-database.com/profile/13/the-joker-the-dark-knight-mbti-personality-type' }, { name: 'Jack Sparrow', url: 'https://www.personality-database.com/profile/85/captain-jack-sparrow-pirates-of-the-caribbean-mbti-personality-type' }] },
    'INFP': { stack: ['Fi', 'Ne', 'Si', 'Te'], examples: [{ name: 'Frodo Bolseiro', url: 'https://www.personality-database.com/profile/1987/frodo-baggins-the-lord-of-the-rings-mbti-personality-type' }, { name: 'Amélie Poulain', url: 'https://www.personality-database.com/profile/3831/amlie-poulain-amlie-2001-mbti-personality-type' }] },
    'INTP': { stack: ['Ti', 'Ne', 'Si', 'Fe'], examples: [{ name: 'Neo', url: 'https://www.personality-database.com/profile/1647/neo-the-matrix-mbti-personality-type' }, { name: 'L', url: 'https://www.personality-database.com/profile/2043/l-lawliet-death-note-mbti-personality-type' }] },
    'ENFJ': { stack: ['Fe', 'Ni', 'Se', 'Ti'], examples: [{ name: 'Mufasa', url: 'https://www.personality-database.com/profile/11100/mufasa-the-lion-king-1994-mbti-personality-type' }, { name: 'Obi-Wan Kenobi', url: 'https://www.personality-database.com/profile/1585/obi-wan-kenobi-star-wars-mbti-personality-type' }] },
    'ENTJ': { stack: ['Te', 'Ni', 'Se', 'Fi'], examples: [{ name: 'Thanos', url: 'https://www.personality-database.com/profile/2099/thanos-marvel-cinematic-universe-mbti-personality-type' }, { name: 'Darth Sidious', url: 'https://www.personality-database.com/profile/31414/sheev-palpatine-star-wars-mbti-personality-type' }] },
    'INFJ': { stack: ['Ni', 'Fe', 'Ti', 'Se'], examples: [{ name: 'Galadriel', url: 'https://www.personality-database.com/profile/2012/galadriel-the-lord-of-the-rings-mbti-personality-type' }, { name: 'Jon Snow', url: 'https://www.personality-database.com/profile/2301/jon-snow-a-song-of-ice-and-fire-mbti-personality-type' }] },
    'INTJ': { stack: ['Ni', 'Te', 'Fi', 'Se'], examples: [{ name: 'Gandalf', url: 'https://www.personality-database.com/profile/1984/gandalf-the-lord-of-the-rings-mbti-personality-type' }, { name: 'Walter White', url: 'https://www.personality-database.com/profile/1409/walter-white-breaking-bad-mbti-personality-type' }] },
    'ESFP': { stack: ['Se', 'Fi', 'Te', 'Ni'], examples: [{ name: 'Elton John', url: 'https://www.personality-database.com/profile/13812/elton-john-musicians-europe-mbti-personality-type' }, { name: 'Po', url: 'https://www.personality-database.com/profile/5825/po-kung-fu-panda-mbti-personality-type' }] },
    'ESTP': { stack: ['Se', 'Ti', 'Fe', 'Ni'], examples: [{ name: 'Han Solo', url: 'https://www.personality-database.com/profile/1577/han-solo-star-wars-mbti-personality-type' }, { name: 'Jaime Lannister', url: 'https://www.personality-database.com/profile/2299/jaime-lannister-a-song-of-ice-and-fire-mbti-personality-type' }] },
    'ISFP': { stack: ['Fi', 'Se', 'Ni', 'Te'], examples: [{ name: 'Harry Potter', url: 'https://www.personality-database.com/profile/123/harry-potter-harry-potter-mbti-personality-type' }, { name: 'Kylo Ren', url: 'https://www.personality-database.com/profile/1614/kylo-ren-star-wars-mbti-personality-type' }] },
    'ISTP': { stack: ['Ti', 'Se', 'Ni', 'Fe'], examples: [{ name: 'Wolverine', url: 'https://www.personality-database.com/profile/1990/wolverine-x-men-mbti-personality-type' }, { name: 'Indiana Jones', url: 'https://www.personality-database.com/profile/2673/indiana-jones-indiana-jones-mbti-personality-type' }] },
    'ESFJ': { stack: ['Fe', 'Si', 'Ne', 'Ti'], examples: [{ name: 'Capitão América', url: 'https://www.personality-database.com/profile/2101/steve-rogers-captain-america-marvel-cinematic-universe-mbti-personality-type' }, { name: 'Samwise Gamgee', url: 'https://www.personality-database.com/profile/22055/samwise-gamgee-the-lord-of-the-rings-mbti-personality-type' }] },
    'ESTJ': { stack: ['Te', 'Si', 'Ne', 'Fi'], examples: [{ name: 'Darth Vader', url: 'https://www.personality-database.com/profile/1574/darth-vader-star-wars-mbti-personality-type' }, { name: 'Robb Stark', url: 'https://www.personality-database.com/profile/10425/robb-stark-a-song-of-ice-and-fire-mbti-personality-type' }] },
    'ISFJ': { stack: ['Si', 'Fe', 'Ti', 'Ne'], examples: [{ name: 'Dr. Watson', url: 'https://www.personality-database.com/profile/3313/dr-john-watson-sherlock-mbti-personality-type' }, { name: 'Cinderela', url: 'https://www.personality-database.com/profile/6487/cinderella-cinderella-1950-mbti-personality-type' }] },
    'ISTJ': { stack: ['Si', 'Te', 'Fi', 'Ne'], examples: [{ name: 'Ned Stark', url: 'https://www.personality-database.com/profile/2296/eddard-stark-a-song-of-ice-and-fire-mbti-personality-type' }, { name: 'Stannis Baratheon', url: 'https://www.personality-database.com/profile/10433/stannis-baratheon-a-song-of-ice-and-fire-mbti-personality-type' }] },
};

// Objeto para encontrar a função oposta rapidamente.
const functionOpposites = {
    'Ne': 'Si', 'Si': 'Ne', 'Ni': 'Se', 'Se': 'Ni',
    'Te': 'Fi', 'Fi': 'Te', 'Ti': 'Fe', 'Fe': 'Ti'
};

// Objeto para categorizar cada função (família, tipo e eixo).
const functionDetails = {
    'Ne': { family: 'Perception', type: 'N', axis: 'NeSi' }, 'Ni': { family: 'Perception', type: 'N', axis: 'NiSe' },
    'Se': { family: 'Perception', type: 'S', axis: 'NiSe' }, 'Si': { family: 'Perception', type: 'S', axis: 'NeSi' },
    'Te': { family: 'Judging', type: 'T', axis: 'TeFi' }, 'Ti': { family: 'Judging', type: 'T', axis: 'TiFe' },
    'Fe': { family: 'Judging', type: 'F', axis: 'TiFe' }, 'Fi': { family: 'Judging', type: 'F', axis: 'TeFi' }
};

// Variável para guardar a referência do cartão que está a ser arrastado.
let draggedCard = null;

// -----------------------------------------------------------------------------------
// 3. LÓGICA DE ARRASTAR E SOLTAR (DRAG AND DROP)
// -----------------------------------------------------------------------------------
// Adiciona os ouvintes de eventos a todos os cartões de função.
cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        draggedCard = card;
        // Adiciona um pequeno atraso para que o navegador crie a imagem "fantasma" antes de esconder o original.
        setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => {
        // Garante que o estilo de "arrastando" é sempre removido no final.
        card.classList.remove('dragging');
        draggedCard = null;
    });
});

// Adiciona os ouvintes de eventos aos slots e também ao banco de funções (para permitir devoluções).
[...slots, functionsBank].forEach(element => {
    // Permite que um elemento seja solto sobre este.
    element.addEventListener('dragover', e => {
        e.preventDefault();
        if (element.classList.contains('slot')) element.classList.add('drag-over');
    });

    // Remove o destaque visual quando o cartão sai da área do slot.
    element.addEventListener('dragleave', () => {
        if (element.classList.contains('slot')) element.classList.remove('drag-over');
    });

    // Lida com o evento de soltar um cartão.
    element.addEventListener('drop', () => {
        if (element.classList.contains('slot')) element.classList.remove('drag-over');
        if (draggedCard) {
            const isSlot = element.classList.contains('slot');
            const isBank = element.classList.contains('cards-wrapper');
            // Só permite soltar num slot se ele estiver vazio.
            if (isSlot && element.children.length === 0) element.appendChild(draggedCard);
            // Permite sempre soltar de volta no banco.
            else if (isBank) element.appendChild(draggedCard);
        }
        // Valida a pilha sempre que há uma alteração.
        validateStack();
    });
});

// -----------------------------------------------------------------------------------
// 4. LÓGICA DE VALIDAÇÃO (REESCRITA, HIERÁRQUICA E FINALMENTE CORRETA)
// -----------------------------------------------------------------------------------
function validateStack() {
    clearResults(); // Limpa os resultados anteriores.
    const stack = Array.from(slots).map(slot => slot.children.length > 0 ? slot.children[0].dataset.function : null);
    const filledStack = stack.filter(f => f); // Array apenas com as funções preenchidas.

    // Se não houver nenhuma função, não faz nada.
    if (filledStack.length === 0) return;

    // --- HIERARQUIA DE REGRAS ---
    // A validação para no primeiro erro encontrado, garantindo a mensagem mais relevante.

    // REGRA 1: CONFLITOS FUNDAMENTAIS (Verifica a pilha toda)
    
    // ERRO TIPO A: "N com N" (Conflito de Orientação)
    // Se há mais de uma função N, S, T ou F, significa que há um conflito (ex: Ne e Ni).
    for (const type of ['N', 'S', 'T', 'F']) {
        const funcsOfType = filledStack.filter(f => functionDetails[f].type === type);
        if (funcsOfType.length > 1) {
            displayMessage(`Conflito de Orientação: As funções ${funcsOfType.join(' e ')} não podem coexistir.`, 'error');
            return; // PARA AQUI. ESTE É O AVISO MAIS IMPORTANTE.
        }
    }
    
    // ERRO TIPO B: "N com S" (Conflito de Eixo)
    // Se a Regra A passou, agora checa se os eixos estão misturados.
    const pAxes = new Set(filledStack.filter(f => functionDetails[f].family === 'Perception').map(f => functionDetails[f].axis));
    const jAxes = new Set(filledStack.filter(f => functionDetails[f].family === 'Judging').map(f => functionDetails[f].axis));

    if (pAxes.size > 1) {
        displayMessage('Conflito de Eixo: Funções de percepção dos eixos Ne/Si e Ni/Se não podem ser misturadas.', 'error');
        return; // PARA AQUI.
    }
    if (jAxes.size > 1) {
        displayMessage('Conflito de Eixo: Funções de julgamento dos eixos Te/Fi e Ti/Fe não podem ser misturadas.', 'error');
        return; // PARA AQUI.
    }

    // REGRA 2: REGRAS POSICIONAIS (Verifica as posições específicas)
    const [dom, aux, ter, inf] = stack;

    // ERRO TIPO C: Dupla Principal Inválida
    if (dom && aux) {
        if (functionDetails[dom].family === functionDetails[aux].family) {
            displayMessage(`Par Principal Inválido: A dupla (${dom}, ${aux}) deve ter uma função de percepção (N/S) e uma de julgamento (T/F).`, 'error');
            return;
        }
    }

    // ERRO TIPO D: Terciária Inválida
    if (dom && aux && ter) {
        if (ter !== functionOpposites[aux]) {
            displayMessage(`Função Terciária Inválida: A terciária (${ter}) deve ser a oposta da auxiliar (${aux}). O correto seria ${functionOpposites[aux]}.`, 'error');
            return;
        }
    }
    
    // ERRO TIPO E: Inferior Inválida e BUSCA FINAL
    if (dom && aux && ter && inf) {
        if (inf !== functionOpposites[dom]) {
            displayMessage(`Função Inferior Inválida: A inferior (${inf}) deve ser a oposta da dominante (${dom}). O correto seria ${functionOpposites[dom]}.`, 'error');
            return;
        }

        // Se TODAS as regras passaram, a pilha é válida. Procura o tipo correspondente.
        for (const type in mbtiData) {
            if (JSON.stringify(mbtiData[type].stack) === JSON.stringify(stack)) {
                displayResult(type, mbtiData[type].examples);
                return;
            }
        }
        
        // Fallback caso a pilha seja válida mas não mapeada.
        displayMessage('Esta sequência, embora siga as regras, não corresponde a um tipo MBTI conhecido.', 'error');
    }
}

// -----------------------------------------------------------------------------------
// 5. FUNÇÕES AUXILIARES (Display, Clear, Reset)
// -----------------------------------------------------------------------------------
// Mostra uma mensagem na caixa de feedback.
function displayMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = 'message-box'; // Reseta as classes
    messageBox.classList.add(type, 'show');
}

// Limpa todos os resultados e mensagens.
function clearResults() {
    messageBox.classList.remove('show');
    mbtiTypeElement.textContent = 'Aguardando...';
    mbtiTypeElement.classList.add('mbti-type-placeholder');
    const h3 = exampleArea.querySelector('h3');
    if(h3) exampleArea.innerHTML = h3.outerHTML; else exampleArea.innerHTML = '<h3>Exemplos de Personalidades:</h3>';
}

// Mostra o tipo MBTI encontrado e os seus exemplos.
function displayResult(type, examples) {
    mbtiTypeElement.textContent = type;
    mbtiTypeElement.classList.remove('mbti-type-placeholder');
    const h3 = exampleArea.querySelector('h3');
    if(h3) exampleArea.innerHTML = h3.outerHTML; else exampleArea.innerHTML = '<h3>Exemplos de Personalidades:</h3>';
    examples.forEach(example => {
        const link = document.createElement('a');
        link.href = example.url;
        link.textContent = example.name;
        link.target = '_blank';
        exampleArea.appendChild(link);
    });
}

// Reseta toda a aplicação, devolvendo os cartões para o banco.
function resetAll() {
    slots.forEach(slot => {
        if (slot.children.length > 0) functionsBank.appendChild(slot.children[0]);
    });
    clearResults();
}
resetButton.addEventListener('click', resetAll);

// -----------------------------------------------------------------------------------
// 6. LÓGICA DO MODO NOTURNO
// -----------------------------------------------------------------------------------
if (themeToggleButton) {
    // Verifica se o utilizador já tem um tema guardado no browser.
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') { document.body.classList.add('dark-mode'); }

    // Ouve os cliques no botão para alternar o tema.
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Guarda a preferência do utilizador.
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
}

// ===================================================================================
// FIM DO SCRIPT
// ===================================================================================

