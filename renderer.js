// Elementos del DOM
const missionsList = document.getElementById('missions-list');
const addMissionButton = document.getElementById('add-mission');
const inventoryList = document.getElementById('inventory');
const equipmentList = document.getElementById('equipment');
const missionModal = document.getElementById('mission-modal');
const missionNameInput = document.getElementById('mission-name');
const missionDescriptionInput = document.getElementById('mission-description');
const submitMissionButton = document.getElementById('submit-mission');
const closeModal = document.querySelector('.close');
const characterLevel = document.getElementById('character-level');
const characterXP = document.getElementById('character-xp');
const lastXPGained = document.getElementById('last-xp-gained');
const settingsButton = document.getElementById('settings-button');
const languageButton = document.getElementById('language-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsModal = document.querySelector('.close-settings');
const languageModal = document.getElementById('language-modal');
const closeLanguageModal = document.querySelector('.close-language');
const languageSpanishButton = document.getElementById('language-spanish');
const languageEnglishButton = document.getElementById('language-english');

var auxiliarString = "";
// Inicializar arrays y objetos
let missions = [];
let inventory = [];
let equipment = {
    weapon: null, armor: null, accessory: null
};
let character = {
    level: 1, xp: 0, lastXPGained: 0
};


let texts = {};

async function loadTexts() {
    const response = await fetch('languages.json');
    texts = await response.json();
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        changeLanguage(savedLanguage);
    } else {
        updateUI();
    }
}

loadTexts();

function changeLanguage(language) {
    localStorage.setItem('selectedLanguage', language); // Save selected language
    // Actualizar textos en la interfaz
    document.getElementById('settings-button').textContent = texts[language].settings;
    document.querySelector('h1').textContent = texts[language].missions;
    document.getElementById('add-mission').textContent = texts[language].addMission;
    document.querySelector('h2:nth-of-type(1)').textContent = texts[language].inventory;
    document.querySelector('h2:nth-of-type(2)').textContent = texts[language].equipment;
    document.querySelector('#mission-modal h2').textContent = texts[language].addMissionModalTitle;
    document.getElementById('mission-name').placeholder = texts[language].missionNamePlaceholder;
    document.getElementById('mission-description').placeholder = texts[language].missionDescriptionPlaceholder;
    document.getElementById('submit-mission').textContent = texts[language].submitMission;
    document.querySelector('#language-modal h2').textContent = texts[language].selectLanguage;
    document.getElementById('reset-data').textContent = texts[language].resetData;
    document.getElementById('language-button').textContent = texts[language].language;
    document.querySelector('#settings-modal h2').textContent = texts[language].settings;
    document.querySelector('#language-modal h2').textContent = texts[language].selectLanguage;
    document.getElementById('language-spanish').textContent = texts[language].spanish;
    document.getElementById('language-english').textContent = texts[language].english;

    // Update character info texts
    document.getElementById('character-level-text').textContent = texts[language].level + ":";
    document.getElementById('character-xp-text').textContent = texts[language].experience + ":";
    document.getElementById('required-xp-text').textContent = texts[language].requiredXP + ":";

    document.querySelectorAll('.abandon-button').forEach(button => {
        button.textContent = texts[language].abandon;
    });
    document.querySelectorAll('.complete-button').forEach(button => {
        button.textContent = texts[language].complete;
    });
    document.querySelectorAll('.equip-button').forEach(button => {
        button.textContent = texts[language].equip;
    });
    document.querySelectorAll('.unequip-button').forEach(button => {
        button.textContent = texts[language].unequip;
    });
    auxiliarString = texts[language].requiredXP + ":";
    updateUI(); // Ensure UI is updated with new language
}

