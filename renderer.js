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

document.addEventListener('DOMContentLoaded', () => {
    let missions = [];
    let inventory = [];
    let equipment = {
        weapon: null,
        armor: null,
        accessory: null
    };
    let character = { level: 1, xp: 0, lastXPGained: 0 };

    function getRequiredXP(level) {
        return 100 * Math.pow(2.5, level - 1);
    }

    function getRandomReward() {
        const rewards = [
            { type: 'xp', value: parseInt(Math.random() * 100) + 50, rarity: 'common' },
            { type: 'item', name: 'Espada de Hierro', slot: 'weapon', rarity: 'common' },
            { type: 'item', name: 'Escudo de Plata', slot: 'weapon', rarity: 'rare' },
            { type: 'item', name: 'Armadura de Dragón', slot: 'armor', rarity: 'epic' },
            { type: 'item', name: 'Martillo del Trueno', slot: 'weapon', rarity: 'legendary' },
            { type: 'item', name: 'Anillo de Poder', slot: 'accessory', rarity: 'rare' },
        ];
        const random = Math.random();
        if (random < 0.6) return rewards[0];
        else if (random < 0.9) return rewards[1];
        else if (random < 0.98) return rewards[2];
        else return rewards[3];
    }

    function completeMission(index) {
        const reward = missions[index].reward;

        if (reward.type === 'xp') {
            character.xp += reward.value;
            character.lastXPGained = reward.value;

            const requiredXP = getRequiredXP(character.level);
            if (character.xp >= requiredXP) {
                character.level += 1;
                character.xp = 0;
                alert(`¡Felicidades! Has alcanzado el nivel ${character.level}.`);
            }
        } else {
            inventory.push(reward);
        }

        missions.splice(index, 1);
        updateUI();
    }

    function equipItem(item) {
        const slot = item.slot;
        if (equipment[slot]) {
            const confirmReplace = confirm(`¿Quieres reemplazar ${equipment[slot].name} por ${item.name}?`);
            if (!confirmReplace) return;
        }
        equipment[slot] = item;
        updateUI();
    }

    function updateUI() {
        characterLevel.textContent = character.level;
        characterXP.textContent = character.xp;
        lastXPGained.textContent = `+${character.lastXPGained} XP`;

        const requiredXP = getRequiredXP(character.level);
        document.getElementById('required-xp').textContent = requiredXP;

        missionsList.innerHTML = '';
        missions.forEach((mission, index) => {
            const rewardText = mission.reward.type === 'xp'
                ? `${mission.reward.value} XP`
                : `${mission.reward.name} (${mission.reward.rarity})`;

            const missionElement = document.createElement('div');
            missionElement.className = 'mission';
            missionElement.innerHTML = `
                <p><strong>[${character.level}] ${mission.name}</strong></p>
                <p style="margin-left: 20px;">${mission.description}</p>
                <p style="margin-left: 20px;"><em>Recompensa: ${rewardText}</em></p>
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
                <p>${item.name} (${item.rarity})</p>
                <button class="equip-button" data-index="${index}">Equipar</button>
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
                    <button class="unequip-button" data-slot="${slot}">Desequipar</button>
                `;
                equipmentList.appendChild(slotElement);
            }
        }

        document.querySelectorAll('.unequip-button').forEach(button => {
            button.addEventListener('click', () => {
                const slot = button.getAttribute('data-slot');
                equipment[slot] = null;
                updateUI();
            });
        });
    }

    addMissionButton.addEventListener('click', () => {
        missionModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        missionModal.style.display = 'none';
    });

    submitMissionButton.addEventListener('click', () => {
        const missionName = missionNameInput.value.trim();
        const missionDescription = missionDescriptionInput.value.trim();
        if (missionName) {
            const reward = getRandomReward();
            missions.push({ name: missionName, description: missionDescription, reward });

            updateUI();
            missionNameInput.value = '';
            missionDescriptionInput.value = '';
            missionModal.style.display = 'none';
        }
    });

    updateUI();
});
