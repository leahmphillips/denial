(() => {
    const chanceEl = document.getElementById('chance');
    const daysEl = document.getElementById('days');
    const rollBtn = document.getElementById('roll');
    const unknownEl = document.getElementById('unknown');
    const successEl = document.getElementById('success');
    const deniedEl = document.getElementById('denied');
    const addDaysPointsBtn = document.getElementById('addDaysPoints');
    const addPointsBtn = document.getElementById('addPoints');
    const addPointsInput = document.getElementById('addPointsInput');

    const roll = () => Math.floor(Math.random() * 100) + 1;

    const saveChance = () => localStorage.setItem('denial-chance', window.chance);
    const loadChance = () => {
        const result = localStorage.getItem('denial-chance');
        if(result) {
            window.chance = result;
        } else {
            window.chance = 50;
            saveChance();
        }
        showChance();
    };
    const showChance = () => chanceEl.innerHTML = window.chance + '%';
    const clampChance = () => window.chance = (window.chance > 100 ? 100 : (window.chance < 0 ? 0 : window.chance));

    const rollForRelease = () => {
        const result = roll() <= window.chance;
        if(result) {
            unknownEl.classList.remove('show-it');
            successEl.classList.add('show-it');
            deniedEl.classList.remove('show-it');
        } else {
            unknownEl.classList.remove('show-it');
            successEl.classList.remove('show-it');
            deniedEl.classList.add('show-it');
        }
        return result;
    };
    const handleRelease = () => {
        window.chance -= 10;
        clampChance();
        saveChance();
    };

    const saveDays = () => localStorage.setItem('denial-days', window.days);
    const loadDays = () => {
        const result = localStorage.getItem('denial-days');
        if(result) {
            window.days = result;
        } else {
            window.days = 0;
            saveDays();
        }
        showDays();
    };
    const showDays = () => daysEl.innerHTML = window.days;
    const handleDays = () => {
        window.days++;
    };

    loadChance();
    loadDays();
    rollBtn.addEventListener('click', () => {
        const result = rollForRelease();
        if(result) {
            handleRelease();
        }
        handleDays();
        showChance();
        showDays();
    });
    addDaysPointsBtn.addEventListener('click', () => {
        window.days = 0;
        saveDays();
        showDays();
        window.chance += 5;
        clampChance();
        saveChance();
        showChance();
    });
    addPointsBtn.addEventListener('click', () => {
        window.chance += Number(addPointsInput.value);
        clampChance();
        saveChance();
        showChance();
    });
})();
