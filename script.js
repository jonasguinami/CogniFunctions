// ===================================================================================
// ARQUIVO DE LÓGICA DO CONSTRUTOR DE FUNÇÕES COGNITIVAS
// Versão: FINAL COM SUPORTE A TOQUE (MOBILE)
// Autor: Gemini, com base nas regras e feedback do utilizador.
// Descrição: Este script controla a interatividade, drag-and-drop (rato e toque),
// e a validação hierárquica e precisa das pilhas de funções cognitivas.
// ===================================================================================

// -----------------------------------------------------------------------------------
// 1. SELEÇÃO DOS ELEMENTOS DO DOM
// -----------------------------------------------------------------------------------
const cards = document.querySelectorAll('.function-card');
const slots = document.querySelectorAll('.slot');
const functionsBank = document.querySelector('.functions-bank .cards-wrapper');
const messageBox = document.getElementById('message-box');
const mbtiTypeElement = document.getElementById('mbti-type');
const exampleArea = document.getElementById('example-area');
const resetButton = document.getElementById('reset-button');
let themeToggleButton;
if (document.getElementById('theme-toggle-button')) {
    themeToggleButton = document.getElementById('theme-toggle-button');
}

// -----------------------------------------------------------------------------------
// 2. DADOS E OBJETOS DE APOIO
// -----------------------------------------------------------------------------------
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
const functionOpposites = { 'Ne': 'Si', 'Si': 'Ne', 'Ni': 'Se', 'Se': 'Ni', 'Te': 'Fi', 'Fi': 'Te', 'Ti': 'Fe', 'Fe': 'Ti' };
const functionDetails = {
    'Ne': { family: 'Perception', type: 'N', axis: 'NeSi' }, 'Ni': { family: 'Perception', type: 'N', axis: 'NiSe' },
    'Se': { family: 'Perception', type: 'S', axis: 'NiSe' }, 'Si': { family: 'Perception', type: 'S', axis: 'NeSi' },
    'Te': { family: 'Judging', type: 'T', axis: 'TeFi' }, 'Ti': { family: 'Judging', type: 'T', axis: 'TiFe' },
    'Fe': { family: 'Judging', type: 'F', axis: 'TiFe' }, 'Fi': { family: 'Judging', type: 'F', axis: 'TeFi' }
};
let draggedCard = null;

// -----------------------------------------------------------------------------------
// 3. LÓGICA DE ARRASTAR E SOLTAR (MOUSE E TOQUE)
// -----------------------------------------------------------------------------------
cards.forEach(card => {
    // --- EVENTOS DE RATO (DESKTOP) ---
    card.addEventListener('dragstart', (e) => {
        draggedCard = e.target;
        setTimeout(() => e.target.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        draggedCard = null;
    });

    // --- EVENTOS DE TOQUE (MOBILE) ---
    card.addEventListener('touchstart', (e) => {
        draggedCard = e.target;
        // Previne o comportamento padrão de scroll do telemóvel ao arrastar.
        e.preventDefault();
        // Adiciona o estilo de "arrastando" imediatamente.
        draggedCard.classList.add('dragging');
    }, { passive: false });

    card.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!draggedCard) return;

        // Pega as coordenadas do toque.
        const touch = e.targetTouches[0];
        // Encontra o elemento que está debaixo do dedo.
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Remove o realce de todos os slots.
        slots.forEach(slot => slot.classList.remove('drag-over'));

        // Se o dedo estiver sobre um slot, realça-o.
        if (elementUnderTouch && elementUnderTouch.classList.contains('slot')) {
            elementUnderTouch.classList.add('drag-over');
        }
    }, { passive: false });

    card.addEventListener('touchend', (e) => {
        if (!draggedCard) return;

        // Pega o último ponto de toque.
        const touch = e.changedTouches[0];
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Limpa todos os realces e o estilo do cartão.
        slots.forEach(slot => slot.classList.remove('drag-over'));
        draggedCard.classList.remove('dragging');

        // Lógica para soltar o cartão.
        if (elementUnderTouch) {
            // Se soltou num slot vazio.
            if (elementUnderTouch.classList.contains('slot') && elementUnderTouch.children.length === 0) {
                elementUnderTouch.appendChild(draggedCard);
            }
            // Se soltou de volta no banco de funções ou num dos seus filhos.
            else if (elementUnderTouch.closest('.functions-bank')) {
                functionsBank.appendChild(draggedCard);
            }
        }
        
        // Valida a pilha e reseta a variável.
        validateStack();
        draggedCard = null;
    });
});

