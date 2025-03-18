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

// Inicializar arrays y objetos
let missions = [];
let inventory = [];
let equipment = {
    weapon: null, armor: null, accessory: null
};
let character = {
    level: 1, xp: 0, lastXPGained: 0
};

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
// Función para generar una recompensa aleatoria
function getRandomReward() {
    const rewards = [
        {
            type: 'xp', value: parseInt(Math.random() * 100) + 50, rarity: 'common'
        },
        {
            type: 'item', name: 'Espada de Hierro', slot: 'weapon', rarity: 'common'
        },
        {
            type: 'item', name: 'Escudo de Plata', slot: 'weapon', rarity: 'rare'
        },
        {
            type: 'item', name: 'Armadura de Dragón', slot: 'armor', rarity: 'epic'
        },
        {
            type: 'item', name: 'Martillo del Trueno', slot: 'weapon', rarity: 'legendary'
        },
        {
            type: 'item', name: 'Anillo de Poder', slot: 'accessory', rarity: 'rare'
        },
    ];
    const random = Math.random();
    if (random < 0.6) return rewards[
        0
    ];
    else if (random < 0.9) return rewards[
        1
    ];
    else if (random < 0.98) return rewards[
        2
    ];
    else return rewards[
        3
    ];
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
// Función para actualizar la interfaz
function updateUI() {
    characterLevel.textContent = character.level;
    characterXP.textContent = character.xp;
    lastXPGained.textContent = `+${character.lastXPGained
        } XP`;

    const requiredXP = getRequiredXP(character.level);
    document.getElementById('required-xp').textContent = requiredXP;

    missionsList.innerHTML = '';
    missions.forEach((mission, index) => {
        const rewardText = mission.reward.type === 'xp'
            ? `${mission.reward.value
            } XP`
            : `${mission.reward.name
            } (${mission.reward.rarity
            })`;

        const missionElement = document.createElement('div');
        missionElement.className = 'mission';
        missionElement.innerHTML = `
            <p><strong>[${character.level
            }
    ] ${mission.name
            }</strong></p>
            <p style="margin-left: 20px;">${mission.description
            }</p>
            <p style="margin-left: 20px;"><em>Recompensa: ${rewardText
            }</em></p>
            <button class="complete-button" data-index="${index}">Completar</button>
        `;
        missionsList.appendChild(missionElement);
    });

    document.querySelectorAll('.complete-button').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            completeMission(index);
        });
    });

    inventoryList.innerHTML = '';
    inventory.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <p>${item.name
            } (${item.rarity
            })</p>
            <button class="equip-button" data-index="${index}">Equipar</button>
        `;
        inventoryList.appendChild(itemElement);
    });

    document.querySelectorAll('.equip-button').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            equipItem(inventory[index
            ]);
        });
    });

    equipmentList.innerHTML = '';
    for (const slot in equipment) {
        if (equipment[slot
        ]) {
            const slotElement = document.createElement('div');
            slotElement.className = 'equipment-slot';
            slotElement.innerHTML = `
                <p>${slot
                }: ${equipment[slot
                ].name
                } (${equipment[slot
                ].rarity
                })</p>
                <button class="unequip-button" data-slot="${slot}">Desequipar</button>
            `;
            equipmentList.appendChild(slotElement);
        }
    }

    document.querySelectorAll('.unequip-button').forEach(button => {
        button.addEventListener('click', () => {
            const slot = button.getAttribute('data-slot');
            equipment[slot
            ] = null;
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
            name: missionName, description: missionDescription, reward
        });

        updateUI();
        saveState(); // Guardar el estado después de añadir una misión
        missionNameInput.value = '';
        missionDescriptionInput.value = '';
        missionModal.style.display = 'none';
    }
});

// Inicializar la interfaz
updateUI();