document.addEventListener('DOMContentLoaded', () => {
    // Datos iniciales
    let missions = [];
    let inventory = [];
    let equipment = {
        weapon: null, // Arma equipada
        armor: null,  // Armadura equipada
        accessory: null // Accesorio equipado
    };
    let character = { level: 1, xp: 0, lastXPGained: 0 };

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

    // Función para generar una recompensa aleatoria
    function getRandomReward() {
        const rewards = [
            { type: 'xp', value: parseInt(Math.random() * 100), rarity: 'common' },
            { type: 'item', name: 'Espada de Hierro', slot: 'weapon', rarity: 'common' },
            { type: 'item', name: 'Escudo de Plata', slot: 'weapon', rarity: 'rare' },
            { type: 'item', name: 'Armadura de Dragón', slot: 'armor', rarity: 'epic' },
            { type: 'item', name: 'Martillo del Trueno', slot: 'weapon', rarity: 'legendary' },
            { type: 'item', name: 'Anillo de Poder', slot: 'accessory', rarity: 'rare' },
        ];
        const random = Math.random();
        if (random < 0.6) return rewards[0]; // 60% XP
        else if (random < 0.9) return rewards[1]; // 30% Ítem común
        else if (random < 0.98) return rewards[2]; // 8% Ítem raro
        else return rewards[3]; // 2% Ítem épico o legendario
    }

    // Función para completar una misión
    function completeMission(index) {
        const reward = getRandomReward();
        if (reward.type === 'xp') {
            character.xp += reward.value;
            character.lastXPGained = reward.value; // Guardar el XP ganado
            if (character.xp >= 1000) {
                character.level += 1;
                character.xp = 0;
            }
        } else {
            inventory.push(reward);
        }
        missions.splice(index, 1); // Eliminar misión completada
        updateUI(); // Actualizar la interfaz
    }

    // Función para equipar un ítem
    function equipItem(item) {
        const slot = item.slot;
        if (equipment[slot]) {
            const confirmReplace = confirm(`¿Quieres reemplazar ${equipment[slot].name} por ${item.name}?`);
            if (!confirmReplace) return;
        }
        equipment[slot] = item; // Equipar el ítem
        updateUI(); // Actualizar la interfaz
    }

    // Función para actualizar la interfaz
    function updateUI() {
        // Actualizar información del personaje
        characterLevel.textContent = character.level;
        characterXP.textContent = character.xp;
        lastXPGained.textContent = `+${character.lastXPGained} XP`; // Formato: +<XP> XP

        // Actualizar lista de misiones
        missionsList.innerHTML = '';
        missions.forEach((mission, index) => {
            const missionElement = document.createElement('div');
            missionElement.className = 'mission';
            missionElement.innerHTML = `
                <p><strong>${mission.name}</strong></p>
                <p>${mission.description}</p>
                <button class="complete-button" data-index="${index}">Completar</button>
            `;
            missionsList.appendChild(missionElement);
        });

        // Asignar eventos a los botones "Completar"
        document.querySelectorAll('.complete-button').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                completeMission(index);
            });
        });

        // Actualizar inventario
        inventoryList.innerHTML = '';
        inventory.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <p>${item.name} (${item.rarity})</p>
                <button class="equip-button" data-index="${index}" style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 12px;">Equipar</button>
            `;
            inventoryList.appendChild(itemElement);
        });

        // Asignar eventos a los botones "Equipar"
        document.querySelectorAll('.equip-button').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                equipItem(inventory[index]);
            });
        });

        // Actualizar equipamiento
        equipmentList.innerHTML = '';
        for (const slot in equipment) {
            if (equipment[slot]) {
                const slotElement = document.createElement('div');
                slotElement.className = 'equipment-slot';
                slotElement.innerHTML = `
                    <p>${slot}: ${equipment[slot].name} (${equipment[slot].rarity})</p>
                    <button class="unequip-button" data-slot="${slot}">Desequipar</button>
                `;
                equipmentList.appendChild(slotElement);
            }
        }

        // Asignar eventos a los botones "Desequipar"
        document.querySelectorAll('.unequip-button').forEach(button => {
            button.addEventListener('click', () => {
                const slot = button.getAttribute('data-slot');
                equipment[slot] = null; // Desequipar el ítem
                updateUI(); // Actualizar la interfaz
            });
        });
    }

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
            missions.push({ name: missionName, description: missionDescription });
            updateUI();
            missionNameInput.value = ''; // Limpiar el campo de nombre
            missionDescriptionInput.value = ''; // Limpiar el campo de descripción
            missionModal.style.display = 'none'; // Ocultar el modal
        }
    });

    // Inicializar la interfaz
    updateUI();
});