function parseTextToHTML(text) {
    // Dividir el texto en líneas
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let html = '';
    let inList = false; // Para controlar si estamos dentro de una lista
    let paragraphIndex = 0; // Para llevar un índice de los párrafos

    // Colores predefinidos para los párrafos (contrastantes con fondo gris)
    const colors = [
        '#FFD700', // Dorado
        '#87CEEB', // Azul claro
        '#98FB98', // Verde pastel
        '#FFA07A', // Salmón
        '#DDA0DD', // Ciruela
        '#FF6347', // Tomate
    ];

    lines.forEach(line => {
        // Detectar si la línea es un título (termina con ":")
        if (line.endsWith(':')) {
            html += `<h2>${line}</h2>\n`;
        }
        // Detectar si la línea es un elemento de lista (comienza con "-" o es un objetivo)
        else if (line.startsWith('-') || /^\d+\./.test(line) || line.startsWith('Recolectar')) {
            if (!inList) {
                html += '<ul>\n'; // Abrir la lista si no está abierta
                inList = true;
            }
            html += `<li>${line.replace(/^- /, '').replace(/^\d+\. /, '')}</li>\n`; // Eliminar el guion o número inicial
        }
        // Si no es un título ni un elemento de lista, es un párrafo
        else {
            if (inList) {
                html += '</ul>\n'; // Cerrar la lista si estaba abierta
                inList = false;
            }
            // Asignar un color basado en el índice del párrafo
            const color = colors[paragraphIndex % colors.length]; // Ciclo de colores
            html += `<p style="color: ${color};">${line}</p>\n`;
            paragraphIndex++; // Incrementar el índice de párrafos
        }
    });

    // Cerrar la lista si el texto termina con una lista
    if (inList) {
        html += '</ul>\n';
    }

    return html;
}


// Función para guardar el estado en localStorage
function saveState() {
    const state = {
        missions,
        inventory,
        equipment,
        character,
    };
    localStorage.setItem('questyState', JSON.stringify(state));
}
// Función para cargar el estado desde localStorage
function loadState() {
    const savedState = localStorage.getItem('questyState');
    if (savedState) {
        const state = JSON.parse(savedState);
        missions = state.missions || [];
        inventory = state.inventory || [];
        equipment = state.equipment || {
            weapon: null, armor: null, accessory: null
        };
        character = state.character || {
            level: 1, xp: 0, lastXPGained: 0
        };
    }
}
// Función para calcular la experiencia requerida para el siguiente nivel
function getRequiredXP(level) {
    return 100 * Math.pow(2.5, level - 1);
}

let rewards = []; // Variable global para almacenar las recompensas

// Función para cargar las recompensas desde el archivo JSON
async function loadRewards() {
    try {
        const response = await fetch('rewards.json');
        rewards = await response.json();
    } catch (error) {
        console.error('Error al cargar las recompensas:', error);
    }
}

// Llamar a la función para cargar las recompensas al iniciar la aplicación
loadRewards().then(() => {
    console.log('Recompensas cargadas:', rewards);
});

// Función para generar una recompensa aleatoria
function getRandomReward() {
    if (rewards.length === 0) {
        console.error('No se han cargado las recompensas.');
        return null;
    }

    const random = Math.random();
    let selectedReward;

    if (random < 0.6) {
        // 60% de probabilidad: XP
        selectedReward = rewards.find(reward => reward.type === 'xp');
        if (selectedReward) {
            selectedReward.value = parseInt(Math.random() * 100) + 50; // Generar valor aleatorio de XP
        }
    } else if (random < 0.9) {
        // 30% de probabilidad: Ítem común
        selectedReward = rewards.find(reward => reward.type === 'item' && reward.rarity === 'common');
    } else if (random < 0.98) {
        // 8% de probabilidad: Ítem raro
        selectedReward = rewards.find(reward => reward.type === 'item' && reward.rarity === 'rare');
    } else {
        // 2% de probabilidad: Ítem épico o legendario
        selectedReward = rewards.find(reward => reward.type === 'item' && (reward.rarity === 'epic' || reward.rarity === 'legendary'));
    }

    return selectedReward || rewards[0]; // Si no se encuentra ninguna recompensa, devolver la primera
}

