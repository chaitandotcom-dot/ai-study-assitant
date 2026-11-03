
const notesInput = document.getElementById('notesInput');
const charCount = document.getElementById('charCount');
const inputWarning = document.getElementById('inputWarning');
const themeToggle = document.getElementById('themeToggle');

notesInput.addEventListener('input', () => {
    const length = notesInput.value.length;

    charCount.textContent = `${length} / 15000 characters`;

    if (length > 14000) {
        inputWarning.textContent = 'You are approaching the character limit.';
    } else {
        inputWarning.textContent = '';
    }
});

const savedTheme = localStorage.getItem('studymate_theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀';
} else {
    themeToggle.textContent = '☾';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    const isDark = document.body.classList.contains('dark-theme');

    localStorage.setItem('studymate_theme', isDark ? 'dark' : 'light');

    themeToggle.textContent = isDark ? '☀' : '☾';
});



const settingsToggle = document.getElementById('settingsToggle');
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const apiKeyStatus = document.getElementById('apiKeyStatus');

settingsToggle.addEventListener('click', () => {
    settingsOverlay.hidden = false;
});

closeSettingsBtn.addEventListener('click', () => {
    settingsOverlay.hidden = true;
});

settingsOverlay.addEventListener('click', (event) => {
    if (event.target === settingsOverlay) {
        settingsOverlay.hidden = true;
    }
});

apiKeyInput.value = localStorage.getItem('studymate_api_key') || '';

saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        apiKeyStatus.textContent = 'Please enter your API key.';
        apiKeyStatus.style.color = 'var(--danger)';
        return;
    }

    try {
        localStorage.setItem('studymate_api_key', apiKey);
        apiKeyStatus.textContent = 'API key saved successfully.';
        apiKeyStatus.style.color = 'var(--accent)';
    } catch (error) {
        apiKeyStatus.textContent = 'Unable to save your API key.';
        apiKeyStatus.style.color = 'var(--danger)';
    }
});



const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = {
    summary: document.getElementById('summaryTab'),
    quiz: document.getElementById('quizTab'),
    flashcards: document.getElementById('flashcardsTab')
};

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedTab = button.dataset.tab;

        tabButtons.forEach(tab => {
            tab.classList.remove('active');
        });

        button.classList.add('active');

        Object.entries(tabContents).forEach(([name, content]) => {
            content.hidden = name !== selectedTab;
            content.classList.toggle('active', name === selectedTab);
        });
    });
});



const toast = document.getElementById('toast');

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}



document.querySelectorAll('.headline-word').forEach(word => {
    const english = word.textContent.trim();
    const hindi = word.dataset.hi;

    word.innerHTML = `
        <span class="word-face word-en">${english}</span>
        <span class="word-face word-hi">${hindi}</span>
    `;

    word.addEventListener('mouseenter', () => {
        word.classList.add('is-hindi');
    });

    word.addEventListener('mouseleave', () => {
        word.classList.remove('is-hindi');
    });

    word.addEventListener('click', () => {
        word.classList.toggle('is-hindi');
    });

    word.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            word.classList.toggle('is-hindi');
        }
    });

    word.setAttribute('tabindex', '0');
});