// Eventos de Drop para os slots (apenas para rato).
slots.forEach(slot => {
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', e => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        if (draggedCard && slot.children.length === 0) {
            slot.appendChild(draggedCard);
            validateStack();
        }
    });
});

// Evento de Drop para o banco de funções (apenas para rato).
functionsBank.addEventListener('dragover', e => e.preventDefault());
functionsBank.addEventListener('drop', e => {
    e.preventDefault();
    if (draggedCard) {
        functionsBank.appendChild(draggedCard);
        validateStack();
    }
});

// -----------------------------------------------------------------------------------
// 4. LÓGICA DE VALIDAÇÃO (HIERÁRQUICA E CORRETA)
// -----------------------------------------------------------------------------------
const getAxis = (func) => functionDetails[func]?.axis || null;

function validateStack() {
    clearResults();
    const stack = Array.from(slots).map(slot => slot.children.length > 0 ? slot.children[0].dataset.function : null);
    const filledStack = stack.filter(f => f);
    if (filledStack.length === 0) return;

    // REGRA 1: COERÊNCIA DE EIXOS (A mais importante)
    const pAxes = new Set(filledStack.filter(f => functionDetails[f].family === 'Perception').map(getAxis));
    const jAxes = new Set(filledStack.filter(f => functionDetails[f].family === 'Judging').map(getAxis));

    if (pAxes.size > 1) {
        displayMessage('Conflito de Eixo: A pilha mistura funções de percepção dos eixos Ne/Si e Ni/Se.', 'error');
        return;
    }
    if (jAxes.size > 1) {
        displayMessage('Conflito de Eixo: A pilha mistura funções de julgamento dos eixos Te/Fi e Ti/Fe.', 'error');
        return;
    }

    const [dom, aux, ter, inf] = stack;

    // REGRA 2: DUPLA PRINCIPAL
    if (dom && aux) {
        if (functionDetails[dom].family === functionDetails[aux].family) {
            displayMessage(`Par Principal Inválido: A dupla (${dom}, ${aux}) deve ter uma função de percepção (N/S) e uma de julgamento (T/F).`, 'error');
            return;
        }
    }

    // REGRA 3: FUNÇÃO TERCIÁRIA
    if (dom && aux && ter) {
        if (ter !== functionOpposites[aux]) {
            displayMessage(`Função Terciária Inválida: A terciária (${ter}) deve ser a oposta da auxiliar (${aux}). O correto seria ${functionOpposites[aux]}.`, 'error');
            return;
        }
    }
    
    // REGRA 4: FUNÇÃO INFERIOR E BUSCA FINAL
    if (dom && aux && ter && inf) {
        if (inf !== functionOpposites[dom]) {
            displayMessage(`Função Inferior Inválida: A inferior (${inf}) deve ser a oposta da dominante (${dom}). O correto seria ${functionOpposites[dom]}.`, 'error');
            return;
        }
        for (const type in mbtiData) {
            if (JSON.stringify(mbtiData[type].stack) === JSON.stringify(stack)) {
                displayResult(type, mbtiData[type].examples);
                return;
            }
        }
        displayMessage('Esta sequência, embora siga as regras, não corresponde a um tipo MBTI conhecido.', 'error');
    }
}

// -----------------------------------------------------------------------------------
// 5. FUNÇÕES AUXILIARES
// -----------------------------------------------------------------------------------
function displayMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = 'message-box';
    messageBox.classList.add(type, 'show');
}

function clearResults() {
    messageBox.classList.remove('show');
    mbtiTypeElement.textContent = 'Aguardando...';
    mbtiTypeElement.classList.add('mbti-type-placeholder');
    const h3 = exampleArea.querySelector('h3');
    if (h3) exampleArea.innerHTML = h3.outerHTML; else exampleArea.innerHTML = '<h3>Exemplos de Personalidades:</h3>';
}

function displayResult(type, examples) {
    mbtiTypeElement.textContent = type;
    mbtiTypeElement.classList.remove('mbti-type-placeholder');
    const h3 = exampleArea.querySelector('h3');
    if (h3) exampleArea.innerHTML = h3.outerHTML; else exampleArea.innerHTML = '<h3>Exemplos de Personalidades:</h3>';
    examples.forEach(example => {
        const link = document.createElement('a');
        link.href = example.url;
        link.textContent = example.name;
        link.target = '_blank';
        exampleArea.appendChild(link);
    });
}

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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') { document.body.classList.add('dark-mode'); }
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
}