// Función para completar una misión
function completeMission(index) {
    const reward = missions[index
    ].reward;

    if (reward.type === 'xp') {
        character.xp += reward.value;
        character.lastXPGained = reward.value;

        const requiredXP = getRequiredXP(character.level);
        if (character.xp >= requiredXP) {
            character.level += 1;
            character.xp = 0;
            alert(`¡Felicidades! Has alcanzado el nivel ${character.level
                }.`);
        }
    } else {
        inventory.push(reward);
    }

    missions.splice(index,
        1);
    updateUI();
    saveState(); // Guardar el estado después de completar una misión
}
// Función para equipar un ítem
function equipItem(item) {
    const slot = item.slot;
    if (equipment[slot
    ]) {
        const confirmReplace = confirm(`¿Quieres reemplazar ${equipment[slot
        ].name
            } por ${item.name
            }?`);
        if (!confirmReplace) return;
    }
    equipment[slot
    ] = item;
    updateUI();
    saveState(); // Guardar el estado después de equipar un ítem
}

// Función para reiniciar los datos
function resetData() {
    // Borrar los datos de localStorage
    localStorage.removeItem('questyState');

    // Reiniciar el estado de la aplicación
    missions = [];
    inventory = [];
    equipment = { weapon: null, armor: null, accessory: null };
    character = { level: 1, xp: 0, lastXPGained: 0 };

    // Actualizar la interfaz
    updateUI();

    // Mostrar un mensaje de confirmación
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    alert(texts[selectedLanguage].dataReset);
}

languageSpanishButton.addEventListener('click', () => {
    changeLanguage('es');
    alert("Idioma cambiado a Español");
    languageModal.style.display = 'none';
});

languageEnglishButton.addEventListener('click', () => {
    changeLanguage('en');
    alert("Language changed to English");
    languageModal.style.display = 'none';
});

// Asignar evento al botón de configuración
settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

// Ocultar el modal de configuración al hacer clic en la "X"
closeSettingsModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Mostrar el modal de selección de idioma al hacer clic en el botón de idioma
languageButton.addEventListener('click', () => {
    languageModal.style.display = 'block';
});

// Ocultar el modal de selección de idioma al hacer clic en la "X"
closeLanguageModal.addEventListener('click', () => {
    languageModal.style.display = 'none';
});

// Mover el evento del botón de reinicio dentro del modal de configuración
document.getElementById('reset-data').addEventListener('click', () => {
    const confirmReset = confirm(texts[localStorage.getItem('selectedLanguage')].confirmReset);
    if (confirmReset) {
        resetData();
    }
});

// Función para actualizar la interfaz
function updateUI() {
    characterLevel.textContent = character.level;
    characterXP.textContent = character.xp;
    lastXPGained.textContent = `+${character.lastXPGained} XP`;

    const requiredXP = getRequiredXP(character.level);
    const requiredXPElement = document.getElementById('required-xp');
    if (requiredXPElement) {
        requiredXPElement.textContent = requiredXP;
    }

    // Update character info texts with real-time data
    document.getElementById('character-level-text').appendChild(characterLevel);
    document.getElementById('character-xp-text').appendChild(characterXP);
    document.getElementById('character-xp-text').appendChild(lastXPGained);
    document.getElementById('required-xp-text').textContent = auxiliarString + requiredXP;

    missionsList.innerHTML = '';
    missions.forEach((mission, index) => {
        const rewardText = mission.reward.type === 'xp'
            ? `${mission.reward.value} XP`
            : `${mission.reward.name} (${mission.reward.rarity})`;

        const missionElement = document.createElement('div');
        missionElement.className = 'mission';

        // Header de la misión (nivel, título y botón de comprimir/expandir)
        const missionHeader = document.createElement('div');
        missionHeader.className = 'mission-header';
        missionHeader.innerHTML = `
            <p><strong>[${character.level}] ${mission.name}</strong></p>
            <button class="toggle-button">${mission.collapsed ? '[+]' : '[-]'}</button>
        `;

        // Contenido de la misión (descripción, recompensa y botones)
        const missionContent = document.createElement('div');
        missionContent.className = `mission-content ${mission.collapsed ? 'collapsed' : 'expanded'}`;
        missionContent.innerHTML = `
            <p class="mission-description">${parseTextToHTML(mission.description)}</p>
            <p class="mission-reward"><em>${texts[localStorage.getItem('selectedLanguage')].reward}: ${rewardText}</em></p>
            <div class="mission-buttons">
            <button class="abandon-button" data-index="${index}">${texts[localStorage.getItem('selectedLanguage')].abandon}</button>
            <button class="complete-button" data-index="${index}">${texts[localStorage.getItem('selectedLanguage')].complete}</button>
            </div>
        `;

        // Agregar header y contenido al elemento de la misión
        missionElement.appendChild(missionHeader);
        missionElement.appendChild(missionContent);
        missionsList.appendChild(missionElement);

        // Evento para comprimir/expandir la misión
        const toggleButton = missionHeader.querySelector('.toggle-button');
        toggleButton.addEventListener('click', () => {
            mission.collapsed = !mission.collapsed; // Cambiar el estado
            missionContent.classList.toggle('collapsed');
            missionContent.classList.toggle('expanded');
            toggleButton.textContent = mission.collapsed ? '[+]' : '[-]';
            saveState(); // Guardar el estado después de cambiar
        });
    });

    // Resto del código de updateUI...
    inventoryList.innerHTML = '';
    inventory.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <p>${item.name} (${item.rarity})</p>
            <button class="equip-button" data-index="${index}">${texts[localStorage.getItem('selectedLanguage')].equip}</button>
        `;
        inventoryList.appendChild(itemElement);
    });

    document.querySelectorAll('.equip-button').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            equipItem(inventory[index]);
        });
    });

    equipmentList.innerHTML = '';
    for (const slot in equipment) {
        if (equipment[slot]) {
            const slotElement = document.createElement('div');
            slotElement.className = 'equipment-slot';
            slotElement.innerHTML = `
                <p>${slot}: ${equipment[slot].name} (${equipment[slot].rarity})</p>
                <button class="unequip-button" data-slot="${slot}">${texts[localStorage.getItem('selectedLanguage')].unequip}</button>
            `;
            equipmentList.appendChild(slotElement);
        }
    }

    document.querySelectorAll('.abandon-button').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            abandonMission(index);
        });
    });

    document.querySelectorAll('.complete-button').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            completeMission(index);
        });
    });

    document.querySelectorAll('.unequip-button').forEach(button => {
        button.addEventListener('click', () => {
            const slot = button.getAttribute('data-slot');
            equipment[slot] = null;
            updateUI();
            saveState(); // Guardar el estado después de desequipar un ítem
        });
    });
}
// Cargar el estado al iniciar la aplicación
loadState();

// Añadir misión
addMissionButton.addEventListener('click', () => {
    missionModal.style.display = 'block';
});

// Ocultar el modal al hacer clic en la "X"
closeModal.addEventListener('click', () => {
    missionModal.style.display = 'none';
});

// Añadir misión al hacer clic en "Añadir"
submitMissionButton.addEventListener('click', () => {
    const missionName = missionNameInput.value.trim();
    const missionDescription = missionDescriptionInput.value.trim();
    if (missionName) {
        const reward = getRandomReward();
        missions.push({
            name: missionName, description: missionDescription, reward,
            collapsed: true
        });

        updateUI();
        saveState(); // Guardar el estado después de añadir una misión
        missionNameInput.value = '';
        missionDescriptionInput.value = '';
        missionModal.style.display = 'none';
    }
});

// Función para abandonar una misión
function abandonMission(index) {
    const confirmAbandon = confirm(texts[localStorage.getItem('selectedLanguage')].confirmAbandon);
    if (confirmAbandon) {
        missions.splice(index, 1);
        updateUI();
        saveState(); // Guardar el estado después de abandonar una misión
    }
}

// Inicializar la interfaz
updateUI();